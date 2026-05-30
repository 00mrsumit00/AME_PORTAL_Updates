import { useState, useEffect, useCallback } from "react";
import { usePublicAdmin } from "@/contexts/PublicAdminAuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { 
  Plus, UserPlus, Trash2, Shield, Loader2, 
  X, Check, Mail, Lock, User, Phone
} from "lucide-react";

const AMBER = "#f39c12";
const cardStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 };

export default function PublicAdminSubAdminManagement() {
  const { authHeader, admin } = usePublicAdmin();
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSA, setNewSA] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSubAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/public-admin/sub-admins", authHeader());
      setSubAdmins(res.data);
    } catch (err) {
      toast.error("Failed to load sub-admins");
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => {
    if (admin?.role === "PUBLIC_ADMIN") {
      fetchSubAdmins();
    }
  }, [admin, fetchSubAdmins]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/public-admin/sub-admins", newSA, authHeader());
      toast.success("Sub-admin created successfully");
      setShowAddModal(false);
      setNewSA({ name: "", email: "", password: "" });
      fetchSubAdmins();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create sub-admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSAStatus = async (saId) => {
    try {
      await api.put(`/public-admin/sub-admins/${saId}/toggle`, {}, authHeader());
      toast.success("Status updated");
      fetchSubAdmins();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteSA = async (saId) => {
    if (!window.confirm("Are you sure you want to delete this sub-admin?")) return;
    try {
      await api.delete(`/public-admin/sub-admins/${saId}`, authHeader());
      toast.success("Sub-admin deleted");
      fetchSubAdmins();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (admin?.role !== "PUBLIC_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Shield className="h-16 w-16 text-rose-500 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-slate-400 mt-2">Only Master Admin can manage sub-admin accounts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#f8fafc' }}>Sub-Admin Management</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Manage counselor access accounts</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #f39c12, #d35400)', color: '#fff', boxShadow: '0 8px 25px rgba(243,156,18,0.3)' }}
        >
          <Plus className="h-4 w-4" />
          Add New Counselor
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#f39c12]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subAdmins.map(sa => (
            <div key={sa.id} className="p-6 space-y-4 relative overflow-hidden group" style={cardStyle}>
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => deleteSA(sa.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-black" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                  {sa.name?.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="font-bold text-white">{sa.name}</h3>
                  <p className="text-xs text-slate-500">{sa.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Status</span>
                  <span className={`text-xs font-bold ${sa.is_active !== false ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {sa.is_active !== false ? "Active" : "Disabled"}
                  </span>
                </div>
                <button 
                  onClick={() => toggleSAStatus(sa.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${sa.is_active !== false ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                >
                  {sa.is_active !== false ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}

          {subAdmins.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <UserPlus className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">No counselor accounts created yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md p-8 rounded-3xl space-y-8 relative overflow-hidden" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="absolute top-0 right-0 p-6">
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Create Counselor Account</h2>
              <p className="text-sm text-slate-400 mt-1">Provide login credentials for the new sub-admin.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                  <input required
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
                    placeholder="e.g. Rahul Sharma"
                    value={newSA.name}
                    onChange={e => setNewSA({...newSA, name: e.target.value})}
                  />
                </div>
              </div>


              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                  <input required type="email"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
                    placeholder="counselor@example.com"
                    value={newSA.email}
                    onChange={e => setNewSA({...newSA, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                  <input required type="password"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
                    placeholder="••••••••"
                    value={newSA.password}
                    onChange={e => setNewSA({...newSA, password: e.target.value})}
                  />
                </div>
              </div>

              <button disabled={isSubmitting} type="submit"
                className="w-full h-14 mt-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #f39c12, #d35400)', boxShadow: '0 8px 25px rgba(243,156,18,0.3)' }}
              >
                {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
