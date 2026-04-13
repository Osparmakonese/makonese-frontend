import React, { useState } from 'react';

const styles = {
  page: { maxWidth: 1200, margin: '0 auto', padding: 20 },
  title: { fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 20, margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  fieldLabel: { fontSize: 9, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3, display: 'block' },
  fieldInput: { width: '100%', border: '1px solid #e5e7eb', borderRadius: 7, padding: '7px 10px', fontSize: 11, boxSizing: 'border-box', outline: 'none', marginBottom: 12 },
  saveBtn: { padding: '8px 12px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer', width: '100%' },
  sectionHeader: { fontSize: 10, fontWeight: 600, color: '#1a6b3a', textTransform: 'uppercase', marginBottom: 12, marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 },
  permissionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' },
  permissionLabel: { flex: 1 },
  permissionTitle: { fontSize: 11, fontWeight: 600, color: '#374151' },
  permissionDesc: { fontSize: 9, color: '#9ca3af', marginTop: 2 },
  cardTitle: { fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 4 },
  cardDesc: { fontSize: 10, color: '#6b7280', marginBottom: 14 },
  toggle: (isOn) => ({
    width: 36,
    height: 18,
    borderRadius: 9,
    background: isOn ? '#1a6b3a' : '#d1d5db',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    padding: isOn ? '0 2px 0 18px' : '0 18px 0 2px',
  }),
  toggleKnob: { width: 14, height: 14, borderRadius: 7, background: '#fff', position: 'absolute', transition: 'all 0.2s' },
  dropdownSection: { marginBottom: 14 },
  dropdownLabel: { fontSize: 10, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4, display: 'block' },
  dropdown: { width: '100%', border: '1px solid #e5e7eb', borderRadius: 7, padding: '7px 10px', fontSize: 11, boxSizing: 'border-box', outline: 'none' },
  infoBox: { background: '#EFF6FF', border: '1px solid #2563eb', borderRadius: 7, padding: '10px 12px', fontSize: 10, color: '#1e3a5f', lineHeight: 1.4, marginBottom: 14 },
  moduleToggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #e5e7eb' },
  moduleToggleName: { fontSize: 11, fontWeight: 600, color: '#374151' },
};

export default function RetailSettings({ onTabChange }) {
  // Column 1: Tenant Details
  const [businessName, setBusinessName] = useState('Acme Trading');
  const [country, setCountry] = useState('ZW');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('Africa/Harare');

  // Column 2: Role Permissions (Cashier)
  const [permissions, setPermissions] = useState({
    viewProducts: true,
    addProducts: false,
    editProducts: false,
    processSales: true,
    viewReports: false,
    viewJournal: false,
  });

  // Column 3: Hardware & Devices
  const [barcodeEnabled, setBarcodeEnabled] = useState(true);
  const [barcodeScannerMode, setBarcodeScannerMode] = useState('USB HID (Plug & Play)');
  const [barcodeFormat, setBarcodeFormat] = useState('Auto-detect');
  const [receiptPrinterEnabled, setReceiptPrinterEnabled] = useState(false);
  const [moduleToggles, setModuleToggles] = useState({
    retail: true,
    accounting: true,
    farm: false,
  });

  const togglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleModule = (key) => {
    setModuleToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleSwitch = ({ isOn, onChange }) => (
    <button style={styles.toggle(isOn)} onClick={onChange}>
      <div style={{ ...styles.toggleKnob, left: isOn ? 'calc(100% - 16px)' : '2px' }} />
    </button>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Settings</h1>

      <div style={styles.grid}>
        {/* ===== COLUMN 1: Tenant Details ===== */}
        <div style={styles.card}>
          <h3 style={{ ...styles.cardTitle, marginBottom: 16 }}>Tenant Details</h3>

          <label style={styles.fieldLabel}>Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            style={styles.fieldInput}
          />

          <label style={styles.fieldLabel}>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={styles.fieldInput}
          />

          <label style={styles.fieldLabel}>Currency</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={styles.fieldInput}
          />

          <label style={styles.fieldLabel}>Timezone</label>
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            style={styles.fieldInput}
          />

          <button style={styles.saveBtn}>Save Changes</button>
        </div>

        {/* ===== COLUMN 2: Role Permissions ===== */}
        <div style={styles.card}>
          <h3 style={{ ...styles.cardTitle, marginBottom: 4 }}>Role Permissions</h3>
          <p style={styles.cardDesc}>Configure what each role can do</p>

          <div style={styles.sectionHeader}>CASHIER PERMISSIONS</div>

          {/* Permission rows */}
          <div style={styles.permissionRow}>
            <div style={styles.permissionLabel}>
              <div style={styles.permissionTitle}>View Products</div>
            </div>
            <ToggleSwitch isOn={permissions.viewProducts} onChange={() => togglePermission('viewProducts')} />
          </div>

          <div style={styles.permissionRow}>
            <div style={styles.permissionLabel}>
              <div style={styles.permissionTitle}>Add Products</div>
            </div>
            <ToggleSwitch isOn={permissions.addProducts} onChange={() => togglePermission('addProducts')} />
          </div>

          <div style={styles.permissionRow}>
            <div style={styles.permissionLabel}>
              <div style={styles.permissionTitle}>Edit Products</div>
            </div>
            <ToggleSwitch isOn={permissions.editProducts} onChange={() => togglePermission('editProducts')} />
          </div>

          <div style={styles.permissionRow}>
            <div style={styles.permissionLabel}>
              <div style={styles.permissionTitle}>Process Sales (POS)</div>
            </div>
            <ToggleSwitch isOn={permissions.processSales} onChange={() => togglePermission('processSales')} />
          </div>

          <div style={styles.permissionRow}>
            <div style={styles.permissionLabel}>
              <div style={styles.permissionTitle}>View Reports</div>
            </div>
            <ToggleSwitch isOn={permissions.viewReports} onChange={() => togglePermission('viewReports')} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0, borderBottom: 'none' }}>
            <div style={styles.permissionLabel}>
              <div style={styles.permissionTitle}>View Journal</div>
            </div>
            <ToggleSwitch isOn={permissions.viewJournal} onChange={() => togglePermission('viewJournal')} />
          </div>

          <button style={{ ...styles.saveBtn, marginTop: 16 }}>Save Permissions</button>
        </div>

        {/* ===== COLUMN 3: Hardware & Devices ===== */}
        <div style={styles.card}>
          <h3 style={{ ...styles.cardTitle, marginBottom: 4 }}>Hardware & Devices</h3>
          <p style={styles.cardDesc}>Connect barcode scanners and receipt printers</p>

          {/* BARCODE SCANNER */}
          <div style={styles.sectionHeader}>BARCODE SCANNER</div>

          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={styles.permissionTitle}>Enable Barcode Scanning</div>
            </div>
            <ToggleSwitch isOn={barcodeEnabled} onChange={() => setBarcodeEnabled(!barcodeEnabled)} />
          </div>

          <div style={styles.dropdownSection}>
            <label style={styles.dropdownLabel}>Scanner Mode</label>
            <select
              value={barcodeScannerMode}
              onChange={(e) => setBarcodeScannerMode(e.target.value)}
              style={styles.dropdown}
            >
              <option>USB HID (Plug & Play)</option>
              <option>Bluetooth Serial</option>
              <option>Camera (Phone/Tablet)</option>
            </select>
          </div>

          <div style={styles.dropdownSection}>
            <label style={styles.dropdownLabel}>Barcode Format</label>
            <select
              value={barcodeFormat}
              onChange={(e) => setBarcodeFormat(e.target.value)}
              style={styles.dropdown}
            >
              <option>Auto-detect</option>
              <option>EAN-13</option>
              <option>UPC-A</option>
              <option>Code 128</option>
              <option>QR Code</option>
            </select>
          </div>

          <div style={styles.infoBox}>
            No barcode scanner? No problem. Products can be searched by name or SKU in POS.
          </div>

          {/* RECEIPT PRINTER */}
          <div style={styles.sectionHeader}>RECEIPT PRINTER</div>

          <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={styles.permissionTitle}>Enable Receipt Printing</div>
            </div>
            <ToggleSwitch isOn={receiptPrinterEnabled} onChange={() => setReceiptPrinterEnabled(!receiptPrinterEnabled)} />
          </div>

          {/* MODULES */}
          <div style={styles.sectionHeader}>MODULES</div>

          <div style={styles.moduleToggleRow}>
            <span style={styles.moduleToggleName}>Retail</span>
            <ToggleSwitch isOn={moduleToggles.retail} onChange={() => toggleModule('retail')} />
          </div>

          <div style={styles.moduleToggleRow}>
            <span style={styles.moduleToggleName}>Accounting</span>
            <ToggleSwitch isOn={moduleToggles.accounting} onChange={() => toggleModule('accounting')} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'none' }}>
            <span style={styles.moduleToggleName}>Farm</span>
            <ToggleSwitch isOn={moduleToggles.farm} onChange={() => toggleModule('farm')} />
          </div>
        </div>
      </div>
    </div>
  );
}
