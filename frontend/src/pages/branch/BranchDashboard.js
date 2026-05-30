import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, IndianRupee, CheckCircle2, Clock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const KPI_CONFIG = [
  { key: "total_students", label: "Total Students", icon: Users, color: "text-primary", bg: "bg-primary/10" },
  { key: "total_revenue", label: "Total Revenue", icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-500/10", format: (v) => `Rs. ${(v || 0).toLocaleString()}` },
  { key: "total_pending_amount", label: "Pending Amount", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", format: (v) => `Rs. ${(v || 0).toLocaleString()}` },
  { key: "total_expense", label: "Total Expense", icon: IndianRupee, color: "text-red-400", bg: "bg-red-500/10", format: (v) => `Rs. ${(v || 0).toLocaleString()}` },
];

export default function BranchDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/branch/dashboard").then((r) => setData(r.data)).catch(() => toast.error("Failed to load")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6" data-testid="branch-dashboard">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Branch Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Overview of your branch operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CONFIG.map((kpi, i) => {
          const Icon = kpi.icon;
          const val = data[kpi.key] || 0;
          return (
            <Card key={kpi.key} className={`border-border bg-card animate-fade-in stagger-${i + 1}`} data-testid={`kpi-${kpi.key}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{kpi.format ? kpi.format(val) : val}</p>
                <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent students */}
      <Card className="border-border bg-card" data-testid="recent-students">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Registrations</CardTitle>
          <Link to="/branch/students" className="text-sm text-primary hover:underline flex items-center gap-1" data-testid="view-all-students-link">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {data.recent_students?.length > 0 ? (
            <div className="space-y-3">
              {data.recent_students.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.full_name}</p>
                    <p className="text-xs text-muted-foreground">{s.registration_no} | {s.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={
                      s.verification_status === "VERIFIED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      s.verification_status === "CORRECTION_REQUIRED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }>{s.verification_status}</Badge>
                    <Badge variant="outline" className="text-primary border-primary/30">{s.counselling_type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No students registered yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
