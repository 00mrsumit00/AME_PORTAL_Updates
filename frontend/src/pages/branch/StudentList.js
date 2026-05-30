import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AdditionalDetailsForm } from "@/components/student/AdditionalDetailsForm";
import { buildAdditionalDetailsForm, buildAdditionalPayload } from "@/lib/studentDetails";
import { printStudentProfile, printStudentReceipt } from "@/lib/print";
import { Search, Loader2, Eye, ChevronLeft, ChevronRight, Edit2, Printer, X, UserCog, Save } from "lucide-react";
import ChatView from "@/components/ChatView";
import { toast } from "sonner";

function InfoRow({ label, value }) {
  return (<div className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0"><span className="text-xs text-muted-foreground">{label}</span><span className="text-sm font-medium text-right max-w-[60%]">{value||"—"}</span></div>);
}

const SUB_FILTERS = {
  MEDICAL: ["MBBS", "BDS", "BAMS", "BUMS", "BHMS", "BPTH", "B.O.Th", "BASLP", "BPO", "B.Sc Nursing"],
  ENGINEERING: ["JOSSA", "State Counselling"]
};

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [subTypeFilter, setSubTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewStudent, setViewStudent] = useState(null);
  const [addMore, setAddMore] = useState(null);
  const [addForm, setAddForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [chatStudent, setChatStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (typeFilter) params.append("counselling_type", typeFilter);
      if (subTypeFilter) params.append("stream", subTypeFilter);
      const res = await api.get(`/branch/students?${params}`);
      setStudents(res.data.students); setTotal(res.data.total);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, [page, statusFilter, typeFilter, subTypeFilter]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchStudents(); };

  const openAddMore = (student) => {
    setAddForm(buildAdditionalDetailsForm(student));
    setAddMore(student);
  };

  const handleSaveAdditional = async () => {
    setSaving(true);
    try {
      await api.put(`/branch/students/${addMore.id}/additional`, buildAdditionalPayload(addForm));
      toast.success("Details saved");
      setAddMore(null);
      fetchStudents();
    } catch (err) { toast.error(err.response?.data?.detail || "Failed"); }
    finally { setSaving(false); }
  };

  const handlePrintReceipt = async (studentId) => {
    try {
      const response = await api.get(`/branch/students/${studentId}/receipt`);
      printStudentReceipt(response.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to print receipt");
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6" data-testid="student-list">
      <div><h2 className="text-2xl font-bold tracking-tight">Registered Students</h2><p className="text-sm text-muted-foreground mt-1">{total} students</p></div>

      {/* Filters */}
      <Card className="border-border bg-card"><CardContent className="p-4"><div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
          <Input placeholder="Search name, reg no, phone..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 h-9 bg-background border-border" data-testid="student-search-input"/>
        </form>
        <Select value={statusFilter} onValueChange={v=>{setStatusFilter(v==="ALL"?"":v);setPage(1);}}>
          <SelectTrigger className="w-44 h-9 bg-background border-border" data-testid="status-filter"><SelectValue placeholder="All Statuses"/></SelectTrigger>
          <SelectContent><SelectItem value="ALL">All</SelectItem><SelectItem value="PENDING">Pending</SelectItem><SelectItem value="VERIFIED">Verified</SelectItem><SelectItem value="CORRECTION_REQUIRED">Correction</SelectItem></SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={v=>{setTypeFilter(v==="ALL"?"":v);setSubTypeFilter("");setPage(1);}}>
          <SelectTrigger className="w-44 h-9 bg-background border-border" data-testid="type-filter"><SelectValue placeholder="All Types"/></SelectTrigger>
          <SelectContent><SelectItem value="ALL">All Types</SelectItem><SelectItem value="MEDICAL">Medical</SelectItem><SelectItem value="ENGINEERING">Engineering</SelectItem><SelectItem value="DSE">DSE</SelectItem></SelectContent>
        </Select>
        {(typeFilter === "MEDICAL" || typeFilter === "ENGINEERING") && (
          <Select value={subTypeFilter || "ALL"} onValueChange={v=>{setSubTypeFilter(v==="ALL"?"":v);setPage(1);}}>
            <SelectTrigger className="w-44 h-9 bg-background border-border" data-testid="subtype-filter"><SelectValue placeholder="All Streams"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Streams</SelectItem>
              {SUB_FILTERS[typeFilter].map(stream => (
                <SelectItem key={stream} value={stream}>{stream}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div></CardContent></Card>

      {/* Table */}
      <Card className="border-border bg-card"><CardContent className="p-0">
        {loading?(<div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary"/></div>):students.length===0?(<div className="text-center py-16 text-muted-foreground">No students found</div>):(
          <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-semibold">Reg No</TableHead><TableHead className="text-xs font-semibold">Name</TableHead><TableHead className="text-xs font-semibold">Phone</TableHead><TableHead className="text-xs font-semibold">Parent Phone</TableHead><TableHead className="text-xs font-semibold">Category</TableHead><TableHead className="text-xs font-semibold">Type</TableHead><TableHead className="text-xs font-semibold">Status</TableHead><TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>{students.map(s=>(
              <TableRow key={s.id} className="border-border" data-testid={`student-row-${s.id}`}>
                <TableCell className="text-sm font-mono text-primary">{s.registration_no}</TableCell>
                <TableCell className="text-sm font-medium">{s.full_name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.phone}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.parent_phone||"—"}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{s.category||"—"}</Badge></TableCell>
                <TableCell><Badge variant="outline" className="text-xs border-primary/30 text-primary">{s.counselling_type}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={`text-xs ${s.verification_status==="VERIFIED"?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":s.verification_status==="CORRECTION_REQUIRED"?"bg-red-500/10 text-red-400 border-red-500/20":"bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{s.verification_status}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" title="View Details" onClick={()=>setViewStudent(s)} data-testid={`view-${s.id}`}><Eye className="w-4 h-4"/></Button>
                    <Button size="sm" variant="ghost" title="Add/Edit Details" onClick={()=>openAddMore(s)} data-testid={`edit-${s.id}`}><Edit2 className="w-4 h-4"/></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" title="Print" data-testid={`print-menu-${s.id}`}><Printer className="w-4 h-4"/></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border-border bg-card text-foreground">
                        <DropdownMenuItem onClick={() => printStudentProfile({ student: s })} data-testid={`print-profile-${s.id}`}>Print Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePrintReceipt(s.id)} data-testid={`print-receipt-${s.id}`}>Print Receipt</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" variant="ghost" title="Chat" onClick={()=>setChatStudent(s)} data-testid={`chat-${s.id}`}>Chat</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}</TableBody>
          </Table></div>
        )}
        {totalPages>1&&(<div className="flex items-center justify-between px-4 py-3 border-t border-border"><p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p><div className="flex gap-1"><Button variant="outline" size="sm" disabled={page<=1} onClick={()=>setPage(page-1)}><ChevronLeft className="w-4 h-4"/></Button><Button variant="outline" size="sm" disabled={page>=totalPages} onClick={()=>setPage(page+1)}><ChevronRight className="w-4 h-4"/></Button></div></div>)}
      </CardContent></Card>

      {/* View Student Dialog */}
      <Dialog open={!!viewStudent} onOpenChange={()=>setViewStudent(null)}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="view-student-dialog">
          <DialogHeader><DialogTitle>Student Profile (Read-Only)</DialogTitle><DialogDescription>{viewStudent?.registration_no} - {viewStudent?.full_name}</DialogDescription></DialogHeader>
          {viewStudent&&(<Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full justify-start bg-secondary/50 mb-4"><TabsTrigger value="basic">Basic</TabsTrigger><TabsTrigger value="counselling">Counselling</TabsTrigger><TabsTrigger value="education">Education</TabsTrigger><TabsTrigger value="additional">Additional</TabsTrigger></TabsList>
            <TabsContent value="basic"><InfoRow label="Reg No" value={viewStudent.registration_no}/><InfoRow label="Name" value={viewStudent.full_name}/><InfoRow label="Phone" value={viewStudent.phone}/><InfoRow label="Parent Phone" value={viewStudent.parent_phone}/><InfoRow label="Gender" value={viewStudent.gender}/><InfoRow label="DOB" value={viewStudent.dob}/><InfoRow label="District" value={viewStudent.district}/><InfoRow label="Category" value={viewStudent.category}/><InfoRow label="Caste" value={viewStudent.caste}/><InfoRow label="Special Reservation" value={viewStudent.special_reservation}/><InfoRow label="Fresher/Repeater" value={viewStudent.fresher_repeater}/><InfoRow label="Registered By" value={viewStudent.registered_by}/></TabsContent>
            <TabsContent value="counselling"><InfoRow label="Type" value={viewStudent.counselling_type}/><InfoRow label="Selection" value={viewStudent.selection_display}/>{viewStudent.branch_priority&&<InfoRow label="Branch Priority" value={viewStudent.branch_priority}/>}</TabsContent>
            <TabsContent value="education">{viewStudent.education_10th?.board&&<><p className="text-sm font-semibold mb-2">10th</p><InfoRow label="Board" value={viewStudent.education_10th.board}/><InfoRow label="Percentage" value={viewStudent.education_10th.percentage}/><InfoRow label="School" value={viewStudent.education_10th.school}/></>}{viewStudent.education_12th?.board&&<><p className="text-sm font-semibold mt-4 mb-2">12th</p><InfoRow label="Board" value={viewStudent.education_12th.board}/><InfoRow label="Percentage" value={viewStudent.education_12th.percentage}/><InfoRow label="College" value={viewStudent.education_12th.college}/></>}</TabsContent>
            <TabsContent value="additional">{viewStudent.additional_details&&<><InfoRow label="Mother Name" value={viewStudent.additional_details.mother_name}/><InfoRow label="Email" value={viewStudent.additional_details.email}/><InfoRow label="Aadhaar" value={viewStudent.additional_details.aadhaar_number}/><InfoRow label="Address" value={viewStudent.additional_details.address}/></>}</TabsContent>
          </Tabs>)}
        </DialogContent>
      </Dialog>

      {/* Add More Details Workspace (Full Page Portal) */}
      {addMore && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col animate-in fade-in duration-300" data-testid="add-more-workspace">
          
          {/* ── Top Navigation Bar (Full Width) ── */}
          <header className="shrink-0 border-t-[4px] border-primary bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
                  <UserCog className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">Student Details Workspace</h1>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-sm font-semibold text-slate-300">{addMore.full_name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    <span className="px-2.5 py-0.5 rounded-lg bg-primary/20 border border-primary/30 text-[11px] font-bold tracking-widest text-primary uppercase">
                      {addMore.registration_no}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveAdditional}
                  disabled={saving}
                  size="lg"
                  className="h-11 px-8 gap-2 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-95"
                  data-testid="save-additional-btn"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAddMore(null)}
                  className="h-11 w-11 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all font-bold"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </header>

          {/* ── Main Scrollable Workspace ── */}
          <main className="flex-1 overflow-y-auto bg-[#0B0F1A] py-12 px-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            <div className="max-w-7xl mx-auto">
              <AdditionalDetailsForm form={addForm} setForm={setAddForm} idPrefix="branch-student-additional" />
            </div>
          </main>

        </div>,
        document.body
      )}

      {/* Chat Dialog */}
      <Dialog open={!!chatStudent} onOpenChange={()=>setChatStudent(null)}>
        <DialogContent className="bg-card border-border max-w-2xl" data-testid="chat-dialog">
          <DialogHeader><DialogTitle>Chat - {chatStudent?.full_name}</DialogTitle><DialogDescription>{chatStudent?.registration_no}</DialogDescription></DialogHeader>
          {chatStudent && <ChatView studentId={chatStudent.id} studentName={chatStudent.full_name} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
