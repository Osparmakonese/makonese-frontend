import React, { useState, useEffect } from 'react';

const STATUS_OPTIONS = [
  ['active', 'Active'],
  ['sold', 'Sold'],
  ['deceased', 'Deceased'],
  ['culled', 'Culled'],
];

const S = {
  backdrop: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    background: '#fff', borderRadius: 10, padding: 22, width: 460, maxWidth: '92vw',
    maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
  },
  title: { fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4, fontFamily: "'Playfair Display', serif" },
  sub: { fontSize: 11, color: '#6b7280', marginBottom: 14 },
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 3, marginTop: 8 },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, outline: 'none', color: '#111827', boxSizing: 'border-box' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  actions: { display: 'flex', gap: 8, marginTop: 16 },
  cancel: { flex: 1, padding: '10px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  save: { flex: 1, padding: '10px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
};

/**
 * Generic edit modal for livestock animals (Cattle/Goat/Sheep/Pig).
 *
 * Props:
 *   isOpen, onClose
 *   animal: the object to edit (must include id)
 *   animalLabel: e.g. "Cattle", "Goat"
 *   onSave: async (id, payload) => void  — called with PATCH-style partial payload
 *   extraFields: optional [{ key, label, type }] for species-specific fields (e.g. litter_number for pigs)
 */
export default function LivestockEditModal({ isOpen, onClose, animal, animalLabel = 'Animal', onSave, extraFields = [] }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (animal) {
      setForm({
        tag_number: animal.tag_number || '',
        name: animal.name || '',
        breed: animal.breed || '',
        weight_kg: animal.weight_kg || '',
        status: animal.status || 'active',
        cause_of_death: animal.cause_of_death || '',
        date_of_death: animal.date_of_death || '',
        notes: animal.notes || '',
        ...Object.fromEntries(extraFields.map(f => [f.key, animal[f.key] ?? ''])),
      });
      setErr(null);
    }
  }, [animal]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen || !animal) return null;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        name: form.name,
        breed: form.breed,
        weight_kg: parseFloat(form.weight_kg) || 0,
        status: form.status,
        cause_of_death: form.cause_of_death || '',
        date_of_death: form.date_of_death || null,
        notes: form.notes || '',
      };
      extraFields.forEach(f => {
        if (f.type === 'number') payload[f.key] = parseFloat(form[f.key]) || 0;
        else payload[f.key] = form[f.key] || '';
      });
      await onSave(animal.id, payload);
      onClose();
    } catch (e2) {
      setErr(e2?.response?.data?.detail || e2?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.title}>Edit {animalLabel}</div>
        <div style={S.sub}>Tag: <strong>{form.tag_number}</strong> (cannot be changed)</div>
        <form onSubmit={handleSave}>
          <div style={S.row2}>
            <div><label style={S.label}>Name</label><input style={S.input} value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div><label style={S.label}>Breed</label><input style={S.input} value={form.breed} onChange={e => set('breed', e.target.value)} /></div>
          </div>

          <div style={S.row2}>
            <div><label style={S.label}>Weight (kg)</label><input style={S.input} type="number" min="0" step="0.1" value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)} /></div>
            <div>
              <label style={S.label}>Status</label>
              <select style={S.input} value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          {(form.status === 'deceased' || form.status === 'culled') && (
            <div style={S.row2}>
              <div><label style={S.label}>Cause of Death</label><input style={S.input} value={form.cause_of_death} onChange={e => set('cause_of_death', e.target.value)} placeholder="e.g. illness" /></div>
              <div><label style={S.label}>Date of Death</label><input style={S.input} type="date" value={form.date_of_death} onChange={e => set('date_of_death', e.target.value)} /></div>
            </div>
          )}

          {extraFields.map(f => (
            <div key={f.key}>
              <label style={S.label}>{f.label}</label>
              <input style={S.input} type={f.type || 'text'} value={form[f.key]} onChange={e => set(f.key, e.target.value)} />
            </div>
          ))}

          <label style={S.label}>Notes</label>
          <input style={S.input} value={form.notes} onChange={e => set('notes', e.target.value)} />

          {err && <div style={{ marginTop: 10, padding: '8px 12px', background: '#fef2f2', color: '#991b1b', fontSize: 11, borderRadius: 6 }}>{err}</div>}

          <div style={S.actions}>
            <button type="button" style={S.cancel} onClick={onClose}>Cancel</button>
            <button type="submit" style={S.save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
