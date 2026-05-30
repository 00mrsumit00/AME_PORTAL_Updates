import { useState, useEffect } from "react";
import api from "@/lib/api";
import ChatView from "@/components/ChatView";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function StudentChat() {
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/profile").then(r => setProfileId(r.data.id)).catch(() => toast.error("Failed to load")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!profileId) return <p className="text-muted-foreground text-center py-8">Profile not found</p>;

  return (
    <div className="space-y-6" data-testid="student-chat">
      <div><h2 className="text-2xl font-bold tracking-tight">Support Chat</h2><p className="text-sm text-muted-foreground mt-1">Chat with your branch staff</p></div>
      <ChatView studentId={profileId} />
    </div>
  );
}
