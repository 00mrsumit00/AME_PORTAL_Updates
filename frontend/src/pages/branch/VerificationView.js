import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Loader2, FileText, Eye, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const buildVerificationSections = (student) => {
  if (!student) return [];

  const additional = student.additional_details || {};
  const address = student.address_details || {};
  const tenth = student.education_10th || {};
  const eleventh = student.education_11th || {};
  const twelfth = student.education_12th || {};
  const parent = student.parent_details || {};

  return [
    {
      key: "personal",
      title: "Personal Information",
      fields: [
        { key: "full_name", label: "Full Name", value: student.full_name },
        { key: "phone", label: "Phone", value: student.phone },
        { key: "parent_phone", label: "Parent Phone", value: student.parent_phone },
        { key: "gender", label: "Gender", value: student.gender },
        { key: "dob", label: "Date of Birth", value: student.dob },
        { key: "district", label: "District", value: student.district },
        { key: "category", label: "Category", value: student.category },
        { key: "caste", label: "Caste", value: student.caste },
        { key: "special_reservation", label: "Special Reservation", value: student.special_reservation },
        { key: "fresher_repeater", label: "Fresher / Repeater", value: student.fresher_repeater },
        { key: "selection_display", label: "Selection", value: student.selection_display },
        { key: "registered_by", label: "Registered By", value: student.registered_by },
      ],
    },
    {
      key: "additional",
      title: "Additional & Address Details",
      fields: [
        { key: "mother_name", label: "Mother's Name", value: additional.mother_name },
        { key: "email", label: "Email", value: additional.email },
        { key: "religion", label: "Religion", value: additional.religion },
        { key: "family_income", label: "Family Income", value: additional.family_income },
        { key: "aadhaar_number", label: "Aadhaar Number", value: additional.aadhaar_number },
        { key: "address", label: "Address", value: additional.address },
        { key: "taluka", label: "Taluka", value: address.taluka },
        { key: "address_district", label: "Address District", value: address.district },
        { key: "pin_code", label: "PIN Code", value: address.pin_code },
      ],
    },
    {
      key: "academic",
      title: "Academic Details",
      fields: [
        { key: "edu_10_board", label: "10th Board", value: tenth.board },
        { key: "edu_10_percentage", label: "10th Percentage", value: tenth.percentage },
        { key: "edu_10_school", label: "10th School", value: tenth.school },
        { key: "edu_10_roll", label: "10th Roll No", value: tenth.roll },
        { key: "edu_11_board", label: "11th Board", value: eleventh.board },
        { key: "edu_11_percentage", label: "11th Percentage", value: eleventh.percentage },
        { key: "edu_11_college", label: "11th College", value: eleventh.college },
        { key: "edu_12_board", label: "12th Board", value: twelfth.board },
        { key: "edu_12_percentage", label: "12th Percentage", value: twelfth.percentage },
        { key: "edu_12_college", label: "12th College", value: twelfth.college },
        { key: "edu_12_roll", label: "12th Roll No", value: twelfth.roll },
      ],
    },
    {
      key: "parent",
      title: "Parent Details",
      fields: [
        { key: "father_occupation", label: "Father Occupation", value: parent.father_occupation },
        { key: "father_qualification", label: "Father Qualification", value: parent.father_qualification },
        { key: "mother_occupation", label: "Mother Occupation", value: parent.mother_occupation },
        { key: "mother_qualification", label: "Mother Qualification", value: parent.mother_qualification },
      ],
    },
  ].map((section) => ({ ...section, fields: section.fields.filter((field) => field.value) }));
};

