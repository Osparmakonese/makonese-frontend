import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  createProduct,
  updateProduct,
  getCategories,
  getLowStockProducts,
  getExpiringProducts,
} from '../api/retailApi';
import { fmt } from '../utils/format';

/* ─── Modal Component ─── */
function AddProductModal({ isOpen, onClose, onSubmit, categories, loading }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    cost_price: '',
    selling_price: '',
    quantity_in_stock: '',
    reorder_level: '',
    unit: 'Piece',
    expiry_date: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      name: '',
      sku: '',
      category: '',
      cost_price: '',
      selling_price: '',
      quantity_in_stock: '',
      reorder_level: '',
      unit: 'Piece',
      expiry_date: '',
      description: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '24px',
          maxWidth: 500,
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: '#111827',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {'\u{2795}'} Add Product
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#9ca3af',
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #e5e7eb',
                borderRadius: 7,
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
                Cost Price
              </label>
              <input
                type="number"
                name="cost_price"
                value={form.cost_price}
                onChange={handleChange}
                step="0.01"
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
                Selling Price
              </label>
              <input
                type="number"
                name="selling_price"
                value={form.selling_price}
                onChange={handleChange}
                step="0.01"
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
                Stock Quantity
              </label>
              <input
                type="number"
                name="quantity_in_stock"
                value={form.quantity_in_stock}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
                Reorder Level
              </label>
              <input
                type="number"
                name="reorder_level"
                value={form.reorder_level}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
                Unit
              </label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Piece">Piece</option>
                <option value="Kg">Kg</option>
                <option value="Liter">Liter</option>
                <option value="Meter">Meter</option>
                <option value="Box">Box</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
                Expiry Date (optional)
              </label>
              <input
                type="date"
                name="expiry_date"
                value={form.expiry_date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #e5e7eb',
                borderRadius: 7,
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px',
                background: '#1a6b3a',
                color: '#fff',
                border: 'none',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Products Page ─── */
const S = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '20px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    fontFamily: "'Playfair Display', serif",
    margin: 0,
  },
  addBtn: {
    padding: '10px 18px',
    background: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  controls: {
    display: 'grid',
    gridTemplateColumns: '1fr 200px',
    gap: 12,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 7,
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 7,
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box',
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: '16px 18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 11,
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    fontSize: 9,
    fontWeight: 700,
    color: '#9ca3af',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #f3f4f6',
    color: '#374151',
  },
  badge: (color) => ({
    display: 'inline-block',
    fontSize: 8,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 10,
    textTransform: 'uppercase',
    background: color === 'red' ? '#fee2e2' : color === 'amber' ? '#fef3c7' : '#d1fae5',
    color: color === 'red' ? '#7f1d1d' : color === 'amber' ? '#92400e' : '#065f46',
  }),
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#9ca3af',
  },
};

export default function Products() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: products = [] } = useQuery({
    queryKey: ['retail-products'],
    queryFn: getProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['retail-categories'],
    queryFn: getCategories,
  });

  const { data: lowStock = [] } = useQuery({
    queryKey: ['retail-low-stock'],
    queryFn: getLowStockProducts,
  });

  const { data: expiring = [] } = useQuery({
    queryKey: ['retail-expiring'],
    queryFn: getExpiringProducts,
  });

  const createMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['retail-products'] });
      qc.invalidateQueries({ queryKey: ['retail-low-stock'] });
      setShowModal(false);
    },
  });

  const lowStockIds = new Set(lowStock.map((p) => p.id));
  const expiringIds = new Set(expiring.map((p) => p.id));

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
      const skuMatch = p.sku.toLowerCase().includes(search.toLowerCase());
      const catMatch = !categoryFilter || p.category === parseInt(categoryFilter);
      return (nameMatch || skuMatch) && catMatch;
    });
  }, [products, search, categoryFilter]);

  const handleAddProduct = (formData) => {
    createMut.mutate(formData);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>{'\u{1F4E6}'} Products</h1>
        <button
          onClick={() => setShowModal(true)}
          style={S.addBtn}
        >
          {'\u{2795}'} Add Product
        </button>
      </div>

      <div style={S.controls}>
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={S.input}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={S.select}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div style={S.card}>
        {filtered.length > 0 ? (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Name</th>
                <th style={S.th}>SKU</th>
                <th style={S.th}>Category</th>
                <th style={S.th}>Price</th>
                <th style={S.th}>Stock</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const isLowStock = lowStockIds.has(product.id);
                const isExpiring = expiringIds.has(product.id);
                const catName =
                  categories.find((c) => c.id === product.category)?.name || 'N/A';

                return (
                  <tr key={product.id}>
                    <td style={S.td}>
                      <strong>{product.name}</strong>
                    </td>
                    <td style={S.td}>{product.sku}</td>
                    <td style={S.td}>{catName}</td>
                    <td style={S.td}>{fmt(product.selling_price, 'zwd')}</td>
                    <td style={S.td}>
                      {product.quantity_in_stock} {product.unit}
                    </td>
                    <td style={S.td}>
                      {isExpiring && (
                        <span style={{ ...S.badge('amber'), marginRight: 6 }}>
                          Expiring
                        </span>
                      )}
                      {isLowStock && (
                        <span style={S.badge('red')}>
                          Low Stock
                        </span>
                      )}
                      {!isExpiring && !isLowStock && (
                        <span style={S.badge('green')}>
                          Ok
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={S.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>
              {'\u{1F50D'}
            </div>
            <p>No products found</p>
            <p style={{ fontSize: 11, marginTop: 6 }}>
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddProduct}
        categories={categories}
        loading={createMut.isPending}
      />
    </div>
  );
}
