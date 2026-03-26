import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStock, createStockItem, logStockUsage, getStockUsage, getFields } from '../api/farmApi';
import { fmt, today, IMAGES } from '../utils/format';

const CATEGORIES = ['Chemical', 'Fertiliser', 'Seed', 'Fuel', 'Equipment', 'Other'];
const UNITS = ['L', 'kg', 'bags', 'units', 'bottles', 'packs'];
const emptyItem = { name: '', category: 'Chemical', opening_qty: '', unit: 'L', unit_cost: '', alert_threshold: '' };
const emptyUsage = { item: '', field: '', opening_qty: '', date: today(), notes: '' };

const S = {
  banner: {
    height: 90, borderRadius: 10, padding: '20px 24px', marginBottom: 16,
    background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif", textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18, marginBottom: 16 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 },
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 3, marginTop: 8 },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, outline: 'none', color: '#111827' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 },
  btn: { width: '100%', padding: '10px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 12 },
  preview: { background: '#e8f5ee', borderRadius: 7, padding: '10px 14px', fontSize: 11, color: '#1a6b3a', marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 },
  stockItem: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px', marginBottom: 10 },
  barTrack: { height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden', marginTop: 6 },
  barFill: (color, pct) => ({ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 3, transition: 'width 0.4s' }),
};

export default function Stock() {
  const qc = useQueryClient();
  const [itemForm, setItemForm] = useState(emptyItem);
  const [usageForm, setUsageForm] = useState(emptyUsage);

  const { data: stock = [] } = useQuery({ queryKey: ['stock'], queryFn: getStock });
  const { data: fields = [] } = useQuery({ queryKey: ['fields'], queryFn: getFields });
  const { data: usage = [] } = useQuery({ queryKey: ['stockUsage'], queryFn: getStockUsage });

  const addMut = useMutation({
    mutationFn: createStockItem,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock'] }); qc.invalidateQueries({ queryKey: ['lowStock'] }); setItemForm(emptyItem); },
  });
  const usageMut = useMutation({
    mutationFn: logStockUsage,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock'] }); qc.invalidateQueries({ queryKey: ['stockUsage'] }); qc.invalidateQueries({ queryKey: ['expenses'] }); qc.invalidateQueries({ queryKey: ['lowStock'] }); setUsageForm(emptyUsage); },
  });

  const setI = (k, v) => setItemForm(p => ({ ...p, [k]: v }));
  const setU = (k, v) => setUsageForm(p => ({ ...p, [k]: v }));

  const selectedItem = stock.find(s => String(s.id) === String(usageForm.item));
  const qtyUsed = parseFloat(usageForm.opening_qty) || 0;
  const remainAfter = selectedItem ? (selectedItem.remaining ?? selectedItem.opening_qty) - qtyUsed : null;
  const costPreview = selectedItem ? qtyUsed * (selectedItem.unit_cost || 0) : 0;

  return (
    <>
      <div style={{ position: 'relative', height: 110, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
        <img src={IMAGES.stock} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,30,80,0.82), rgba(0,0,0,0.2))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '12px 16px', color: '#fff', zIndex: 1 }}>
          <div style={S.bannerTitle}>Stock &amp; Inventory Management</div>
          <div style={S.bannerSub}>Track chemicals, fertilizers, and farm supplies</div>
        </div>
      </div>

      <div className="two-col-layout" style={S.twoCol}>
        {/* Left */}
        <div>
          <div style={S.card}>
            <div style={S.cardTitle}>Add Stock Item</div>
            <form onSubmit={e => { e.preventDefault(); addMut.mutate({ ...itemForm, opening_qty: parseFloat(itemForm.opening_qty) || 0, unit_cost: parseFloat(itemForm.unit_cost) || 0, alert_threshold: parseFloat(itemForm.alert_threshold) || 0 }); }}>
              <div className="form-grid-2" style={S.row2}>
                <div><label style={S.label}>Name</label><input style={S.input} value={itemForm.name} onChange={e => setI('name', e.target.value)} placeholder="e.g. Lambda Cyhalothrin" required /></div>
                <div><label style={S.label}>Category</label><select style={S.input} value={itemForm.category} onChange={e => setI('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div className="form-grid-3" style={S.row3}>
                <div><label style={S.label}>Opening Qty</label><input style={S.input} type="number" min="0" step="0.01" value={itemForm.opening_qty} onChange={e => setI('opening_qty', e.target.value)} required placeholder="0" /></div>
                <div><label style={S.label}>Unit</label><select style={S.input} value={itemForm.unit} onChange={e => setI('unit', e.target.value)}>{UNITS.map(u => <option key={u}>{u}</option>)}</select></div>
                <div><label style={S.label}>Unit Cost ($)</label><input style={S.input} type="number" min="0" step="0.01" value={itemForm.unit_cost} onChange={e => setI('unit_cost', e.target.value)} placeholder="0.00" /></div>
              </div>
              <label style={S.label}>Alert Threshold</label>
              <input style={S.input} type="number" min="0" step="0.01" value={itemForm.alert_threshold} onChange={e => setI('alert_threshold', e.target.value)} placeholder="Warn when belowâ€¦" />
              <button style={S.btn} type="submit" disabled={addMut.isPending}>{addMut.isPending ? 'Savingâ€¦' : 'ï¼‹ Add Item'}</button>
            </form>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>Log Usage</div>
            <form onSubmit={e => { e.preventDefault(); usageMut.mutate({ item: parseInt(usageForm.item), field: parseInt(usageForm.field), opening_qty: parseFloat(usageForm.opening_qty), date: usageForm.date, notes: usageForm.notes }); }}>
              <div className="form-grid-2" style={S.row2}>
                <div><label style={S.label}>Item</label><select style={S.input} value={usageForm.item} onChange={e => setU('item', e.target.value)} required><option value="">Selectâ€¦</option>{stock.map(s => <option key={s.id} value={s.id}>{s.name} ({s.remaining ?? s.opening_qty} {s.unit})</option>)}</select></div>
                <div><label style={S.label}>Field</label><select style={S.input} value={usageForm.field} onChange={e => setU('field', e.target.value)} required><option value="">Selectâ€¦</option>{fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
              </div>
              <div className="form-grid-2" style={S.row2}>
                <div><label style={S.label}>opening_qty</label><input style={S.input} type="number" min="0" step="0.01" value={usageForm.opening_qty} onChange={e => setU('opening_qty', e.target.value)} required placeholder="0" /></div>
                <div><label style={S.label}>Date</label><input style={S.input} type="date" value={usageForm.date} onChange={e => setU('date', e.target.value)} /></div>
              </div>
              {selectedItem && qtyUsed > 0 && (
                <div style={S.preview}>After this: <strong>{remainAfter?.toFixed(1)} {selectedItem.unit}</strong> remaining Â· Cost to field: <strong>{fmt(costPreview)}</strong></div>
              )}
              <label style={S.label}>Notes</label>
              <input style={S.input} value={usageForm.notes} onChange={e => setU('notes', e.target.value)} placeholder="Optional" />
              <button style={S.btn} type="submit" disabled={usageMut.isPending}>{usageMut.isPending ? 'Loggingâ€¦' : 'ðŸ“‹ Log Usage'}</button>
            </form>
          </div>
        </div>

        {/* Right */}
        <div>
          <div style={S.sectionTitle}>Stock Levels</div>
          {stock.length === 0 && <p style={{ fontSize: 11, color: '#9ca3af' }}>No stock items yet.</p>}
          {(Array.isArray(stock) ? stock : []).map(s => {
            const rem = s.remaining ?? s.opening_qty;
            const pct = s.opening_qty > 0 ? (rem / s.opening_qty) * 100 : 0;
            const isLow = rem <= (s.alert_threshold || 0);
            const itemUsage = (Array.isArray(usage) ? usage : []).filter(u => u.item === s.id).slice(0, 3);
            return (
              <div key={s.id} style={S.stockItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>{s.category} Â· {fmt(s.unit_cost)}/{s.unit}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: isLow ? '#c0392b' : '#1a6b3a', fontFamily: "'Playfair Display', serif" }}>{rem}</div>
                    <div style={{ fontSize: 9, color: '#9ca3af' }}>{s.unit} left</div>
                  </div>
                </div>
                <div style={S.barTrack}><div style={S.barFill(isLow ? '#c0392b' : '#1a6b3a', pct)} /></div>
                {isLow && <div style={{ fontSize: 10, color: '#c0392b', fontWeight: 600, marginTop: 4 }}>âš  Below alert threshold ({s.alert_threshold} {s.unit})</div>}
                {itemUsage.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', marginBottom: 4 }}>RECENT:</div>
                    {itemUsage.map((u, i) => (
                      <div key={i} style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                        {u.date}: {u.opening_qty} {s.unit} â†’ {u.field_name || `Field #${u.field}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
