import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { downloadBlob, printAnalyticsReport } from "@/lib/print";
import { Loader2, Download, BarChart3, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { toast } from "sonner";

const COLORS = ["#38BDF8","#10B981","#F59E0B","#EF4444","#A78BFA","#F97316","#06B6D4","#EC4899","#8B5CF6","#14B8A6","#F43F5E"];
const CustomTooltip = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  return (<div className="bg-[#1E293B] border border-[#334155] rounded-lg p-3 shadow-lg"><p className="text-xs text-slate-400 mb-1">{label}</p>{payload.map((p,i)=><p key={i} className="text-sm font-medium" style={{color:p.color}}>{p.name}: {typeof p.value==="number"?p.value.toLocaleString():p.value}</p>)}</div>);
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [exporting, setExporting] = useState(false);
  const [drilldown, setDrilldown] = useState(null);
  const [drillStudents, setDrillStudents] = useState([]);
  const [drillLoading, setDrillLoading] = useState(false);
  const [drillPage, setDrillPage] = useState(1);
  const [drillTotal, setDrillTotal] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);
      if (branchFilter) params.append("branch_id", branchFilter);
      if (courseFilter) params.append("counselling_type", courseFilter);
      const r = await api.get(`/admin/analytics?${params}`);
      setData(r.data);
    } catch { toast.error("Failed to load analytics"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); api.get("/admin/branches").then(r => setBranches(r.data)).catch(()=>{}); }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);
      if (branchFilter) params.append("branch_id", branchFilter);
      if (courseFilter) params.append("counselling_type", courseFilter);
      const r = await api.get(`/admin/export-students?${params}`, { responseType: "blob" });
      downloadBlob(new Blob([r.data]), "students_export.xlsx");
      toast.success("Export downloaded");
    } catch { toast.error("Export failed"); }
    finally { setExporting(false); }
  };

  const handlePdfExport = () => {
    if (!data) return;
    const branchName = branches.find((branch) => branch.id === branchFilter)?.name || "All Branches";

    printAnalyticsReport({
      title: "AME Portal Analytics Report",
      filters: [
        ["Date From", dateFrom || "All time"],
        ["Date To", dateTo || "Current date"],
        ["Branch", branchName],
        ["Course", courseFilter || "All courses"],
      ],
      summary: [
        ["Counselling Records", data.counselling_type_distribution?.reduce((sum, item) => sum + item.value, 0) || 0],
        ["Verified Students", data.verification_status_distribution?.find((item) => item.name === "VERIFIED")?.value || 0],
        ["Pending / Correction", data.verification_status_distribution?.filter((item) => item.name !== "VERIFIED").reduce((sum, item) => sum + item.value, 0) || 0],
        ["Branches in Result", data.revenue_by_branch?.length || 0],
      ],
      sections: [
        { title: "Counselling Type Distribution", rows: (data.counselling_type_distribution || []).map((item) => [item.name, item.value]) },
        { title: "Verification Status Distribution", rows: (data.verification_status_distribution || []).map((item) => [item.name, item.value]) },
        { title: "Category Distribution", rows: (data.category_distribution || []).map((item) => [item.name, item.value]) },
        { title: "Location Distribution", rows: (data.location_distribution || []).map((item) => [item.name, item.value]) },
        { title: "Score Distribution", rows: (data.score_distribution || []).map((item) => [item.name, item.value]) },
        { title: "Revenue by Branch", rows: (data.revenue_by_branch || []).map((item) => [item.branch, `Rs. ${Number(item.revenue || 0).toLocaleString()}`]) },
      ],
    });
  };

  const fetchDrilldown = async (type, value, nextPage = 1) => {
    setDrillLoading(true);
    try {
      const params = new URLSearchParams({ page: String(nextPage), limit: "20" });
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);
      if (branchFilter) params.append("branch_id", branchFilter);
      if (courseFilter) params.append("counselling_type", courseFilter);
      if (type === "category") params.append("category", value);
      if (type === "verification_status") params.append("verification_status", value);
      if (type === "counselling_type" && value) params.append("counselling_type", value);
      const r = await api.get(`/admin/students-drilldown?${params}`);
      setDrillStudents(r.data.students);
      setDrillTotal(r.data.total);
      setDrillPage(nextPage);
    } catch {
      toast.error("Failed");
    } finally {
      setDrillLoading(false);
    }
  };

  const openDrilldown = async (type, value) => {
    setDrilldown({ type, value });
    fetchDrilldown(type, value, 1);
  };

  const drillTotalPages = Math.max(1, Math.ceil(drillTotal / 20));

  return (
    <div className="space-y-6" data-testid="analytics-page">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-2xl font-bold tracking-tight">Analytics Suite</h2><p className="text-sm text-muted-foreground mt-1">System-wide insights with drill-down</p></div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePdfExport} disabled={!data} data-testid="export-pdf-btn">
            <FileText className="w-4 h-4 mr-1" />Export PDF
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={exporting} data-testid="export-btn">
            {exporting?<Loader2 className="w-4 h-4 animate-spin mr-1"/>:<Download className="w-4 h-4 mr-1"/>}Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card"><CardContent className="p-4"><div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1"><label className="text-xs text-muted-foreground">From</label><Input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className="h-9 w-40 bg-background border-border" data-testid="date-from"/></div>
        <div className="space-y-1"><label className="text-xs text-muted-foreground">To</label><Input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className="h-9 w-40 bg-background border-border" data-testid="date-to"/></div>
        <Select value={branchFilter} onValueChange={v=>setBranchFilter(v==="ALL"?"":v)}>
          <SelectTrigger className="w-44 h-9 bg-background border-border" data-testid="branch-filter"><SelectValue placeholder="All Branches"/></SelectTrigger>
          <SelectContent><SelectItem value="ALL">All Branches</SelectItem>{branches.map(b=><SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={courseFilter} onValueChange={v=>setCourseFilter(v==="ALL"?"":v)}>
          <SelectTrigger className="w-40 h-9 bg-background border-border" data-testid="course-filter"><SelectValue placeholder="All Courses"/></SelectTrigger>
          <SelectContent><SelectItem value="ALL">All Courses</SelectItem><SelectItem value="MEDICAL">Medical</SelectItem><SelectItem value="ENGINEERING">Engineering</SelectItem><SelectItem value="DSE">DSE</SelectItem></SelectContent>
        </Select>
        <Button size="sm" onClick={fetchData} data-testid="apply-filters-btn">Apply</Button>
      </div></CardContent></Card>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div> : !data ? null : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration Trends */}
          <Card className="border-border bg-card lg:col-span-2" data-testid="trends-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Registration Trends</CardTitle></CardHeader><CardContent>
            {data.registration_trends?.length>0?(<ResponsiveContainer width="100%" height={260}><LineChart data={data.registration_trends}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="date" tick={{fill:"#94A3B8",fontSize:11}} tickFormatter={v=>v?.slice(5)}/><YAxis tick={{fill:"#94A3B8",fontSize:11}}/><Tooltip content={<CustomTooltip/>}/><Line type="monotone" dataKey="count" stroke="#38BDF8" strokeWidth={2} dot={{fill:"#38BDF8",r:3}} name="Registrations"/></LineChart></ResponsiveContainer>):<div className="h-[260px] flex items-center justify-center text-muted-foreground"><BarChart3 className="w-10 h-10 opacity-50"/></div>}
          </CardContent></Card>

          {/* Type Distribution */}
          <Card className="border-border bg-card" data-testid="type-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Counselling Type<span className="text-xs text-muted-foreground ml-2">(click slice to drill-down)</span></CardTitle></CardHeader><CardContent>
            {data.counselling_type_distribution?.length>0?(<ResponsiveContainer width="100%" height={240}><PieChart><Pie data={data.counselling_type_distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({name,value})=>`${name}: ${value}`} onClick={(entry) => entry?.name && openDrilldown("counselling_type", entry.name)}>{data.counselling_type_distribution.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} className="cursor-pointer"/>)}</Pie><Tooltip content={<CustomTooltip/>}/></PieChart></ResponsiveContainer>):<div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
          </CardContent></Card>

          {/* Verification Status */}
          <Card className="border-border bg-card" data-testid="status-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Verification Status</CardTitle></CardHeader><CardContent>
            {data.verification_status_distribution?.length>0?(<ResponsiveContainer width="100%" height={240}><BarChart data={data.verification_status_distribution}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="name" tick={{fill:"#94A3B8",fontSize:11}}/><YAxis tick={{fill:"#94A3B8",fontSize:11}}/><Tooltip content={<CustomTooltip/>}/><Bar dataKey="value" name="Students" radius={[4,4,0,0]} onClick={(d)=>openDrilldown("verification_status",d.name)}>{data.verification_status_distribution.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} className="cursor-pointer"/>)}</Bar></BarChart></ResponsiveContainer>):<div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
          </CardContent></Card>

          {/* Category */}
          <Card className="border-border bg-card" data-testid="category-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Category Distribution</CardTitle></CardHeader><CardContent>
            {data.category_distribution?.length>0?(<ResponsiveContainer width="100%" height={240}><BarChart data={data.category_distribution} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis type="number" tick={{fill:"#94A3B8",fontSize:11}}/><YAxis dataKey="name" type="category" tick={{fill:"#94A3B8",fontSize:11}} width={60}/><Tooltip content={<CustomTooltip/>}/><Bar dataKey="value" fill="#38BDF8" radius={[0,4,4,0]} name="Students" onClick={(d)=>openDrilldown("category",d.name)}/></BarChart></ResponsiveContainer>):<div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
          </CardContent></Card>

          {/* Revenue by Branch */}
          <Card className="border-border bg-card" data-testid="revenue-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Revenue by Branch</CardTitle></CardHeader><CardContent>
            {data.revenue_by_branch?.length>0?(<ResponsiveContainer width="100%" height={240}><BarChart data={data.revenue_by_branch}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="branch" tick={{fill:"#94A3B8",fontSize:11}}/><YAxis tick={{fill:"#94A3B8",fontSize:11}}/><Tooltip content={<CustomTooltip/>}/><Bar dataKey="revenue" fill="#10B981" radius={[4,4,0,0]} name="Revenue (Rs.)"/></BarChart></ResponsiveContainer>):<div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
          </CardContent></Card>

          {/* Location */}
          <Card className="border-border bg-card" data-testid="location-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Location Distribution</CardTitle></CardHeader><CardContent>
            {data.location_distribution?.length>0?(<ResponsiveContainer width="100%" height={240}><BarChart data={data.location_distribution}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="name" tick={{fill:"#94A3B8",fontSize:10}} angle={-30} textAnchor="end" height={60}/><YAxis tick={{fill:"#94A3B8",fontSize:11}}/><Tooltip content={<CustomTooltip/>}/><Bar dataKey="value" fill="#A78BFA" radius={[4,4,0,0]} name="Students"/></BarChart></ResponsiveContainer>):<div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
          </CardContent></Card>

          {/* Score */}
          <Card className="border-border bg-card" data-testid="score-chart"><CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Score Distribution (12th %)</CardTitle></CardHeader><CardContent>
            {data.score_distribution?.length>0?(<ResponsiveContainer width="100%" height={240}><BarChart data={data.score_distribution}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="name" tick={{fill:"#94A3B8",fontSize:11}}/><YAxis tick={{fill:"#94A3B8",fontSize:11}}/><Tooltip content={<CustomTooltip/>}/><Bar dataKey="value" fill="#F59E0B" radius={[4,4,0,0]} name="Students"/></BarChart></ResponsiveContainer>):<div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>}
          </CardContent></Card>
        </div>
      )}

      {/* Drill-down Dialog */}
      <Dialog open={!!drilldown} onOpenChange={() => setDrilldown(null)}>
        <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-y-auto" data-testid="drilldown-dialog">
          <DialogHeader><DialogTitle>Student Details: {drilldown?.value || drilldown?.type}</DialogTitle><DialogDescription>Read-only view of underlying records</DialogDescription></DialogHeader>
          {drillLoading ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary"/></div> : (
            <div className="overflow-x-auto">
              <Table><TableHeader><TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs">Reg No</TableHead><TableHead className="text-xs">Name</TableHead><TableHead className="text-xs">Phone</TableHead><TableHead className="text-xs">Category</TableHead><TableHead className="text-xs">Type</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs">Branch</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {drillStudents.map(s=>(
                  <TableRow key={s.id} className="border-border">
                    <TableCell className="text-xs font-mono text-primary">{s.registration_no}</TableCell>
                    <TableCell className="text-sm">{s.full_name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.phone}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{s.category}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="text-xs border-primary/30 text-primary">{s.counselling_type}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={`text-xs ${s.verification_status==="VERIFIED"?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":s.verification_status==="CORRECTION_REQUIRED"?"bg-red-500/10 text-red-400 border-red-500/20":"bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{s.verification_status}</Badge></TableCell>
                    <TableCell className="text-xs">{s.branch_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">{drillTotal} total records</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={drillPage <= 1} onClick={() => fetchDrilldown(drilldown.type, drilldown.value, drillPage - 1)} data-testid="drilldown-prev-btn">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">Page {drillPage} of {drillTotalPages}</span>
                  <Button variant="outline" size="sm" disabled={drillPage >= drillTotalPages} onClick={() => fetchDrilldown(drilldown.type, drilldown.value, drillPage + 1)} data-testid="drilldown-next-btn">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
