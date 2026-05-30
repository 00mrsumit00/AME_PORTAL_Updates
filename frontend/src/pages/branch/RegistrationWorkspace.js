import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Stethoscope, Cog, GraduationCap, ArrowLeft, ArrowRight, 
  Check, Loader2, Printer, Search, History, Save, User, Phone, FileText, Eye
} from "lucide-react";
import { toast } from "sonner";
import { printStudentReceipt } from "@/lib/print";
import { useAuth } from "@/contexts/AuthContext";

const STEPS = ["Counselling Type", "Stream Details", "Selection Summary", "Personal Details", "Registration Info", "Payment"];
const MED_TYPES = ["State Quota", "AIIMS", "AFMC", "JIPMER", "AIQ 15% GOV", "Deemed", "Other State"];
const MED_COURSES = {
  "State Quota": ["MBBS", "BDS", "BAMS", "BUMS", "BHMS", "BPTH", "B.O.Th", "BASLP", "BPO", "B.Sc Nursing"],
  "AIQ 15% GOV": ["MBBS", "BDS", "BAMS", "BHMS"],
  "Deemed": ["MBBS", "BDS", "BAMS"],
  "Other State": ["MBBS", "BAMS"]
};
const OTHER_MBBS_STATES = ["Telangana", "Andhra Pradesh", "Karnataka", "Uttar Pradesh"];
const OTHER_BAMS_STATES = ["Karnataka", "Madhya Pradesh"];
const MAHARASHTRA_DISTRICTS = ["Mumbai","Pune","Nagpur","Thane","Nashik","Chhatrapati Sambhajinagar","Solapur","Kolhapur","Sangli","Satara","Ratnagiri","Sindhudurg","Raigad","Palghar","Ahmednagar","Jalgaon","Dhule","Nandurbar","Beed","Latur","Dharashiv","Nanded","Parbhani","Hingoli","Washim","Akola","Amravati","Yavatmal","Buldhana","Wardha","Chandrapur","Gadchiroli","Gondia","Bhandara","Jalna"];
const CATEGORIES = ["GEN","OBC","SC","ST","EWS","NT-B","NT-C","NT-D","SEBC","SBC","VJ-DT(A)"];
const SPECIAL_RES = ["None","DEF-1","DEF-2","DEF-3","MKB","Hilly Area","PWD","Orphan"];

function Field({ label, children, required }) {
  return (<div className="space-y-1.5"><Label className="text-sm font-medium">{label}{required && <span className="text-destructive ml-1">*</span>}</Label>{children}</div>);
}

function ToggleChip({ selected, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selected ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
      {children}
    </button>
  );
}

