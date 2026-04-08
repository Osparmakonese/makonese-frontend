import React from 'react';
export default function Logo({ size = 36, showText = true, variant = 'light' }) {
  const h = size;
  const w = size * 0.75;
  const gold = '#C97D1A';
  const darkGreen = '#0D4A22';
  const textColor = variant === 'dark' ? '#C97D1A' : '#111827';
  const subColor = variant === 'dark' ? '#C97D1A' : '#6b7280';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={w} height={h} viewBox="0 0 75 100" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <defs>
          <path id="topA" d="M 37.5,50 m -30,0 a 30,30 0 0,1 60,0"/>
          <path id="botA" d="M 37.5,50 m -36,20 a 43,43 0 0,0 72,0"/>
        </defs>
        {/* background */}
        <rect width="75" height="100" rx="12" fill={darkGreen}/>
        {/* outer oval */}
        <ellipse cx="37.5" cy="52" rx="30" ry="40" fill="none" stroke={gold} strokeWidth="1.2"/>
        {/* inner oval */}
        <ellipse cx="37.5" cy="52" rx="25" ry="33" fill="none" stroke={gold} strokeWidth="0.5" opacity="0.5"/>
        {/* MAKONESE top arc */}
        <text fontFamily="Georgia,serif" fontSize="6" fontWeight="700" fill={gold} letterSpacing="2.2">
          <textPath href="#topA" startOffset="12%">MAKONESE</textPath>
        </text>
        {/* M letterform */}
        <text x="37.5" y="50" textAnchor="middle" fontFamily="Georgia,serif" fontSize="16" fontWeight="700" fill={gold}>M</text>
        {/* wheat stalk 1 */}
        <line x1="22" y1="68" x2="22" y2="54" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
        <path d="M22 54 Q19.5 50 18.5 54 Q20.5 55.5 22 54Z" fill={gold}/>
        <path d="M22 57.5 Q19 54.5 18.5 57.5 Q20 59 22 58Z" fill={gold} opacity="0.7"/>
        <path d="M22 54 Q24.5 50 25.5 54 Q23.5 55.5 22 54Z" fill={gold} opacity="0.85"/>
        {/* wheat stalk 2 */}
        <line x1="29" y1="68" x2="29" y2="52" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
        <path d="M29 52 Q26.5 47 25.5 52 Q27.5 53.5 29 52Z" fill={gold}/>
        <path d="M29 56 Q26 52.5 25.5 56 Q27 57.5 29 57Z" fill={gold} opacity="0.7"/>
        <path d="M29 52 Q31.5 47 32.5 52 Q30.5 53.5 29 52Z" fill={gold} opacity="0.85"/>
        {/* wheat stalk 3 — centre tallest */}
        <line x1="37.5" y1="68" x2="37.5" y2="50" stroke={gold} strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M37.5 50 Q34.5 44.5 33.5 50 Q35.5 51.5 37.5 50Z" fill={gold}/>
        <path d="M37.5 54.5 Q34 51 33.5 54.5 Q35 56 37.5 55.5Z" fill={gold} opacity="0.7"/>
        <path d="M37.5 50 Q40.5 44.5 41.5 50 Q39.5 51.5 37.5 50Z" fill={gold} opacity="0.85"/>
        {/* wheat stalk 4 */}
        <line x1="46" y1="68" x2="46" y2="52" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
        <path d="M46 52 Q43.5 47 42.5 52 Q44.5 53.5 46 52Z" fill={gold}/>
        <path d="M46 56 Q43 52.5 42.5 56 Q44 57.5 46 57Z" fill={gold} opacity="0.7"/>
        <path d="M46 52 Q48.5 47 49.5 52 Q47.5 53.5 46 52Z" fill={gold} opacity="0.85"/>
        {/* wheat stalk 5 */}
        <line x1="53" y1="68" x2="53" y2="54" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
        <path d="M53 54 Q50.5 50 49.5 54 Q51.5 55.5 53 54Z" fill={gold}/>
        <path d="M53 57.5 Q50 54.5 49.5 57.5 Q51 59 53 58Z" fill={gold} opacity="0.7"/>
        <path d="M53 54 Q55.5 50 56.5 54 Q54.5 55.5 53 54Z" fill={gold} opacity="0.85"/>
        {/* ground line */}
        <line x1="18" y1="68" x2="57" y2="68" stroke={gold} strokeWidth="0.9"/>
        {/* year */}
        <text x="37.5" y="76" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill={gold} letterSpacing="1.8" opacity="0.85">2025</text>
        {/* FINANCIAL SYSTEM bottom arc */}
        <text fontFamily="Georgia,serif" fontSize="5.5" fontWeight="700" fill={gold} letterSpacing="1.8">
          <textPath href="#botA" startOffset="8%">FINANCIAL SYSTEM</textPath>
        </text>
      </svg>
      {showText && (
        <div>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: size > 50 ? 20 : size > 36 ? 16 : 14,
            fontWeight: 700,
            color: textColor,
            lineHeight: 1.15,
            letterSpacing: '-0.2px'
          }}>
            Makonese Farm
          </div>
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 9,
            color: subColor,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: 2,
            opacity: 0.7
          }}>
            Financial System
          </div>
        </div>
      )}
    </div>
  );
}
