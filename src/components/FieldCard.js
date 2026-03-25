import React from 'react';
import { fmt } from '../utils/format';

/* ── Crop → emoji lookup ── */
const CROP_EMOJI = {
  maize:      '🌽',
  tobacco:    '🍂',
  soya:       '🫘',
  groundnuts: '🥜',
  cotton:     '🌿',
  wheat:      '🌾',
  sunflower:  '🌻',
  potato:     '🥔',
  tomato:     '🍅',
};

/* ── Status → pill class ── */
const STATUS_PILL = {
  active:    'pill pill-green',
  harvested: 'pill pill-amber',
  closed:    'pill pill-red',
};

/* ── Inline styles ── */
const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: '1.2rem',
  },
  name: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: 'var(--ink)',
  },
  ha: {
    fontSize: '0.75rem',
    color: '#888',
    marginTop: 2,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
    marginTop: 10,
    borderTop: '1px solid var(--border)',
    paddingTop: 10,
  },
  stat: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '0.85rem',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  statLabel: {
    fontSize: '0.65rem',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
};

/**
 * Field card – shows name, crop, hectares, status, plus 3 mini-stats.
 *
 * Props (from API field object):
 *  - name       {string}
 *  - crop       {string}         – lookup key for emoji
 *  - hectares   {number}
 *  - status     {'active'|'harvested'|'closed'}
 *  - revenue    {number}
 *  - costs      {number}         – combined costs + labour
 *  - net        {number}         – revenue − costs
 *  - onClick    {function}       – optional card tap handler
 */
export default function FieldCard({
  name,
  crop = '',
  hectares,
  status = 'active',
  revenue = 0,
  costs = 0,
  net = 0,
  onClick,
}) {
  const emoji = CROP_EMOJI[crop?.toLowerCase()] || '🌱';
  const pillClass = STATUS_PILL[status] || 'pill pill-green';

  return (
    <div
      className="card"
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {/* Header row */}
      <div style={styles.header}>
        <div>
          <div style={styles.nameRow}>
            <span style={styles.emoji}>{emoji}</span>
            <span style={styles.name}>{name}</span>
          </div>
          <div style={styles.ha}>{hectares} ha</div>
        </div>
        <span className={pillClass}>{status}</span>
      </div>

      {/* Mini-stats grid */}
      <div style={styles.statsGrid}>
        <div style={styles.stat}>
          <div style={{ ...styles.statValue, color: 'var(--green)' }}>
            {fmt(revenue)}
          </div>
          <div style={styles.statLabel}>Revenue</div>
        </div>
        <div style={styles.stat}>
          <div style={{ ...styles.statValue, color: 'var(--amber)' }}>
            {fmt(costs)}
          </div>
          <div style={styles.statLabel}>Costs+Labour</div>
        </div>
        <div style={styles.stat}>
          <div
            style={{
              ...styles.statValue,
              color: net >= 0 ? 'var(--green)' : 'var(--red)',
            }}
          >
            {fmt(net)}
          </div>
          <div style={styles.statLabel}>Net</div>
        </div>
      </div>
    </div>
  );
}
