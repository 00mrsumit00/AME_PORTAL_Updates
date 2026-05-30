import { useState, useEffect, useRef, useCallback } from "react";
import { usePublicAdmin } from "@/contexts/PublicAdminAuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { 
  Search, Send, Phone, Video, MoreVertical, 
  Check, CheckCheck, User, Loader2, MessageSquare, Clock,
  Users, ShieldCheck, ExternalLink, X, MapPin, Award, UserCircle,
  ArrowLeft
} from "lucide-react";

const AMBER = "#f39c12";
const BLUE = "#3b82f6";

export default function PublicAdminChat() {
  const { authHeader, admin } = usePublicAdmin();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const communityMessagesCountRef = useRef(0);
  const adminSentReplyRef = useRef(false);

  // Community Tab State
  const [activeTab, setActiveTab] = useState("counselor"); // "counselor" or "community"
  const [communityMessages, setCommunityMessages] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const POLL_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwhYJtSa3PbpdCgTE-qAN_7RhbQrWjb-YPp-IQmXkS5z4vC7KpxbwRNwDRPN6wVLtI2/exec";

  // Profile Modal State
  const [profileModal, setProfileModal] = useState({ show: false, user: null, loading: false });
  const [replyingTo, setReplyingTo] = useState(null); // { index, name, comment }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = useCallback(async () => {
    try {
      const res = await api.get("/public-admin/chats", authHeader());
      setChats(res.data);
    } catch (err) {
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  const fetchMessages = useCallback(async (studentId) => {
    setMsgLoading(true);
    try {
      const res = await api.get(`/public-admin/chats/${studentId}`, authHeader());
      setMessages(res.data);
      // Refresh chat list to update unread counts
      fetchChats();
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setMsgLoading(false);
    }
  }, [authHeader, fetchChats]);

  const fetchCommunityMessages = useCallback(async () => {
    try {
      const response = await fetch(`${POLL_WEBHOOK_URL}?action=comments`);
      const data = await response.json();
      // Map with original index BEFORE reversing so replies hit the correct row in Google Sheets
      const commentsWithIndex = (data.comments || []).map((c, idx) => ({ 
        ...c, 
        originalIndex: idx 
      }));
      setCommunityMessages(commentsWithIndex.reverse());
    } catch (err) {
      console.error("Failed to load community messages");
    }
  }, []);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 10000);
    return () => clearInterval(interval);
  }, [fetchChats]);

  useEffect(() => {
    if (activeTab === "community") {
      setCommunityLoading(true);
      fetchCommunityMessages().finally(() => setCommunityLoading(false));
      const interval = setInterval(fetchCommunityMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchCommunityMessages]);

  useEffect(() => {
    // Smart scroll logic for community tab
    const isInitialLoad = communityMessagesCountRef.current === 0 && communityMessages.length > 0;
    const hasNewMessage = communityMessages.length > communityMessagesCountRef.current;
    
    if (isInitialLoad || (hasNewMessage && adminSentReplyRef.current)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      adminSentReplyRef.current = false; // Reset after scrolling
    }
    
    communityMessagesCountRef.current = communityMessages.length;
  }, [communityMessages]);

  useEffect(() => {
    if (selectedChat && activeTab === "counselor") {
      fetchMessages(selectedChat.student_id);
      const interval = setInterval(() => fetchMessages(selectedChat.student_id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedChat, fetchMessages, activeTab]);

  // Regular scroll for 1-on-1 chats
  useEffect(() => {
    if (activeTab === "counselor" && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      if (activeTab === "community" && replyingTo) {
        // Handle Official Reply to Community
        adminSentReplyRef.current = true; // Trigger auto-scroll on next render
        await fetch(POLL_WEBHOOK_URL, {
          method: "POST",
          body: JSON.stringify({
            action: "reply",
            index: replyingTo.originalIndex, // Use original index for Google Sheet accuracy
            reply: newMessage
          })
        });
        toast.success("Reply posted to community");
        setReplyingTo(null);
        fetchCommunityMessages();
      } else if (activeTab === "counselor" && selectedChat) {
        // Handle Private Chat
        await api.post("/public-admin/chats/send", {
          student_id: selectedChat.student_id,
          message: newMessage
        }, authHeader());
        fetchMessages(selectedChat.student_id);
      }
      setNewMessage("");
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const openUserProfile = async (name) => {
    setProfileModal({ show: true, user: null, loading: true });
    try {
      // Search for user by name in our DB
      const res = await api.get(`/public-admin/users?search=${encodeURIComponent(name)}&limit=1`, authHeader());
      if (res.data.users && res.data.users.length > 0) {
        setProfileModal({ show: true, user: res.data.users[0], loading: false });
      } else {
        setProfileModal({ show: true, user: "NOT_FOUND", loading: false });
      }
    } catch (err) {
      setProfileModal({ show: true, user: "ERROR", loading: false });
    }
  };

  const startPrivateReply = (user, initialMessage = "") => {
    // Switch to counselor tab and select the chat
    setActiveTab("counselor");
    setSelectedChat({
      student_id: user.id,
      student_name: user.full_name,
      unread_count: 0
    });
    setNewMessage(initialMessage ? `Regarding your question: "${initialMessage}"\n\n` : "");
    setProfileModal({ show: false, user: null, loading: false });
    // Counselor auto-scroll will handle the rest
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex overflow-hidden rounded-3xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-white/5 ${selectedChat || activeTab === "community" ? "hidden md:flex" : "flex"}`} style={{ background: 'rgba(15,23,42,0.4)' }}>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between px-1 md:px-2 gap-2">
            <h2 className="text-xl font-black text-white truncate shrink-0">Messages</h2>
            <div className="flex bg-white/5 p-1 rounded-xl shrink-0">
              <button 
                onClick={() => {
                  setSelectedChat(null);
                  setActiveTab("counselor");
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === "counselor" ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
              >
                1-on-1
              </button>
              <button 
                onClick={() => {
                  setSelectedChat(null);
                  setActiveTab("community");
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === "community" ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
              >
                Community
              </button>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              placeholder="Search chats..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-amber-500" /></div>
          ) : chats.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">No active chats</div>
          ) : chats.map(chat => (
            <button 
              key={chat.student_id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full flex items-center gap-3 p-4 transition-all hover:bg-white/5 border-b border-white/[0.02] ${selectedChat?.student_id === chat.student_id ? 'bg-white/10' : ''}`}
            >
              <div className="relative shrink-0">
                <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'rgba(243,156,18,0.1)', color: AMBER }}>
                  {chat.student_name?.charAt(0)}
                </div>
                {/* Online indicator placeholder */}
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f172a] bg-emerald-500"></div>
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-200 truncate">{chat.student_name}</span>
                  <span className="text-[10px] text-slate-500 shrink-0">{formatTime(chat.last_time)}</span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-xs text-slate-500 truncate pr-2">
                    {chat.last_sender === "ADMIN" && <span className="text-amber-500/70 mr-1">You:</span>}
                    {chat.last_message}
                  </p>
                  {chat.unread_count > 0 && (
                    <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center">
                      {chat.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col relative ${selectedChat || activeTab === "community" ? "flex" : "hidden md:flex"}`} style={{ background: 'rgba(15,23,42,0.2)' }}>
        {selectedChat || activeTab === "community" ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.03]">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                {/* Back button visible only on mobile */}
                <button 
                  onClick={() => {
                    setSelectedChat(null);
                    if (activeTab === "community") {
                      setActiveTab("counselor");
                    }
                  }}
                  className="md:hidden p-2 -ml-2 mr-1 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                {activeTab === "community" ? (
                  <>
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">Community Forum</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">Public Discussion</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ background: 'rgba(243,156,18,0.1)', color: AMBER }}>
                      {selectedChat.student_name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{selectedChat.student_name}</h3>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">Online</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><Phone className="h-5 w-5" /></button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><MoreVertical className="h-5 w-5" /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" style={{ background: 'url("https://w0.peakpx.com/wallpaper/508/606/HD-wallpaper-whatsapp-dark-mode-theme-background.jpg")', backgroundSize: 'cover', backgroundBlendMode: 'overlay' }}>
              {activeTab === "community" ? (
                <>
                  <div className="flex justify-center mb-6">
                    <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-widest">
                      Live Community Forum • {communityMessages.length} Messages
                    </span>
                  </div>
                  {communityLoading && communityMessages.length === 0 ? (
                    <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
                  ) : communityMessages.map((msg, idx) => (
                    <div key={idx} className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl p-4 bg-[#1e293b] text-white border border-white/5 relative group">
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <button 
                            onClick={() => openUserProfile(msg.name)}
                            className="text-xs font-black text-amber-500 hover:underline flex items-center gap-1"
                          >
                            <UserCircle className="h-3 w-3" /> {msg.name}
                          </button>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setReplyingTo({ index: idx, originalIndex: msg.originalIndex, name: msg.name, comment: msg.comment })}
                              className="text-[10px] font-bold bg-amber-500 text-black px-2 py-1 rounded-md"
                            >
                              Reply
                            </button>
                            <button 
                              onClick={() => openUserProfile(msg.name)}
                              className="text-[10px] font-bold bg-white/10 text-white px-2 py-1 rounded-md"
                            >
                              Profile
                            </button>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.comment}</p>
                        
                        {msg.admin_reply && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <ShieldCheck className="h-3 w-3 text-blue-400" />
                              <span className="text-[9px] font-black uppercase text-blue-400">Admissions Made Easy</span>
                            </div>
                            <p className="text-xs italic text-slate-300 bg-white/5 p-2 rounded-lg">{msg.admin_reply}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-end mt-2 opacity-40">
                          <span className="text-[9px] font-medium">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {msgLoading && messages.length === 0 ? (
                    <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
                  ) : messages.map((msg, idx) => {
                    const isMe = msg.sender_role === "ADMIN";
                    return (
                      <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`max-w-[80%] rounded-2xl p-3 relative group ${isMe ? 'bg-amber-500 text-black rounded-tr-none' : 'bg-[#1e293b] text-white rounded-tl-none border border-white/5'}`}
                          style={isMe ? { boxShadow: '0 4px 15px rgba(243,156,18,0.2)' } : {}}
                        >
                          {msg.is_broadcast && (
                            <div className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1 border-b border-black/10 pb-1">Broadcast</div>
                          )}
                          <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                          <div className={`flex items-center justify-end gap-1.5 mt-1 opacity-70`}>
                            <span className="text-[9px] font-bold">{formatTime(msg.created_at)}</span>
                            {isMe && (
                              msg.read ? <CheckCheck className="h-3 w-3 text-blue-700" /> : <Check className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0f172a] border-t border-white/5">
              {replyingTo && (
                <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-amber-500 uppercase mb-0.5">Replying to {replyingTo.name}</p>
                    <p className="text-xs text-slate-400 truncate">{replyingTo.comment}</p>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="p-1.5 hover:bg-white/5 rounded-lg"><X className="h-4 w-4 text-slate-500" /></button>
                </div>
              )}
              <form onSubmit={handleSend} className="flex items-center gap-3 bg-white/5 rounded-2xl p-1 pr-2 border border-white/10 focus-within:border-amber-500/50 transition-all">
                <input 
                  autoFocus
                  placeholder={activeTab === "community" ? (replyingTo ? `Write official reply...` : "Select a message to reply") : "Type a message..."}
                  className="flex-1 h-11 px-4 bg-transparent text-sm text-white focus:outline-none"
                  value={newMessage}
                  disabled={activeTab === "community" && !replyingTo}
                  onChange={e => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim() || sending || (activeTab === "community" && !replyingTo)}
                  className="h-10 w-10 rounded-xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 shadow-lg"
                  style={{ background: AMBER, color: '#000' }}
                >
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-10">
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <MessageSquare className="h-10 w-10 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">Your Counselor Inbox</h3>
            <p className="text-slate-500 max-w-sm mt-2 text-sm leading-relaxed">
              Select a student from the sidebar to start a conversation. You can provide 1-on-1 guidance, share documents, and track admission progress.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(243,156,18,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(243,156,18,0.4); }
      `}</style>

      {/* User Profile Modal */}
      {profileModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300" style={{ background: '#020617', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="relative h-32 bg-gradient-to-br from-amber-500 to-amber-700">
              <button 
                onClick={() => setProfileModal({ show: false, user: null })}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-3xl bg-[#020617] border-4 border-[#020617] p-1 shadow-2xl">
                <div className="h-full w-full rounded-2xl bg-amber-500/10 flex items-center justify-center text-3xl font-black text-amber-500">
                  {profileModal.user?.full_name?.charAt(0) || "U"}
                </div>
              </div>
            </div>

            <div className="pt-16 px-8 pb-8 space-y-6">
              {profileModal.loading ? (
                <div className="flex flex-col items-center py-10 gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Searching Records...</p>
                </div>
              ) : profileModal.user === "NOT_FOUND" ? (
                <div className="text-center py-10">
                  <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserX className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Guest User</h3>
                  <p className="text-sm text-slate-500 mt-2">This user is posting without a registered profile.</p>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl font-black text-white">{profileModal.user.full_name}</h2>
                    <div className="flex items-center gap-2 mt-1 text-slate-400">
                      <Phone className="h-3.5 w-3.5" />
                      <span className="text-xs font-bold">{profileModal.user.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Category</p>
                      <p className="text-sm font-bold text-amber-500">{profileModal.user.category || "N/A"}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">NEET Score</p>
                      <p className="text-sm font-bold text-amber-500">{profileModal.user.neet_score || "N/A"}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">District</p>
                      <p className="text-sm font-bold text-white truncate">{profileModal.user.district || "N/A"}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Gender</p>
                      <p className="text-sm font-bold text-white">{profileModal.user.gender || "N/A"}</p>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => startPrivateReply(profileModal.user)}
                      className="flex-1 h-14 rounded-2xl bg-amber-500 text-black font-black text-sm shadow-xl shadow-amber-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Private Message
                    </button>
                    <button 
                      onClick={() => window.open(`tel:${profileModal.user.phone}`, '_self')}
                      className="h-14 w-14 rounded-2xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all"
                    >
                      <Phone className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Minimal placeholder for missing icon in chunk
function UserX(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="17" y1="8" x2="22" y2="13" />
      <line x1="22" y1="8" x2="17" y2="13" />
    </svg>
  );
}
