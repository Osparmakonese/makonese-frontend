import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createExpense, createHarvest, createWaterLog, createIncome, getFields } from '../api/farmApi';
import { today } from '../utils/format';

/*
  Quick Capture Floating Button
  - Stays on every page
  - Tap to reveal 4 quick actions: Expense, Harvest, Water, Income
  - Minimal form — 2-3 fields max per action
  - Hick's Law: max 4 choices
*/

const S = {
  fab: {
    position: 'fixed', bottom: 80, right: 20, width: 52, height: 52,
    borderRadius: '50%', background: '#1a6b3a', color: '#fff',
    border: 'none', fontSize: 24, cursor: 'pointer', zIndex: 300,
    boxShadow: '0 4px 14px rgba(26,107,58,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
  },
  fabOpen: {
    position: 'fixed', bottom: 80, right: 20, width: 52, height: 52,
    borderRadius: '50%', background: '#c0392b', color: '#fff',
    border: 'none', fontSize: 20, cursor: 'pointer', zIndex: 300,
    boxShadow: '0 4px 14px rgba(192,57,43,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
    transform: 'rotate(45deg)',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    zIndex: 290, backdropFilter: 'blur(2px)',
  },
  menu: {
    position: 'fixed', bottom: 145, right: 20, zIndex: 310,
    display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end',
  },
  menuItem: (color) => ({
    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
    animation: 'fadeInUp 0.2s ease',
  }),
  menuLabel: {
    background: '#fff', padding: '8px 14px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, color: '#111827',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)', whiteSpace: 'nowrap',
  },
  menuIcon: (bg) => ({
    width: 42, height: 42, borderRadius: '50%', background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  }),
  modal: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: '#fff', borderRadius: '20px 20px 0 0',
    padding: '20px 20px 30px', zIndex: 320, maxHeight: '60vh', overflowY: 'auto',
  },
  modalTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700,
    color: '#111827', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
  },
  field: { marginBottom: 12 },
  label: { fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4, display: 'block' },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
    fontSize: 13, fontFamily: "'Inter', sans-serif", outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
    fontSize: 13, fontFamily: "'Inter', sans-serif", outline: 'none',
    background: '#fff', boxSizing: 'border-box',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  submitBtn: (bg) => ({
    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
    background: bg, color: '#fff', fontSize: 13, fontWeight: 700,
    cursor: 'pointer', marginTop: 8, fontFamily: "'Inter', sans-serif",
  }),
  successMsg: {
    textAlign: 'center', padding: '30px 20px', fontSize: 14,
    color: '#1a6b3a', fontWeight: 600,
  },
};

const ACTIONS = [
  { key: 'expense', label: 'Log Expense', icon: '\u{1F9FE}', color: '#c0392b' },
  { key: 'harvest', label: 'Log Harvest', icon: '\u{1F33E}', color: '#1a6b3a' },
  { key: 'water', label: 'Log Water', icon: '\u{1F4A7}', color: '#0369a1' },
  { key: 'income', label: 'Record Income', icon: '\u{1F4B0}', color: '#c97d1a' },
];

const EXPENSE_CATS = [
  { value: 'fertilizer_chemicals', label: 'Fertiliser/Chemicals' },
  { value: 'seeds_seedlings', label: 'Seeds' },
  { value: 'transport_fuel', label: 'Fuel/Transport' },
  { value: 'equipment_tools', label: 'Equipment' },
  { value: 'other', label: 'Other' },
];

