import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkers, createWorker, deleteWorker } from '../api/farmApi';
import { fmt, initials, avatarColor, IMAGES } from '../utils/format';
import ConfirmModal from '../components/ConfirmModal';

const ROLES = [['field_worker','General Worker'],['supervisor','Supervisor'],['driver','Driver'],['irrigation_worker','Irrigator'],['market_seller','Market Seller'],['other','Other']];
const PAY_TYPES = [['hourly','Hourly'],['daily','Daily'],['monthly','Monthly']];
const PAY_LABELS = { hourly: '$/hr', daily: '$/day', monthly: 'Monthly salary' };
const RATE_LABELS = { hourly: '/hr', daily: '/day', monthly: '/mo' };
const empty = { name: '', role: 'field_worker', pay_type: 'daily', rate: '' };
const S = {
  twoCol: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 },
  card: { background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:18, marginBottom:16 },
  label: { display:'block', fontSize:10, fontWeight:600, color:'#6b7280', marginBottom
3, marginTop:8 },
  input: { width:'100%', padding:'8px 10px', border:'1px solid #e5e7eb', borderRadius:7, fontSize:12, outline:'none', color:'#111827' },
  row2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 },
  btn: { width:'100%', padding:'10px', background:'#1a6b3a', color:'#fff', border:'none', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', marginTop:12 },
  sectionTitle: { fontSize:14, fontWeight:700, color:'#111827', marginBottom:12 },
  bannerTitle: { color:'#fff', fontSize:16, fontWeight:700, fontFamily:"'Playfair Display', serif" },
  bannerSub: { color:'rgba(255,255,255,0.7)', fontSize:11 },
  workerCard: { background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:'12px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 },
  avatar: (bg) => ({ width:30, height:30, borderRadius:'50%', background:bg, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }),
};

export default function Workers() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const { data: workers = [], isLoading } = useQuery({ queryKey: ['workers'], queryFn: getWorkers });
  const mut = useMutation({
    mutationFn: createWorker,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workers'] }); setForm(empty); },
  });
  const delMut = useMutation({
    mutationFn: (id) => deleteWorker(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workers'] }); setDelConfirm(null); },
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSubmit = (e) => { e.preventDefault(); setPending({...form}); setConfirmOpen(true); };
  const handleConfirm = () => { setConfirmOpen(false); mut.mutate({ ...pending, rate: parseFloat(pending.rate) || 0 }); };
  const roleLabel = (v) => (ROLES.find(r => r[0] === v) || [v,v])[1];
  const payLabel = (v) => (PAY_TYPES.find(p => p[0] === v) || [v,v])[1];
  return (
    <div style={S.twoCol}>
      <div>
        <div style={{ position:'relative', height:110, borderRadius:10, overflow:'hidden', marginBottom:14 }}>
          <img src={IMAGES.workers} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(15,40,15,0.82), rgba(0,0,0,0.2))' }} />
          <div style={{ position:'absolute', bottom:0, left:0, padding:'12px 16px', color:'vfff', zIndex:1 }}>
            <div style={S.bannerTitle}>Worker Roster</div>
            <div style={S.bannerSub}>Manage farm workers and wages</div>
          </div>
        </div>
        <form style={S.card} onSubmit={handleSubmit}>
          <label style={S.label}>Full Name</label>
          <input style={S.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Tendai Moyo" required />
          <div style={S.row2}>
            <div><label style={S.label}>Role</label>
              <select style={S.input} value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div><label style={S.label}>Pay Type</label>
              <select style={S.input} value={form.pay_type} onChange={e => set('pay_type', e.target.value)}>
                {PAY_TYPES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <label style={S.label}>{PAY_LABELS[form.pay_type] || 'Rate'}</label>
          <input style={S.input} type="number" min="0" step="0.01" value={form.rate} onChange={e => set('rate', e.target.value)} required placeholder="0.00" />
          <button style={S.btn} type="submit" disabled={mut.isPending}>{mut.isPending ? 'Saving...' : '+ Add Worker'}</button>
          {mut.isError && <p style={{ color:'#c0392b', fontSize:10, marginTop:4 }}>Failed to save. Please check your details.</p>}
        </form>
      </div>
      <div>
        <div style={S.sectionTitle}>Roster - {workers.length} workers</div>
        {isLoading && <p style={{ fontSize:11, color:'#9ca3af' }}>Loading...</p>}
        {(Array.isArray(workers) ? workers : []).map(w => {
          const ac = avatarColor(w.name || '');
          const owed = w.wages_owed || 0;
          return (
            <div key={w.id} style={S.workerCard}>
              <div style={S.avatar(ac.bg)}>{initials(w.name)}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:13, color:'#111827' }}>{w.name}</div>
                <div style={{ fontSize:10, color:'uÆff' }}>{roleLabel(w.role)} - {payLabel(w.pay_type)} - {fmt(w.rate)}{RATE_LABELS[w.pay_type] || ''}</div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                <div style={{ fontWeight:700, fontSize:13, color: owed > 0 ? '#c0392b' : '#1a6b3a' }}>{fmt(owed)}</div>
                {delConfirm === w.id ? (
                  <div style={{ display:'flex', gap:4 }}>
                    <span style={{ fontSize:10, color:'#c0392b' }}>Sure?</span>
                    <button onClick={() => delMut.mutate(w.id)} style={{ fontSize:10, padding:'2px 6px', background:'#c0392b', color:'#fff', border:'none', borderRadius:4, cursor:'pointer' }}>Yes</button>
                    <button onClick={() => setDelConfirm(null)} style={{ fontSize:10, padding:'2px 6px', background:'#f3f4f6', border:'1px solid #d1d5db', borderRadius:4, cursor:'pointer' }}>No</button>
                  </div>
                ) : (
                  <button onClick={() => setDelConfirm(w.id)} style={{ fontSize:10, padding:'2px 8px', background:'#fff', color:'#c0392b', border:'1px solid #fca5a5', borderRadius:4, cursor:'pointer' }}>Delete</button>
                )}
              </div>
            </div>
          );
        })}
        {!isLoading && workers.length === 0 && <p style={{ fontSize:11, color:'uÆff' }}>No workers added yet.</p>}
      </div>
      <ConfirmModal
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        fields={pending ? [
          { label: 'Full Name', value: pending.name },
          { label: 'Role', value: roleLabel(pending.role) },
          { label: 'Pay Type', value: payLabel(pending.pay_type) },
          { label: 'Rate', value: pending.rate ? '$' + pending.rate : '' },
        ] : []}
      />
    </div>
  );
}