export default function VerificationView() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decisions, setDecisions] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/branch/verification/${studentId}`)
      .then((r) => {
        setData(r.data);
        const init = {};
        buildVerificationSections(r.data.student).forEach((section) => {
          section.fields.forEach((field) => {
            init[field.key] = { decision: "", comment: "" };
          });
        });
        r.data.documents?.filter((document) => document.file_url).forEach((document) => {
          init[`doc_${document.document_type.toLowerCase().replace(/\s/g, "_")}`] = { decision: "", comment: "" };
        });
        setDecisions(init);
      })
      .catch(() => toast.error("Failed to load student"))
      .finally(() => setLoading(false));
  }, [studentId]);

  const setDecision = (key, field, value) => {
    setDecisions((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleSubmit = async () => {
    const entries = Object.entries(decisions);
    const incomplete = entries.filter(([, v]) => !v.decision);
    if (incomplete.length > 0) {
      toast.error(`Please review all ${incomplete.length} remaining fields`);
      return;
    }
    const incorrectNoComment = entries.filter(([, v]) => v.decision === "INCORRECT" && !v.comment);
    if (incorrectNoComment.length > 0) {
      toast.error("Comments required for all incorrect fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { decisions: entries.map(([key, v]) => ({ field_name: key, decision: v.decision, comment: v.comment })) };
      const res = await api.post(`/branch/verification/${studentId}`, payload);
      toast.success(res.data.message);
      navigate("/branch/verification");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!data) return null;

  const { student, documents, previous_logs } = data;
  const sections = buildVerificationSections(student).filter((section) => section.fields.length > 0);
  const allReviewed = Object.values(decisions).every((d) => d.decision);
  const correctCount = Object.values(decisions).filter((d) => d.decision === "CORRECT").length;
  const incorrectCount = Object.values(decisions).filter((d) => d.decision === "INCORRECT").length;
  const totalFields = Object.keys(decisions).length;

  return (
    <div className="space-y-6" data-testid="verification-view">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/branch/verification")} data-testid="back-btn">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Verify: {student.full_name}</h2>
          <p className="text-sm text-muted-foreground">{student.registration_no} | {student.counselling_type}</p>
        </div>
        <Badge variant="outline" className="ml-auto border-primary/20 bg-primary/5 text-primary" data-testid="verification-total-fields">
          {totalFields} checkpoints
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 text-sm" data-testid="verification-progress">
        <span className="text-muted-foreground">Progress:</span>
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${totalFields ? ((correctCount + incorrectCount) / totalFields) * 100 : 0}%` }} />
        </div>
        <span className="text-foreground font-medium">{correctCount + incorrectCount}/{totalFields}</span>
      </div>

      {sections.map((section) => (
        <Card key={section.key} className="border-border bg-card" data-testid={`verification-section-${section.key}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.fields.map((field) => (
              <div key={field.key} className="flex flex-wrap items-center gap-3 border-b border-border/50 py-3 last:border-0" data-testid={`field-${field.key}`}>
                <div className="min-w-[220px] flex-1">
                  <p className="text-xs text-muted-foreground">{field.label}</p>
                  <p className="text-sm font-medium text-foreground">{field.value}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={decisions[field.key]?.decision === "CORRECT" ? "default" : "outline"}
                    className={decisions[field.key]?.decision === "CORRECT" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    onClick={() => setDecision(field.key, "decision", "CORRECT")}
                    data-testid={`correct-${field.key}`}
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" /> Correct
                  </Button>
                  <Button
                    size="sm"
                    variant={decisions[field.key]?.decision === "INCORRECT" ? "destructive" : "outline"}
                    onClick={() => setDecision(field.key, "decision", "INCORRECT")}
                    data-testid={`incorrect-${field.key}`}
                  >
                    <XCircle className="mr-1 h-4 w-4" /> Incorrect
                  </Button>
                </div>
                {decisions[field.key]?.decision === "INCORRECT" && (
                  <div className="mt-2 w-full">
                    <Textarea
                      placeholder="Comment required for incorrect fields..."
                      value={decisions[field.key]?.comment || ""}
                      onChange={(event) => setDecision(field.key, "comment", event.target.value)}
                      className="min-h-[60px] border-border bg-background text-sm"
                      data-testid={`comment-${field.key}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Documents */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Documents</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {documents?.map((doc) => {
            const docKey = `doc_${doc.document_type.toLowerCase().replace(/\s/g, "_")}`;
            return (
              <div key={doc.id} className="flex flex-wrap items-center gap-3 py-3 border-b border-border/50 last:border-0" data-testid={`doc-field-${doc.id}`}>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">{doc.document_type}</p>
                  </div>
                  {doc.file_url ? (
                    <a href={`${process.env.REACT_APP_BACKEND_URL}${doc.file_url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                      <Eye className="w-3 h-3" /> View Document
                    </a>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">Not uploaded — this item is skipped until a file is available.</p>
                  )}
                </div>
                {doc.file_url && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm" variant={decisions[docKey]?.decision === "CORRECT" ? "default" : "outline"}
                      className={decisions[docKey]?.decision === "CORRECT" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                      onClick={() => setDecision(docKey, "decision", "CORRECT")}
                      data-testid={`correct-${docKey}`}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Correct
                    </Button>
                    <Button
                      size="sm" variant={decisions[docKey]?.decision === "INCORRECT" ? "destructive" : "outline"}
                      onClick={() => setDecision(docKey, "decision", "INCORRECT")}
                      data-testid={`incorrect-${docKey}`}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Incorrect
                    </Button>
                  </div>
                )}
                {decisions[docKey]?.decision === "INCORRECT" && (
                  <div className="w-full mt-2">
                    <Textarea
                      placeholder="Reason for rejection..."
                      value={decisions[docKey]?.comment || ""}
                      onChange={(e) => setDecision(docKey, "comment", e.target.value)}
                      className="bg-background border-border text-sm min-h-[60px]"
                      data-testid={`comment-${docKey}`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {previous_logs?.length > 0 && (
        <Card className="border-border bg-card" data-testid="verification-history-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Previous Verification History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {previous_logs.slice(0, 12).map((log) => (
              <div key={log.id} className="rounded-xl border border-border bg-background/40 p-4" data-testid={`verification-log-${log.id}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{log.field_name}</p>
                    <p className="text-xs text-muted-foreground">{log.verifier_name || "Verifier"} · {log.created_at ? new Date(log.created_at).toLocaleString() : "—"}</p>
                  </div>
                  <Badge variant="outline" className={log.decision === "CORRECT" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                    {log.decision}
                  </Badge>
                </div>
                {log.comment && <p className="mt-2 text-sm text-muted-foreground">{log.comment}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary & Submit */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-4 text-sm">
              <span className="text-emerald-400">{correctCount} Correct</span>
              <span className="text-destructive">{incorrectCount} Incorrect</span>
              <span className="text-muted-foreground">{totalFields - correctCount - incorrectCount} Remaining</span>
            </div>
            <Button onClick={handleSubmit} disabled={!allReviewed || submitting || totalFields === 0} data-testid="submit-verification-btn">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              {submitting ? "Submitting..." : "Submit Verification"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
