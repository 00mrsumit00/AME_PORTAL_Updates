import { useState, useEffect, useCallback } from "react";
import { usePublicAdmin } from "@/contexts/PublicAdminAuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { 
  ScrollText, Clock, User, Shield, 
  Loader2, ChevronLeft, ChevronRight, Activity, Calendar
} from "lucide-react";

const AMBER = "#f39c12";
const cardStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24 };

export default function PublicAdminAudit() {
  const { authHeader } = usePublicAdmin();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/public-admin/audit-logs?page=${page}&limit=${limit}`, authHeader());
      setLogs(res.data.logs);
      setTotal(res.data.total);
    } catch (err) {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [page, authHeader]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionColor = (action) => {
    if (action.includes("DELETE")) return "#ef4444";
    if (action.includes("CREATE")) return "#10b981";
    if (action.includes("CHANGE") || action.includes("UPDATE")) return "#3b82f6";
    if (action.includes("BROADCAST")) return "#f59e0b";
    return "#94a3b8";
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString([], { 
      day: '2-digit', month: 'short', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: '#f8fafc' }}>Audit Logs</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Security trail and admin activity tracking</p>
      </div>

      <div className="overflow-hidden" style={cardStyle}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Timestamp</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Admin</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Action</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-500" /></td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="4" className="py-20 text-center text-slate-500 text-sm font-medium">No activity recorded yet</td></tr>
              ) : logs.map(log => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-600" />
                      <span className="text-xs font-bold text-slate-400">{formatDate(log.created_at)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-slate-300 border border-white/5 group-hover:border-amber-500/30 transition-colors">
                        {log.admin_name?.charAt(0) || "A"}
                      </div>
                      <span className="text-xs font-bold text-slate-200">{log.admin_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
                      style={{ background: `${getActionColor(log.action)}15`, color: getActionColor(log.action), border: `1px solid ${getActionColor(log.action)}20` }}
                    >
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                      <p className="text-xs font-medium text-slate-400 leading-relaxed">{log.description}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-center gap-4 py-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2.5 rounded-xl border border-white/10 disabled:opacity-30 text-slate-400 hover:bg-white/5 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white">{page}</span>
            <span className="text-xs font-bold text-slate-600">of {Math.ceil(total / limit)}</span>
          </div>
          <button 
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage(p => p + 1)}
            className="p-2.5 rounded-xl border border-white/10 disabled:opacity-30 text-slate-400 hover:bg-white/5 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
