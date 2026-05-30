import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdditionalDetailsForm } from "@/components/student/AdditionalDetailsForm";
import { buildAdditionalDetailsForm, buildAdditionalPayload, getProfileCompletion } from "@/lib/studentDetails";
import { printStudentProfile } from "@/lib/print";
import { Activity, BookOpen, Calendar, Loader2, Mail, MapPin, PencilLine, Phone, Printer, Save, ShieldCheck, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{value || "—"}</span>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20 group cursor-default">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">{label}</p>
        <p className="mt-0.5 truncate text-sm font-bold text-white tracking-wide">{value || "—"}</p>
      </div>
    </div>
  );
}

function EduSection({ title, data }) {
  if (!data) return null;
  return (
    <div className="space-y-1 mb-4">
      <h4 className="text-sm font-semibold text-foreground mb-2">{title}</h4>
      <InfoRow label="Board" value={data.board} />
      <InfoRow label="Year of Passing" value={data.year} />
      <InfoRow label="Roll Number" value={data.roll} />
      <InfoRow label="Total Marks" value={data.total_marks} />
      <InfoRow label="Obtained Marks" value={data.obtained_marks} />
      <InfoRow label="Percentage" value={data.percentage ? `${data.percentage}%` : ""} />
      <InfoRow label={title.includes("10th") ? "School" : "College"} value={data.school || data.college} />
      <InfoRow label="State" value={data.state} />
      <InfoRow label="District" value={data.district} />
    </div>
  );
}

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  const fetchProfile = async () => {
    try {
      const response = await api.get("/student/profile");
      setProfile(response.data);
      setForm(buildAdditionalDetailsForm(response.data));
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile?.id) return;
    setSaving(true);
    try {
      const response = await api.put(`/branch/students/${profile.id}/additional`, buildAdditionalPayload(form));
      setProfile(response.data);
      setForm(buildAdditionalDetailsForm(response.data));
      setEditing(false);
      toast.success("Profile details saved");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!profile) return null;

  const completion = getProfileCompletion(profile);
  const additional = profile.additional_details || {};
  const address = profile.address_details || {};
  const parent = profile.parent_details || {};
  const verificationTone = profile.verification_status === "VERIFIED"
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : profile.verification_status === "CORRECTION_REQUIRED"
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : "bg-amber-500/10 text-amber-400 border-amber-500/20";

  return (
    <div className="space-y-6" data-testid="student-profile">
      <Card className="relative overflow-hidden border-border bg-slate-950" data-testid="student-profile-hero">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1627556704302-624285497823?auto=format&fit=crop&q=80&w=2000"
            alt="Student profile background"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Content Layer */}
        <CardContent className="relative z-10 flex flex-col gap-8 p-6 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="border-primary/40 bg-primary/10 px-3 py-1 text-primary shadow-[0_0_15px_rgba(56,189,248,0.15)]" data-testid="profile-reg-number">
                  {profile.registration_no}
                </Badge>
                <Badge variant="outline" className={`px-3 py-1 font-medium ${verificationTone}`} data-testid="profile-status-badge">
                  {profile.verification_status || "PENDING"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                  {profile.full_name}
                </h2>
                <p className="max-w-2xl text-base text-slate-300 leading-relaxed opacity-90">
                  Your counselling profile, academic details, and printable records live here. 
                  Keep this page updated so branch verification moves faster.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                onClick={() => printStudentProfile({ student: profile })} 
                data-testid="student-profile-print-button"
              >
                <Printer className="mr-2 w-4 h-4" />
                Print Profile
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                onClick={() => setEditing((current) => !current)} 
                data-testid="student-profile-edit-button"
              >
                <PencilLine className="mr-2 w-4 h-4" />
                {editing ? "Close Editor" : profile.has_additional_details ? "Edit Details" : "Add More Details"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryItem 
              icon={BookOpen} 
              label="Counselling" 
              value={profile.selection_display || profile.counselling_type} 
            />
            <SummaryItem 
              icon={Phone} 
              label="Student Contact" 
              value={profile.phone} 
            />
            <SummaryItem 
              icon={User} 
              label="Parent Contact" 
              value={profile.parent_phone} 
            />
            
            <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:border-white/20" data-testid="profile-completion-panel">
              <div className="mb-2.5 flex items-center justify-between text-xs text-slate-200">
                <span className="flex items-center gap-2 font-semibold">
                  <Activity className="w-4 h-4 text-primary animate-pulse" />
                  Profile Completion
                </span>
                <span className="font-extrabold text-primary text-sm" data-testid="profile-completion-value">{completion.percentage}%</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div 
                  className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]" 
                  style={{ width: `${completion.percentage}%` }}
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-80">
                  {completion.completed}/{completion.total} checkpoints
                </span>
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <div className="h-1 w-1 rounded-full bg-primary/40 animate-bounce" />
                  <div className="h-1 w-1 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                  <div className="h-1 w-1 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!profile.has_additional_details && (
        <Card className="border-primary/20 bg-primary/5" data-testid="student-profile-missing-details-alert">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Complete your “Add More Details” form</p>
                <p className="text-sm text-muted-foreground">Address, academic, and parent details are still pending and may be required before final verification.</p>
              </div>
            </div>
            <Button onClick={() => setEditing(true)} data-testid="student-profile-complete-details-button">Complete now</Button>
          </CardContent>
        </Card>
      )}

      {editing && (
        <Card className="border-border bg-card" data-testid="student-profile-edit-card">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold">Add / Edit Details</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Update your academic, address, and parent information exactly as per your official records.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setForm(buildAdditionalDetailsForm(profile)); setEditing(false); }} data-testid="student-profile-cancel-edit-button">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} data-testid="student-profile-save-button">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Details"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AdditionalDetailsForm form={form} setForm={setForm} idPrefix="student-profile-form" />
          </CardContent>
        </Card>
      )}

      <Card className="border-border bg-card shadow-xl shadow-slate-950/20">
        <CardContent className="pt-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-xl bg-secondary/30 p-1.5 mb-8 border border-white/5" data-testid="profile-tabs">
              <TabsTrigger 
                value="basic" 
                className="rounded-lg px-6 py-2 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                data-testid="tab-basic"
              >
                Basic Details
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="rounded-lg px-6 py-2 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                data-testid="tab-education"
              >
                Education
              </TabsTrigger>
              <TabsTrigger 
                value="additional" 
                className="rounded-lg px-6 py-2 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                data-testid="tab-additional"
              >
                Additional
              </TabsTrigger>
              <TabsTrigger 
                value="parent" 
                className="rounded-lg px-6 py-2 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                data-testid="tab-parent"
              >
                Parent Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" data-testid="basic-details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div>
                  <InfoRow label="Registration No" value={profile.registration_no} />
                  <InfoRow label="Full Name" value={profile.full_name} />
                  <InfoRow label="Phone" value={profile.phone} />
                  <InfoRow label="Parent Phone" value={profile.parent_phone} />
                  <InfoRow label="Gender" value={profile.gender} />
                </div>
                <div>
                  <InfoRow label="Date of Birth" value={profile.dob} />
                  <InfoRow label="District" value={profile.district} />
                  <InfoRow label="Category" value={profile.category} />
                  <InfoRow label="Caste" value={profile.caste} />
                  <InfoRow label="Special Reservation" value={profile.special_reservation} />
                  <InfoRow label="Verification Status" value={profile.verification_status} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="education" data-testid="education-details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <EduSection title="10th Standard" data={profile.education_10th} />
                </div>
                <div>
                  <EduSection title="11th Standard" data={profile.education_11th} />
                  <EduSection title="12th Standard" data={profile.education_12th} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" data-testid="additional-details">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="border-border bg-background/40">
                  <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Additional Personal Details</CardTitle></CardHeader>
                  <CardContent>
                    <InfoRow label="Mother's Name" value={additional.mother_name} />
                    <InfoRow label="Email" value={additional.email} />
                    <InfoRow label="Religion" value={additional.religion} />
                    <InfoRow label="Family Income" value={additional.family_income} />
                    <InfoRow label="Aadhaar Number" value={additional.aadhaar_number} />
                  </CardContent>
                </Card>
                <Card className="border-border bg-background/40">
                  <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Address Details</CardTitle></CardHeader>
                  <CardContent>
                    <InfoRow label="Address" value={additional.address} />
                    <InfoRow label="Taluka" value={address.taluka} />
                    <InfoRow label="District" value={address.district} />
                    <InfoRow label="PIN Code" value={address.pin_code} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="parent" data-testid="parent-details">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="border-border bg-background/40">
                  <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Family Snapshot</CardTitle></CardHeader>
                  <CardContent>
                    <InfoRow label="Father's Occupation" value={parent.father_occupation} />
                    <InfoRow label="Father's Qualification" value={parent.father_qualification} />
                    <InfoRow label="Mother's Occupation" value={parent.mother_occupation} />
                    <InfoRow label="Mother's Qualification" value={parent.mother_qualification} />
                  </CardContent>
                </Card>
                <Card className="border-border bg-background/40" data-testid="student-profile-verification-card">
                  <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Verification Readiness</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                      <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Current verification state</p>
                        <p className="mt-1 text-sm text-muted-foreground">{profile.verification_status || "PENDING"}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Keep your contact numbers, Aadhaar, and 10th / 12th academic details accurate. Branch staff use these entries during field-level verification.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
