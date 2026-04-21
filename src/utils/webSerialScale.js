/**
 * webSerialScale.js — Web Serial API driver for retail POS scales.
 *
 * Why Web Serial:
 *   Supermarket scales (CAS PD-II, Aclas PS1X, Avery Berkel 6712, etc.)
 *   speak simple ASCII over RS-232/USB at 9600 8N1. Chromium-based browsers
 *   expose this directly via navigator.serial — no drivers, no backend.
 *   Firefox and Safari do NOT support Web Serial. Callers must handle the
 *   `isSupported()` check and fall back to manual weight entry.
 *
 * Protocol handled here — "CAS-style ASCII continuous stream":
 *   One frame per line, terminated by CR (\r) or LF (\n). Typical frames:
 *     "ST,GS,   1.234kg"     — stable, gross, 1.234 kg
 *     "US,GS,   0.000kg"     — unstable (in motion)
 *     "ST,NT,   0.500kg"     — stable, net
 *   Some scales emit simpler lines like "1.234 kg\r\n" or raw " 1.234".
 *   We accept either shape: we extract the first number followed by an
 *   optional kg/g/lb suffix. Anything else is ignored.
 *
 * Usage (imperative):
 *   const scale = await connectScale();           // user picks port in chooser
 *   const stop = scale.onReading((r) => { ... }); // r = { weight, unit, stable }
 *   // later:
 *   stop();
 *   await scale.disconnect();
 *
 * Or one-shot, for the weight modal:
 *   const { weight, unit } = await readOneStableWeight(scale, { timeoutMs: 8000 });
 *
 * The returned weight is always normalised to **kilograms** for downstream
 * math. `unit` records what the scale reported, for display/debug.
 */

// Sensible defaults — most Zimbabwe supermarket scales ship at 9600 8N1.
// Callers can override via connectScale({ baudRate: 4800 }) etc.
const DEFAULT_PORT_OPTS = {
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  flowControl: 'none',
};

// How long we keep the in-memory buffer before giving up on a malformed frame.
const MAX_BUFFER = 256;

export function isSupported() {
  return typeof navigator !== 'undefined' && 'serial' in navigator;
}

/**
 * Ask the browser to show its port chooser and open the selected port.
 * Must be called from a user gesture (click) — browsers enforce that.
 */
export async function connectScale(opts = {}) {
  if (!isSupported()) {
    const err = new Error('Web Serial is not supported in this browser. Use Chrome or Edge on desktop.');
    err.code = 'NOT_SUPPORTED';
    throw err;
  }

  // Let the user pick which USB serial device is the scale.
  const port = await navigator.serial.requestPort({});
  await port.open({ ...DEFAULT_PORT_OPTS, ...opts });

  const decoder = new TextDecoderStream();
  const readableClosed = port.readable.pipeTo(decoder.writable);
  const reader = decoder.readable.getReader();

  // Keep the readable promise alive so the decoder doesn't GC; the value is consumed during disconnect.
  // eslint-disable-next-line no-unused-vars
  const _keepAlive = readableClosed.catch(() => {});

  let buffer = '';
  const listeners = new Set();
  let running = true;

  const pump = async () => {
    while (running) {
      try {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;
        buffer += value;
        if (buffer.length > MAX_BUFFER) {
          // Scale went mute mid-frame; resync.
          buffer = buffer.slice(-MAX_BUFFER);
        }

        // Split on CR or LF; keep the trailing partial in the buffer.
        const parts = buffer.split(/[\r\n]+/);
        buffer = parts.pop() ?? '';
        for (const raw of parts) {
          const parsed = parseFrame(raw);
          if (!parsed) continue;
          for (const fn of listeners) {
            try { fn(parsed); } catch (_) { /* listener errors must not kill the pump */ }
          }
        }
      } catch (_) {
        // Device unplugged mid-read, or the port was closed. Stop the loop;
        // the caller's disconnect() is idempotent.
        break;
      }
    }
  };
  pump();

  return {
    port,
    /**
     * Subscribe to readings. Returns an unsubscribe function.
     * Reading shape: { weight: Number (kg), unit: 'kg'|'g'|'lb'|'', stable: Bool, raw: String }
     */
    onReading(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    async disconnect() {
      running = false;
      listeners.clear();
      try { await reader.cancel(); } catch (_) {}
      try { reader.releaseLock(); } catch (_) {}
      try { await port.close(); } catch (_) {}
    },
  };
}

/**
 * Parse a single raw ASCII frame into { weight, unit, stable, raw }, or null
 * if the frame wasn't a weight line.
 *
 * Kept exported for unit-testability.
 */
export function parseFrame(raw) {
  if (!raw) return null;
  const s = raw.trim();
  if (!s) return null;

  // CAS-style "ST,GS,   1.234kg" — split on comma.
  let stable = true;  // Default: assume stable if protocol doesn't say otherwise.
  let numberRegion = s;
  if (s.includes(',')) {
    const parts = s.split(',').map((p) => p.trim());
    // First field is status: ST(able) / US(table) / OL (overload).
    const status = parts[0].toUpperCase();
    if (status === 'US') stable = false;
    if (status === 'OL') return { weight: 0, unit: '', stable: false, raw: s, overload: true };
    numberRegion = parts[parts.length - 1];  // weight always last field.
  }

  // Extract a signed decimal + optional unit suffix.
  const m = numberRegion.match(/(-?\d+(?:\.\d+)?)\s*(kg|g|lb)?/i);
  if (!m) return null;
  const value = parseFloat(m[1]);
  if (Number.isNaN(value)) return null;
  const unit = (m[2] || '').toLowerCase();

  // Normalise to kg for downstream math — scales sometimes report grams.
  let weightKg;
  if (unit === 'g') weightKg = value / 1000;
  else if (unit === 'lb') weightKg = value * 0.45359237;
  else weightKg = value; // kg, or no unit (assume kg).

  return { weight: weightKg, unit: unit || 'kg', stable, raw: s };
}

/**
 * Resolve with the first stable, non-zero weight, or reject on timeout.
 * Callers use this from the WeightModal "capture" button.
 */
export function readOneStableWeight(scale, { timeoutMs = 8000, minKg = 0.005 } = {}) {
  return new Promise((resolve, reject) => {
    let done = false;
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      unsub();
      reject(new Error('Timed out waiting for a stable reading.'));
    }, timeoutMs);

    const unsub = scale.onReading((r) => {
      if (done) return;
      if (r.overload) {
        done = true;
        clearTimeout(timer);
        unsub();
        reject(new Error('Scale reports overload — remove item and try again.'));
        return;
      }
      if (r.stable && r.weight >= minKg) {
        done = true;
        clearTimeout(timer);
        unsub();
        resolve({ weight: r.weight, unit: r.unit });
      }
    });
  });
}

export default { isSupported, connectScale, readOneStableWeight, parseFrame };
