import React, { useState, useEffect } from 'react';

const S = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  modal: { background: '#fff', borderRadius: 10, padding: 22, width: 420, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' },
  title: { fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 14 },
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 3, marginTop: 10 },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, boxSizing: 'border-box', minHeight: 60, resize: 'vertical' },
  btnRow: { display: 'flex', gap: 8, marginTop: 16 },
  saveBtn: { flex: 1, padding: '10px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '10px', background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
};

export default function HealthRecordEditModal({ isOpen, record, onClose, onSave, showWoolKg = false }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (record) {
      setForm({
        record_type: record.record_type || '',
        description: record.description || '',
        record_date: record.record_date || '',
        cost: record.cost || '',
        vet_name: record.vet_name || '',
        next_due: record.next_due || '',
        wool_kg: record.wool_kg || '',
        notes: record.notes || '',
      });
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const payload = {
      description: form.description,
      record_date: form.record_date,
      cost: parseFloat(form.cost) || 0,
      vet_name: form.vet_name || '',
      next_due: form.next_due || null,
      notes: form.notes || '',
    };
    if (showWoolKg) payload.wool_kg = parseFloat(form.wool_kg) || 0;
    await onSave(record.id, payload);
    onClose();
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.title}>Edit Health Record</div>

        <label style={S.label}>Description</label>
        <textarea style={S.textarea} value={form.description} onChange={e => set('description', e.target.value)} />

        <label style={S.label}>Date</label>
        <input style={S.input} type="date" value={form.record_date} onChange={e => set('record_date', e.target.value)} />

        <label style={S.label}>Cost</label>
        <input style={S.input} type="number" step="0.01" min="0" value={form.cost} onChange={e => set('cost', e.target.value)} />

        <label style={S.label}>Vet Name</label>
        <input style={S.input} value={form.vet_name} onChange={e => set('vet_name', e.target.value)} />

        <label style={S.label}>Next Due</label>
        <input style={S.input} type="date" value={form.next_due || ''} onChange={e => set('next_due', e.target.value)} />

        {showWoolKg && (
          <>
            <label style={S.label}>Wool Yield (kg)</label>
            <input style={S.input} type="number" step="0.01" min="0" value={form.wool_kg} onChange={e => set('wool_kg', e.target.value)} />
          </>
        )}

        <label style={S.label}>Notes</label>
        <textarea style={S.textarea} value={form.notes} onChange={e => set('notes', e.target.value)} />

        <div style={S.btnRow}>
          <button style={S.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={S.saveBtn} onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
