import React from "react";
import { Lock, Target, Sparkles, BellRing } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileGate from "@/components/public/ProfileGate";

export default function PublicPredictor() {
  const navigate = useNavigate();
  
  return (
    <ProfileGate>
      <div className="space-y-6 h-full flex flex-col items-center justify-center py-10 md:py-20 relative">
      {/* Decorative */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 384, height: 384, background: 'rgba(243,156,18,0.05)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div className="max-w-md w-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, position: 'relative', zIndex: 1 }}>
        
        {/* Header graphic */}
        <div className="flex items-center justify-center relative overflow-hidden" style={{ height: 128, background: 'linear-gradient(135deg, rgba(243,156,18,0.8), rgba(211,84,0,0.8))' }}>
          <Sparkles className="absolute" style={{ top: 16, right: 16, color: 'rgba(255,255,255,0.3)', height: 32, width: 32 }} />
          <Target className="absolute" style={{ bottom: 16, left: 16, color: 'rgba(255,255,255,0.3)', height: 40, width: 40 }} />
          <div style={{ background: 'rgba(2,6,23,0.9)', padding: 12, borderRadius: '50%', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <Lock className="h-8 w-8" style={{ color: '#f39c12' }} />
          </div>
        </div>

        <div className="p-8 text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2" style={{ color: '#f8fafc' }}>AI College Predictor</h2>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4" style={{ background: 'rgba(243,156,18,0.1)', color: '#f39c12' }}>
              Coming Soon
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              Our AI-driven Predictor is currently analyzing the latest cutoff trends to give you <strong style={{ color: '#f8fafc' }}>99% accurate</strong> college admission predictions.
            </p>
          </div>

          <div className="p-4 rounded-xl text-left" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#f8fafc' }}>
              <BellRing className="h-4 w-4" style={{ color: '#f39c12' }} /> 
              Get Early Access
            </h4>
            <p className="text-xs mb-4" style={{ color: '#94a3b8' }}>
              Update your profile score today, and we'll notify you the exact second this feature unlocks.
            </p>
            
            <div className="w-full h-10 rounded-xl flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.2)', color: '#f39c12' }}>
              ✓ You're on the priority waitlist
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProfileGate>
  );
}
