import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Paperclip, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function ChatView({ studentId, studentName }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const msgEnd = useRef(null);
  const fileRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const r = await api.get(`/chat/${studentId}/messages`);
      setMessages(r.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (studentId) { fetchMessages(); const iv = setInterval(fetchMessages, 5000); return () => clearInterval(iv); }
  }, [studentId]);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!content.trim()) return;
    setSending(true);
    try {
      const r = await api.post(`/chat/${studentId}/messages`, { content });
      setMessages(prev => [...prev, r.data]);
      setContent("");
    } catch { toast.error("Failed to send"); }
    finally { setSending(false); }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await api.post(`/chat/${studentId}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      const r = await api.post(`/chat/${studentId}/messages`, { content: `Attachment: ${file.name}`, attachment_url: uploadRes.data.file_url });
      setMessages(prev => [...prev, r.data]);
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <Card className="border-border bg-card flex flex-col h-[500px]" data-testid="chat-view">
      <CardHeader className="pb-2 border-b border-border">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" /> Chat {studentName && `- ${studentName}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No messages yet. Start the conversation.</p>}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender_role === "STUDENT" ? "justify-start" : "justify-end"}`} data-testid={`msg-${msg.id}`}>
            <div className={`max-w-[75%] rounded-xl p-3 ${msg.sender_role === "STUDENT" ? "bg-secondary" : "bg-primary/10 border border-primary/20"}`}>
              <p className="text-xs font-medium text-primary mb-1">{msg.sender_name} ({msg.sender_role})</p>
              <p className="text-sm text-foreground">{msg.content}</p>
              {msg.attachment_url && (
                <a href={`${process.env.REACT_APP_BACKEND_URL}${msg.attachment_url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                  <Paperclip className="w-3 h-3" /> Download Attachment
                </a>
              )}
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</p>
                {msg.read && <span className="text-[10px] text-emerald-400">Read</span>}
              </div>
            </div>
          </div>
        ))}
        <div ref={msgEnd} />
      </CardContent>
      <div className="p-3 border-t border-border flex items-center gap-2">
        <input type="file" ref={fileRef} className="hidden" onChange={e => handleFileUpload(e.target.files[0])} />
        <Button variant="ghost" size="icon" onClick={() => fileRef.current?.click()} disabled={uploading} data-testid="chat-attach-btn">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
        </Button>
        <Input
          value={content} onChange={e => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-9 bg-background border-border"
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          data-testid="chat-input"
        />
        <Button size="icon" onClick={handleSend} disabled={sending || !content.trim()} data-testid="chat-send-btn">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </Card>
  );
}
