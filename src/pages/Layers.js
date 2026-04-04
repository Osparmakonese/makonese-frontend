import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLayerFlocks, createLayerFlock, deleteLayerFlock, getEggCollections, createEggCollection, getLayerExpenses, createLayerExpense, getLivestockSales, createLivestockSale } from '../api/farmApi';
import { fmt, today, IMAGES } from '../utils/format';
import ConfirmModal from '../components/ConfirmModal';

const EXPENSE_CATS = [
  ['feed', 'Feed'],
  ['medication', 'Medication'],
  ['vaccination', 'Vaccination'],
  ['equipment', 'Equipment'],
  ['other', 'Other'],
];

const S = {
  twoCol: { display: 'grid', gridTemplateColumns: '40% 1fr', gap: 20 },
  banner: { position: 'relative', height: 110, borderRadius: 10, overflow: 'hidden', marginBottom: 14 },
  bannerImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  bannerOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20, 30, 60, 0.85), rgba(0, 0, 0, 0.25))' },
  bannerContent: { position: 'absolute', bottom: 0, left: 0, padding: '12px 16px', color: '#fff', zIndex: 1 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif" },
  bannerSub: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 11 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18, marginBottom: 16 },
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 3, marginTop: 8 },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, outline: 'none', color: '#111827', boxSizing: 'border-box' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  btn: { width: '100%', padding: '10px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 14 },
  error: { fontSize: 10, color: '#c0392b', marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 10 },
  tabsContainer: { display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid #e5e7eb', paddingBottom: 0 },
  tabBtn: (active) => ({
    padding: '10px 16px',
    fontSize: 12,
    fontWeight: 600,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: active ? '#1a6b3a' : '#9ca3af',
    borderBottom: active ? '2px solid #1a6b3a' : '2px solid transparent',
    transition: 'all 0.2s',
  }),
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  th: { textAlign: 'left', padding: '8px 10px', fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' },
  td: { padding: '8px 10px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
  flockCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 14, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  flockCardInfo: { flex: 1 },
  flockCardName: { fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 },
  flockCardMeta: { fontSize: 11, color: '#6b7280', marginBottom: 4 },
  badge: { display: 'inline-block', fontSize: 9, fontWeight: 600, padding: '4px 8px', borderRadius: 4, marginRight: 4 },
  badgeActive: { background: '#dcfce7', color: '#166534' },
  badgeInactive: { background: '#fecaca', color: '#991b1b' },
  preview: { background: '#e8f5ee', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 14px', marginTop: 10, fontSize: 11, color: '#1a6b3a' },
  total: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: 14, marginTop: 16, fontSize: 12, fontWeight: 600, color: '#111827' },
};

export default function Layers() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('flocks');
  const [formFlock, setFormFlock] = useState({ flock_name: '', quantity: '', date_acquired: today(), purchase_price: '', notes: '' });
  const [formEgg, setFormEgg] = useState({ flock: '', date: today(), eggs_collected: '', broken: '', notes: '' });
  const [formExpense, setFormExpense] = useState({ flock: '', category: 'feed', description: '', amount: '', date: today(), notes: '' });
  const [formSale, setFormSale] = useState({ quantity: '', buyer: '', sale_price: '', sale_date: today(), description: '' });
  const [delConfirm, setDelConfirm] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const { data: flocks = [] } = useQuery({ queryKey: ['layerFlocks'], queryFn: getLayerFlocks });
  const { data: eggs = [] } = useQuery({ queryKey: ['eggCollections'], queryFn: () => getEggCollections() });
  const { data: expenses = [] } = useQuery({ queryKey: ['layerExpenses'], queryFn: () => getLayerExpenses() });
  const { data: sales = [] } = useQuery({ queryKey: ['livestockSales'], queryFn: () => getLivestockSales({ animal_type: 'eggs' }) });

  const mutFlock = useMutation({ mutationFn: createLayerFlock, onSuccess: () => { qc.invalidateQueries({ queryKey: ['layerFlocks'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); setFormFlock({ flock_name: '', quantity: '', date_acquired: today(), purchase_price: '', notes: '' }); } });
  const delFlockMut = useMutation({ mutationFn: (id) => deleteLayerFlock(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['layerFlocks'] }); setDelConfirm(null); } });
  const mutEgg = useMutation({ mutationFn: createEggCollection, onSuccess: () => { qc.invalidateQueries({ queryKey: ['eggCollections'] }); setFormEgg({ flock: '', date: today(), eggs_collected: '', broken: '', notes: '' }); } });
  const mutExpense = useMutation({ mutationFn: createLayerExpense, onSuccess: () => { qc.invalidateQueries({ queryKey: ['layerExpenses'] }); setFormExpense({ flock: '', category: 'feed', description: '', amount: '', date: today(), notes: '' }); } });
  const mutSale = useMutation({ mutationFn: createLivestockSale, onSuccess: () => { qc.invalidateQueries({ queryKey: ['livestockSales'] }); setFormSale({ quantity: '', buyer: '', sale_price: '', sale_date: today(), description: '' }); } });

  const setFlock = (k, v) => setFormFlock(p => ({ ...p, [k]: v }));
  const setEgg = (k, v) => setFormEgg(p => ({ ...p, [k]: v }));
  const setExp = (k, v) => setFormExpense(p => ({ ...p, [k]: v }));
  const setSale = (k, v) => setFormSale(p => ({ ...p, [k]: v }));

  const submitFlock = (e) => {
    e.preventDefault();
    if (!formFlock.flock_name || !formFlock.quantity) return;
    const payload = {
      flock_name: formFlock.flock_name,
      quantity: parseInt(formFlock.quantity),
      date_acquired: formFlock.date_acquired,
      purchase_price: formFlock.purchase_price ? parseFloat(formFlock.purchase_price) : null,
      notes: formFlock.notes,
    };
    setPendingAction({ type: 'flock', data: payload });
    setConfirmOpen(true);
  };

  const submitEgg = (e) => {
    e.preventDefault();
    if (!formEgg.flock || !formEgg.eggs_collected) return;
    const payload = {
      flock: parseInt(formEgg.flock),
      date: formEgg.date,
      eggs_collected: parseInt(formEgg.eggs_collected),
      broken: formEgg.broken ? parseInt(formEgg.broken) : 0,
      notes: formEgg.notes,
    };
    setPendingAction({ type: 'egg', data: payload });
    setConfirmOpen(true);
  };

  const submitExpense = (e) => {
    e.preventDefault();
    if (!formExpense.flock || !formExpense.category || !formExpense.description || !formExpense.amount) return;
    const payload = {
      flock: parseInt(formExpense.flock),
      category: formExpense.category,
      description: formExpense.description,
      amount: parseFloat(formExpense.amount),
      date: formExpense.date,
      notes: formExpense.notes,
    };
    setPendingAction({ type: 'expense', data: payload });
    setConfirmOpen(true);
  };

  const submitSale = (e) => {
    e.preventDefault();
    if (!formSale.quantity || !formSale.buyer || !formSale.sale_price) return;
    const payload = {
      quantity: parseInt(formSale.quantity),
      buyer: formSale.buyer,
      sale_price: parseFloat(formSale.sale_price),
      sale_date: formSale.sale_date,
      description: formSale.description,
      animal_type: 'eggs',
    };
    setPendingAction({ type: 'sale', data: payload });
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    if (!pendingAction) return;
    if (pendingAction.type === 'flock') mutFlock.mutate(pendingAction.data);
    else if (pendingAction.type === 'egg') mutEgg.mutate(pendingAction.data);
    else if (pendingAction.type === 'expense') mutExpense.mutate(pendingAction.data);
    else if (pendingAction.type === 'sale') mutSale.mutate(pendingAction.data);
    setPendingAction(null);
  };

  const totalBirds = flocks.reduce((sum, f) => sum + (f.quantity || 0), 0);
  const totalEggs = eggs.reduce((sum, e) => sum + (e.eggs_collected || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <>
      <div className="two-col-layout" style={S.twoCol}>
        {/* LEFT PANEL - ADD FLOCK FORM */}
        <div>
          <div style={S.banner}>
            <img src={IMAGES.layers || IMAGES.fields} alt="" style={S.bannerImg} />
            <div style={S.bannerOverlay} />
            <div style={S.bannerContent}>
              <div style={S.bannerTitle}>Layer Flocks</div>
              <div style={S.bannerSub}>Manage egg-laying poultry</div>
            </div>
          </div>
          <form style={S.card} onSubmit={submitFlock}>
            <label style={S.label}>Flock Name</label>
            <input style={S.input} value={formFlock.flock_name} onChange={e => setFlock('flock_name', e.target.value)} placeholder="e.g. Brown Hens - Batch 1" required />
            <label style={S.label}>Quantity (Birds)</label>
            <input style={S.input} type="number" min="1" value={formFlock.quantity} onChange={e => setFlock('quantity', e.target.value)} placeholder="e.g. 100" required />
            <div className="form-grid-2" style={S.row2}>
              <div>
                <label style={S.label}>Date Acquired</label>
                <input style={S.input} type="date" value={formFlock.date_acquired} onChange={e => setFlock('date_acquired', e.target.value)} />
              </div>
              <div>
                <label style={S.label}>Purchase Price</label>
                <input style={S.input} type="number" min="0" step="0.01" value={formFlock.purchase_price} onChange={e => setFlock('purchase_price', e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <label style={S.label}>Notes</label>
            <input style={S.input} value={formFlock.notes} onChange={e => setFlock('notes', e.target.value)} placeholder="e.g. Supplier details, breed..." />
            <button style={S.btn} type="submit" disabled={mutFlock.isPending}>
              {mutFlock.isPending ? 'Saving...' : '+ Add Flock'}
            </button>
            {mutFlock.isError && <p style={S.error}>{mutFlock.error?.response?.data?.detail || 'Failed to save'}</p>}
          </form>
        </div>

        {/* RIGHT PANEL - TABS */}
        <div>
          <div style={S.tabsContainer}>
            <button style={S.tabBtn(activeTab === 'flocks')} onClick={() => setActiveTab('flocks')}>Flocks</button>
            <button style={S.tabBtn(activeTab === 'eggs')} onClick={() => setActiveTab('eggs')}>Eggs</button>
            <button style={S.tabBtn(activeTab === 'expenses')} onClick={() => setActiveTab('expenses')}>Expenses</button>
            <button style={S.tabBtn(activeTab === 'sales')} onClick={() => setActiveTab('sales')}>Sales</button>
          </div>

          {/* FLOCKS TAB */}
          {activeTab === 'flocks' && (
            <div>
              <div style={S.sectionTitle}>Active Flocks</div>
              {flocks.length === 0 ? (
                <p style={{ fontSize: 11, color: '#9ca3af' }}>No flocks added yet.</p>
              ) : (
                <>
                  {flocks.map((flock) => (
                    <div key={flock.id} style={S.flockCard}>
                      <div style={S.flockCardInfo}>
                        <div style={S.flockCardName}>{flock.flock_name}</div>
                        <div style={S.flockCardMeta}>
                          <span style={{ ...S.badge, ...S.badgeActive }}>Active</span>
                          {flock.quantity} birds
                        </div>
                        <div style={{ fontSize: 10, color: '#9ca3af' }}>Mortality: {flock.mortality || 0} | Added: {flock.date_acquired}</div>
                      </div>
                      <button
                        onClick={() => setDelConfirm(flock.id)}
                        style={{ fontSize: 10, padding: '4px 8px', background: '#fff', color: '#c0392b', border: '1px solid #fca5a5', borderRadius: 4, cursor: 'pointer', marginLeft: 8 }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </>
              )}
              <div style={S.total}>Total Active Birds: {totalBirds}</div>
              {delConfirm && (
                <ConfirmModal
                  isOpen={true}
                  onCancel={() => setDelConfirm(null)}
                  onConfirm={() => { delFlockMut.mutate(delConfirm); setDelConfirm(null); }}
                  fields={[{ label: 'Action', value: 'Delete this flock?' }]}
                />
              )}
            </div>
          )}

          {/* EGGS TAB */}
          {activeTab === 'eggs' && (
            <div>
              <form style={S.card} onSubmit={submitEgg}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', marginBottom: 10 }}>Log Egg Collection</div>
                <label style={S.label}>Flock</label>
                <select style={S.input} value={formEgg.flock} onChange={e => setEgg('flock', e.target.value)} required>
                  <option value="">Select flock...</option>
                  {flocks.map(f => <option key={f.id} value={f.id}>{f.flock_name}</option>)}
                </select>
                <div className="form-grid-2" style={S.row2}>
                  <div>
                    <label style={S.label}>Date</label>
                    <input style={S.input} type="date" value={formEgg.date} onChange={e => setEgg('date', e.target.value)} />
                  </div>
                  <div>
                    <label style={S.label}>Eggs Collected</label>
                    <input style={S.input} type="number" min="0" value={formEgg.eggs_collected} onChange={e => setEgg('eggs_collected', e.target.value)} placeholder="0" required />
                  </div>
                </div>
                <label style={S.label}>Broken</label>
                <input style={S.input} type="number" min="0" value={formEgg.broken} onChange={e => setEgg('broken', e.target.value)} placeholder="0" />
                <label style={S.label}>Notes</label>
                <input style={S.input} value={formEgg.notes} onChange={e => setEgg('notes', e.target.value)} placeholder="e.g. weather conditions..." />
                <button style={S.btn} type="submit" disabled={mutEgg.isPending}>
                  {mutEgg.isPending ? 'Saving...' : '+ Log Collection'}
                </button>
                {mutEgg.isError && <p style={S.error}>{mutEgg.error?.response?.data?.detail || 'Failed to save'}</p>}
              </form>

              <div style={S.sectionTitle}>Egg Collection Records</div>
              {eggs.length === 0 ? (
                <p style={{ fontSize: 11, color: '#9ca3af' }}>No egg collections logged yet.</p>
              ) : (
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Flock</th>
                        <th style={S.th}>Date</th>
                        <th style={S.th}>Collected</th>
                        <th style={S.th}>Broken</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eggs.map((egg, i) => (
                        <tr key={egg.id || i}>
                          <td style={S.td}>{egg.flock_name || 'Unknown'}</td>
                          <td style={S.td}>{egg.date || egg.collection_date || '-'}</td>
                          <td style={S.td}>{egg.eggs_collected}</td>
                          <td style={S.td}>{egg.broken || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div style={S.total}>Total Eggs Collected: {totalEggs}</div>
            </div>
          )}

          {/* EXPENSES TAB */}
          {activeTab === 'expenses' && (
            <div>
              <form style={S.card} onSubmit={submitExpense}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', marginBottom: 10 }}>Log Expense</div>
                <label style={S.label}>Flock</label>
                <select style={S.input} value={formExpense.flock} onChange={e => setExp('flock', e.target.value)} required>
                  <option value="">Select flock...</option>
                  {flocks.map(f => <option key={f.id} value={f.id}>{f.flock_name}</option>)}
                </select>
                <label style={S.label}>Category</label>
                <select style={S.input} value={formExpense.category} onChange={e => setExp('category', e.target.value)}>
                  {EXPENSE_CATS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <label style={S.label}>Description</label>
                <input style={S.input} value={formExpense.description} onChange={e => setExp('description', e.target.value)} placeholder="e.g. 20kg feed sack" required />
                <div className="form-grid-2" style={S.row2}>
                  <div>
                    <label style={S.label}>Amount</label>
                    <input style={S.input} type="number" min="0" step="0.01" value={formExpense.amount} onChange={e => setExp('amount', e.target.value)} placeholder="0.00" required />
                  </div>
                  <div>
                    <label style={S.label}>Date</label>
                    <input style={S.input} type="date" value={formExpense.date} onChange={e => setExp('date', e.target.value)} />
                  </div>
                </div>
                <label style={S.label}>Notes</label>
                <input style={S.input} value={formExpense.notes} onChange={e => setExp('notes', e.target.value)} placeholder="e.g. supplier details..." />
                <button style={S.btn} type="submit" disabled={mutExpense.isPending}>
                  {mutExpense.isPending ? 'Saving...' : '+ Log Expense'}
                </button>
                {mutExpense.isError && <p style={S.error}>{mutExpense.error?.response?.data?.detail || 'Failed to save'}</p>}
              </form>

              <div style={S.sectionTitle}>Expense Records</div>
              {expenses.length === 0 ? (
                <p style={{ fontSize: 11, color: '#9ca3af' }}>No expenses logged yet.</p>
              ) : (
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Flock</th>
                        <th style={S.th}>Category</th>
                        <th style={S.th}>Description</th>
                        <th style={S.th}>Date</th>
                        <th style={S.th}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((exp, i) => (
                        <tr key={exp.id || i}>
                          <td style={S.td}>{exp.flock_name || 'Unknown'}</td>
                          <td style={S.td}>{exp.category}</td>
                          <td style={S.td}>{exp.description}</td>
                          <td style={S.td}>{exp.date || exp.expense_date || '-'}</td>
                          <td style={{ ...S.td, fontWeight: 700, color: '#c0392b' }}>{fmt(exp.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div style={S.total}>Total Expenses: {fmt(totalExpenses)}</div>
            </div>
          )}

          {/* SALES TAB */}
          {activeTab === 'sales' && (
            <div>
              <form style={S.card} onSubmit={submitSale}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', marginBottom: 10 }}>Log Egg Sale</div>
                <label style={S.label}>Quantity (Eggs)</label>
                <input style={S.input} type="number" min="0" value={formSale.quantity} onChange={e => setSale('quantity', e.target.value)} placeholder="e.g. 30" required />
                <label style={S.label}>Buyer</label>
                <input style={S.input} value={formSale.buyer} onChange={e => setSale('buyer', e.target.value)} placeholder="e.g. John's Restaurant" required />
                <div className="form-grid-2" style={S.row2}>
                  <div>
                    <label style={S.label}>Sale Price</label>
                    <input style={S.input} type="number" min="0" step="0.01" value={formSale.sale_price} onChange={e => setSale('sale_price', e.target.value)} placeholder="0.00" required />
                  </div>
                  <div>
                    <label style={S.label}>Sale Date</label>
                    <input style={S.input} type="date" value={formSale.sale_date} onChange={e => setSale('sale_date', e.target.value)} />
                  </div>
                </div>
                <label style={S.label}>Description</label>
                <input style={S.input} value={formSale.description} onChange={e => setSale('description', e.target.value)} placeholder="e.g. delivery notes..." />
                <button style={S.btn} type="submit" disabled={mutSale.isPending}>
                  {mutSale.isPending ? 'Saving...' : '+ Log Sale'}
                </button>
                {mutSale.isError && <p style={S.error}>{mutSale.error?.response?.data?.detail || 'Failed to save'}</p>}
              </form>

              <div style={S.sectionTitle}>Sales Records</div>
              {sales.length === 0 ? (
                <p style={{ fontSize: 11, color: '#9ca3af' }}>No sales logged yet.</p>
              ) : (
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Quantity</th>
                        <th style={S.th}>Buyer</th>
                        <th style={S.th}>Sale Date</th>
                        <th style={S.th}>Price</th>
                        <th style={S.th}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((sale, i) => (
                        <tr key={sale.id || i}>
                          <td style={S.td}>{sale.quantity}</td>
                          <td style={S.td}>{sale.buyer}</td>
                          <td style={S.td}>{sale.sale_date || '-'}</td>
                          <td style={S.td}>{fmt(sale.sale_price)}</td>
                          <td style={{ ...S.td, fontWeight: 700, color: '#1a6b3a' }}>{fmt((sale.quantity || 0) * (sale.sale_price || 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onCancel={() => { setConfirmOpen(false); setPendingAction(null); }}
        onConfirm={handleConfirm}
        fields={pendingAction ? [
          pendingAction.type === 'flock' && { label: 'Flock Name', value: pendingAction.data.flock_name },
          pendingAction.type === 'flock' && { label: 'Quantity', value: pendingAction.data.quantity },
          pendingAction.type === 'flock' && { label: 'Date Acquired', value: pendingAction.data.date_acquired },
          pendingAction.type === 'egg' && { label: 'Eggs Collected', value: pendingAction.data.eggs_collected },
          pendingAction.type === 'egg' && { label: 'Date', value: pendingAction.data.date },
          pendingAction.type === 'expense' && { label: 'Description', value: pendingAction.data.description },
          pendingAction.type === 'expense' && { label: 'Amount', value: fmt(pendingAction.data.amount) },
          pendingAction.type === 'expense' && { label: 'Date', value: pendingAction.data.date },
          pendingAction.type === 'sale' && { label: 'Quantity (Eggs)', value: pendingAction.data.quantity },
          pendingAction.type === 'sale' && { label: 'Buyer', value: pendingAction.data.buyer },
          pendingAction.type === 'sale' && { label: 'Sale Date', value: pendingAction.data.sale_date },
          pendingAction.type === 'sale' && { label: 'Total', value: fmt((pendingAction.data.quantity || 0) * (pendingAction.data.sale_price || 0)) },
        ].filter(Boolean) : []}
      />
    </>
  );
}
