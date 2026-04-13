import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ReceiptCustomization({ onTabChange }) {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState('Acme Trading');
  const [address, setAddress] = useState('123 Main Street, Harare');
  const [phone, setPhone] = useState('+263 77 123 4567');
  const [vatNumber, setVatNumber] = useState('10012345');
  const [showLogo, setShowLogo] = useState(true);
  const [footerMessage, setFooterMessage] = useState('Thank you for shopping with us! Returns accepted within 7 days.');
  const [showSocialMedia, setShowSocialMedia] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('+263 77 123 4567');
  const [paperWidth, setPaperWidth] = useState('80mm');
  const [fontSize, setFontSize] = useState('Medium');
  const [showBarcodeOnReceipt, setShowBarcodeOnReceipt] = useState(true);
  const [showQRCode, setShowQRCode] = useState(true);
  const [currencyDisplay, setCurrencyDisplay] = useState('Dual (USD + ZiG)');

  const isOwner = user?.role === 'owner';

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 40,
        height: 24,
        borderRadius: 12,
        border: 'none',
        background: checked ? '#1a6b3a' : '#e5e7eb',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '2px 3px',
        position: 'relative',
        transition: 'background 0.2s'
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          background: '#fff',
          position: 'absolute',
          left: checked ? 18 : 2,
          transition: 'left 0.2s'
        }}
      />
    </button>
  );

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", margin: 0, color: '#111827' }}>
          Receipt Customization
        </h1>
        {isOwner && (
          <button
            style={{
              background: '#1a6b3a',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Save Template
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {/* Template Settings */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 16px 0', color: '#111827' }}>
            Receipt Configuration
          </h3>

          {/* Header Section */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 10, fontWeight: 600, color: '#fff', background: '#1a6b3a', padding: '4px 8px', borderRadius: 4, margin: '0 0 12px 0' }}>
              HEADER
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>
                  BUSINESS NAME
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>
                  ADDRESS
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>
                  PHONE
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>
                  VAT NUMBER
                </label>
                <input
                  type="text"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#111827' }}>SHOW LOGO</label>
                <Toggle checked={showLogo} onChange={setShowLogo} />
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 10, fontWeight: 600, color: '#fff', background: '#1a6b3a', padding: '4px 8px', borderRadius: 4, margin: '0 0 12px 0' }}>
              FOOTER
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>
                  FOOTER MESSAGE
                </label>
                <textarea
                  value={footerMessage}
                  onChange={(e) => setFooterMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontSize: 10,
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: 'border-box',
                    minHeight: 60,
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#111827' }}>SHOW SOCIAL MEDIA</label>
                <Toggle checked={showSocialMedia} onChange={setShowSocialMedia} />
              </div>
              {showSocialMedia && (
                <div>
                  <label style={{ fontSize: 9, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>
                    WHATSAPP NUMBER
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                      fontSize: 11,
                      fontFamily: "'Inter', sans-serif",
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Format Section */}
          <div>
            <h4 style={{ fontSize: 10, fontWeight: 600, color: '#fff', background: '#1a6b3a', padding: '4px 8px', borderRadius: 4, margin: '0 0 12px 0' }}>
              FORMAT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 6 }}>
                  PAPER WIDTH
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['58mm', '80mm'].map((width) => (
                    <label key={width} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="width"
                        value={width}
                        checked={paperWidth === width}
                        onChange={() => setPaperWidth(width)}
                        style={{ cursor: 'pointer' }}
                      />
                      {width}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 6 }}>
                  FONT SIZE
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <label key={size} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="size"
                        value={size}
                        checked={fontSize === size}
                        onChange={() => setFontSize(size)}
                        style={{ cursor: 'pointer' }}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#111827' }}>SHOW BARCODE</label>
                <Toggle checked={showBarcodeOnReceipt} onChange={setShowBarcodeOnReceipt} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#111827' }}>SHOW QR CODE (ZIMRA)</label>
                <Toggle checked={showQRCode} onChange={setShowQRCode} />
              </div>

              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 6 }}>
                  CURRENCY DISPLAY
                </label>
                <select
                  value={currencyDisplay}
                  onChange={(e) => setCurrencyDisplay(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option>USD only</option>
                  <option>Dual (USD + ZiG)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 16px 0', color: '#111827' }}>
            Receipt Preview
          </h3>

          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 9,
              background: '#f9fafb',
              padding: 16,
              border: '1px dashed #e5e7eb',
              borderRadius: 8,
              maxWidth: 280,
              margin: '0 auto',
              lineHeight: 1.5,
              color: '#111827',
              whiteSpace: 'pre-wrap'
            }}
          >
            {`═══ ${businessName} ═══
${address}
Tel: ${phone}
VAT: ${vatNumber}
─────────────────────
Receipt: #0108
Date: 12 Apr 2026 17:45
Cashier: Mary Banda
─────────────────────
USB-C Charger   x1  $15.00
BT Earbuds      x1  $25.00
iPhone Case     x2  $16.00
─────────────────────
Subtotal:       $56.00
Discount (10%): -$5.60
VAT (15%):       $7.56
─────────────────────
TOTAL:          $57.96
Paid: EcoCash
─────────────────────
[QR Code placeholder]

${footerMessage}
${showSocialMedia ? `WhatsApp: ${whatsappNumber}` : ''}`}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div
        style={{
          background: '#f3f4f6',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          padding: 16,
          fontSize: 10,
          color: '#374151',
          lineHeight: 1.6
        }}
      >
        Receipt format is compatible with 58mm and 80mm thermal printers. Digital receipts can be sent via WhatsApp after each sale.
      </div>
    </div>
  );
}
