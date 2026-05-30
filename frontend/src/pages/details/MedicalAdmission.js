import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* --- DATA CONSTANTS ------------------------------------------------------ */

const ADMISSION_STATS = [
  { label: <>Allotted to <span className="highlight-course">MBBS</span> in 2025</>, value: 1081, suffix: "+", icon: "fa-user-md", isAllotted: true },
  { label: <>Allotted to <span className="highlight-course">BDS</span> in 2025</>, value: 175, suffix: "+", icon: "fa-tooth", isAllotted: true },
  { label: <>Allotted to <span className="highlight-course">BAMS</span> in 2025</>, value: 445, suffix: "+", icon: "fa-leaf", isAllotted: true },
  { label: "Years of Experience", value: 15, suffix: "+", icon: "fa-graduation-cap", isAllotted: false }
];

const ONLINE_SERVICES = [
  { title: "End-to-End Admission Guidance", desc: "Complete support from registration to final college admission confirmation.", icon: "fa-map-marked-alt" },
  { title: "24/7 Support System", desc: "Dedicated Calling, WhatsApp, and Parent assistance support.", icon: "fa-headset" },
  { title: "Real-Time Process Follow-Up", desc: "Continuous tracking of every counselling round and admission updates.", icon: "fa-sync-alt" },
  { title: "WhatsApp Group Updates", desc: "Instant notifications regarding Cut-offs, Merit Lists, and Results.", icon: "fa-whatsapp" },
  { title: "Fully Online Counselling Process", desc: "Entire admission process handled online from anywhere in India.", icon: "fa-laptop-house" },
  { title: "Personalized Option Form Guidance", desc: "One-to-one counselling for college selection, quota strategy, and option form filling.", icon: "fa-comments" },
  { title: "Expert Medical Admission Guidance", desc: "Guidance for MBBS, BDS, AYUSH, Nursing, and Deemed Universities.", icon: "fa-user-nurse" },
  { title: "Online Form Filling & Document Assistance", desc: "Professional support for Registration, Choice Filling, and Verification.", icon: "fa-file-upload" },
];

const PREMIUM_FEATURES = [
  { title: "100+ Live Zoom Sessions", icon: "fa-video" },
  { title: "Daily Counselling Alerts", icon: "fa-clock" },
  { title: "Personalized College List", icon: "fa-list-ol" },
  { title: "Personalized Student Portal", icon: "fa-user-shield" },
  { title: "Admission Last-Day Support", icon: "fa-exclamation-circle" },
  { title: "Scholarship & Loan Guidance", icon: "fa-hand-holding-usd" },
  { title: "AI-Based College Prediction", icon: "fa-brain" },
];

const PROCESS_TABS = [
  {
    id: "state",
    label: "State Quota",
    icon: "fa-university",
    title: "Maharashtra State CAP Process",
    steps: [
      // { title: "NEET Score Analysis", desc: "Analyze NEET rank category-wise. Use mahacet.org rank predictor to shortlist eligible government and private medical colleges.", note: "Save your rank card, it is needed at every stage." },
      { title: "Registration on mahacet.org", desc: "Register before CAP Round 1 and Round 3 on mahacet.org", note: "Registration closes strictly on the notified date." },
      { title: "Document Upload", desc: "Upload NEET scorecard, Class 10 and 12 mark sheets, caste certificate, domicile certificate, income certificate if applicable, and passport photo in prescribed format.", note: "Ensure scans are high quality and within size limits." },
      { title: "Online Document Verification", desc: "Competent authority verifies uploaded documents. Check portal daily for objection status.", note: "Unresolved objections disqualify your application." },
      { title: "Document Correction Window", desc: "Re-upload any corrected documents within the window. This is your only second chance — do not miss it.", note: "Monitor the dashboard closely during this period." },
      { title: "State Merit List (SML) Published", desc: "NEET-based merit list published on portal. Verify your rank, category, and eligibility. Download and save the official SML.", note: "This rank determines your actual admission chances." },
      { title: "College Choice Filling and Locking", desc: "Fill preferred MBBS/BDS colleges in strategic priority order.", note: "Once locked, choices cannot be edited. Use our Personalised Option Form service for best results." },
      { title: "CAP Round Allotment", desc: "Round 1, 2, and 3 allotment lists published. You can accept, upgrade, or opt out.", note: "Acceptance deadline is typically 24 to 48 hours only." },
      { title: "Seat Acceptance and Fee Payment", desc: "Pay first-year fee online to confirm allotted seat.", note: "Non-payment within deadline forfeits the seat permanently." },
      { title: "Reporting to College", desc: "Visit allotted college with all original documents, full xerox set, migration certificate, and Fee DD.", note: "Missing reporting date cancels your admission even after fee payment." },
    ]
  },
  {
    id: "aiq",
    label: "AIIMS, AIQ 15% & DEEMED",
    icon: "fa-flag",
    title: "All India Quota (AIQ) Process",
    steps: [
      { title: "AIQ Basics", desc: "15% of all government medical college seats across India fall under AIQ. NEET rank is the only selection criterion. Maharashtra domicile not required for AIQ seats.", note: "Open to all students across the country." },
      { title: "MCC Registration", desc: "Register on mcc.nic.in.", note: "Pay registration fee and security deposit (₹10,000 to ₹20,000 refundable). Keep UPI/Netbanking ready." },
      { title: "Choice Filling Strategy", desc: "Fill 200+ colleges strategically. Prioritize state, college type, and branch. Our team provides AIQ-specific choice filling guidance.", note: "Research bond and stipend before locking." },
      { title: "Mock Allotment Rounds", desc: "MCC releases 2 mock rounds before actual allotment. Refine your choices based on mock results. Do not ignore this step.", note: "Mock results show you where you currently stand." },
      { title: "Round 1 Allotment", desc: "Choose: Join and Upgrade, Join and Not Upgrade, or Resign.", note: "Choose wisely — resignation means permanent exit if not handled correctly." },
      { title: "Round 2 Allotment", desc: "Second chance for better college. Same options as Round 1. Candidates who did not get allotment in Round 1 are automatically included.", note: "Crucial round for high-rankers." },
      { title: "Mop-Up Round", desc: "Vacant seats after Round 2 filled in Mop-Up. Open to all eligible. One final chance for top government medical colleges.", note: "Limited seats but great opportunities." },
      { title: "Stray Vacancy Round", desc: "Final round at institutional level for any seats remaining. Reporting to Reporting Centre is mandatory after each round allotment.", note: "The most unpredictable yet rewarding round." },
    ]
  },
  {
    id: "other",
    label: "Other States",
    icon: "fa-map-marker-alt",
    title: "Other State Admission Process",
    steps: [
      { title: "Target State Identification", desc: "Based on NEET rank identify states offering better colleges: Karnataka, Rajasthan, UP, MP, Gujarat, Telangana. Each has different cut-offs.", note: "Evaluate budget vs quality of education." },
      { title: "Domicile and Eligibility Check", desc: "Each state has unique domicile rules. Most allow outside candidates in Management Quota only. Karnataka and some states have open merit seats for all India candidates.", note: "Check for 'Open' vs 'Closed' states." },
      { title: "Individual State Registration", desc: "Register separately on each state's counselling portal. Each has different fees, timelines, and document sets.", note: "Do not miss individual state deadlines." },
      { title: "State-Specific Document Preparation", desc: "Prepare state-specific affidavits, migration NOC, gap year certificate if applicable.", note: "Wrong document format is the most common rejection reason." },
      { title: "Choice Filling and Allotment", desc: "Fill college preferences using our state-specific Cut-Off Book data. Accept allotment within the state portal deadline.", note: "Strategy varies by state-specific rules." },
      { title: "Reporting with TC", desc: "Report to allotted college with Transfer Certificate from previous institution, all original documents, and state-specific DD or fee.", note: "Missing TC on reporting day commonly causes admission delay." },
    ]
  }
];

const WHY_CHOOSE_US = [
  { title: "Expert Guidance", stat: "Since 2011", desc: "15+ years of dedicated medical admission expertise with deep knowledge of every quota.", icon: "fa-user-tie" },
  { title: "Personalised Support", stat: "For Your Score", desc: "Every student gets a customized strategy based on their NEET rank and financial budget.", icon: "fa-hand-holding-heart" },
  { title: "Trust & Legacy", stat: "17,500+ Students", desc: "Maharashtra's most trusted name for transparent and ethical medical admissions.", icon: "fa-shield-check" },
];

/* --- MAHARASHTRA STATE WHEEL STEPS --------------------------------------- */
const MH_WHEEL_STEPS = [
  {
    title: "Registration",
    icon: "fa-user-edit",
    color: "#e74c3c",
    info: "Register on mahacet.org before Round 1 & Round 3 on MAHACET official website. Registration closes on the notified date.",
    checklist: ["Visit mahacet.org official portal", "Register before Round 1 & Round 3", "Fee: ₹1000 State / ₹5000 NRI Quota", "Save login credentials"],
    note: "Late registration means no participation. Zero exceptions."
  },
  {
    title: "Payment",
    icon: "fa-indian-rupee-sign",
    color: "#e67e22",
    info: "Pay ₹1000 for State Quota or ₹5000 for NRI/Management Quota online. UPI or Net Banking only. Save your payment receipt.",
    checklist: ["Online payment only (UPI / Net Banking)", "₹1000 for State Quota", "₹5000 for NRI/Management Quota", "Download & save receipt immediately"],
    note: "Non-payment within the window nullifies your registration."
  },
  {
    title: "Documents Upload",
    icon: "fa-cloud-upload-alt",
    color: "#f39c12",
    info: "Upload NEET Admit Card, Scorecard, Class 10 & 12 Marksheets/Sanad, Age Nationality & Domicile certificate, 12th Leaving Certificate , Category related documents (if applicable), and passport photo in prescribed format.",
    checklist: ["NEET 2026 Admit Card & Score Card (PDF)", "Class 10 & 12 Marksheets / Sanad", "Age Nationality & Domicile Certificate", "Category related documents (if applicable)", "Passport Photo (JPEG, <50KB)"],
    note: "Blurry or oversized documents get flagged. Re-upload costs you precious time."
  },
  {
    title: "Final Printout",
    icon: "fa-print",
    color: "#27ae60",
    info: "Download and keep a hard copy of your submitted application form for all rounds. This is compulsory at college reporting.",
    checklist: ["Log in to mahacet.org", "Download application PDF", "Print all pages (A4 size)", "Keep 3 copies ready"],
    note: "Original printout is checked at college reporting. Do not lose it."
  },
  {
    title: "Documents Verification",
    icon: "fa-search",
    color: "#16a085",
    info: "Competent authority verifies your uploaded documents. Check portal daily for status: Pending / Verified / Objection Raised.",
    checklist: ["Check portal every 6 hours", "Status: Pending / Verified / Objection", "Respond to queries within 24 hrs", "Screenshot your Verified status"],
    note: "Unresolved objections permanently disqualify your application."
  },
  {
    title: "Document Correction",
    icon: "fa-edit",
    color: "#2980b9",
    info: "If objection is raised, re-upload corrected documents within 48–72 hours. This is your only second chance — do not miss it.",
    checklist: ["Read the exact objection reason", "Correct the document precisely", "Re-upload within 48–72 hours", "Verify correction status after upload"],
    note: "Missing this window means automatic disqualification. Monitor continuously."
  },
  {
    title: "State Merit List",
    icon: "fa-list-ol",
    color: "#8e44ad",
    info: "NEET-AIR based State Merit List (SML) published on portal. Verify your rank, category, and eligibility. Download and save the official SML.",
    checklist: ["Check SML on mahacet.org", "Verify rank, category, and eligibility", "Download PDF copy of SML", "Compare with previous year cut-offs"],
    note: "Your SML rank determines your actual admission chances — not NEET rank."
  },
  {
    title: "Choice Filling & Locking",
    icon: "fa-lock",
    color: "#c0392b",
    info: "Fill preferred MBBS/BDS colleges in strategic priority order. MUST click LOCK before deadline. Once locked, you can unlock & edit option form before deadline.",
    checklist: ["Fill choices strategically", "Order : Dream → Realistic → Safe options", "Cross-check cut-offs before locking", "Click LOCK before deadline"],
    note: "Un-locked choices are treated as not submitted. Lock is mandatory."
  },
  {
    title: "Selection List (Rounds)",
    icon: "fa-trophy",
    color: "#d35400",
    info: "Round 1, 2, 3, and mop-up allotment lists published. Track your seat allocation status across successive counseling rounds and decide your next academic move.",
    checklist: ["Check allotment on mahacet.org", "Accept seat by reporting to college within given dates", "Choose action: Accept, Upgrade, or Opt-Out", "Strictly follow counseling rules for respective rounds"],
    note: "Acceptance deadline is 24–48 hours only. Missing it forfeits the seat."
  },
  {
    title: "Reporting to College",
    icon: "fa-university",
    color: "#1a7a8a",
    info: "Visit allotted college with all original documents, full xerox set, migration certificate, and Fee DD to complete final admission formalities.",
    checklist: ["All original documents", "3 sets of xerox copies", "Allotment letter (printed)", "Fee DD as per college notice", "Migration / TC Certificate"],
    note: "Missing reporting date cancels your admission even after fee payment."
  }
];

/* --- ALL INDIA QUOTA (MCC) STEPS --------------------------------------- */
const MCC_STEPS = [
  {
    title: "Registration",
    icon: "fa-user-plus",
    color: "#8e44ad",
    info: "Register online on the official MCC portal (mcc.nic.in). Registration windows open strictly at the beginning of Round 1, Round 2, Round 3, and the Stray Vacancy Round.",
    checklist: ["Visit mcc.nic.in official portal", "Available for Round 1, 2, 3 & Stray Vacancy", "Enter accurate NEET roll number & data", "Verify mobile number & email via OTP"],
    note: "Fresh registration is permitted in Rounds 1, 2, and 3. No registration is allowed after the Round 3 window closes."
  },
  {
    title: "Payment",
    icon: "₹",
    color: "#34495e",
    info: "Complete your counseling security deposit and registration fee payment online. Fees vary significantly based on your category and university type selection (AIIMS/JIPMER/15% AIQ vs Deemed Universities).",
    hasTable: true,
    checklist: ["Online payment gateway execution", "Refundable security deposit check", "Non-refundable registration fee payment", "Download fee payment receipt"],
    note: "Ensure your bank account online transaction limit is high enough, especially for Deemed University deposits (₹2,05,000)."
  },
  {
    title: "Choice Filling & Locking",
    icon: "fa-layer-group",
    color: "#2980b9",
    info: "Fill and arrange your preferred medical colleges (AIIMS, JIPMER, 15% AIQ, Deemed, Central Universities) in strategic priority order during active counseling rounds.",
    checklist: ["Analyze previous year MCC round cut-offs", "Arrange choices: Dream → Realistic → Safe", "Verify college location, bond, and stipends", "Explicitly LOCK choices before the deadline"],
    note: "If you do not lock your choices, they will be automatically locked by the system on the final day, but manual locking is highly recommended."
  },
  {
    title: "Allotment",
    icon: "fa-id-card-alt",
    color: "#f39c12",
    info: "MCC processes choices category-wise based on your NEET All India Rank (AIR). Allotment lists are published online for successive rounds.",
    checklist: ["Check allotment status on MCC portal", "Download formal Seat Allotment Letter", "Verify category allotment details", "Review rules for Free Exit / Upgrade options"],
    note: "Rules for upgrading vary between rounds. Joining Round 2 or 3 seats can restrict further state counseling options based on current rules."
  },
  {
    title: "Reporting",
    icon: "fa-university",
    color: "#27ae60",
    info: "Physically report to the designated medical college within the stipulated dates to verify documents and lock your seat confirmation.",
    checklist: ["Carry all original certificates & documents", "Prepare 3 complete sets of attested Xerox copies", "Arrange college fees via Demand Draft (DD) / Net banking", "Collect your formal admission confirmation letter"],
    note: "Failure to report with required original documents or fee within the timeline leads to automatic cancellation of the allotted seat."
  }
];

