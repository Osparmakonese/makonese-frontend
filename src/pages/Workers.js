import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkers, createWorker } from '../api/farmApi';
import { fmt, initials, avatarColor, IMAGES } from '../utils/format';

const ROLES = ['General Worker', 'Supervisor', 'Driver', 'Irrigator', 'Sprayer', 'Other'];
const PAY_TYPES = ['Hourly', 'Daily', 'Monthly'];
const PAY_LABELS = { Hourly: '$/hr', Daily: '$/day', Monthly: 'Monthly salary' };
const RATE_LABELS = { Hourly: '/hr', Daily: '/day', Monthly: '/mo' };

const empty = { name: '', role: 'General Worker', pay_type: 'Daily', rate: '' };

const S = {
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  banner: {
    height: 90, borderRadius: 10, padding: '20px 24px', marginBottom: 16,
    background: 'linear-gradient(135deg, #1a6b3a, #2d9e58)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif", textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18, marginBottom: 16 },
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 3, marginTop: 8 },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, outline: 'none', color: '#111827' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  btn: { width: '100%', padding: '10px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 12 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 },
  workerCard: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
  },
  avatar: (bg) => ({
    width: 30, height: 30, borderRadius: '50%', background: bg, color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 700, flexShrink: 0,
  }),
};

export default function Workers() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);

  const { data: workers = [], isLoading } = useQuery({ queryKey: ['workers'], queryFn: getWorkers });

  const mut = useMutation({
    mutationFn: createWorker,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workers'] }); setForm(empty); },
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="two-col-layout" style={S.twoCol}>
      {/* Left */}
      <div>
        <div style={{ position: 'relative', height: 110, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
          <img src={IMAGES.workers} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,40,15,0.82), rgba(0,0,0,0.2))' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '12px 16px', color: '#fff', zIndex: 1 }}>
            <div style={S.bannerTitle}>Worker Roster</div>
            <div style={S.bannerSub}>Manage farm workers and wages</div>
          </div>
        </div>
        <form style={S.card} onSubmit={e => { e.preventDefault(); mut.mutate({ ...form, rate: parseFloat(form.rate) || 0 }); }}>
          <label style={S.label}>Full Name</label>
          <input style={S.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Tendai Moyo" required />
          <div className="form-grid-2" style={S.row2}>
            <div><label style={S.label}>Role</label><select style={S.input} value={form.role} onChange={e => set('role', e.target.value)}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></div>
            <div><label style={S.label}>Pay Type</label><select style={S.input} value={form.pay_type} onChange={e => set('pay_type', e.target.value)}>{PAY_TYPES.map(p => <option key={p}>{p}</option>)}</select></div>
          </div>
          <label style={S.label}>{PAY_LABELS[form.pay_type] || 'Rate'}</label>
          <input style={S.input} type="number" min="0" step="0.01" value={form.rate} onChange={e => set('rate', e.target.value)} required placeholder="0.00" />
          <button style={S.btn} type="submit" disabled={mut.isPending}>{mut.isPending ? 'Saving…' : '＋ Add Worker'}</button>
          {mut.isError && <p style={{ color: '#c0392b', fontSize: 10, marginTop: 4 }}>{mut.error?.response?.data?.detail || 'Failed'}</p>}
        </form>
      </div>

      {/* Right */}
      <div>
        <div style={S.sectionTitle}>Roster — {workers.length} workers</div>
        {isLoading && <p style={{ fontSize: 11, color: '#9ca3af' }}>Loading…</p>}
        {(Array.isArray(workers) ? workers : []).map(w => {
          const ac = avatarColor(w.name || '');
          const owed = w.wages_owed || 0;
          return (
            <div key={w.id} style={S.workerCard}>
              <div style={S.avatar(ac.bg)}>{initials(w.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{w.name}</div>
                <div style={{ fontSize: 10, color: '#9ca3af' }}>{w.role} · {w.pay_type} · {fmt(w.rate)}{RATE_LABELS[w.pay_type] || ''}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: owed > 0 ? '#c0392b' : '#1a6b3a' }}>{fmt(owed)}</div>
                <span className={owed > 0 ? 'pill-red' : 'pill-green'}>{owed > 0 ? 'Owed' : 'Clear'}</span>
              </div>
            </div>
          );
        })}
        {!isLoading && workers.length === 0 && <p style={{ fontSize: 11, color: '#9ca3af' }}>No workers added yet.</p>}
      </div>
    </div>
  );
}
