import React from 'react';
export default function Logo({ size = 36, showText = true, variant = 'light' }) {
  const gold = '#C97D1A';
  const darkGreen = '#0D4A22';
  const leafGreen = '#2d9e58';
  const textColor = variant === 'dark' ? '#C97D1A' : '#111827';
  const subColor = variant === 'dark' ? '#C97D1A' : '#6b7280';
  const boxH = Math.round(size * 0.75);
  const boxW = Math.round(size * 1.6);
  const fontSize = Math.round(size * 0.42);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        background: darkGreen, borderRadius: 8, padding: '4px 8px',
        display: 'flex', alignItems: 'center', gap: 4,
        minWidth: boxW, height: boxH, justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ color: leafGreen, fontSize: fontSize - 1, lineHeight: 1 }}>{'\u{1F33F}'}</span>
        <span style={{ color: gold, fontWeight: 800, fontSize, letterSpacing: 0.5, lineHeight: 1 }}>PEWIL</span>
      </div>
      {showText && (
        <div>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: size > 50 ? 20 : size > 36 ? 14 : 13,
            fontWeight: 700,
            color: textColor,
            lineHeight: 1.15,
          }}>
            Pewil ERP
          </div>
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 9,
            color: subColor,
            fontWeight: 600,
            letterSpacing: '0.06em',
            marginTop: 1,
            opacity: 0.7
          }}>
            Multi-tenant Platform
          </div>
        </div>
      )}
    </div>
  );
}