/* --- OTHER STATES PORTAL DATA ------------------------------------------ */
const OTHER_STATES_DATA = {
  UP: {
    name: "Uttar Pradesh",
    code: "UP",
    color: "#e67e22",
    icon: "fa-om",
    websites: ["www.upneet.gov.in", "www.dgme.up.gov.in"],
    stats: [
      { label: "NO OF COLLEGES", value: "36", color: "#636e72" },
      { label: "NO OF SEATS", value: "7325", color: "#e67e22" },
      { label: "REGISTRATION FEES", value: "₹2000/-", color: "#74b9ff" },
      { label: "SECURITY MONEY", value: "₹2 LAKH", color: "#d63031" },
      { label: "COLLEGE DEPOSIT", value: "₹3 LAKH", color: "#0984e3" },
      { label: "COLLEGE FEES", value: "₹11.81 - 19.78 L/Yr", color: "#00cec9" },
      { label: "HOSTEL, MESS & MISC.", value: "₹2.96 L/Yr", color: "#fdcb6e" }
    ],
    steps: [
      { title: "Registration", icon: "fa-user-plus", color: "#e67e22", desc: "Form Filling & Documents Uploading R1/R2/R3/STRAY", pill: "R1 / R2 / R3 / STRAY", actionSummary: "Form Filling & Documents Uploading", checklist: ["Visit upneet.gov.in and complete initial registration", "Enter valid NEET roll number and details", "Upload required documents in specified formats", "Verify email and mobile number via OTP", "Keep a printout of the registration slip"], note: "Registration is mandatory for counseling participation." },
      { title: "Pay Fees & Security", icon: "fa-rupee-sign", color: "#3498db", desc: "Pay Registration Fees & Security Money", pill: "₹2000 + ₹2 Lakh Security", actionSummary: "Online Payment Required", checklist: ["Pay non-refundable registration fee of ₹2000", "Pay security money via net banking/card", "₹30,000 for Govt, ₹2 Lakh for Pvt Medical", "Download the security money receipt", "Wait for payment confirmation status"], note: "Without security deposit, choice filling is disabled." },
      { title: "Documents Verification", icon: "fa-search", color: "#2ecc71", desc: "Online Verification at Nodal Center", pill: "Nodal Center Verification", actionSummary: "Online Verification & Slip", checklist: ["Upload domicile, category, and 10th/12th marksheet", "Verification happens online by designated nodal centers", "Check portal daily for 'Verified' status", "Respond immediately if an objection is raised", "Download verification slip once approved"], note: "Unresolved objections lead to immediate disqualification." },
      { title: "Choice Filling & Locking", icon: "fa-lock", color: "#e67e22", desc: "Fill & Lock Preferred College Choices", pill: "Lock Preferences Before Deadline", actionSummary: "Fill & Lock Choices", checklist: ["Analyze UP private and govt college cut-offs", "Arrange options based on priority and budget", "Ensure locked choices are saved before the deadline", "Take a printout of the locked choice list", "No edits allowed after locking"], note: "Choices not explicitly locked will be auto-locked on the final day." },
      { title: "Allotment & Nodal Center", icon: "fa-id-badge", color: "#9b59b6", desc: "Physical Documents Verification & DD", pill: "Physical Seat Acceptance", actionSummary: "Physical Reporting with DD", checklist: ["Check seat allotment result on the portal", "Download the allotment letter", "Visit the assigned Nodal Center physically", "Carry original documents for verification", "Submit CTS Bank Demand Draft for tuition fees"], note: "Failure to report to the Nodal Center cancels the allotted seat." },
      { title: "Reporting to College", icon: "fa-university", color: "#e74c3c", desc: "Report to Allotted College", pill: "Final Admission Secured", actionSummary: "College Joining Formalities", checklist: ["Collect admission slip from Nodal Center", "Report to the allotted college within timeframe", "Submit remaining fees and hostel charges", "Complete medical fitness examination", "Confirm final admission"], note: "Missing the college reporting deadline forfeits your admission permanently." }
    ]
  },
  TG: {
    name: "Telangana",
    code: "TG",
    color: "#c0392b",
    icon: "fa-gopuram",
    websites: ["www.tsmchan.org"],
    stats: [
      { label: "NO OF COLLEGES", value: "45+", color: "#636e72" },
      { label: "NO OF SEATS", value: "6700+", color: "#e67e22" },
      { label: "REGISTRATION FEES", value: "₹1,000/-", color: "#74b9ff" },
      { label: "TUITION FEES", value: "₹10–24 L/Yr", color: "#d63031" },
      { label: "MANAGEMENT QUOTA", value: "Available", color: "#0984e3" }
    ],
    steps: [
      { title: "Registration", icon: "fa-user-edit", color: "#e67e22", desc: "Register on TSMCHAN portal", pill: "Management Quota Only", actionSummary: "Form Submission & Photo Upload", checklist: ["Visit tsmchan.org official portal", "Complete online application form", "Enter NEET UG details correctly", "Upload scanned passport photo and signature", "Save application number for future login"], note: "Outside state candidates can apply for Management Quota only." },
      { title: "Fee Payment", icon: "fa-credit-card", color: "#3498db", desc: "Pay Application & Processing Fee", pill: "Non-Refundable Fee", actionSummary: "Online Net Banking/Card", checklist: ["Pay the non-refundable registration fee online", "Use credit card, debit card, or net banking", "Ensure transaction is successful", "Download and print payment receipt", "Check application status after payment"], note: "Application is incomplete without successful fee payment." },
      { title: "Document Verification", icon: "fa-file-alt", color: "#2ecc71", desc: "Online/Offline Verification", pill: "Online/Offline Certificates", actionSummary: "Certificate Verification Slip", checklist: ["Upload all required certificates clearly", "Verification process may be online or offline", "Check portal for verification schedule", "Attend physical verification if notified", "Receive final verification status SMS/Email"], note: "Keep all original documents ready at all times." },
      { title: "Choice Filling", icon: "fa-list-ol", color: "#e67e22", desc: "Web Options Entry", pill: "Priority Web Options", actionSummary: "Select Colleges in Order", checklist: ["Login using your registered credentials", "Access the web options entry page", "Select preferred colleges in order of priority", "Save options frequently to avoid timeout", "Lock options before the stipulated deadline"], note: "Options cannot be altered after the web entry phase closes." },
      { title: "Allotment & Acceptance", icon: "fa-check-circle", color: "#9b59b6", desc: "Seat Allotment Result", pill: "University Fee Paid Online", actionSummary: "Seat Allotment Order", checklist: ["Check allotment list on the official website", "If allotted, pay the university fee online", "Download the provisional allotment order", "Read all instructions printed on the order", "Decide on upgrade or freeze options"], note: "University fee must be paid to download the allotment order." },
      { title: "Reporting to College", icon: "fa-building", color: "#e74c3c", desc: "Physical Reporting & Final Admission", pill: "College Joining & Bonds", actionSummary: "Physical Reporting with Original Docs", checklist: ["Visit the allotted medical college physically", "Carry original certificates and allotment order", "Submit required bonds and affidavits", "Pay tuition fee and college-specific fees", "Complete joining formalities and get receipt"], note: "Failure to report will lead to cancellation of the allotted seat." }
    ]
  },
  AP: {
    name: "Andhra Pradesh",
    code: "AP",
    color: "#27ae60",
    icon: "fa-om",
    websites: ["apmedadmissions.nic.in", "ntruhs.ap.nic.in"],
    stats: [
      { label: "NO OF COLLEGES", value: "30+", color: "#636e72" },
      { label: "NO OF SEATS", value: "4800+", color: "#e67e22" },
      { label: "REGISTRATION FEES", value: "₹1,500/-", color: "#74b9ff" },
      { label: "TUITION FEES", value: "₹12–22 L/Yr", color: "#d63031" },
      { label: "BOND AMOUNT", value: "₹10–40 Lakh", color: "#0984e3" }
    ],
    steps: [
      { title: "Registration", icon: "fa-laptop-medical", color: "#e67e22", desc: "Register on AP Portal", pill: "Management/NRI Category", actionSummary: "Fill Form & Certificates Upload", checklist: ["Visit the official AP MED admissions portal", "Fill out the online application form", "Provide accurate NEET roll number and rank", "Upload necessary certificates (PDF format)", "Submit and note down registration ID"], note: "Ensure you apply under the correct category (e.g., Management/NRI)." },
      { title: "Fee Payment", icon: "fa-wallet", color: "#3498db", desc: "Application Fee Payment", pill: "Registration Fee Paid", actionSummary: "Online Payment Gateway", checklist: ["Proceed to the payment gateway", "Pay the registration fee of ₹1,500 (may vary)", "Wait for the bank confirmation page", "Do not refresh during the transaction", "Print the fee receipt immediately"], note: "Keep a copy of the payment receipt safe for future reference." },
      { title: "Physical HLC Reporting", icon: "fa-users", color: "#2ecc71", desc: "Document Verification at Centers", pill: "Help Line Center Verification", actionSummary: "Physical Document Verification", checklist: ["Locate your designated Help Line Center (HLC)", "Visit the HLC on the scheduled date/time", "Carry all original documents and xerox sets", "Undergo physical document verification", "Collect the verification acknowledgment slip"], note: "Physical presence of the candidate is strictly mandatory." },
      { title: "Choice Filling", icon: "fa-tasks", color: "#e67e22", desc: "Web Option Entry", pill: "Lock Saved Options", actionSummary: "Web Options Priority Entry", checklist: ["Login to the web counselling portal", "Exercise options for medical colleges", "Prioritize colleges based on your preference", "Save options regularly", "Lock options before the deadline"], note: "Print the list of saved options for your records." },
      { title: "Allotment & Acceptance", icon: "fa-award", color: "#9b59b6", desc: "Check Seat Allotment", pill: "Provisional Allotment Letter", actionSummary: "Accept Seat & Pay University Fee", checklist: ["Check seat allotment results online", "Download the allotment letter if a seat is assigned", "Pay the required university fee online", "Check reporting date and instructions", "Gather required bonds/affidavits"], note: "Missing the fee payment deadline will automatically cancel the seat." },
      { title: "Reporting (With Bond)", icon: "fa-file-signature", color: "#e74c3c", desc: "College Reporting & Bond Submission", pill: "Service / Discontinuation Bond", actionSummary: "Physical Joining with Signed Bond", checklist: ["Report to the allotted college in person", "Submit original certificates to the principal", "Submit the signed service/discontinuation bond", "Pay college tuition and miscellaneous fees", "Complete the admission process"], note: "Without the properly executed bond, admission will not be granted." }
    ]
  },
  KA: {
    name: "Karnataka",
    code: "KA",
    color: "#f39c12",
    icon: "fa-torii-gate",
    websites: ["www.kea.kar.nic.in"],
    stats: [
      { label: "NO OF COLLEGES", value: "55+", color: "#636e72" },
      { label: "NO OF SEATS", value: "8500+", color: "#e67e22" },
      { label: "REGISTRATION FEES", value: "₹650–750", color: "#74b9ff" },
      { label: "GOVT COLLEGE FEE", value: "₹7.5 L/Yr", color: "#d63031" },
      { label: "PRIVATE COLLEGE FEE", value: "₹12–28 L/Yr", color: "#0984e3" }
    ],
    steps: [
      { title: "Registration", icon: "fa-id-card", color: "#e67e22", desc: "Register on KEA Portal", pill: "KEA Official Portal", actionSummary: "KEA Online Application", checklist: ["Visit the KEA official website", "Complete the online registration form", "Upload photo, signature, and thumb impression", "Pay the registration fee online", "Print the application form"], note: "Karnataka offers open merit seats, highly competitive for outside students." },
      { title: "Physical Verification", icon: "fa-user-check", color: "#3498db", desc: "Verification at Help Centers", pill: "KEA Secret Key Assigned", actionSummary: "Physical HLC Document Verification", checklist: ["Check the verification schedule on KEA", "Report to the designated help center", "Bring original documents + 2 sets of attested copies", "Complete physical verification process", "Collect the verification slip with secret key"], note: "The secret key is required for choice filling; do not share it." },
      { title: "Option Entry", icon: "fa-sliders-h", color: "#2ecc71", desc: "Choice Filling (Option Entry)", pill: "No Choice Count Limit", actionSummary: "Lock College Priorities Entry", checklist: ["Login using your secret key", "Enter preferred choices of colleges", "Arrange choices in order of priority", "You can modify choices until the last date", "Submit and print the final choices"], note: "There is no limit on the number of options you can enter." },
      { title: "Allotment Results", icon: "fa-poll", color: "#e67e22", desc: "Round 1, 2, Mop-Up Allotments", pill: "Mock / Real Allotments", actionSummary: "KEA Selection Option 1-4 Choice", checklist: ["Check mock allotment results first", "Modify options if necessary after mock allotment", "Check real allotment results", "Select Choice 1, 2, 3, or 4 based on preference", "Download allotment order if Choice 1 is selected"], note: "Understand the implications of Choices 1 to 4 carefully before selecting." },
      { title: "Fee Payment", icon: "fa-rupee-sign", color: "#9b59b6", desc: "Payment & Confirmation", pill: "Tuition Fee Paid Receipt", actionSummary: "KEA Challan / Online Fee Paid", checklist: ["Pay the tuition fee online or via challan", "Ensure fee is paid within the stipulated time", "Download the admission order", "Prepare demand drafts for remaining college fees", "Gather documents for reporting"], note: "Fee payment is mandatory to confirm the allotted seat." },
      { title: "Reporting to College", icon: "fa-school", color: "#e74c3c", desc: "Report to Allotted College", pill: "KEA Joined Status Verified", actionSummary: "College Joined Physical Formalities", checklist: ["Report to the college before the deadline", "Submit original documents and admission order", "Pay any remaining college/hostel fees", "Login to KEA portal to update reporting status", "Commence classes as per schedule"], note: "Updating the reporting status on the KEA portal is mandatory." }
    ]
  }
};


const WA_LINK = "https://chat.whatsapp.com/HiY7m3QHzXZ8uVTg1eAKWU";
const PHONE = "9970809003";

const getIconUnicode = (iconClass) => {
  const mapping = {
    "fa-user-plus": "\uf234",
    "fa-rupee-sign": "\uf156",
    "fa-search": "\uf002",
    "fa-lock": "\uf023",
    "fa-id-badge": "\uf2c1",
    "fa-university": "\uf19c",
    "fa-user-edit": "\uf4ff",
    "fa-credit-card": "\uf09d",
    "fa-file-alt": "\uf15c",
    "fa-list-ol": "\uf0ca",
    "fa-check-circle": "\uf058",
    "fa-building": "\uf1ad",
    "fa-laptop-medical": "\uf812",
    "fa-wallet": "\uf555",
    "fa-users": "\uf0c0",
    "fa-tasks": "\uf0ae",
    "fa-award": "\uf559",
    "fa-file-signature": "\uf573",
    "fa-id-card": "\uf2c2",
    "fa-user-check": "\uf4fc",
    "fa-sliders-h": "\uf1de",
    "fa-poll": "\uf681",
    "fa-school": "\uf54f"
  };
  return mapping[iconClass] || "\uf05a";
};

const getStatIcon = (label) => {
  const cleanLabel = label.toUpperCase().trim();
  if (cleanLabel.includes("COLLEGES")) return "fa-university";
  if (cleanLabel.includes("SEATS")) return "fa-user-graduate";
  if (cleanLabel.includes("REGISTRATION")) return "fa-file-invoice-dollar";
  if (cleanLabel.includes("SECURITY")) return "fa-shield-alt";
  if (cleanLabel.includes("DEPOSIT")) return "fa-piggy-bank";
  if (cleanLabel.includes("HOSTEL") || cleanLabel.includes("MESS")) return "fa-hotel";
  if (cleanLabel.includes("FEES") || cleanLabel.includes("TUITION")) return "fa-money-bill-wave";
  if (cleanLabel.includes("BOND")) return "fa-file-signature";
  return "fa-chart-bar";
};