export default function RegistrationWorkspace() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("edit");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [branchInfo, setBranchInfo] = useState(null);
  const [viewReceiptData, setViewReceiptData] = useState(null);
  const receiptRef = useRef(null);

  // Replicated Form state
  const [counsellingType, setCounsellingType] = useState("");
  const [medSelections, setMedSelections] = useState([]);
  const [engType, setEngType] = useState("");
  const [branchPriority, setBranchPriority] = useState("");
  const [personal, setPersonal] = useState({ full_name: "", phone: "", parent_phone: "", gender: "", dob: "", district: "", category: "", caste: "", special_reservation: "None", fresher_repeater: "Fresher" });
  const [registeredBy, setRegisteredBy] = useState("");
  const [registeredById, setRegisteredById] = useState("");
  const [updatedById, setUpdatedById] = useState("");
  const [editReason, setEditReason] = useState("");
  const [payment, setPayment] = useState({ amount: "", pending_amount: "", concession_amount: "", mode: "CASH", utr: "", note: "" });
  const [showConcession, setShowConcession] = useState(false);

  useEffect(() => {
    api.get("/branch/staff-list").then(r => setStaffList(r.data)).catch(() => {});
    api.get("/branch/dashboard").then(r => setBranchInfo(r.data.branch)).catch(() => {});
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;
    setSearching(true);
    try {
      const res = await api.get(`/branch/students?search=${search}&limit=5`);
      setSearchResults(res.data.students);
    } catch { toast.error("Search failed"); }
    finally { setSearching(false); }
  };

  const loadStudentWorkspace = async (student) => {
    setSelectedStudent(student);
    setLoadingHistory(true);
    setStep(0);
    setActiveTab("edit");
    try {
      const [histRes, detailsRes] = await Promise.all([
        api.get(`/branch/students/${student.id}/history`),
        api.get(`/branch/students/${student.id}`)
      ]);
      setHistory(histRes.data);
      
      const s = detailsRes.data.student;
      const p = detailsRes.data.payment || {};
      
      setCounsellingType(s.counselling_type || "");
      setMedSelections(s.medical_selections || []);
      setEngType(s.engineering_type || "");
      setBranchPriority(s.branch_priority || "");
      setPersonal({
        full_name: s.full_name || "",
        phone: s.phone || "",
        parent_phone: s.parent_phone || "",
        gender: s.gender || "",
        dob: s.dob || "",
        district: s.district || "",
        category: s.category || "",
        caste: s.caste || "",
        special_reservation: s.special_reservation || "None",
        fresher_repeater: s.fresher_repeater || "Fresher"
      });
      setRegisteredBy(s.registered_by || "");
      setRegisteredById(s.registered_by_id || "");
      setUpdatedById(user?.id || "");
      setEditReason("");
      setPayment({
        amount: p.amount || 0,
        pending_amount: p.pending_amount || 0,
        concession_amount: p.concession_amount || 0,
        mode: p.payment_mode || "CASH",
        utr: p.utr_number || "",
        note: p.note || ""
      });
      setShowConcession(!!p.concession_amount && p.concession_amount > 0);
    } catch (err) { 
        console.error("Workspace Load Error:", err);
        toast.error("Failed to load: " + (err.response?.data?.detail || err.message)); 
    }
    finally { setLoadingHistory(false); }
  };

  const toggleMedType = (type) => {
    setMedSelections(prev => {
      const exists = prev.find(s => s.type === type);
      if (exists) return prev.filter(s => s.type !== type);
      return [...prev, { type, courses: [], states: [] }];
    });
  };

  const toggleMedCourse = (type, course) => {
    setMedSelections(prev => prev.map(s => {
      if (s.type !== type) return s;
      const has = s.courses.includes(course);
      return { ...s, courses: has ? s.courses.filter(c => c !== course) : [...s.courses, course] };
    }));
  };

  const toggleMedState = (type, state) => {
    setMedSelections(prev => prev.map(s => {
      if (s.type !== type) return s;
      const has = s.states.includes(state);
      return { ...s, states: has ? s.states.filter(st => st !== state) : [...s.states, state] };
    }));
  };

  const buildSelectionDisplay = () => {
    if (counsellingType === "MEDICAL") {
      return "Medical - " + medSelections.map(s => {
        if (s.type === "State Quota") return `State Quota (${s.courses.join(", ")})`;
        if (s.type === "AIQ 15% GOV") return `AIQ (${s.courses.join(", ")})`;
        if (s.type === "Deemed") return `Deemed (${s.courses.join(", ")})`;
        if (s.type === "Other State") {
          return s.states.length > 0 ? `${s.states.join(", ")} (${s.courses.join(", ")})` : `Other State (${s.courses.join(", ")})`;
        }
        return s.type;
      }).join(", ");
    }
    if (counsellingType === "ENGINEERING") return `Engg - ${engType}`;
    return "DSE";
  };

  const validateStep = () => {
    if (step === 0 && !counsellingType) { toast.error("Select counselling type"); return false; }
    if (step === 1) {
      if (counsellingType === "MEDICAL") {
        if (medSelections.length === 0) { toast.error("Select at least one counselling type"); return false; }
        for (const s of medSelections) {
          if (MED_COURSES[s.type] && MED_COURSES[s.type].length > 0 && s.courses.length === 0) { toast.error(`Select courses for ${s.type}`); return false; }
          if (s.type === "Other State") {
            if (s.courses.includes("MBBS") && s.states.length === 0) { toast.error("Select states for MBBS under Other State"); return false; }
            if (s.courses.includes("BAMS") && s.states.filter(st => OTHER_BAMS_STATES.includes(st)).length === 0) { toast.error("Select states for BAMS under Other State"); return false; }
          }
        }
      }
      if (counsellingType === "ENGINEERING" && !engType) { toast.error("Select JOSSA or State Counselling"); return false; }
    }
    if (step === 3) {
      if (!personal.full_name) { toast.error("Full name required"); return false; }
      if (!personal.phone) { toast.error("Phone required"); return false; }
      if (!personal.gender) { toast.error("Gender required"); return false; }
    }
    if (step === 4) {
      if (!updatedById) { toast.error("Select the staff modifying this record"); return false; }
      if (!editReason.trim()) { toast.error("Please provide a reason for this modification"); return false; }
    }
    return true;
  };

  const handleNext = () => { if (validateStep()) setStep(s => Math.min(s + 1, 5)); };
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        counselling_type: counsellingType,
        medical_selections: counsellingType === "MEDICAL" ? medSelections : [],
        selection_display: buildSelectionDisplay(),
        engineering_type: engType,
        branch_priority: branchPriority,
        full_name: personal.full_name, phone: personal.phone, parent_phone: personal.parent_phone,
        gender: personal.gender, dob: personal.dob, district: personal.district,
        category: personal.category, caste: personal.caste,
        special_reservation: personal.special_reservation, fresher_repeater: personal.fresher_repeater,
        registered_by: registeredBy, registered_by_id: registeredById,
        payment_amount: parseFloat(payment.amount) || 0,
        pending_amount: parseFloat(payment.pending_amount) || 0,
        concession_amount: parseFloat(payment.concession_amount) || 0,
        payment_mode: payment.mode,
        utr_number: payment.utr, payment_note: payment.note,
        updated_by_id: updatedById, edit_reason: editReason
      };
      const res = await api.put(`/branch/students/${selectedStudent.id}/registration`, payload);
      toast.success(res.data.message);
      // Reload history
      const histRes = await api.get(`/branch/students/${selectedStudent.id}/history`);
      setHistory(histRes.data);
      setActiveTab("history");
    } catch (err) { toast.error(err.response?.data?.detail || "Update failed"); }
    finally { setSaving(false); }
  };

  const handlePrintVersion = (v) => {
    const s = v.snapshot;
    const studentData = {
      registration_no: selectedStudent.registration_no,
      full_name: s.full_name,
      phone: s.phone,
      parent_phone: s.parent_phone,
      selection_display: s.selection_display,
      category: s.category,
      registered_by: s.registered_by,
      created_at: v.created_at
    };
    const paymentData = {
      amount: s.payment_amount,
      payment_mode: s.payment_mode,
      utr_number: s.utr_number
    };
    printStudentReceipt({ student: studentData, payment: paymentData, branch: branchInfo });
  };

  const handlePrintLocal = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Receipt</title><style>body{font-family:Arial,sans-serif;padding:30px;color:#222}h2{text-align:center;border-bottom:2px solid #333;padding-bottom:10px}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee}.label{color:#666;font-size:14px}.val{font-weight:600;font-size:14px}.header{text-align:center;margin-bottom:20px}.footer{margin-top:30px;text-align:center;color:#666;font-size:12px}</style></head><body>${printContent.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 250);
  };

  return (
    <div className="space-y-6" data-testid="reg-workspace">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Registration Workspace</h2>
          <p className="text-sm text-slate-400 mt-1">Search student and edit their registration stages (v1, v2, v3...)</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-[400px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Name, Reg No, or Phone..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10 h-10 bg-slate-900 border-slate-800 rounded-lg text-sm"
            />
          </div>
          <Button type="submit" disabled={searching} variant="secondary" className="h-10 px-6 font-bold">
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </form>
      </div>

      {!selectedStudent && searchResults.length > 0 && (
        <Card className="border-slate-800 bg-slate-900 shadow-xl">
          <CardHeader className="py-4"><CardTitle className="text-xs font-bold text-slate-500 uppercase">Search Results</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-800/30">
                <TableRow className="border-slate-800">
                  <TableHead className="text-[10px] font-bold">Reg No</TableHead>
                  <TableHead className="text-[10px] font-bold">Name</TableHead>
                  <TableHead className="text-[10px] font-bold">Phone</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map(s => (
                  <TableRow key={s.id} className="border-slate-800 hover:bg-slate-800/20">
                    <TableCell className="font-mono text-primary font-bold">{s.registration_no}</TableCell>
                    <TableCell className="font-medium">{s.full_name}</TableCell>
                    <TableCell className="text-slate-400">{s.phone}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => loadStudentWorkspace(s)} className="h-8 px-4 text-xs font-bold border-primary/20 text-primary hover:bg-primary/10">Open Workspace</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
          {/* Quick Stats Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{selectedStudent.full_name}</h3>
                <Badge variant="outline" className="mt-2 font-mono border-primary/20 text-primary">{selectedStudent.registration_no}</Badge>
                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-center gap-2 text-xs text-slate-400"><Phone className="w-3.5 h-3.5" /> {selectedStudent.phone}</div>
                  <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed"><FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {selectedStudent.selection_display}</div>
                </div>
                <Button variant="ghost" className="w-full mt-6 text-[11px] font-bold border border-slate-800 h-9" onClick={() => { setSelectedStudent(null); setSearchResults([]); }}>Change Student</Button>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="py-3 px-4 border-b border-slate-800"><CardTitle className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Version History</CardTitle></CardHeader>
              <CardContent className="p-0">
                {loadingHistory ? <div className="p-6 flex justify-center"><Loader2 className="w-4 h-4 animate-spin" /></div> : history.length === 0 ? <div className="p-6 text-center text-xs text-slate-500 italic">No versions saved</div> : (
                  <div className="divide-y divide-slate-800">
                    {history.map(v => (
                      <div key={v.id} className="p-4 hover:bg-slate-800/20 transition-all flex items-center justify-between group">
                        <div>
                          <p className="text-[11px] font-bold text-white mb-0.5">Version {v.version}</p>
                          <p className="text-[10px] text-slate-500">{new Date(v.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setViewReceiptData(v)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"><Eye className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => handlePrintVersion(v)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10"><Printer className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Edit Area */}
          <div className="lg:col-span-3">
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-slate-900 border border-slate-800 p-1 mb-6 h-auto">
                <TabsTrigger value="edit" className="flex-1 py-2 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">6-Stage Edit Module</TabsTrigger>
                <TabsTrigger value="history" className="flex-1 py-2 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Audit Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="m-0 space-y-6">
                {/* REPLICATED STEP INDICATOR */}
                <div className="flex items-center gap-1 overflow-x-auto pb-4" data-testid="workspace-step-indicator">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex items-center">
                      <button onClick={() => i < step && setStep(i)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${i === step ? "bg-primary text-white" : i < step ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-600"}`}>
                        <span className="w-4 h-4 rounded-full flex items-center justify-center border border-current">{i < step ? <Check className="w-2.5 h-2.5" /> : i+1}</span>
                        <span>{s}</span>
                      </button>
                      {i < STEPS.length - 1 && <div className="w-4 h-px bg-slate-800 mx-0.5" />}
                    </div>
                  ))}
                </div>

                <Card className="border-slate-800 bg-slate-900 shadow-2xl">
                  <CardHeader className="pb-4"><CardTitle className="text-sm font-bold text-white border-l-2 border-primary pl-3">{STEPS[step]}</CardTitle></CardHeader>
                  <CardContent>
                    {/* Stage 0: Counselling Type */}
                    {step === 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-testid="workspace-step-0">
                        {[{type:"MEDICAL",label:"Medical",sub:"NEET Counselling",icon:Stethoscope},{type:"ENGINEERING",label:"Engineering",sub:"CET/JOSSA",icon:Cog},{type:"DSE",label:"DSE",sub:"Diploma to Engineering",icon:GraduationCap}].map(opt=>(
                          <button key={opt.type} onClick={()=>setCounsellingType(opt.type)} className={`p-6 rounded-xl border-2 text-center transition-all ${counsellingType===opt.type?"border-primary bg-primary/5":"border-slate-800 hover:border-slate-700 bg-black/20"}`}>
                            <opt.icon className={`w-8 h-8 mx-auto mb-3 ${counsellingType===opt.type?"text-primary":"text-slate-500"}`}/><p className="font-bold text-sm text-white">{opt.label}</p><p className="text-[10px] text-slate-500 mt-1">{opt.sub}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Stage 1: Stream Details */}
                    {step === 1 && (
                      <div className="space-y-5" data-testid="workspace-step-1">
                        {counsellingType === "MEDICAL" && (
                          <div className="space-y-4">
                            <p className="text-[11px] font-bold text-slate-500 uppercase">Select track(s):</p>
                            <div className="flex flex-wrap gap-2">
                              {MED_TYPES.map(t => <ToggleChip key={t} selected={medSelections.some(s=>s.type===t)} onClick={()=>toggleMedType(t)}>{t}</ToggleChip>)}
                            </div>
                            {medSelections.map(sel => (
                              <div key={sel.type} className="bg-black/30 rounded-xl p-4 border border-slate-800 space-y-3">
                                <p className="text-[11px] font-black text-primary uppercase">{sel.type}</p>
                                {MED_COURSES[sel.type] && (
                                  <div className="flex flex-wrap gap-2">{MED_COURSES[sel.type].map(c => <ToggleChip key={c} selected={sel.courses.includes(c)} onClick={()=>toggleMedCourse(sel.type,c)}>{c}</ToggleChip>)}</div>
                                )}
                                {sel.type === "Other State" && sel.courses.includes("MBBS") && (
                                  <div className="pt-2 border-t border-slate-800"><p className="text-[10px] text-slate-500 font-bold mb-2">States for MBBS:</p><div className="flex flex-wrap gap-2">{OTHER_MBBS_STATES.map(st => <ToggleChip key={st} selected={sel.states.includes(st)} onClick={()=>toggleMedState(sel.type,st)}>{st}</ToggleChip>)}</div></div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {counsellingType === "ENGINEERING" && (
                          <div className="space-y-4">
                            <Field label="Counselling Track" required>
                              <div className="flex gap-3">
                                {["JOSSA","State Counselling"].map(t=>(
                                  <button key={t} onClick={()=>setEngType(t)} className={`flex-1 p-3 rounded-lg border-2 text-xs font-bold transition-all ${engType===t?"border-primary bg-primary/5 text-primary":"border-slate-800 hover:border-border text-slate-500"}`}>{t}</button>
                                ))}
                              </div>
                            </Field>
                            <Field label="Priority List"><Textarea value={branchPriority} onChange={e=>setBranchPriority(e.target.value)} className="bg-slate-900 border-slate-800 h-24 rounded-lg"/></Field>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stage 2: Summary */}
                    {step === 2 && (
                      <div className="space-y-4" data-testid="workspace-step-2">
                         <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Active Configuration</h4>
                            <p className="text-xl font-bold text-white mb-4">{buildSelectionDisplay()}</p>
                            <div className="flex flex-wrap gap-2">
                               {counsellingType === "MEDICAL" && medSelections.map(s => <Badge key={s.type} className="bg-primary/10 text-primary border-primary/20 text-[10px] py-0.5">{s.type}</Badge>)}
                            </div>
                         </div>
                         <p className="text-center text-[10px] text-slate-500 font-medium">Verify the details above before moving to Personal Info.</p>
                      </div>
                    )}

                    {/* Stage 3: Personal */}
                    {step === 3 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" data-testid="workspace-step-3">
                        <Field label="Full Name" required><Input value={personal.full_name} onChange={e=>setPersonal(p=>({...p,full_name:e.target.value}))} className="h-10 bg-slate-900 border-slate-800 rounded-lg"/></Field>
                        <Field label="Phone (WhatsApp)" required><Input value={personal.phone} onChange={e=>setPersonal(p=>({...p,phone:e.target.value}))} className="h-10 bg-slate-900 border-slate-800 rounded-lg"/></Field>
                        <Field label="Date of Birth"><Input type="date" value={personal.dob} onChange={e=>setPersonal(p=>({...p,dob:e.target.value}))} className="h-10 bg-slate-900 border-slate-800 rounded-lg text-white"/></Field>
                        <Field label="Category">
                          <Select value={personal.category} onValueChange={v=>setPersonal(p=>({...p,category:v}))}>
                            <SelectTrigger className="h-10 bg-slate-900 border-slate-800 rounded-lg"><SelectValue /></SelectTrigger>
                            <SelectContent>{CATEGORIES.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                        </Field>
                        <Field label="District">
                          <Select value={personal.district} onValueChange={v=>setPersonal(p=>({...p,district:v}))}>
                            <SelectTrigger className="h-10 bg-slate-900 border-slate-800 rounded-lg"><SelectValue /></SelectTrigger>
                            <SelectContent>{MAHARASHTRA_DISTRICTS.map(d=><SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                          </Select>
                        </Field>
                        <Field label="Sub-Caste"><Input value={personal.caste} onChange={e=>setPersonal(p=>({...p,caste:e.target.value}))} className="h-10 bg-slate-900 border-slate-800 rounded-lg"/></Field>
                      </div>
                    )}

                    {/* Stage 4: Registration Info */}
                    {step === 4 && (
                      <div className="space-y-6 max-w-lg mx-auto py-4">
                        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Original Registration</h4>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Registered By</p>
                                <p className="text-sm font-bold text-white">{registeredBy}</p>
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Registration Date</p>
                                <p className="text-sm font-mono text-primary font-bold">{new Date(selectedStudent.created_at).toLocaleString()}</p>
                             </div>
                          </div>
                        </div>
                        
                        <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl space-y-5">
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">New Version Audit Log</h4>
                          <Field label="Updated By (Staff)" required>
                            <Select value={updatedById} onValueChange={setUpdatedById}>
                              <SelectTrigger className="h-10 bg-slate-900 border-slate-800"><SelectValue /></SelectTrigger>
                              <SelectContent>{staffList.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.role})</SelectItem>)}</SelectContent>
                            </Select>
                          </Field>
                          <Field label="Reason for this modification (What & Why?)" required>
                            <Textarea value={editReason} onChange={e=>setEditReason(e.target.value)} placeholder="e.g., Corrected payment UTR number" className="bg-slate-900 border-slate-800 min-h-[80px]" />
                          </Field>
                        </div>
                      </div>
                    )}

                    {/* Stage 5: Payment */}
                    {step === 5 && (
                      <div className="space-y-5 animate-in slide-in-from-bottom-2 fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field label="Updated Paid Amount (Rs.)"><Input type="number" value={payment.amount} onChange={e=>setPayment(p=>({...p,amount:e.target.value}))} className="h-10 bg-slate-900 border-slate-800 font-bold"/></Field>
                          <Field label="Pending Amount (Rs.)"><Input type="number" value={payment.pending_amount} onChange={e=>setPayment(p=>({...p,pending_amount:e.target.value}))} placeholder="0" className="h-10 bg-slate-900 border-slate-800" /></Field>
                          
                          <div className="col-span-1 sm:col-span-2 flex flex-col gap-2">
                             {!showConcession ? (
                               <Button type="button" variant="outline" className="w-fit border-dashed border-primary text-primary hover:bg-primary/10" onClick={() => setShowConcession(true)}>+ Provide Concession</Button>
                             ) : (
                               <Field label="Concession Amount (Rs.)"><Input value={payment.concession_amount} onChange={e=>setPayment(p=>({...p,concession_amount:e.target.value}))} type="number" placeholder="Enter concession discount" className="h-10 border-primary shadow-sm shadow-primary/20 bg-slate-900 text-white" /></Field>
                             )}
                          </div>

                          <Field label="Mode">
                            <Select value={payment.mode} onValueChange={v=>setPayment(p=>({...p,mode:v}))}>
                              <SelectTrigger className="h-10 bg-slate-900 border-slate-800"><SelectValue/></SelectTrigger>
                              <SelectContent><SelectItem value="CASH">Cash</SelectItem><SelectItem value="ONLINE">Online (UPI/IMPS)</SelectItem></SelectContent>
                            </Select>
                          </Field>
                          {payment.mode === "ONLINE" && <Field label="UTR No / Ref ID" required><Input value={payment.utr} onChange={e=>setPayment(p=>({...p,utr:e.target.value}))} className="h-10 bg-slate-900 border-slate-800" /></Field>}
                        </div>
                        <Field label="Notes"><Textarea value={payment.note} onChange={e=>setPayment(p=>({...p,note:e.target.value}))} className="bg-slate-900 border-slate-800 rounded-lg min-h-[100px]" /></Field>
                      </div>
                    )}

                    {/* Navigation Bar */}
                    <div className="flex justify-between mt-12 pt-6 border-t border-slate-800">
                      <Button variant="ghost" onClick={handleBack} disabled={step===0} className="text-slate-500 h-10 px-8 font-bold"><ArrowLeft className="w-4 h-4 mr-2"/>Back</Button>
                      {step < 5 ? (
                        <Button onClick={handleNext} className="h-10 px-10 rounded-lg font-black bg-white text-black hover:bg-white/90">Next Stage <ArrowRight className="w-4 h-4 ml-2"/></Button>
                      ) : (
                        <Button onClick={handleSubmit} disabled={saving} className="h-10 px-10 rounded-lg font-black bg-primary text-white shadow-lg shadow-primary/20">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>} Sync & Update to Version {history.length + 1}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="m-0 space-y-4">
                {history.length === 0 ? <div className="p-12 text-center text-slate-500 italic">No snapshots saved.</div> : (
                  <div className="space-y-4">
                    {history.map(v => (
                      <Card key={v.id} className={`border-slate-800 bg-slate-900/40 relative overflow-hidden ${v.version === Math.max(...history.map(h=>h.version)) ? "border-l-4 border-l-primary" : ""}`}>
                        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                           <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center min-w-[56px]">
                              <span className="text-[10px] font-black text-slate-500 leading-none mb-1">V</span>
                              <span className="text-xl font-black text-white leading-none">{v.version}</span>
                           </div>
                           <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                 <h5 className="font-bold text-sm text-white">{v.snapshot.selection_display}</h5>
                                 <Badge variant="outline" className="text-[9px] py-0 border-slate-700 bg-slate-800 text-slate-400">Edited by {staffList.find(s=>s.id === (v.snapshot.updated_by_id || v.edited_by))?.name || "Staff"}</Badge>
                              </div>
                              {v.snapshot.edit_reason && (
                                <p className="text-[11px] text-slate-400 bg-black/20 p-2 rounded-lg border border-slate-800/50">
                                   <span className="text-slate-500 font-bold mr-1">Note:</span> {v.snapshot.edit_reason}
                                </p>
                              )}
                              <p className="text-[10px] font-medium text-slate-500">{new Date(v.created_at).toLocaleString()}</p>
                           </div>
                           <div className="flex gap-2">
                             <Button variant="outline" size="sm" onClick={() => setViewReceiptData(v)} className="h-9 px-4 border-slate-700 hover:text-white font-black text-[11px] gap-2"><Eye className="w-3.5 h-3.5" /> View Mode</Button>
                             <Button variant="outline" size="sm" onClick={() => handlePrintVersion(v)} className="h-9 px-4 border-primary/50 text-primary hover:bg-primary hover:text-white font-black text-[11px] gap-2"><Printer className="w-3.5 h-3.5" /> Print Receipt</Button>
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {!selectedStudent && searchResults.length === 0 && (
         <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl p-32 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"><History className="w-8 h-8 text-slate-600" /></div>
            <h3 className="text-xl font-bold text-slate-400">Workspace Pending</h3>
            <p className="text-slate-600 text-sm mt-2">Find a student above to start the configuration manager.</p>
         </div>
      )}

      {/* View Only Receipt Modal */}
      <Dialog open={!!viewReceiptData} onOpenChange={(o) => { if(!o) setViewReceiptData(null); }}>
        <DialogContent className="max-w-xl bg-slate-900 border-slate-800 text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Registration Receipt Snapshot - v{viewReceiptData?.version}</DialogTitle>
          </DialogHeader>
          {viewReceiptData && (
            <div className="space-y-4">
              {/* Receipt Visual */}
              <div ref={receiptRef} className="bg-white text-black p-8 rounded-xl shadow-inner text-sm space-y-4 border border-slate-300">
                <div className="text-center pb-4 mb-4 border-b-2 border-slate-800">
                  <h2 className="font-black text-2xl uppercase tracking-wider text-slate-900">Registration Receipt</h2>
                  <p className="text-slate-500 text-xs mt-1">Record Version: v{viewReceiptData.version} | Generated: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">Registration No</span><span className="font-bold text-slate-800">{selectedStudent.registration_no}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">Date & Time</span><span className="font-bold text-slate-800">{new Date(viewReceiptData.created_at).toLocaleString()}</span></div>
                  
                  <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">Student Name</span><span className="font-bold text-slate-800">{viewReceiptData.snapshot.full_name}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">Date of Birth</span><span className="font-bold text-slate-800">{viewReceiptData.snapshot.dob || "-"}</span></div>
                  
                  <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">Student Phone</span><span className="font-bold text-slate-800">{viewReceiptData.snapshot.phone}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">Parent Phone</span><span className="font-bold text-slate-800">{viewReceiptData.snapshot.parent_phone}</span></div>
                  
                  <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">Gender</span><span className="font-bold text-slate-800">{viewReceiptData.snapshot.gender}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">District</span><span className="font-bold text-slate-800">{viewReceiptData.snapshot.district || "-"}</span></div>
                  
                  <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">Category / Caste</span><span className="font-bold text-slate-800">{viewReceiptData.snapshot.category} {viewReceiptData.snapshot.caste ? `(${viewReceiptData.snapshot.caste})` : ""}</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">Status / Res.</span><span className="font-bold text-slate-800">{viewReceiptData.snapshot.fresher_repeater} | {viewReceiptData.snapshot.special_reservation !== "None" ? viewReceiptData.snapshot.special_reservation : "No Res."}</span></div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">Counselling Details</h3>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="font-bold text-sm text-slate-900">{viewReceiptData.snapshot.selection_display}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">Amount Paid</span><span className="font-bold text-slate-800">Rs. {viewReceiptData.snapshot.payment_amount || 0}</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500 font-medium text-xs">Payment Mode</span><span className="font-bold text-slate-800">{viewReceiptData.snapshot.payment_mode}</span></div>
                    {viewReceiptData.snapshot.utr_number && <div className="flex justify-between py-1 border-b border-slate-100 col-span-2"><span className="text-slate-500 font-medium text-xs">Transaction / UTR</span><span className="font-mono font-bold text-slate-800">{viewReceiptData.snapshot.utr_number}</span></div>}
                    {viewReceiptData.snapshot.payment_note && <div className="flex flex-col py-1 border-b border-slate-100 col-span-2"><span className="text-slate-500 font-medium text-xs mb-1">Payment Note</span><span className="italic text-slate-700 text-xs">{viewReceiptData.snapshot.payment_note}</span></div>}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">Audit & Tracking</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <div className="flex justify-between py-1 border-b border-slate-100 col-span-2"><span className="text-slate-500 font-medium text-xs">Processed By (Staff)</span><span className="font-bold text-slate-800">{viewReceiptData.snapshot.registered_by}</span></div>
                    {viewReceiptData.snapshot.edit_reason && (
                      <div className="flex flex-col py-2 border border-blue-100 bg-blue-50 px-3 rounded text-blue-900 col-span-2">
                        <span className="font-bold text-xs uppercase mb-1">Reason for v{viewReceiptData.version} Update</span>
                        <span className="text-xs">{viewReceiptData.snapshot.edit_reason}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 mt-6 pt-4 border-t border-slate-200">
                  This is a system-generated receipt. Record version v{viewReceiptData.version}
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="ghost" onClick={() => setViewReceiptData(null)}>Close</Button>
                <Button onClick={handlePrintLocal} className="font-bold"><Printer className="w-4 h-4 mr-2"/> Print from View</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
