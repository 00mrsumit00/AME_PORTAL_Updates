import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeToWakingUp } from "@/lib/api";

const ServerWakeupContext = createContext({
  isWakingUp: false,
});

export const useServerWakeup = () => useContext(ServerWakeupContext);

export const ServerWakeupProvider = ({ children }) => {
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // 1. Subscribe to Axios slow request status
  useEffect(() => {
    const unsubscribe = subscribeToWakingUp((isSlow) => {
      setIsWakingUp(isSlow);
    });
    return () => unsubscribe();
  }, []);

  // 2. Handle live countdown/elapsed progress timer when waking up
  useEffect(() => {
    let timer;
    if (isWakingUp) {
      setElapsed(0);
      timer = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsed(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isWakingUp]);

  return (
    <ServerWakeupContext.Provider value={{ isWakingUp }}>
      {children}
      
      {/* Ultra-Minimalist Glassmorphic Loading Overlay */}
      {isWakingUp && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/75 backdrop-blur-md transition-all duration-500 animate-fadeIn">
          <div className="relative bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-[#d4af37]/20 rounded-3xl p-6 max-w-[280px] w-full mx-4 shadow-[0_0_50px_rgba(212,175,55,0.08)] text-center flex flex-col items-center overflow-hidden">
            
            {/* Sparkle background details */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-amber-600/5 rounded-full blur-2xl" />

            {/* Branded Double-Ring Spinner */}
            <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
              {/* Outer amber/gold ring */}
              <div className="absolute inset-0 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin [animation-duration:1.1s]" />
              {/* Inner amber/gold ring, reversing direction */}
              <div className="absolute inset-2 border-4 border-amber-600/10 border-b-amber-600 rounded-full animate-spin [animation-duration:0.8s] [animation-direction:reverse]" />
              {/* Central glowing core */}
              <div className="w-3.5 h-3.5 bg-amber-400 rounded-full shadow-[0_0_15px_#f59e0b] animate-pulse" />
            </div>

            {/* Minimalist Progress Panel */}
            <div className="w-full bg-slate-900/60 border border-slate-800/50 rounded-2xl p-4 flex flex-col items-center">
              {/* Bar container */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (elapsed / 45) * 100)}%` }}
                />
              </div>
              
              {/* Pulsing Wait Text */}
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-500/90 animate-pulse mt-4">
                Please wait...
              </span>
            </div>
          </div>
        </div>
      )}
    </ServerWakeupContext.Provider>
  );
};
