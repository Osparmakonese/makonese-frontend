import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  barcodeLookup,
  createSale,
  getCashierSessions,
} from '../api/retailApi';
import { fmt } from '../utils/format';

/* ─── Receipt Modal ─── */
function ReceiptModal({ isOpen, onClose, receipt }) {
  if (!isOpen || !receipt) return null;

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
          maxWidth: 400,
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>
            {'✔'}
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: '#1a6b3a',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Sale Complete
          </h2>
          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: 12,
              color: '#6b7280',
            }}
          >
            Receipt #{receipt.receipt_number}
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <span style={{ color: '#6b7280' }}>Subtotal:</span>
            <strong>{fmt(receipt.subtotal, 'zwd')}</strong>
          </div>

          {receipt.discount > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                marginBottom: 8,
                paddingBottom: 8,
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <span style={{ color: '#6b7280' }}>Discount:</span>
              <strong>-{fmt(receipt.discount, 'zwd')}</strong>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <span style={{ color: '#6b7280' }}>Tax:</span>
            <strong>{fmt(receipt.tax, 'zwd')}</strong>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 14,
              fontWeight: 700,
              color: '#1a6b3a',
            }}
          >
            <span>Total:</span>
            <strong>{fmt(receipt.total, 'zwd')}</strong>
          </div>
        </div>

        <div
          style={{
            background: '#f9fafb',
            borderRadius: 8,
            padding: '12px',
            marginBottom: 16,
            fontSize: 11,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: '#6b7280' }}>Payment Method:</span>
            <strong style={{ textTransform: 'capitalize' }}>
              {receipt.payment_method === 'mobile_money'
                ? 'Mobile Money'
                : receipt.payment_method}
            </strong>
          </div>
          {receipt.amount_tendered > receipt.total && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Change:</span>
              <strong style={{ color: '#1a6b3a' }}>
                {fmt(receipt.amount_tendered - receipt.total, 'zwd')}
              </strong>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              const printWin = window.open('', '_blank', 'width=400,height=600');
              const items = receipt.items_data || [];
              const rows = items.map(i =>
                `<tr><td style="padding:4px 0;font-size:11px">${i.product_name || 'Item'} x${i.qty || 0}</td><td style="text-align:right;padding:4px 0;font-size:11px">$${(i.total || 0).toFixed(2)}</td></tr>`
              ).join('');
              printWin.document.write(`<html><head><title>Receipt</title></head><body style="font-family:monospace;max-width:300px;margin:0 auto;padding:20px">
                <h2 style="text-align:center;margin:0 0 4px">PEWIL</h2>
                <p style="text-align:center;font-size:10px;color:#666;margin:0 0 16px">Receipt #${receipt.receipt_number}</p>
                <hr style="border:none;border-top:1px dashed #ccc"/>
                <table style="width:100%;border-collapse:collapse">${rows}</table>
                <hr style="border:none;border-top:1px dashed #ccc"/>
                <table style="width:100%;font-size:11px">
                  <tr><td>Subtotal</td><td style="text-align:right">$${parseFloat(receipt.subtotal || 0).toFixed(2)}</td></tr>
                  ${receipt.discount > 0 ? `<tr><td>Discount</td><td style="text-align:right">-$${parseFloat(receipt.discount).toFixed(2)}</td></tr>` : ''}
                  <tr><td>Tax</td><td style="text-align:right">$${parseFloat(receipt.tax || 0).toFixed(2)}</td></tr>
                  <tr style="font-weight:bold;font-size:14px"><td>TOTAL</td><td style="text-align:right">$${parseFloat(receipt.total || 0).toFixed(2)}</td></tr>
                </table>
                <hr style="border:none;border-top:1px dashed #ccc"/>
                <p style="text-align:center;font-size:10px;color:#666">Payment: ${receipt.payment_method === 'mobile_money' ? 'Mobile Money' : receipt.payment_method}</p>
                <p style="text-align:center;font-size:10px;color:#666">Thank you for shopping with us!</p>
              </body></html>`);
              printWin.document.close();
              printWin.print();
            }}
            style={{
              flex: 1,
              padding: '10px',
              background: '#fff',
              color: '#1a6b3a',
              border: '1px solid #1a6b3a',
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {'\u{1F5A8}'} Print Receipt
          </button>
          <button
            onClick={onClose}
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
            }}
          >
            New Sale
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const S = {
  page: {
    display: 'flex',
    height: '100vh',
    background: '#f9fafb',
  },
  left: {
    flex: '0 0 60%',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #e5e7eb',
    background: '#fff',
    overflow: 'hidden',
  },
  right: {
    flex: '0 0 40%',
    display: 'flex',
    flexDirection: 'column',
    background: '#f9fafb',
    overflow: 'hidden',
  },
  header: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    background: 'linear-gradient(135deg, rgba(26,107,58,0.8), rgba(45,158,88,0.6))',
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    fontFamily: "'Playfair Display', serif",
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  barcodeInput: {
    padding: '10px 14px',
    border: 'none',
    borderBottom: '2px solid #1a6b3a',
    fontSize: 12,
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box',
    width: '100%',
  },
  searchInput: {
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    fontSize: 12,
    outline: 'none',
    margin: '8px 12px',
    boxSizing: 'border-box',
    width: 'calc(100% - 24px)',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: 8,
    padding: '12px',
    overflow: 'auto',
    flex: 1,
  },
  productCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '10px 8px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  productCardHover: {
    boxShadow: '0 4px 12px rgba(26,107,58,0.15)',
    borderColor: '#1a6b3a',
  },
  productName: {
    fontSize: 11,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 4,
    minHeight: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productPrice: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1a6b3a',
    marginBottom: 6,
  },
  productStock: {
    fontSize: 9,
    color: '#9ca3af',
    marginBottom: 8,
  },
  addBtn: {
    width: '100%',
    padding: '6px',
    background: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 600,
    cursor: 'pointer',
  },
  cart: {
    background: '#fff',
    borderRadius: 10,
    margin: '12px',
    padding: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 24px)',
    overflow: 'hidden',
  },
  cartTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: '1px solid #e5e7eb',
  },
  cartItems: {
    flex: 1,
    overflow: 'auto',
    marginBottom: 10,
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
    fontSize: 10,
  },
  cartItemName: {
    fontWeight: 600,
    color: '#111827',
    marginBottom: 2,
  },
  cartItemPrice: {
    color: '#6b7280',
    marginBottom: 4,
  },
  qtyControl: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  },
  qtyBtn: {
    width: 20,
    height: 20,
    padding: 0,
    border: '1px solid #e5e7eb',
    borderRadius: 4,
    background: '#f9fafb',
    cursor: 'pointer',
    fontSize: 10,
    fontWeight: 700,
  },
  summary: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '8px 10px',
    marginBottom: 10,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 10,
    marginBottom: 4,
    color: '#374151',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    fontWeight: 700,
    color: '#1a6b3a',
    paddingTop: 6,
    borderTop: '1px solid #e5e7eb',
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    fontSize: 11,
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    fontSize: 11,
    outline: 'none',
    boxSizing: 'border-box',
  },
  completeBtn: {
    width: '100%',
    padding: '10px',
    background: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '20px 10px',
    color: '#9ca3af',
    fontSize: 11,
  },
};

