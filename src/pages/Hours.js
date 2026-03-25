import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkers, getFields, getAttendance, createAttendance, markPaid } from '../api/farmApi';
import { fmt, today, initials, avatarColor, IMAGES } from '../utils/format';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const empty = { worker: '', field: '', date: today(), check_in: '', check_out: '', days_worked: '', month: new Date().getMonth(), monthly_amount: '', adjustment: '', adj_reason: '', notes: '' };

const S = {
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  banner: {
    height: 90, borderRadius: 10, padding: '20px 24px', marginBottom: 16,
    background: 'linear-gradient(135deg, #111827, #374151)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif", textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18, marginBottom: 16 },
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 3, marginTop: 8 },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, outline: 'none', color: '#111827' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  btn: { width: '100%', padding: '10px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 12 },
  preview: { background: '#e8f5ee', borderRadius: 7, padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#1a6b3a', marginTop: 10, fontFamily: "'Playfair Display', serif" },
  adjBox: { background: '#fef3e2', borderRadius: 8, padding: 12, marginTop: 10 },
  adjLabel: { fontSize: 10, fontWeight: 700, color: '#c97d1a', marginBottom: 6 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 },
  logItem: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
  },
  avatar: (bg) => ({
    width: 28, height: 28, borderRadius: '50%', background: bg, color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 9, fontWeight: 700, flexShrink: 0,
  }),
};

export default function Hours() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);

  const { data: workers = [] } = useQuery({ queryKey: ['workers'], queryFn: getWorkers });
  const { data: fields = [] } = useQuery({ queryKey: ['fields'], queryFn: getFields });
  const { data: attendance = [] } = useQuery({ queryKey: ['attendance'], queryFn: () => getAttendance() });

  const mut = useMutation({
    mutationFn: createAttendance,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['attendance'] }); qc.invalidateQueries({ queryKey: ['workers'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); setForm(empty); },
  });
  const paidMut = useMutation({
    mutationFn: markPaid,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['attendance'] }); qc.invalidateQueries({ queryKey: ['workers'] }); },
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const selectedWorker = useMemo(() => workers.find(w => String(w.id) === String(form.worker)), [workers, form.worker]);
  const payType = selectedWorker?.pay_type || 'Daily';

  const livePay = useMemo(() => {
    if (!selectedWorker) return 0;
    const rate = selectedWorker.rate || 0;
    let base = 0;
    if (payType === 'Hourly') {
      const i = form.check_in ? form.check_in.split(':').map(Number) : null;
      const o = form.check_out ? form.check_out.split(':').map(Number) : null;
      if (i && o) base = Math.max(0, (o[0] + o[1] / 60) - (i[0] + i[1] / 60)) * rate;
    } else if (payType === 'Daily') {
      base = (parseFloat(form.days_worked) || 0) * rate;
    } else {
      base = parseFloat(form.monthly_amount) || rate;
    }
    return base + (parseFloat(form.adjustment) || 0);
  }, [selectedWorker, payType, form]);

  const submit = (e) => {
    e.preventDefault();
    const payload = { worker: parseInt(form.worker), field: parseInt(form.field), date: form.date, adjustment: parseFloat(form.adjustment) || 0, notes: form.notes };
    if (payType === 'Hourly') { payload.check_in = form.check_in; payload.check_out = form.check_out; }
    else if (payType === 'Daily') { payload.days_worked = parseFloat(form.days_worked) || 0; }
    else { payload.month = form.month; payload.monthly_amount = parseFloat(form.monthly_amount) || 0; }
    mut.mutate(payload);
  };

  return (
    <>
      <div style={{ position: 'relative', height: 110, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
        <img src={IMAGES.hours} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.25))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '12px 16px', color: '#fff', zIndex: 1 }}>
          <div style={S.bannerTitle}>Hours &amp; Pay</div>
          <div style={S.bannerSub}>Attendance tracking and payroll</div>
        </div>
      </div>

      <div className="two-col-layout" style={S.twoCol}>
        {/* Left: Form */}
        <div>
          <form style={S.card} onSubmit={submit}>
            <div className="form-grid-2" style={S.row2}>
              <div><label style={S.label}>Worker</label><select style={S.input} value={form.worker} onChange={e => set('worker', e.target.value)} required><option value="">Select…</option>{workers.map(w => <option key={w.id} value={w.id}>{w.name} ({w.pay_type})</option>)}</select></div>
              <div><label style={S.label}>Field</label><select style={S.input} value={form.field} onChange={e => set('field', e.target.value)} required><option value="">Select…</option>{fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
            </div>
            <label style={S.label}>Date</label>
            <input style={S.input} type="date" value={form.date} onChange={e => set('date', e.target.value)} />

            {payType === 'Hourly' && (
              <div className="form-grid-2" style={S.row2}>
                <div><label style={S.label}>Check In</label><input style={S.input} type="time" value={form.check_in} onChange={e => set('check_in', e.target.value)} required /></div>
                <div><label style={S.label}>Check Out</label><input style={S.input} type="time" value={form.check_out} onChange={e => set('check_out', e.target.value)} required /></div>
              </div>
            )}
            {payType === 'Daily' && (
              <><label style={S.label}>Days Worked</label><input style={S.input} type="number" min="0" step="0.5" value={form.days_worked} onChange={e => set('days_worked', e.target.value)} required placeholder="1" /></>
            )}
            {payType === 'Monthly' && (
              <>
                <div className="form-grid-2" style={S.row2}>
                  <div><label style={S.label}>Month</label><select style={S.input} value={form.month} onChange={e => set('month', parseInt(e.target.value))}>{MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}</select></div>
                  <div><label style={S.label}>Amount</label><input style={S.input} type="number" min="0" step="0.01" value={form.monthly_amount} onChange={e => set('monthly_amount', e.target.value)} placeholder={`Default: ${selectedWorker?.rate || 0}`} /></div>
                </div>
                <div style={{ fontSize: 10, color: '#c97d1a', marginTop: 4 }}>Manager decides actual amount.</div>
              </>
            )}

            {selectedWorker && <div style={S.preview}>
              {payType === 'Hourly' && form.check_in && form.check_out && `⏱ Clocked: ${(livePay / (selectedWorker.rate || 1)).toFixed(1)} hours × ${fmt(selectedWorker.rate)}/hr = `}
              {payType === 'Daily' && form.days_worked && `📅 ${form.days_worked} days × ${fmt(selectedWorker.rate)}/day = `}
              {fmt(livePay)}
            </div>}

            <div style={S.adjBox}>
              <div style={S.adjLabel}>⚡ Adjustment (optional)</div>
              <div className="form-grid-2" style={S.row2}>
                <input style={S.input} type="number" step="0.01" value={form.adjustment} onChange={e => set('adjustment', e.target.value)} placeholder="＋/− amount" />
                <input style={S.input} value={form.adj_reason} onChange={e => set('adj_reason', e.target.value)} placeholder="Reason" />
              </div>
            </div>

            <label style={S.label}>Task Notes</label>
            <input style={S.input} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="What did they work on?" />
            <button style={S.btn} type="submit" disabled={mut.isPending}>{mut.isPending ? 'Saving…' : '✓ Save Entry'}</button>
            {mut.isError && <p style={{ color: '#c0392b', fontSize: 10, marginTop: 4 }}>{mut.error?.response?.data?.detail || 'Failed'}</p>}
          </form>
        </div>

        {/* Right: Attendance log */}
        <div>
          <div style={S.sectionTitle}>Attendance Log</div>
          {(Array.isArray(attendance) ? attendance : []).length === 0 && <p style={{ fontSize: 11, color: '#9ca3af' }}>No entries yet.</p>}
          {(Array.isArray(attendance) ? attendance : []).map(a => {
            const ac = avatarColor(a.worker_name || '');
            return (
              <div key={a.id} style={S.logItem}>
                <div style={S.avatar(ac.bg)}>{initials(a.worker_name || '')}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 12, color: '#111827' }}>{a.worker_name || `Worker #${a.worker}`}</span>
                    <span className="pill-gray">{a.pay_type || '—'}</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>
                    {a.date} · {a.field_name || ''} {a.check_in ? `· ${a.check_in}–${a.check_out}` : ''} {a.notes ? `· ${a.notes}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1a6b3a' }}>{fmt(a.amount || a.pay)}</div>
                  <button
                    className={a.is_paid ? 'pill-green' : 'pill-amber'}
                    style={{ cursor: a.is_paid ? 'default' : 'pointer', border: 'none', fontFamily: 'inherit' }}
                    onClick={() => { if (!a.is_paid) paidMut.mutate(a.id); }}
                    disabled={a.is_paid || paidMut.isPending}
                  >
                    {a.is_paid ? 'Paid' : 'Mark paid'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
