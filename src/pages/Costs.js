import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFields, getExpenses, createExpense } from '../api/farmApi';
import { fmt, today, IMAGES } from '../utils/format';

const CATEGORIES = [['seeds_seedlings','Seed'],['fertilizer_chemicals','Fertiliser'],['fertilizer_chemicals','Chemical'],['transport_fuel','Fuel'],['transport_fuel','Transport'],['equipment_tools','Equipment'],['food_meals','Labour'],['other','Other']];
const empty = { field: '', category: 'seeds_seedlings', description: '', amount: '', expense_date: today(), logged_by: '' };

const S = {
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  info: {
    background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8,
    padding: '12px 16px', fontSize: 11, color: '#1d4ed8', marginBottom: 14,
    display: 'flex', alignItems: 'center', gap: 8,
  },
  banner: {
    height: 90, borderRadius: 10, padding: '20px 24px', marginBottom: 16,
    background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif", textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18, marginBottom: 16 },
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 3, marginTop: 8 },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, outline: 'none', color: '#111827' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  btn: { width: '100%', padding: '10px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 14 },
  error: { fontSize: 10, color: '#c0392b', marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 10 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  th: { textAlign: 'left', padding: '8px 10px', fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' },
  td: { padding: '8px 10px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
};

export default function Costs() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);

  const { data: fields = [] } = useQuery({ queryKey: ['fields'], queryFn: getFields });
  const { data: expenses = [], isLoading } = useQuery({ queryKey: ['expenses'], queryFn: () => getExpenses() });

  const mut = useMutation({
    mutationFn: createExpense,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); setForm(empty); },
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    mut.mutate({ ...form, field: parseInt(form.field), amount: parseFloat(form.amount) });
  };

  return (
    <>
      <div style={S.info}>â„¹ï¸ Chemical &amp; fertilizer costs are automatically created when you log usage in the Stock tab.</div>

      <div className="two-col-layout" style={S.twoCol}>
        {/* Left */}
        <div>
          <div style={{ position: 'relative', height: 110, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
            <img src={IMAGES.cost} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,30,60,0.85), rgba(0,0,0,0.25))' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '12px 16px', color: '#fff', zIndex: 1 }}>
              <div style={S.bannerTitle}>Farm Costs &amp; Expenses</div>
              <div style={S.bannerSub}>Track all farm expenditure</div>
            </div>
          </div>

          <form style={S.card} onSubmit={submit}>
            <div className="form-grid-2" style={S.row2}>
              <div><label style={S.label}>Field</label><select style={S.input} value={form.field} onChange={e => set('field', e.target.value)} required><option value="">Select...</option>{fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
              <div><label style={S.label}>Category</label><select style={S.input} value={form.category} onChange={e => set('category', e.target.value)}>{CATEGORIES.map(([v,l]) => <option key={v+l} value={v}>{l}</option>)}</select></div>
            </div>
            <label style={S.label}>Description</label>
            <input style={S.input} value={form.description} onChange={e => set('description', e.target.value)} placeholder="e.g. 50kg Compound D" />
            <div className="form-grid-2" style={S.row2}>
              <div><label style={S.label}>Amount ($)</label><input style={S.input} type="number" min="0" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} required placeholder="0.00" /></div>
              <div><label style={S.label}>Date</label><input style={S.input} type="expense_date" value={form.date} onChange={e => set('expense_date', e.target.value)} /></div>
            </div>
            <label style={S.label}>Logged By</label>
            <input style={S.input} value={form.logged_by} onChange={e => set('logged_by', e.target.value)} placeholder="Your name" />
            <button style={S.btn} type="submit" disabled={mut.isPending}>{mut.isPending ? 'Saving...' : '+ Save Expense'}</button>
            {mut.isError && <p style={S.error}>{mut.error?.response?.data?.detail || 'Failed'}</p>}
          </form>
        </div>

        {/* Right */}
        <div>
          <div style={S.sectionTitle}>Expense Log</div>
          {isLoading ? <p style={{ fontSize: 11, color: '#9ca3af' }}>Loading...</p> : (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <table style={S.table}>
                <thead><tr>
                  <th style={S.th}>Description</th><th style={S.th}>Category</th>
                  <th style={S.th}>Field</th><th style={S.th}>Date</th><th style={S.th}>Amount</th>
                </tr></thead>
                <tbody>
                  {(Array.isArray(expenses) ? expenses : []).map((ex, i) => (
                    <tr key={ex.id || i}>
                      <td style={S.td}>
                        {ex.description || ex.category}
                        {ex.is_auto && <span className="pill-blue" style={{ marginLeft: 6 }}>AUTO</span>}
                      </td>
                      <td style={S.td}>{ex.category}</td>
                      <td style={S.td}>{ex.field_name || '"”'}</td>
                      <td style={S.td}>{ex.date}</td>
                      <td style={{ ...S.td, fontWeight: 700, color: '#c0392b' }}>{fmt(ex.amount)}</td>
                    </tr>
                  ))}
                  {(Array.isArray(expenses) ? expenses : []).length === 0 && (
                    <tr><td style={S.td} colSpan={5}>No expenses logged yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
