import React, { useState, useEffect } from "react";
import { 
  Megaphone, Plus, Search, Trash2, Edit2, CheckCircle, XCircle, 
  ExternalLink, FileText, Video, Bell, Save, X, Loader2
} from "lucide-react";
import api from "@/lib/api";
import { usePublicAdmin } from "@/contexts/PublicAdminAuthContext";
import { toast } from "sonner";

const ensureAbsoluteUrl = (url) => {
  if (!url) return "";
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export default function PublicAdminUpdates() {
  const { token, authHeader } = usePublicAdmin();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tickerText, setTickerText] = useState("");
  const [tickerLink, setTickerLink] = useState("");
  const [savingTicker, setSavingTicker] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState(null);
  const [formData, setFormData] = useState({
    type: "OFFICIAL_UPDATE",
    title: "",
    description: "",
    link: "",
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = React.useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [tickerRes, updatesRes] = await Promise.all([
        api.get("/public/ticker"),
        api.get("/public-admin/portal-updates", authHeader())
      ]);
      setTickerText(tickerRes.data.text || "");
      setTickerLink(tickerRes.data.link || "");
      setUpdates(updatesRes.data);
    } catch (error) {
      console.error("Fetch Data Error:", error);
      toast.error("Failed to load portal configuration. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTickerSave = async () => {
    setSavingTicker(true);
    try {
      await api.post("/public-admin/ticker", 
        { text: tickerText, link: tickerLink },
        authHeader()
      );
      toast.success("Ticker configuration updated");
    } catch (error) {
      toast.error("Failed to update ticker");
    } finally {
      setSavingTicker(false);
    }
  };

  const handleOpenModal = (update = null) => {
    if (update) {
      setIsEditing(true);
      setCurrentUpdate(update);
      setFormData({
        type: update.type,
        title: update.title,
        description: update.description || "",
        link: update.link,
        date: update.date,
        is_active: update.is_active
      });
    } else {
      setIsEditing(false);
      setFormData({
        type: "OFFICIAL_UPDATE",
        title: "",
        description: "",
        link: "",
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await api.put(`/public-admin/portal-updates/${currentUpdate.id}`, formData, authHeader());
        toast.success("Update updated successfully");
      } else {
        await api.post("/public-admin/portal-updates", formData, authHeader());
        toast.success("New update published");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save update");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this update?")) return;
    try {
      await api.delete(`/public-admin/portal-updates/${id}`, authHeader());
      toast.success("Update deleted");
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin h-8 w-8 text-amber-500" /></div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Portal Management</h1>
          <p className="text-slate-400 text-sm">Control real-time updates and notifications for students</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-900/20"
        >
          <Plus className="h-5 w-5" /> Add New Update
        </button>
      </div>

      {/* Breaking News Ticker Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Breaking News Ticker</h2>
            <p className="text-xs text-slate-400">Leave text empty to hide the red bar from the portal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ticker Text</label>
            <input 
              type="text"
              value={tickerText}
              onChange={(e) => setTickerText(e.target.value)}
              placeholder="e.g. NTA announces NEET examination results date..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Link (Optional)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={tickerLink}
                onChange={(e) => setTickerLink(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
              />
              <button 
                onClick={handleTickerSave}
                disabled={savingTicker}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                {savingTicker ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Events List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
            <Bell className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-100">Live Notifications & Events</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {updates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No updates posted yet. Click 'Add New' to start.</td>
                </tr>
              ) : (
                updates.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${
                        item.type === 'OFFICIAL_UPDATE' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {item.type === 'OFFICIAL_UPDATE' ? <FileText className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
                        {item.type === 'OFFICIAL_UPDATE' ? 'OFFICIAL PDF' : 'EVENT/ZOOM'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <p className="text-sm font-bold text-slate-200 mb-1">{item.title}</p>
                        <a href={ensureAbsoluteUrl(item.link)} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-500 hover:underline flex items-center gap-1">
                          View Link <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.is_active ? (
                        <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                          <CheckCircle className="h-4 w-4" /> LIVE
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                          <XCircle className="h-4 w-4" /> HIDDEN
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{item.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-100">{isEditing ? 'Edit Update' : 'Publish New Update'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-full">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Update Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="OFFICIAL_UPDATE">Official PDF Update</option>
                    <option value="UPCOMING_EVENT">Event / Zoom Webinar</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Display Date</label>
                  <input 
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Headline / Title</label>
                <input 
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none"
                  placeholder="e.g. Provisional Answer Keys for NEET (UG) – 2026"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Target URL (PDF or Zoom Link)</label>
                <input 
                  required
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Description (Optional)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none min-h-[100px]"
                  placeholder="Additional details..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="h-5 w-5 rounded border-slate-800 bg-slate-950 text-amber-500"
                />
                <label htmlFor="is_active" className="text-sm font-bold text-slate-200">Visible on Portal</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-2 px-10 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
                  {isEditing ? 'Update Item' : 'Publish Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