export default function QuickCapture() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({});
  const qc = useQueryClient();

  const { data: fields = [] } = useQuery({ queryKey: ['fields'], queryFn: () => import('../api/farmApi').then(m => m.getFields()), staleTime: 60000 });
  const activeFields = (Array.isArray(fields) ? fields : []).filter(f => f.status === 'active');

  const expenseMut = useMutation({ mutationFn: createExpense, onSuccess: () => done() });
  const harvestMut = useMutation({ mutationFn: createHarvest, onSuccess: () => done() });
  const waterMut = useMutation({ mutationFn: createWaterLog, onSuccess: () => done() });
  const incomeMut = useMutation({ mutationFn: createIncome, onSuccess: () => done() });

  const done = () => {
    setSuccess(true);
    qc.invalidateQueries();
    setTimeout(() => { setSuccess(false); setAction(null); setForm({}); setOpen(false); }, 1200);
  };

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = () => {
    if (action === 'expense') {
      expenseMut.mutate({
        field: form.field || activeFields[0]?.id,
        category: form.category || 'other',
        amount: parseFloat(form.amount) || 0,
        description: form.description || 'Quick entry',
        date: today(),
      });
    } else if (action === 'harvest') {
      harvestMut.mutate({
        field: form.field || activeFields[0]?.id,
        quantity_kg: parseFloat(form.quantity) || 0,
        harvest_date: today(),
        notes: form.notes || '',
      });
    } else if (action === 'water') {
      waterMut.mutate({
        field: form.field || activeFields[0]?.id,
        water_type: form.type || 'irrigation',
        amount_litres: parseFloat(form.litres) || 0,
        log_date: today(),
      });
    } else if (action === 'income') {
      incomeMut.mutate({
        field: form.field || activeFields[0]?.id,
        amount: parseFloat(form.amount) || 0,
        description: form.description || 'Quick income',
        income_date: today(),
      });
    }
  };

  if (success) {
    return (
      <>
        <div style={S.overlay} />
        <div style={S.modal}>
          <div style={S.successMsg}>{'\u2705'} Saved successfully!</div>
        </div>
      </>
    );
  }

  // Quick form modal
  if (action) {
    const act = ACTIONS.find(a => a.key === action);
    return (
      <>
        <div style={S.overlay} onClick={() => { setAction(null); setForm({}); }} />
        <div style={S.modal}>
          <div style={S.modalTitle}>
            <span>{act.icon}</span> {act.label}
          </div>

          {/* Field selector — shared by all actions */}
          <div style={S.field}>
            <label style={S.label}>Field</label>
            <select style={S.select} value={form.field || ''} onChange={e => set('field', e.target.value)}>
              {activeFields.map(f => <option key={f.id} value={f.id}>{f.name} ({f.crop})</option>)}
            </select>
          </div>

          {action === 'expense' && (
            <>
              <div style={S.row}>
                <div style={S.field}>
                  <label style={S.label}>Amount ($)</label>
                  <input style={S.input} type="number" placeholder="0.00" value={form.amount || ''} onChange={e => set('amount', e.target.value)} />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Category</label>
                  <select style={S.select} value={form.category || 'other'} onChange={e => set('category', e.target.value)}>
                    {EXPENSE_CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={S.field}>
                <label style={S.label}>Description</label>
                <input style={S.input} placeholder="What was this for?" value={form.description || ''} onChange={e => set('description', e.target.value)} />
              </div>
            </>
          )}

          {action === 'harvest' && (
            <div style={S.row}>
              <div style={S.field}>
                <label style={S.label}>Quantity (kg)</label>
                <input style={S.input} type="number" placeholder="0" value={form.quantity || ''} onChange={e => set('quantity', e.target.value)} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Notes</label>
                <input style={S.input} placeholder="Optional" value={form.notes || ''} onChange={e => set('notes', e.target.value)} />
              </div>
            </div>
          )}

          {action === 'water' && (
            <div style={S.row}>
              <div style={S.field}>
                <label style={S.label}>Amount (litres)</label>
                <input style={S.input} type="number" placeholder="0" value={form.litres || ''} onChange={e => set('litres', e.target.value)} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Type</label>
                <select style={S.select} value={form.type || 'irrigation'} onChange={e => set('type', e.target.value)}>
                  <option value="irrigation">Irrigation</option>
                  <option value="rainfall">Rainfall</option>
                  <option value="borehole">Borehole</option>
                  <option value="dam">Dam</option>
                </select>
              </div>
            </div>
          )}

          {action === 'income' && (
            <>
              <div style={S.field}>
                <label style={S.label}>Amount ($)</label>
                <input style={S.input} type="number" placeholder="0.00" value={form.amount || ''} onChange={e => set('amount', e.target.value)} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Description</label>
                <input style={S.input} placeholder="What was sold?" value={form.description || ''} onChange={e => set('description', e.target.value)} />
              </div>
            </>
          )}

          <button style={S.submitBtn(act.color)} onClick={submit}>
            Save {act.label}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {open && <div style={S.overlay} onClick={() => setOpen(false)} />}
      {open && (
        <div style={S.menu}>
          {ACTIONS.map((a, i) => (
            <div key={a.key} style={{ ...S.menuItem(a.color), animationDelay: `${i * 0.05}s` }}
              onClick={() => { setAction(a.key); setOpen(false); }}>
              <span style={S.menuLabel}>{a.label}</span>
              <div style={S.menuIcon(a.color)}>{a.icon}</div>
            </div>
          ))}
        </div>
      )}
      <button
        style={open ? S.fabOpen : S.fab}
        onClick={() => setOpen(!open)}
        className="quick-capture-fab"
      >
        +
      </button>
    </>
  );
}
