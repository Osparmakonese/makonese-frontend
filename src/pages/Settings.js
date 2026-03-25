import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const S = {
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '18px 20px', marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 },
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, marginTop: 10 },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, outline: 'none', color: '#111827' },
  btn: { padding: '8px 16px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 10 },
  btnOutline: (active) => ({
    padding: '8px 20px', border: active ? '2px solid #1a6b3a' : '1px solid #e5e7eb',
    background: active ? '#e8f5ee' : '#fff', color: active ? '#1a6b3a' : '#374151',
    borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginRight: 8,
  }),
  toggle: (on) => ({
    width: 44, height: 24, borderRadius: 12, background: on ? '#1a6b3a' : '#d1d5db',
    position: 'relative', cursor: 'pointer', transition: 'background 0.2s', border: 'none',
  }),
  toggleKnob: (on) => ({
    width: 18, height: 18, borderRadius: '50%', background: '#fff',
    position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  }),
  roleBox: (bg, color) => ({
    background: bg, borderRadius: 8, padding: '12px 16px', marginBottom: 8,
  }),
  roleTitle: (color) => ({ fontSize: 13, fontWeight: 700, color }),
  roleSub: { fontSize: 11, color: '#374151', marginTop: 2 },
  saved: { fontSize: 11, color: '#1a6b3a', fontWeight: 600, marginTop: 6 },
};

export default function Settings() {
  const { user } = useAuth();
  const role = user?.role || 'owner';

  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD');
  const [phone1, setPhone1] = useState(() => localStorage.getItem('wa_phone_1') || '');
  const [phone2, setPhone2] = useState(() => localStorage.getItem('wa_phone_2') || '');
  const [reminder, setReminder] = useState(() => localStorage.getItem('reminder_9pm') === 'true');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('anthropic_api_key') || '');
  const [saved, setSaved] = useState('');

  useEffect(() => { localStorage.setItem('currency', currency); }, [currency]);
  useEffect(() => { localStorage.setItem('reminder_9pm', String(reminder)); }, [reminder]);

  const savePhones = () => {
    localStorage.setItem('wa_phone_1', phone1);
    localStorage.setItem('wa_phone_2', phone2);
    setSaved('Phone numbers saved!');
    setTimeout(() => setSaved(''), 2000);
  };

  const saveApiKey = () => {
    localStorage.setItem('anthropic_api_key', apiKey);
    setSaved('API key saved!');
    setTimeout(() => setSaved(''), 2000);
  };

  if (role !== 'owner') {
    return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}><div style={{ fontSize: 32 }}>🔒</div><p>Settings are owner-only.</p></div>;
  }

  return (
    <div style={S.twoCol}>
      {/* Left */}
      <div>
        <div style={S.card}>
          <div style={S.cardTitle}>💱 Currency</div>
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 10 }}>All amounts update when you switch. Values are not converted.</p>
          <div>
            <button style={S.btnOutline(currency === 'USD')} onClick={() => setCurrency('USD')}>🇺🇸 USD</button>
            <button style={S.btnOutline(currency === 'ZWG')} onClick={() => setCurrency('ZWG')}>🇿🇼 ZWG</button>
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>📱 WhatsApp Recipients</div>
          <label style={S.label}>Owner Number 1</label>
          <input style={S.input} type="tel" value={phone1} onChange={e => setPhone1(e.target.value)} placeholder="+263..." />
          <label style={S.label}>Owner Number 2</label>
          <input style={S.input} type="tel" value={phone2} onChange={e => setPhone2(e.target.value)} placeholder="+263..." />
          <button style={S.btn} onClick={savePhones}>Save Numbers</button>
          {saved === 'Phone numbers saved!' && <div style={S.saved}>✓ {saved}</div>}
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>🤖 AI Analysis (Anthropic API)</div>
          <div style={{ background: '#fef9c3', border: '1px solid #f59e0b', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 10, color: '#92400e', lineHeight: 1.5 }}>
            ⚠️ Your API key is stored locally on this device only. Never share your API key with anyone. If you suspect it has been compromised, regenerate it immediately at console.anthropic.com
          </div>
          <label style={S.label}>API Key</label>
          <input style={S.input} type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-..." />
          <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>Required for Smart Analysis in Field Reports and the full AI Report.</p>
          <button style={S.btn} onClick={saveApiKey}>Save API Key</button>
          {saved === 'API key saved!' && <div style={S.saved}>✓ {saved}</div>}
        </div>

        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={S.cardTitle}>🕘 9PM Daily Reminder</div>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Get a WhatsApp reminder to log daily data.</p>
            </div>
            <button style={S.toggle(reminder)} onClick={() => setReminder(!reminder)}>
              <div style={S.toggleKnob(reminder)} />
            </button>
          </div>
        </div>
      </div>

      {/* Right */}
      <div>
        <div style={S.card}>
          <div style={S.cardTitle}>👥 Roles &amp; Permissions</div>

          <div style={S.roleBox('#e8f5ee', '#1a6b3a')}>
            <div style={S.roleTitle('#1a6b3a')}>🟢 OWNER</div>
            <div style={S.roleSub}>Full access: all tabs, reports, settings, AI analysis. Can manage workers and approve pay.</div>
          </div>

          <div style={S.roleBox('#fef3e2', '#c97d1a')}>
            <div style={S.roleTitle('#c97d1a')}>🟡 MANAGER</div>
            <div style={S.roleSub}>Can log expenses, stock usage, attendance, and trips. Cannot view reports or change settings.</div>
          </div>

          <div style={S.roleBox('#EFF6FF', '#1d4ed8')}>
            <div style={S.roleTitle('#1d4ed8')}>🔵 WORKER</div>
            <div style={S.roleSub}>View-only access to dashboard and their own hours. Cannot modify data.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
