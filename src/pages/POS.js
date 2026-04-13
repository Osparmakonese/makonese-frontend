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

/* ─── Helper: Get emoji icon by category ─── */
const getCategoryEmoji = (category) => {
  const emojiMap = {
    produce: '🥬',
    dairy: '🥛',
    meat: '🥩',
    bakery: '🍞',
    drinks: '🥤',
    snacks: '🍿',
    beverages: '🍷',
    household: '🧹',
    personal_care: '🧴',
    frozen: '🧊',
    canned: '🥫',
    default: '📦',
  };
  return emojiMap[category?.toLowerCase()] || emojiMap.default;
};

/* ─── Styles ─── */
const S = {
  page: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '12px',
    height: 'calc(100vh - 110px)',
    background: '#f9fafb',
    padding: '12px',
    boxSizing: 'border-box',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
  },
  leftHeader: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e5e7eb',
    background: '#fff',
  },
  leftTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: '#111827',
  },
  searchInput: {
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
    background: '#f9fafb',
    boxSizing: 'border-box',
    width: '100%',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '12px',
    padding: '12px',
    overflow: 'auto',
    flex: 1,
  },
  productCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  productCardDisabled: {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
  productCardHover: {
    boxShadow: '0 4px 12px rgba(26,107,58,0.15)',
    borderColor: '#1a6b3a',
    transform: 'translateY(-2px)',
  },
  productEmoji: {
    fontSize: '32px',
  },
  productName: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
    minHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productPrice: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a6b3a',
    marginBottom: '4px',
  },
  productStock: {
    fontSize: '11px',
    color: '#9ca3af',
    marginBottom: '8px',
  },
  addBtn: {
    width: '100%',
    padding: '8px',
    background: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  addBtnHover: {
    background: '#2d9e58',
  },
  rightHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    background: '#fff',
  },
  rightTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
  },
  cartContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
    padding: '12px',
    gap: '12px',
  },
  cartItems: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '8px',
    background: '#f9fafb',
    borderRadius: '6px',
    fontSize: '11px',
    border: '1px solid #e5e7eb',
  },
  cartItemLeft: {
    flex: 1,
  },
  cartItemName: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  cartItemPrice: {
    color: '#6b7280',
    marginBottom: '4px',
    fontSize: '10px',
  },
  cartItemRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  cartItemTotal: {
    fontWeight: '700',
    color: '#1a6b3a',
  },
  qtyControl: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  qtyBtn: {
    width: '20px',
    height: '20px',
    padding: 0,
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    background: '#f9fafb',
    cursor: 'pointer',
    fontSize: '10px',
    fontWeight: '700',
    transition: 'background 0.2s',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 8px',
    background: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  totalLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
  },
  totalAmount: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a6b3a',
  },
  paymentBtns: {
    display: 'flex',
    gap: '8px',
    fontSize: '11px',
    fontWeight: '600',
  },
  paymentBtn: {
    flex: 1,
    padding: '8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    background: '#fff',
    color: '#111827',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  paymentBtnActive: {
    background: '#1a6b3a',
    color: '#fff',
    borderColor: '#1a6b3a',
  },
  completeSaleBtn: {
    width: '100%',
    padding: '12px',
    background: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  completeSaleBtnHover: {
    background: '#2d9e58',
  },
  emptyCart: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    fontSize: '12px',
    gap: '8px',
  },
  emptyCartIcon: {
    fontSize: '40px',
  },
  section: {
    marginBottom: '8px',
  },
  sectionLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: '4px',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '11px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '11px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  changeDisplay: {
    marginTop: '4px',
    fontSize: '10px',
    color: '#1a6b3a',
    fontWeight: '600',
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
      {/* LEFT PANEL: Products Grid */}
      <div style={S.left}>
        {/* Header with title and search bar */}
        <div style={S.leftHeader}>
          <h1 style={S.leftTitle}>Products</h1>
        </div>

        <div style={{ padding: '0 12px 8px 12px' }}>
          <input
            type="text"
            placeholder="Search or scan barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={S.searchInput}
          />
          <input
            ref={barcodeInputRef}
            type="text"
            placeholder="Barcode (auto-scanned)"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleBarcodeSubmit}
            style={{ ...S.searchInput, marginTop: '4px', display: 'none' }}
          />
        </div>

        {/* Product Grid */}
        <div style={S.productGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isOutOfStock = product.quantity_in_stock === 0;
              return (
                <div
                  key={product.id}
                  style={{
                    ...S.productCard,
                    ...(isOutOfStock ? S.productCardDisabled : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!isOutOfStock) {
                      Object.assign(e.currentTarget.style, S.productCardHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = '';
                  }}
                >
                  <div style={S.productEmoji}>
                    {getCategoryEmoji(product.category)}
                  </div>
                  <div style={S.productName}>{product.name}</div>
                  <div style={S.productPrice}>{fmt(product.selling_price, 'zwd')}</div>
                  <div style={S.productStock}>
                    {product.quantity_in_stock} in stock
                  </div>
                  <button
                    onClick={() => !isOutOfStock && addToCart(product)}
                    style={{
                      ...S.addBtn,
                      opacity: isOutOfStock ? 0.5 : 1,
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                    }}
                    disabled={isOutOfStock}
                    onMouseEnter={(e) => {
                      if (!isOutOfStock) {
                        Object.assign(e.currentTarget.style, S.addBtnHover);
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#1a6b3a';
                    }}
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Add'}
                  </button>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
              No products available
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Current Sale / Cart */}
      <div style={S.right}>
        {/* Header */}
        <div style={S.rightHeader}>
          <h2 style={S.rightTitle}>Current Sale</h2>
        </div>

        {/* Cart Content */}
        <div style={S.cartContainer}>
          {cart.length > 0 ? (
            <>
              {/* Cart Items List */}
              <div style={S.cartItems}>
                {cart.map((item) => (
                  <div key={item.product_id} style={S.cartItem}>
                    <div style={S.cartItemLeft}>
                      <div style={S.cartItemName}>{item.name}</div>
                      <div style={S.cartItemPrice}>
                        {fmt(item.unit_price, 'zwd')} each
                      </div>
                    </div>
                    <div style={S.cartItemRight}>
                      <div style={S.cartItemTotal}>
                        {fmt(item.unit_price * item.quantity, 'zwd')}
                      </div>
                      <div style={S.qtyControl}>
                        <button
                          onClick={() => updateCartQty(item.product_id, item.quantity - 1)}
                          style={S.qtyBtn}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#f9fafb')}
                        >
                          −
                        </button>
                        <span style={{ width: 20, textAlign: 'center', fontSize: '11px', fontWeight: '600' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product_id, item.quantity + 1)}
                          style={S.qtyBtn}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#f9fafb')}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          style={{
                            ...S.qtyBtn,
                            background: '#fee2e2',
                            color: '#c0392b',
                            fontSize: '12px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#fecaca')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#fee2e2')}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div style={S.totalRow}>
                <span style={S.totalLabel}>Total</span>
                <span style={S.totalAmount}>{fmt(grandTotal, 'zwd')}</span>
              </div>

              {/* Payment Method Buttons */}
              <div style={S.paymentBtns}>
                <button
                  onClick={() => setPaymentMethod('cash')}
                  style={{
                    ...S.paymentBtn,
                    ...(paymentMethod === 'cash' ? S.paymentBtnActive : {}),
                  }}
                >
                  💵 Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('mobile_money')}
                  style={{
                    ...S.paymentBtn,
                    ...(paymentMethod === 'mobile_money' ? S.paymentBtnActive : {}),
                  }}
                >
                  📱 EcoCash
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    ...S.paymentBtn,
                    ...(paymentMethod === 'card' ? S.paymentBtnActive : {}),
                  }}
                >
                  💳 Card
                </button>
              </div>

              {/* Amount Tendered */}
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
                  <div style={S.changeDisplay}>
                    Change: {fmt(change, 'zwd')}
                  </div>
                )}
              </div>

              {/* Discount */}
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

              {/* Tax */}
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

              {/* Complete Sale Button */}
              <button
                onClick={handleCompleteSale}
                disabled={createSaleMut.isPending}
                style={{
                  ...S.completeSaleBtn,
                  opacity: createSaleMut.isPending ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!createSaleMut.isPending) {
                    Object.assign(e.currentTarget.style, S.completeSaleBtnHover);
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1a6b3a';
                }}
              >
                {createSaleMut.isPending ? 'Processing...' : 'Complete Sale'}
              </button>
            </>
          ) : (
            <div style={S.emptyCart}>
              <div style={S.emptyCartIcon}>🛒</div>
              <p style={{ margin: 0 }}>Cart is empty</p>
              <p style={{ margin: 0, fontSize: '10px' }}>
                Add items from products
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
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
