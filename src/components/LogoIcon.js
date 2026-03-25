import React from 'react';
export default function LogoIcon({ size = 32 }) {
  const gold = '#C97D1A';
  const darkGreen = '#0D4A22';
  const w = size * 0.75;
  return (
    <svg width={w} height={size} viewBox="0 0 75 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="75" height="100" rx="12" fill={darkGreen}/>
      <ellipse cx="37.5" cy="52" rx="30" ry="40" fill="none" stroke={gold} strokeWidth="1.5"/>
      <text x="37.5" y="50" textAnchor="middle" fontFamily="Georgia,serif" fontSize="16" fontWeight="700" fill={gold}>M</text>
      <line x1="22" y1="68" x2="22" y2="54" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
      <path d="M22 54 Q19.5 50 18.5 54 Q20.5 55.5 22 54Z" fill={gold}/>
      <path d="M22 54 Q24.5 50 25.5 54 Q23.5 55.5 22 54Z" fill={gold} opacity="0.85"/>
      <line x1="29" y1="68" x2="29" y2="52" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
      <path d="M29 52 Q26.5 47 25.5 52 Q27.5 53.5 29 52Z" fill={gold}/>
      <path d="M29 52 Q31.5 47 32.5 52 Q30.5 53.5 29 52Z" fill={gold} opacity="0.85"/>
      <line x1="37.5" y1="68" x2="37.5" y2="50" stroke={gold} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M37.5 50 Q34.5 44.5 33.5 50 Q35.5 51.5 37.5 50Z" fill={gold}/>
      <path d="M37.5 50 Q40.5 44.5 41.5 50 Q39.5 51.5 37.5 50Z" fill={gold} opacity="0.85"/>
      <line x1="46" y1="68" x2="46" y2="52" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
      <path d="M46 52 Q43.5 47 42.5 52 Q44.5 53.5 46 52Z" fill={gold}/>
      <path d="M46 52 Q48.5 47 49.5 52 Q47.5 53.5 46 52Z" fill={gold} opacity="0.85"/>
      <line x1="53" y1="68" x2="53" y2="54" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
      <path d="M53 54 Q50.5 50 49.5 54 Q51.5 55.5 53 54Z" fill={gold}/>
      <path d="M53 54 Q55.5 50 56.5 54 Q54.5 55.5 53 54Z" fill={gold} opacity="0.85"/>
      <line x1="18" y1="68" x2="57" y2="68" stroke={gold} strokeWidth="0.9"/>
    </svg>
  );
}
