import { useState, useEffect, useCallback } from "react";
import { usePublicAdmin } from "@/contexts/PublicAdminAuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { 
  Megaphone, Send, Clock, Users, Shield, 
  Loader2, History, AlertCircle, Info
} from "lucide-react";

const AMBER = "#f39c12";
const cardStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24 };

export default function PublicAdminBroadcast() {
  const { authHeader } = usePublicAdmin();
  const [title, setTitle] = useState("Announcement");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get("/public-admin/broadcasts", authHeader());
      setHistory(res.data);
    } catch (err) {
      toast.error("Failed to load broadcast history");
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    if (!window.confirm(`This will send a message to ALL active students. Continue?`)) return;

    setSending(true);
    try {
      await api.post("/public-admin/broadcast", { title, message }, authHeader());
      toast.success("Broadcast sent successfully!");
      setMessage("");
      fetchHistory();
    } catch (err) {
      toast.error("Failed to send broadcast");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: '#f8fafc' }}>Broadcast Messaging</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Send real-time announcements to all registered students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Composer */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSend} className="p-8 space-y-6" style={cardStyle}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Megaphone className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="font-bold text-white">Create New Broadcast</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Title</label>
                <input 
                  required
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
                  placeholder="e.g. NEET 2024 Predictor Update"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Message Content</label>
                <textarea 
                  required
                  rows={6}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500 transition-all resize-none"
                  placeholder="Type your message here... Students will see this in their chat inbox and updates tab."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-500/80 leading-relaxed font-medium">
                Broadcast messages are delivered instantly. This action will send a private message to every active student profile in the system.
              </p>
            </div>

            <button 
              disabled={!message.trim() || sending}
              type="submit"
              className="w-full h-14 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #f39c12, #d35400)', boxShadow: '0 8px 25px rgba(243,156,18,0.3)' }}
            >
              {sending ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  <Send className="h-5 w-5" />
                  Send to All Students
                </>
              )}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 space-y-6" style={cardStyle}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />
                <h3 className="font-bold text-slate-200 text-sm">Recent Broadcasts</h3>
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-amber-500" /></div>
              ) : history.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle className="h-10 w-10 text-slate-800 mx-auto mb-2" />
                  <p className="text-slate-600 text-xs">No history found</p>
                </div>
              ) : history.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 group hover:bg-white/[0.08] transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-xs truncate pr-4">{item.title}</h4>
                    <span className="text-[10px] text-slate-600 font-bold whitespace-nowrap">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.message}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3 text-amber-500/50" />
                      <span className="text-[10px] font-bold text-slate-500">{item.recipients} students</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Delivered</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
