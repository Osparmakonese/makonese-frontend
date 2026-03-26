import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFields, createField, closeField } from '../api/farmApi';
import { fmt, today, cropEmoji, cropGradient, cropImage, IMAGES } from '../utils/format';
import FieldModal from '../components/FieldModal';
import ConfirmModal from '../components/ConfirmModal';

const CROPS = ['Tomatoes', 'Maize', 'Tobacco', 'Vegetables', 'Other'];

const empty = { name: '', crop: 'tomatoes', size_ha: '', plant_date: today(), notes: '' };

const S = {
  twoCol: { display: 'grid', gridTemplateColumns: '310px 1fr', gap: 20 },
  formCard: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '20px', position: 'sticky', top: 80,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  formTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700,
    color: '#111827', marginBottom: 16,
  },
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, marginTop: 10 },
  input: {
    width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb',
    borderRadius: 7, fontSize: 12, outline: 'none', color: '#111827',
    transition: 'border-color 0.15s',
  },
  textarea: {
    width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb',
    borderRadius: 7, fontSize: 12, outline: 'none', resize: 'vertical',
    minHeight: 60, color: '#111827',
  },
  btn: {
    width: '100%', padding: '10px', background: '#1a6b3a', color: '#fff',
    border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600,
    cursor: 'pointer', marginTop: 14, transition: 'background 0.15s',
  },
  error: { fontSize: 10, color: '#c0392b', marginTop: 4 },
  sectionTitle: {
    fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 14,
    fontFamily: "'Playfair Display', serif",
  },
  fieldGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  fcard: {
    background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb',
    overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s',
  },
  fcardImg: (crop) => ({
    height: 120, background: cropGradient(crop), position: 'relative',
    display: 'flex', alignItems: 'flex-end', padding: '0 14px 10px',
  }),
  fcardOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)',
  },
  fcardLabel: {
    position: 'relative', zIndex: 2, color: '#fff', fontSize: 14, fontWeight: 700,
    display: 'flex', alignItems: 'center', gap: 5,
    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
  },
  fcardBadge: { position: 'absolute', top: 8, right: 8, zIndex: 2 },
  fcardBody: { padding: '12px 14px' },
  fcardName: { fontWeight: 700, fontSize: 14, color: '#111827' },
  fcardMeta: { fontSize: 10, color: '#9ca3af', marginBottom: 8 },
  fcardStats: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6,
    borderTop: '1px solid #e5e7eb', paddingTop: 8, marginBottom: 8,
  },
  fcardStat: { textAlign: 'center' },
  fcardStatVal: (c) => ({ fontSize: 12, fontWeight: 700, color: c }),
  fcardStatLabel: { fontSize: 8, color: '#9ca3af', textTransform: 'uppercase' },
  closeBtn: {
    width: '100%', padding: '7px', background: 'none', border: '1px solid #c0392b',
    borderRadius: 6, color: '#c0392b', fontSize: 11, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.15s',
  },
  closedBox: {
    background: '#f3f4f6', borderRadius: 6, padding: '8px 12px',
    fontSize: 10, color: '#6b7280', textAlign: 'center',
  },
};

