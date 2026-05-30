import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BOARDS, PLACES, SCHOOL_TYPES } from "@/lib/studentDetails";
import { User, MapPin, BookOpen, GraduationCap, Users } from "lucide-react";

// ─── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, children, required = false }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-300">
        {label}
        {required && <span className="ml-1 text-rose-400">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ─── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({ step, icon: Icon, title, children }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl">
      {/* Section header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50 bg-slate-800/40">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary/15 border border-primary/25 text-xs font-bold font-mono text-primary shrink-0">
          {String(step).padStart(2, "0")}
        </span>
        <div className="w-px h-5 bg-slate-700" />
        <Icon className="w-4 h-4 text-primary/70 shrink-0" strokeWidth={1.5} />
        <h3 className="text-sm font-semibold text-foreground tracking-wide">{title}</h3>
      </div>
      {/* Section body */}
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Shared class constants ────────────────────────────────────────────────────
const gridClass = "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3";
const inputClass = "h-10 rounded-lg border-slate-700 bg-slate-900/80 placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors";
const selectClass = "h-10 rounded-lg border-slate-700 bg-slate-900/80 focus:ring-1 focus:ring-primary/40 transition-colors";

// ─── Main form component ───────────────────────────────────────────────────────
export const AdditionalDetailsForm = ({ form, setForm, idPrefix = "additional-details-form" }) => {
  const updateField = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const renderInput = (key, placeholder, extraProps = {}) => (
    <Input
      {...extraProps}
      value={form[key] || ""}
      onChange={(event) => updateField(key, event.target.value)}
      placeholder={placeholder}
      className={inputClass}
      data-testid={`${idPrefix}-${key}`}
    />
  );

  const renderSelect = (key, options, placeholder) => (
    <Select value={form[key] || undefined} onValueChange={(value) => updateField(key, value)}>
      <SelectTrigger className={selectClass} data-testid={`${idPrefix}-${key}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-5" data-testid={`${idPrefix}-container`}>

      {/* ── Section 1: Additional Personal Information ── */}
      <SectionCard step={1} icon={User} title="Additional Personal Information">
        <div className={gridClass}>
          <Field label="Mother's Name">{renderInput("mother_name", "Mother's name")}</Field>
          <Field label="Email">{renderInput("email", "Email address", { type: "email" })}</Field>
          <Field label="Religion">{renderInput("religion", "Religion")}</Field>
          <Field label="Family Income">{renderInput("family_income", "Annual family income")}</Field>
          <Field label="Aadhaar Number">{renderInput("aadhaar_number", "12-digit Aadhaar")}</Field>
        </div>
      </SectionCard>

      {/* ── Section 2: Address Details ── */}
      <SectionCard step={2} icon={MapPin} title="Address Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Address (As per Aadhaar)">
            <Textarea
              value={form.address || ""}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder="Flat / area / landmark"
              className="min-h-[96px] rounded-lg border-slate-700 bg-slate-900/80 placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors resize-none"
              data-testid={`${idPrefix}-address`}
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 content-start">
            <Field label="Taluka">{renderInput("taluka", "Taluka")}</Field>
            <Field label="District">{renderInput("address_district", "District")}</Field>
            <Field label="PIN Code">{renderInput("pin_code", "PIN code")}</Field>
          </div>
        </div>
      </SectionCard>

      {/* ── Section 3: 10th Qualification ── */}
      <SectionCard step={3} icon={BookOpen} title="10th Qualification">
        <div className={gridClass}>
          <Field label="Year">{renderInput("edu_10_year", "Year of passing")}</Field>
          <Field label="Place">{renderSelect("edu_10_place", PLACES, "Select place")}</Field>
          <Field label="School Type">{renderSelect("edu_10_school_type", SCHOOL_TYPES, "Select school type")}</Field>
          <Field label="Board">{renderSelect("edu_10_board", BOARDS, "Select board")}</Field>
          <Field label="State">{renderInput("edu_10_state", "State")}</Field>
          <Field label="District">{renderInput("edu_10_district", "District")}</Field>
          <Field label="Roll Number">{renderInput("edu_10_roll", "Roll number")}</Field>
          <Field label="Total Marks / CGPA">{renderInput("edu_10_total", "Total marks / CGPA")}</Field>
          <Field label="Obtained Marks">{renderInput("edu_10_obtained", "Obtained marks")}</Field>
          <Field label="Percentage">{renderInput("edu_10_percentage", "Percentage")}</Field>
          <Field label="School Name">{renderInput("edu_10_school", "School name")}</Field>
          <Field label="School Address">{renderInput("edu_10_school_address", "School address")}</Field>
          <Field label="PIN Code">{renderInput("edu_10_pin", "PIN code")}</Field>
        </div>
      </SectionCard>

      {/* ── Section 4: 11th / Equivalent Qualification ── */}
      <SectionCard step={4} icon={BookOpen} title="11th / Equivalent Qualification">
        <div className={gridClass}>
          <Field label="Year">{renderInput("edu_11_year", "Year of passing")}</Field>
          <Field label="Place">{renderSelect("edu_11_place", PLACES, "Select place")}</Field>
          <Field label="College Type">{renderSelect("edu_11_college_type", SCHOOL_TYPES, "Select college type")}</Field>
          <Field label="Board">{renderSelect("edu_11_board", BOARDS, "Select board")}</Field>
          <Field label="State">{renderInput("edu_11_state", "State")}</Field>
          <Field label="District">{renderInput("edu_11_district", "District")}</Field>
          <Field label="Roll Number">{renderInput("edu_11_roll", "Roll number")}</Field>
          <Field label="Total Marks">{renderInput("edu_11_total", "Total marks")}</Field>
          <Field label="Obtained Marks">{renderInput("edu_11_obtained", "Obtained marks")}</Field>
          <Field label="Percentage">{renderInput("edu_11_percentage", "Percentage")}</Field>
          <Field label="College Name">{renderInput("edu_11_college", "College name")}</Field>
          <Field label="College Address">{renderInput("edu_11_college_address", "College address")}</Field>
          <Field label="PIN Code">{renderInput("edu_11_pin", "PIN code")}</Field>
        </div>
      </SectionCard>

      {/* ── Section 5: 12th / Equivalent Qualification ── */}
      <SectionCard step={5} icon={GraduationCap} title="12th / Equivalent Qualification">
        <div className={gridClass}>
          <Field label="Year">{renderInput("edu_12_year", "Year of passing")}</Field>
          <Field label="Place">{renderSelect("edu_12_place", PLACES, "Select place")}</Field>
          <Field label="College Type">{renderSelect("edu_12_college_type", SCHOOL_TYPES, "Select college type")}</Field>
          <Field label="Board">{renderSelect("edu_12_board", BOARDS, "Select board")}</Field>
          <Field label="State">{renderInput("edu_12_state", "State")}</Field>
          <Field label="District">{renderInput("edu_12_district", "District")}</Field>
          <Field label="Roll Number">{renderInput("edu_12_roll", "Roll number")}</Field>
          <Field label="Total Marks">{renderInput("edu_12_total", "Total marks")}</Field>
          <Field label="Obtained Marks">{renderInput("edu_12_obtained", "Obtained marks")}</Field>
          <Field label="Percentage">{renderInput("edu_12_percentage", "Percentage")}</Field>
          <Field label="College Name">{renderInput("edu_12_college", "College name")}</Field>
          <Field label="College Address">{renderInput("edu_12_college_address", "College address")}</Field>
          <Field label="PIN Code">{renderInput("edu_12_pin", "PIN code")}</Field>
        </div>
      </SectionCard>

      {/* ── Section 6: Parent Details ── */}
      <SectionCard step={6} icon={Users} title="Parent Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Father Occupation">{renderInput("father_occupation", "Occupation")}</Field>
          <Field label="Father Qualification">{renderInput("father_qualification", "Qualification")}</Field>
          <Field label="Mother Occupation">{renderInput("mother_occupation", "Occupation")}</Field>
          <Field label="Mother Qualification">{renderInput("mother_qualification", "Qualification")}</Field>
        </div>
      </SectionCard>

    </div>
  );
};