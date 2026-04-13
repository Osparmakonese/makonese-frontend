import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyTenant, updateMyTenant } from '../api/coreApi';
import { getVapidKey, subscribePush, unsubscribePush, sendTestPush } from '../api/farmApi';
import { getAIBudget } from '../api/aiApi';
import { useQuery } from '@tanstack/react-query';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '18px 20px', marginBottom: 16 };
const cardTitle = { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 };
const fl = { display: 'block', fontSize: 9, fontWeight: 600, color: '#6b7280', marginBottom: 2, marginTop: 8 };
const fi = { width: '100%', padding: '7px 9px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 11, outline: 'none', color: '#111827', transition: 'border-color 0.15s' };
const btnP = { padding: '8px 16px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 10 };
const toggleS = (on) => ({ width: 36, height: 20, borderRadius: 99, position: 'relative', cursor: 'pointer', transition: 'background 0.15s', background: on ? '#1a6b3a' : '#d1d5db', border: 'none', padding: 0 });
const toggleK = (on) => ({ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: on ? 18 : 2, transition: 'left 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' });
const permRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 7, marginBottom: 5 };

export default function Settings() {
  const { user } = useAuth();
  const role = user?.role || 'owner';

  // Tenant details
  const tenantName = user?.tenant_name || 'Makonese Farm';
  const [bizName, setBizName] = useState(tenantName);
  const [country, setCountry] = useState('ZW');
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD');
  const [timezone, setTimezone] = useState('Africa/Harare');
  const [saved, setSaved] = useState('');

  // Modules
  const modules = user?.modules || ['farm', 'retail'];
  const [farmOn, setFarmOn] = useState(modules.includes('farm'));
  const [retailOn, setRetailOn] = useState(modules.includes('retail'));

  // Cashier permissions
  const [permViewProducts, setPermViewProducts] = useState(true);
  const [permAddProducts, setPermAddProducts] = useState(false);
  const [permEditProducts, setPermEditProducts] = useState(false);
  const [permPOS, setPermPOS] = useState(true);
  const [permViewReports, setPermViewReports] = useState(false);

  // WhatsApp + Push
  const [phone1, setPhone1] = useState(() => localStorage.getItem('wa_phone_1') || '');
  const [phone2, setPhone2] = useState(() => localStorage.getItem('wa_phone_2') || '');
  const [reminder, setReminder] = useState(() => localStorage.getItem('reminder_9pm') === 'true');
  const [pushOn, setPushOn] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushMsg, setPushMsg] = useState('');

  // AI Budget
  const { data: aiBudget, isLoading: aiLoading } = useQuery({
    queryKey: ['ai-budget'],
    queryFn: getAIBudget,
    staleTime: 30000,
  });

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(reg =>
        reg.pushManager.getSubscription().then(sub => setPushOn(!!sub))
      ).catch(() => {});
    }
  }, []);

  const togglePush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) { setPushMsg('Browser push not supported.'); return; }
    setPushBusy(true); setPushMsg('');
    try {
      const reg = await navigator.serviceWorker.ready;
      if (pushOn) {
        const sub = await reg.pushManager.getSubscription();
        if (sub) { await unsubscribePush(sub.endpoint).catch(() => {}); await sub.unsubscribe(); }
        setPushOn(false); setPushMsg('Push disabled.');
      } else {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') { setPushMsg('Permission denied.'); setPushBusy(false); return; }
        const { public_key } = await getVapidKey();
        if (!public_key) { setPushMsg('Server not configured.'); setPushBusy(false); return; }
        const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(public_key) });
        const json = sub.toJSON();
        await subscribePush({ endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth, user_agent: navigator.userAgent.slice(0, 280) });
        setPushOn(true); setPushMsg('Push enabled.');
      }
    } catch (e) { setPushMsg('Error: ' + (e.message || 'unknown')); }
    setPushBusy(false);
  };

  const testPush = async () => {
    try { await sendTestPush(); setPushMsg('Test sent.'); } catch { setPushMsg('Test failed.'); }
  };

  useEffect(() => { localStorage.setItem('currency', currency); }, [currency]);
  useEffect(() => { localStorage.setItem('reminder_9pm', String(reminder)); }, [reminder]);

  const saveTenant = () => { setSaved('Changes saved!'); setTimeout(() => setSaved(''), 2000); };
  const savePhones = () => { localStorage.setItem('wa_phone_1', phone1); localStorage.setItem('wa_phone_2', phone2); setSaved('Phones saved!'); setTimeout(() => setSaved(''), 2000); };

  if (role !== 'owner') {
    return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}><div style={{ fontSize: 32 }}>{'\u{1F512}'}</div><p>Settings are owner-only.</p></div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
      {/* Column 1: Tenant Details */}
      <div>
        <div style={card}>
          <div style={cardTitle}>Tenant Details</div>
          <label style={fl}>Business Name</label>
          <input style={fi} value={bizName} onChange={e => setBizName(e.target.value)} />
          <label style={fl}>Country</label>
          <select style={fi} value={country} onChange={e => setCountry(e.target.value)}>
            <option value="ZW">Zimbabwe</option>
            <option value="ZA">South Africa</option>
            <option value="KE">Kenya</option>
            <option value="NG">Nigeria</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
          </select>
          <label style={fl}>Currency</label>
          <select style={fi} value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="USD">USD ($)</option>
            <option value="ZWG">ZWG</option>
            <option value="ZAR">ZAR (R)</option>
            <option value="KES">KES (KSh)</option>
            <option value="GBP">GBP</option>
          </select>
          <label style={fl}>Timezone</label>
          <select style={fi} value={timezone} onChange={e => setTimezone(e.target.value)}>
            <option value="Africa/Harare">Africa/Harare (CAT)</option>
            <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
            <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="America/New_York">America/New_York (EST)</option>
          </select>
          <button style={btnP} onClick={saveTenant}>Save Changes</button>
          {saved === 'Changes saved!' && <div style={{ fontSize: 11, color: '#1a6b3a', fontWeight: 600, marginTop: 6 }}>{'\u2713'} {saved}</div>}
        </div>

        {/* WhatsApp */}
        <div style={card}>
          <div style={cardTitle}>{'\u{1F4F1}'} WhatsApp Recipients</div>
          <label style={fl}>Owner Number 1</label>
          <input style={fi} type="tel" value={phone1} onChange={e => setPhone1(e.target.value)} placeholder="+263..." />
          <label style={fl}>Owner Number 2</label>
          <input style={fi} type="tel" value={phone2} onChange={e => setPhone2(e.target.value)} placeholder="+263..." />
          <button style={btnP} onClick={savePhones}>Save Numbers</button>
          {saved === 'Phones saved!' && <div style={{ fontSize: 11, color: '#1a6b3a', fontWeight: 600, marginTop: 6 }}>{'\u2713'} {saved}</div>}
        </div>

        {/* AI Usage */}
        <div style={card}>
          <div style={cardTitle}>{'\u{1F916}'} Pewil AI Usage</div>
          {aiLoading ? (
            <div style={{ fontSize: 11, color: '#6b7280' }}>Loading usage...</div>
          ) : aiBudget ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#6b7280' }}>Plan</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a6b3a', textTransform: 'capitalize' }}>{aiBudget.plan}</span>
              </div>
              {/* Credits bar */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b7280', marginBottom: 3 }}>
                  <span>{aiBudget.credits_used} / {aiBudget.credits_total} credits used</span>
                  <span>{aiBudget.credits_remaining} left</span>
                </div>
                <div style={{ height: 8, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99, transition: 'width 0.3s',
                    width: `${Math.min(aiBudget.usage_percent, 100)}%`,
                    background: aiBudget.usage_percent > 80 ? '#c0392b' : aiBudget.usage_percent > 50 ? '#c97d1a' : '#1a6b3a',
                  }} />
                </div>
              </div>
              {/* Cost */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b7280', marginBottom: 10 }}>
                <span>API cost this month</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>${parseFloat(aiBudget.cost_usd || 0).toFixed(4)}</span>
              </div>
              {/* Resets info */}
              <div style={{ fontSize: 9, color: '#6b7280', marginBottom: 10 }}>Credits reset on the 1st of each month.</div>
              {/* Usage breakdown */}
              {aiBudget.usage_by_feature?.length > 0 && (
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Usage Breakdown</div>
                  {aiBudget.usage_by_feature.map((f, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: 10, color: '#374151' }}>{f.description}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#111827' }}>{f.count}x</span>
                    </div>
                  ))}
                </div>
              )}
              {aiBudget.usage_by_feature?.length === 0 && (
                <div style={{ fontSize: 10, color: '#9ca3af', fontStyle: 'italic' }}>No AI analyses used yet this month.</div>
              )}
            </>
          ) : (
            <div style={{ fontSize: 10, color: '#9ca3af' }}>AI usage data unavailable.</div>
          )}
        </div>
      </div>

      {/* Column 2: Role Permissions */}
      <div>
        <div style={card}>
          <div style={cardTitle}>Role Permissions</div>
          <div style={{ fontSize: 9, color: '#6b7280', marginBottom: 8 }}>Configure what each role can do</div>

          <div style={{ fontWeight: 600, fontSize: 10, color: '#1a6b3a', marginBottom: 6, marginTop: 4 }}>CASHIER PERMISSIONS</div>

          <div style={permRow}>
            <div><div style={{ fontWeight: 600, fontSize: 11 }}>View Products</div><div style={{ fontSize: 9, color: '#6b7280' }}>See product list and prices</div></div>
            <button style={toggleS(permViewProducts)} onClick={() => setPermViewProducts(!permViewProducts)}><div style={toggleK(permViewProducts)} /></button>
          </div>
          <div style={permRow}>
            <div><div style={{ fontWeight: 600, fontSize: 11 }}>Add Products</div><div style={{ fontSize: 9, color: '#6b7280' }}>Create new products in catalog</div></div>
            <button style={toggleS(permAddProducts)} onClick={() => setPermAddProducts(!permAddProducts)}><div style={toggleK(permAddProducts)} /></button>
          </div>
          <div style={permRow}>
            <div><div style={{ fontWeight: 600, fontSize: 11 }}>Edit Products</div><div style={{ fontSize: 9, color: '#6b7280' }}>Modify price, stock, mark stolen/damaged</div></div>
            <button style={toggleS(permEditProducts)} onClick={() => setPermEditProducts(!permEditProducts)}><div style={toggleK(permEditProducts)} /></button>
          </div>
          <div style={permRow}>
            <div><div style={{ fontWeight: 600, fontSize: 11 }}>Process Sales (POS)</div><div style={{ fontSize: 9, color: '#6b7280' }}>Use point of sale to ring up items</div></div>
            <button style={toggleS(permPOS)} onClick={() => setPermPOS(!permPOS)}><div style={toggleK(permPOS)} /></button>
          </div>
          <div style={permRow}>
            <div><div style={{ fontWeight: 600, fontSize: 11 }}>View Reports</div><div style={{ fontSize: 9, color: '#6b7280' }}>See financial reports</div></div>
            <button style={toggleS(permViewReports)} onClick={() => setPermViewReports(!permViewReports)}><div style={toggleK(permViewReports)} /></button>
          </div>

          <button style={{ ...btnP, fontSize: 10, padding: '4px 9px' }}>Save Permissions</button>
        </div>

        {/* Roles info */}
        <div style={card}>
          <div style={cardTitle}>{'\u{1F465}'} Roles</div>
          <div style={{ background: '#e8f5ee', borderRadius: 8, padding: '10px 14px', marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a6b3a' }}>OWNER</div>
            <div style={{ fontSize: 10, color: '#374151', marginTop: 2 }}>Full access: all tabs, reports, settings, billing, AI.</div>
          </div>
          <div style={{ background: '#EFF6FF', borderRadius: 8, padding: '10px 14px', marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8' }}>MANAGER</div>
            <div style={{ fontSize: 10, color: '#374151', marginTop: 2 }}>Can log expenses, stock, attendance, trips. No reports or settings.</div>
          </div>
          <div style={{ background: '#fef3e2', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#c97d1a' }}>CASHIER / WORKER</div>
            <div style={{ fontSize: 10, color: '#374151', marginTop: 2 }}>POS access or view-only for their own hours.</div>
          </div>
        </div>
      </div>

      {/* Column 3: Modules + Alerts */}
      <div>
        <div style={card}>
          <div style={cardTitle}>Enabled Modules</div>
          {[
            { label: 'Farm Module', desc: 'Fields, stock, workers, livestock, AI', on: farmOn, toggle: () => setFarmOn(!farmOn) },
            { label: 'Retail Module', desc: 'POS, products, cashier, sales', on: retailOn, toggle: () => setRetailOn(!retailOn) },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, border: '1px solid #e5e7eb', borderRadius: 7, marginBottom: 5 }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 11 }}>{m.label}</span>
                <div style={{ fontSize: 9, color: '#6b7280' }}>{m.desc}</div>
              </div>
              <button style={toggleS(m.on)} onClick={m.toggle}><div style={toggleK(m.on)} /></button>
            </div>
          ))}
        </div>

        {/* Push alerts */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div style={cardTitle}>{'\u{1F514}'} Browser Push Alerts</div>
              <p style={{ fontSize: 10, color: '#6b7280', marginBottom: 6 }}>Get alerts for low stock, wages, livestock health.</p>
              {pushMsg && <div style={{ fontSize: 10, color: '#1a6b3a', fontWeight: 600 }}>{pushMsg}</div>}
              {pushOn && <button style={{ ...btnP, marginTop: 6, background: '#2d9e58', fontSize: 10 }} onClick={testPush}>Send test push</button>}
            </div>
            <button style={toggleS(pushOn)} onClick={togglePush} disabled={pushBusy}><div style={toggleK(pushOn)} /></button>
          </div>
        </div>

        {/* 9PM Reminder */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={cardTitle}>{'\u{1F559}'} 9PM Daily Reminder</div>
              <p style={{ fontSize: 10, color: '#6b7280' }}>WhatsApp reminder to log daily data.</p>
            </div>
            <button style={toggleS(reminder)} onClick={() => setReminder(!reminder)}><div style={toggleK(reminder)} /></button>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ ...card, borderColor: '#c0392b' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#c0392b', marginBottom: 8 }}>Danger Zone</div>
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>These actions are irreversible.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 12px', border: '1px solid #c0392b', borderRadius: 7, background: '#fff', color: '#c0392b', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Cancel Subscription</button>
            <button style={{ padding: '6px 12px', border: '1px solid #c0392b', borderRadius: 7, background: '#fff', color: '#c0392b', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