export default function Fields() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [formErrors, setFormErrors] = useState({});
  const [selectedField, setSelectedField] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [closeConfirm, setCloseConfirm] = useState(null);

  const { data: fields = [], isLoading } = useQuery({ queryKey: ['fields'], queryFn: getFields });

  const addMut = useMutation({
    mutationFn: createField,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['fields'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); setForm(empty); setFormErrors({}); },
    onError: (err) => { setFormErrors(err.response?.data || {}); },
  });

  const closeMut = useMutation({
    mutationFn: closeField,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['fields'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); },
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.size_ha || parseFloat(form.size_ha) <= 0) errs.size_ha = 'Must be > 0';
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setPending({...form});
    setConfirmOpen(true);
    return;
    addMut.mutate({ ...form, size_ha: parseFloat(form.size_ha) });
  };

  return (
    <>
      <div className="two-col-reverse" style={S.twoCol}>
        {/* Left: Form */}
        <div>
          <div style={S.formCard}>
            <div style={S.formTitle}>Open New Field</div>
            <form onSubmit={submit}>
              <label style={S.label}>Field Name</label>
              <input style={S.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Block A" />
              {formErrors.name && <div style={S.error}>{formErrors.name}</div>}

              <label style={S.label}>Crop</label>
              <select style={S.input} value={form.crop} onChange={e => set('crop', e.target.value)}>
                <option value='tomatoes'>Tomatoes</option><option value='maize'>Maize</option><option value='tobacco'>Tobacco</option><option value='vegetables'>Vegetables</option><option value='other'>Other</option>
              </select>

              <label style={S.label}>Size (hectares)</label>
              <input style={S.input} type="number" step="0.01" min="0" value={form.size_ha} onChange={e => set('size_ha', e.target.value)} placeholder="2.5" />
              {formErrors.size_ha && <div style={S.error}>{formErrors.size_ha}</div>}

              <label style={S.label}>Planting Date</label>
              <input style={S.input} type="date" value={form.plant_date} onChange={e => set('plant_date', e.target.value)} />

              <label style={S.label}>Notes</label>
              <textarea style={S.textarea} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional notes..." />

              <button style={S.btn} type="submit" disabled={addMut.isPending}
                onMouseEnter={e => { e.currentTarget.style.background = '#2d9e58'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a6b3a'; }}
              >
                {addMut.isPending ? 'Saving...' : '+ Open Field'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Field list */}
        <div>
          <div style={S.sectionTitle}>All Fields ({fields.length})</div>
          {isLoading && <p style={{ fontSize: 12, color: '#9ca3af' }}>Loading...</p>}
          <div style={S.fieldGrid}>
            {fields.map(f => {
              const fRev = f.revenue || 0;
              const fCost = (f.costs || 0) + (f.labour || 0);
              const fNet = fRev - fCost;
              return (
                <div key={f.id} className="fcard" style={S.fcard}>
                  <div className="fcard-img" style={{ position: 'relative', height: 120, overflow: 'hidden' }} onClick={() => setSelectedField(f)}>
                    <img src={cropImage(f.crop)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                    <div style={S.fcardOverlay} />
                    <span style={{ ...S.fcardLabel, position: 'absolute', bottom: 10, left: 14 }}>{cropEmoji(f.crop)} {f.name}</span>
                    <span className={`pill-${f.status === 'active' ? 'green' : f.status === 'closed' ? 'red' : 'amber'}`} style={S.fcardBadge}>{f.status}</span>
                  </div>
                  <div style={S.fcardBody} onClick={() => setSelectedField(f)}>
                    <div style={S.fcardName}>{f.name}</div>
                    <div style={S.fcardMeta}>{f.size_ha || f.hectares} ha - Planted {f.plant_date || '"”'}</div>
                    <div style={S.fcardStats}>
                      <div style={S.fcardStat}><div style={S.fcardStatVal('#1a6b3a')}>{fmt(fRev)}</div><div style={S.fcardStatLabel}>Revenue</div></div>
                      <div style={S.fcardStat}><div style={S.fcardStatVal('#c0392b')}>{fmt(fCost)}</div><div style={S.fcardStatLabel}>Costs</div></div>
                      <div style={S.fcardStat}><div style={S.fcardStatVal(fNet >= 0 ? '#1a6b3a' : '#c0392b')}>{fmt(fNet)}</div><div style={S.fcardStatLabel}>Net</div></div>
                    </div>
                  </div>
                  {f.status === 'active' && (
                    <div style={{ padding: '0 14px 12px' }}>
                      <button style={S.closeBtn}
                        onClick={() => setCloseConfirm(f.id)}
                        disabled={closeMut.isPending}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fdecea'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                      >Close Field</button>
                    </div>
                  )}
                  {f.status === 'closed' && (
                    <div style={{ padding: '0 14px 12px' }}><div style={S.closedBox}>Closed {f.closed_date || ''}</div></div>
                  )}
                </div>
              );
            })}
          </div>
          {!isLoading && fields.length === 0 && <p style={{ fontSize: 12, color: '#9ca3af' }}>No fields created yet.</p>}
        </div>
      </div>
      <FieldModal field={selectedField} isOpen={!!selectedField} onClose={() => setSelectedField(null)} />
      <ConfirmModal
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          addMut.mutate({ ...pending, size_ha: parseFloat(pending.size_ha) });
        }}
        fields={pending ? [
          { label: 'Field Name', value: pending.name },
          { label: 'Crop', value: pending.crop },
          { label: 'Size (ha)', value: pending.size_ha },
          { label: 'Planting Date', value: pending.plant_date },
        ] : []}
      />
      <ConfirmModal
        isOpen={!!closeConfirm}
        onCancel={() => setCloseConfirm(null)}
        onConfirm={() => { closeMut.mutate(closeConfirm); setCloseConfirm(null); }}
        fields={[{ label: 'Action', value: 'Close this field permanently' }]}
      />
    </>
  );
}
