import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Users, Phone, MessageCircle, Send, Loader2, Check, CheckCheck,
  MoreVertical, ShieldCheck, ExternalLink
} from "lucide-react";
import api from "@/lib/api";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import { toast } from "sonner";
import ProfileGate from "@/components/public/ProfileGate";

const POLL_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwhYJtSa3PbpdCgTE-qAN_7RhbQrWjb-YPp-IQmXkS5z4vC7KpxbwRNwDRPN6wVLtI2/exec";

export default function PublicChats() {
  const [activeTab, setActiveTab] = useState("community");
  const { user, token } = usePublicAuth();
  const [messages, setMessages] = useState([]);
  const [communityMessages, setCommunityMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const communityMessagesCountRef = useRef(0);

  const authHeader = useCallback(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get("/public/chats", authHeader());
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch counselor messages");
    }
  }, [authHeader]);

  const fetchCommunityMessages = useCallback(async () => {
    try {
      const response = await fetch(`${POLL_WEBHOOK_URL}?action=comments`);
      const data = await response.json();
      // Reverse messages so latest are at the bottom
      const reversedMessages = [...(data.comments || [])].reverse();
      setCommunityMessages(reversedMessages);
    } catch (err) {
      console.error("Failed to load community messages");
    }
  }, []);

  useEffect(() => {
    if (activeTab === "community") {
      // First time landing on community tab (persisted across navigation in same session)
      const initKey = `ame_chat_initialized_${user?.id || 'guest'}`;
      const hasInitialized = localStorage.getItem(initKey);

      if (!hasInitialized && user) {
        const score = user?.neet_score || "___";
        const category = user?.category || "___";
        setNewMessage(`I am getting ${score} marks and my category is ${category}.`);

        toast.info("You can ask your question ahead!", {
          position: "top-center",
          duration: 4000,
          style: { background: '#0f172a', border: '1px solid #f39c12', color: '#fff' }
        });
        localStorage.setItem(initKey, "true");
      }

      setCommunityLoading(true);
      fetchCommunityMessages().finally(() => setCommunityLoading(false));
      const interval = setInterval(fetchCommunityMessages, 8000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchCommunityMessages, user]);

  useEffect(() => {
    if (activeTab === "counselor") {
      setLoading(true);
      fetchMessages().finally(() => setLoading(false));
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchMessages]);

  useEffect(() => {
    // Determine if we should scroll to bottom
    const isInitialLoad = communityMessagesCountRef.current === 0 && communityMessages.length > 0;
    const hasNewMessage = communityMessages.length > communityMessagesCountRef.current;

    // Check if the latest message was sent by the current user
    const lastMsg = communityMessages[communityMessages.length - 1];
    const sentByMe = lastMsg?.name === user?.full_name;

    // Only scroll if it's the first load or if the user just sent a message
    if (isInitialLoad || (hasNewMessage && sentByMe)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    communityMessagesCountRef.current = communityMessages.length;
  }, [communityMessages, user?.full_name]);

  // Handle scrolling for counselor messages as well
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
      if (activeTab === "community") {
        await fetch(POLL_WEBHOOK_URL, {
          method: "POST",
          body: JSON.stringify({
            action: "comment",
            name: user?.full_name || "Student",
            comment: newMessage
          })
        });
        fetchCommunityMessages();
      } else {
        await api.post("/public/chats/send", { message: newMessage }, authHeader());
        fetchMessages();
      }
      setNewMessage("");
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const openWhatsApp = () => {
    const phone = "7038251774";
    const name = user?.full_name || "Student";
    const text = encodeURIComponent(`Hello My name is ${name} and I have few doubts to clarify.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <ProfileGate>
      <div className="space-y-6" style={{ height: 'calc(100vh - 8rem)', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">Portal Community</h1>
        </div>

        {/* Custom Tabs */}
        <div className="flex p-1.5 rounded-2xl shrink-0 bg-slate-900/50 border border-slate-800 shadow-2xl">
          <button
            onClick={() => setActiveTab("community")}
            className="flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            style={activeTab === "community" ? { background: 'linear-gradient(135deg, #f39c12, #d35400)', color: '#fff', boxShadow: '0 8px 20px rgba(243,156,18,0.3)' } : { color: '#64748b', background: 'transparent' }}
          >
            <Users className="h-4 w-4" /> Community
          </button>
          <button
            onClick={() => setActiveTab("counselor")}
            className="flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            style={activeTab === "counselor" ? { background: 'linear-gradient(135deg, #f39c12, #d35400)', color: '#fff', boxShadow: '0 8px 20px rgba(243,156,18,0.3)' } : { color: '#64748b', background: 'transparent' }}
          >
            <MessageCircle className="h-4 w-4" /> My Counselor
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden flex flex-col relative bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          {activeTab === "community" ? (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0b141a]">
              {/* Community Header */}
              <div className="px-4 py-3 bg-[#202c33] flex items-center justify-between border-b border-white/5 z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Users className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">NEET Aspirants 2026</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admissions Made Easy</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-7 w-7 rounded-full border-2 border-[#202c33] bg-slate-700 flex items-center justify-center text-[8px] font-bold text-white">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="h-7 w-7 rounded-full border-2 border-[#202c33] bg-amber-500 flex items-center justify-center text-[8px] font-bold text-black">
                    +99
                  </div>
                </div>
              </div>

              {/* Community Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 relative custom-scrollbar wa-background">
                <div className="flex justify-center mb-6">
                  <span className="px-3 py-1 bg-[#182229] rounded-lg text-[10px] font-bold text-slate-400 border border-white/5 uppercase tracking-widest">
                    Community Chat • {communityMessages.length} Messages
                  </span>
                </div>

                {communityLoading && communityMessages.length === 0 ? (
                  <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-amber-500" /></div>
                ) : communityMessages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mt-10">
                    <div className="mb-4 h-16 w-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                      <Users className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-200">No discussions yet</h3>
                    <p className="text-xs max-w-xs text-slate-500 leading-relaxed">
                      Be the first to share your thoughts on the NEET 2026 cutoffs!
                    </p>
                  </div>
                ) : (
                  communityMessages.map((msg, idx) => {
                    const isMe = msg.name === user?.full_name;
                    return (
                      <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] p-2 px-3 shadow-md relative ${isMe
                            ? 'bg-[#005c4b] text-white rounded-lg rounded-tr-none'
                            : 'bg-[#202c33] text-slate-100 rounded-lg rounded-tl-none border border-white/5'
                            }`}
                        >
                          {!isMe && (
                            <div className="text-[10px] font-black text-amber-500 mb-1 flex items-center gap-1">
                              {msg.name}
                            </div>
                          )}
                          <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">{msg.comment}</p>

                          {msg.admin_reply && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <ShieldCheck className="h-3 w-3 text-blue-400" />
                                <span className="text-[9px] font-black uppercase text-blue-400">Admissions Made Easy</span>
                              </div>
                              <p className="text-[12px] italic text-slate-300 bg-white/5 p-2 rounded-lg">{msg.admin_reply}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                            <span className="text-[9px] font-medium">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <div className="p-3 bg-[#202c33] border-t border-white/5">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <div className="flex-1 bg-[#2a3942] rounded-xl flex items-center px-4 border border-transparent focus-within:border-white/10 transition-all">
                    <input
                      placeholder="Message community..."
                      className="flex-1 h-12 bg-transparent text-sm text-slate-100 focus:outline-none"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="h-12 w-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-lg"
                    style={{ background: '#00a884', color: '#fff' }}
                  >
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0b141a]">
              {/* WhatsApp Style Header */}
              <div className="px-4 py-3 bg-[#202c33] flex items-center justify-between border-b border-white/5 z-10 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center border border-white/10 overflow-hidden">
                    <div className="bg-amber-500 h-full w-full flex items-center justify-center text-black font-black text-lg">A</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      Admissions Made Easy <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                    </h4>
                    <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:8983001441"
                    className="h-9 px-3 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-2 text-slate-200 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="text-xs font-bold hidden sm:inline">Call Now</span>
                  </a>
                  <button
                    onClick={openWhatsApp}
                    className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 text-white transition-all shadow-lg shadow-emerald-900/20"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs font-black">WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Messages List with Wallpaper */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 relative custom-scrollbar wa-background">
                <div className="flex justify-center mb-6">
                  <span className="px-3 py-1 bg-[#182229] rounded-lg text-[10px] font-bold text-slate-400 border border-white/5 uppercase tracking-widest">
                    End-to-end encrypted
                  </span>
                </div>

                {loading && messages.length === 0 ? (
                  <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-amber-500" /></div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mt-10">
                    <div className="mb-4 h-16 w-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                      <MessageCircle className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-200">Start the Conversation</h3>
                    <p className="text-xs max-w-xs text-slate-500 leading-relaxed">
                      Have questions about admissions? Type below to start a chat with our counselors.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender_role === "STUDENT";
                    return (
                      <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] p-2 px-3 shadow-md relative ${isMe
                            ? 'bg-[#005c4b] text-white rounded-lg rounded-tr-none'
                            : 'bg-[#202c33] text-slate-100 rounded-lg rounded-tl-none border border-white/5'
                            }`}
                        >
                          {/* Tail effect would go here if using custom SVG, but simple rounded is cleaner for React */}
                          {msg.is_broadcast && (
                            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-400 mb-1 flex items-center gap-1">
                              <ShieldCheck className="h-2.5 w-2.5" /> Broadcast
                            </div>
                          )}
                          <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">{msg.message}</p>
                          <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                            <span className="text-[9px] font-medium">{formatTime(msg.created_at)}</span>
                            {isMe && (
                              msg.read ? <CheckCheck className="h-3 w-3 text-sky-400" /> : <Check className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <div className="p-3 bg-[#202c33] border-t border-white/5">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <div className="flex-1 bg-[#2a3942] rounded-xl flex items-center px-4 border border-transparent focus-within:border-white/10 transition-all">
                    <input
                      placeholder="Type a message..."
                      className="flex-1 h-12 bg-transparent text-sm text-slate-100 focus:outline-none"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="h-12 w-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-lg"
                    style={{ background: '#00a884', color: '#fff' }}
                  >
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        
        .wa-background {
          background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
          background-blend-mode: overlay;
          background-color: rgba(11, 20, 26, 0.95);
        }
      `}</style>
      </div>
    </ProfileGate>
  );
}
