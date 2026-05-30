import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Cog, GraduationCap, ArrowLeft, ArrowRight, Check, Loader2, Printer, Upload, FileDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

export default function RegisterStudent() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const navigate = useNavigate();
  const receiptRef = useRef(null);

  // Form state
  const [counsellingType, setCounsellingType] = useState("");
  const [medSelections, setMedSelections] = useState([]);
  const [engType, setEngType] = useState("");
  const [branchPriority, setBranchPriority] = useState("");
  const [personal, setPersonal] = useState({ full_name: "", phone: "", parent_phone: "", gender: "", dob: "", district: "", category: "", caste: "", special_reservation: "None", fresher_repeater: "Fresher" });
  const [registeredBy, setRegisteredBy] = useState("");
  const [registeredById, setRegisteredById] = useState("");
  const [payment, setPayment] = useState({ amount: "", pending_amount: "", concession_amount: "", mode: "CASH", utr: "", note: "" });
  const [showConcession, setShowConcession] = useState(false);

  // Bulk Import State
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get("/branch/staff-list").then(r => setStaffList(r.data)).catch(() => {});
  }, []);

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
    return true;
  };

  const handleNext = () => { if (validateStep()) setStep(s => Math.min(s + 1, 5)); };
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
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
        utr_number: payment.utr, payment_note: payment.note
      };
      const res = await api.post("/branch/students/register", payload);
      setResult(res.data);
      toast.success("Student registered successfully!");
    } catch (err) { toast.error(err.response?.data?.detail || "Registration failed"); }
    finally { setLoading(false); }
  };

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Receipt</title><style>body{font-family:Arial,sans-serif;padding:30px;color:#222}h2{text-align:center;border-bottom:2px solid #333;padding-bottom:10px}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee}.label{color:#666;font-size:14px}.val{font-weight:600;font-size:14px}.header{text-align:center;margin-bottom:20px}.footer{margin-top:30px;text-align:center;color:#666;font-size:12px}</style></head><body>${printContent.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) { toast.error("Please select a CSV file"); return; }

    const formData = new FormData();
    formData.append("file", file);
    setImporting(true);
    setImportResult(null);

    try {
      const res = await api.post("/branch/students/bulk-import", formData);
      setImportResult(res.data);
      if (res.data.success_count > 0) {
        toast.success(`Successfully imported ${res.data.success_count} students!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Import failed");
    } finally {
      setImporting(false);
      e.target.value = ''; // Reset file input
    }
  };

  const downloadTemplate = () => {
    const headers = "full_name,phone,parent_phone,gender,dob,district,category,caste,special_reservation,fresher_repeater,counselling_type,medical_selections,engineering_type,branch_priority,payment_amount,pending_amount,concession_amount,payment_mode,utr_number,payment_note";
    const sample = "\nSudhir Patil,9876543210,9876543211,Male,20/05/2005,Pune,OBC,Maratha,None,Fresher,MEDICAL,State Quota|MBBS|Maharashtra, , ,5000,2000,500,CASH,,Paid partially";
    
    const blob = new Blob([headers + sample], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_registration_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (result) {
    const s = result.student;
    const p = payment;
    return (
      <div className="max-w-2xl mx-auto space-y-6" data-testid="registration-success">
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Registration Successful</h3>
            <p className="text-muted-foreground text-sm mb-6">Student has been registered. Share the credentials below.</p>
            <div className="bg-background rounded-lg p-4 text-left space-y-2 mb-6">
              <p className="text-sm"><span className="text-muted-foreground">Reg No:</span> <span className="font-semibold text-primary">{s.registration_no}</span></p>
              <p className="text-sm"><span className="text-muted-foreground">Name:</span> <span className="font-medium">{s.full_name}</span></p>
              <p className="text-sm"><span className="text-muted-foreground">Login Email:</span> <span className="font-mono text-primary">{result.credentials.email}</span></p>
              <p className="text-sm"><span className="text-muted-foreground">Password:</span> <span className="font-mono">{result.credentials.password}</span></p>
            </div>
            {/* Printable Receipt */}
            <div ref={receiptRef} className="hidden">
              <div className="header"><h2>Counselling Registration Receipt</h2></div>
              <div className="row"><span className="label">Registration Number</span><span className="val">{s.registration_no}</span></div>
              <div className="row"><span className="label">Student Name</span><span className="val">{s.full_name}</span></div>
              <div className="row"><span className="label">Student WhatsApp</span><span className="val">{s.phone}</span></div>
              <div className="row"><span className="label">Parent WhatsApp</span><span className="val">{s.parent_phone}</span></div>
              <div className="row"><span className="label">Category</span><span className="val">{s.category}</span></div>
              {s.special_reservation && s.special_reservation !== "None" && <div className="row"><span className="label">Special Reservation</span><span className="val">{s.special_reservation}</span></div>}
              <div className="row"><span className="label">Counselling Type</span><span className="val">{s.selection_display}</span></div>
              <div className="row"><span className="label">Amount Paid</span><span className="val">Rs. {parseFloat(p.amount) || 0}</span></div>
              <div className="row"><span className="label">Payment Mode</span><span className="val">{p.mode}</span></div>
              {p.mode === "ONLINE" && p.utr && <div className="row"><span className="label">UTR Number</span><span className="val">{p.utr}</span></div>}
              <div className="row"><span className="label">Date & Time</span><span className="val">{new Date(s.created_at).toLocaleString()}</span></div>
              <div className="row"><span className="label">Registered By</span><span className="val">Cashier / Accountant - {s.registered_by}</span></div>
              <div className="footer">This is a system-generated receipt.</div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setResult(null); setStep(0); setCounsellingType(""); setMedSelections([]); setEngType(""); setBranchPriority(""); setPersonal({ full_name:"",phone:"",parent_phone:"",gender:"",dob:"",district:"",category:"",caste:"",special_reservation:"None",fresher_repeater:"Fresher" }); setPayment({amount:0,mode:"CASH",utr:"",note:""}); }} data-testid="register-another-btn">Register Another</Button>
              <Button variant="outline" className="flex-1" onClick={handlePrint} data-testid="print-receipt-btn"><Printer className="w-4 h-4 mr-1" />Print Receipt</Button>
              <Button className="flex-1" onClick={() => navigate("/branch/students")} data-testid="view-students-btn">View Students</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="register-student">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Register New Student</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete all steps to register</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10" onClick={() => setShowBulkImport(true)} data-testid="bulk-import-btn">
            <Upload className="w-4 h-4 mr-2" /> Bulk Upload CSV
          </Button>
        </div>
      </div>
      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2" data-testid="step-indicator">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <button onClick={() => i < step && setStep(i)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${i === step ? "step-active" : i < step ? "step-done" : "step-pending"}`}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">{i < step ? <Check className="w-3 h-3" /> : i+1}</span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-border mx-1" />}
          </div>
        ))}
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3"><CardTitle className="text-lg font-semibold">{STEPS[step]}</CardTitle></CardHeader>
        <CardContent>
          {/* Step 0: Counselling Type */}
          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-testid="step-counselling-type">
              {[{type:"MEDICAL",label:"Medical",sub:"NEET Counselling",icon:Stethoscope},{type:"ENGINEERING",label:"Engineering",sub:"CET/JOSSA",icon:Cog},{type:"DSE",label:"DSE",sub:"Diploma to Engineering",icon:GraduationCap}].map(opt=>(
                <button key={opt.type} onClick={()=>setCounsellingType(opt.type)} data-testid={`type-${opt.type.toLowerCase()}`} className={`p-6 rounded-xl border-2 text-center transition-all ${counsellingType===opt.type?"border-primary bg-primary/5":"border-border hover:border-primary/50"}`}>
                  <opt.icon className={`w-8 h-8 mx-auto mb-3 ${counsellingType===opt.type?"text-primary":"text-muted-foreground"}`}/><p className="font-semibold">{opt.label}</p><p className="text-xs text-muted-foreground mt-1">{opt.sub}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Stream Details */}
          {step === 1 && (
            <div className="space-y-5" data-testid="step-stream-details">
              {counsellingType === "MEDICAL" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Select counselling type(s):</p>
                  <div className="flex flex-wrap gap-2">
                    {MED_TYPES.map(t => <ToggleChip key={t} selected={medSelections.some(s=>s.type===t)} onClick={()=>toggleMedType(t)}>{t}</ToggleChip>)}
                  </div>
                  {medSelections.map(sel => (
                    <div key={sel.type} className="bg-background rounded-lg p-4 border border-border space-y-3">
                      <p className="text-sm font-semibold text-primary">{sel.type}</p>
                      {MED_COURSES[sel.type] && MED_COURSES[sel.type].length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Select course(s):</p>
                          <div className="flex flex-wrap gap-2">{MED_COURSES[sel.type].map(c => <ToggleChip key={c} selected={sel.courses.includes(c)} onClick={()=>toggleMedCourse(sel.type,c)}>{c}</ToggleChip>)}</div>
                        </div>
                      )}
                      {sel.type === "Other State" && sel.courses.includes("MBBS") && (
                        <div><p className="text-xs text-muted-foreground mb-2">Select state(s) for MBBS:</p><div className="flex flex-wrap gap-2">{OTHER_MBBS_STATES.map(st => <ToggleChip key={st} selected={sel.states.includes(st)} onClick={()=>toggleMedState(sel.type,st)}>{st}</ToggleChip>)}</div></div>
                      )}
                      {sel.type === "Other State" && sel.courses.includes("BAMS") && (
                        <div><p className="text-xs text-muted-foreground mb-2">Select state(s) for BAMS:</p><div className="flex flex-wrap gap-2">{OTHER_BAMS_STATES.map(st => <ToggleChip key={st} selected={sel.states.includes(st)} onClick={()=>toggleMedState(sel.type,st)}>{st}</ToggleChip>)}</div></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {counsellingType === "ENGINEERING" && (
                <div className="space-y-4">
                  <Field label="Counselling Type" required>
                    <div className="flex gap-3">
                      {["JOSSA","State Counselling"].map(t=>(
                        <button key={t} onClick={()=>setEngType(t)} className={`flex-1 p-4 rounded-xl border-2 text-center text-sm font-medium transition-all ${engType===t?"border-primary bg-primary/5 text-primary":"border-border hover:border-primary/50 text-muted-foreground"}`}>{t}</button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Branch Priority"><Textarea value={branchPriority} onChange={e=>setBranchPriority(e.target.value)} placeholder="Enter branch priorities" className="bg-background border-border min-h-[100px]" data-testid="branch-priority-input"/></Field>
                </div>
              )}
              {counsellingType === "DSE" && (
                <Field label="Branch Priority"><Textarea value={branchPriority} onChange={e=>setBranchPriority(e.target.value)} placeholder="Enter branch priorities" className="bg-background border-border min-h-[100px]" data-testid="dse-branch-priority-input"/></Field>
              )}
            </div>
          )}

          {/* Step 2: Selection Summary */}
          {step === 2 && (
            <div className="space-y-4" data-testid="step-summary">
              <div className="bg-background rounded-xl p-6 border border-border">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Your Selection</h4>
                <p className="text-lg font-bold text-primary">{buildSelectionDisplay()}</p>
                {counsellingType === "MEDICAL" && medSelections.map(s => (
                  <div key={s.type} className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">{s.type}</Badge>
                    {s.courses.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                    {s.states.map(st => <Badge key={st} variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{st}</Badge>)}
                  </div>
                ))}
                {counsellingType === "ENGINEERING" && <div className="mt-3"><Badge variant="outline" className="text-xs border-primary/30 text-primary">{engType}</Badge>{branchPriority && <p className="text-sm text-muted-foreground mt-2">Priority: {branchPriority}</p>}</div>}
                {counsellingType === "DSE" && branchPriority && <p className="text-sm text-muted-foreground mt-3">Priority: {branchPriority}</p>}
              </div>
              <p className="text-xs text-muted-foreground text-center">Confirm the above selection to proceed. Use Back to modify.</p>
            </div>
          )}

          {/* Step 3: Personal Details */}
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="step-personal">
              <Field label="Full Name (Surname, Name, Father Name)" required><Input value={personal.full_name} onChange={e=>setPersonal(p=>({...p,full_name:e.target.value}))} placeholder="Surname Name Father Name" className="h-10 bg-background border-border" data-testid="full-name-input"/></Field>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Fresher / Repeater <span className="text-destructive">*</span></Label>
                <div className="flex gap-3">
                  {["Fresher","Repeater"].map(v=>(<button key={v} onClick={()=>setPersonal(p=>({...p,fresher_repeater:v}))} className={`flex-1 h-10 rounded-lg border text-sm font-medium transition-all ${personal.fresher_repeater===v?"border-primary bg-primary/5 text-primary":"border-border text-muted-foreground hover:border-primary/50"}`}>{v}</button>))}
                </div>
              </div>
              <Field label="Gender" required>
                <Select value={personal.gender} onValueChange={v=>setPersonal(p=>({...p,gender:v}))}>
                  <SelectTrigger className="h-10 bg-background border-border" data-testid="gender-select"><SelectValue placeholder="Select"/></SelectTrigger>
                  <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="Date of Birth"><Input type="date" value={personal.dob} onChange={e=>setPersonal(p=>({...p,dob:e.target.value}))} className="h-10 bg-background border-border" data-testid="dob-input"/></Field>
              <Field label="Locality (District)">
                <Select value={personal.district} onValueChange={v=>setPersonal(p=>({...p,district:v}))}>
                  <SelectTrigger className="h-10 bg-background border-border" data-testid="district-select"><SelectValue placeholder="Select district"/></SelectTrigger>
                  <SelectContent>{MAHARASHTRA_DISTRICTS.map(d=><SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Student WhatsApp Number" required><Input value={personal.phone} onChange={e=>setPersonal(p=>({...p,phone:e.target.value}))} placeholder="10-digit WhatsApp" className="h-10 bg-background border-border" data-testid="phone-input"/></Field>
              <Field label="Parent WhatsApp Number"><Input value={personal.parent_phone} onChange={e=>setPersonal(p=>({...p,parent_phone:e.target.value}))} placeholder="Parent WhatsApp" className="h-10 bg-background border-border" data-testid="parent-phone-input"/></Field>
              <Field label="Category">
                <Select value={personal.category} onValueChange={v=>setPersonal(p=>({...p,category:v}))}>
                  <SelectTrigger className="h-10 bg-background border-border" data-testid="category-select"><SelectValue placeholder="Select category"/></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Caste (optional)"><Input value={personal.caste} onChange={e=>setPersonal(p=>({...p,caste:e.target.value}))} placeholder="Caste" className="h-10 bg-background border-border" data-testid="caste-input"/></Field>
              <Field label="Special Reservation">
                <Select value={personal.special_reservation} onValueChange={v=>setPersonal(p=>({...p,special_reservation:v}))}>
                  <SelectTrigger className="h-10 bg-background border-border" data-testid="reservation-select"><SelectValue/></SelectTrigger>
                  <SelectContent>{SPECIAL_RES.map(r=><SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
          )}

          {/* Step 4: Registration Info */}
          {step === 4 && (
            <div className="space-y-4" data-testid="step-reg-info">
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">Date & Time of Registration</p>
                <p className="text-sm font-medium text-foreground">{new Date().toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Auto-captured, non-editable</p>
              </div>
              <Field label="Student Registered By" required>
                <Select value={registeredById} onValueChange={v => { setRegisteredById(v); const s = staffList.find(st => st.id === v); if (s) setRegisteredBy(s.name); }}>
                  <SelectTrigger className="h-10 bg-background border-border" data-testid="registered-by-select"><SelectValue placeholder="Select staff member"/></SelectTrigger>
                  <SelectContent>{staffList.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.role})</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
          )}

          {/* Step 5: Payment */}
          {step === 5 && (
            <div className="space-y-4" data-testid="step-payment">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Amount Paid (Rs.)"><Input value={payment.amount} onChange={e=>setPayment(p=>({...p,amount:e.target.value}))} type="number" placeholder="0" className="h-10 bg-background border-border" data-testid="payment-amount-input"/></Field>
                <Field label="Pending Amount (Rs.)"><Input value={payment.pending_amount} onChange={e=>setPayment(p=>({...p,pending_amount:e.target.value}))} type="number" placeholder="0" className="h-10 bg-background border-border" data-testid="payment-pending-input"/></Field>
                
                <div className="col-span-1 sm:col-span-2 flex flex-col gap-2">
                   {!showConcession ? (
                     <Button type="button" variant="outline" className="w-fit border-dashed border-primary text-primary hover:bg-primary/10" onClick={() => setShowConcession(true)}>+ Provide Concession</Button>
                   ) : (
                     <Field label="Concession Amount (Rs.)"><Input value={payment.concession_amount} onChange={e=>setPayment(p=>({...p,concession_amount:e.target.value}))} type="number" placeholder="Enter concession discount" className="h-10 border-primary shadow-sm shadow-primary/20" data-testid="payment-concession-input"/></Field>
                   )}
                </div>

                <Field label="Payment Mode">
                  <Select value={payment.mode} onValueChange={v=>setPayment(p=>({...p,mode:v}))}>
                    <SelectTrigger className="h-10 bg-background border-border" data-testid="payment-mode-select"><SelectValue/></SelectTrigger>
                    <SelectContent><SelectItem value="CASH">Cash</SelectItem><SelectItem value="ONLINE">Online</SelectItem></SelectContent>
                  </Select>
                </Field>
                {payment.mode === "ONLINE" && (
                  <Field label="UTR Number" required><Input value={payment.utr} onChange={e=>setPayment(p=>({...p,utr:e.target.value}))} placeholder="Transaction reference" className="h-10 bg-background border-border" data-testid="utr-input"/></Field>
                )}
              </div>
              <Field label="Any Note (optional)"><Textarea value={payment.note} onChange={e=>setPayment(p=>({...p,note:e.target.value}))} placeholder="Optional note" className="bg-background border-border" data-testid="payment-note-input"/></Field>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleBack} disabled={step===0} data-testid="step-back-btn"><ArrowLeft className="w-4 h-4 mr-1"/>Back</Button>
            {step < 5 ? (
              <Button onClick={handleNext} data-testid="step-next-btn">Next<ArrowRight className="w-4 h-4 ml-1"/></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} data-testid="submit-registration-btn">
                {loading?<Loader2 className="w-4 h-4 animate-spin mr-1"/>:<Check className="w-4 h-4 mr-1"/>}{loading?"Registering...":"Register Student"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Import Modal */}
      <Dialog open={showBulkImport} onOpenChange={(val) => { if (!importing) setShowBulkImport(val); if (!val) setImportResult(null); }}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Bulk Student Registration</DialogTitle>
            <DialogDescription>Upload a CSV file to register multiple students at once.</DialogDescription>
          </DialogHeader>

          {!importResult ? (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-10 bg-background hover:border-primary/50 transition-all cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Click to select CSV file</p>
                <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB</p>
                <input type="file" ref={fileInputRef} onChange={handleBulkImport} className="hidden" accept=".csv" />
              </div>

              <div className="bg-primary/5 rounded-lg p-4 flex gap-3 items-start border border-primary/20">
                <FileDown className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Need a template?</p>
                  <p className="text-xs text-muted-foreground mb-3">Download the sample CSV file to ensure your data is formatted correctly.</p>
                  <Button variant="link" className="p-0 h-auto text-primary text-xs" onClick={downloadTemplate}>Download Template CSV</Button>
                </div>
              </div>

              {importing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Processing file...</span>
                    <span>Please wait</span>
                  </div>
                  <Progress value={80} className="h-1.5 animate-pulse" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-500">{importResult.success_count}</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-500/80">Success</p>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-rose-500">{importResult.failed_count}</p>
                  <p className="text-[10px] uppercase font-bold text-rose-500/80">Failed</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="max-h-[200px] overflow-y-auto border border-border rounded-lg bg-background p-3">
                  <p className="text-xs font-bold text-rose-500 mb-2 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Import Errors
                  </p>
                  <ul className="space-y-1">
                    {importResult.errors.map((err, i) => (
                      <li key={i} className="text-[10px] text-muted-foreground flex gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {importResult.success_count > 0 && (
                <Alert className="bg-emerald-500/5 border-emerald-500/20">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <AlertTitle className="text-emerald-500">Done!</AlertTitle>
                  <AlertDescription className="text-[11px]">Successfully registered students. You can find them in the student list.</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowBulkImport(false); if (importResult?.success_count > 0) navigate("/branch/students"); }} disabled={importing}>
              {importResult ? "Close and View Students" : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
