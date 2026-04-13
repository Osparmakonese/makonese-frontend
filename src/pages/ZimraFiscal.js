import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const S = {
  page: { maxWidth: 1200, margin: '0 auto', padding: 20 },
  heroBanner: {
    background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
    height: 100,
    borderRadius: 14,
    padding: '0 24px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  heroLeft: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  heroTitle: { fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif", margin: 0, marginBottom: 4 },
  heroSub: { fontSize: 10, opacity: 0.85, margin: 0 },
  heroIcon: { fontSize: 80, opacity: 0.2, position: 'absolute', right: 24, top: -10 },
  statusCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16, borderLeftWidth: 4 },
  statusCardGreen: { borderLeftColor: '#1a6b3a' },
  statusCardAmber: { borderLeftColor: '#c97d1a' },
  statusTitle: { fontSize: 11, fontWeight: 600, marginBottom: 8 },
  statusBold: { fontWeight: 700, fontSize: 12 },
  statusGreen: { color: '#1a6b3a' },
  statusAmber: { color: '#c97d1a' },
  metaRow: { fontSize: 10, color: '#6b7280', marginBottom: 4 },
  badge: { display: 'inline-block', fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase' },
  badgeGreen: { background: '#e8f5ee', color: '#1a6b3a' },
  twoColumnGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 },
  cardTitle: { fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 12 },
  formGroup: { marginBottom: 12 },
  label: { display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 11, boxSizing: 'border-box', background: '#f9fafb', color: '#374151' },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 11, boxSizing: 'border-box', background: '#fff' },
  buttonRow: { display: 'flex', gap: 8 },
  btnOutline: { flex: 1, padding: 10, background: '#fff', color: '#1a6b3a', border: '1px solid #1a6b3a', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  btnSolid: { flex: 1, padding: 10, background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  infoBox: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginTop: 12, fontSize: 10, color: '#6b7280', lineHeight: 1.6 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11, marginTop: 12 },
  th: { fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', textAlign: 'left' },
  td: { padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
  receipt: {
    fontFamily: 'monospace',
    fontSize: 10,
    background: '#f9fafb',
    padding: 16,
    border: '1px dashed #e5e7eb',
    maxWidth: 280,
    margin: '16px auto',
    borderRadius: 8,
    color: '#374151',
    lineHeight: 1.6,
  },
  receiptLine: { textAlign: 'center', marginBottom: 8 },
  receiptDivider: { borderTop: '1px solid #e5e7eb', margin: '8px 0' },
};

export default function ZimraFiscal({ onTabChange }) {
  useAuth();
  const [isConnected] = useState(true); // Mock state

  const zReports = [
    { date: '12 Apr', transactions: 38, grossSales: '$1,240.00', vat: '$186.00', netSales: '$1,054.00', status: 'Submitted' },
    { date: '11 Apr', transactions: 42, grossSales: '$1,380.00', vat: '$207.00', netSales: '$1,173.00', status: 'Submitted' },
    { date: '10 Apr', transactions: 35, grossSales: '$1,120.00', vat: '$168.00', netSales: '$952.00', status: 'Submitted' },
    { date: '9 Apr', transactions: 29, grossSales: '$980.00', vat: '$147.00', netSales: '$833.00', status: 'Submitted' },
    { date: '8 Apr', transactions: 31, grossSales: '$1,050.00', vat: '$157.50', netSales: '$892.50', status: 'Submitted' },
  ];

  return (
    <div style={S.page}>
      {/* Hero Banner */}
      <div style={S.heroBanner}>
        <div style={S.heroLeft}>
          <h1 style={S.heroTitle}>ZIMRA Fiscalisation</h1>
          <p style={S.heroSub}>Fiscal Device Management System (FDMS) compliance</p>
        </div>
        <div style={S.heroIcon}>📋</div>
      </div>

      {/* Compliance Status Card */}
      <div style={{ ...S.statusCard, ...(isConnected ? S.statusCardGreen : S.statusCardAmber) }}>
        <div style={S.statusTitle}>
          <span style={isConnected ? S.statusGreen : S.statusAmber}>
            {isConnected ? '✓' : '○'} FDMS Status: {isConnected ? 'Connected' : 'Not Configured'}
          </span>
          <span style={{ ...S.badge, ...S.badgeGreen, marginLeft: 8 }}>
            {isConnected ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div style={S.metaRow}>VAT Number: <span style={S.statusBold}>10012345</span></div>
        <div style={S.metaRow}>Device: <span style={S.statusBold}>VFD-2026-00142</span></div>
        <div style={S.metaRow}>Last Sync: <span style={S.statusBold}>12 Apr 2026, 17:45</span></div>
      </div>

      {/* Two-Column Grid */}
      <div style={S.twoColumnGrid}>
        {/* Left: Device Configuration */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Device Configuration</h2>

          <div style={S.formGroup}>
            <label style={S.label}>VAT Registration Number</label>
            <input type="text" defaultValue="10012345" readOnly style={S.input} />
          </div>

          <div style={S.formGroup}>
            <label style={S.label}>Device Type</label>
            <select style={S.select} defaultValue="vfd">
              <option value="esd">Hardware ESD</option>
              <option value="vfd">Virtual Fiscal Device (VFD)</option>
            </select>
          </div>

          <div style={S.formGroup}>
            <label style={S.label}>FDMS Server URL</label>
            <input type="text" defaultValue="https://fdms.zimra.co.zw/api/v1" readOnly style={S.input} />
          </div>

          <div style={S.formGroup}>
            <label style={S.label}>Device Serial</label>
            <input type="text" defaultValue="VFD-2026-00142" readOnly style={S.input} />
          </div>

          <div style={S.formGroup}>
            <label style={S.label}>Activation Date</label>
            <input type="text" defaultValue="1 Feb 2026" readOnly style={S.input} />
          </div>

          <div style={S.buttonRow}>
            <button style={S.btnOutline}>Test Connection</button>
            <button style={S.btnSolid}>Save Configuration</button>
          </div>

          <div style={S.infoBox}>
            VAT-registered businesses can claim 50% of fiscal device costs as Input Tax on their VAT 7 Return.
          </div>
        </div>

        {/* Right: Daily Z-Reports */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Fiscal Z-Reports</h2>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Date</th>
                <th style={S.th}>Transactions</th>
                <th style={S.th}>Gross Sales</th>
                <th style={S.th}>VAT Collected</th>
                <th style={S.th}>Net Sales</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {zReports.map((report, idx) => (
                <tr key={idx}>
                  <td style={S.td}>{report.date}</td>
                  <td style={S.td}>{report.transactions}</td>
                  <td style={S.td}>{report.grossSales}</td>
                  <td style={S.td}>{report.vat}</td>
                  <td style={S.td}>{report.netSales}</td>
                  <td style={S.td}>
                    <span style={{ ...S.badge, ...S.badgeGreen }}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fiscal Receipt Preview */}
      <div style={S.card}>
        <h2 style={S.cardTitle}>Fiscal Receipt Preview</h2>
        <div style={S.receipt}>
          <div style={S.receiptLine}>===== ACME TRADING =====</div>
          <div style={S.receiptLine}>VAT Reg: 10012345</div>
          <div style={S.receiptLine}>Receipt: FIS-2026-04-12-0038</div>
          <div style={S.receiptLine}>Date: 12 Apr 2026 17:45</div>
          <div style={S.receiptDivider}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>USB-C Charger    x1</span>
            <span>$15.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>BT Earbuds       x1</span>
            <span>$25.00</span>
          </div>
          <div style={S.receiptDivider}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span>Subtotal:</span>
            <span>$40.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>VAT (15%):</span>
            <span>$6.00</span>
          </div>
          <div style={S.receiptDivider}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 600 }}>
            <span>TOTAL:</span>
            <span>$46.00</span>
          </div>
          <div style={S.receiptDivider}></div>
          <div style={S.receiptLine}>Payment: EcoCash</div>
          <div style={S.receiptLine}>ZIMRA Fiscal Device: VFD-2026-00142</div>
          <div style={S.receiptLine}>[QR CODE PLACEHOLDER]</div>
          <div style={S.receiptLine}>Verification: zimra.co.zw/verify</div>
        </div>
        <div style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', marginTop: 12 }}>
          All fiscal receipts include ZIMRA QR code for verification by customers and auditors.
        </div>
      </div>
    </div>
  );
}
