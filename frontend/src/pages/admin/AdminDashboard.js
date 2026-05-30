import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, IndianRupee, CheckCircle2, Loader2, ArrowRight, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const KPI_CONFIG = [
  { key: "active_branches", label: "Active Branches", icon: Building2, color: "text-primary", bg: "bg-primary/10" },
  { key: "total_students", label: "Registered Students", icon: Users, color: "text-violet-400", bg: "bg-violet-500/10" },
  { key: "gross_revenue", label: "Gross Revenue", icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-500/10", format: (v) => `Rs. ${(v || 0).toLocaleString()}` },
  { key: "total_expense", label: "Total Expense", icon: IndianRupee, color: "text-red-400", bg: "bg-red-500/10", format: (v) => `Rs. ${(v || 0).toLocaleString()}` },
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard").then((r) => setData(r.data)).catch(() => toast.error("Failed to load")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6" data-testid="admin-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">System-wide overview</p>
        </div>
        <Link to="/admin/analytics" className="text-sm text-primary hover:underline flex items-center gap-1" data-testid="analytics-link">
          <BarChart3 className="w-4 h-4" /> Analytics <ArrowRight className="w-3 h-3" />
        </Link>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border bg-card" data-testid="quick-actions">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/admin/branches" className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-secondary transition-colors" data-testid="manage-branches-link">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Manage Branches</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link to="/admin/analytics" className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-secondary transition-colors" data-testid="view-analytics-link">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">View Analytics</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link to="/admin/audit" className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-secondary transition-colors" data-testid="view-audit-link">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Audit Logs</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card" data-testid="system-info">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold mb-4">System Information</h3>
            <div className="space-y-3">
              {[
                ["Platform", "AME Portal v1.0"],
                ["Total Branches", data.active_branches],
                ["Total Students", data.total_students],
                ["Total Expense", `Rs. ${(data.total_expense || 0).toLocaleString()}`],
                ["Revenue", `Rs. ${(data.gross_revenue || 0).toLocaleString()}`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium">{val}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
