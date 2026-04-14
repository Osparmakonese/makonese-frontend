/**
 * POS tab-level session lock.
 *
 * Problem: if a cashier opens POS in two tabs (or two staff hit the same
 * cashier_session on the same register), sales can race — two receipts get
 * the same subtotal counted in daily_summary, stock deducts twice, etc.
 *
 * Strategy: localStorage acts as shared state across same-origin tabs. Each
 * live POS tab writes a heartbeat with its own random tabId. If an incoming
 * tab sees a heartbeat younger than HEARTBEAT_STALE_MS, it's locked out
 * (read-only mode). The owning tab renews its heartbeat every 2s and clears
 * the lock on beforeunload.
 *
 *   import { claimSessionLock } from './posSessionLock';
 *   const { isOwner, release, onChange } = claimSessionLock(sessionId);
 *
 *   if (!isOwner()) disable checkout buttons.
 *
 *   BroadcastChannel('pewil-pos-lock') also pings other tabs for faster
 *   handover (without waiting for heartbeat staleness).
 */

const KEY = (sid) => `pewil-pos-lock-${sid}`;
const CH  = 'pewil-pos-lock';
const HEARTBEAT_MS       = 2000;
const HEARTBEAT_STALE_MS = 6000;   // 3× heartbeat
const TAB_ID = (() => {
  try { return crypto.randomUUID(); }
  catch (_) { return 'tab-' + Math.random().toString(36).slice(2) + Date.now().toString(36); }
})();

function readLock(sid) {
  try {
    const raw = localStorage.getItem(KEY(sid));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch (_) { return null; }
}

function writeLock(sid, data) {
  try { localStorage.setItem(KEY(sid), JSON.stringify(data)); }
  catch (_) {}
}

function clearLock(sid, mineOnly = true) {
  try {
    if (mineOnly) {
      const cur = readLock(sid);
      if (cur && cur.tabId !== TAB_ID) return;
    }
    localStorage.removeItem(KEY(sid));
  } catch (_) {}
}

/**
 * Attempt to claim the lock for sessionId. Returns a controller.
 *   isOwner() → boolean
 *   release() → void   (clears if we own it)
 *   onChange(cb) → unsubscribe — cb(isOwner: boolean) fires when ownership flips
 */
export function claimSessionLock(sessionId) {
  if (!sessionId) {
    // Nothing to lock against; treat as owner but no-op.
    return { isOwner: () => true, release: () => {}, onChange: () => () => {}, tabId: TAB_ID };
  }

  let owned = false;
  const listeners = new Set();

  const fire = () => { listeners.forEach((cb) => { try { cb(owned); } catch (_) {} }); };

  const tryClaim = () => {
    const cur = readLock(sessionId);
    const now = Date.now();
    const stale = !cur || (now - (cur.heartbeat || 0) > HEARTBEAT_STALE_MS);
    if (!cur || stale || cur.tabId === TAB_ID) {
      writeLock(sessionId, { tabId: TAB_ID, heartbeat: now });
      if (!owned) { owned = true; fire(); }
    } else {
      if (owned) { owned = false; fire(); }
    }
  };

  tryClaim();

  const hbTimer = setInterval(tryClaim, HEARTBEAT_MS);

  // Cross-tab announcements for faster awareness.
  let ch = null;
  try {
    ch = new BroadcastChannel(CH);
    ch.onmessage = (ev) => {
      if (!ev?.data || ev.data.sessionId !== sessionId) return;
      if (ev.data.type === 'claim' && ev.data.tabId !== TAB_ID) {
        // Another tab is claiming — re-evaluate quickly.
        setTimeout(tryClaim, 50);
      }
      if (ev.data.type === 'release' && ev.data.tabId !== TAB_ID) {
        setTimeout(tryClaim, 50);
      }
    };
    ch.postMessage({ type: 'claim', sessionId, tabId: TAB_ID });
  } catch (_) { /* Safari private mode etc. */ }

  // Storage events (other tab wrote to localStorage).
  const onStorage = (e) => {
    if (e.key === KEY(sessionId)) tryClaim();
  };
  try { window.addEventListener('storage', onStorage); } catch (_) {}

  // Best-effort cleanup on close.
  const onUnload = () => {
    clearLock(sessionId, true);
    try { ch?.postMessage({ type: 'release', sessionId, tabId: TAB_ID }); } catch (_) {}
  };
  try { window.addEventListener('beforeunload', onUnload); } catch (_) {}

  const release = () => {
    clearInterval(hbTimer);
    try { window.removeEventListener('storage', onStorage); } catch (_) {}
    try { window.removeEventListener('beforeunload', onUnload); } catch (_) {}
    clearLock(sessionId, true);
    try { ch?.postMessage({ type: 'release', sessionId, tabId: TAB_ID }); } catch (_) {}
    try { ch?.close(); } catch (_) {}
    owned = false;
    fire();
  };

  return {
    isOwner: () => owned,
    release,
    onChange: (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    tabId: TAB_ID,
  };
}

export default claimSessionLock;
