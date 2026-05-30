import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePublicAdmin } from "@/contexts/PublicAdminAuthContext";
import { toast } from "sonner";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

export default function PublicAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = usePublicAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Admin!");
      navigate("/portal-admin");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#020617', fontFamily: "'Outfit', sans-serif" }}>
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none" style={{ background: 'rgba(243,156,18,0.06)', filter: 'blur(120px)' }} />

      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-6" style={{ background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.2)' }}>
            <ShieldCheck className="h-8 w-8" style={{ color: '#f39c12' }} />
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#f8fafc' }}>Portal Admin</h1>
          <p className="mt-2 text-sm" style={{ color: '#94a3b8' }}>Public Student Portal — Command Center</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl space-y-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1" style={{ color: '#64748b' }}>Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors" style={{ color: '#64748b' }}>
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email" required autoFocus
                className="w-full h-14 rounded-2xl pl-12 text-sm font-medium focus:outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc' }}
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1" style={{ color: '#64748b' }}>Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors" style={{ color: '#64748b' }}>
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password" required
                className="w-full h-14 rounded-2xl pl-12 text-sm font-medium focus:outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full h-14 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f39c12, #d35400)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 8px 25px rgba(243,156,18,0.3)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Sign In to Admin Panel"}
          </button>
        </form>

        <p className="text-center mt-6 text-xs" style={{ color: '#334155' }}>
          Admissions Made Easy — Admin Access Only
        </p>
      </div>
    </div>
  );
}
