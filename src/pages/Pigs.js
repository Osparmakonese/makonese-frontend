import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPigs, createPig, deletePig, getPigHealth, createPigHealth, getLivestockSales, createLivestockSale } from '../api/farmApi';
import { today, fmt, qty, IMAGES } from '../utils/format';
import ConfirmModal from '../components/ConfirmModal';

const SEX_OPTIONS = [['boar', 'Boar'], ['sow', 'Sow'], ['piglet', 'Piglet']];
const HEALTH_TYPES = [['illness', 'Illness'], ['injury', 'Injury'], ['vaccination', 'Vaccination'], ['checkup', 'Checkup'], ['treatment', 'Treatment']];

const emptyPig = { tag_number: '', name: '', breed: '', sex: 'piglet', date_of_birth: '', date_acquired: today(), purchase_price: '', weight_kg: '', litter_number: '', status: 'active', cause_of_death: '', date_of_death: '', notes: '' };
const emptyHealth = { pig: '', record_type: 'checkup', description: '', date: today(), cost: '', vet_name: '', next_due: '', notes: '' };
const emptySale = { pig: '', quantity: '1', buyer: '', sale_price: '', sale_date: today(), description: '' };

const STATUS_OPTIONS = [['active','Active'],['sold','Sold'],['deceased','Deceased'],['culled','Culled']];

