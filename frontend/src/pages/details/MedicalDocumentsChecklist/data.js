export const DOCUMENTS = {
  "neet-admit": {
    title: "Admit Card of NEET UG 2026",
    section: "general",
    tooltip: "Original signed copy with your passport size photo pasted and signed.",
    badge: { type: "important", text: "Mandatory" }
  },
  "neet-marksheet": {
    title: "NEET UG 2026 Marksheet",
    section: "general",
    tooltip: "Official scorecard downloaded from NTA website.",
    badge: { type: "important", text: "Mandatory" }
  },
  "nationality-proof": {
    title: "Nationality Certificate / Valid Indian Passport",
    section: "general",
    tooltip: "Or School Leaving Certificate H.S.C stating nationality as Indian.",
    badge: { type: "important", text: "Mandatory" }
  },
  "domicile-cert": {
    title: "Domicile Certificate of the Candidate",
    section: "general",
    tooltip: "Issued by the Competent Authority of Maharashtra State (Or Annexure-C Self-Declaration).",
    badge: { type: "important", text: "Mandatory" },
    sampleUrl: "/document-formats/annexure_c.pdf"
  },
  "hsc-marksheet": {
    title: "H.S.C (or Equivalent) Examination Marksheet",
    section: "general",
    tooltip: "Must show Physics, Chemistry, and Biology group marks.",
    badge: { type: "important", text: "Mandatory" }
  },
  "ssc-cert": {
    title: "SSC Passing Certificate",
    section: "general",
    tooltip: "Required as official proof of Date of Birth.",
    badge: { type: "important", text: "Mandatory" }
  },
  "med-fitness": {
    title: "Medical Fitness Certificate (Annexure-H)",
    section: "general",
    tooltip: "Must be signed by a registered medical practitioner on the official Annexure-H format.",
    badge: { type: "warning", text: "Annexure-H" },
    sampleUrl: "/document-formats/medical_fitness_annexure_h.pdf"
  },
  "character-cert": {
    title: "Character & Conduct Certificate",
    section: "general",
    tooltip: "Issued by the Principal/Head of the last attended school or college.",
    badge: { type: "info", text: "Conduct Proof" },
    sampleUrl: "/document-formats/character_certificate.pdf"
  },
  "caste-cert": {
    title: "Caste Certificate",
    section: "category",
    tooltip: "Issued by the Competent Authority of Maharashtra.",
    badge: { type: "important", text: "Caste Proof" }
  },
  "caste-validity": {
    title: "Caste Validity Certificate",
    section: "category",
    tooltip: "Issued by the Scrutiny Committee of Maharashtra State.",
    badge: { type: "important", text: "Caste Proof" }
  },
  "ncl-cert": {
    title: "Non-Creamy Layer Certificate (NCL)",
    section: "category",
    tooltip: "Must be valid up to 31/03/2028 (Annexure-G format).",
    badge: { type: "renewal", text: "Valid till 31/03/2028" }
  },
  "ews-cert": {
    title: "EWS Certificate",
    section: "category",
    tooltip: "Issued by the Competent Authority of Maharashtra State.",
    badge: { type: "important", text: "EWS Proof" }
  },
  "def1-docs": {
    title: "Ex-servicemen Certificate & Parent Domicile Proof",
    section: "reservation",
    tooltip: "Required for DEFENCE-1 category reservation.",
    badge: { type: "important", text: "Defence-1" },
    sampleUrl: "/document-formats/defence_certificate.pdf"
  },
  "def2-docs": {
    title: "Actual Service Certificate & Parent Domicile Proof",
    section: "reservation",
    tooltip: "Required for DEFENCE-2 category reservation.",
    badge: { type: "important", text: "Defence-2" },
    sampleUrl: "/document-formats/defence_certificate.pdf"
  },
  "def3-docs": {
    title: "Actual Service Certificate, Parent Domicile & Transfer Certificate",
    section: "reservation",
    tooltip: "Required for DEFENCE-3 category reservation.",
    badge: { type: "important", text: "Defence-3" },
    sampleUrl: "/document-formats/defence_certificate.pdf"
  },
  "mkb-docs": {
    title: "Dispute Area & Mother Tongue Certificate (Annexure-E)",
    section: "reservation",
    tooltip: "Required for Maharashtra-Karnataka Border (MKB) reservation.",
    badge: { type: "warning", text: "Annexure-E" }
  },
  "hilly-docs": {
    title: "Hilly Area Certificate (Student + Parent) & Schooling Proof",
    section: "reservation",
    tooltip: "Student Hilly Certificate + Parent Domicile from Hilly Area + Proof showing 10th/12th from hilly village.",
    badge: { type: "important", text: "Hilly Area" }
  },
  "pwd-cert": {
    title: "Person with Disability (PWD) Certificate (Annexure-D)",
    section: "reservation",
    tooltip: "Issued by designated authorized medical boards (Annexure-D format).",
    badge: { type: "warning", text: "Annexure-D" },
    sampleUrl: "/document-formats/disability_certificate.pdf"
  },
  "orphan-cert": {
    title: "Orphan Reservation Certificate",
    section: "reservation",
    tooltip: "Issued by the Women & Child Welfare Dept, Govt. Of Maharashtra.",
    badge: { type: "important", text: "Orphan" }
  },
  "min-rel-cert": {
    title: "Religious Minority Certificate & Affidavit",
    section: "reservation",
    tooltip: "School leaving certificate stating religion + Affidavit.",
    badge: { type: "info", text: "Minority Proof" },
    sampleUrl: "/document-formats/minority_affidavit_format.pdf"
  },
  "min-lang-cert": {
    title: "Linguistic Minority Certificate & Affidavit",
    section: "reservation",
    tooltip: "School leaving certificate stating native language + Affidavit.",
    badge: { type: "info", text: "Minority Proof" },
    sampleUrl: "/document-formats/minority_affidavit_format.pdf"
  }
};

// Layer B — Category Mapping
export const CATEGORY_RULES = {
  "OPEN": [],
  "OBC": ["caste-cert", "caste-validity", "ncl-cert"],
  "SEBC": ["caste-cert", "caste-validity", "ncl-cert"],
  "SBC": ["caste-cert", "caste-validity", "ncl-cert"],
  "VJ": ["caste-cert", "caste-validity", "ncl-cert"],
  "NT-B": ["caste-cert", "caste-validity", "ncl-cert"],
  "NT-C": ["caste-cert", "caste-validity", "ncl-cert"],
  "NT-D": ["caste-cert", "caste-validity", "ncl-cert"],
  "SC": ["caste-cert", "caste-validity"],
  "ST": ["caste-cert", "caste-validity"],
  "EWS": ["ews-cert"]
};

// Layer C — Reservation Mapping
export const RESERVATION_RULES = {
  "NONE": [],
  "DEFENCE-1": ["def1-docs"],
  "DEFENCE-2": ["def2-docs"],
  "DEFENCE-3": ["def3-docs"],
  "MKB": ["mkb-docs"],
  "HILLY AREA": ["hilly-docs"],
  "PWD": ["pwd-cert"],
  "ORPHAN": ["orphan-cert"],
  "MINORITY-RELIGIOUS": ["min-rel-cert"],
  "MINORITY-LINGUISTIC": ["min-lang-cert"]
};
