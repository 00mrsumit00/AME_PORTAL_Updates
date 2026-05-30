import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Loader2, ArrowRight, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function VerificationQueue() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/branch/verification-queue").then((r) => setStudents(r.data)).catch(() => toast.error("Failed to load queue")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6" data-testid="verification-queue">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Verification Queue</h2>
        <p className="text-sm text-muted-foreground mt-1">{students.length} students pending verification</p>
      </div>

      {students.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="py-16 text-center">
            <ClipboardCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-lg font-semibold text-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground mt-1">No students pending verification</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {students.map((s) => (
            <Card key={s.id} className="border-border bg-card hover:border-primary/30 transition-colors" data-testid={`queue-item-${s.id}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    s.verification_status === "CORRECTION_REQUIRED" ? "bg-red-500/10" : "bg-amber-500/10"
                  }`}>
                    {s.verification_status === "CORRECTION_REQUIRED"
                      ? <AlertTriangle className="w-5 h-5 text-red-400" />
                      : <Clock className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.full_name}</p>
                    <p className="text-xs text-muted-foreground">{s.registration_no} | {s.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="hidden sm:flex text-xs border-primary/30 text-primary">{s.counselling_type}</Badge>
                  <Badge variant="outline" className={`text-xs ${
                    s.verification_status === "CORRECTION_REQUIRED"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>{s.verification_status}</Badge>
                  <Button size="sm" asChild data-testid={`start-verify-${s.id}`}>
                    <Link to={`/branch/verification/${s.id}`}>
                      Verify <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
