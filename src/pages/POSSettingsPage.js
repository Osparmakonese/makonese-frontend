/**
 * POSSettingsPage.js — manager/owner-facing page to configure the POS
 * cashier-screen style and which panels are visible.
 *
 * Backs a per-tenant singleton on the server (GET/PUT /retail/pos-settings/).
 * The POS page reads these on load; changes take effect after the cashier's
 * next POS page load.
 */
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getPOSSettings, updatePOSSettings } from '../api/retailApi';

const THEMES = [
  {
    id: 'light',
    label: 'Light supermarket',
    hint: 'Square / Clover aesthetic. Clean white, soft green accents. Best for boutique shops and cafés.',
    preview: { bg: 'linear-gradient(135deg, #f9fafb 60%, #059669 100%)', fg: '#064e3b' },
  },
  {
    id: 'dark',
    label: 'Dark supermarket',
    hint: 'Toast / Lightspeed aesthetic. Low-glare dark UI with cyan accents. Best for brightly-lit stores.',
    preview: { bg: 'linear-gradient(135deg, #0b1020 60%, #22d3ee 100%)', fg: '#fff' },
  },
  {
    id: 'pnp',
    label: 'Scanner lane',
    hint: 'Pick n Pay / SAP CAR style. Receipt-style growing list, big yellow TOTAL, DynaKey function strip. Best for high-volume supermarkets.',
    preview: { bg: 'linear-gradient(135deg, #e31e24 60%, #0f172a 100%)', fg: '#fff' },
  },
];

const TOGGLES = [
  { key: 'show_product_tiles',     label: 'Show product tiles',         hint: 'Grid of tappable products. Turn off for scan-only lanes.' },
  { key: 'show_category_sidebar',  label: 'Show category sidebar',      hint: 'Left-hand category filter tree.' },
  { key: 'show_quick_tiles',       label: 'Show Quick Tiles panel',     hint: 'Large tap-targets for unbarcoded items (produce, bread).' },
  { key: 'show_keypad',            label: 'Show on-screen numeric keypad', hint: 'Inline 4×4 keypad for QTY / PRICE / % entry.' },
  { key: 'show_receipt_preview',   label: 'Show live receipt preview',  hint: 'Right-hand pane showing each line as it\u2019s added.' },
  { key: 'enable_hotkeys',         label: 'Enable F-key hotkeys',       hint: 'F2 scan, F4 discount, F10 complete, etc.' },
  { key: 'customer_display_enabled', label: 'Customer-facing display',  hint: 'Broadcast cart + total to the secondary screen.' },
  { key: 'auto_focus_scan',        label: 'Auto-focus scan bar',        hint: 'Keep the cursor in the scan input between sales.' },
];

const DEFAULTS = {
  theme: 'light',
  show_product_tiles: true,
  show_category_sidebar: true,
  show_quick_tiles: true,
  show_keypad: false,
  show_receipt_preview: true,
  enable_hotkeys: true,
  customer_display_enabled: true,
  auto_focus_scan: true,
};

