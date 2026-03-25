import { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!localStorage.getItem('pwa_dismissed')) setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { setShow(false); localStorage.removeItem('pwa_dismissed'); }
    setDeferredPrompt(null);
  }

  function dismiss() { setShow(false); localStorage.setItem('pwa_dismissed', '1'); }

  if (!show) return null;
  return (
    <div style={{ position:'fixed', bottom:76, left:12, right:12, zIndex:999, background:'#1a6b3a', color:'#fff', borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 4px 24px rgba(0,0,0,0.3)', fontFamily:'Inter,sans-serif', gap:12 }}>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:3}}>📲 Install Makonese Farm</div>
        <div style={{fontSize:11,opacity:0.85}}>Add to home screen for quick access</div>
      </div>
      <div style={{display:'flex',gap:8,flexShrink:0}}>
        <button onClick={dismiss} style={{background:'rgba(255,255,255,0.2)',border:'none',color:'#fff',padding:'7px 10px',borderRadius:7,fontSize:12,cursor:'pointer'}}>Not now</button>
        <button onClick={install} style={{background:'#fff',border:'none',color:'#1a6b3a',padding:'7px 14px',borderRadius:7,fontSize:12,fontWeight:700,cursor:'pointer'}}>Install</button>
      </div>
    </div>
  );
}
