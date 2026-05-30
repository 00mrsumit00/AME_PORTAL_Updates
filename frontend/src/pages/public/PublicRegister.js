import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import { toast } from "sonner";
import { Loader2, Phone, Lock, User, MessageCircle, ChevronRight } from "lucide-react";

export default function PublicRegister() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = usePublicAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      await register(fullName, phone, password);
      toast.success("Account created successfully!");
      // Redirect new users to complete their profile
      navigate("/app/profile");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1c] p-4 relative overflow-hidden font-sans">
      {/* Premium Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#f39c12]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#d35400]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-10 p-8 my-8">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-white p-2 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#f39c12]/20 border border-[#f39c12]/10">
            <img src="/icons/icon-512x512.png" alt="AME Logo" className="h-full w-full object-contain" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Create Account</h1>
        <p className="text-center text-blue-200/70 mb-8 text-sm">
          Unlock the free college predictor & real-time cutoffs.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#f39c12] transition-colors">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                required
                className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 focus:outline-none focus:border-[#f39c12]/50 focus:ring-1 focus:ring-[#f39c12]/50 transition-all placeholder:text-white/20"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#f39c12] transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <input
                type="tel"
                inputMode="numeric"
                required
                maxLength="10"
                className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 focus:outline-none focus:border-[#f39c12]/50 focus:ring-1 focus:ring-[#f39c12]/50 transition-all placeholder:text-white/20"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Create Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#f39c12] transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 focus:outline-none focus:border-[#f39c12]/50 focus:ring-1 focus:ring-[#f39c12]/50 transition-all placeholder:text-white/20"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full h-12 mt-2 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:bg-[#25D366]/20"
            onClick={() => toast.info("WhatsApp verification will be enabled soon.")}
          >
            <MessageCircle className="h-5 w-5" />
            Verify via WhatsApp (Coming Soon)
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-6 rounded-xl bg-gradient-to-r from-[#f39c12] to-[#d35400] text-white font-bold text-lg shadow-[0_0_20px_rgba(243,156,18,0.3)] hover:shadow-[0_0_25px_rgba(243,156,18,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <>
                Create Account
                <ChevronRight className="h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/public-login" className="font-semibold text-white hover:text-[#f39c12] transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
