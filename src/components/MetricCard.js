import React from 'react';

/* Colour map using CSS-variable tokens from index.css */
const COLOR_MAP = {
  green: 'var(--green)',
  red:   'var(--red)',
  amber: 'var(--amber)',
};

/**
 * A single metric tile – shows a label + value.
 *
 * Props:
 *  - label  {string}             – e.g. "Total Revenue"
 *  - value  {string|number}      – e.g. "$12,340"
 *  - color  {'green'|'red'|'amber'} – accent colour for the value (default green)
 */
export default function MetricCard({ label, value, color = 'green' }) {
  return (
    <div className="metric">
      <div
        className="metric-value"
        style={{ color: COLOR_MAP[color] || COLOR_MAP.green }}
      >
        {value ?? '—'}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
}
