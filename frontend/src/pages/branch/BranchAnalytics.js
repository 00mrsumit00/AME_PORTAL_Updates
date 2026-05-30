import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadBlob, printAnalyticsReport } from "@/lib/print";
import { Users, IndianRupee, CheckCircle2, Clock, Loader2, Download, BarChart3, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { toast } from "sonner";

const COLORS = ["#38BDF8", "#10B981", "#F59E0B", "#EF4444", "#A78BFA", "#F97316", "#06B6D4", "#EC4899", "#8B5CF6", "#14B8A6", "#F43F5E"];
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (<div className="bg-[#1E293B] border border-[#334155] rounded-lg p-3 shadow-lg"><p className="text-xs text-slate-400 mb-1">{label}</p>{payload.map((p,i) => <p key={i} className="text-sm font-medium" style={{color:p.color}}>{p.name}: {typeof p.value==="number"?p.value.toLocaleString():p.value}</p>)}</div>);
};

export default function BranchAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);
      if (courseFilter) params.append("counselling_type", courseFilter);
      const r = await api.get(`/branch/analytics?${params}`);
      setData(r.data);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);
      if (courseFilter) params.append("counselling_type", courseFilter);
      const r = await api.get(`/branch/export-students?${params}`, { responseType: "blob" });
      downloadBlob(new Blob([r.data]), "students.xlsx");
      toast.success("Export downloaded");
    } catch { toast.error("Export failed"); }
    finally { setExporting(false); }
  };

  const handlePdfExport = () => {
    if (!data) return;
    printAnalyticsReport({
      title: "Branch Analytics Report",
      filters: [
        ["Date From", dateFrom || "All time"],
        ["Date To", dateTo || "Current date"],
        ["Course", courseFilter || "All courses"],
      ],
      summary: [
        ["Total Students", data.total_students || 0],
        ["Verified Students", data.verified_students || 0],
        ["Pending Students", data.pending_students || 0],
        ["Total Revenue", `Rs. ${(data.total_revenue || 0).toLocaleString()}`],
      ],
      sections: [
        { title: "Counselling Type Distribution", rows: (data.counselling_type_distribution || []).map((item) => [item.name, item.value]) },
        { title: "Verification Status Distribution", rows: (data.verification_status_distribution || []).map((item) => [item.name, item.value]) },
        { title: "Category Distribution", rows: (data.category_distribution || []).map((item) => [item.name, item.value]) },
        { title: "Location Distribution", rows: (data.location_distribution || []).map((item) => [item.name, item.value]) },
        { title: "Score Distribution", rows: (data.score_distribution || []).map((item) => [item.name, item.value]) },
      ],
    });
  };

  const KPIs = data ? [
    { label: "Total Students", value: data.total_students, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Revenue", value: `Rs. ${(data.total_revenue||0).toLocaleString()}`, icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Verified", value: data.verified_students, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Pending", value: data.pending_students, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
  ] : [];

  return (
    <div className="space-y-6" data-testid="branch-analytics">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-2xl font-bold tracking-tight">Branch Analytics</h2><p className="text-sm text-muted-foreground mt-1">Data insights for your branch</p></div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePdfExport} disabled={!data} data-testid="branch-export-pdf-btn">
            <FileText className="w-4 h-4 mr-1" />Export PDF
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={exporting} data-testid="export-btn">
            {exporting ? <Loader2 className="w-4 h-4 animate-spin mr-1"/> : <Download className="w-4 h-4 mr-1"/>}Export Excel
          </Button>
        </div>
      </div>
      {/* Filters */}
      <Card className="border-border bg-card"><CardContent className="p-4"><div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1"><label className="text-xs text-muted-foreground">From</label><Input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className="h-9 w-40 bg-background border-border" data-testid="date-from"/></div>
        <div className="space-y-1"><label className="text-xs text-muted-foreground">To</label><Input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className="h-9 w-40 bg-background border-border" data-testid="date-to"/></div>
        <Select value={courseFilter} onValueChange={v=>setCourseFilter(v==="ALL"?"":v)}>
          <SelectTrigger className="w-40 h-9 bg-background border-border" data-testid="course-filter"><SelectValue placeholder="All Courses"/></SelectTrigger>
          <SelectContent><SelectItem value="ALL">All Courses</SelectItem><SelectItem value="MEDICAL">Medical</SelectItem><SelectItem value="ENGINEERING">Engineering</SelectItem><SelectItem value="DSE">DSE</SelectItem></SelectContent>
        </Select>
        <Button size="sm" onClick={fetchData} data-testid="apply-filters-btn">Apply</Button>
      </div></CardContent></Card>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div> : !data ? null : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {KPIs.map((k,i)=>{const Icon=k.icon;return(
              <Card key={i} className={`border-border bg-card animate-fade-in stagger-${i+1}`}><CardContent className="p-5"><div className={`w-10 h-10 rounded-lg ${k.bg} flex items-center justify-center mb-3`}><Icon className={`w-5 h-5 ${k.color}`}/></div><p className="text-2xl font-bold">{k.value}</p><p className="text-sm text-muted-foreground mt-1">{k.label}</p></CardContent></Card>
            )})}
          </div>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border bg-card lg:col-span-2" data-testid="trends-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Registration Trends</CardTitle></CardHeader><CardContent>
              {data.registration_trends?.length>0?(<ResponsiveContainer width="100%" height={260}><LineChart data={data.registration_trends}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="date" tick={{fill:"#94A3B8",fontSize:11}} tickFormatter={v=>v?.slice(5)}/><YAxis tick={{fill:"#94A3B8",fontSize:11}}/><Tooltip content={<CustomTooltip/>}/><Line type="monotone" dataKey="count" stroke="#38BDF8" strokeWidth={2} dot={{fill:"#38BDF8",r:3}} name="Registrations"/></LineChart></ResponsiveContainer>):<div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
            </CardContent></Card>

            <Card className="border-border bg-card" data-testid="type-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Counselling Type</CardTitle></CardHeader><CardContent>
              {data.counselling_type_distribution?.length>0?(<ResponsiveContainer width="100%" height={240}><PieChart><Pie data={data.counselling_type_distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({name,value})=>`${name}: ${value}`}>{data.counselling_type_distribution.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip content={<CustomTooltip/>}/></PieChart></ResponsiveContainer>):<div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
            </CardContent></Card>

            <Card className="border-border bg-card" data-testid="status-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Verification Status</CardTitle></CardHeader><CardContent>
              {data.verification_status_distribution?.length>0?(<ResponsiveContainer width="100%" height={240}><BarChart data={data.verification_status_distribution}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="name" tick={{fill:"#94A3B8",fontSize:11}}/><YAxis tick={{fill:"#94A3B8",fontSize:11}}/><Tooltip content={<CustomTooltip/>}/><Bar dataKey="value" name="Students" radius={[4,4,0,0]}>{data.verification_status_distribution.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer>):<div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
            </CardContent></Card>

            <Card className="border-border bg-card" data-testid="category-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Category Distribution</CardTitle></CardHeader><CardContent>
              {data.category_distribution?.length>0?(<ResponsiveContainer width="100%" height={240}><BarChart data={data.category_distribution} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis type="number" tick={{fill:"#94A3B8",fontSize:11}}/><YAxis dataKey="name" type="category" tick={{fill:"#94A3B8",fontSize:11}} width={60}/><Tooltip content={<CustomTooltip/>}/><Bar dataKey="value" fill="#38BDF8" radius={[0,4,4,0]} name="Students"/></BarChart></ResponsiveContainer>):<div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
            </CardContent></Card>

            <Card className="border-border bg-card" data-testid="location-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Location Distribution</CardTitle></CardHeader><CardContent>
              {data.location_distribution?.length>0?(<ResponsiveContainer width="100%" height={240}><BarChart data={data.location_distribution}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="name" tick={{fill:"#94A3B8",fontSize:10}} angle={-30} textAnchor="end" height={60}/><YAxis tick={{fill:"#94A3B8",fontSize:11}}/><Tooltip content={<CustomTooltip/>}/><Bar dataKey="value" fill="#10B981" radius={[4,4,0,0]} name="Students"/></BarChart></ResponsiveContainer>):<div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
            </CardContent></Card>

            <Card className="border-border bg-card" data-testid="score-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Score Distribution</CardTitle></CardHeader><CardContent>
              {data.score_distribution?.length>0?(<ResponsiveContainer width="100%" height={240}><BarChart data={data.score_distribution}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="name" tick={{fill:"#94A3B8",fontSize:11}}/><YAxis tick={{fill:"#94A3B8",fontSize:11}}/><Tooltip content={<CustomTooltip/>}/><Bar dataKey="value" fill="#F59E0B" radius={[4,4,0,0]} name="Students"/></BarChart></ResponsiveContainer>):<div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
            </CardContent></Card>
          </div>
        </>
      )}
    </div>
  );
}
