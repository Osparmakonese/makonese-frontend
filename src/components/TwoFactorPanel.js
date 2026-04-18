import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';

/*
 * TwoFactorPanel
 * ──────────────
 * Owns the 2FA lifecycle inside Settings > Security:
 *   1. Disabled  → "Enable 2FA" CTA
 *   2. Setup     → Shows QR + secret, user types 6-digit code to confirm
 *   3. Enabled   → Shows status + "Disable 2FA" + "Regenerate recovery codes"
 *
 * Recovery codes surface exactly once (on first enable or on regen), with a
 * "Download .txt" button. After dismissal the codes are server-only.
 *
 * Style tokens are passed in as props so the panel matches Design 3 perfectly
 * and keeps Settings.js as the single source of truth for tokens/styles.
 */
export default function TwoFactorPanel({ C, SERIF, SANS, sectionCard, sectionHead, sectionTitle, sectionSub, btnPrimary, btnOutline, btnDanger, input, fieldLabel, fieldBlock }) {
  const { getTotpStatus, setupTotp, confirmTotp, disableTotp, regenerateRecoveryCodes } = useAuth();
  const qc = useQueryClient();

  const { data: status, isLoading } = useQuery({
    queryKey: ['totp-status'],
    queryFn: getTotpStatus,
    staleTime: 30000,
  });

  const enabled = !!status?.enabled;
  const recoveryLeft = status?.recovery_codes_remaining ?? 0;

  // Setup state
  const [setupData, setSetupData] = useState(null); // { secret, provisioning_uri }
  const [setupCode, setSetupCode] = useState('');
  const [setupErr, setSetupErr] = useState('');
  const [setupBusy, setSetupBusy] = useState(false);

  // Disable state
  const [showDisable, setShowDisable] = useState(false);
  const [disablePw, setDisablePw] = useState('');
  const [disableErr, setDisableErr] = useState('');
  const [disableBusy, setDisableBusy] = useState(false);

  // Recovery codes (only shown once, right after generation)
  const [recoveryCodes, setRecoveryCodes] = useState(null);

  // Regenerate state
  const [showRegen, setShowRegen] = useState(false);
  const [regenCode, setRegenCode] = useState('');
  const [regenErr, setRegenErr] = useState('');
  const [regenBusy, setRegenBusy] = useState(false);

  async function handleStartSetup() {
    setSetupErr('');
    setSetupCode('');
    try {
      const data = await setupTotp();
      setSetupData(data);
    } catch (e) {
      setSetupErr(e?.response?.data?.detail || 'Could not start 2FA setup.');
    }
  }

  function handleCancelSetup() {
    setSetupData(null);
    setSetupCode('');
    setSetupErr('');
  }

  async function handleConfirmSetup(e) {
    e.preventDefault();
    setSetupErr('');
    setSetupBusy(true);
    try {
      const res = await confirmTotp(setupCode.replace(/\D/g, ''));
      setRecoveryCodes(res.recovery_codes || []);
      setSetupData(null);
      setSetupCode('');
      qc.invalidateQueries({ queryKey: ['totp-status'] });
    } catch (e) {
      setSetupErr(e?.response?.data?.detail || 'Invalid code. Try again.');
    } finally {
      setSetupBusy(false);
    }
  }

  async function handleDisable(e) {
    e.preventDefault();
    setDisableErr('');
    setDisableBusy(true);
    try {
      await disableTotp(disablePw);
      setShowDisable(false);
      setDisablePw('');
      qc.invalidateQueries({ queryKey: ['totp-status'] });
    } catch (e) {
      setDisableErr(e?.response?.data?.detail || 'Could not disable 2FA.');
    } finally {
      setDisableBusy(false);
    }
  }

  async function handleRegenerate(e) {
    e.preventDefault();
    setRegenErr('');
    setRegenBusy(true);
    try {
      const res = await regenerateRecoveryCodes(regenCode.replace(/\D/g, ''));
      setRecoveryCodes(res.recovery_codes || []);
      setShowRegen(false);
      setRegenCode('');
      qc.invalidateQueries({ queryKey: ['totp-status'] });
    } catch (e) {
      setRegenErr(e?.response?.data?.detail || 'Could not regenerate codes.');
    } finally {
      setRegenBusy(false);
    }
  }

  function downloadCodes() {
    const blob = new Blob(
      [
        'Pewil \u2014 2FA recovery codes\n',
        'Generated: ' + new Date().toISOString() + '\n\n',
        'Each code works once. Store them somewhere safe \u2014 a password manager, printed copy, or a locked drawer.\n\n',
        (recoveryCodes || []).map((c, i) => (i + 1) + '. ' + c).join('\n'),
        '\n',
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pewil-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ─── Rendering helpers ─── */
  const statusChip = (text, tone, bg) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: bg, color: tone, fontSize: 12, fontWeight: 700,
      letterSpacing: '.02em', textTransform: 'uppercase',
    }}>
      {text}
    </span>
  );

  const codeGrid = (
    <div
      style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
        fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
        fontSize: 15, fontWeight: 600, color: C.forest,
        background: C.cream, border: '1px solid ' + C.line, borderRadius: 12,
        padding: 16, margin: '12px 0',
      }}
    >
      {(recoveryCodes || []).map((c, i) => (
        <div key={i} style={{ letterSpacing: 2 }}>{c}</div>
      ))}
    </div>
  );

  /* ─── Main render ─── */
  return (
    <section style={sectionCard}>
      <div style={sectionHead}>
        <h2 style={sectionTitle}>Two-factor authentication</h2>
        <p style={sectionSub}>
          Protect your account with an authenticator app (Google Authenticator,
          Authy, 1Password). After sign-in you\'ll enter a rolling 6-digit code.
        </p>
      </div>

      {/* ── Recovery codes modal (inline, top of panel) ── */}
      {recoveryCodes && recoveryCodes.length > 0 && (
        <div
          style={{
            background: '#fff7ec', border: '1px solid ' + C.amber,
            borderRadius: 14, padding: 16, marginBottom: 16,
          }}
        >
          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: C.forest, marginBottom: 6 }}>
            Save your recovery codes
          </div>
          <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.55 }}>
            These are your only way in if you lose your authenticator. Each code
            works exactly once. We won\'t show them again.
          </div>
          {codeGrid}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" style={btnPrimary} onClick={downloadCodes}>
              Download .txt
            </button>
            <button
              type="button"
              style={btnOutline}
              onClick={() => {
                if (window.confirm('Have you saved these codes somewhere safe?')) {
                  setRecoveryCodes(null);
                }
              }}
            >
              I\'ve saved them
            </button>
          </div>
        </div>
      )}

      {/* ── Status row ── */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', border: '1px solid ' + C.line, borderRadius: 12,
          background: '#fff', marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Status</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>
            {isLoading
              ? 'Loading\u2026'
              : enabled
                ? `${recoveryLeft} recovery code${recoveryLeft === 1 ? '' : 's'} remaining`
                : 'Anyone with your password can sign in.'}
          </div>
        </div>
        {enabled
          ? statusChip('Enabled', C.forest, '#e7f2ea')
          : statusChip('Off', '#8a5a00', '#fff4dc')}
      </div>

      {/* ── Actions ── */}
      {!enabled && !setupData && (
        <div>
          {setupErr && (
            <div style={{ background: '#fce0d6', color: '#a53815', fontSize: 13, padding: '10px 14px', borderRadius: 12, marginBottom: 12 }}>
              {setupErr}
            </div>
          )}
          <button type="button" style={btnPrimary} onClick={handleStartSetup}>
            Enable 2FA
          </button>
        </div>
      )}

      {/* ── Setup flow ── */}
      {setupData && (
        <form onSubmit={handleConfirmSetup}>
          <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 700, color: C.forest, margin: '4px 0 8px' }}>
            Step 1 — Scan the QR code
          </div>
          <div
            style={{
              display: 'grid', gridTemplateColumns: '200px 1fr', gap: 18,
              alignItems: 'start',
              background: C.cream, border: '1px solid ' + C.line, borderRadius: 12,
              padding: 16, marginBottom: 16,
            }}
          >
            <div style={{ background: '#fff', padding: 10, borderRadius: 10, border: '1px solid ' + C.line2, display: 'inline-block' }}>
              <QRCodeSVG value={setupData.provisioning_uri} size={180} level="M" includeMargin={false} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.ink, marginBottom: 10, lineHeight: 1.55 }}>
                Open your authenticator app and scan this code. Can\'t scan? Enter this secret manually:
              </div>
              <div
                style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 13,
                  background: '#fff', border: '1px solid ' + C.line, borderRadius: 10,
                  padding: '10px 12px', letterSpacing: 1, wordBreak: 'break-all',
                }}
              >
                {setupData.secret}
              </div>
            </div>
          </div>

          <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 700, color: C.forest, margin: '4px 0 8px' }}>
            Step 2 — Enter the 6-digit code
          </div>
          <div style={fieldBlock}>
            <label style={fieldLabel}>Code from your app</label>
            <input
              style={{ ...input, letterSpacing: 4, fontFamily: 'ui-monospace, monospace', fontSize: 16 }}
              type="text"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              value={setupCode}
              onChange={(e) => setSetupCode(e.target.value)}
              placeholder="123456"
            />
          </div>

          {setupErr && (
            <div style={{ background: '#fce0d6', color: '#a53815', fontSize: 13, padding: '10px 14px', borderRadius: 12, margin: '12px 0' }}>
              {setupErr}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              type="submit"
              style={{ ...btnPrimary, opacity: setupBusy ? 0.6 : 1 }}
              disabled={setupBusy || setupCode.length < 6}
            >
              {setupBusy ? 'Verifying\u2026' : 'Confirm and enable'}
            </button>
            <button type="button" style={btnOutline} onClick={handleCancelSetup}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Enabled: disable + regenerate ── */}
      {enabled && !showDisable && !showRegen && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" style={btnOutline} onClick={() => { setShowRegen(true); setRegenErr(''); setRegenCode(''); }}>
            Regenerate recovery codes
          </button>
          <button type="button" style={btnDanger} onClick={() => { setShowDisable(true); setDisableErr(''); setDisablePw(''); }}>
            Disable 2FA
          </button>
        </div>
      )}

      {/* ── Disable flow ── */}
      {enabled && showDisable && (
        <form onSubmit={handleDisable}>
          <div style={{ fontSize: 13, color: C.ink, marginBottom: 10 }}>
            Confirm your current password to turn off 2FA. Your account will go back
            to password-only sign-in.
          </div>
          <div style={fieldBlock}>
            <label style={fieldLabel}>Current password</label>
            <input
              style={input}
              type="password"
              autoComplete="current-password"
              value={disablePw}
              onChange={(e) => setDisablePw(e.target.value)}
              required
              autoFocus
            />
          </div>
          {disableErr && (
            <div style={{ background: '#fce0d6', color: '#a53815', fontSize: 13, padding: '10px 14px', borderRadius: 12, margin: '12px 0' }}>
              {disableErr}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button type="submit" style={{ ...btnDanger, opacity: disableBusy ? 0.6 : 1 }} disabled={disableBusy}>
              {disableBusy ? 'Disabling\u2026' : 'Disable 2FA'}
            </button>
            <button type="button" style={btnOutline} onClick={() => setShowDisable(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Regenerate flow ── */}
      {enabled && showRegen && (
        <form onSubmit={handleRegenerate}>
          <div style={{ fontSize: 13, color: C.ink, marginBottom: 10 }}>
            Enter the current code from your authenticator. Existing recovery codes
            will be invalidated immediately.
          </div>
          <div style={fieldBlock}>
            <label style={fieldLabel}>Code from your app</label>
            <input
              style={{ ...input, letterSpacing: 4, fontFamily: 'ui-monospace, monospace', fontSize: 16 }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={regenCode}
              onChange={(e) => setRegenCode(e.target.value)}
              placeholder="123456"
              required
              autoFocus
            />
          </div>
          {regenErr && (
            <div style={{ background: '#fce0d6', color: '#a53815', fontSize: 13, padding: '10px 14px', borderRadius: 12, margin: '12px 0' }}>
              {regenErr}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              type="submit"
              style={{ ...btnPrimary, opacity: regenBusy ? 0.6 : 1 }}
              disabled={regenBusy || regenCode.length < 6}
            >
              {regenBusy ? 'Generating\u2026' : 'Generate new codes'}
            </button>
            <button type="button" style={btnOutline} onClick={() => setShowRegen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