const S = {
  banner: {
    height: 90, borderRadius: 10, padding: '20px 24px', marginBottom: 16,
    background: 'linear-gradient(135deg, #1a6b3a, #2d9e58)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif", textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
  twoCol: { display: 'grid', gridTemplateColumns: '40% 60%', gap: 20 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18, marginBottom: 16 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 },
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 3, marginTop: 8 },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, outline: 'none', color: '#111827' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 },
  btn: { width: '100%', padding: '10px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 12 },
  preview: { background: '#e8f5ee', borderRadius: 7, padding: '10px 14px', fontSize: 11, color: '#1a6b3a', marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 },
  tabContainer: { display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid #e5e7eb', paddingBottom: 12 },
  tab: (active) => ({
    padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
    color: active ? '#1a6b3a' : '#9ca3af',
    borderBottom: active ? '2px solid #1a6b3a' : 'none',
    background: 'none', border: 'none',
  }),
  pigCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px', marginBottom: 10 },
  badge: (color) => ({ display: 'inline-block', padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, color: '#fff', background: color, marginLeft: 6 }),
  deleteBtn: { padding: '4px 8px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: 'pointer' },
  healthRecord: { background: '#f9fafb', borderRadius: 8, padding: '10px 12px', marginBottom: 8, fontSize: 11, borderLeft: '3px solid #c97d1a' },
  saleRecord: { background: '#f9fafb', borderRadius: 8, padding: '10px 12px', marginBottom: 8, fontSize: 11, borderLeft: '3px solid #059669' },
  countBadge: { display: 'inline-block', background: '#c97d1a', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, marginLeft: 8 },
};

export default function Pigs() {
  const qc = useQueryClient();
  const [pigForm, setPigForm] = useState(emptyPig);
  const [healthForm, setHealthForm] = useState(emptyHealth);
  const [saleForm, setSaleForm] = useState(emptySale);
  const [activeTab, setActiveTab] = useState('herd');
  const [delConfirm, setDelConfirm] = useState(null);

  const { data: pigs = [] } = useQuery({ queryKey: ['pigs'], queryFn: getPigs });
  const { data: health = [] } = useQuery({ queryKey: ['pigHealth'], queryFn: () => getPigHealth() });
  const { data: sales = [] } = useQuery({ queryKey: ['livestockSales'], queryFn: () => getLivestockSales({ animal_type: 'pig' }) });

  const addPigMut = useMutation({
    mutationFn: (data) => createPig({
      ...data,
      purchase_price: parseFloat(data.purchase_price) || 0,
      weight_kg: parseFloat(data.weight_kg) || 0,
      date_of_birth: data.date_of_birth || null,
      date_of_death: data.date_of_death || null,
      status: data.status || 'active',
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pigs'] }); setPigForm(emptyPig); },
  });

  const addHealthMut = useMutation({
    mutationFn: createPigHealth,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pigHealth'] }); setHealthForm(emptyHealth); },
  });

  const addSaleMut = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, animal_type: 'pig', quantity: parseInt(data.quantity) || 1, sale_price: parseFloat(data.sale_price) || 0 };
      if (payload.pig) payload.pig = parseInt(payload.pig);
      else delete payload.pig;
      return createLivestockSale(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['livestockSales'] }); qc.invalidateQueries({ queryKey: ['pigs'] }); setSaleForm(emptySale); },
  });

  const delMut = useMutation({
    mutationFn: (id) => deletePig(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pigs'] }); setDelConfirm(null); },
  });

  const setP = (k, v) => setPigForm(p => ({ ...p, [k]: v }));
  const setH = (k, v) => setHealthForm(p => ({ ...p, [k]: v }));
  const setS = (k, v) => setSaleForm(p => ({ ...p, [k]: v }));

  // Count active pigs
  const activePigs = pigs.filter(p => p.status === 'active' || !p.status).length;

  // Get pig by id for health form
  const selectedPig = pigs.find(p => String(p.id) === String(healthForm.pig));

  // Filter sales for pigs
  const pigSales = (Array.isArray(sales) ? sales : []).filter(s => s.animal_type === 'pig');

  return (
    <>
      <div style={{ position: 'relative', height: 110, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
        <img src={IMAGES.pigs || IMAGES.fields} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,107,58,0.82), rgba(0,0,0,0.2))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '12px 16px', color: '#fff', zIndex: 1 }}>
          <div style={S.bannerTitle}>Pig Herd Management</div>
          <div style={S.bannerSub}>Track animals, health records, and sales</div>
        </div>
      </div>

      <div className="two-col-layout" style={S.twoCol}>
        {/* LEFT PANEL: Form */}
        <div>
          <div style={S.card}>
            <div style={S.cardTitle}>Add Pig</div>
            <form onSubmit={e => { e.preventDefault(); addPigMut.mutate(pigForm); }}>
              <div className="form-grid-2" style={S.row2}>
                <div><label style={S.label}>Tag Number *</label><input style={S.input} value={pigForm.tag_number} onChange={e => setP('tag_number', e.target.value)} placeholder="e.g. PIG-001" required /></div>
                <div><label style={S.label}>Name</label><input style={S.input} value={pigForm.name} onChange={e => setP('name', e.target.value)} placeholder="Pig name" /></div>
              </div>
              <div className="form-grid-2" style={S.row2}>
                <div><label style={S.label}>Breed</label><input style={S.input} value={pigForm.breed} onChange={e => setP('breed', e.target.value)} placeholder="e.g. Landrace" /></div>
                <div><label style={S.label}>Sex</label><select style={S.input} value={pigForm.sex} onChange={e => setP('sex', e.target.value)}>{SEX_OPTIONS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></div>
              </div>
              <div className="form-grid-2" style={S.row2}>
                <div><label style={S.label}>Date of Birth</label><input style={S.input} type="date" value={pigForm.date_of_birth} onChange={e => setP('date_of_birth', e.target.value)} /></div>
                <div><label style={S.label}>Date Acquired</label><input style={S.input} type="date" value={pigForm.date_acquired} onChange={e => setP('date_acquired', e.target.value)} /></div>
              </div>
              <div className="form-grid-2" style={S.row2}>
                <div><label style={S.label}>Purchase Price</label><input style={S.input} type="number" step="0.01" value={pigForm.purchase_price} onChange={e => setP('purchase_price', e.target.value)} placeholder="0.00" /></div>
                <div><label style={S.label}>Weight (kg)</label><input style={S.input} type="number" step="0.1" value={pigForm.weight_kg} onChange={e => setP('weight_kg', e.target.value)} placeholder="0.0" /></div>
              </div>
              <label style={S.label}>Litter Number</label>
              <input style={S.input} value={pigForm.litter_number} onChange={e => setP('litter_number', e.target.value)} placeholder="e.g. 2024-001" />

              <label style={S.label}>Status</label>
              <select style={S.input} value={pigForm.status} onChange={e => setP('status', e.target.value)}>
                {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>

              {(pigForm.status === 'deceased' || pigForm.status === 'culled') && (
                <div style={S.row2}>
                  <div><label style={S.label}>Cause of Death</label><input style={S.input} value={pigForm.cause_of_death} onChange={e => setP('cause_of_death', e.target.value)} placeholder="e.g. illness" /></div>
                  <div><label style={S.label}>Date of Death</label><input style={S.input} type="date" value={pigForm.date_of_death} onChange={e => setP('date_of_death', e.target.value)} /></div>
                </div>
              )}

              <label style={S.label}>Notes</label>
              <input style={S.input} value={pigForm.notes} onChange={e => setP('notes', e.target.value)} placeholder="Any additional info..." />
              <button style={S.btn} type="submit" disabled={addPigMut.isPending}>{addPigMut.isPending ? 'Saving...' : '+ Add Pig'}</button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: Tabs */}
        <div>
          <div style={S.sectionTitle}>
            Pig Herd
            <span style={S.countBadge}>{activePigs} Active</span>
          </div>

          {/* Tabs */}
          <div style={S.tabContainer}>
            <button style={S.tab(activeTab === 'herd')} onClick={() => setActiveTab('herd')}>Herd</button>
            <button style={S.tab(activeTab === 'health')} onClick={() => setActiveTab('health')}>Health</button>
            <button style={S.tab(activeTab === 'sales')} onClick={() => setActiveTab('sales')}>Sales</button>
          </div>

          {/* HERD TAB */}
          {activeTab === 'herd' && (
            <div>
              {pigs.length === 0 && <p style={{ fontSize: 11, color: '#9ca3af' }}>No pigs recorded yet.</p>}
              {pigs.map(pig => {
                const sexColor = pig.sex === 'boar' ? '#2563eb' : pig.sex === 'sow' ? '#ec4899' : '#8b5cf6';
                return (
                  <div key={pig.id} style={S.pigCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                          {pig.tag_number}
                          {pig.name && ` - ${pig.name}`}
                          <span style={S.badge(sexColor)}>{pig.sex}</span>
                        </div>
                        {pig.breed && <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>Breed: {pig.breed}</div>}
                        {pig.weight_kg && <div style={{ fontSize: 10, color: '#6b7280' }}>Weight: {qty(pig.weight_kg)} kg</div>}
                        {pig.litter_number && <div style={{ fontSize: 10, color: '#6b7280' }}>Litter: {pig.litter_number}</div>}
                        {pig.purchase_price && <div style={{ fontSize: 10, color: '#6b7280' }}>Price: {fmt(pig.purchase_price)}</div>}
                        {pig.status && pig.status !== 'active' && (
                          <div style={{ marginTop: 4 }}>
                            <span style={S.badge(pig.status === 'sold' ? '#1e40af' : pig.status === 'deceased' ? '#991b1b' : '#92400e')}>{pig.status}</span>
                          </div>
                        )}
                        {(pig.status === 'deceased' || pig.status === 'culled') && pig.cause_of_death && (
                          <div style={{ fontSize: 10, color: '#991b1b', marginTop: 6, padding: '6px 10px', background: '#fef2f2', borderRadius: 6 }}>
                            <strong>{pig.status === 'deceased' ? 'Died' : 'Culled'}:</strong> {pig.cause_of_death}{pig.date_of_death && ` on ${pig.date_of_death}`}
                          </div>
                        )}
                      </div>
                      <button style={S.deleteBtn} onClick={() => setDelConfirm(pig.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* HEALTH TAB */}
          {activeTab === 'health' && (
            <div>
              <div style={S.card}>
                <div style={S.cardTitle}>Log Health Record</div>
                <form onSubmit={e => { e.preventDefault(); addHealthMut.mutate(healthForm); }}>
                  <label style={S.label}>Pig</label>
                  <select style={S.input} value={healthForm.pig} onChange={e => setH('pig', e.target.value)} required>
                    <option value="">Select a pig...</option>
                    {pigs.map(p => <option key={p.id} value={p.id}>{p.tag_number} {p.name ? `- ${p.name}` : ''}</option>)}
                  </select>
                  <div className="form-grid-2" style={S.row2}>
                    <div><label style={S.label}>Type</label><select style={S.input} value={healthForm.record_type} onChange={e => setH('record_type', e.target.value)}>{HEALTH_TYPES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></div>
                    <div><label style={S.label}>Date</label><input style={S.input} type="date" value={healthForm.date} onChange={e => setH('date', e.target.value)} /></div>
                  </div>
                  <label style={S.label}>Description</label>
                  <input style={S.input} value={healthForm.description} onChange={e => setH('description', e.target.value)} placeholder="e.g. Routine checkup" />
                  <div className="form-grid-2" style={S.row2}>
                    <div><label style={S.label}>Cost</label><input style={S.input} type="number" step="0.01" value={healthForm.cost} onChange={e => setH('cost', e.target.value)} placeholder="0.00" /></div>
                    <div><label style={S.label}>Vet Name</label><input style={S.input} value={healthForm.vet_name} onChange={e => setH('vet_name', e.target.value)} placeholder="Optional" /></div>
                  </div>
                  <label style={S.label}>Next Due</label>
                  <input style={S.input} type="date" value={healthForm.next_due} onChange={e => setH('next_due', e.target.value)} />
                  <label style={S.label}>Notes</label>
                  <input style={S.input} value={healthForm.notes} onChange={e => setH('notes', e.target.value)} placeholder="Additional notes" />
                  <button style={S.btn} type="submit" disabled={addHealthMut.isPending}>{addHealthMut.isPending ? 'Logging...' : '+ Log Health'}</button>
                </form>
              </div>

              <div style={S.sectionTitle}>Health Records</div>
              {health.length === 0 && <p style={{ fontSize: 11, color: '#9ca3af' }}>No health records yet.</p>}
              {health.map(rec => {
                const pig = pigs.find(p => p.id === rec.pig);
                return (
                  <div key={rec.id} style={S.healthRecord}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{pig?.tag_number || 'Unknown'} - {rec.record_type}</div>
                    <div style={{ color: '#6b7280', fontSize: 10, marginTop: 2 }}>{rec.date} {rec.vet_name && `• ${rec.vet_name}`}</div>
                    {rec.description && <div style={{ color: '#6b7280', fontSize: 10 }}>{rec.description}</div>}
                    {rec.cost && <div style={{ color: '#c97d1a', fontWeight: 600, fontSize: 10 }}>{fmt(rec.cost)}</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* SALES TAB */}
          {activeTab === 'sales' && (
            <div>
              <div style={S.card}>
                <div style={S.cardTitle}>Log Sale</div>
                <form onSubmit={e => { e.preventDefault(); addSaleMut.mutate(saleForm); }}>
                  <label style={S.label}>Sell from Herd <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional — links sale to animal)</span></label>
                  <select style={S.input} value={saleForm.pig} onChange={e => setS('pig', e.target.value)}>
                    <option value="">Quick sale (no link)</option>
                    {pigs.filter(p => (p.status || 'active') === 'active').map(p => (
                      <option key={p.id} value={p.id}>{p.tag_number} - {p.name || p.breed || 'Unnamed'}</option>
                    ))}
                  </select>
                  <div className="form-grid-2" style={S.row2}>
                    <div><label style={S.label}>Quantity</label><input style={S.input} type="number" min="1" value={saleForm.quantity} onChange={e => setS('quantity', e.target.value)} placeholder="1" required /></div>
                    <div><label style={S.label}>Sale Date</label><input style={S.input} type="date" value={saleForm.sale_date} onChange={e => setS('sale_date', e.target.value)} /></div>
                  </div>
                  <label style={S.label}>Buyer</label>
                  <input style={S.input} value={saleForm.buyer} onChange={e => setS('buyer', e.target.value)} placeholder="e.g. Wholesale Market" required />
                  <label style={S.label}>Sale Price</label>
                  <input style={S.input} type="number" step="0.01" value={saleForm.sale_price} onChange={e => setS('sale_price', e.target.value)} placeholder="0.00" required />
                  <label style={S.label}>Description</label>
                  <input style={S.input} value={saleForm.description} onChange={e => setS('description', e.target.value)} placeholder="Notes about sale" />
                  <button style={S.btn} type="submit" disabled={addSaleMut.isPending}>{addSaleMut.isPending ? 'Logging...' : '+ Log Sale'}</button>
                </form>
              </div>

              <div style={S.sectionTitle}>Sales History</div>
              {pigSales.length === 0 && <p style={{ fontSize: 11, color: '#9ca3af' }}>No pig sales recorded yet.</p>}
              {pigSales.map(sale => (
                <div key={sale.id} style={S.saleRecord}>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{sale.quantity} pig(s) to {sale.buyer}</div>
                  <div style={{ color: '#6b7280', fontSize: 10, marginTop: 2 }}>{sale.sale_date}</div>
                  <div style={{ color: '#059669', fontWeight: 600, fontSize: 10, marginTop: 2 }}>{fmt(sale.sale_price)} total</div>
                  {sale.description && <div style={{ color: '#6b7280', fontSize: 10 }}>{sale.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={delConfirm !== null}
        onConfirm={() => { delMut.mutate(delConfirm); }}
        onCancel={() => setDelConfirm(null)}
        fields={[
          { label: 'Action', value: 'Delete pig' },
          { label: 'Pig Tag', value: pigs.find(p => p.id === delConfirm)?.tag_number || 'Unknown' },
        ]}
      />
    </>
  );
}
