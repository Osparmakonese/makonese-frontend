/**
 * POSImmersiveControls.js — floating control cluster for immersive POS themes.
 *
 * Shown in the top-right corner of Scanner Lane and Dark Supermarket layouts.
 * Gives the cashier / manager a way to:
 *   - toggle browser Fullscreen (Kiosk-style, hides the browser chrome too)
 *   - toggle Focus mode (hide / restore the Pewil sidebar + topbar)
 *   - exit back to the default POS view
 *
 * The component is intentionally compact so it doesn't compete with the POS UI
 * but stays reachable at all times.
 */
import React, { useEffect, useState } from 'react';

export default function POSImmersiveControls({
  focusMode,
  setFocusMode,
  onExitTheme,
  variant = 'light', // 'light' (pnp) or 'dark'
}) {
  const [isFS, setIsFS] = useState(
    typeof document !== 'undefined' && !!document.fullscreenElement
  );

  useEffect(() => {
    const onChange = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFS = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (_) {
      /* user denied or unsupported — ignore */
    }
  };

  const isDark = variant === 'dark';
  const btn = {
    padding: '8px 12px',
    border: '1px solid ' + (isDark ? '#334155' : '#cbd5e1'),
    borderRadius: 6,
    background: isDark ? 'rgba(17,26,46,0.92)' : 'rgba(255,255,255,0.92)',
    color: isDark ? '#e5e7eb' : '#0f172a',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.04em',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  };
  const btnAccent = {
    ...btn,
    background: isDark ? '#22d3ee' : '#1a6b3a',
    color: isDark ? '#0b1020' : '#fff',
    borderColor: isDark ? '#22d3ee' : '#15803d',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      zIndex: 60,
      display: 'flex',
      gap: 6,
      alignItems: 'center',
    }}>
      <button
        type="button"
        onClick={toggleFS}
        style={btn}
        title={isFS ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'}
      >
        {isFS ? '⛶ Exit Fullscreen' : '⛶ Fullscreen'}
      </button>
      <button
        type="button"
        onClick={() => setFocusMode((v) => !v)}
        style={focusMode ? btnAccent : btn}
        title={focusMode ? 'Show Pewil sidebar / topbar' : 'Hide Pewil chrome'}
      >
        {focusMode ? '◱ Show Chrome' : '◱ Hide Chrome'}
      </button>
      {onExitTheme && (
        <button
          type="button"
          onClick={onExitTheme}
          style={btn}
          title="Return to default POS view"
        >
          ✕ Exit Theme
        </button>
      )}
    </div>
  );
}
