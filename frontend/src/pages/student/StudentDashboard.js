import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProfileCompletion } from "@/lib/studentDetails";
import { CheckCircle2, FileText, AlertTriangle, Loader2, User, BookOpen, Stethoscope, Cog, GraduationCap, ArrowRight, MessageCircle, ShieldCheck, Wallet, Bell, Building2 } from "lucide-react";
import { toast } from "sonner";

const STATUS_STEPS = [
  { key: "REGISTERED", label: "Registered", icon: User },
  { key: "DOCS_UPLOADED", label: "Documents Uploaded", icon: FileText },
  { key: "VERIFIED", label: "Verified", icon: CheckCircle2 },
];

const TYPE_ICONS = { MEDICAL: Stethoscope, ENGINEERING: Cog, DSE: GraduationCap };

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState({ notifications: [], unread_count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const results = await Promise.allSettled([
          api.get("/student/dashboard"),
          api.get("/student/payments"),
          api.get("/student/notifications"),
        ]);

        if (results[0].status !== "fulfilled") throw new Error("dashboard");

        setData(results[0].value.data);
        if (results[1].status === "fulfilled") setPayments(results[1].value.data);
        if (results[2].status === "fulfilled") setNotifications(results[2].value.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!data) return null;

  const { profile, documents, branch } = data;
  const statusIndex = STATUS_STEPS.findIndex((s) => s.key === profile.status);
  const progressValue = profile.status === "VERIFIED" ? 100 : profile.status === "DOCS_UPLOADED" ? 66 : 33;
  const TypeIcon = TYPE_ICONS[profile.counselling_type] || BookOpen;
  const completion = getProfileCompletion(profile);
  const uploadedDocuments = documents?.filter((doc) => doc.file_url).length || 0;
  const correctionDocuments = documents?.filter((doc) => doc.status === "CORRECTION_REQUIRED").length || 0;
  const totalPayments = payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
  const summaryCards = [
    { label: "Profile completion", value: `${completion.percentage}%`, icon: ShieldCheck, tone: "text-primary", bg: "bg-primary/10", testId: "dashboard-completion-card" },
    { label: "Uploaded documents", value: `${uploadedDocuments}/${documents?.length || 0}`, icon: FileText, tone: "text-emerald-400", bg: "bg-emerald-500/10", testId: "dashboard-documents-card" },
    { label: "Total payments", value: `Rs. ${totalPayments.toLocaleString()}`, icon: Wallet, tone: "text-amber-400", bg: "bg-amber-500/10", testId: "dashboard-payments-card" },
    { label: "Unread updates", value: notifications.unread_count || 0, icon: Bell, tone: "text-sky-400", bg: "bg-sky-500/10", testId: "dashboard-notifications-card" },
  ];

  return (
    <div className="space-y-6" data-testid="student-dashboard">
      <Card className="overflow-hidden border-border bg-card" data-testid="student-dashboard-hero">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1604177091072-b7b677a077f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjb2xsZWdlJTIwc3R1ZGVudHxlbnwwfHx8fDE3NzM0MDQ4NTl8MA&ixlib=rb-4.1.0&q=85"
            alt="Student dashboard hero"
            className="h-64 w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-slate-950/80" />
          <CardContent className="absolute inset-0 flex flex-col justify-between p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary" data-testid="student-dashboard-registration-number">
                    {profile.registration_no}
                  </Badge>
                  <Badge variant="outline" className="border-white/15 bg-white/5 text-slate-200" data-testid="student-dashboard-counselling-type">
                    {profile.counselling_type}
                  </Badge>
                </div>
                <div>
                  <h2 className="text-4xl font-bold tracking-tight text-white">Welcome back, {profile.full_name.split(" ")[0]}</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-300">
                    Track verification, upload documents, and keep your profile complete so your admission workflow keeps moving without branch-side delays.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur" data-testid="student-dashboard-branch-support">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Assigned branch</p>
                <div className="mt-3 flex items-start gap-3">
                  <div className="rounded-xl bg-primary/10 p-2">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{branch?.name || "Branch pending"}</p>
                    <p className="text-xs text-slate-300">{branch?.location || "Location not available"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild data-testid="student-dashboard-profile-link">
                <Link to="/student/profile">
                  Update Profile <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" data-testid="student-dashboard-documents-link">
                <Link to="/student/documents">
                  Documents <FileText className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" data-testid="student-dashboard-chat-link">
                <Link to="/student/chat">
                  Chat Support <MessageCircle className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Alert banner */}
      {profile.verification_status === "CORRECTION_REQUIRED" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in" data-testid="correction-alert">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">Corrections Required</p>
            <p className="text-xs text-muted-foreground mt-0.5">Some documents or fields need corrections. Please check the Documents section.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="border-border bg-card" data-testid={card.testId}>
              <CardContent className="p-5">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.tone}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress tracker */}
      <Card className="border-border bg-card" data-testid="status-tracker">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressValue} className="h-2 mb-6" />
          <div className="flex justify-between">
            {STATUS_STEPS.map((step, i) => {
              const Icon = step.icon;
              const done = i <= statusIndex;
              const active = i === statusIndex;
              return (
                <div key={step.key} className="flex flex-col items-center text-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${done ? (active ? "bg-primary text-primary-foreground" : "bg-emerald-500/20 text-emerald-400") : "bg-secondary text-muted-foreground"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className={`text-xs font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        {/* Personal details */}
        <Card className="border-border bg-card" data-testid="personal-details-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Registration No", profile.registration_no],
              ["Full Name", profile.full_name],
              ["Phone", profile.phone],
              ["DOB", profile.dob],
              ["Gender", profile.gender],
              ["Category", profile.category],
              ["District", profile.district],
              ["Branch", branch?.name || "N/A"],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-foreground">{val || "—"}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-card" data-testid="student-dashboard-action-center">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Action Center</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Verification readiness
              </div>
              <p className="text-sm text-muted-foreground">
                {profile.has_additional_details
                  ? "Your extended profile is filled. Keep documents updated for smooth verification."
                  : "Your branch may ask for additional personal and academic details before verification completes."}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background/40 p-4" data-testid="student-dashboard-doc-summary">
              <p className="text-sm font-semibold text-foreground">Document health</p>
              <p className="mt-1 text-sm text-muted-foreground">{correctionDocuments > 0 ? `${correctionDocuments} document(s) need correction.` : "No document corrections pending right now."}</p>
            </div>

            <div className="rounded-xl border border-border bg-background/40 p-4" data-testid="student-dashboard-notification-summary">
              <p className="text-sm font-semibold text-foreground">Latest updates</p>
              <div className="mt-3 space-y-3">
                {notifications.notifications?.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="rounded-lg border border-border bg-card p-3" data-testid={`student-notification-${notification.id}`}>
                    <p className="text-sm font-medium text-foreground">{notification.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
                  </div>
                ))}
                {notifications.notifications?.length === 0 && <p className="text-sm text-muted-foreground">No recent notifications yet.</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Counselling details */}
        <Card className="border-border bg-card xl:col-span-2" data-testid="counselling-details-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <TypeIcon className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">{profile.counselling_type} Counselling</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.counselling_type === "MEDICAL" && profile.selection_display && (
              <div className="py-1.5"><span className="text-sm text-muted-foreground block mb-1">Selection Summary</span><span className="text-sm text-foreground">{profile.selection_display}</span></div>
            )}
            {profile.counselling_type === "ENGINEERING" && (
              <>
                <div className="py-1.5 border-b border-border/50"><span className="text-sm text-muted-foreground">Counselling Type</span><span className="text-sm font-medium text-foreground block">{profile.engineering_type || "—"}</span></div>
                <div className="py-1.5"><span className="text-sm text-muted-foreground">Branch Priority</span><span className="text-sm text-foreground block">{profile.branch_priority || "—"}</span></div>
              </>
            )}
            {profile.counselling_type === "DSE" && (
              <div className="py-1.5"><span className="text-sm text-muted-foreground">Branch Priority</span><span className="text-sm text-foreground block">{profile.branch_priority || "—"}</span></div>
            )}
            <div className="grid gap-4 border-t border-border/50 pt-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Documents Status</p>
                <div className="flex flex-wrap gap-2">
                  {documents?.map((doc) => (
                    <Badge key={doc.id} className={
                      doc.status === "VERIFIED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      doc.status === "CORRECTION_REQUIRED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      doc.file_url ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-secondary text-muted-foreground"
                    } data-testid={`doc-badge-${doc.id}`}>
                      {doc.document_type}: {doc.file_url ? doc.status : "Not Uploaded"}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-muted-foreground">Payment activity</p>
                <div className="space-y-2" data-testid="student-dashboard-payment-list">
                  {payments.length === 0 && <p className="text-sm text-muted-foreground">No payments recorded yet.</p>}
                  {payments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="rounded-lg border border-border bg-background/30 p-3">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-foreground">Rs. {(Number(payment.amount) || 0).toLocaleString()}</span>
                        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{payment.payment_mode}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{payment.created_at ? new Date(payment.created_at).toLocaleString() : "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
