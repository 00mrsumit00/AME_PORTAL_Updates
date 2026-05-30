import { useState, useEffect, useCallback } from "react";
import { usePublicAdmin } from "@/contexts/PublicAdminAuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { 
  Search, Download, Edit2, Trash2, UserCheck, UserX, 
  ChevronLeft, ChevronRight, Loader2, MoreVertical, X, Check
} from "lucide-react";

const AMBER = "#f39c12";
const cardStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 };

export default function PublicAdminUserManagement() {
  const { authHeader } = usePublicAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(50);

  // Modals state
  const [passwordModal, setPasswordModal] = useState({ show: false, userId: "", name: "", newPassword: "" });
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: "", name: "" });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/public-admin/users?search=${search}&page=${page}&limit=${limit}`, authHeader());
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, authHeader]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleExport = async () => {
    try {
      const response = await api.get("/public-admin/export-users", {
        ...authHeader(),
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `public_users_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Export failed");
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    try {
      await api.put("/public-admin/users/toggle", { user_id: userId, is_active: !currentStatus }, authHeader());
      toast.success(`User ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const changePassword = async () => {
    if (!passwordModal.newPassword) return toast.error("Enter a new password");
    try {
      await api.put("/public-admin/users/password", { 
        user_id: passwordModal.userId, 
        new_password: passwordModal.newPassword 
      }, authHeader());
      toast.success("Password updated successfully");
      setPasswordModal({ show: false, userId: "", name: "", newPassword: "" });
    } catch (err) {
      toast.error("Failed to update password");
    }
  };

  const deleteUser = async () => {
    try {
      await api.delete(`/public-admin/users/${deleteModal.userId}`, authHeader());
      toast.success("User deleted successfully");
      setDeleteModal({ show: false, userId: "", name: "" });
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#f8fafc' }}>User Management</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Manage registered public students</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{ background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.2)', color: AMBER }}
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-[#f39c12]" />
        <input 
          type="text"
          placeholder="Search by name or phone number..."
          className="w-full h-12 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none transition-all border border-white/10"
          style={{ background: 'rgba(255,255,255,0.03)', color: '#f8fafc' }}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto" style={cardStyle}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Student</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Contact</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Profile</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {loading ? (
              <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-[#f39c12]" /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="py-20 text-center text-slate-500 text-sm">No students found</td></tr>
            ) : users.map(user => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: 'rgba(243,156,18,0.1)', color: AMBER }}>
                      {user.full_name?.charAt(0) || "U"}
                    </div>
                    <span className="font-bold text-slate-200">{user.full_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-400">{user.phone}</span>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                  {user.category || 'N/A'} • {user.gender || 'N/A'} • {user.district || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleStatus(user.id, user.is_active !== false)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${user.is_active !== false ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}
                  >
                    {user.is_active !== false ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {user.is_active !== false ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setPasswordModal({ show: true, userId: user.id, name: user.full_name, newPassword: "" })}
                      className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-amber-500 transition-all"
                      title="Change Password"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteModal({ show: true, userId: user.id, name: user.full_name })}
                      className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-500 transition-all"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-center gap-4 py-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg border border-white/10 disabled:opacity-30 text-slate-400"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-slate-500">Page {page} of {Math.ceil(total / limit)}</span>
          <button 
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg border border-white/10 disabled:opacity-30 text-slate-400"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Password Modal */}
      {passwordModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-8 rounded-3xl space-y-6" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="text-xl font-bold text-white">Change Password</h3>
            <p className="text-sm text-slate-400">Set a new password for <span className="text-[#f39c12]">{passwordModal.name}</span></p>
            <input 
              type="password"
              placeholder="Enter new password"
              className="w-full h-12 rounded-xl px-4 text-sm bg-white/5 border border-white/10 text-white outline-none focus:border-[#f39c12]"
              value={passwordModal.newPassword}
              onChange={(e) => setPasswordModal({ ...passwordModal, newPassword: e.target.value })}
            />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPasswordModal({ show: false })} className="flex-1 h-12 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={changePassword} className="flex-1 h-12 rounded-xl text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-8 rounded-3xl space-y-6" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto">
              <Trash2 className="h-8 w-8 text-rose-500" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">Delete User?</h3>
              <p className="text-sm text-slate-400 mt-2">Are you sure you want to delete <span className="text-white font-bold">{deleteModal.name}</span>? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteModal({ show: false })} className="flex-1 h-12 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={deleteUser} className="flex-1 h-12 rounded-xl text-sm font-bold bg-rose-500 text-white hover:bg-rose-600 transition-all">Delete User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
