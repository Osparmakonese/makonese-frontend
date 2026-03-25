import React, { useState } from 'react';
import { fmt } from '../utils/format';
import { getDailySummary } from '../api/farmApi';

const S = {
  bar: {
    position: 'sticky', top: 0, zIndex: 50,
    background: '#ffffff', borderBottom: '1px solid #e5e7eb',
    padding: '12px 24px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', minHeight: 56,
  },
  left: { display: 'flex', flexDirection: 'column' },
  title: {
    fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700,
    color: '#111827', lineHeight: 1.2,
  },
  sub: { fontSize: 11, color: '#6b7280', marginTop: 1 },
  right: { display: 'flex', alignItems: 'center', gap: 8 },
  dateChip: {
    background: '#f3f4f6', fontSize: 11, padding: '5px 10px', borderRadius: 6,
    color: '#374151', fontWeight: 500,
  },
  waBtn: {
    background: '#25D366', color: '#fff', border: 'none', borderRadius: 7,
    padding: '7px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 6, transition: 'opacity 0.15s',
  },
  primaryBtn: {
    background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7,
    padding: '7px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
    transition: 'background 0.15s',
  },
};

function formatDate() {
  const d = new Date();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Topbar({ pageTitle, pageSub, primaryAction, onPrimaryAction, onWhatsApp, dashboardData }) {
  const [waBtnText, setWaBtnText] = useState('Send Update');

  async function buildWhatsAppMessage() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const dayName = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    let msg = `🌱 *MAKONESE FARM — Daily Update*\n📅 ${dayName}\n`;

    try {
      const summary = await getDailySummary(dateStr);
      const fields = summary.fields || [];

      if (fields.length === 0) {
        msg += `\n📋 No activity recorded today yet.\n`;
      } else {
        fields.forEach(field => {
          msg += `\n${'─'.repeat(28)}\n`;
          msg += `🌾 *${field.field_name}* (${field.crop})\n`;

          // Workers
          if (field.attendance && field.attendance.length > 0) {
            msg += `\n👷 *Workers today:*\n`;
            field.attendance.forEach(a => {
              const timeStr = a.hours ? `${a.hours}hrs` : a.days ? `${a.days} day(s)` : '';
              msg += `• ${a.worker} (${a.role})${timeStr ? ' — ' + timeStr : ''} = $${a.pay.toFixed(2)}${a.notes ? ' · ' + a.notes : ''}\n`;
            });
          }

          // Stock used
          if (field.stock_usage && field.stock_usage.length > 0) {
            msg += `\n🧪 *Inputs used today:*\n`;
            field.stock_usage.forEach(u => {
              const remaining = u.remaining;
              const stockStatus = u.low_stock ? '⚠️ LOW STOCK' : `${remaining} ${u.unit} remaining`;
              msg += `• ${u.item} — used ${u.qty_used} ${u.unit} ($${u.cost.toFixed(2)}) · ${stockStatus}${u.notes ? ' · ' + u.notes : ''}\n`;
              if (remaining <= 0) msg += `  🚨 *OUT OF STOCK — reorder immediately*\n`;
            });
          }

          // Costs
          if (field.expenses && field.expenses.length > 0) {
            msg += `\n🧾 *Costs today:*\n`;
            field.expenses.forEach(e => {
              msg += `• ${e.description}${e.is_auto ? ' (auto)' : ''} — $${e.amount.toFixed(2)}\n`;
            });
          }

          // Trips/revenue
          if (field.trips && field.trips.length > 0) {
            msg += `\n🚚 *Market trips today:*\n`;
            field.trips.forEach(t => {
              msg += `• ${t.market} — ${t.crates} crates → *$${t.revenue.toFixed(2)}*\n`;
            });
          }
        });
      }

      // Season totals from dashboardData prop
      if (dashboardData) {
        msg += `\n${'─'.repeat(28)}\n`;
        msg += `💰 *Season totals*\n`;
        msg += `Revenue: $${(dashboardData.total_revenue || 0).toFixed(2)}\n`;
        msg += `Costs: $${(dashboardData.total_costs || 0).toFixed(2)}\n`;
        msg += `Wages owed: $${(dashboardData.wages_owed || 0).toFixed(2)}\n`;
        msg += `Net: $${(dashboardData.net_position || 0).toFixed(2)} ${(dashboardData.net_position || 0) >= 0 ? '✓' : '↓'}\n`;
      }

      // Low stock alerts from dashboard
      if (dashboardData && dashboardData.low_stock && dashboardData.low_stock.length > 0) {
        msg += `\n⚠️ *Low stock alerts:*\n`;
        dashboardData.low_stock.forEach(s => {
          msg += `• ${s.name}: ${s.remaining_qty} ${s.unit} remaining\n`;
        });
      }

    } catch (err) {
      msg += `\n📊 *Season overview*\n`;
      if (dashboardData) {
        msg += `Revenue: $${(dashboardData.total_revenue || 0).toFixed(2)} · Net: $${(dashboardData.net_position || 0).toFixed(2)}\n`;
      }
    }

    msg += `\n— Makonese Farm System`;
    return msg;
  }

  const sendWhatsApp = async () => {
    if (onWhatsApp) { onWhatsApp(); return; }
    setWaBtnText('Building...');
    try {
      const msg = await buildWhatsAppMessage();
      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
    } catch (err) {
      console.error('WhatsApp message failed:', err);
    }
    setWaBtnText('Send Update');
  };

  return (
    <div style={S.bar}>
      <div style={S.left}>
        <div style={S.title}>{pageTitle}</div>
        <div style={S.sub}>{pageSub}</div>
      </div>
      <div style={S.right}>
        <span style={S.dateChip}>{formatDate()}</span>
        <button
          style={S.waBtn}
          onClick={sendWhatsApp}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          <WaIcon /> {waBtnText}
        </button>
        {primaryAction && (
          <button
            style={S.primaryBtn}
            onClick={onPrimaryAction}
            onMouseEnter={e => { e.currentTarget.style.background = '#2d9e58'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1a6b3a'; }}
          >
            {primaryAction}
          </button>
        )}
      </div>
    </div>
  );
}
