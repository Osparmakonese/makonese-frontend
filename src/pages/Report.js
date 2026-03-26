import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboard, getFields, getWagesSummary, getFarmAssets } from '../api/farmApi';
import { fmt, IMAGES } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const LIFESPAN_YEARS = { season: 1, short: 2, long: 10 };

const S = {
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif", textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  aiBtn: {
    width: '100%', padding: '14px 20px', borderRadius: 8, border: 'none',
    background: 'linear-gradient(135deg, #111827, #374151)', color: '#fff',
    fontSize: 12, fontWeight: 700, cursor: 'pointer', marginBottom: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  aiResult: {
    background: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 18,
    fontSize: 12, lineHeight: 1.6, color: '#374151', whiteSpace: 'pre-wrap',
    border: '1px solid #e5e7eb',
  },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 310px', gap: 20 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', marginBottom: 14 },
  plCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '18px 20px', marginBottom: 14, borderLeft: '4px solid #1a6b3a' },
  overheadCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '18px 20px', marginBottom: 14, borderLeft: '4px solid #c97d1a' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6', fontSize: 12 },
  rowLabel: { color: '#6b7280' },
  rowVal: (c) => ({ fontWeight: 600, color: c }),
  totalRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 14, fontWeight: 700, borderBottom: 'none' },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 10 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  th: { textAlign: 'left', padding: '8px 10px', fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' },
  td: { padding: '8px 10px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
  bsSection: { marginBottom: 12 },
  bsTitle: { fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.05em' },
  netBox: (pos) => ({
    background: pos ? '#e8f5ee' : '#fdecea', borderRadius: 8, padding: '14px 18px',
    textAlign: 'center', marginTop: 8,
  }),
  netVal: (pos) => ({
    fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700,
    color: pos ? '#1a6b3a' : '#c0392b',
  }),
  locked: { textAlign: 'center', padding: 60, color: '#6b7280' },
  infoBox: { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', fontSize: 11, color: '#1d4ed8', marginBottom: 12 },
};

export default function Report() {
  const { user } = useAuth();
  const role = user?.role || 'worker';
  const [analysis, setAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const { data: dash, isLoading: dLoad } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard });
  const { data: fields = [], isLoading: fLoad } = useQuery({ queryKey: ['fields'], queryFn: getFields });
  const { data: wages } = useQuery({ queryKey: ['wages'], queryFn: getWagesSummary });
  const { data: assets = [] } = useQuery({ queryKey: ['farmAssets'], queryFn: getFarmAssets });

  if (role !== 'owner') {
    return <div style={S.locked}><div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div><p>Reports are only available to the farm owner.</p></div>;
  }
  if (dLoad || fLoad) return <p style={{ color: '#9ca3af', padding: 40, textAlign: 'center' }}>Loading report...</p>;

  const d = dash || {};
  const tripRevenue = d.trip_revenue ?? d.total_revenue ?? 0;
  const directIncome = d.direct_income ?? 0;
  const totalRevenue = tripRevenue + directIncome;
  const fieldCosts = d.total_costs ?? 0;
  const wagesOwed = d.wages_owed ?? wages?.total_owed ?? 0;
  const tripExpenses = d.trip_expenses ?? 0;

  // Farm overhead = asset depreciation
  const totalDepreciation = (Array.isArray(assets) ? assets : []).reduce((sum, a) => {
    const years = LIFESPAN_YEARS[a.lifespan] || 1;
    return sum + (parseFloat(a.cost) / years);
  }, 0);

  const totalOutgoing = fieldCosts + wagesOwed + tripExpenses + totalDepreciation;
  const net = totalRevenue - totalOutgoing;

  const stockValue = d.stock_value ?? 0;
  const totalAssets = totalRevenue + stockValue + fieldCosts;
  const totalLiabilities = wagesOwed + fieldCosts + tripExpenses + totalDepreciation;
  const farmNet = totalAssets - totalLiabilities;

  const runAnalysis = async () => {
    setAiLoading(true);
    try {
      const apiKey = localStorage.getItem('anthropic_api_key');
      if (!apiKey) { setAnalysis('Add your Anthropic API key in Settings to use AI analysis.'); setAiLoading(false); return; }
      const prompt = `Full financial analysis of Makonese Farm Season 2025:\n\nRevenue: $${totalRevenue} (Trips: $${tripRevenue}, Direct: $${directIncome})\nField costs: $${fieldCosts}\nWages: $${wagesOwed}\nTrip expenses: $${tripExpenses}\nFarm overhead (depreciation): $${totalDepreciation.toFixed(2)}\nNet: $${net}\n\nFields: ${JSON.stringify(fields.map(f => ({ name: f.name, crop: f.crop, revenue: f.revenue, costs: f.costs, labour: f.labour })))}\n\nFarm Assets: ${JSON.stringify((assets || []).map(a => ({ name: a.name, cost: a.cost, lifespan: a.lifespan })))}\n\nProvide: 1) Executive summary 2) Revenue analysis 3) Cost efficiency 4) Field performance 5) Asset depreciation impact 6) Recommendations for next season`;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2048, messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await res.json();
      setAnalysis(data.content?.[0]?.text || 'No response.');
    } catch (err) { setAnalysis('Analysis failed: ' + err.message); }
    setAiLoading(false);
  };

  return (
    <>
      <div style={{ position: 'relative', height: 110, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
        <img src={IMAGES.report} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,30,80,0.85), rgba(0,0,0,0.25))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '12px 16px', color: '#fff', zIndex: 1 }}>
          <div style={S.bannerTitle}>Financial Report - Season 2025</div>
          <div style={S.bannerSub}>Comprehensive P&amp;L and balance sheet</div>
        </div>
      </div>

      <button style={S.aiBtn} onClick={runAnalysis} disabled={aiLoading}>
        {aiLoading ? 'Analyzing...' : 'Full AI Financial Analysis - Season 2025 Deep Dive + Planning for Next Season'}
      </button>
      {analysis && <div style={S.aiResult}>{analysis}</div>}

      <div className="two-col-layout" style={S.twoCol}>
        <div>
          {/* Season P&L */}
          <div style={S.plCard}>
            <div style={{ ...S.sectionTitle, marginBottom: 12 }}>Season P&amp;L</div>
            <div style={S.row}><span style={S.rowLabel}>Market trip revenue</span><span style={S.rowVal('#1a6b3a')}>{fmt(tripRevenue)}</span></div>
            <div style={S.row}><span style={S.rowLabel}>Direct sales</span><span style={S.rowVal('#1a6b3a')}>{fmt(directIncome)}</span></div>
            <div style={{ ...S.row, fontWeight: 600 }}><span>Total Revenue</span><span style={{ color: '#1a6b3a', fontWeight: 700 }}>{fmt(totalRevenue)}</span></div>
            <div style={{ height: 8 }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', padding: '6px 0 2px' }}>Field Costs</div>
            <div style={S.row}><span style={S.rowLabel}>Input costs (seeds, chemicals, fuel)</span><span style={S.rowVal('#c0392b')}>{fmt(fieldCosts)}</span></div>
            <div style={S.row}><span style={S.rowLabel}>Wages owed</span><span style={S.rowVal('#c97d1a')}>{fmt(wagesOwed)}</span></div>
            <div style={S.row}><span style={S.rowLabel}>Trip expenses</span><span style={S.rowVal('#c0392b')}>{fmt(tripExpenses)}</span></div>
            <div style={{ height: 6 }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: '#c97d1a', textTransform: 'uppercase', padding: '6px 0 2px' }}>Farm Overhead</div>
            <div style={S.row}>
              <span style={S.rowLabel}>Asset depreciation ({(Array.isArray(assets) ? assets : []).length} assets)</span>
              <span style={S.rowVal('#c97d1a')}>{fmt(totalDepreciation)}</span>
            </div>
            {(Array.isArray(assets) ? assets : []).length === 0 && (
              <div style={{ fontSize: 10, color: '#9ca3af', padding: '4px 0 6px' }}>No assets recorded. Add assets in Farm Assets tab.</div>
            )}
            <div style={S.totalRow}>
              <span>{net >= 0 ? 'Net Profit' : 'Net Loss'}</span>
              <span style={{ color: net >= 0 ? '#1a6b3a' : '#c0392b', fontFamily: "'Playfair Display', serif", fontSize: 18 }}>{fmt(net)}</span>
            </div>
          </div>

          {/* Farm Overhead detail */}
          {(Array.isArray(assets) ? assets : []).length > 0 && (
            <div style={S.overheadCard}>
              <div style={{ ...S.sectionTitle, marginBottom: 10, color: '#c97d1a' }}>Farm Overhead - Asset Depreciation</div>
              <div style={S.infoBox}>These costs are shared across the whole farm, not charged to any single field.</div>
              <table style={S.table}>
                <thead><tr>
                  <th style={S.th}>Asset</th>
                  <th style={S.th}>Cost</th>
                  <th style={S.th}>Lifespan</th>
                  <th style={S.th}>Per Season</th>
                </tr></thead>
                <tbody>
                  {(Array.isArray(assets) ? assets : []).map(a => {
                    const years = LIFESPAN_YEARS[a.lifespan] || 1;
                    const dep = parseFloat(a.cost) / years;
                    return (
                      <tr key={a.id}>
                        <td style={{ ...S.td, fontWeight: 600 }}>{a.name}</td>
                        <td style={S.td}>{fmt(a.cost)}</td>
                        <td style={S.td}>{years}yr</td>
                        <td style={{ ...S.td, color: '#c97d1a', fontWeight: 700 }}>{fmt(dep)}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={3} style={{ ...S.td, fontWeight: 700 }}>Total Depreciation</td>
                    <td style={{ ...S.td, color: '#c97d1a', fontWeight: 700 }}>{fmt(totalDepreciation)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Per-field */}
          <div style={S.sectionTitle}>Per-Field Performance</div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 14 }}>
            <table style={S.table}>
              <thead><tr>
                <th style={S.th}>Field</th><th style={S.th}>Crop</th><th style={S.th}>Revenue</th>
                <th style={S.th}>Costs</th><th style={S.th}>Labour</th><th style={S.th}>Net</th>
              </tr></thead>
              <tbody>
                {fields.map(f => {
                  const fNet = (f.revenue || 0) - (f.costs || 0) - (f.labour || 0);
                  return (
                    <tr key={f.id}>
                      <td style={{ ...S.td, fontWeight: 600 }}>{f.name}</td>
                      <td style={S.td}>{f.crop}</td>
                      <td style={{ ...S.td, color: '#1a6b3a' }}>{fmt(f.revenue)}</td>
                      <td style={{ ...S.td, color: '#c0392b' }}>{fmt(f.costs)}</td>
                      <td style={{ ...S.td, color: '#c97d1a' }}>{fmt(f.labour)}</td>
                      <td style={{ ...S.td, fontWeight: 700, color: fNet >= 0 ? '#1a6b3a' : '#c0392b' }}>{fmt(fNet)}</td>
                    </tr>
                  );
                })}
                {fields.length === 0 && <tr><td style={S.td} colSpan={6}>No fields.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Balance sheet */}
        <div>
          <div style={S.card}>
            <div style={{ ...S.sectionTitle, marginBottom: 14 }}>Balance Sheet</div>
            <div style={S.bsSection}>
              <div style={S.bsTitle}>Assets</div>
              <div style={S.row}><span style={S.rowLabel}>Cash from sales</span><span style={S.rowVal('#1a6b3a')}>{fmt(totalRevenue)}</span></div>
              <div style={S.row}><span style={S.rowLabel}>Stock on hand</span><span style={S.rowVal('#1a6b3a')}>{fmt(stockValue)}</span></div>
              <div style={S.row}><span style={S.rowLabel}>Crop investment</span><span style={S.rowVal('#1a6b3a')}>{fmt(fieldCosts)}</span></div>
              <div style={{ ...S.row, fontWeight: 700, borderBottom: '2px solid #e5e7eb' }}><span>Total Assets</span><span style={{ color: '#1a6b3a' }}>{fmt(totalAssets)}</span></div>
            </div>
            <div style={S.bsSection}>
              <div style={S.bsTitle}>Liabilities</div>
              <div style={S.row}><span style={S.rowLabel}>Wages owed</span><span style={S.rowVal('#c0392b')}>{fmt(wagesOwed)}</span></div>
              <div style={S.row}><span style={S.rowLabel}>Input costs</span><span style={S.rowVal('#c0392b')}>{fmt(fieldCosts)}</span></div>
              <div style={S.row}><span style={S.rowLabel}>Trip expenses</span><span style={S.rowVal('#c0392b')}>{fmt(tripExpenses)}</span></div>
              <div style={S.row}><span style={S.rowLabel}>Asset depreciation</span><span style={S.rowVal('#c97d1a')}>{fmt(totalDepreciation)}</span></div>
              <div style={{ ...S.row, fontWeight: 700, borderBottom: '2px solid #e5e7eb' }}><span>Total Liabilities</span><span style={{ color: '#c0392b' }}>{fmt(totalLiabilities)}</span></div>
            </div>
            <div style={S.netBox(farmNet >= 0)}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>Farm Net Position</div>
              <div style={S.netVal(farmNet >= 0)}>{fmt(farmNet)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
