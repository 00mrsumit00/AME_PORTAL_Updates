
import React from "react";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import { Link } from "react-router-dom";
import { Lock, UserCircle, ChevronRight, Sparkles } from "lucide-react";

export default function ProfileGate({ children }) {
  const { isProfileComplete, loading } = usePublicAuth();

  if (loading) return null;

  if (isProfileComplete) {
    return children;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500 min-h-[75vh]">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
        <div className="relative h-24 w-24 bg-slate-900 border-2 border-amber-500/30 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
          <Lock className="h-10 w-10 text-amber-500 -rotate-3" />
        </div>
        <div className="absolute -top-2 -right-2 h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <Sparkles className="h-4 w-4 text-black" />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-black text-slate-100 mb-4 max-w-md leading-tight">
        Personalize Your Experience
      </h2>
      
      <p className="text-slate-400 text-sm md:text-base max-w-md mb-10 leading-relaxed">
        To unlock accurate predictions, real-time updates, and counselor chats tailored to your score, please complete your academic profile first.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[280px]">
        <Link 
          to="/app/profile" 
          className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#f39c12] via-[#e67e22] to-[#d35400] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-2xl shadow-amber-600/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <UserCircle className="h-5 w-5" /> 
          <span className="tracking-wide">Complete Profile</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-8 opacity-40">
        <div className="flex flex-col items-center gap-2">
          <div className="h-1 w-12 bg-slate-800 rounded-full" />
          <div className="h-1 w-8 bg-slate-800 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-1 w-12 bg-slate-800 rounded-full" />
          <div className="h-1 w-8 bg-slate-800 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-1 w-12 bg-slate-800 rounded-full" />
          <div className="h-1 w-8 bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}
