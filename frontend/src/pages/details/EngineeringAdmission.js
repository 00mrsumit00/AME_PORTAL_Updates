import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

/* --- DATA CONSTANTS ------------------------------------------------------ */
const ADMISSION_STATS = [
  { label: <>Selections in <span className="highlight-course">IITs & NITs</span></>, value: 245, suffix: "+", icon: "fa-microchip" },
  { label: <>Top Tier <span className="highlight-course">State Govt.</span> Seats</>, value: 580, suffix: "+", icon: "fa-university" },
  { label: <>Top <span className="highlight-course">Private Tech</span> Institutes</>, value: 1250, suffix: "+", icon: "fa-laptop-code" },
  { label: "Years of Trust & Excellence", value: 15, suffix: "+", icon: "fa-shield-alt" }
];

const ENG_PROCESS_TABS = [
  {
    id: "mhtcet",
    label: "Maharashtra CAP Process",
    icon: "fa-map-marked-alt",
    title: "MHT-CET State Counselling",
    steps: [
      { title: "Registration", desc: "Create an account and register for the Centralized Admission Process (CAP). Ensure all personal and category details match your certificates.", note: "Registration deadlines are extremely strict." },
      { title: "Document Verification", desc: "Upload necessary documents like Domicile, Caste Certificate, NCL, Income Certificate. Clear any discrepancies raised by the E-Scrutiny center immediately.", note: "Invalid documents can push you into the OPEN category." },
      { title: "Merit List", desc: "Check your State General Merit Number and Category Merit Number. Submit grievances if there are calculation errors in your percentile.", note: "Your state rank dictates your exact college options." },
      { title: "Option Form Filling", desc: "Select and arrange your preferred colleges and branches (CS, IT, ENTC, etc.). The order of preference is critical.", note: "If you get your 1st preference, you are auto-freezed and MUST take admission." },
      { title: "Seat Allotment", desc: "Analyze your allotted seat. Choose 'Freeze' to lock it, or 'Float' to hold it and try for a better college in the next round.", note: "Seat Acceptance Fee must be paid to retain your seat." },
      { title: "Reporting to Institute", desc: "Visit the allotted engineering college with original documents and pay the remaining tuition fees.", note: "Failing to report cancels your admission entirely." },
      { title: "Management Quota", desc: "For the 20% institutional quota seats and any seats remaining vacant after CAP Round 3. Admissions are conducted directly by the individual engineering colleges on a merit basis.", note: "Admissions are strictly based on merit at the college level. Always refer to official college seat vacancy advertisements." }
    ]
  },
  {
    id: "josaa",
    label: "JoSAA / CSAB (IITs, NITs)",
    icon: "fa-globe",
    title: "All India JoSAA Counselling",
    steps: [
      { title: "JEE Results", desc: "Verify and secure your JEE Main & Advanced rank scorecards. Only Advanced rankers can opt for IITs, while Main rankers qualify for NITs, IIITs, and GFTIs.", note: "Double check that your category rank matches your documents." },
      { title: "JoSAA Registration", desc: "Register on the JoSAA portal and fill college preferences. You can access hundreds of courses across 121 premier technical institutes.", note: "Never add choices you do not want to join. Choice order is absolute." },
      { title: "Mock Allotments", desc: "Analyze the mock allotments to gauge your admission chances. Use this time to rearrange and optimize your choice-filling preferences.", note: "Mock results are highly predictive but not legally binding." },
      { title: "Seat Allotments", desc: "Review allotments across 6 rounds. Upon allotment, download the provisional offer letter and immediately proceed to acceptance.", note: "Failure to pay seat acceptance fee leads to forfeiture." },
      { title: "Online Reporting", desc: "Upload required documents (medical certificates, marksheets, category cards) and pay seat fees for online scrutiny.", note: "Track the portal actively to respond to verification queries." },
      { title: "Freeze / Float / Slide", desc: "Select your willingness status: Freeze to lock, Float to accept but try other colleges, or Slide for a better branch in the same college.", note: "Understand float and slide rules before choosing." },
      { title: "CSAB Special Rounds", desc: "Participate in vacant seat allocation rounds for NITs, IIITs, and GFTIs after the main JoSAA rounds conclude.", note: "CSAB requires a fresh registration fee and is high-risk, high-reward." }
    ]
  },
  {
    id: "private",
    label: "Deemed & Private Univs",
    icon: "fa-building",
    title: "Top Private Universities",
    steps: [
      { title: "Separate Entrance Exams", desc: "Register for exams like BITSAT, VITEEE, SRMJEEE, MIT-WPU CET, and Symbiosis SET. Each has its own syllabus and pattern.", note: "Keep track of multiple exam dates and overlapping schedules." },
      { title: "Institutional Counselling", desc: "Each deemed university conducts its own independent counselling rounds, usually immediately after their results are declared.", note: "Requires separate counselling fees and rapid decision making." }
    ]
  }
];