const renderSvgIcon = (iconClass, color, size = 16) => {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { pointerEvents: 'none' }
  };

  switch (iconClass) {
    case "fa-user-plus":
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="17" y1="11" x2="23" y2="11" />
        </svg>
      );
    case "fa-rupee-sign":
      return (
        <svg {...props}>
          <path d="M6 3h12" />
          <path d="M6 8h12" />
          <path d="M6 13h8.5a4.5 4.5 0 0 0 0-9H6" />
          <path d="M9 13l9 9" />
        </svg>
      );
    case "fa-search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "fa-lock":
      return (
        <svg {...props}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "fa-id-badge":
    case "fa-id-card":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
          <line x1="7" y1="8" x2="17" y2="8" />
          <line x1="10" y1="12" x2="17" y2="12" />
          <line x1="7" y1="16" x2="17" y2="16" />
          <circle cx="7" cy="12" r="1" />
        </svg>
      );
    case "fa-university":
    case "fa-school":
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    case "fa-user-edit":
    case "fa-user-check":
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <polyline points="17 11 19 13 23 9" />
        </svg>
      );
    case "fa-credit-card":
      return (
        <svg {...props}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case "fa-file-alt":
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "fa-list-ol":
    case "fa-tasks":
      return (
        <svg {...props}>
          <line x1="9" y1="6" x2="20" y2="6" />
          <line x1="9" y1="12" x2="20" y2="12" />
          <line x1="9" y1="18" x2="20" y2="18" />
          <circle cx="4" cy="6" r="2" />
          <circle cx="4" cy="12" r="2" />
          <circle cx="4" cy="18" r="2" />
        </svg>
      );
    case "fa-check-circle":
      return (
        <svg {...props}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "fa-building":
      return (
        <svg {...props}>
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <line x1="9" y1="22" x2="9" y2="16" />
          <line x1="9" y1="16" x2="15" y2="16" />
          <line x1="15" y1="16" x2="15" y2="22" />
          <line x1="8" y1="6" x2="8" y2="6.01" />
          <line x1="16" y1="6" x2="16" y2="6.01" />
          <line x1="8" y1="10" x2="8" y2="10.01" />
          <line x1="16" y1="10" x2="16" y2="10.01" />
        </svg>
      );
    case "fa-laptop-medical":
      return (
        <svg {...props}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="2" y1="20" x2="22" y2="20" />
          <line x1="12" y1="17" x2="12" y2="20" />
          <path d="M10 8h4" />
          <path d="M12 6v4" />
        </svg>
      );
    case "fa-wallet":
      return (
        <svg {...props}>
          <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h14v4" />
          <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
          <path d="M18 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4v-6z" />
        </svg>
      );
    case "fa-users":
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "fa-award":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    case "fa-file-signature":
      return (
        <svg {...props}>
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M10 16s1-1 2.5-1 2.5 1 2.5 1" />
        </svg>
      );
    case "fa-sliders-h":
      return (
        <svg {...props}>
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="2" y1="14" x2="6" y2="14" />
          <line x1="10" y1="8" x2="14" y2="8" />
          <line x1="18" y1="16" x2="22" y2="16" />
        </svg>
      );
    case "fa-poll":
      return (
        <svg {...props}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
};

const getShortDesc = (title, desc) => {
  const t = title.toLowerCase().trim();
  if (t.includes("registration") || t.includes("register")) return "Online Form & Upload";
  if (t.includes("pay fee") || t.includes("fee payment") || t.includes("processing fee") || t.includes("fees & security")) return "Pay Fees & Deposit";
  if (t.includes("physical hlc") || t.includes("physical verification") || t.includes("document verification") || t.includes("documents verification")) return "Verify Documents";
  if (t.includes("choice filling") || t.includes("option entry") || t.includes("web option")) return "Lock College Choices";
  if (t.includes("allotment")) return "Seat Allotment Status";
  if (t.includes("reporting")) return "College Joining & Bond";
  
  if (desc && desc.length > 25) {
    return desc.substring(0, 22) + "...";
  }
  return desc || "";
};

/* --- COMPONENT ---------------------------------------------------------- */

export default function MedicalAdmission() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [counts, setCounts] = useState(ADMISSION_STATS.map(() => 0));
  const [activeWheelStep, setActiveWheelStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Other States Portal Tracking
  const [activeOsState, setActiveOsState] = useState("UP");
  const [activeOsStep, setActiveOsStep] = useState(0);
  const [isOsSwitching, setIsOsSwitching] = useState(false);
  const [bloomColor, setBloomColor] = useState("#e67e22");
  const [showProcessModal, setShowProcessModal] = useState(false);

  // Automated Stats Tour State Hooks (Mobile < 860px)
  const [activeStatTourIdx, setActiveStatTourIdx] = useState(0);
  const [isUserInteractingStats, setIsUserInteractingStats] = useState(false);
  const statsTourTimeoutRef = useRef(null);

  const handleStatsInteraction = (idx) => {
    setIsUserInteractingStats(true);
    setActiveStatTourIdx(idx);
    
    if (statsTourTimeoutRef.current) {
      clearTimeout(statsTourTimeoutRef.current);
    }
    
    statsTourTimeoutRef.current = setTimeout(() => {
      setIsUserInteractingStats(false);
    }, 5000);
  };

  useEffect(() => {
    if (activeTab !== 2 || isUserInteractingStats) return;
    const interval = setInterval(() => {
      setActiveStatTourIdx((prev) => (prev + 1) % 7);
    }, 2500);
    return () => clearInterval(interval);
  }, [activeTab, isUserInteractingStats]);

  useEffect(() => {
    return () => {
      if (statsTourTimeoutRef.current) {
        clearTimeout(statsTourTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll mobile active step chip into view
  useEffect(() => {
    const activeChip = document.getElementById(`os-mob-step-${activeOsStep}`);
    if (activeChip) {
      activeChip.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeOsStep]);

  const handleOsStateChange = (code) => {
    if (code === activeOsState) return;
    setBloomColor(OTHER_STATES_DATA[code].color);
    setIsOsSwitching(true);
    setShowProcessModal(false);
    setTimeout(() => {
      setActiveOsState(code);
      setActiveOsStep(0);
      setIsOsSwitching(false);
    }, 500);
  };

  const handleWheelSegmentClick = (index) => {
    setActiveWheelStep(prev => prev === index ? null : index);
    setIsAutoPlaying(false);
  };

  const handleWheelNext = () => {
    setActiveWheelStep(prev => (prev === null ? 0 : Math.min(prev + 1, MH_WHEEL_STEPS.length - 1)));
    setIsAutoPlaying(false);
  };

  const handleWheelPrev = () => {
    setActiveWheelStep(prev => (prev === null ? 0 : Math.max(prev - 1, 0)));
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Counter Animation Logic
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCounts(ADMISSION_STATS.map(stat => Math.floor((stat.value * currentStep) / steps)));
      if (currentStep >= steps) clearInterval(timer);
    }, interval);

    // Scroll Animation Logic
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll(".reveal");
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  const handleTabChange = (index) => {
    setActiveTab(index);
    setActiveStep(0);
    setActiveWheelStep(0);
    setIsAutoPlaying(true);
  };

  useEffect(() => {
    return; // Temporarily disabled auto shifting between process tabs
    let timer;
    if (activeTab === 0) {
      if (!isAutoPlaying) return;
      timer = setTimeout(() => {
        if (activeWheelStep === null) {
          setActiveWheelStep(0);
        } else if (activeWheelStep + 1 < MH_WHEEL_STEPS.length) {
          setActiveWheelStep(activeWheelStep + 1);
        } else {
          setActiveTab(1);
          setActiveStep(0);
          setActiveWheelStep(null);
        }
      }, activeWheelStep === null ? 500 : 4500);
    } else {
      if (!isAutoPlaying) return;
      timer = setTimeout(() => {
        const currentStepsCount = activeTab === 1 ? MCC_STEPS.length : PROCESS_TABS[activeTab].steps.length;
        if (activeStep + 1 < currentStepsCount) {
          setActiveStep(activeStep + 1);
        } else {
          const nextTab = (activeTab + 1) % PROCESS_TABS.length;
          setActiveTab(nextTab);
          setActiveStep(0);
          if (nextTab === 0) setActiveWheelStep(0);
        }
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [activeTab, activeStep, activeWheelStep, isAutoPlaying]);

  return (
    <div className="medical-admission-page">
      <style>{`
        :root {
          --primary: #0d2d4e;
          --secondary: #1a7a8a;
          --accent: #e9a825;
          --success: #2ecc71;
          --error: #ff4757;
          --text-main: #2d3436;
          --text-light: #636e72;
          --bg-light: #f8fafc;
          --white: #ffffff;
          --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .medical-admission-page {
          font-family: 'Inter', sans-serif;
          color: var(--text-main);
          background: var(--white);
          overflow-x: hidden;
        }

        /* --- ANIMATIONS ------------------------------------------------- */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: var(--transition);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* --- GLOBAL COMPONENTS ------------------------------------------ */
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .section-header span {
          display: inline-block;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--secondary);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 15px;
          background: rgba(26, 122, 138, 0.1);
          padding: 8px 18px;
          border-radius: 50px;
        }
        .section-header h2 {
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 800;
          color: var(--primary);
          line-height: 1.2;
          margin: 0;
        }

        .highlight-course {
          color: var(--accent);
          font-weight: 900;
          padding: 2px 6px;
          background: rgba(233, 168, 37, 0.15);
          border-radius: 6px;
          border: 1px solid rgba(233, 168, 37, 0.3);
        }

        /* --- HERO SECTION ----------------------------------------------- */
        .hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 60px 0;
          background: linear-gradient(rgba(13, 45, 78, 0.85), rgba(26, 122, 138, 0.85)), 
                      url('/landing-assets/images/medical-hero-bg.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: var(--white);
          text-align: center;
        }
        .hero-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .hero i.main-icon {
          font-size: 3.5rem;
          color: var(--accent);
          margin-bottom: 1rem;
          animation: float 3s ease-in-out infinite;
        }
        .hero h1 {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.2rem;
          letter-spacing: -1px;
        }
        .hero p {
          font-size: 1.15rem;
          opacity: 0.9;
          margin-bottom: 2.5rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
          margin-bottom: 3rem;
        }
        .stat-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 20px 15px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: var(--transition);
        }
        .stat-box:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
        }
        .stat-value {
          display: block;
          font-size: 2.3rem;
          font-weight: 800;
          color: var(--accent);
          line-height: 1.2;
        }
        .stat-label {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
          opacity: 0.9;
        }
        .stat-note {
          display: block;
          font-size: 0.7rem;
          margin-top: 5px;
          opacity: 0.7;
        }
        .hero-cta {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .btn-premium {
          padding: 18px 45px;
          border-radius: 50px;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: var(--transition);
          font-size: 1.1rem;
          border: none;
          cursor: pointer;
        }
        .btn-primary {
          background: var(--accent);
          color: var(--primary);
        }
        .btn-primary:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(233, 168, 37, 0.4);
        }
        .btn-wa {
          background: #25d366;
          color: white;
        }
        .btn-wa:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(37, 211, 102, 0.4);
        }

        /* --- ONLINE SERVICES SECTION ------------------------------------ */
        .services-section {
          padding: 80px 0;
          background: var(--bg-light);
        }
        .services-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          align-items: start;
        }

        .services-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .service-list-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          border-radius: 15px;
          background: var(--white);
          border: 1px solid rgba(0,0,0,0.05);
          transition: var(--transition);
        }
        .service-list-item:hover {
          box-shadow: 0 10px 20px rgba(13, 45, 78, 0.05);
          transform: translateY(-3px);
          border-color: var(--secondary);
        }
        .service-list-icon {
          width: 45px;
          height: 45px;
          background: var(--bg-light);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary);
          font-size: 1.2rem;
          flex-shrink: 0;
          transition: var(--transition);
        }
        .service-list-item:hover .service-list-icon {
          background: var(--secondary);
          color: var(--white);
        }
        .service-list-content h4 {
          font-size: 1rem;
          font-weight: 800;
          color: var(--primary);
          margin: 0 0 5px 0;
        }
        .service-list-content p {
          font-size: 0.85rem;
          color: var(--text-light);
          line-height: 1.5;
          margin: 0;
        }

        .premium-features-box {
          background: linear-gradient(135deg, var(--primary) 0%, #113f6d 100%);
          border-radius: 25px;
          padding: 40px 30px;
          color: var(--white);
          position: sticky;
          top: 100px;
          box-shadow: 0 20px 40px rgba(13, 45, 78, 0.2);
        }
        .premium-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .premium-header h3 {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--accent);
          margin-bottom: 10px;
        }
        .premium-header p {
          font-size: 0.95rem;
          opacity: 0.9;
        }
        .premium-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .premium-list-item {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255,255,255,0.06);
          padding: 16px 20px;
          border-radius: 12px;
          transition: var(--transition);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .premium-list-item:hover {
          background: rgba(255,255,255,0.12);
          transform: translateX(5px);
          border-color: rgba(233, 168, 37, 0.3);
        }
        .premium-list-item i {
          color: var(--accent);
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }
        .premium-list-item span {
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.3px;
        }


        /* --- PROCESS TABS ----------------------------------------------- */
        .process {
          padding: 100px 0;
          background: var(--white);
        }
        .tabs-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 0px;
        }
        .tabs-nav {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }
        .tab-btn {
          padding: 15px 30px;
          border-radius: 12px;
          background: var(--bg-light);
          border: 2px solid transparent;
          color: var(--text-light);
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tab-btn i { font-size: 1.2rem; }
        .tab-btn.active {
          background: var(--white);
          border-color: var(--accent);
          color: var(--primary);
          box-shadow: var(--shadow);
          transform: translateY(-5px);
        }
        .process-content {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 40px;
          min-height: 600px;
        }
        .steps-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .step-pill {
          padding: 18px 20px;
          border-radius: 15px;
          background: var(--bg-light);
          border: none;
          text-align: left;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 15px;
          border: 1px solid transparent;
        }
        .step-pill .num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          transition: var(--transition);
          flex-shrink: 0;
        }
        .step-pill.active {
          background: var(--white);
          color: var(--primary);
          transform: translateX(10px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          border-color: var(--accent);
          border-left: 6px solid var(--accent);
        }
        .step-pill.active .num {
          background: var(--primary);
          color: var(--white);
        }
        .step-detail {
          background: var(--white);
          padding: 50px;
          border-radius: 30px;
          box-shadow: var(--shadow);
          border: 1px solid var(--bg-light);
          animation: slideInRight 0.5s ease-out;
        }
        .step-tag {
          display: inline-block;
          background: var(--secondary);
          color: var(--white);
          padding: 6px 15px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        .step-detail h3 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 20px;
          color: var(--primary);
        }
        .step-detail p {
          font-size: 1.2rem;
          line-height: 1.7;
          color: var(--text-light);
          margin-bottom: 30px;
        }
        .step-note {
          background: #fff9eb;
          padding: 30px;
          border-radius: 20px;
          border-left: 6px solid var(--accent);
        }
        .step-note h4 {
          color: var(--accent);
          text-transform: uppercase;
          font-size: 0.9rem;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* --- WHY CHOOSE US ---------------------------------------------- */
        .why-us {
          padding: 100px 0;
          background: var(--primary);
          color: var(--white);
        }
        .why-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          padding: 0 20px;
        }
        .why-card {
          padding: 50px 40px;
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.05);
          text-align: center;
          transition: var(--transition);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .why-card:hover {
          background: var(--white);
          color: var(--primary);
          transform: translateY(-15px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
        }
        .why-card i {
          font-size: 3.5rem;
          margin-bottom: 25px;
          color: var(--accent);
        }
        .why-card h4 { font-size: 1.5rem; margin-bottom: 10px; font-weight: 700; }
        .why-card .why-stat {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--secondary);
          margin-bottom: 15px;
          display: block;
        }
        .why-card:hover .why-stat { color: var(--primary); }
        .why-card p { opacity: 0.8; font-size: 1rem; }

        /* --- CTA STRIP -------------------------------------------------- */
        .cta-strip {
          padding: 80px 0;
          background: var(--secondary);
          color: var(--white);
          text-align: center;
        }
        .cta-strip h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 40px;
        }
        .cta-btns {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 50px;
        }
        .footer-line {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 30px;
          font-size: 0.9rem;
          opacity: 0.6;
        }

        /* --- RESPONSIVE ------------------------------------------------- */
        @media (max-width: 1024px) {
          .services-layout { grid-template-columns: 1fr; }
          .premium-features-box { position: static; margin-top: 40px; }
          .process-content { grid-template-columns: 1fr; }
          .steps-nav { flex-direction: row; overflow-x: auto; padding-bottom: 10px; }
          .step-pill { white-space: nowrap; }
        }
        @media (max-width: 768px) {
          .services-list { grid-template-columns: 1fr; }
          .hero h1 { font-size: 2.5rem; }
          .why-grid { grid-template-columns: 1fr; }
          .cta-btns { flex-direction: column; align-items: center; }
          .btn-premium { width: 100%; max-width: 300px; justify-content: center; }
        }

        /* ===== MH- CIRCULAR WHEEL ======================================= */
        @keyframes mhFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mhPopIn {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.7); }
          70%  { transform: translate(-50%,-50%) scale(1.05); }
          100% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes mhPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(233,168,37,0.4); }
          50%      { box-shadow: 0 0 0 10px rgba(233,168,37,0); }
        }

        .mh-wheel-section {
          padding: 20px 0 40px;
        }

        /* Layout: Split Dashboard */
        .mh-wheel-layout {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 60px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .mh-wheel-left-col {
          display: flex;
          align-items: center;
          gap: 30px;
          flex-shrink: 0;
        }
        .mh-wheel-right-col {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 580px;
          width: 500px;
          flex-shrink: 0;
        }

        /* LEFT DOTS */
        .mh-progress-dots {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        .mh-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #d1d5db;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          padding: 0;
        }
        .mh-dot:hover { background: #1a7a8a; transform: scale(1.3); }
        .mh-dot-active {
          background: #e9a825;
          transform: scale(1.4);
          animation: mhPulse 1.5s infinite;
        }

        /* WHEEL CONTAINER */
        .mh-wheel-center-area {
          flex-shrink: 0;
        }
        .mh-wheel-container {
          position: relative;
          width: 560px;
          height: 560px;
          margin: 0 auto;
        }

        /* SEGMENT CARDS */
        .mh-segment {
          position: absolute;
          width: 110px;
          transform: translate(-50%, -50%);
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          z-index: 2;
        }
        .mh-segment:hover {
          transform: translate(-50%, -50%) scale(1.12);
          z-index: 10;
        }
        .mh-segment-active {
          transform: translate(-50%, -50%) scale(1.1);
          background: #fffdf0;
          z-index: 10;
        }
        .mh-seg-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .mh-seg-icon {
          font-size: 1.2rem;
        }
        .mh-seg-title {
          font-size: 0.7rem;
          font-weight: 700;
          color: #0d2d4e;
          line-height: 1.25;
          display: block;
        }

        /* CENTER CIRCLE (Minimal) */
        .mh-center-minimal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 0 10px rgba(233,168,37,0.1), 0 20px 50px rgba(13,45,78,0.15);
          border: 4px solid #e9a825;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }
        .mh-center-default {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d2d4e 0%, #1a4d6e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .mh-center-active {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          
        }
        .mh-center-num {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          color: #fff;
          font-size: 1.2rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .mh-center-active-icon {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        .mh-center-active-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0d2d4e;
          line-height: 1.3;
        }
        .mh-center-site {
          font-size: 0.9rem;
          font-weight: 800;
          color: #e9a825;
          letter-spacing: 0.5px;
          margin-top: 8px;
        }
        .mh-center-sub {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          margin-top: 4px;
        }

        /* RIGHT SIDE DESKTOP CARD (Glassmorphism) */
        .mh-side-card {
          width: 100%;
          height: 580px;
          min-height: 580px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 30px 40px;
          box-shadow: 0 20px 60px rgba(13,45,78,0.08);
          border: 1px solid rgba(13,45,78,0.05);
          animation: mhFadeIn 0.4s ease-out;
          display: flex;
          flex-direction: column;
        }
        .mh-detail-body {
          flex: 1;
          overflow-y: auto;
          padding-right: 12px;
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }
        /* Custom scrollbar for mh-detail-body */
        .mh-detail-body::-webkit-scrollbar {
          width: 6px;
        }
        .mh-detail-body::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .mh-detail-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .mh-detail-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .mh-right-placeholder {
          text-align: center;
          color: #94a3b8;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          height: 100%;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 24px;
          border: 2px dashed #cbd5e1;
        }
        .mh-right-placeholder i { font-size: 3rem; color: #cbd5e1; }
        .mh-right-placeholder p { font-size: 1.1rem; font-weight: 500; line-height: 1.6; max-width: 300px; }
        
        .mh-detail-header {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f1f5f9;
          border-left: 5px solid #e9a825;
          padding-left: 20px;
          border-radius: 4px;
        }
        .mh-detail-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #fff;
          flex-shrink: 0;
        }
        .mh-detail-badge {
          font-size: 0.75rem;
          font-weight: 800;
          color: #1a7a8a;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .mh-detail-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0d2d4e;
          margin: 0;
          line-height: 1.2;
        }
        .mh-detail-info {
          font-size: 1.05rem;
          color: #4b6584;
          line-height: 1.75;
          margin-bottom: 24px;
        }
        .mh-checklist {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: auto; /* pushes everything else up, note down */
          width: 100%;
        }
        .mh-check-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #2d3436;
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 10px;
        }
        .mh-check-item i { color: #2ecc71; font-size: 1.1rem; flex-shrink: 0; margin-top: 2px; }
        .mh-detail-note {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #fff9eb;
          border-left: 5px solid #e9a825;
          padding: 16px 20px;
          border-radius: 0 12px 12px 0;
          margin: 24px 0;
          font-size: 0.95rem;
          color: #5a4a1a;
          font-weight: 600;
          line-height: 1.6;
        }
        .mh-detail-note i { color: #e9a825; margin-top: 2px; flex-shrink: 0; }
        .mh-detail-nav {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          width: 100%;
        }
        .mh-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.25s;
          border: none;
        }
        .mh-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .mh-nav-prev { background: #f1f5f9; color: #0d2d4e; }
        .mh-nav-prev:hover:not(:disabled) { background: #e2e8f0; }
        .mh-nav-next { background: #e9a825; color: #0d2d4e; }
        .mh-nav-next:hover:not(:disabled) { background: #d4921e; transform: translateX(2px); }

        /* MOBILE LIST */
        .mh-mobile-container { display: none; }

        @media (max-width: 860px) {
          .mh-wheel-section { padding: 10px 0; }
          .mh-wheel-layout { display: none; }
          .mh-detail-body {
            overflow: visible;
            padding-right: 0;
            margin-bottom: 20px;
          }
          .mh-mobile-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            padding: 0 15px;
          }
          .mh-mobile-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .mh-accordion-wrapper {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .mh-mobile-item {
            display: flex;
            align-items: center;
            gap: 14px;
            background: #ffffff;
            border: none;
            border-left: 5px solid #ccc;
            border-radius: 12px;
            padding: 14px 18px;
            cursor: pointer;
            transition: all 0.25s;
            text-align: left;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            font-size: 1rem;
            font-weight: 600;
            color: #0d2d4e;
            width: 100%;
          }
          .mh-mobile-item:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
          .mh-mobile-active { background: #fffdf0; }
          .mh-mobile-num {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            color: #fff;
            font-weight: 800;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .mh-mobile-chevron { margin-left: auto; color: #94a3b8; font-size: 0.8rem; }
          
          /* Detail Card Mobile Adjustments */
          .mh-mobile-detail-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 10px 30px rgba(13,45,78,0.1);
            border: 2px solid #e9a825;
            animation: mhFadeUp 0.4s cubic-bezier(0.4,0,0.2,1);
          }
          .mh-mobile-detail-card .mh-detail-header {
            flex-direction: row;
            text-align: left;
            align-items: flex-start;
          }
          .mh-mobile-detail-card .mh-detail-icon-wrap {
            width: 48px;
            height: 48px;
            font-size: 1.2rem;
          }
          .mh-mobile-detail-card .mh-detail-title {
            font-size: 1.25rem;
          }
          .mh-mobile-detail-card .mh-detail-info {
            text-align: left;
            padding: 0;
            font-size: 0.95rem;
          }
          .mh-mobile-detail-card .mh-detail-nav {
            justify-content: space-between;
          }
        }

        /* AIQ DESKTOP LAYOUT */
        .aiq-timeline-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding: 20px 0;
          width: 100%;
        }
        .aiq-timeline-line {
          position: absolute;
          left: 35px;
          top: 40px;
          bottom: 40px;
          width: 2px;
          background: #e2e8f0;
          z-index: 1;
        }
        .aiq-step-node {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.6;
        }
        .aiq-step-node:hover { opacity: 0.8; transform: translateX(5px); }
        .aiq-step-node.active { opacity: 1; transform: translateX(10px); }
        .aiq-step-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          color: #fff;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .aiq-step-node.active .aiq-step-icon {
          transform: scale(1.15);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
        .aiq-step-info {
          display: flex;
          flex-direction: column;
        }
        .aiq-step-label {
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .aiq-step-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0d2d4e;
        }

        /* AIQ DARK MODE MOBILE */
        @media (max-width: 860px) {
          .aiq-mobile-theme {
            background: linear-gradient(to bottom right, #0b0f19, #111827, #070a10) !important;
            border: none !important;
          }
          .aiq-mobile-item {
            background: rgba(15, 23, 42, 0.4) !important;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(30, 41, 59, 0.6) !important;
            color: #f1f5f9 !important;
            box-shadow: none !important;
          }
          .aiq-mobile-item.active {
            box-shadow: 0 0 20px rgba(255,255,255,0.05) !important;
            border-left-width: 5px !important;
          }
          .aiq-mobile-card {
            background: #111c32 !important;
            border: 1px solid rgba(30, 41, 59, 0.8) !important;
          }
          .aiq-mobile-card .mh-detail-title { color: #fff !important; }
          .aiq-mobile-card .mh-detail-info { color: #94a3b8 !important; }
          .aiq-mobile-card .mh-check-item {
            background: #18253f !important;
            border: 1px solid rgba(30, 41, 59, 0.4) !important;
            color: #e2e8f0 !important;
          }
          .aiq-mobile-card .mh-detail-note {
            background: rgba(69, 26, 3, 0.2) !important;
            border-left-color: #f59e0b !important;
            color: #fcd34d !important;
          }
          .aiq-nav-next {
            background: linear-gradient(to right, #f59e0b, #f97316) !important;
            color: #0f172a !important;
          }
          .aiq-nav-prev {
            background: rgba(30, 41, 59, 0.8) !important;
            color: #f1f5f9 !important;
          }
          }
        }

        /* --- OTHER STATES PORTAL (OS) --- */
        .os-container {
          display: flex;
          flex-direction: row;
          width: 100%;
          min-height: 650px;
          background: var(--white);
          border: 1px solid rgba(13, 45, 78, 0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(13, 45, 78, 0.06);
          margin-top: 20px;
          color: var(--text-main);
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .os-container {
          display: flex;
        }

        .os-sidebar {
          width: 130px;
          background: var(--bg-light);
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(13, 45, 78, 0.08);
          flex-shrink: 0;
          position: relative;
          z-index: 10;
        }
        .os-sidebar-title {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--text-light);
          text-align: center;
          padding: 20px 0 10px;
          font-weight: 800;
        }
        .os-state-btn {
          background: transparent;
          border: none;
          padding: 20px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          color: var(--text-light);
          border-left: 3px solid transparent;
        }
        .os-state-btn:hover { background: rgba(13, 45, 78, 0.04); color: var(--primary); }
        .os-state-btn.active { background: var(--white); color: var(--primary); }
        .os-state-btn-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(13, 45, 78, 0.08);
          background: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.3s;
        }
        .os-state-btn.active .os-state-btn-icon {
          box-shadow: 0 4px 12px currentColor;
          border-color: currentColor;
        }
        .os-state-code { font-size: 1.1rem; font-weight: 800; }
        .os-state-name { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1px; text-align: center; }
        .os-sidebar-cta {
          margin-top: auto;
          padding: 20px 10px;
          text-align: center;
          border-top: 1px solid rgba(13, 45, 78, 0.08);
          background: rgba(13, 45, 78, 0.02);
        }
        .os-pulsing-dot {
          width: 8px;
          height: 8px;
          background: var(--success);
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
          box-shadow: 0 0 10px var(--success);
          animation: osPulse 2s infinite;
        }
        @keyframes osPulse {
          0% { box-shadow: 0 0 0 0 rgba(46,204,113,0.7); }
          70% { box-shadow: 0 0 0 6px rgba(46,204,113,0); }
          100% { box-shadow: 0 0 0 0 rgba(46,204,113,0); }
        }

        .os-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
          overflow-y: auto;
          background: var(--white);
        }
        .os-bloom-overlay {
          position: absolute;
          top: 50%; left: 30%;
          width: 20px; height: 20px;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }
        .os-bloom-overlay.active {
          animation: bloomAnim 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes bloomAnim {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(150); opacity: 0; }
        }
        .os-content-wrapper {
          padding: 20px 24px;
          margin-top: 0;
          align-self: flex-start;
          width: 100%;
          display: flex;
          flex-direction: column;
          background: transparent;
          transition: opacity 0.4s ease, transform 0.4s ease;
          position: relative;
          z-index: 2;
          box-sizing: border-box;
        }
        .os-content-wrapper.switching { opacity: 0; transform: translateX(30px); }

        /* EMPTY STATE */
        .os-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 500px;
          text-align: center;
          background: transparent;
          color: var(--text-light);
          z-index: 2;
          padding: 60px 24px;
        }
        .os-empty-map {
          font-size: 8rem;
          color: rgba(13, 45, 78, 0.02);
          margin-bottom: 40px;
          position: relative;
        }
        .os-empty-node {
          position: absolute;
          width: 12px;
          height: 12px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 15px var(--accent);
          animation: osPulseNode 2s infinite;
        }
        .os-empty-node:nth-child(1) { top: 10%; left: 35%; }
        .os-empty-node:nth-child(2) { top: 40%; left: 60%; }
        .os-empty-node:nth-child(3) { top: 80%; left: 45%; }
        .os-empty-node:nth-child(4) { top: 60%; left: 20%; }
        @keyframes osPulseNode {
          0% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.4; }
        }
        .os-empty-state h3 { font-size: 2.2rem; color: var(--primary); margin-bottom: 15px; font-weight: 800; }
        .os-empty-state p { max-width: 450px; line-height: 1.6; font-size: 1.05rem; }
        
        .os-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }
        .os-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          background: rgba(13, 45, 78, 0.03);
          border-radius: 30px;
          border: 1px solid rgba(13, 45, 78, 0.06);
          margin-bottom: 12px;
          font-weight: 700;
        }
        .os-header-code {
          font-weight: 900;
          font-size: 0.9rem;
        }
        .os-header h2 {
          font-size: 2.2rem;
          color: var(--primary);
          margin: 0 0 5px 0;
          font-weight: 800;
        }
        .os-header-links {
          display: flex;
          justify-content: center;
          gap: 15px;
          font-size: 0.85rem;
        }
        .os-step-counter {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
          opacity: 0.9;
        }
        .os-step-counter span { font-size: 1.5rem; opacity: 0.5; font-weight: 700; }

        .os-zone-b {
          display: flex;
          flex-direction: row;
          gap: 20px;
          align-items: flex-start;
          margin-top: 16px;
          margin-bottom: 30px;
          width: 100%;
        }
        .os-wheel-col {
          flex: 0 0 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ===== PREMIUM FLOWER PETAL WHEEL ===== */
        .os-flower-wheel {
          position: relative;
          width: 520px;
          height: 520px;
          flex-shrink: 0;
          margin: 0 auto;
        }
        .os-flower-wheel svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* SVG Petal Segments */
        .os-petal-segment {
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));
          transform-origin: 260px 260px;
        }
        .os-petal-segment:hover {
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12));
          transform: scale(1.03);
        }
        .os-petal-segment.active {
          filter: drop-shadow(0 6px 20px rgba(0,0,0,0.18));
          transform: scale(1.05);
        }

        /* Step number badges */
        .os-step-badge-circle {
          transition: all 0.3s ease;
        }
        .os-step-badge-text {
          font-family: 'Inter', 'Montserrat', sans-serif;
          font-weight: 900;
          fill: #ffffff;
          text-anchor: middle;
          dominant-baseline: central;
          pointer-events: none;
        }

        /* Step icon circles on the ring */
        .os-step-icon-circle {
          transition: all 0.3s ease;
        }

        /* Central hub */
        .os-central-hub {
          transition: all 0.5s ease;
        }
        .os-central-hub-label {
          font-family: 'Inter', sans-serif;
          fill: var(--text-light);
          text-anchor: middle;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }
        .os-central-hub-code {
          font-family: 'Montserrat', 'Inter', sans-serif;
          text-anchor: middle;
          font-size: 38px;
          font-weight: 900;
          letter-spacing: 2px;
        }
        .os-central-hub-name {
          font-family: 'Inter', sans-serif;
          fill: var(--text-light);
          text-anchor: middle;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* Directional arrows */
        .os-flow-arrow {
          transition: all 0.3s ease;
        }

        /* Step Labels radiating outward */
        .os-step-label-group {
          pointer-events: none;
          transition: all 0.3s ease;
        }
        .os-step-label-title {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 800;
          fill: var(--primary);
          letter-spacing: 0.3px;
        }
        .os-step-label-desc {
          font-family: 'Inter', sans-serif;
          font-size: 8px;
          font-weight: 600;
          fill: var(--text-light);
          letter-spacing: 0.2px;
        }
        .os-step-label-group.active .os-step-label-title {
          font-size: 12px;
        }

        @media (max-width: 1100px) {
          .os-flower-wheel { width: 440px; height: 440px; }
        }
        @media (max-width: 860px) {
          .os-flower-wheel { display: none !important; }
        }

        /* --- TIER 1 SWITCHER HEADER --- */
        .os-switcher-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          border-bottom: 1px solid rgba(13, 45, 78, 0.08);
          padding-bottom: 24px;
          margin-bottom: 30px;
          gap: 20px;
        }
        .os-switcher-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 30px;
          border: 1px solid var(--state-color);
          background: #ffffff;
          color: var(--state-color);
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(13, 45, 78, 0.03);
        }
        .os-switcher-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(13, 45, 78, 0.08);
          background: var(--state-color);
          color: #ffffff;
        }
        .os-switcher-center {
          text-align: center;
          flex: 1;
        }
        .os-switcher-center h2 {
          font-family: 'Montserrat', sans-serif;
          color: var(--primary);
          font-weight: 800;
          font-size: 1.8rem;
          margin: 6px 0;
        }

        /* --- TIER 2: SPLIT GRID --- */
        .os-tier-2-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 40px;
          align-items: start;
          width: 100%;
          margin-bottom: 40px;
        }

        /* --- TIER 3: Bottom Stats Matrix --- */
        .os-stats-section-title {
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: var(--primary);
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .os-stats-grid-premium {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          width: 100%;
          margin-bottom: 40px;
        }
        .os-stats-card-premium {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #ffffff;
          border: 1px solid rgba(13, 45, 78, 0.06);
          border-left: 5px solid var(--accent-color);
          border-radius: 12px;
          padding: 20px 24px;
          box-shadow: 0 6px 20px rgba(13, 45, 78, 0.02);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .os-stats-card-premium:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(13, 45, 78, 0.08);
          border-color: rgba(13, 45, 78, 0.12);
        }
        .os-stats-card-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
          background: rgba(13, 45, 78, 0.04);
          color: var(--primary);
        }
        .os-stats-card-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }
        .os-stats-card-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-light);
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        .os-stats-card-value {
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--primary);
        }

        /* --- TIER 4: Bottom Premium CTA Banner --- */
        .os-premium-cta-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          background: linear-gradient(135deg, #0d2d4e, #1a3c61);
          border-radius: 16px;
          padding: 30px 40px;
          box-sizing: border-box;
          box-shadow: 0 15px 35px rgba(13, 45, 78, 0.15);
          color: #ffffff;
          margin-top: 20px;
        }
        .os-cta-content {
          text-align: left;
        }
        .os-cta-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          margin: 0 0 6px 0;
          letter-spacing: 0.5px;
          color: #ffffff;
        }
        .os-cta-desc {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }
        .os-cta-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .os-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
        }
        .os-cta-btn.call {
          background: var(--accent);
          color: var(--primary);
        }
        .os-cta-btn.call:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(233, 168, 37, 0.4);
        }
        .os-cta-btn.wa {
          background: #25d366;
          color: #ffffff;
        }
        .os-cta-btn.wa:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        }

        /* --- RESPONSIVE WORKFLOWS & VISIBILITY OVERRIDES --- */
        .os-desktop-only-view {
          display: block;
        }
        .os-mobile-only-view {
          display: none;
        }

        @media (min-width: 861px) {
          .os-sidebar {
            display: none !important;
          }
          .os-mobile-steps {
            display: none !important;
          }
        }

        @media (max-width: 1100px) {
          .os-flower-wheel { width: 440px; height: 440px; }
        }

        @media (max-width: 860px) {
          .os-desktop-only-view {
            display: none !important;
          }
          .os-mobile-only-view {
            display: block !important;
          }

          .os-container { flex-direction: column; min-height: auto; }
          .os-sidebar { width: 100%; flex-direction: row; overflow-x: auto; border-right: none; border-bottom: 1px solid rgba(13, 45, 78, 0.08); padding: 10px; }
          .os-sidebar-title, .os-sidebar-cta { display: none; }
          .os-state-btn { flex-direction: row; padding: 10px 15px; border-left: none; border-bottom: 3px solid transparent; flex-shrink: 0; }
          .os-state-btn.active { border-bottom-color: currentColor; }
          .os-state-name { display: block; font-size: 0.8rem; }
          .os-main { padding: 20px; }
          .os-content-wrapper { padding: 0; }
          .os-header { display: none !important; }
          .os-step-counter { display: none; }
          .os-flower-wheel { display: none !important; }
          .os-tier-2-grid { display: flex; flex-direction: column; gap: 20px; margin-bottom: 30px; }
          .os-switcher-header { display: none !important; }
          .os-stats-grid-premium { grid-template-columns: 1fr; gap: 15px; }
          .os-premium-cta-banner { flex-direction: column; text-align: center; gap: 20px; padding: 24px; }
          .os-cta-content { text-align: center; }
          .os-cta-actions { width: 100%; justify-content: center; flex-wrap: wrap; }
          
          .os-mobile-steps {
            display: flex;
            overflow-x: auto;
            gap: 10px;
            padding-bottom: 15px;
            margin-bottom: 20px;
            width: 100%;
          }
          .os-mobile-step-chip {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: var(--bg-light);
            border: 1px solid rgba(13, 45, 78, 0.08);
            border-radius: 20px;
            color: var(--text-light);
            font-size: 0.85rem;
            font-weight: 600;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.3s;
          }
          .os-mobile-step-chip.active { color: var(--white); border-color: currentColor; background: currentColor; box-shadow: 0 2px 8px currentColor; }
          .os-mobile-step-chip i { font-size: 1rem; }

          /* Mobile Premium Stats 2x2 Grid */
          .os-mobile-only-view .os-mobile-stats-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
            width: 100% !important;
            margin-top: 0 !important;
            margin-bottom: 20px !important;
          }
          .os-mobile-only-view .os-mobile-stats-card {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            background: #ffffff !important;
            border: 1px solid rgba(13, 45, 78, 0.05) !important;
            border-radius: 12px !important;
            padding: 14px 16px !important;
            box-shadow: 0 4px 12px rgba(13, 45, 78, 0.02) !important;
            box-sizing: border-box !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative !important;
            overflow: hidden !important;
          }
          .os-mobile-only-view .os-mobile-stats-card.tour-active,
          .os-mobile-only-view .os-mobile-stats-card:hover {
            transform: scale(1.04) translateY(-3px) !important;
            box-shadow: 0 12px 24px rgba(13, 45, 78, 0.08), 0 0 15px var(--stat-color-glow) !important;
            border-left-width: 5px !important;
            border-left-color: var(--stat-color) !important;
            z-index: 2 !important;
          }
          .os-mobile-only-view .os-mobile-stats-card.tour-active::before,
          .os-mobile-only-view .os-mobile-stats-card:hover::before {
            content: '' !important;
            position: absolute !important;
            inset: 0 !important;
            background: radial-gradient(circle at 10% 50%, var(--stat-color-pulse) 0%, transparent 70%) !important;
            opacity: 1 !important;
            pointer-events: none !important;
            animation: statPulseNode 2s infinite ease-in-out !important;
          }
          .os-mobile-only-view .os-mobile-stats-icon-wrap {
            width: 38px !important;
            height: 38px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 1.1rem !important;
            flex-shrink: 0 !important;
          }
          .os-mobile-only-view .os-mobile-stats-content {
            display: flex !important;
            flex-direction: column !important;
            gap: 2px !important;
            text-align: left !important;
            min-width: 0 !important;
          }
          .os-mobile-only-view .os-mobile-stats-label {
            font-size: 0.65rem !important;
            font-weight: 800 !important;
            color: var(--text-light) !important;
            letter-spacing: 0.5px !important;
            text-transform: uppercase !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .os-mobile-only-view .os-mobile-stats-value {
            font-size: 1.02rem !important;
            font-weight: 900 !important;
            color: var(--primary) !important;
            word-break: break-word !important;
          }

          /* Call-to-Action Pulsing Button */
          .os-mobile-cta-trigger {
            width: 100%;
            padding: 16px 20px;
            border-radius: 12px;
            border: none;
            color: #ffffff;
            font-weight: 800;
            font-size: 0.95rem;
            font-family: 'Montserrat', 'Inter', sans-serif;
            cursor: pointer;
            text-align: center;
            margin: 10px 0 25px 0;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            animation: osPulseCta 2s infinite ease-in-out;
            transition: all 0.3s ease;
          }
          .os-mobile-cta-trigger:active {
            transform: scale(0.98);
          }

          /* Modal CSS overrides inside media query */
          .os-modal-backdrop {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(13, 29, 46, 0.65);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            box-sizing: border-box;
            animation: fadeInModal 0.3s ease-out;
          }
          .os-modal-card {
            background: #ffffff;
            width: 92%;
            max-width: 480px;
            max-height: 85vh;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(13, 29, 46, 0.25);
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
            border: 1px solid rgba(13, 45, 78, 0.08);
            animation: scaleInModal 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .os-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 24px;
            border-bottom: 1px solid rgba(13, 45, 78, 0.06);
            flex-shrink: 0;
          }
          .os-modal-header-title {
            font-family: 'Montserrat', sans-serif;
            font-weight: 800;
            font-size: 1rem;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .os-modal-close-btn {
            background: rgba(13, 45, 78, 0.04);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--primary);
            font-size: 0.95rem;
            transition: all 0.3s;
          }
          .os-modal-close-btn:hover {
            background: rgba(13, 45, 78, 0.08);
            transform: rotate(90deg);
          }
          .os-modal-body {
            padding: 20px 24px;
            overflow-y: auto;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-sizing: border-box;
          }
          .os-modal-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 24px;
            border-top: 1px solid rgba(13, 45, 78, 0.06);
            background: var(--bg-light);
            gap: 15px;
            flex-shrink: 0;
          }
          .os-modal-nav-btn {
            flex: 1;
            padding: 14px 20px;
            border-radius: 12px;
            border: none;
            font-weight: 700;
            font-size: 0.95rem;
            font-family: 'Montserrat', sans-serif;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
            box-sizing: border-box;
          }
          .os-modal-nav-btn.prev {
            background: #ffffff;
            color: var(--primary);
            border: 1px solid rgba(13, 45, 78, 0.12);
          }
          .os-modal-nav-btn.prev:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .os-modal-nav-btn.next {
            color: #ffffff;
          }
          .os-modal-nav-btn.next:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .os-modal-nav-btn:active {
            transform: scale(0.96);
          }

          .os-modal-warning-box {
            background: rgba(245, 158, 11, 0.05);
            border: 1px solid rgba(245, 158, 11, 0.15);
            border-left: 4px solid #f59e0b;
            padding: 14px;
            border-radius: 12px;
            display: flex;
            gap: 12px;
            align-items: flex-start;
            text-align: left;
            width: 100%;
            box-sizing: border-box;
          }
          .os-modal-warning-box i {
            color: #f59e0b;
            font-size: 1.05rem;
            margin-top: 2px;
            flex-shrink: 0;
          }
          .os-modal-warning-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .os-modal-warning-label {
            font-size: 0.65rem;
            font-weight: 800;
            color: #f59e0b;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }
          .os-modal-warning-note {
            font-size: 0.78rem;
            line-height: 1.4;
            color: var(--primary);
            font-weight: 500;
          }
        }

        @keyframes osPulseCta {
          0% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 8px 25px var(--pulse-color);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
        }
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleInModal {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes statPulseNode {
          0% {
            opacity: 0.4;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.02);
          }
          100% {
            opacity: 0.4;
            transform: scale(0.98);
          }
        }

        /* ZONE C: Summary / Warning Card Styles */
        .os-summary-card {
          margin-top: 20px;
          background: var(--white);
          border: 1px solid rgba(13, 45, 78, 0.08);
          border-left: 4px solid var(--step-color);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 10px 30px rgba(13, 45, 78, 0.04);
          width: 100%;
          text-align: left;
          box-sizing: border-box;
        }
        .os-summary-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          width: 100%;
        }
        .os-summary-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .os-summary-badge {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          font-weight: 900;
          color: #fff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          flex-shrink: 0;
        }
        .os-summary-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .os-summary-step {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }
        .os-summary-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--primary);
          margin: 0;
        }
        .os-summary-subtitle {
          font-size: 0.82rem;
          color: var(--text-light);
          margin: 0;
        }
        .os-summary-pill {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 8px;
          border: 1px solid currentColor;
          font-size: 0.75rem;
          font-weight: 800;
          background: rgba(13, 45, 78, 0.02);
          white-space: nowrap;
        }
        .os-summary-mid-row {
          width: 100%;
        }
        .os-warning-box {
          background: rgba(245, 158, 11, 0.04);
          border: 1px solid rgba(245, 158, 11, 0.1);
          border-left: 4px solid #f59e0b;
          padding: 14px 18px;
          border-radius: 8px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
        }
        .os-warning-box i {
          color: #f59e0b;
          font-size: 1.1rem;
          margin-top: 3px;
          flex-shrink: 0;
        }
        .os-warning-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .os-warning-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #f59e0b;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        .os-warning-note {
          font-size: 0.8rem;
          color: #d97706;
          font-weight: 600;
          margin: 0;
          line-height: 1.45;
        }
        .os-summary-nav-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          width: 100%;
          margin-top: 4px;
        }
        .os-nav-prev-btn {
          background: var(--bg-light);
          border: 1px solid rgba(13, 45, 78, 0.08);
          color: var(--text-light);
          padding: 9px 20px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .os-nav-prev-btn:hover:not(:disabled) {
          background: rgba(13, 45, 78, 0.04);
          color: var(--primary);
          border-color: rgba(13, 45, 78, 0.15);
        }
        .os-nav-prev-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
        .os-nav-next-btn {
          color: var(--white);
          padding: 9px 24px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          box-shadow: 0 4px 15px rgba(13, 45, 78, 0.1);
        }
        .os-nav-next-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(13, 45, 78, 0.15);
          filter: brightness(1.05);
        }
        .os-nav-next-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Hexagon path glow styling */
        .spw-node path {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .spw-node:hover path {
          fill: var(--bg-light);
          stroke-width: 2.5px;
        }
        .spw-node-title-txt {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        /* MOBILE STATS GRID */
        .os-mobile-stats-grid {
          display: none;
          flex-direction: column;
          gap: 15px;
          width: 100%;
          margin-top: 25px;
          padding: 0 5px;
        }
        .os-mobile-stats-header {
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(13, 45, 78, 0.08);
          padding-bottom: 10px;
          margin-bottom: 5px;
          text-align: left;
        }
        .os-mobile-stats-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(46, 204, 113, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2ecc71;
          font-size: 1.2rem;
          flex-shrink: 0;
          box-shadow: 0 0 15px rgba(46, 204, 113, 0.1);
        }
        .os-mobile-stats-header-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .os-mobile-stats-title {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--secondary);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .os-mobile-stats-subtitle {
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: 700;
        }
        .os-mobile-stats-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          width: 100%;
        }
        .os-mobile-stat-card {
          background: var(--white);
          border: 1px solid rgba(13, 45, 78, 0.08);
          border-left: 3.5px solid #fff;
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
          box-shadow: 0 4px 12px rgba(13, 45, 78, 0.02);
          transition: transform 0.2s;
        }
        .os-mobile-stat-card:hover {
          transform: translateY(-1px);
          background: var(--bg-light);
        }
        .os-mobile-stat-card:last-child:nth-child(odd) {
          grid-column: span 2;
        }
        .os-mobile-stat-label {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .os-mobile-stat-value {
          font-size: 1rem;
          font-weight: 900;
          color: var(--primary);
        }

        /* Responsive handling */
        @media (max-width: 1100px) {
          .os-mobile-stats-grid {
            display: flex;
          }
          .os-stats-tree-container {
            display: none !important;
          }
          .os-wheel-col {
            flex: none !important;
            width: 100% !important;
          }
        }
        @media (max-width: 640px) {
          .os-summary-card {
            padding: 16px;
            gap: 12px;
          }
          .os-summary-top-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .os-summary-pill {
            align-self: flex-start;
          }
        }
        @media (max-width: 480px) {
          .os-mobile-stats-cards {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .os-mobile-stat-card {
            padding: 10px 12px;
          }
          .os-mobile-stat-label {
            font-size: 0.54rem;
          }
          .os-mobile-stat-value {
            font-size: 0.85rem;
          }
          .os-mobile-stat-card:last-child:nth-child(odd) {
            grid-column: span 2;
          }
        }

        /* ==== LANDING FOOTER STYLES ==== */
        .lp-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }
        @media (min-width: 1300px) {
          .lp-container {
            width: 95%;
            max-width: 1400px;
          }
        }
        .lp-footer {
          background: #12121f;
          color: rgba(255,255,255,0.75);
          padding: clamp(3rem, 6vw, 4rem) 0 1.5rem;
          border-top: 3px solid #f39c12;
          text-align: left;
        }
        .lp-footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }
        @media (min-width: 640px) {
          .lp-footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 992px) {
          .lp-footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
        }
        .lp-footer-brand p {
          font-size: 0.88rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.55);
          margin-top: 1rem;
        }
        .lp-footer-brand-logo {
          height: 3rem;
          width: auto;
          margin-bottom: 0.75rem;
        }
        .lp-footer-col h5 {
          font-size: 0.9rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #fff;
          margin-bottom: 1.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(243,156,18,0.4);
          display: inline-block;
        }
        .lp-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .lp-footer-links li {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .lp-footer-links li a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.87rem;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .lp-footer-links li a:hover {
          color: #f39c12;
        }
        .lp-footer-links li a i {
          font-size: 0.75rem;
          color: #f39c12;
        }
        .lp-footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          margin-bottom: 0.75rem;
        }
        .lp-footer-contact-item i {
          color: #f39c12;
          margin-top: 0.15rem;
          flex-shrink: 0;
        }
        .lp-footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }
        @media (min-width: 640px) {
          .lp-footer-bottom {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        .lp-footer-bottom p {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.4);
          margin: 0;
        }
        .lp-footer-policy-links {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .lp-footer-policy-links a {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.2s;
        }
        .lp-footer-policy-links a:hover {
          color: #f39c12;
        }
        .lp-social-links {
          display: flex;
          justify-content: flex-start;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .lp-social-link {
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(255,255,255,0.07);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          transition: all 0.3s;
          text-decoration: none;
        }
        .lp-social-link:hover {
          background: #f39c12;
          color: white;
          transform: translateY(-3px);
        }
        @media (max-width: 768px) {
          .lp-footer-brand-logo {
            height: 2.25rem;
          }
        }
        @media (max-width: 480px) {
          .lp-footer-grid {
            gap: 1.75rem;
          }
        }
      `}</style>

      {/* SECTION 1: HERO */}
      <section className="hero">
        <div className="hero-content">
          <i className="fas fa-stethoscope main-icon"></i>
          <h1 className="reveal">Your Medical Admission <br />Journey Made Simple</h1>
          <p className="reveal">Trusted Guidance for NEET Counselling. From Registration to Admission — We Handle Everything.</p>

          <div className="hero-stats">
            {ADMISSION_STATS.map((stat, i) => (
              <div key={i} className="stat-box reveal">
                <span className="stat-value">{counts[i]}{stat.suffix}</span>
                <span className="stat-label">{stat.label}</span>
                {stat.isAllotted && <span className="stat-note">Allotted in our guidance</span>}
              </div>
            ))}
          </div>

          <div className="hero-cta reveal">
            <a href={`tel:${PHONE}`} className="btn-premium btn-primary">
              <i className="fas fa-phone"></i> Call Expert Now
            </a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-premium btn-wa">
              <i className="fab fa-whatsapp"></i> Join WhatsApp Group
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: ONLINE COUNSELLING SERVICES */}
      <section className="services-section">
        <div className="section-header reveal">
          <span>Why Choose Admissions Made Easy?</span>
          <h2>Complete Online Medical Counselling Support</h2>
        </div>

        <div className="services-layout">
          <div className="services-list">
            {ONLINE_SERVICES.map((service, i) => (
              <div key={i} className="service-list-item reveal" style={{ transitionDelay: `${(i % 4) * 50}ms` }}>
                <div className="service-list-icon">
                  <i className={`${service.icon.includes('whatsapp') ? 'fab' : 'fas'} ${service.icon}`}></i>
                </div>
                <div className="service-list-content">
                  <h4>{service.title}</h4>
                  <p>{service.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="premium-features-box reveal" style={{ transitionDelay: '200ms' }}>
            <div className="premium-header">
              <h3>Premium Features</h3>
              <p>Elevate your admission strategy with our expert tools</p>
            </div>
            <div className="premium-list">
              {PREMIUM_FEATURES.map((feature, i) => (
                <div key={i} className="premium-list-item">
                  <i className={`fas ${feature.icon}`}></i>
                  <span>{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROCESS TABS */}
      <section className="process">
        <div className="tabs-wrapper">
          <div className="section-header reveal">
            <span>The Roadmap</span>
            <h2>Your Complete Roadmap to Medical Admission</h2>
          </div>

          <div className="tabs-nav reveal">
            {PROCESS_TABS.map((tab, i) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === i ? 'active' : ''}`}
                onClick={() => handleTabChange(i)}
              >
                <i className={`fas ${tab.icon}`}></i> {tab.label}
              </button>
            ))}
          </div>

          {/* ── STATE QUOTA: CIRCULAR WHEEL ── */}
          {activeTab === 0 && (
            <div className="mh-wheel-section">
              <div className="mh-wheel-layout">

                {/* LEFT COLUMN: Step dots progress + Circular Wheel */}
                <div className="mh-wheel-left-col">
                  <div className="mh-progress-dots">
                    {MH_WHEEL_STEPS.map((_, i) => (
                      <button
                        key={i}
                        className={`mh-dot ${activeWheelStep === i ? 'mh-dot-active' : ''}`}
                        onClick={() => handleWheelSegmentClick(i)}
                        title={MH_WHEEL_STEPS[i].title}
                      />
                    ))}
                  </div>

                  <div className="mh-wheel-center-area">
                    <div className="mh-wheel-container">
                      {MH_WHEEL_STEPS.map((step, i) => {
                        const angle = (i * 36 - 90) * (Math.PI / 180);
                        const radius = 230; // 560px container -> 280px radius max -> 230px leaves perfect room for segments
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        const isActive = activeWheelStep === i;
                        return (
                          <button
                            key={i}
                            className={`mh-segment ${isActive ? 'mh-segment-active' : ''}`}
                            style={{
                              left: `calc(50% + ${x}px)`,
                              top: `calc(50% + ${y}px)`,
                              borderColor: isActive ? '#e9a825' : step.color,
                              boxShadow: isActive ? `0 0 0 3px #e9a825, 0 8px 30px ${step.color}55` : `0 4px 15px ${step.color}33`,
                            }}
                            onClick={() => handleWheelSegmentClick(i)}
                            onMouseEnter={() => setIsAutoPlaying(false)}
                          >
                            <div className="mh-seg-num" style={{ background: isActive ? '#e9a825' : step.color }}>{i + 1}</div>
                            <i className={`fas ${step.icon} mh-seg-icon`} style={{ color: isActive ? '#e9a825' : step.color }}></i>
                            <span className="mh-seg-title">{step.title}</span>
                          </button>
                        );
                      })}

                      {/* CENTER CIRCLE (Minimalist) */}
                      <div className="mh-center-minimal">
                        {activeWheelStep === null ? (
                          <div className="mh-center-default">
                            <svg viewBox="0 0 100 120" width="70" height="84" fill="none">
                              <path d="M50 5 C20 5 5 28 5 50 C5 80 30 100 50 115 C70 100 95 80 95 50 C95 28 80 5 50 5Z" fill="rgba(26,122,138,0.15)" stroke="#1a7a8a" strokeWidth="2" />
                              <circle cx="38" cy="45" r="7" fill="#1a7a8a" />
                              <circle cx="62" cy="45" r="7" fill="#1a7a8a" />
                              <ellipse cx="50" cy="65" rx="16" ry="10" fill="#1a7a8a" opacity="0.6" />
                            </svg>
                            <div className="mh-center-site">mahacet.org</div>
                            <div className="mh-center-sub">Select a step</div>
                          </div>
                        ) : (
                          <div className="mh-center-active" key={`active-${activeWheelStep}`}>
                            <div className="mh-center-num" style={{ background: MH_WHEEL_STEPS[activeWheelStep].color }}>
                              {activeWheelStep + 1}
                            </div>
                            <i className={`fas ${MH_WHEEL_STEPS[activeWheelStep].icon} mh-center-active-icon`} style={{ color: MH_WHEEL_STEPS[activeWheelStep].color }}></i>
                            <div className="mh-center-active-title">{MH_WHEEL_STEPS[activeWheelStep].title}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Detail Dashboard Card */}
                <div className="mh-wheel-right-col">
                  {activeWheelStep === null ? (
                    <div className="mh-right-placeholder">
                      <i className="fas fa-mouse-pointer"></i>
                      <p>Select a step or wait for the tour to view detailed instructions, checklists, and crucial alerts.</p>
                    </div>
                  ) : (
                    <div className="mh-side-card" key={`side-${activeWheelStep}`}>
                      <div className="mh-detail-header">
                        <div className="mh-detail-icon-wrap" style={{ background: MH_WHEEL_STEPS[activeWheelStep].color }}>
                          <i className={`fas ${MH_WHEEL_STEPS[activeWheelStep].icon}`}></i>
                        </div>
                        <div>
                          <div className="mh-detail-badge" style={{ color: MH_WHEEL_STEPS[activeWheelStep].color }}>
                            Step {activeWheelStep + 1} of {MH_WHEEL_STEPS.length}
                          </div>
                          <h3 className="mh-detail-title">{MH_WHEEL_STEPS[activeWheelStep].title}</h3>
                        </div>
                      </div>

                      <div className="mh-detail-body">
                        <p className="mh-detail-info">{MH_WHEEL_STEPS[activeWheelStep].info}</p>

                        <div className="mh-checklist">
                          {MH_WHEEL_STEPS[activeWheelStep].checklist.map((item, ci) => (
                            <div key={ci} className="mh-check-item">
                              <i className="fas fa-check-circle"></i>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mh-detail-note">
                          <i className="fas fa-exclamation-triangle"></i>
                          <span>{MH_WHEEL_STEPS[activeWheelStep].note}</span>
                        </div>
                      </div>

                      <div className="mh-detail-nav">
                        <button
                          className="mh-nav-btn mh-nav-prev"
                          onClick={handleWheelPrev}
                          disabled={activeWheelStep === 0}
                        >
                          <i className="fas fa-arrow-left"></i> Prev
                        </button>
                        <button
                          className="mh-nav-btn mh-nav-next"
                          onClick={handleWheelNext}
                          disabled={activeWheelStep === MH_WHEEL_STEPS.length - 1}
                        >
                          Next <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* MOBILE: True Accordion Layout */}
              <div className="mh-mobile-container">
                <div className="mh-mobile-grid">
                  {MH_WHEEL_STEPS.map((step, idx) => (
                    <div key={idx} className="mh-accordion-wrapper">
                      <button
                        className={`mh-mobile-item ${activeWheelStep === idx ? 'mh-mobile-active' : ''}`}
                        onClick={() => handleWheelSegmentClick(idx)}
                        style={{ borderLeftColor: step.color }}
                      >
                        <div className="mh-mobile-num" style={{ background: step.color }}>{idx + 1}</div>
                        <i className={`fas ${step.icon}`} style={{ color: step.color }}></i>
                        <span>{step.title}</span>
                        <i className={`fas fa-chevron-${activeWheelStep === idx ? 'up' : 'down'} mh-mobile-chevron`}></i>
                      </button>

                      {/* Expandable Detail Card */}
                      {activeWheelStep === idx && (
                        <div className="mh-mobile-detail-card" style={{ borderColor: step.color }}>
                          <div className="mh-detail-header">
                            <div className="mh-detail-icon-wrap" style={{ background: step.color }}>
                              <i className={`fas ${step.icon}`}></i>
                            </div>
                            <div>
                              <div className="mh-detail-badge" style={{ color: step.color }}>
                                Step {idx + 1} of {MH_WHEEL_STEPS.length}
                              </div>
                              <h3 className="mh-detail-title">{step.title}</h3>
                            </div>
                          </div>

                          <div className="mh-detail-body">
                            <p className="mh-detail-info">{step.info}</p>

                            <div className="mh-checklist" style={{ maxWidth: '100%' }}>
                              {step.checklist.map((item, ci) => (
                                <div key={ci} className="mh-check-item">
                                  <i className="fas fa-check-circle"></i>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>

                            <div className="mh-detail-note" style={{ maxWidth: '100%' }}>
                              <i className="fas fa-exclamation-triangle"></i>
                              <span>{step.note}</span>
                            </div>
                          </div>

                          <div className="mh-detail-nav">
                            <button className="mh-nav-btn mh-nav-prev" onClick={handleWheelPrev} disabled={idx === 0}>
                              <i className="fas fa-arrow-left"></i> Prev
                            </button>
                            <button className="mh-nav-btn mh-nav-next" onClick={handleWheelNext} disabled={idx === MH_WHEEL_STEPS.length - 1}>
                              Next <i className="fas fa-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── AIQ TAB: Master Architect Dashboard ── */}
          {activeTab === 1 && (
            <div className="mh-wheel-section">
              {/* DESKTOP LAYOUT */}
              <div className="mh-wheel-layout" style={{ margin: 0, alignItems: 'flex-start' }}>
                <div className="mh-wheel-left-col" style={{ width: '400px', flexShrink: 0, justifyContent: 'center', height: '580px' }}>
                  <div className="aiq-timeline-wrapper">
                    <div className="aiq-timeline-line"></div>
                    {MCC_STEPS.map((step, idx) => (
                      <div
                        key={idx}
                        className={`aiq-step-node ${activeStep === idx ? 'active' : ''}`}
                        onClick={() => { setActiveStep(idx); setIsAutoPlaying(false); }}
                      >
                        <div className="aiq-step-icon" style={{ background: step.color }}>
                          {step.icon === "₹" ? <span className="text-2xl font-bold" style={{ color: '#fff' }}>₹</span> : <i className={`fas ${step.icon}`}></i>}
                        </div>
                        <div className="aiq-step-info">
                          <span className="aiq-step-label" style={{ color: step.color }}>Step 0{idx + 1}</span>
                          <span className="aiq-step-title" style={{ color: activeStep === idx ? '#0d2d4e' : '#64748b' }}>{step.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mh-wheel-right-col">
                  <div className="mh-side-card" key={`aiq-${activeStep}`}>
                    <div className="mh-detail-header">
                      <div className="mh-detail-icon-wrap" style={{ background: MCC_STEPS[activeStep].color }}>
                        {MCC_STEPS[activeStep].icon === "₹" ? <span className="text-xl font-bold" style={{ color: '#fff' }}>₹</span> : <i className={`fas ${MCC_STEPS[activeStep].icon}`}></i>}
                      </div>
                      <div>
                        <div className="mh-detail-badge" style={{ color: MCC_STEPS[activeStep].color }}>
                          Step {activeStep + 1} of {MCC_STEPS.length}
                        </div>
                        <h3 className="mh-detail-title">{MCC_STEPS[activeStep].title}</h3>
                      </div>
                    </div>

                    <div className="mh-detail-body">
                      <p className="mh-detail-info">{MCC_STEPS[activeStep].info}</p>

                      {MCC_STEPS[activeStep].hasTable && (
                        <div className="mb-6 rounded-lg overflow-hidden border border-slate-200 shadow-sm text-sm">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700">
                                <th className="p-3 border-b border-r border-slate-200 font-bold">Process</th>
                                <th className="p-3 border-b border-r border-slate-200 font-bold text-center">AIIMS/JIPMER/15% AIQ (Open/EWS)</th>
                                <th className="p-3 border-b border-r border-slate-200 font-bold text-center">AIIMS/JIPMER/15% AIQ (Reserve/PWD)</th>
                                <th className="p-3 border-b border-slate-200 font-bold text-center bg-purple-50">DEEMED (All Candidates)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-white">
                                <td className="p-3 border-b border-r border-slate-200 font-semibold text-emerald-700 bg-emerald-50/30">Refundable</td>
                                <td className="p-3 border-b border-r border-slate-200 text-center font-medium">₹10,000/-</td>
                                <td className="p-3 border-b border-r border-slate-200 text-center font-medium">₹5,000/-</td>
                                <td className="p-3 border-b border-slate-200 text-center font-bold bg-purple-50/50">₹2,00,000/-</td>
                              </tr>
                              <tr className="bg-white">
                                <td className="p-3 border-r border-slate-200 font-semibold text-slate-700">Non-Refundable</td>
                                <td className="p-3 border-r border-slate-200 text-center font-medium">₹1,000/-</td>
                                <td className="p-3 border-r border-slate-200 text-center font-medium">₹500/-</td>
                                <td className="p-3 border-slate-200 text-center font-medium bg-purple-50/50">₹5,000/-</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="mh-checklist" style={{ maxWidth: '100%' }}>
                        {MCC_STEPS[activeStep].checklist.map((item, ci) => (
                          <div key={ci} className="mh-check-item">
                            <i className="fas fa-check-circle"></i>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mh-detail-note" style={{ maxWidth: '100%' }}>
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>{MCC_STEPS[activeStep].note}</span>
                      </div>
                    </div>

                    <div className="mh-detail-nav">
                      <button className="mh-nav-btn mh-nav-prev" onClick={() => { setActiveStep(Math.max(0, activeStep - 1)); setIsAutoPlaying(false); }} disabled={activeStep === 0}>
                        <i className="fas fa-arrow-left"></i> Prev
                      </button>
                      <button className="mh-nav-btn mh-nav-next" onClick={() => { setActiveStep(Math.min(MCC_STEPS.length - 1, activeStep + 1)); setIsAutoPlaying(false); }} disabled={activeStep === MCC_STEPS.length - 1}>
                        Next <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* MOBILE CYBER DARK THEME ACCORDION */}
              <div className="mh-mobile-container aiq-mobile-theme p-4 rounded-2xl w-full">
                <div className="mh-mobile-grid">
                  {MCC_STEPS.map((step, idx) => (
                    <div key={idx} className="mh-accordion-wrapper">
                      <button
                        className={`mh-mobile-item aiq-mobile-item ${activeStep === idx ? 'active' : ''}`}
                        onClick={() => { setActiveStep(idx); setIsAutoPlaying(false); }}
                        style={{ borderLeftColor: step.color, ...(activeStep === idx ? { boxShadow: `0 0 20px ${step.color}40` } : {}) }}
                      >
                        <div className="mh-mobile-num" style={{ background: step.color }}>{idx + 1}</div>
                        {step.icon === "₹" ? <span className="font-bold text-lg" style={{ color: step.color }}>₹</span> : <i className={`fas ${step.icon}`} style={{ color: step.color }}></i>}
                        <span>{step.title}</span>
                        <i className={`fas fa-chevron-${activeStep === idx ? 'up' : 'down'} mh-mobile-chevron`}></i>
                      </button>

                      {activeStep === idx && (
                        <div className="mh-mobile-detail-card aiq-mobile-card" style={{ borderColor: step.color }}>
                          <div className="mh-detail-header">
                            <div className="mh-detail-icon-wrap" style={{ background: step.color, color: '#fff' }}>
                              {step.icon === "₹" ? <span className="font-bold">₹</span> : <i className={`fas ${step.icon}`}></i>}
                            </div>
                            <div>
                              <div className="mh-detail-badge" style={{ color: step.color }}>
                                Step {idx + 1} of {MCC_STEPS.length}
                              </div>
                              <h3 className="mh-detail-title">{step.title}</h3>
                            </div>
                          </div>

                          <div className="mh-detail-body">
                            <p className="mh-detail-info">{step.info}</p>

                            {step.hasTable && (
                              <div className="mb-4 rounded overflow-x-auto border border-slate-700 shadow-sm text-xs text-slate-300">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                  <thead>
                                    <tr className="bg-slate-800">
                                      <th className="p-2 border-b border-r border-slate-700 font-bold">Process</th>
                                      <th className="p-2 border-b border-r border-slate-700 font-bold text-center">AIIMS/JIPMER (Open)</th>
                                      <th className="p-2 border-b border-r border-slate-700 font-bold text-center">AIIMS/JIPMER (Reserved)</th>
                                      <th className="p-2 border-b border-slate-700 font-bold text-center">DEEMED</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="bg-slate-800/50">
                                      <td className="p-2 border-b border-r border-slate-700 text-emerald-400 font-semibold">Refundable</td>
                                      <td className="p-2 border-b border-r border-slate-700 text-center font-medium">₹10,000/-</td>
                                      <td className="p-2 border-b border-r border-slate-700 text-center font-medium">₹5,000/-</td>
                                      <td className="p-2 border-b border-slate-700 text-center text-white font-bold bg-slate-700/50">₹2,00,000/-</td>
                                    </tr>
                                    <tr className="bg-slate-800/30">
                                      <td className="p-2 border-r border-slate-700 text-slate-400 font-semibold">Non-Refundable</td>
                                      <td className="p-2 border-r border-slate-700 text-center font-medium">₹1,000/-</td>
                                      <td className="p-2 border-r border-slate-700 text-center font-medium">₹500/-</td>
                                      <td className="p-2 border-slate-700 text-center font-medium bg-slate-700/50">₹5,000/-</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            )}

                            <div className="mh-checklist" style={{ maxWidth: '100%' }}>
                              {step.checklist.map((item, ci) => (
                                <div key={ci} className="mh-check-item">
                                  <i className="fas fa-check-circle text-emerald-400"></i>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>

                            <div className="mh-detail-note" style={{ maxWidth: '100%' }}>
                              <i className="fas fa-exclamation-triangle"></i>
                              <span>{step.note}</span>
                            </div>
                          </div>

                          <div className="mh-detail-nav mt-4">
                            <button className="mh-nav-btn mh-nav-prev aiq-nav-prev" onClick={() => { setActiveStep(Math.max(0, idx - 1)); setIsAutoPlaying(false); }} disabled={idx === 0}>
                              <i className="fas fa-arrow-left"></i> Prev
                            </button>
                            <button className="mh-nav-btn mh-nav-next aiq-nav-next" onClick={() => { setActiveStep(Math.min(MCC_STEPS.length - 1, idx + 1)); setIsAutoPlaying(false); }} disabled={idx === MCC_STEPS.length - 1}>
                              Next <i className="fas fa-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── OTHER STATES TAB: Master Architect Dashboard ── */}
          {activeTab === 2 && (
            <>
              {/* DESKTOP PORTAL VIEW: Strictly isolated for screens > 860px */}
              <div className="os-desktop-only-view">
                <div className="os-container">
                  {/* SIDEBAR */}
                  <div className="os-sidebar">
                    <div className="os-sidebar-title">Other States</div>
                    {Object.keys(OTHER_STATES_DATA).map((code) => {
                      const stateData = OTHER_STATES_DATA[code];
                      return (
                        <button
                          key={code}
                          className={`os-state-btn ${activeOsState === code ? 'active' : ''}`}
                          onClick={() => handleOsStateChange(code)}
                          style={activeOsState === code ? { color: stateData.color, borderLeftColor: stateData.color } : {}}
                        >
                          <div className="os-state-btn-icon" style={{ color: activeOsState === code ? stateData.color : '#64748b' }}>
                            <i className={`fas ${stateData.icon}`}></i>
                          </div>
                          <span className="os-state-code">{code}</span>
                          <span className="os-state-name">{stateData.name}</span>
                        </button>
                      );
                    })}
                    <div className="os-sidebar-cta">
                      <span className="os-pulsing-dot"></span>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-light)', marginBottom: '3px' }}>Paid Counselling</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 'bold' }}>{PHONE}</div>
                    </div>
                  </div>

                  {/* MAIN PANEL */}
                  <div className="os-main">
                    {isOsSwitching && <div className="os-bloom-overlay active" style={{ background: bloomColor }}></div>}

                    {activeOsState === null ? (
                      <div className="os-empty-state">
                        <div className="os-empty-map">
                          <i className="fas fa-map-marked-alt"></i>
                          <div className="os-empty-node"></div>
                          <div className="os-empty-node"></div>
                          <div className="os-empty-node"></div>
                          <div className="os-empty-node"></div>
                        </div>
                        <h3>Select a State</h3>
                        <p>Explore specialized counseling processes, fee structures, and detailed admission workflows across India. Our guidance ensures seamless multi-state strategy execution.</p>
                      </div>
                    ) : (
                      <div className={`os-content-wrapper ${isOsSwitching ? 'switching' : ''}`}>
                        {(() => {
                          const data = OTHER_STATES_DATA[activeOsState];
                          const currentStep = data.steps[activeOsStep];
                          const stateOrder = ['UP', 'KA', 'AP', 'TG'];
                          const currentIdx = stateOrder.indexOf(activeOsState);
                          const leftIdx = (currentIdx - 1 + stateOrder.length) % stateOrder.length;
                          const rightIdx = (currentIdx + 1) % stateOrder.length;
                          const leftStateKey = stateOrder[leftIdx];
                          const rightStateKey = stateOrder[rightIdx];
                          const leftStateData = OTHER_STATES_DATA[leftStateKey];
                          const rightStateData = OTHER_STATES_DATA[rightStateKey];
                          return (
                            <>
                              {/* TIER 1: Cyclical Switcher Header */}
                              <div className="os-switcher-header">
                                <button
                                  className="os-switcher-btn"
                                  onClick={() => handleOsStateChange(leftStateKey)}
                                  style={{ '--state-color': leftStateData.color }}
                                >
                                  <i className="fas fa-chevron-left"></i> {leftStateData.name}
                                </button>

                                <div className="os-switcher-center">
                                  <div className="os-header-badge" style={{ color: data.color }}>
                                    <span className="os-header-code" style={{ background: data.color, color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>{data.code}</span>
                                    <span>{data.name} State Process</span>
                                  </div>
                                  <h2>{data.name}</h2>
                                  <div className="os-header-links">
                                    {data.websites.map((url, i) => (
                                      <a key={i} href={`https://${url}`} target="_blank" rel="noreferrer" style={{ color: data.color }}>
                                        <i className="fas fa-external-link-alt mr-1"></i> {url}
                                      </a>
                                    ))}
                                  </div>
                                </div>

                                <button
                                  className="os-switcher-btn"
                                  onClick={() => handleOsStateChange(rightStateKey)}
                                  style={{ '--state-color': rightStateData.color }}
                                >
                                  {rightStateData.name} <i className="fas fa-chevron-right"></i>
                                </button>
                              </div>

                              {/* MOBILE: Scrollable step chips (hides on desktop) */}
                              <div className="os-mobile-steps">
                                {data.steps.map((step, idx) => (
                                  <div
                                    key={idx}
                                    id={`os-mob-step-${idx}`}
                                    className={`os-mobile-step-chip ${activeOsStep === idx ? 'active' : ''}`}
                                    style={activeOsStep === idx ? { color: step.color } : {}}
                                    onClick={() => setActiveOsStep(idx)}
                                  >
                                    <i className={`fas ${step.icon}`}></i>
                                    {step.title}
                                  </div>
                                ))}
                              </div>

                              {/* TIER 2: Co-Equal Split Grid */}
                              <div className="os-tier-2-grid">
                                {/* Left Column: Standalone SVG Flower Petal Wheel */}
                                <div className="os-flower-wheel">
                                  <svg viewBox="0 0 520 520">
                                    <defs>
                                      {/* Gradients for each petal segment */}
                                      {data.steps.map((step, idx) => (
                                        <linearGradient key={`grad-${idx}`} id={`petal-grad-${activeOsState}-${idx}`}
                                          x1="0%" y1="0%" x2="100%" y2="100%">
                                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                                          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.6" />
                                          <stop offset="100%" stopColor={step.color} stopOpacity="0.25" />
                                        </linearGradient>
                                      ))}
                                      {data.steps.map((step, idx) => (
                                        <linearGradient key={`agrad-${idx}`} id={`petal-active-grad-${activeOsState}-${idx}`}
                                          x1="0%" y1="0%" x2="100%" y2="100%">
                                          <stop offset="0%" stopColor={step.color} stopOpacity="0.15" />
                                          <stop offset="40%" stopColor={step.color} stopOpacity="0.35" />
                                          <stop offset="100%" stopColor={step.color} stopOpacity="0.6" />
                                        </linearGradient>
                                      ))}
                                    </defs>

                                    {/* Outer decorative ring */}
                                    <circle cx="260" cy="260" r="230" fill="none" stroke="rgba(13,45,78,0.04)" strokeWidth="1" />
                                    <circle cx="260" cy="260" r="215" fill="none" stroke="rgba(13,45,78,0.03)" strokeWidth="0.5" strokeDasharray="4,4" />

                                    {/* Fan Petal Segments */}
                                    {data.steps.map((step, idx) => {
                                      const n = data.steps.length;
                                      const gapDeg = 5;
                                      const segDeg = (360 / n) - gapDeg;
                                      const startDeg = idx * (360 / n) - 90 + gapDeg / 2;
                                      const endDeg = startDeg + segDeg;
                                      const startRad = startDeg * Math.PI / 180;
                                      const endRad = endDeg * Math.PI / 180;

                                      const innerR = 85;
                                      const outerR = 180;
                                      const cx = 260, cy = 260;

                                      const x1 = cx + innerR * Math.cos(startRad);
                                      const y1 = cy + innerR * Math.sin(startRad);
                                      const x2 = cx + innerR * Math.cos(endRad);
                                      const y2 = cy + innerR * Math.sin(endRad);
                                      const x3 = cx + outerR * Math.cos(endRad);
                                      const y3 = cy + outerR * Math.sin(endRad);
                                      const x4 = cx + outerR * Math.cos(startRad);
                                      const y4 = cy + outerR * Math.sin(startRad);

                                      const isActive = activeOsStep === idx;
                                      const largeArc = segDeg > 180 ? 1 : 0;

                                      const petalPath = `M${x1.toFixed(1)},${y1.toFixed(1)} A${innerR},${innerR} 0 ${largeArc},1 ${x2.toFixed(1)},${y2.toFixed(1)} L${x3.toFixed(1)},${y3.toFixed(1)} A${outerR},${outerR} 0 ${largeArc},0 ${x4.toFixed(1)},${y4.toFixed(1)} Z`;

                                      // Midpoint angle for positioning badges and labels
                                      const midDeg = (startDeg + endDeg) / 2;
                                      const midRad = midDeg * Math.PI / 180;

                                      // Icon position (on the petal)
                                      const iconR = 138;
                                      const iconX = cx + iconR * Math.cos(midRad);
                                      const iconY = cy + iconR * Math.sin(midRad);

                                      // Step badge position (at outer edge)
                                      const badgeR = 198;
                                      const badgeX = cx + badgeR * Math.cos(midRad);
                                      const badgeY = cy + badgeR * Math.sin(midRad);

                                      // Label position (outside the wheel)
                                      const labelR = 245;
                                      const labelX = cx + labelR * Math.cos(midRad);
                                      const labelY = cy + labelR * Math.sin(midRad);
                                      const isRightSide = Math.cos(midRad) >= 0;
                                      const textAnchor = isRightSide ? 'start' : 'end';

                                      return (
                                        <g key={idx} onClick={() => setActiveOsStep(idx)} style={{ cursor: 'pointer' }}>
                                          {/* Petal Segment */}
                                          <path
                                            className={`os-petal-segment ${isActive ? 'active' : ''}`}
                                            d={petalPath}
                                            fill={isActive ? `url(#petal-active-grad-${activeOsState}-${idx})` : `url(#petal-grad-${activeOsState}-${idx})`}
                                            stroke={isActive ? step.color : 'rgba(13,45,78,0.08)'}
                                            strokeWidth={isActive ? '2.5' : '1.2'}
                                          />

                                          {/* Colored outer edge arc (thick accent) */}
                                          <path
                                            d={`M${x4.toFixed(1)},${y4.toFixed(1)} A${outerR},${outerR} 0 ${largeArc},1 ${x3.toFixed(1)},${y3.toFixed(1)}`}
                                            fill="none"
                                            stroke={step.color}
                                            strokeWidth={isActive ? '5' : '3.5'}
                                            strokeLinecap="round"
                                            style={{ transition: 'all 0.3s', opacity: isActive ? 1 : 0.7 }}
                                          />

                                          {/* Icon circle on the petal */}
                                          <circle
                                            cx={iconX.toFixed(1)} cy={iconY.toFixed(1)} r="18"
                                            fill={isActive ? step.color : '#ffffff'}
                                            stroke={isActive ? '#ffffff' : step.color}
                                            strokeWidth="2"
                                            className="os-step-icon-circle"
                                            style={{ filter: isActive ? `drop-shadow(0 3px 8px ${step.color}60)` : 'none' }}
                                          />
                                          <g transform={`translate(${(Number(iconX) - 10).toFixed(1)}, ${(Number(iconY) - 10).toFixed(1)})`}>
                                            {renderSvgIcon(step.icon, isActive ? '#ffffff' : step.color, 20)}
                                          </g>

                                          {/* Step Number Badge */}
                                          <circle
                                            cx={badgeX.toFixed(1)} cy={badgeY.toFixed(1)} r={isActive ? '16' : '14'}
                                            fill={step.color}
                                            className="os-step-badge-circle"
                                            style={{ filter: `drop-shadow(0 2px 6px ${step.color}80)` }}
                                          />
                                          <text
                                            x={badgeX.toFixed(1)} y={badgeY.toFixed(1) - 1}
                                            className="os-step-badge-text"
                                            style={{ fontSize: '7px', letterSpacing: '0.5px' }}
                                          >STEP</text>
                                          <text
                                            x={badgeX.toFixed(1)} y={Number(badgeY.toFixed(1)) + 7}
                                            className="os-step-badge-text"
                                            style={{ fontSize: '12px' }}
                                          >{String(idx + 1).padStart(2, '0')}</text>

                                          {/* Step Label (radiating outward) */}
                                          <g className={`os-step-label-group ${isActive ? 'active' : ''}`}>
                                            <text
                                              x={labelX.toFixed(1)} y={labelY.toFixed(1) - 5}
                                              textAnchor={textAnchor}
                                              className="os-step-label-title"
                                              style={{ fill: isActive ? step.color : 'var(--primary)' }}
                                            >{step.title}</text>
                                            <text
                                              x={labelX.toFixed(1)} y={Number(labelY.toFixed(1)) + 8}
                                              textAnchor={textAnchor}
                                              className="os-step-label-desc"
                                            >{getShortDesc(step.title, step.desc)}</text>
                                          </g>
                                        </g>
                                      );
                                    })}

                                    {/* Flow arrows between segments */}
                                    {data.steps.map((step, idx) => {
                                      const n = data.steps.length;
                                      const gapDeg = 5;
                                      const segDeg = (360 / n) - gapDeg;
                                      const endDeg = idx * (360 / n) - 90 + gapDeg / 2 + segDeg;
                                      const nextStartDeg = (idx + 1) * (360 / n) - 90 + gapDeg / 2;
                                      const midGapDeg = (endDeg + nextStartDeg) / 2;
                                      const midGapRad = midGapDeg * Math.PI / 180;
                                      const arrowR = 180;
                                      const arrowX = 260 + arrowR * Math.cos(midGapRad);
                                      const arrowY = 260 + arrowR * Math.sin(midGapRad);
                                      const rotAngle = midGapDeg + 90;
                                      if (idx === n - 1) return null;
                                      return (
                                        <g key={`arrow-${idx}`} className="os-flow-arrow">
                                          <polygon
                                            points={`${arrowX},${arrowY - 6} ${arrowX + 4},${arrowY + 3} ${arrowX - 4},${arrowY + 3}`}
                                            fill={data.steps[(idx + 1) % n].color}
                                            transform={`rotate(${rotAngle}, ${arrowX.toFixed(1)}, ${arrowY.toFixed(1)})`}
                                            style={{ opacity: 0.65 }}
                                          />
                                        </g>
                                      );
                                    })}

                                    {/* Central Hub */}
                                    <circle cx="260" cy="260" r="78" fill="#ffffff" stroke="rgba(13,45,78,0.06)" strokeWidth="1.5" />
                                    <circle cx="260" cy="260" r="72" fill="none" stroke={data.color} strokeWidth="2" opacity="0.2" />
                                    <circle cx="260" cy="260" r="68" fill="none" stroke={data.color} strokeWidth="0.5" opacity="0.1" strokeDasharray="3,3" />

                                    {/* Decorative silhouette pattern */}
                                    <path d="M 230,238 q 8,-8 15,-4 t 15,4 t 15,-8 t 8,15 t -22,8 t -31,-15 Z" fill={data.color} opacity="0.06" />

                                    <text x="260" y="228" className="os-central-hub-label">STATE</text>
                                    <text x="260" y="260" className="os-central-hub-code" style={{ fill: data.color, filter: `drop-shadow(0 0 6px ${data.color}40)` }}>{data.code}</text>
                                    <text x="260" y="280" className="os-central-hub-name">{data.name}</text>

                                    {/* Counselling sub-label */}
                                    <text x="260" y="294" style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fill: 'var(--text-light)', textAnchor: 'middle', letterSpacing: '1.5px', fontWeight: '600' }}>COUNSELLING</text>
                                  </svg>
                                </div>

                                {/* Right Column: Detailed Checklist/Warning Card */}
                                <div className="os-summary-card" key={`card-${activeOsState}-${activeOsStep}`} style={{ '--step-color': currentStep.color, borderLeftColor: currentStep.color }}>
                                  {/* Top Header Section */}
                                  <div className="os-summary-top-row">
                                    <div className="os-summary-left">
                                      <div className="os-summary-badge" style={{ background: currentStep.color }}>
                                        0{activeOsStep + 1}
                                      </div>
                                      <div className="os-summary-info">
                                        <div className="os-summary-step" style={{ color: currentStep.color }}>STEP 0{activeOsStep + 1}</div>
                                        <h4 className="os-summary-title">{currentStep.title}</h4>
                                        <p className="os-summary-subtitle">{currentStep.actionSummary}</p>
                                      </div>
                                    </div>
                                    {currentStep.pill && (
                                      <div className="os-summary-pill" style={{ borderColor: `${currentStep.color}60`, color: currentStep.color }}>
                                        {currentStep.pill}
                                      </div>
                                    )}
                                  </div>

                                  {/* Middle Checklist Section */}
                                  <div className="os-summary-mid-row" style={{ marginTop: '10px' }}>
                                    <div className="mh-checklist" style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      {currentStep.checklist.map((item, ci) => (
                                        <div key={ci} className="mh-check-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                          <i className="fas fa-check-circle text-emerald-500" style={{ marginTop: '3px' }}></i>
                                          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '500' }}>{item}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Warning Section */}
                                  <div className="os-summary-mid-row">
                                    <div className="os-warning-box">
                                      <i className="fas fa-exclamation-triangle"></i>
                                      <div className="os-warning-text">
                                        <span className="os-warning-label">CRITICAL REQUIREMENT</span>
                                        <p className="os-warning-note">{currentStep.note}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Bottom Navigation Section */}
                                  <div className="os-summary-nav-row">
                                    <button
                                      className="os-nav-prev-btn"
                                      onClick={() => activeOsStep > 0 && setActiveOsStep(activeOsStep - 1)}
                                      disabled={activeOsStep === 0}
                                    >
                                      <i className="fas fa-arrow-left"></i> Prev
                                    </button>
                                    <button
                                      className="os-nav-next-btn"
                                      style={{
                                        background: `linear-gradient(135deg, ${currentStep.color}, ${currentStep.color}dd)`
                                      }}
                                      onClick={() => activeOsStep < data.steps.length - 1 && setActiveOsStep(activeOsStep + 1)}
                                      disabled={activeOsStep === data.steps.length - 1}
                                    >
                                      Next <i className="fas fa-arrow-right"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* TIER 3: Bottom Stats Grid */}
                              <div className="os-stats-section-title" style={{ marginTop: '20px' }}>
                                <i className="fas fa-chart-bar" style={{ color: data.color }}></i>
                                Key Statistics &amp; Fee Details ({data.name})
                              </div>
                              <div className="os-stats-grid-premium">
                                {data.stats.map((stat, idx) => {
                                  const isLastAndOdd = idx === data.stats.length - 1 && data.stats.length % 2 !== 0;
                                  return (
                                    <div
                                      key={idx}
                                      className="os-stats-card-premium"
                                      style={{
                                        '--accent-color': stat.color,
                                        gridColumn: isLastAndOdd ? 'span 2' : 'auto'
                                      }}
                                    >
                                      <div className="os-stats-card-icon-wrap" style={{ color: stat.color, background: `${stat.color}10` }}>
                                        <i className={`fas ${getStatIcon(stat.label)}`}></i>
                                      </div>
                                      <div className="os-stats-card-content">
                                        <span className="os-stats-card-label">{stat.label}</span>
                                        <span className="os-stats-card-value">{stat.value}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* TIER 4: Premium Bottom CTA Banner */}
                              <div className="os-premium-cta-banner">
                                <div className="os-cta-content">
                                  <h3 className="os-cta-title">Unlock Premium Counselling &amp; Seat Strategy</h3>
                                  <p className="os-cta-desc">Get personalized, end-to-end guidance for medical admissions across multiple states from our elite consultants.</p>
                                </div>
                                <div className="os-cta-actions">
                                  <a href={`tel:${PHONE}`} className="os-cta-btn call">
                                    <i className="fas fa-phone-alt"></i> Call {PHONE}
                                  </a>
                                  <a href="https://wa.me/918832300031" target="_blank" rel="noreferrer" className="os-cta-btn wa">
                                    <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                                  </a>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* MOBILE PORTAL VIEW: Refactored for screens < 860px */}
              <div className="os-mobile-only-view">
                <div className="os-container">
                  {/* SIDEBAR */}
                  <div className="os-sidebar">
                    <div className="os-sidebar-title">Other States</div>
                    {Object.keys(OTHER_STATES_DATA).map((code) => {
                      const stateData = OTHER_STATES_DATA[code];
                      return (
                        <button
                          key={code}
                          className={`os-state-btn ${activeOsState === code ? 'active' : ''}`}
                          onClick={() => handleOsStateChange(code)}
                          style={activeOsState === code ? { color: stateData.color, borderLeftColor: stateData.color } : {}}
                        >
                          <div className="os-state-btn-icon" style={{ color: activeOsState === code ? stateData.color : '#64748b' }}>
                            <i className={`fas ${stateData.icon}`}></i>
                          </div>
                          <span className="os-state-code">{code}</span>
                          <span className="os-state-name">{stateData.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* MAIN PANEL */}
                  <div className="os-main">
                    {isOsSwitching && <div className="os-bloom-overlay active" style={{ background: bloomColor }}></div>}

                    {activeOsState !== null && (() => {
                      const data = OTHER_STATES_DATA[activeOsState];
                      const currentStep = data.steps[activeOsStep];
                      return (
                        <div className={`os-content-wrapper ${isOsSwitching ? 'switching' : ''}`}>
                          {/* Mobile Header Badge & State Title & Website Links */}
                          <div className="os-mobile-header">
                            <div className="os-mobile-header-badge" style={{ color: data.color }}>
                              <span className="os-mobile-header-code" style={{ background: data.color, color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>{data.code}</span>
                              <span>{data.name} State Process</span>
                            </div>
                            <h2 className="os-mobile-title" style={{ margin: '8px 0', fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>{data.name}</h2>
                            <div className="os-mobile-header-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start', marginBottom: '15px' }}>
                              {data.websites.map((url, i) => (
                                <a key={i} href={`https://${url}`} target="_blank" rel="noreferrer" style={{ color: data.color, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <i className="fas fa-external-link-alt"></i> {url}
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* INVERTED DISPLAY HIERARCHY: Stats Grid in 2x2 stack */}
                          <div
                            className="os-mobile-stats-grid"
                            onMouseEnter={() => setIsUserInteractingStats(true)}
                            onTouchStart={() => setIsUserInteractingStats(true)}
                          >
                            {data.stats.map((stat, idx) => {
                              const isHostelCard = idx === 6 || stat.label.toLowerCase().includes('hostel');
                              return (
                                <div
                                  key={idx}
                                  className={`os-mobile-stats-card ${activeStatTourIdx === idx ? 'tour-active' : ''}`}
                                  style={{
                                    borderLeft: `4px solid ${stat.color}`,
                                    gridColumn: isHostelCard ? 'span 2' : 'auto',
                                    '--stat-color': stat.color,
                                    '--stat-color-glow': `${stat.color}25`,
                                    '--stat-color-pulse': `${stat.color}1a`
                                  }}
                                  onMouseEnter={() => handleStatsInteraction(idx)}
                                  onTouchStart={() => handleStatsInteraction(idx)}
                                >
                                  <div className="os-mobile-stats-icon-wrap" style={{ color: stat.color, background: `${stat.color}10` }}>
                                    <i className={`fas ${getStatIcon(stat.label)}`}></i>
                                  </div>
                                  <div className="os-mobile-stats-content">
                                    <span className="os-mobile-stats-label">{stat.label}</span>
                                    <span className="os-mobile-stats-value">{stat.value}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* CALL-TO-ACTION Workflow Trigger Button */}
                          <button
                            className="os-mobile-cta-trigger"
                            style={{
                              background: `linear-gradient(135deg, ${data.color}, ${data.color}dd)`,
                              '--pulse-color': `${data.color}80`
                            }}
                            onClick={() => setShowProcessModal(true)}
                          >
                            👉 Click Here to Understand Admission Process
                          </button>

                          {/* Bottom Premium CTA Banner */}
                          <div className="os-premium-cta-banner">
                            <div className="os-cta-content">
                              <h3 className="os-cta-title">Unlock Premium Counselling &amp; Seat Strategy</h3>
                              <p className="os-cta-desc">Get personalized, end-to-end guidance for medical admissions across multiple states from our elite consultants.</p>
                            </div>
                            <div className="os-cta-actions">
                              <a href={`tel:${PHONE}`} className="os-cta-btn call">
                                <i className="fas fa-phone-alt"></i> Call {PHONE}
                              </a>
                              <a href="https://wa.me/918832300031" target="_blank" rel="noreferrer" className="os-cta-btn wa">
                                <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>


                {/* IMMERSIVE PROCESS MODAL POPUP WINDOW */}
                {activeOsState !== null && showProcessModal && (() => {
                  const data = OTHER_STATES_DATA[activeOsState];
                  const currentStep = data.steps[activeOsStep];
                  return (
                    <div className="os-modal-backdrop" onClick={() => setShowProcessModal(false)}>
                      <div className="os-modal-card" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="os-modal-header">
                          <span className="os-modal-header-title" style={{ color: data.color }}>
                            {data.name} Admission Process
                          </span>
                          <button className="os-modal-close-btn" onClick={() => setShowProcessModal(false)}>
                            <i className="fas fa-times"></i>
                          </button>
                        </div>

                        {/* Modal Body: completely unclipped vertical stack */}
                        <div className="os-modal-body">
                          <div className="os-modal-step-info" style={{ textAlign: 'left' }}>
                            <div className="os-modal-step-badge" style={{ color: currentStep.color, fontSize: '0.82rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                              Step 0{activeOsStep + 1} of 06
                            </div>
                            <h3 className="os-modal-step-title" style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--primary)', margin: '0 0 6px 0', lineHeight: '1.25' }}>
                              {currentStep.title}
                            </h3>
                            <p className="os-modal-step-subtitle" style={{ fontSize: '0.88rem', color: 'var(--text-light)', margin: '0 0 16px 0', fontWeight: '500', lineHeight: '1.4' }}>
                              {currentStep.actionSummary}
                            </p>
                          </div>

                          {/* Checklist */}
                          <div className="os-modal-checklist" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {currentStep.checklist.map((item, ci) => (
                              <div key={ci} className="os-modal-check-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <i className="fas fa-check-circle text-emerald-500" style={{ fontSize: '1.05rem', marginTop: '2px' }}></i>
                                <span style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: '500', lineHeight: '1.4' }}>{item}</span>
                              </div>
                            ))}
                          </div>

                          {/* Yellow Warning Box */}
                          <div className="os-modal-warning-box" style={{ marginTop: '8px' }}>
                            <i className="fas fa-exclamation-triangle"></i>
                            <div className="os-modal-warning-text">
                              <span className="os-modal-warning-label">CRITICAL REQUIREMENT</span>
                              <p className="os-modal-warning-note" style={{ margin: 0 }}>{currentStep.note}</p>
                            </div>
                          </div>
                        </div>

                        {/* Modal Footer: Touch-Accessible Navigation Rim */}
                        <div className="os-modal-footer">
                          <button
                            className="os-modal-nav-btn prev"
                            onClick={() => activeOsStep > 0 && setActiveOsStep(activeOsStep - 1)}
                            disabled={activeOsStep === 0}
                          >
                            <i className="fas fa-arrow-left"></i> Prev
                          </button>
                          <button
                            className="os-modal-nav-btn next"
                            style={{
                              background: `linear-gradient(135deg, ${currentStep.color}, ${currentStep.color}dd)`,
                              '--btn-shadow': `${currentStep.color}30`
                            }}
                            onClick={() => activeOsStep < data.steps.length - 1 && setActiveOsStep(activeOsStep + 1)}
                            disabled={activeOsStep === data.steps.length - 1}
                          >
                            Next <i className="fas fa-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {/* ── OTHER TABS: Original Layout ── */}
          {activeTab > 2 && (
            <div className="process-content">
              <div className="steps-nav reveal">
                {PROCESS_TABS[activeTab].steps.map((step, i) => (
                  <button
                    key={i}
                    className={`step-pill ${activeStep === i ? 'active' : ''}`}
                    onClick={() => setActiveStep(i)}
                  >
                    <span className="num">{i + 1}</span>
                    <span>{step.title}</span>
                  </button>
                ))}
              </div>

              <div className="step-detail" key={`${activeTab}-${activeStep}`}>
                <span className="step-tag">Step {activeStep + 1} of {PROCESS_TABS[activeTab].steps.length}</span>
                <h3>{PROCESS_TABS[activeTab].steps[activeStep].title}</h3>
                <p>{PROCESS_TABS[activeTab].steps[activeStep].desc}</p>
                <div className="step-note">
                  <h4><i className="fas fa-exclamation-triangle"></i> Important Note</h4>
                  <p style={{ margin: 0 }}>{PROCESS_TABS[activeTab].steps[activeStep].note}</p>
                </div>
                {activeStep < PROCESS_TABS[activeTab].steps.length - 1 && (
                  <button
                    className="btn-premium btn-primary"
                    style={{ marginTop: '40px', padding: '12px 30px', fontSize: '0.9rem' }}
                    onClick={() => setActiveStep(activeStep + 1)}
                  >
                    Next Step <i className="fas fa-arrow-right"></i>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE US */}
      <section className="why-us">
        <div className="container">
          <div className="section-header reveal" style={{ color: 'white' }}>
            <span style={{ color: 'var(--accent)', background: 'rgba(233, 168, 37, 0.1)' }}>Our Proven Track Record</span>
            <h2 style={{ color: 'white' }}>Personalized Guidance. Proven Results.</h2>
          </div>

          <div className="why-grid">
            {WHY_CHOOSE_US.map((item, i) => (
              <div key={i} className="why-card reveal" style={{ transitionDelay: `${i * 150}ms` }}>
                <i className={`fas ${item.icon}`}></i>
                <span className="why-stat">{item.stat}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== COMPREHENSIVE BRAND FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">

            {/* Brand column */}
            <div className="lp-footer-brand">
              <img src="/landing-assets/images/branding/logo1.png" alt="Admissions Made Easy" className="lp-footer-brand-logo" />
              <p>Maharashtra's most trusted Medical & Engineering admissions consultancy. Guiding students and families since 2011 across 5 branches.</p>
              <div className="lp-social-links">
                {[["fab fa-facebook-f", "https://www.facebook.com/admissionsmadeeasy"], ["fab fa-instagram", "https://www.instagram.com/admissionsmadeeasy"], ["fab fa-youtube", "https://www.youtube.com/@sachinbangad21"], ["fab fa-linkedin-in", "https://www.linkedin.com/company/admissions-made-easy"]].map(([icon, url]) => (
                  <a key={icon} href={url} className="lp-social-link" target="_blank" rel="noopener noreferrer"><i className={icon}></i></a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lp-footer-col">
              <h5>Quick Links</h5>
              <ul className="lp-footer-links">
                <li><a href="/"><i className="fas fa-chevron-right"></i> Home</a></li>
                <li><a href="/#lp-services"><i className="fas fa-chevron-right"></i> Our Services</a></li>
                <li><a href="/#lp-handbooks"><i className="fas fa-chevron-right"></i> Handbooks 2026</a></li>
                <li><a href="/#lp-process"><i className="fas fa-chevron-right"></i> Admission Process</a></li>
                <li><a href="/#lp-students"><i className="fas fa-chevron-right"></i> Our Results</a></li>
                <li><a href="/#lp-contact"><i className="fas fa-chevron-right"></i> Branches</a></li>
              </ul>
            </div>

            {/* Downloads */}
            <div className="lp-footer-col">
              <h5>Downloads</h5>
              <ul className="lp-footer-links">
                <li><a href="/landing-assets/handbooks/med-2026.pdf" download><i className="fas fa-file-pdf"></i> NEET UG 2026 Handbook</a></li>
                <li><a href="/landing-assets/handbooks/engg-2026.pdf" download><i className="fas fa-file-pdf"></i> Engineering 2026 Handbook</a></li>
                <li><a href="https://forms.gle/ns7NxapvAda6mEnBA" target="_blank" rel="noopener noreferrer"><i className="fas fa-calendar-check"></i> Book Free Counselling Session</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="lp-footer-col">
              <h5>Contact Us</h5>
              <div className="lp-footer-contact-item"><i className="fas fa-map-marker-alt"></i><span>Shivaji Nagar, Latur — 413512 (HQ)</span></div>
              <div className="lp-footer-contact-item"><i className="fas fa-phone"></i><span>+91 93095 53235<br />+91 99708 09003</span></div>
              <div className="lp-footer-contact-item"><i className="fas fa-envelope"></i><span>sachinbangad2020@gmail.com</span></div>
              <div className="lp-footer-contact-item"><i className="fas fa-clock"></i><span>Mon–Sat: 11AM – 9PM<br />Sunday: 11AM – 5PM</span></div>
            </div>

          </div>

          <div className="lp-footer-bottom">
            <p>© 2026 Admissions Made Easy, Latur. All Rights Reserved.</p>
            <div className="lp-footer-policy-links">
              <a href="/#lp-home">Privacy Policy</a>
              <a href="/#lp-home">Refund Policy</a>
              <a href="/#lp-home">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
