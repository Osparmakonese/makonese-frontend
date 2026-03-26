import React, { useState, useEffect } from "react";
import { getQueue } from "./offlineQueue";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const goOnline = () => { setOffline(false); setQueueCount(getQueue().length); };
    const goOffline = () => { setOffline(true); setQueueCount(getQueue().length); };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    const interval = setInterval(() => setQueueCount(getQueue().length), 5000);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      clearInterval(interval);
    };
  }, []);

  if (!offline && queueCount === 0) return null;

  return (
    <div style={{
      position: "fixed", bottom: "16px", left: "50%",
      transform: "translateX(-50%)", zIndex: 9999,
      background: offline ? "#b71c1c" : "#e65100",
      color: "#fff", padding: "10px 20px", borderRadius: "8px",
      fontSize: "13px", fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      display: "flex", alignItems: "center", gap: "8px",
      fontFamily: "Inter, sans-serif", whiteSpace: "nowrap"
    }}>
      {offline
        ? "📵 You are offline — changes will sync when reconnected"
        : `🔄 Back online — syncing ${queueCount} saved action${queueCount !== 1 ? "s" : ""}...`
      }
    </div>
  );
}