export default function POSSettingsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const canEdit = user?.role === 'owner' || user?.role === 'manager' || user?.is_staff;

  const { data, isLoading } = useQuery({
    queryKey: ['pos-settings'],
    queryFn: getPOSSettings,
    staleTime: 30000,
  });

  const [form, setForm] = useState(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setForm({ ...DEFAULTS, ...data });
  }, [data]);

  const saveMut = useMutation({
    mutationFn: updatePOSSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pos-settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  if (isLoading) return <div style={{ padding: 20, color: '#64748b' }}>Loading POS settings…</div>;

  return (
    <div style={{ padding: 20, maxWidth: 980, margin: '0 auto' }}>
      {!canEdit && (
        <div style={styles.warn}>
          Only managers and owners can change POS settings. You can view the current configuration below.
        </div>
      )}

      {/* Theme picker */}
      <section style={styles.card}>
        <div style={styles.tag}>Look &amp; feel</div>
        <h2 style={styles.h2}>Cashier screen style</h2>
        <p style={styles.p}>Pick the theme every cashier at this store will see when they open the POS.</p>
        <div style={styles.themes}>
          {THEMES.map((t) => {
            const selected = form.theme === t.id;
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => canEdit && set({ theme: t.id })}
                style={{
                  ...styles.themeCard,
                  borderColor: selected ? '#1a6b3a' : '#e2e8f0',
                  background: selected ? '#f0fdf4' : '#fff',
                  cursor: canEdit ? 'pointer' : 'not-allowed',
                }}
              >
                <div style={{ ...styles.preview, background: t.preview.bg, color: t.preview.fg }}>
                  {t.label.toUpperCase()}
                </div>
                <div style={styles.themeLabel}>
                  <b>{t.label}</b>
                  {selected && <span style={styles.chk}>✓</span>}
                </div>
                <small style={styles.themeHint}>{t.hint}</small>
              </button>
            );
          })}
        </div>
      </section>

      {/* Panel toggles */}
      <section style={styles.card}>
        <div style={styles.tag}>Layout</div>
        <h2 style={styles.h2}>What cashiers see</h2>
        <p style={styles.p}>
          Toggle individual panels. Scan-only supermarket lanes usually turn <b>product tiles</b> off so
          cashiers focus on the scanner and the receipt.
        </p>
        <div>
          {TOGGLES.map((t) => (
            <div key={t.key} style={styles.row}>
              <div style={{ flex: 1 }}>
                <b style={styles.rowLabel}>{t.label}</b>
                <div style={styles.rowHint}>{t.hint}</div>
              </div>
              <button
                type="button"
                onClick={() => canEdit && set({ [t.key]: !form[t.key] })}
                style={{
                  ...styles.switch,
                  background: form[t.key] ? '#1a6b3a' : '#cbd5e1',
                  cursor: canEdit ? 'pointer' : 'not-allowed',
                }}
                aria-pressed={form[t.key]}
              >
                <span style={{
                  ...styles.switchDot,
                  left: form[t.key] ? 20 : 2,
                }} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Save */}
      <div style={styles.saveBar}>
        {saved && <span style={styles.savedMsg}>✓ Saved. Cashiers see changes after refreshing their POS.</span>}
        {saveMut.isError && (
          <span style={styles.errMsg}>
            Could not save — {saveMut.error?.response?.data?.detail || saveMut.error?.message || 'unknown error'}.
          </span>
        )}
        <button
          type="button"
          onClick={() => saveMut.mutate(form)}
          disabled={!canEdit || saveMut.isPending}
          style={{ ...styles.saveBtn, opacity: (!canEdit || saveMut.isPending) ? 0.5 : 1 }}
        >
          {saveMut.isPending ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  warn: {
    background: '#fef3c7', border: '1px solid #fde68a', color: '#78350f',
    padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14,
  },
  card: {
    background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
    padding: 20, marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  tag: { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' },
  h2: { fontSize: 17, fontWeight: 700, color: '#0f172a', margin: '4px 0 4px' },
  p: { fontSize: 13, color: '#64748b', margin: '0 0 14px' },
  themes: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 },
  themeCard: {
    border: '2px solid #e2e8f0', borderRadius: 10, padding: 12, textAlign: 'left',
    background: '#fff', font: 'inherit', color: 'inherit',
  },
  preview: {
    height: 72, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', marginBottom: 10,
  },
  themeLabel: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#0f172a' },
  themeHint: { display: 'block', fontSize: 11, color: '#64748b', marginTop: 4, lineHeight: 1.4 },
  chk: {
    background: '#1a6b3a', color: '#fff', fontSize: 10, width: 18, height: 18,
    borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
  },
  row: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 0', borderBottom: '1px solid #f1f5f9',
  },
  rowLabel: { display: 'block', fontSize: 13, color: '#0f172a' },
  rowHint: { fontSize: 11, color: '#64748b', marginTop: 2, lineHeight: 1.4 },
  switch: {
    position: 'relative', width: 40, height: 22, border: 'none', borderRadius: 12, transition: 'background 0.15s',
  },
  switchDot: {
    position: 'absolute', top: 2, width: 18, height: 18, background: '#fff',
    borderRadius: '50%', transition: 'left 0.15s',
  },
  saveBar: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 12 },
  saveBtn: {
    padding: '10px 20px', background: '#1a6b3a', color: '#fff',
    border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer',
  },
  savedMsg: { color: '#059669', fontSize: 12, fontWeight: 600 },
  errMsg: { color: '#b91c1c', fontSize: 12, fontWeight: 600 },
};