const PRIVATE_UNIVERSITIES = [
  { name: "Bharati Vidyapeeth", location: "Pune", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_1.png" },
  { name: "DES Pune University", location: "Pune", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_2.png" },
  { name: "DY Patil International", location: "Akurdi Pune", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_3.png" },
  { name: "JSPM University", location: "Pune", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_4.png" },
  { name: "MIT-ADT University", location: "Pune", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_5.png" },
  { name: "MIT World Peace Univ", location: "Pune", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_6.png" },
  { name: "MNR University", location: "Hyderabad", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_7.png" },
  { name: "Parul University", location: "Vadodara, Gujarat", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_8.png" },
  { name: "PCU / PCET", location: "Pimpri Chinchwad", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_9.png" },
  { name: "Sanjay Ghodawat", location: "Kolhapur", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_10.png" },
  { name: "Somaiya Vidyavihar", location: "Mumbai", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_11.png" },
  { name: "SRM Institute", location: "Chennai / NCR", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_12.png" },
  { name: "Symbiosis Skills & Pro", location: "Pune", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_13.png" },
  { name: "S R University", location: "Warangal", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_14.png" },
  { name: "Vishwakarma Univ", location: "Pune", logo: "/landing-assets/images/updates/private-universities/official_logos/official_logo_15.png" }
];

const ENG_ACHIEVER_IMAGES = [
  "/landing-assets/images/updates/IIT_NIT_Achievers_2025.jpg",
  "/landing-assets/images/updates/MH_STATE_Achievers_2025.jpg"
];

const ENG_TAB_COLORS = ['#0ea5e9', '#f59e0b', '#10b981'];

export default function EngineeringAdmission() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [currentCarouselIdx, setCurrentCarouselIdx] = useState(0);
  const [tickStep, setTickStep] = useState(0);

  const lastInteractionTimeRef = useRef(0);
  const lastStepChangeTimeRef = useRef(Date.now());

  const handleUserInteraction = () => {
    lastInteractionTimeRef.current = Date.now();
    lastStepChangeTimeRef.current = Date.now();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const interval = setInterval(() => {
      setTickStep(prev => (prev >= 10 ? 0 : prev + 1));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance process milestones every 10 seconds, pause for 2 mins on user interaction
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      // If user interacted less than 2 minutes (120,000ms) ago, pause auto-switching.
      if (now - lastInteractionTimeRef.current < 120000) {
        lastStepChangeTimeRef.current = now;
        return;
      }

      // If 10 seconds have passed since last change or interaction, advance the step.
      if (now - lastStepChangeTimeRef.current >= 10000) {
        setActiveStep(prev => {
          const totalSteps = ENG_PROCESS_TABS[activeTab].steps.length;
          return (prev + 1) % totalSteps;
        });
        lastStepChangeTimeRef.current = now;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const openImageModal = (imgSrc) => {
    handleUserInteraction();
    setModalImage(imgSrc);
    setIsModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Engineering Admissions | MHT-CET, JEE, JoSAA Counselling</title>
        <meta name="description" content="Expert engineering admission guidance for B.Tech/B.E. Secure seats in IITs, NITs, COEP, VJTI, and top private universities through JoSAA and MHT-CET." />
      </Helmet>

      <style>{`
        :root {
          --eng-primary: #0ea5e9;
          --eng-secondary: #f59e0b;
          --eng-dark: #0f172a;
          --eng-card: #1e293b;
          --eng-text: #e2e8f0;
          --eng-glow: rgba(14, 165, 233, 0.5);
        }

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: var(--eng-dark);
          color: var(--eng-text);
          overflow-x: hidden;
        }

        /* --- HERO SECTION --- */
        .eng-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 2rem 2rem; /* Reduced padding to fit screen */
          text-align: center;
          overflow: hidden;
          background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
          box-sizing: border-box;
        }

        .eng-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: 
            linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px);
          animation: gridMove 20s linear infinite;
          pointer-events: none;
        }

        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(40px) translateZ(-200px); }
        }

        .eng-hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 1200px;
          width: 100%;
          animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .eng-chip {
          display: inline-block;
          padding: 0.4rem 1.5rem;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid var(--eng-primary);
          color: var(--eng-primary);
          border-radius: 50px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
          font-size: 0.85rem;
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
        }

        .eng-hero-title {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .eng-hero-title span {
          background: linear-gradient(to right, var(--eng-primary), #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px rgba(14, 165, 233, 0.4);
        }

        .eng-hero-desc {
          font-size: 1.1rem;
          color: #cbd5e1;
          line-height: 1.5;
          margin-bottom: 2rem;
          max-width: 750px;
        }

        .eng-hero-btns {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .eng-btn-primary, .eng-btn-secondary {
          padding: 0.85rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.05rem;
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          border: none;
        }

        .eng-btn-primary {
          background: var(--eng-primary);
          color: #fff;
          box-shadow: 0 10px 25px rgba(14, 165, 233, 0.4);
        }

        .eng-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(14, 165, 233, 0.6);
          background: #0284c7;
        }

        .eng-btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .eng-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
        }

        /* --- STATS SECTION --- */
        .eng-stats-wrap-inside {
          width: 100%;
          position: relative;
          z-index: 20;
        }

        .eng-stats-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .eng-stat-card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-top: 1px solid rgba(14, 165, 233, 0.3);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .eng-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          border-top: 1px solid var(--eng-primary);
        }

        .eng-stat-icon {
          font-size: 1.8rem;
          color: var(--eng-secondary);
          margin-bottom: 0.75rem;
        }

        .eng-stat-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 0.25rem;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }

        .eng-stat-label {
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.3;
        }

        /* --- HERO MOBILE OVERRIDES --- */
        @media (max-width: 768px) {
          .eng-hero {
            padding: 70px 1.25rem 1.5rem;
            min-height: auto;
          }

          .eng-hero-desc {
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
          }

          .eng-hero-btns {
            gap: 0.75rem;
            margin-bottom: 1.75rem;
            flex-direction: column;
            align-items: stretch;
          }

          .eng-btn-primary,
          .eng-btn-secondary {
            width: 100%;
            justify-content: center;
            padding: 0.8rem 1.25rem;
            font-size: 1rem;
          }

          /* 2x2 grid on mobile */
          .eng-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .eng-stat-card {
            padding: 1rem 0.75rem;
            border-radius: 12px;
          }

          .eng-stat-icon {
            font-size: 1.4rem;
            margin-bottom: 0.5rem;
          }

          .eng-stat-value {
            font-size: 1.75rem;
          }

          .eng-stat-label {
            font-size: 0.78rem;
          }
        }

        .highlight-course {
          color: var(--eng-primary);
          font-weight: 700;
        }

        /* ================================================================
           ENGINEERING PROCESS — MISSION CONTROL REDESIGN
           ================================================================ */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes engStepIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes engPillGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(14, 165, 233, 0); }
        }

        /* SECTION WRAPPER */
        .eng-mission-section {
          background: var(--eng-dark);
          padding: 6rem 2rem 5rem;
          position: relative;
          overflow: hidden;
        }

        .eng-mission-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 60% at 15% 50%, rgba(14,165,233,0.07) 0%, transparent 100%),
            radial-gradient(ellipse 55% 60% at 85% 50%, rgba(245,158,11,0.05) 0%, transparent 100%);
          pointer-events: none;
        }

        .eng-mission-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* SECTION HEADER */
        .eng-ms-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .eng-ms-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1.1rem;
          border-radius: 50px;
          background: rgba(14,165,233,0.1);
          border: 1px solid rgba(14,165,233,0.25);
          color: var(--eng-primary);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1.25rem;
        }

        .eng-ms-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .eng-ms-title em {
          font-style: normal;
          background: linear-gradient(90deg, #0ea5e9, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .eng-ms-subtitle {
          color: #94a3b8;
          font-size: 1.05rem;
          max-width: 620px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* TAB CARDS */
        .eng-ms-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .eng-ms-tab {
          background: rgba(255,255,255,0.03);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }

        .eng-ms-tab:hover {
          background: rgba(255,255,255,0.06);
          transform: translateY(-2px);
        }

        .eng-ms-tab-active {
          transform: translateY(-4px) !important;
          box-shadow: 0 18px 40px rgba(0,0,0,0.3);
        }

        .eng-ms-tab-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
          background: rgba(255,255,255,0.07);
          color: #64748b;
          transition: all 0.32s;
        }

        .eng-ms-tab-info { flex: 1; min-width: 0; }

        .eng-ms-tab-sub {
          display: block;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #475569;
          margin-bottom: 0.2rem;
          transition: color 0.3s;
        }

        .eng-ms-tab-active .eng-ms-tab-sub { color: rgba(255,255,255,0.55); }

        .eng-ms-tab-title {
          font-size: 0.92rem;
          font-weight: 800;
          color: #94a3b8;
          line-height: 1.3;
          transition: color 0.3s;
          display: block;
        }

        .eng-ms-tab-active .eng-ms-tab-title { color: #fff; }

        .eng-ms-tab-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.2rem 0.65rem;
          border-radius: 20px;
          background: rgba(255,255,255,0.07);
          color: #64748b;
          flex-shrink: 0;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .eng-ms-tab-active .eng-ms-tab-badge { background: rgba(255,255,255,0.12); color: #fff; }

        /* STEP PILL NAVIGATOR */
        .eng-ms-pills-wrap {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          align-items: center;
        }

        .eng-ms-pills-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #334155;
          margin-right: 0.25rem;
        }

        .eng-ms-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 0.85rem;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          color: #64748b;
          font-family: inherit;
        }

        .eng-ms-pill:hover {
          border-color: rgba(255,255,255,0.2);
          color: #cbd5e1;
          transform: translateY(-1px);
        }

        .eng-ms-pill-num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.68rem;
          font-weight: 800;
          flex-shrink: 0;
          transition: all 0.25s;
        }

        .eng-ms-pill-text {
          font-size: 0.76rem;
          font-weight: 700;
          line-height: 1.2;
          white-space: nowrap;
        }

        .eng-ms-pill.pill-done {
          color: #10b981;
          border-color: rgba(16,185,129,0.25);
        }
        .eng-ms-pill.pill-done .eng-ms-pill-num {
          background: rgba(16,185,129,0.15);
          color: #10b981;
        }

        .eng-ms-pill.pill-active {
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.25);
        }
        .eng-ms-pill.pill-active .eng-ms-pill-num {
          background: rgba(255,255,255,0.2);
          color: #fff;
        }

        /* STEP SHOWCASE SPLIT CARD */
        .eng-ms-showcase {
          display: grid;
          grid-template-columns: 1fr 290px;
          background: rgba(22, 35, 56, 0.92);
          border-radius: 28px;
          overflow: hidden;
          backdrop-filter: blur(28px);
          min-height: 360px;
          animation: engStepIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        /* Subtle inner top-edge highlight line */
        .eng-ms-showcase::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.12) 50%, transparent 95%);
          z-index: 1;
          pointer-events: none;
        }

        .eng-ms-showcase-left {
          padding: 2.75rem 3rem;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .eng-ms-step-label-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .eng-ms-ghost-num {
          font-size: 5rem;
          font-weight: 900;
          letter-spacing: -4px;
          line-height: 1;
          opacity: 0.1;
          color: #fff;
          user-select: none;
          flex-shrink: 0;
        }

        .eng-ms-step-bar {
          width: 3px;
          height: 44px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .eng-ms-step-meta-col {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .eng-ms-step-meta-top {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #475569;
        }

        .eng-ms-step-meta-bot {
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748b;
        }

        .eng-ms-step-title {
          font-size: 1.7rem;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 0.9rem;
          line-height: 1.25;
        }

        .eng-ms-step-desc {
          font-size: 1.04rem;
          color: #94a3b8;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .eng-ms-step-alert {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          background: rgba(245,158,11,0.07);
          border: 1px solid rgba(245,158,11,0.2);
          border-left: 3px solid #f59e0b;
          border-radius: 12px;
          padding: 0.9rem 1.15rem;
        }

        .eng-ms-step-alert i {
          color: #f59e0b;
          font-size: 0.9rem;
          margin-top: 0.18rem;
          flex-shrink: 0;
        }

        .eng-ms-step-alert p {
          color: #fbbf24;
          font-size: 0.88rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.55;
        }

        /* RIGHT PANEL */
        .eng-ms-showcase-right {
          padding: 2rem 1.75rem;
          background: rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          justify-content: space-between;
        }

        .eng-ms-progress-block label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #475569;
          margin-bottom: 0.5rem;
        }

        .eng-ms-progress-label-pct {
          font-size: 0.85rem !important;
          font-weight: 800 !important;
          letter-spacing: 0 !important;
          text-transform: none !important;
        }

        .eng-ms-progress-track {
          height: 5px;
          background: rgba(255,255,255,0.07);
          border-radius: 5px;
          overflow: hidden;
        }

        .eng-ms-progress-fill {
          height: 100%;
          border-radius: 5px;
          transition: width 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .eng-ms-cat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 1.15rem;
          flex: 1;
        }

        .eng-ms-cat-card h5 {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #475569;
          margin-bottom: 0.5rem;
        }

        .eng-ms-cat-card p {
          font-size: 0.95rem;
          font-weight: 800;
          color: #e2e8f0;
          margin: 0;
          line-height: 1.35;
        }

        .eng-ms-cat-card small {
          display: block;
          font-size: 0.73rem;
          color: #64748b;
          margin-top: 0.4rem;
        }

        /* ============================================================
           OUR ENGINEERING COUNSELLING EXPERTS SECTION
           ============================================================ */
        .eng-experts-section {
          padding: 5rem 2rem 4rem;
          background: linear-gradient(180deg, #0f172a 0%, #0a1628 100%);
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .eng-experts-section::before {
          content: '';
          position: absolute;
          top: -20%; left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(14,165,233,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .eng-experts-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* Header */
        .eng-experts-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1.1rem;
          border-radius: 50px;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.3);
          color: #0ea5e9;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1.1rem;
        }

        .eng-experts-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 0.75rem;
        }

        .eng-experts-title em {
          font-style: normal;
          background: linear-gradient(90deg, #0ea5e9, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .eng-experts-subtitle {
          color: #94a3b8;
          font-size: 1rem;
          margin-bottom: 3.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Cards Grid */
        .eng-experts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          justify-items: center;
        }

        /* Individual Expert Card */
        .eng-expert-card {
          background: linear-gradient(145deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%);
          border: 1px solid rgba(14,165,233,0.15);
          border-radius: 24px;
          padding: 2.25rem 1.75rem 1.75rem;
          width: 100%;
          max-width: 320px;
          text-align: center;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .eng-expert-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #0ea5e9, #38bdf8, #0ea5e9);
          background-size: 200% auto;
          animation: engGoldShimmer 3s linear infinite;
        }

        .eng-expert-card:hover {
          transform: translateY(-8px);
          border-color: rgba(14,165,233,0.45);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 40px rgba(14,165,233,0.12);
        }

        /* Photo Frame */
        .eng-expert-photo-frame {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          position: relative;
          flex-shrink: 0;
        }

        .eng-expert-photo-frame::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #38bdf8, #0284c7);
          z-index: 0;
          animation: rotateBorder 4s linear infinite;
        }

        @keyframes rotateBorder {
          0% { background: linear-gradient(0deg, #0ea5e9, #38bdf8, #0284c7); }
          50% { background: linear-gradient(180deg, #38bdf8, #0ea5e9, #38bdf8); }
          100% { background: linear-gradient(360deg, #0ea5e9, #38bdf8, #0284c7); }
        }

        .eng-expert-photo-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #0f172a;
        }

        .eng-expert-photo-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          display: block;
        }

        /* Placeholder frame when no image provided */
        .eng-expert-photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(14,165,233,0.12), rgba(30,41,59,0.9));
          border-radius: 50%;
          gap: 0.25rem;
        }

        .eng-expert-photo-placeholder i {
          font-size: 2.8rem;
          color: rgba(14,165,233,0.5);
        }

        .eng-expert-photo-placeholder span {
          font-size: 0.55rem;
          color: rgba(14,165,233,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }

        /* Expert Info */
        .eng-expert-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 0.2rem;
          letter-spacing: -0.2px;
        }

        .eng-expert-marathi-name {
          font-size: 1rem;
          font-weight: 700;
          color: #0ea5e9;
          margin-bottom: 0.25rem;
          font-family: 'Mukta', sans-serif;
        }

        .eng-expert-role {
          font-size: 0.8rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }

        /* Phone number display */
        .eng-expert-phone-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.05rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 1.25rem;
          padding: 0.6rem 1rem;
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.06);
          letter-spacing: 0.3px;
        }

        .eng-expert-phone-display i {
          color: #0ea5e9;
          font-size: 0.9rem;
        }

        /* CTA Buttons Row */
        .eng-expert-btns {
          display: flex;
          gap: 0.65rem;
        }

        .eng-expert-call-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem 0.5rem;
          background: rgba(14,165,233,0.15);
          border: 1.5px solid rgba(14,165,233,0.4);
          border-radius: 12px;
          color: #38bdf8;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .eng-expert-call-btn:hover {
          background: rgba(14,165,233,0.28);
          border-color: #0ea5e9;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(14,165,233,0.25);
        }

        .eng-expert-wa-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem 0.5rem;
          background: rgba(37,211,102,0.12);
          border: 1.5px solid rgba(37,211,102,0.35);
          border-radius: 12px;
          color: #25d366;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .eng-expert-wa-btn:hover {
          background: rgba(37,211,102,0.25);
          border-color: #25d366;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(37,211,102,0.25);
        }

        /* Team badge at bottom */
        .eng-experts-team-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 3rem;
          padding: 0.6rem 1.75rem;
          background: rgba(14,165,233,0.07);
          border: 1px solid rgba(14,165,233,0.2);
          border-radius: 50px;
          color: #64748b;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .eng-experts-team-badge i {
          color: #0ea5e9;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .eng-experts-grid {
            grid-template-columns: 1fr;
          }
          .eng-expert-card {
            max-width: 340px;
          }
        }

        /* Pulsing Glow Animation for Flowchart button to attract attention */
        @keyframes flowchartPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.5);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
            transform: scale(1.02);
            border-color: rgba(245,158,11,0.9);
            background: rgba(245,158,11,0.16);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
            transform: scale(1);
          }
        }

        /* Flowchart CTA button inside category card */
        .eng-ms-flowchart-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          margin-top: 0.85rem;
          padding: 0.65rem 0.85rem;
          border-radius: 10px;
          border: 1.5px solid rgba(245,158,11,0.6);
          background: rgba(245,158,11,0.1);
          color: #f59e0b;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          letter-spacing: 0.2px;
          animation: flowchartPulse 2s infinite ease-in-out;
        }

        .eng-ms-flowchart-btn span {
          flex: 1;
          line-height: 1.2;
        }

        .eng-ms-flowchart-btn:hover {
          background: rgba(245,158,11,0.22);
          border-color: rgba(245,158,11,0.9);
          color: #fbbf24;
          transform: scale(1.04);
          box-shadow: 0 6px 20px rgba(245,158,11,0.3);
        }

        .eng-ms-nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .eng-ms-nav-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e2e8f0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          transition: all 0.28s;
          flex-shrink: 0;
        }

        .eng-ms-nav-btn:hover:not(:disabled) {
          color: #fff;
          transform: scale(1.1);
        }

        .eng-ms-nav-btn:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        .eng-ms-dots {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .eng-ms-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.25s;
          flex-shrink: 0;
        }

        .eng-ms-dot.eng-ms-dot-active {
          transform: scale(1.6);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .eng-ms-tabs { grid-template-columns: 1fr; }
          .eng-ms-showcase { grid-template-columns: 1fr; }
          .eng-ms-showcase-left { padding: 1.75rem; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .eng-ms-showcase-right { gap: 1rem; }
          .eng-ms-step-title { font-size: 1.35rem; }
          .eng-ms-ghost-num { font-size: 3.5rem; }
        }

        @media (max-width: 768px) {
          .eng-hero-title { font-size: 2.2rem; }
          .eng-hero-btns { flex-direction: column; }
          .eng-ms-tab { padding: 1rem 1.1rem; }
          .eng-ms-tab-icon { width: 42px; height: 42px; font-size: 1.1rem; }
          .eng-mission-section { padding: 4rem 1.25rem 3rem; }
        }

        /* ============================================================
           HALL OF CHAMPIONS — ACHIEVERS 2025
           ============================================================ */
        .eng-hoc-section {
          padding: 6rem 2rem 5rem;
          background: #0a1020;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        /* Ambient radial glows */
        .eng-hoc-section::before {
          content: '';
          position: absolute;
          top: -40%; left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 600px;
          background: radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .eng-hoc-section::after {
          content: '';
          position: absolute;
          bottom: -20%; left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(14,165,233,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .eng-hoc-inner {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* HEADER */
        .eng-hoc-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1.1rem;
          border-radius: 50px;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.3);
          color: #f59e0b;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1.25rem;
        }

        .eng-hoc-title {
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1rem;
          color: #fff;
        }

        .eng-hoc-title span {
          background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: engGoldShimmer 3s linear infinite;
        }

        @keyframes engGoldShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .eng-hoc-marathi {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(245,158,11,0.07);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 50px;
          padding: 0.4rem 1.25rem;
          font-size: 1.05rem;
          color: #fbbf24;
          font-weight: 700;
          margin-bottom: 3rem;
          font-style: italic;
        }

        /* CINEMATIC FRAME */
        .eng-hoc-frame {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: #000;
          box-shadow:
            0 0 0 1.5px rgba(245,158,11,0.4),
            0 0 0 4px rgba(245,158,11,0.08),
            0 30px 80px rgba(0,0,0,0.7),
            0 0 60px rgba(245,158,11,0.12);
          cursor: pointer;
          margin-bottom: 1.5rem;
        }

        .eng-hoc-frame:hover .eng-hoc-overlay {
          opacity: 1;
        }

        .eng-hoc-frame:hover .eng-hoc-img {
          transform: scale(1.03);
        }

        .eng-hoc-img {
          width: 100%;
          display: block;
          object-fit: contain;
          background: #fff;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Top & bottom gradient overlays */
        .eng-hoc-grad-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 70px;
          background: linear-gradient(to bottom, rgba(10,16,32,0.7), transparent);
          pointer-events: none;
          z-index: 2;
        }

        .eng-hoc-grad-bot {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 70px;
          background: linear-gradient(to top, rgba(10,16,32,0.8), transparent);
          pointer-events: none;
          z-index: 2;
        }

        /* Hover: centre CTA overlay */
        .eng-hoc-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.35);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 3;
        }

        .eng-hoc-overlay-pill {
          background: rgba(245,158,11,0.9);
          color: #000;
          font-weight: 800;
          font-size: 0.95rem;
          padding: 0.65rem 1.5rem;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 24px rgba(245,158,11,0.5);
        }

        /* Slide counter badge */
        .eng-hoc-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          z-index: 4;
          letter-spacing: 1px;
        }

        /* NAVIGATION ROW */
        .eng-hoc-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .eng-hoc-nav-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.12);
          color: #e2e8f0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .eng-hoc-nav-btn:hover {
          background: rgba(245,158,11,0.15);
          border-color: rgba(245,158,11,0.5);
          color: #f59e0b;
          transform: scale(1.1);
        }

        .eng-hoc-dots {
          display: flex;
          gap: 7px;
          align-items: center;
        }

        .eng-hoc-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s;
        }

        .eng-hoc-dot.hoc-active {
          background: #f59e0b;
          width: 26px;
          border-radius: 4px;
          box-shadow: 0 0 8px rgba(245,158,11,0.6);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .eng-hoc-section { padding: 4rem 1.25rem 3rem; }
          .eng-hoc-frame { border-radius: 16px; }
          .eng-hoc-marathi { font-size: 0.9rem; }
          .eng-hoc-nav-btn { width: 40px; height: 40px; }
        }

        .eng-section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .eng-carousel-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          cursor: pointer;
          transition: all 0.3s;
        }

        .eng-carousel-dot.active {
          background: var(--eng-secondary);
          width: 25px;
          border-radius: 5px;
        }

        .eng-stat-badges {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.75rem;
          max-width: 1000px;
          margin: 2rem auto 0;
        }

        .eng-stat-badge {
          background: var(--eng-card);
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 2.5px solid rgba(245,158,11,0.45);
          padding: 1.1rem 0.6rem 0.9rem;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .eng-stat-badge:hover {
          border-top-color: var(--eng-secondary);
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.35);
          background: rgba(30, 41, 59, 0.9);
        }

        .eng-stat-badge .num {
          font-size: 1.85rem;
          font-weight: 900;
          color: var(--eng-secondary);
          margin-bottom: 0.2rem;
          line-height: 1;
          letter-spacing: -0.5px;
        }

        .eng-stat-badge .lbl {
          color: #94a3b8;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 700;
          line-height: 1.25;
        }

        @media (max-width: 900px) {
          .eng-stat-badges { grid-template-columns: repeat(4, 1fr); gap: 0.65rem; }
        }

        @media (max-width: 768px) {
          .eng-carousel-btn { width: 35px; height: 35px; font-size: 1rem; }
          .eng-carousel-btn.prev { left: 10px; }
          .eng-carousel-btn.next { right: 10px; }
          .eng-stat-badges { grid-template-columns: repeat(3, 1fr); gap: 0.6rem; max-width: 100%; }
          .eng-stat-badge { padding: 0.9rem 0.4rem 0.75rem; border-radius: 12px; }
          .eng-stat-badge .num { font-size: 1.55rem; }
          .eng-stat-badge .lbl { font-size: 0.6rem; letter-spacing: 0.5px; }
        }

        /* --- TIE-UP UNIVERSITIES MARQUEE --- */
        .eng-achievers-section {
          padding: 5rem 0;
          background: #0f172a;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .eng-achievers-title {
          text-align: center;
          margin-bottom: 3rem;
          padding: 0 2rem;
        }

        .eng-achievers-title h2 {
          color: #fff;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .eng-achievers-title p {
          color: #94a3b8;
          font-size: 1.1rem;
        }

        .eng-marquee-container {
          display: flex;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
          padding: 1rem 0;
          margin-bottom: 1.5rem;
        }

        .eng-marquee-container::before,
        .eng-marquee-container::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 150px;
          z-index: 2;
        }

        .eng-marquee-container::before {
          left: 0;
          background: linear-gradient(to right, #0f172a, transparent);
        }

        .eng-marquee-container::after {
          right: 0;
          background: linear-gradient(to left, #0f172a, transparent);
        }

        .eng-marquee-track {
          display: flex;
          gap: 1.5rem;
          animation: engMarqueeScroll 40s linear infinite;
        }

        .eng-marquee-track.reverse {
          animation: engMarqueeScrollRev 60s linear infinite;
        }

        @keyframes engMarqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes engMarqueeScrollRev {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .eng-achiever-card {
          background: #fff;
          border: 1px solid rgba(14, 165, 233, 0.3);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 220px;
          transition: transform 0.3s ease;
        }

        .eng-achiever-card:hover {
          transform: translateY(-5px);
          border-color: var(--eng-secondary);
          box-shadow: 0 10px 20px rgba(245, 158, 11, 0.2);
        }
        
        .eng-univ-logo {
          height: 60px;
          width: auto;
          object-fit: contain;
          margin-bottom: 1rem;
          mix-blend-mode: multiply;
          filter: contrast(1.1);
        }

        .eng-achiever-name {
          color: #1e293b;
          font-weight: 800;
          font-size: 1.05rem;
          margin-bottom: 0.25rem;
          text-align: center;
        }

        .eng-achiever-college {
          color: #64748b;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* --- FLOWCHART SECTION --- */
        .eng-flowchart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .eng-flowchart-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
        }

        .eng-flowchart-card:hover {
          border-color: var(--eng-primary);
          box-shadow: 0 10px 30px rgba(14, 165, 233, 0.15);
        }

        .eng-flowchart-img {
          width: 100%;
          height: 250px;
          object-fit: contain;
          border-radius: 8px;
          background: #fff;
          margin-bottom: 1rem;
        }

        /* Image Modal */
        .eng-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.9);
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          backdrop-filter: blur(5px);
        }

        .eng-modal-img {
          max-width: 100%;
          max-height: 90vh;
          border-radius: 8px;
          box-shadow: 0 0 40px rgba(0,0,0,0.5);
        }

        .eng-modal-close {
          position: absolute;
          top: 20px;
          right: 30px;
          background: transparent;
          color: #fff;
          border: none;
          font-size: 2.5rem;
          cursor: pointer;
          transition: color 0.3s;
        }

        /* --- LIGHT THEME COUNSELLING SECTION (POSTER VIBE) --- */
        .eng-counselling-light {
          padding: 3rem 2rem 2rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          color: #334155;
        }

        .eng-counselling-container-light {
          width: 100%;
          max-width: 1100px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          position: relative;
          padding: 2.5rem 3rem 2rem;
          margin-top: 1.5rem;
          border: 1px solid #e2e8f0;
          zoom: 1.1;
        }

        .eng-counselling-header-pill {
          background: linear-gradient(90deg, #4ade80, #22c55e);
          padding: 1rem 3rem;
          border-radius: 50px;
          text-align: center;
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
          border: 3px solid #ffffff;
          white-space: nowrap;
          width: 90%;
          max-width: 850px;
          z-index: 10;
        }

        .eng-counselling-header-pill h2 {
          color: #ffffff;
          font-size: 1.35rem;
          margin: 0;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .eng-counselling-grid-light {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
          align-items: stretch;
        }

        /* LEFT COLUMN */
        .eng-cl-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: #ffffff;
          padding: 0;
        }

        .eng-cl-illustration {
          width: 100%;
          max-width: 250px;
          height: auto;
          margin-bottom: 1rem;
          animation: floatFloat 6s ease-in-out infinite;
        }

        @keyframes floatFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }

        .eng-cl-title {
          color: #0f172a;
          font-size: 1.6rem;
          font-weight: 900;
          margin-bottom: 0.25rem;
        }

        .eng-cl-subtitle {
          color: #0ea5e9;
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 1rem;
        }

        .eng-cl-whatsapp-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: #22c55e;
          color: #ffffff;
          padding: 0.7rem 2rem;
          border-radius: 50px;
          font-size: 1.35rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
          transition: transform 0.3s ease;
        }

        .eng-cl-whatsapp-btn:hover {
          transform: scale(1.05);
          background: #16a34a;
          color: #ffffff;
        }

        /* RIGHT COLUMN GRID & ANIMATIONS */
        .eng-cl-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .eng-cl-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
        }

        .eng-feature-card.slim-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
          transition: all 0.3s ease;
        }

        .eng-feature-card.slim-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.08);
          border-color: #38bdf8;
        }

        .eng-feature-icon-wrapper {
          background: #f0fdf4;
          color: #22c55e;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        /* React-driven tick animation */
        .eng-feature-icon-wrapper i {
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .eng-feature-icon-wrapper i.ticked {
          opacity: 1;
          transform: scale(1);
        }

        .eng-feature-text h4 {
          color: #0f172a;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
        }

        @media (max-width: 900px) {
          .eng-counselling-grid-light {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
          .eng-cl-features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .eng-feature-card.slim-card {
            padding: 0.75rem 0.5rem;
            gap: 0.5rem;
          }
          .eng-feature-icon-wrapper {
            width: 26px;
            height: 26px;
            font-size: 0.75rem;
          }
          .eng-feature-text h4 {
            font-size: 0.9rem;
            line-height: 1.2;
          }
          .eng-counselling-header-pill h2 {
            font-size: 1.1rem;
            white-space: normal;
          }
          .eng-counselling-header-pill {
            padding: 1rem;
            top: -30px;
            width: 95%;
          }
          .eng-counselling-container-light {
            padding: 5rem 1.5rem 2rem;
          }
        }

        /* Dynamic Admission Pathway Badges */
        .eng-path-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.9rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.3px;
          margin-left: auto;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: engFadeIn 0.4s ease-out forwards;
        }

        .eng-path-badge-cap {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.45);
          color: #10b981;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
        }

        .eng-path-badge-mq {
          background: rgba(245, 158, 11, 0.15);
          border: 1.5px solid rgba(245, 158, 11, 0.75);
          color: #f59e0b;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);
          animation: mqPulse 2s infinite ease-in-out;
        }

        @keyframes mqPulse {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(245, 158, 11, 0.25); }
          50% { transform: scale(1.03); box-shadow: 0 0 30px rgba(245, 158, 11, 0.45); }
          100% { transform: scale(1); box-shadow: 0 0 20px rgba(245, 158, 11, 0.25); }
        }

        @keyframes engFadeIn {
          from { opacity: 0; transform: translateY(-3px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .eng-ms-step-label-row {
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .eng-path-badge {
            margin-left: 0;
            width: 100%;
            justify-content: center;
          }
        }

        /* ---- FOOTER FROM LANDING PAGE ---- */
        .lp-footer {
          background: #12121f;
          color: rgba(255,255,255,0.75);
          padding: clamp(3rem, 6vw, 4rem) 2rem 1.5rem;
          border-top: 3px solid #f39c12;
          font-family: 'Inter', sans-serif;
        }
        .lp-footer .lp-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .lp-footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
          text-align: left;
        }
        @media (min-width: 640px) {
          .lp-footer-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 992px) {
          .lp-footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
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
          margin-top: 0;
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
          line-height: 1.4;
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
            text-align: left;
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
        @media (max-width: 420px) {
          .lp-footer-grid {
            gap: 1.75rem;
          }
        }
      `}</style>

      <div className="eng-hero">
        <div className="eng-hero-content">
          <div className="eng-chip"><i className="fas fa-satellite-dish"></i> 2026 Admissions Open</div>
          <h1 className="eng-hero-title">
            Engineering Admissions <br />
            <span>Mastered.</span>
          </h1>
          <p className="eng-hero-desc">
            Stop guessing your future. Get precise, data-driven counselling for IITs, NITs, COEP, VJTI, and Top Private Universities through JoSAA, CSAB, and MHT-CET CAP rounds.
          </p>
          <div className="eng-hero-btns">
            <button
              className="eng-btn-primary"
              onClick={() => navigate('/engineering-team')}
            >
              <i className="fas fa-phone-alt"></i> Call Expert Now
            </button>
            <button
              className="eng-btn-primary"
              onClick={() => navigate('/app/engineering-colleges')}
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)' }}
            >
              <i className="fas fa-search"></i> Explore Colleges
            </button>
            <a href="https://chat.whatsapp.com/D8TLQxWgzSe1udjewOpVxc" target="_blank" rel="noopener noreferrer" className="eng-btn-secondary">
              <i className="fab fa-whatsapp"></i> Join WhatsApp Group
            </a>
          </div>

          <div className="eng-stats-wrap-inside">
            <div className="eng-stats-grid">
              {ADMISSION_STATS.map((stat, idx) => (
                <div className="eng-stat-card" key={idx}>
                  <i className={`fas ${stat.icon} eng-stat-icon`}></i>
                  <div className="eng-stat-value">{stat.value}{stat.suffix}</div>
                  <div className="eng-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="eng-counselling-light">
        <div className="eng-counselling-container-light">

          <div className="eng-counselling-header-pill">
            <h2>ऑनलाईन काउन्सिलिंग जॉईन करा व इंजिनिअरिंग प्रवेश प्रक्रियेसंबंधी निश्चिंत व्हा...</h2>
          </div>

          <div className="eng-counselling-grid-light">

            {/* LEFT COLUMN */}
            <div className="eng-cl-left">
              <img src="/landing-assets/images/updates/counselling_illustration.png" alt="Counselling Illustration" className="eng-cl-illustration" />
              {/* <h3 className="eng-cl-title">Engineering Admission 2026</h3> */}
              <p className="eng-cl-subtitle">
                You're just one click away from your dream college! 🚀
              </p>
              <button
                className="eng-cl-whatsapp-btn"
                onClick={() => navigate('/engineering-team')}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                <i className="fas fa-users"></i> Connect Us
              </button>
              <button
                className="eng-btn-secondary"
                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/engineering-team')}
              >
                <i className="fas fa-map-marker-alt"></i> Find Your Nearest Branch
              </button>
            </div>

            {/* RIGHT COLUMN */}
            <div className="eng-cl-right">
              <div className="eng-cl-features-grid">

                <div className="eng-feature-card slim-card">
                  <div className="eng-feature-icon-wrapper"><i className={`fas fa-route ${tickStep > 0 ? 'ticked' : ''}`}></i></div>
                  <div className="eng-feature-text"><h4>End-to-End Guidance</h4></div>
                </div>

                <div className="eng-feature-card slim-card">
                  <div className="eng-feature-icon-wrapper"><i className={`fas fa-chess-knight ${tickStep > 1 ? 'ticked' : ''}`}></i></div>
                  <div className="eng-feature-text"><h4>Option Form Strategy</h4></div>
                </div>

                <div className="eng-feature-card slim-card">
                  <div className="eng-feature-icon-wrapper"><i className={`fas fa-video ${tickStep > 2 ? 'ticked' : ''}`}></i></div>
                  <div className="eng-feature-text"><h4>Live Zoom Sessions</h4></div>
                </div>

                <div className="eng-feature-card slim-card">
                  <div className="eng-feature-icon-wrapper"><i className={`fab fa-whatsapp ${tickStep > 3 ? 'ticked' : ''}`}></i></div>
                  <div className="eng-feature-text"><h4>WhatsApp Updates</h4></div>
                </div>

                <div className="eng-feature-card slim-card">
                  <div className="eng-feature-icon-wrapper"><i className={`fas fa-clipboard-list ${tickStep > 4 ? 'ticked' : ''}`}></i></div>
                  <div className="eng-feature-text"><h4>Personalized Lists</h4></div>
                </div>

                <div className="eng-feature-card slim-card">
                  <div className="eng-feature-icon-wrapper"><i className={`fas fa-laptop-house ${tickStep > 5 ? 'ticked' : ''}`}></i></div>
                  <div className="eng-feature-text"><h4>Personalized Student Portal</h4></div>
                </div>

                <div className="eng-feature-card slim-card">
                  <div className="eng-feature-icon-wrapper"><i className={`fas fa-robot ${tickStep > 6 ? 'ticked' : ''}`}></i></div>
                  <div className="eng-feature-text"><h4>AI College Prediction</h4></div>
                </div>

                <div className="eng-feature-card slim-card">
                  <div className="eng-feature-icon-wrapper"><i className={`fas fa-headset ${tickStep > 7 ? 'ticked' : ''}`}></i></div>
                  <div className="eng-feature-text"><h4>24/7 Support</h4></div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ===== MISSION CONTROL: PROCESS SECTION ===== */}
      <section id="process-section" className="eng-mission-section">
        <div className="eng-mission-inner">

          {/* Header */}
          <div className="eng-ms-header">
            <div className="eng-ms-eyebrow">
              <i className="fas fa-route"></i>&nbsp; Step-by-Step Guide
            </div>
            <h2 className="eng-ms-title">
              Decoding the <em>Complexity</em>
            </h2>
            <p className="eng-ms-subtitle">
              Navigating multiple exams and counselling portals is exhausting. Here is exactly how we streamline your path to a premium engineering seat.
            </p>
          </div>

          {/* Tab Category Cards */}
          <div className="eng-ms-tabs">
            {ENG_PROCESS_TABS.map((tab, idx) => (
              <button
                key={tab.id}
                className={`eng-ms-tab ${activeTab === idx ? 'eng-ms-tab-active' : ''}`}
                style={activeTab === idx ? {
                  border: `1.5px solid ${ENG_TAB_COLORS[idx]}`,
                  background: `${ENG_TAB_COLORS[idx]}14`,
                } : {}}
                onClick={() => { setActiveTab(idx); setActiveStep(0); handleUserInteraction(); }}
              >
                <div
                  className="eng-ms-tab-icon"
                  style={activeTab === idx ? { background: ENG_TAB_COLORS[idx], color: '#fff' } : {}}
                >
                  <i className={`fas ${tab.icon}`}></i>
                </div>
                <div className="eng-ms-tab-info">
                  <span className="eng-ms-tab-sub">Process Guide</span>
                  <span className="eng-ms-tab-title">{tab.label}</span>
                </div>
                <span
                  className="eng-ms-tab-badge"
                  style={activeTab === idx ? { background: `${ENG_TAB_COLORS[idx]}30`, color: ENG_TAB_COLORS[idx] } : {}}
                >
                  {tab.steps.length} steps
                </span>
              </button>
            ))}
          </div>

          {/* Step Pill Navigator */}
          <div className="eng-ms-pills-wrap">
            <span className="eng-ms-pills-label">Steps:</span>
            {ENG_PROCESS_TABS[activeTab].steps.map((step, sIdx) => (
              <button
                key={sIdx}
                className={`eng-ms-pill ${sIdx === activeStep ? 'pill-active' : ''
                  } ${sIdx < activeStep ? 'pill-done' : ''
                  }`}
                style={sIdx === activeStep ? {
                  background: ENG_TAB_COLORS[activeTab],
                  borderColor: ENG_TAB_COLORS[activeTab],
                  color: '#fff'
                } : {}}
                onClick={() => { setActiveStep(sIdx); handleUserInteraction(); }}
              >
                <span className="eng-ms-pill-num">
                  {sIdx < activeStep
                    ? <i className="fas fa-check" style={{ fontSize: '0.6rem' }}></i>
                    : sIdx + 1
                  }
                </span>
                <span className="eng-ms-pill-text">
                  {step.title.split(' ').slice(0, 3).join(' ')}
                </span>
              </button>
            ))}
          </div>

          {/* Step Showcase Split-Card — key forces re-animation on every step change */}
          <div
            className="eng-ms-showcase"
            key={`step-${activeTab}-${activeStep}`}
            style={{
              border: `1.5px solid ${ENG_TAB_COLORS[activeTab]}55`,
              boxShadow: `0 0 0 1px ${ENG_TAB_COLORS[activeTab]}18, 0 24px 60px rgba(0,0,0,0.5), 0 0 50px ${ENG_TAB_COLORS[activeTab]}18`
            }}
          >

            {/* Left: Step Content */}
            <div className="eng-ms-showcase-left">
              <div className="eng-ms-step-label-row">
                <span className="eng-ms-ghost-num">{String(activeStep + 1).padStart(2, '0')}</span>
                <div className="eng-ms-step-bar" style={{ background: ENG_TAB_COLORS[activeTab] }}></div>
                <div className="eng-ms-step-meta-col">
                  <span className="eng-ms-step-meta-top">{ENG_PROCESS_TABS[activeTab].label}</span>
                  <span className="eng-ms-step-meta-bot">
                    Step {activeStep + 1} of {ENG_PROCESS_TABS[activeTab].steps.length}
                  </span>
                </div>
                {activeTab === 0 && (
                  <div className={`eng-path-badge ${activeStep === 6 ? 'eng-path-badge-mq' : 'eng-path-badge-cap'}`}>
                    <i className={activeStep === 6 ? "fas fa-crown" : "fas fa-network-wired"}></i>
                    <span>{activeStep === 6 ? "Management Quota (20% Seats)" : "CAP Round Process (80% Seats)"}</span>
                  </div>
                )}
              </div>

              <h3 className="eng-ms-step-title">
                {ENG_PROCESS_TABS[activeTab].steps[activeStep].title}
              </h3>
              <p className="eng-ms-step-desc">
                {ENG_PROCESS_TABS[activeTab].steps[activeStep].desc}
              </p>
              <div className="eng-ms-step-alert">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{ENG_PROCESS_TABS[activeTab].steps[activeStep].note}</p>
              </div>
            </div>

            {/* Right: Progress + Nav */}
            <div className="eng-ms-showcase-right">

              {/* Progress Bar */}
              <div className="eng-ms-progress-block">
                <label>
                  <span>Completion</span>
                  <span
                    className="eng-ms-progress-label-pct"
                    style={{ color: ENG_TAB_COLORS[activeTab] }}
                  >
                    {Math.round(((activeStep + 1) / ENG_PROCESS_TABS[activeTab].steps.length) * 100)}%
                  </span>
                </label>
                <div className="eng-ms-progress-track">
                  <div
                    className="eng-ms-progress-fill"
                    style={{
                      width: `${((activeStep + 1) / ENG_PROCESS_TABS[activeTab].steps.length) * 100}%`,
                      background: `linear-gradient(90deg, ${ENG_TAB_COLORS[activeTab]}, ${ENG_TAB_COLORS[activeTab]}aa)`
                    }}
                  ></div>
                </div>
              </div>

              {/* Process Category Info */}
              <div className="eng-ms-cat-card">
                <h5>Process Category</h5>
                <p>{ENG_PROCESS_TABS[activeTab].title}</p>
                <small>
                  <i className="fas fa-layer-group" style={{ marginRight: '4px' }}></i>
                  {ENG_PROCESS_TABS[activeTab].steps.length} key milestones
                </small>

                {/* Flowchart CTA — only for tabs with flowcharts, desktop and mobile */}
                {activeTab === 0 && (
                  <button
                    className="eng-ms-flowchart-btn"
                    onClick={() => { openImageModal("/landing-assets/images/updates/STATE_PROCESS_FLOW_CHART.jpg"); handleUserInteraction(); }}
                    title="Click Here To view State Process Flowchart"
                  >
                    <i className="fas fa-project-diagram"></i>
                    <span>view State Process Flowchart</span>
                    <i className="fas fa-external-link-alt" style={{ fontSize: '0.65rem', opacity: 0.7 }}></i>
                  </button>
                )}
                {activeTab === 1 && (
                  <button
                    className="eng-ms-flowchart-btn"
                    onClick={() => { openImageModal("/landing-assets/images/updates/JOSAA_PROCESS_FLOW_CHART.jpg"); handleUserInteraction(); }}
                    title="Click Here To view JoSAA Process Flowchart"
                  >
                    <i className="fas fa-project-diagram"></i>
                    <span>view JoSAA Process Flowchart</span>
                    <i className="fas fa-external-link-alt" style={{ fontSize: '0.65rem', opacity: 0.7 }}></i>
                  </button>
                )}
              </div>

              {/* Step Navigation */}
              <div className="eng-ms-nav-row">
                <button
                  className="eng-ms-nav-btn"
                  disabled={activeStep === 0}
                  style={activeStep > 0 ? {
                    background: `${ENG_TAB_COLORS[activeTab]}22`,
                    borderColor: `${ENG_TAB_COLORS[activeTab]}55`
                  } : {}}
                  onClick={() => { setActiveStep(p => p - 1); handleUserInteraction(); }}
                  title="Previous Step"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>

                <div className="eng-ms-dots">
                  {ENG_PROCESS_TABS[activeTab].steps.map((_, dIdx) => (
                    <button
                      key={dIdx}
                      className={`eng-ms-dot ${dIdx === activeStep ? 'eng-ms-dot-active' : ''}`}
                      style={dIdx === activeStep ? { background: ENG_TAB_COLORS[activeTab] } : {}}
                      onClick={() => { setActiveStep(dIdx); handleUserInteraction(); }}
                      title={`Step ${dIdx + 1}`}
                    ></button>
                  ))}
                </div>

                <button
                  className="eng-ms-nav-btn"
                  disabled={activeStep === ENG_PROCESS_TABS[activeTab].steps.length - 1}
                  style={activeStep < ENG_PROCESS_TABS[activeTab].steps.length - 1 ? {
                    background: `${ENG_TAB_COLORS[activeTab]}22`,
                    borderColor: `${ENG_TAB_COLORS[activeTab]}55`
                  } : {}}
                  onClick={() => { setActiveStep(p => p + 1); handleUserInteraction(); }}
                  title="Next Step"
                >
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>

            </div>
          </div>


        </div>
      </section>

      {/* ===== HALL OF CHAMPIONS — ACHIEVERS 2025 ===== */}
      <section className="eng-hoc-section">
        <div className="eng-hoc-inner">

          {/* Header */}
          <div className="eng-hoc-eyebrow">
            <i className="fas fa-trophy"></i> Hall of Champions
          </div>
          <h2 className="eng-hoc-title">
            Our Allotted Students — <span>ENGG 2025</span>
          </h2>
          <p className="eng-hoc-marathi">
            सर्व निवड झालेल्या विद्यार्थ्यांचे हार्दिक अभिनंदन! 🎉 🎉&nbsp;
          </p>

          {/* Cinematic Poster Frame */}
          <div
            className="eng-hoc-frame"
            onClick={() => openImageModal(ENG_ACHIEVER_IMAGES[currentCarouselIdx])}
          >
            {/* Gradient overlays for cinematic feel */}
            <div className="eng-hoc-grad-top"></div>
            <div className="eng-hoc-grad-bot"></div>

            {/* Slide counter */}
            <div className="eng-hoc-badge">
              {currentCarouselIdx + 1} / {ENG_ACHIEVER_IMAGES.length}
            </div>

            {/* Image */}
            <img
              src={ENG_ACHIEVER_IMAGES[currentCarouselIdx]}
              alt={`Achievers Slide ${currentCarouselIdx + 1}`}
              className="eng-hoc-img"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/900x500.png?text=Loading+...'; }}
            />

            {/* Hover CTA overlay */}
            <div className="eng-hoc-overlay">
              <div className="eng-hoc-overlay-pill">
                <i className="fas fa-expand-alt"></i> View Full Image
              </div>
            </div>
          </div>

          {/* Navigation Row */}
          <div className="eng-hoc-nav">
            <button
              className="eng-hoc-nav-btn"
              onClick={() => setCurrentCarouselIdx(p => (p - 1 + ENG_ACHIEVER_IMAGES.length) % ENG_ACHIEVER_IMAGES.length)}
              title="Previous"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="eng-hoc-dots">
              {ENG_ACHIEVER_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  className={`eng-hoc-dot ${idx === currentCarouselIdx ? 'hoc-active' : ''}`}
                  onClick={() => setCurrentCarouselIdx(idx)}
                  title={`Slide ${idx + 1}`}
                ></button>
              ))}
            </div>

            <button
              className="eng-hoc-nav-btn"
              onClick={() => setCurrentCarouselIdx(p => (p + 1) % ENG_ACHIEVER_IMAGES.length)}
              title="Next"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* Placement Stats Grid */}
          <div className="eng-stat-badges">
            {[
              { num: "14", lbl: "IIT" },
              { num: "02", lbl: "NIT" },
              { num: "08", lbl: "IIIT" },
              { num: "39", lbl: "VIT Pune" },
              { num: "06", lbl: "SGGS Nanded" },
              { num: "05", lbl: "Cummins" },
              { num: "03", lbl: "COEP" },
              { num: "03", lbl: "PICT" },
              { num: "03", lbl: "PCCOE" },
              { num: "02", lbl: "Walchand" },
              { num: "01", lbl: "GECA" },
              { num: "45", lbl: "Private Univs" },
            ].map(s => (
              <div className="eng-stat-badge" key={s.lbl}>
                <span className="num">{s.num}</span>
                <span className="lbl">{s.lbl}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PRIVATE TIE-UPS MARQUEE SECTION */}
      <section className="eng-achievers-section">
        <div className="eng-achievers-title">
          <h2>Admissions to Top Private Universities</h2>
          <p>No Donation | Direct Admission | Management Quota Guidance Available*</p>
        </div>

        <div className="eng-marquee-container">
          <div className="eng-marquee-track">
            {[...PRIVATE_UNIVERSITIES, ...PRIVATE_UNIVERSITIES, ...PRIVATE_UNIVERSITIES].map((univ, idx) => (
              <div className="eng-achiever-card" key={idx}>
                {univ.logo && <img src={univ.logo} alt={univ.name} className="eng-univ-logo" />}
                <span className="eng-achiever-name">{univ.name}</span>
                <span className="eng-achiever-college">{univ.location}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="eng-marquee-container">
          <div className="eng-marquee-track reverse">
            {[...PRIVATE_UNIVERSITIES.reverse(), ...PRIVATE_UNIVERSITIES.reverse()].map((univ, idx) => (
              <div className="eng-achiever-card" key={idx}>
                {univ.logo && <img src={univ.logo} alt={univ.name} className="eng-univ-logo" />}
                <span className="eng-achiever-name">{univ.name}</span>
                <span className="eng-achiever-college">{univ.location}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', padding: '0 2rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            <i className="fas fa-info-circle" style={{ color: '#f59e0b', marginRight: '5px' }}></i>
            Feel Free to Contact <strong>Er. Ketan Dhoke: 86684 22697</strong> for Management Quota Guidance.
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
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
                <li><a href="/#lp-home"><i className="fas fa-chevron-right"></i> Home</a></li>
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

      {/* IMAGE MODAL */}
      {isModalOpen && (
        <div className="eng-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <button className="eng-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
          <img src={modalImage} alt="Enlarged View" className="eng-modal-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
