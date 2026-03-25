import React from 'react';

/* ── Inline styles ── */
const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--ink)',
  },
  qty: {
    fontSize: '0.8rem',
    color: '#666',
  },
  trackOuter: {
    height: 8,
    borderRadius: 4,
    background: 'var(--border)',
    overflow: 'hidden',
  },
  trackInner: (pct, isLow) => ({
    height: '100%',
    width: `${Math.min(pct, 100)}%`,
    borderRadius: 4,
    background: isLow ? 'var(--red)' : 'var(--green-light)',
    transition: 'width 0.3s ease',
  }),
  warning: {
    fontSize: '0.7rem',
    color: 'var(--red)',
    fontWeight: 600,
    marginTop: 4,
  },
};

/**
 * Stock bar – shows item name, remaining qty, progress bar, and
 * a low-stock warning when qty drops below the alert threshold.
 *
 * Props:
 *  - name           {string}
 *  - remaining      {number}  – current qty on hand
 *  - total          {number}  – original / full qty (for progress calc)
 *  - unit           {string}  – e.g. "kg", "L", "bags"
 *  - alertThreshold {number}  – show warning when remaining ≤ this
 */
export default function StockBar({
  name,
  remaining = 0,
  total = 1,
  unit = '',
  alertThreshold = 0,
}) {
  const safeDenom = total > 0 ? total : 1;
  const pct = (remaining / safeDenom) * 100;
  const isLow = remaining <= alertThreshold;

  return (
    <div className="card" style={{ padding: '12px 16px' }}>
      {/* Top line: name + qty */}
      <div style={styles.row}>
        <span style={styles.name}>{name}</span>
        <span style={styles.qty}>
          {remaining} / {total} {unit}
        </span>
      </div>

      {/* Progress bar */}
      <div style={styles.trackOuter}>
        <div style={styles.trackInner(pct, isLow)} />
      </div>

      {/* Low-stock warning */}
      {isLow && (
        <div style={styles.warning}>
          ⚠ Low stock – below {alertThreshold} {unit}
        </div>
      )}
    </div>
  );
}