export default function POS() {
  const qc = useQueryClient();
  const barcodeInputRef = useRef(null);
  const [search, setSearch] = useState('');
  const [barcode, setBarcode] = useState('');
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState('');
  const [tax, setTax] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountTendered, setAmountTendered] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ['retail-products-pos'],
    queryFn: getProducts,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['retail-sessions-pos'],
    queryFn: getCashierSessions,
  });

  const createSaleMut = useMutation({
    mutationFn: createSale,
    onSuccess: (data) => {
      setReceipt(data);
      setShowReceipt(true);
      resetCart();
      qc.invalidateQueries({ queryKey: ['retail-products-pos'] });
    },
  });

  const barcodeLookupMut = useMutation({
    mutationFn: barcodeLookup,
    onSuccess: (data) => {
      if (data) {
        addToCart(data);
        setBarcode('');
        barcodeInputRef.current?.focus();
      }
    },
  });

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  const filteredProducts = products.filter((p) => {
    const match =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return match && p.quantity_in_stock > 0;
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id
            ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                product.quantity_in_stock
              ),
            }
            : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          unit_price: product.selling_price,
          quantity: 1,
          product,
        },
      ];
    });
  };

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      const product = products.find((p) => p.id === productId);
      setCart((prev) =>
        prev.map((item) =>
          item.product_id === productId
            ? {
              ...item,
              quantity: Math.min(qty, product.quantity_in_stock),
            }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const discountAmount = parseFloat(discount) || 0;
  const taxAmount = parseFloat(tax) || 0;
  const grandTotal = subtotal - discountAmount + taxAmount;
  const change = (parseFloat(amountTendered) || 0) - grandTotal;

  const resetCart = () => {
    setCart([]);
    setDiscount('');
    setTax('');
    setPaymentMethod('cash');
    setAmountTendered('');
  };

  const handleCompleteSale = () => {
    const activeSessions = sessions.filter((s) => !s.closed_at);
    if (activeSessions.length === 0) {
      alert('No active cashier session. Please open a session first.');
      return;
    }

    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    const saleData = {
      session: activeSessions[0].id,
      items_data: cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.name,
        qty: item.quantity,
        unit_price: parseFloat(item.unit_price),
        total: parseFloat(item.unit_price) * item.quantity,
      })),
      subtotal: subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: grandTotal,
      payment_method: paymentMethod,
      amount_tendered: parseFloat(amountTendered) || grandTotal,
      change_given: Math.max(0, (parseFloat(amountTendered) || grandTotal) - grandTotal),
    };

    createSaleMut.mutate(saleData);
  };

  const handleBarcodeSubmit = (e) => {
    if (e.key === 'Enter' && barcode.trim()) {
      barcodeLookupMut.mutate(barcode);
    }
  };

  return (
    <div style={S.page}>
      {/* Left: Products */}
      <div style={S.left}>
        <div style={S.header}>
          <h1 style={S.title}>{'\u{1F3DC}'} Point of Sale</h1>
          <p style={S.subtitle}>Scan barcode or select products</p>
        </div>

        <input
          ref={barcodeInputRef}
          type="text"
          placeholder="Scan barcode..."
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={handleBarcodeSubmit}
          style={S.barcodeInput}
        />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={S.searchInput}
        />

        <div style={S.productGrid}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={S.productCard}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, S.productCardHover)
              }
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={S.productName}>{product.name}</div>
              <div style={S.productPrice}>{fmt(product.selling_price, 'zwd')}</div>
              <div style={S.productStock}>
                {product.quantity_in_stock} {product.unit}
              </div>
              <button
                onClick={() => addToCart(product)}
                style={S.addBtn}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Cart & Checkout */}
      <div style={S.right}>
        <div style={S.header}>
          <h2 style={S.title}>{'\u{1F6D2}'} Cart</h2>
          <p style={S.subtitle}>{cart.length} items</p>
        </div>

        <div style={S.cart}>
          {cart.length > 0 ? (
            <>
              <div style={S.cartItems}>
                {cart.map((item) => (
                  <div key={item.product_id} style={S.cartItem}>
                    <div style={{ flex: 1 }}>
                      <div style={S.cartItemName}>{item.name}</div>
                      <div style={S.cartItemPrice}>
                        {fmt(item.unit_price, 'zwd')} × {item.quantity}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <div style={{ fontWeight: 700, color: '#1a6b3a' }}>
                        {fmt(item.unit_price * item.quantity, 'zwd')}
                      </div>
                      <div style={S.qtyControl}>
                        <button
                          onClick={() => updateCartQty(item.product_id, item.quantity - 1)}
                          style={S.qtyBtn}
                        >
                          −
                        </button>
                        <span style={{ width: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product_id, item.quantity + 1)}
                          style={S.qtyBtn}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          style={{
                            ...S.qtyBtn,
                            background: '#fee2e2',
                            color: '#c0392b',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={S.summary}>
                <div style={S.summaryRow}>
                  <span>Subtotal:</span>
                  <strong>{fmt(subtotal, 'zwd')}</strong>
                </div>
                <div style={S.summaryRow}>
                  <span>Discount:</span>
                  <strong>-{fmt(discountAmount, 'zwd')}</strong>
                </div>
                <div style={S.summaryRow}>
                  <span>Tax:</span>
                  <strong>{fmt(taxAmount, 'zwd')}</strong>
                </div>
                <div style={S.summaryTotal}>
                  <span>Total:</span>
                  <span>{fmt(grandTotal, 'zwd')}</span>
                </div>
              </div>

              <div style={S.section}>
                <div style={S.sectionLabel}>Discount</div>
                <input
                  type="number"
                  placeholder="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  style={S.input}
                />
              </div>

              <div style={S.section}>
                <div style={S.sectionLabel}>Tax</div>
                <input
                  type="number"
                  placeholder="0"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  style={S.input}
                />
              </div>

              <div style={S.section}>
                <div style={S.sectionLabel}>Payment Method</div>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={S.select}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>
              </div>

              <div style={S.section}>
                <div style={S.sectionLabel}>Amount Tendered</div>
                <input
                  type="number"
                  placeholder="0"
                  value={amountTendered}
                  onChange={(e) => setAmountTendered(e.target.value)}
                  style={S.input}
                />
                {change > 0 && (
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 10,
                      color: '#1a6b3a',
                      fontWeight: 600,
                    }}
                  >
                    Change: {fmt(change, 'zwd')}
                  </div>
                )}
              </div>

              <button
                onClick={handleCompleteSale}
                disabled={createSaleMut.isPending}
                style={{
                  ...S.completeBtn,
                  opacity: createSaleMut.isPending ? 0.6 : 1,
                }}
              >
                {createSaleMut.isPending ? 'Processing...' : 'Complete Sale'}
              </button>
            </>
          ) : (
            <div style={S.emptyCart}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>
                {'🛒'}
              </div>
              <p>Cart is empty</p>
              <p style={{ fontSize: 10, marginTop: 6 }}>
                Add items from the product list
              </p>
            </div>
          )}
        </div>
      </div>

      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          resetCart();
          barcodeInputRef.current?.focus();
        }}
        receipt={receipt}
      />
    </div>
  );
}
