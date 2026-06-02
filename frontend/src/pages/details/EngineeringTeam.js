import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

/* ─────────────────────────────────────────────────────────────────
   DATA CONSTANTS
───────────────────────────────────────────────────────────────── */
const BRANCH_EXPERTS = [
  { branch: "Latur", name: "Sachin Bangad", role: "Founder of Admissions Made Easy", phone: "9970809003", display: "99708 09003", photo: "/landing-assets/images/team/sachin_bangad.jpeg" },
  { branch: "Latur", name: "Er. Sunil Govindpurkar", role: "Eng Admission Counseller", phone: "9422611661", display: "94226 11661", photo: "/landing-assets/images/team/sunil_govindpurkar.jpg" },
  { branch: "Latur", name: "Er. Ketan Doke", role: "Eng Admission Counseller", phone: "8668422697", display: "86684 22697", photo: "/landing-assets/images/team/ketan_doke.jpg" },
  { branch: "Latur", name: "Er. Ashish Pallod", role: "Eng Admission Counseller", phone: "8830452833", display: "88304 52833", photo: "/landing-assets/images/team/ashish_pallod.jpg" },
  { branch: "Pune", name: "Er. Kailash Toshniwal", role: "Eng Admission Counseller", phone: "8087813700", display: "80878 13700", photo: "/landing-assets/images/team/kailash_toshniwal.jpg" }
];

const BRANCHES = ["All", "Latur", "Pune"];

const TIME_SLOTS = {
  Morning: ["9:00 AM", "10:00 AM", "11:00 AM"],
  Afternoon: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"],
  Evening: ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"],
};



const TODAY = new Date().toISOString().split("T")[0];

const EMPTY_FORM = {
  name: "", phone: "", branch: "", preferredExpert: "No Preference",
  date: "", timeSlot: "", sessionType: "Phone Call", message: "",
};

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────── */
export default function EngineeringTeam() {
  const navigate = useNavigate();

  const [activeBranch, setActiveBranch] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [scheduleForm, setScheduleForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  /* Scroll to top on mount */
  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* ── Helpers ── */
  const openModal = (expert) => {
    setScheduleForm({
      ...EMPTY_FORM,
      branch: expert ? expert.branch : "",
      preferredExpert: expert ? expert.name : "No Preference",
    });
    setModalSuccess(false);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalSuccess(false);
    setScheduleForm(EMPTY_FORM);
    setFormError("");
  };

  const handleBranchChange = (val) => {
    setScheduleForm(prev => ({ ...prev, branch: val, preferredExpert: "No Preference" }));
  };

  const handleSubmit = () => {
    const { name, phone, branch, date, timeSlot } = scheduleForm;
    if (!name.trim()) return setFormError("Please enter the student's full name.");
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) return setFormError("Please enter a valid 10-digit mobile number.");
    if (!branch) return setFormError("Please select a branch.");
    if (!date) return setFormError("Please choose a preferred date.");
    if (!timeSlot) return setFormError("Please select a preferred time slot.");

    setFormError("");
    setModalSuccess(true);

    const msg =
      `📅 *New Counselling Session Request*

👤 Student Name: ${scheduleForm.name}
📱 Phone: ${scheduleForm.phone}
🏢 Branch Preferred: ${scheduleForm.branch}
👨‍💼 Preferred Expert: ${scheduleForm.preferredExpert}
📞 Session Type: ${scheduleForm.sessionType}
📅 Date: ${scheduleForm.date}
⏰ Time Slot: ${scheduleForm.timeSlot}
💬 Message: ${scheduleForm.message || "—"}

— Sent via AME Engineering Team Booking Form`;

    setTimeout(() => {
      window.open(`https://wa.me/919309553235?text=${encodeURIComponent(msg)}`, "_blank");
    }, 900);
  };

  /* ── Derived ── */
  const filteredByBranch = BRANCH_EXPERTS.filter(
    e => activeBranch === "All" || e.branch === activeBranch
  );
  const branchExpertsForModal = BRANCH_EXPERTS.filter(e => e.branch === scheduleForm.branch);

  /* ──────────────────────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────────────────────── */
  return (
    <>
      <Helmet>
        <title>Our Engineering Counselling Team | Admissions Made Easy</title>
        <meta name="description" content="Meet our branch-wise certified engineering admission counsellors across Latur, Pune, Kolhapur, Nanded, and Solapur. Book a free counselling session directly." />
      </Helmet>

      <style>{`
        /* ── CSS VARIABLES & BASE ───────────────────────────────── */
        :root {
          --eng-primary:   #0ea5e9;
          --eng-secondary: #f59e0b;
          --eng-dark:      #0f172a;
          --eng-card:      #1e293b;
          --eng-text:      #e2e8f0;
          --eng-glow:      rgba(14,165,233,0.5);
        }

        .et-page {
          background: var(--eng-dark);
          color: var(--eng-text);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        @keyframes successPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1);   opacity: 1; }
        }

        @keyframes engGoldShimmer {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }

        @keyframes gridMove {
          0%   { transform: perspective(500px) rotateX(60deg) translateY(0)    translateZ(-200px); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(40px) translateZ(-200px); }
        }

        /* ── SHARED CLASSES (reused from EngineeringAdmission) ── */
        .eng-chip {
          display: inline-block;
          padding: 0.4rem 1.5rem;
          background: rgba(14,165,233,0.1);
          border: 1px solid var(--eng-primary);
          color: var(--eng-primary);
          border-radius: 50px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
          font-size: 0.85rem;
          box-shadow: 0 0 20px rgba(14,165,233,0.3);
        }

        .eng-hero-title {
          font-size: clamp(2rem, 5vw, 3.6rem);
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
          text-shadow: 0 0 30px rgba(14,165,233,0.4);
        }

        .eng-hero-desc {
          font-size: 1.05rem;
          color: #cbd5e1;
          line-height: 1.6;
          max-width: 620px;
          margin: 0 auto 2rem;
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
          margin-bottom: 1.1rem;
        }

        .eng-ms-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 0.75rem;
        }

        .eng-ms-title em {
          font-style: normal;
          background: linear-gradient(90deg, #0ea5e9, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Expert card classes — identical to EngineeringAdmission.js */
        .eng-expert-card {
          background: linear-gradient(145deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%);
          border: 1px solid rgba(14,165,233,0.15);
          border-radius: 24px;
          padding: 2.25rem 1.75rem 1.75rem;
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
          text-align: center;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
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

        .eng-expert-photo-frame {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin: 0 auto 1.4rem;
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
          font-size: 2.6rem;
          color: rgba(14,165,233,0.5);
        }

        .eng-expert-photo-placeholder span {
          font-size: 0.55rem;
          color: rgba(14,165,233,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }

        .eng-expert-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 0.2rem;
          letter-spacing: -0.2px;
        }

        .eng-expert-role {
          font-size: 0.78rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-bottom: 1.1rem;
        }

        .eng-expert-phone-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 1.1rem;
          padding: 0.55rem 1rem;
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.06);
          letter-spacing: 0.3px;
        }

        .eng-expert-phone-display i { color: #0ea5e9; font-size: 0.88rem; }

        .eng-expert-btns {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .eng-expert-call-btn {
          flex: 1;
          min-width: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.65rem 0.4rem;
          background: rgba(14,165,233,0.15);
          border: 1.5px solid rgba(14,165,233,0.4);
          border-radius: 12px;
          color: #38bdf8;
          font-size: 0.79rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s ease;
          cursor: pointer;
          font-family: inherit;
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
          min-width: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.65rem 0.4rem;
          background: rgba(37,211,102,0.12);
          border: 1.5px solid rgba(37,211,102,0.35);
          border-radius: 12px;
          color: #25d366;
          font-size: 0.79rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s ease;
          font-family: inherit;
          cursor: pointer;
        }

        .eng-expert-wa-btn:hover {
          background: rgba(37,211,102,0.25);
          border-color: #25d366;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(37,211,102,0.25);
        }

        /* ── SECTION 1: HERO ─────────────────────────────────── */
        .et-hero {
          position: relative;
          padding: 90px 2rem 5rem;
          text-align: center;
          overflow: hidden;
          background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
        }

        .et-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image:
            linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px);
          animation: gridMove 20s linear infinite;
          pointer-events: none;
        }

        .et-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 780px;
          margin: 0 auto;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        .et-back-btn {
          position: absolute;
          top: 22px;
          left: 24px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.15rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50px;
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s ease;
          text-decoration: none;
          z-index: 10;
        }

        .et-back-btn:hover {
          background: rgba(14,165,233,0.12);
          border-color: rgba(14,165,233,0.4);
          color: #38bdf8;
          transform: translateX(-3px);
        }

        /* ── SECTION 3: BRANCH EXPERTS ───────────────────────── */
        .et-branch-section {
          padding: 5rem 2rem 4rem;
          background: var(--eng-dark);
          position: relative;
        }

        .et-branch-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 55% 60% at 85% 40%, rgba(245,158,11,0.05) 0%, transparent 100%);
          pointer-events: none;
        }

        .et-branch-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .et-section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .et-section-subtitle {
          color: #94a3b8;
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        /* Filter Tabs */
        .et-filter-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          justify-content: center;
          margin-bottom: 3.5rem;
        }

        .et-filter-tab {
          padding: 0.55rem 1.4rem;
          border-radius: 50px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #94a3b8;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          letter-spacing: 0.3px;
        }

        .et-filter-tab:hover {
          background: rgba(14,165,233,0.1);
          border-color: rgba(14,165,233,0.35);
          color: #38bdf8;
          transform: translateY(-2px);
        }

        .et-filter-tab.active {
          background: rgba(14,165,233,0.18);
          border-color: var(--eng-primary);
          color: #fff;
          box-shadow: 0 0 18px rgba(14,165,233,0.25), 0 4px 12px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }

        /* Branch group */
        .et-branch-group {
          margin-bottom: 3.5rem;
          animation: fadeUp 0.5s ease forwards;
        }

        .et-branch-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .et-branch-header i {
          color: var(--eng-secondary);
          font-size: 1.1rem;
        }

        .et-branch-name {
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.2px;
        }

        .et-head-office-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.22rem 0.75rem;
          background: rgba(245,158,11,0.15);
          border: 1.5px solid rgba(245,158,11,0.55);
          border-radius: 50px;
          color: #f59e0b;
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        /* Expert grid */
        .et-experts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 320px));
          gap: 2rem;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .et-experts-grid.grid-row-1 {
            grid-template-columns: repeat(2, minmax(280px, 340px));
          }
          .et-experts-grid.grid-row-2 {
            grid-template-columns: repeat(3, minmax(280px, 340px));
          }
        }

        .eng-expert-card-location {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(14,165,233,0.15);
          color: #38bdf8;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
          border: 1px solid rgba(14,165,233,0.3);
          z-index: 5;
        }

        /* Schedule Call button (amber) */
        .et-schedule-btn {
          flex: 1;
          min-width: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.65rem 0.4rem;
          background: rgba(245,158,11,0.12);
          border: 1.5px solid rgba(245,158,11,0.4);
          border-radius: 12px;
          color: #f59e0b;
          font-size: 0.79rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s ease;
          width: 100%;
          margin-top: 0.5rem;
        }

        .et-schedule-btn:hover {
          background: rgba(245,158,11,0.25);
          border-color: #f59e0b;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(245,158,11,0.25);
        }

        /* ── SECTION 4: SCHEDULE MODAL ───────────────────────── */
        .et-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.78);
          backdrop-filter: blur(8px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .et-modal-card {
          background: #fff;
          border-radius: 24px;
          width: 100%;
          max-width: 540px;
          max-height: 92vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08);
          animation: fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
          padding: 2.25rem 2rem 2rem;
          scrollbar-width: thin;
        }

        .et-modal-card::-webkit-scrollbar { width: 4px; }
        .et-modal-card::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        .et-modal-close {
          position: absolute;
          top: 16px;
          right: 18px;
          background: transparent;
          border: none;
          font-size: 1.75rem;
          color: #94a3b8;
          cursor: pointer;
          line-height: 1;
          transition: color 0.2s;
          z-index: 2;
        }

        .et-modal-close:hover { color: #0f172a; }

        /* Green header pill */
        .et-modal-pill {
          background: linear-gradient(90deg, #4ade80, #22c55e);
          padding: 0.85rem 1.5rem;
          border-radius: 14px;
          text-align: center;
          margin-bottom: 1.75rem;
          box-shadow: 0 8px 20px rgba(34,197,94,0.3);
        }

        .et-modal-pill h3 {
          color: #fff;
          font-size: 1.05rem;
          margin: 0;
          font-weight: 800;
          letter-spacing: 0.2px;
        }

        /* Form */
        .et-form-group {
          margin-bottom: 1.15rem;
        }

        .et-form-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 0.4rem;
          letter-spacing: 0.2px;
        }

        .et-form-label span {
          color: #ef4444;
          margin-left: 2px;
        }

        .et-input, .et-select, .et-textarea {
          width: 100%;
          padding: 0.72rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.92rem;
          font-family: inherit;
          color: #0f172a;
          background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          outline: none;
        }

        .et-input:focus, .et-select:focus, .et-textarea:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
          background: #fff;
        }

        .et-textarea {
          resize: vertical;
          min-height: 80px;
        }

        /* Session type toggles */
        .et-session-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
          margin-top: 0.25rem;
        }

        .et-session-btn {
          padding: 0.6rem 0.4rem;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          text-align: center;
          line-height: 1.3;
        }

        .et-session-btn:hover {
          border-color: #0ea5e9;
          color: #0ea5e9;
          background: rgba(14,165,233,0.05);
        }

        .et-session-btn.active {
          border-color: #0ea5e9;
          background: rgba(14,165,233,0.12);
          color: #0284c7;
          box-shadow: 0 2px 8px rgba(14,165,233,0.18);
        }

        /* Time slot grid */
        .et-timeslot-period {
          margin-bottom: 0.85rem;
        }

        .et-timeslot-period-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.45rem;
          display: block;
        }

        .et-timeslot-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .et-timeslot-pill {
          padding: 0.5rem 0.3rem;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
          transition: all 0.2s ease;
        }

        .et-timeslot-pill:hover {
          border-color: #0ea5e9;
          color: #0ea5e9;
          background: rgba(14,165,233,0.05);
        }

        .et-timeslot-pill.active {
          border-color: #0ea5e9;
          background: rgba(14,165,233,0.14);
          color: #0284c7;
          font-weight: 800;
          box-shadow: 0 2px 8px rgba(14,165,233,0.2);
        }

        /* Error message */
        .et-form-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px;
          padding: 0.65rem 1rem;
          color: #dc2626;
          font-size: 0.84rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Submit button */
        .et-submit-btn {
          width: 100%;
          padding: 0.95rem;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.28s ease;
          margin-top: 0.5rem;
          box-shadow: 0 8px 20px rgba(34,197,94,0.3);
          letter-spacing: 0.2px;
        }

        .et-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(34,197,94,0.4);
          background: linear-gradient(135deg, #16a34a, #15803d);
        }

        /* Success state */
        .et-success-state {
          text-align: center;
          padding: 2rem 1rem;
        }

        .et-success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #4ade80, #22c55e);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2.2rem;
          color: #fff;
          animation: successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
          box-shadow: 0 12px 30px rgba(34,197,94,0.35);
        }

        .et-success-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }

        .et-success-detail {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 0.5rem;
        }

        .et-success-note {
          color: #64748b;
          font-size: 0.85rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .et-success-close-btn {
          padding: 0.75rem 2.5rem;
          border-radius: 12px;
          border: none;
          background: #0f172a;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s ease;
        }

        .et-success-close-btn:hover {
          background: #1e293b;
          transform: translateY(-2px);
        }

        /* ── SECTION 5: CTA BANNER ───────────────────────────── */
        .et-cta-banner {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #0c1a2e 0%, #0a1628 50%, #0f172a 100%);
          text-align: center;
          border-top: 1px solid rgba(14,165,233,0.12);
          border-bottom: 1px solid rgba(14,165,233,0.12);
          position: relative;
          overflow: hidden;
        }

        .et-cta-banner::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px;
          height: 300px;
          background: radial-gradient(ellipse, rgba(14,165,233,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .et-cta-banner h2 {
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 900;
          color: #fff;
          margin-bottom: 0.75rem;
          position: relative;
        }

        .et-cta-banner p {
          color: #94a3b8;
          font-size: 1rem;
          margin-bottom: 2.5rem;
          position: relative;
        }

        .et-cta-btns {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
        }

        .et-cta-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 2rem;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          font-size: 0.98rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.28s ease;
          box-shadow: 0 8px 20px rgba(34,197,94,0.3);
          text-decoration: none;
        }

        .et-cta-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(34,197,94,0.4);
        }

        .et-cta-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 2rem;
          border-radius: 12px;
          border: 1.5px solid rgba(14,165,233,0.4);
          background: rgba(14,165,233,0.1);
          color: #38bdf8;
          font-size: 0.98rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.28s ease;
          text-decoration: none;
        }

        .et-cta-btn-secondary:hover {
          background: rgba(14,165,233,0.2);
          border-color: #0ea5e9;
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(14,165,233,0.25);
        }

        /* ── FOOTER (exact copy from EngineeringAdmission.js) ── */
        .lp-footer {
          background: #12121f;
          color: rgba(255,255,255,0.75);
          padding: clamp(3rem, 6vw, 4rem) 2rem 1.5rem;
          border-top: 3px solid #f39c12;
          font-family: 'Inter', sans-serif;
        }
        .lp-footer .lp-container { max-width: 1200px; margin: 0 auto; width: 100%; }
        .lp-footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
          text-align: left;
        }
        @media (min-width: 640px) { .lp-footer-grid { grid-template-columns: repeat(2,1fr); } }
        @media (min-width: 992px) { .lp-footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; } }
        .lp-footer-brand p { font-size: 0.88rem; line-height: 1.7; color: rgba(255,255,255,0.55); margin-top: 1rem; }
        .lp-footer-brand-logo { height: 3rem; width: auto; margin-bottom: 0.75rem; }
        .lp-footer-col h5 {
          font-size: 0.9rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 1.5px; color: #fff; margin-bottom: 1.25rem;
          padding-bottom: 0.5rem; border-bottom: 2px solid rgba(243,156,18,0.4);
          display: inline-block; margin-top: 0;
        }
        .lp-footer-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
        .lp-footer-links li { margin: 0; }
        .lp-footer-links li a { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.87rem; transition: color 0.2s; display: flex; align-items: center; gap: 0.5rem; }
        .lp-footer-links li a:hover { color: #f39c12; }
        .lp-footer-links li a i { font-size: 0.75rem; color: #f39c12; }
        .lp-footer-contact-item { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-bottom: 0.75rem; line-height: 1.4; }
        .lp-footer-contact-item i { color: #f39c12; margin-top: 0.15rem; flex-shrink: 0; }
        .lp-footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; }
        @media (min-width: 640px) { .lp-footer-bottom { flex-direction: row; justify-content: space-between; text-align: left; } }
        .lp-footer-bottom p { font-size: 0.82rem; color: rgba(255,255,255,0.4); margin: 0; }
        .lp-footer-policy-links { display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
        .lp-footer-policy-links a { font-size: 0.8rem; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
        .lp-footer-policy-links a:hover { color: #f39c12; }
        .lp-social-links { display: flex; justify-content: flex-start; gap: 0.75rem; margin-top: 1rem; }
        .lp-social-link { width: 2.5rem; height: 2.5rem; background: rgba(255,255,255,0.07); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.6); font-size: 0.9rem; text-decoration: none; transition: all 0.2s; }
        .lp-social-link:hover { background: #f39c12; color: #fff; transform: translateY(-3px); }

        /* ── RESPONSIVE ─────────────────────────────────────── */


        @media (max-width: 768px) {
          .et-hero { padding: 80px 1.25rem 3.5rem; }
          .et-back-btn { top: 16px; left: 14px; font-size: 0.8rem; padding: 0.4rem 0.9rem; }
          .et-experts-grid { grid-template-columns: 1fr; }
          .eng-expert-card { max-width: 340px; }
          .et-session-row { grid-template-columns: repeat(3, 1fr); }
          .et-timeslot-grid { grid-template-columns: repeat(2, 1fr); }

          /* Modal full-screen on mobile */
          .et-modal-overlay { padding: 0; align-items: flex-end; }
          .et-modal-card {
            border-radius: 24px 24px 0 0;
            max-height: 95vh;
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .et-cta-btns { flex-direction: column; align-items: center; }
          .et-cta-btn-primary, .et-cta-btn-secondary { width: 100%; justify-content: center; }
          .et-filter-tab { font-size: 0.82rem; padding: 0.45rem 1rem; }
        }
      `}</style>

      <div className="et-page">

        {/* ═══════════════════════════════════════════════════
            SECTION 1 — HERO & BRANCH EXPERTS
        ═══════════════════════════════════════════════════ */}
        <section className="et-hero">
          <button className="et-back-btn" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <div className="et-branch-inner">


            <div className="et-hero-inner">
              <div className="eng-chip">
                <i className="fas fa-users"></i>&nbsp; Engineering Counselling Team
              </div>
              <h1 className="eng-hero-title">
                Meet Our <span>Branch Experts</span>
              </h1>
              <p className="eng-hero-desc">
                Find your nearest branch and connect directly with our certified engineering admission counsellors.
              </p>
            </div>

            {/* Row 1: Founders & Pune Lead */}
            <div className="et-experts-grid grid-row-1" style={{ marginBottom: '3rem' }}>
              {[
                BRANCH_EXPERTS.find(e => e.name === "Sachin Bangad"),
                BRANCH_EXPERTS.find(e => e.name === "Er. Kailash Toshniwal")
              ].map((expert, idx) => expert && (
                <div className="eng-expert-card" key={`r1-${idx}`}>
                  {/* Location Badge */}
                  <div className="eng-expert-card-location">
                    <i className="fas fa-map-marker-alt"></i> {expert.branch}
                    {expert.branch === "Latur" && (
                      <span style={{ marginLeft: '6px', color: '#f59e0b', fontSize: '0.65rem' }}>
                        <i className="fas fa-star"></i> HQ
                      </span>
                    )}
                  </div>

                  {/* Photo Frame */}
                  <div className="eng-expert-photo-frame">
                    <div className="eng-expert-photo-inner">
                      {expert.photo ? (
                        <img src={expert.photo} alt={expert.name} />
                      ) : (
                        <div className="eng-expert-photo-placeholder">
                          <i className="fas fa-user"></i>
                          <span>Photo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="eng-expert-name">{expert.name}</div>
                  <div className="eng-expert-role">{expert.role}</div>

                  {/* Phone */}
                  <div className="eng-expert-phone-display">
                    <i className="fas fa-phone"></i>
                    <span>{expert.display}</span>
                  </div>

                  {/* Buttons row 1: Call + WhatsApp */}
                  <div className="eng-expert-btns">
                    <a href={`tel:${expert.phone}`} className="eng-expert-call-btn">
                      <i className="fas fa-phone-alt"></i> Call Now
                    </a>
                    <a
                      href={`https://wa.me/91${expert.phone}?text=${encodeURIComponent(`Hello ${expert.name} Sir, I am seeking your valuable guidance regarding Engineering Admission.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="eng-expert-wa-btn"
                    >
                      <i className="fab fa-whatsapp"></i> WhatsApp
                    </a>
                  </div>

                  {/* Button row 2: Schedule Call */}
                  <button
                    className="et-schedule-btn"
                    onClick={() => openModal(expert)}
                  >
                    <i className="fas fa-calendar-check"></i> Schedule Call
                  </button>
                </div>
              ))}
            </div>

            {/* Row 2: Admission Counsellors */}
            <div className="et-experts-grid grid-row-2">
              {[
                BRANCH_EXPERTS.find(e => e.name === "Er. Sunil Govindpurkar"),
                BRANCH_EXPERTS.find(e => e.name === "Er. Ashish Pallod"),
                BRANCH_EXPERTS.find(e => e.name === "Er. Ketan Doke")
              ].map((expert, idx) => expert && (
                <div className="eng-expert-card" key={`r2-${idx}`}>
                  {/* Location Badge */}
                  <div className="eng-expert-card-location">
                    <i className="fas fa-map-marker-alt"></i> {expert.branch}
                  </div>

                  {/* Photo Frame */}
                  <div className="eng-expert-photo-frame">
                    <div className="eng-expert-photo-inner">
                      {expert.photo ? (
                        <img src={expert.photo} alt={expert.name} />
                      ) : (
                        <div className="eng-expert-photo-placeholder">
                          <i className="fas fa-user"></i>
                          <span>Photo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="eng-expert-name">{expert.name}</div>
                  <div className="eng-expert-role">{expert.role}</div>

                  {/* Phone */}
                  <div className="eng-expert-phone-display">
                    <i className="fas fa-phone"></i>
                    <span>{expert.display}</span>
                  </div>

                  {/* Buttons row 1: Call + WhatsApp */}
                  <div className="eng-expert-btns">
                    <a href={`tel:${expert.phone}`} className="eng-expert-call-btn">
                      <i className="fas fa-phone-alt"></i> Call Now
                    </a>
                    <a
                      href={`https://wa.me/91${expert.phone}?text=${encodeURIComponent(`Hello ${expert.name} Sir, I am seeking your valuable guidance regarding Engineering Admission.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="eng-expert-wa-btn"
                    >
                      <i className="fab fa-whatsapp"></i> WhatsApp
                    </a>
                  </div>

                  {/* Button row 2: Schedule Call */}
                  <button
                    className="et-schedule-btn"
                    onClick={() => openModal(expert)}
                  >
                    <i className="fas fa-calendar-check"></i> Schedule Call
                  </button>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 5 — GLOBAL CTA BANNER
        ═══════════════════════════════════════════════════ */}
        <section className="et-cta-banner">
          <h2>Not Sure Which Branch to Visit?</h2>
          <p>Schedule a free call and our team will guide you to the right expert.</p>
          <div className="et-cta-btns">
            <button className="et-cta-btn-primary" onClick={() => openModal(null)}>
              <i className="fas fa-calendar-check"></i> Schedule a Free Session
            </button>
            <a href="tel:9309553235" className="et-cta-btn-secondary">
              <i className="fas fa-phone-alt"></i> Call Head Office: 93095 53235
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 6 — FOOTER
        ═══════════════════════════════════════════════════ */}
        <footer className="lp-footer">
          <div className="lp-container">
            <div className="lp-footer-grid">

              {/* Brand */}
              <div className="lp-footer-brand">
                <img src="/landing-assets/images/branding/logo1.png" alt="Admissions Made Easy" className="lp-footer-brand-logo" />
                <p>Maharashtra's most trusted Medical &amp; Engineering admissions consultancy. Guiding students and families since 2011 across 5 branches.</p>
                <div className="lp-social-links">
                  {[
                    ["fab fa-facebook-f", "https://www.facebook.com/admissionsmadeeasy"],
                    ["fab fa-instagram", "https://www.instagram.com/admissionsmadeeasy"],
                    ["fab fa-youtube", "https://www.youtube.com/@sachinbangad21"],
                    ["fab fa-linkedin-in", "https://www.linkedin.com/company/admissions-made-easy"],
                  ].map(([icon, url]) => (
                    <a key={icon} href={url} className="lp-social-link" target="_blank" rel="noopener noreferrer">
                      <i className={icon}></i>
                    </a>
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

      </div>{/* /et-page */}

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — SCHEDULE A CALL MODAL
      ═══════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="et-modal-overlay" onClick={closeModal}>
          <div className="et-modal-card" onClick={e => e.stopPropagation()}>

            {/* Close button */}
            <button className="et-modal-close" onClick={closeModal}>&times;</button>

            {/* ── SUCCESS STATE ── */}
            {modalSuccess ? (
              <div className="et-success-state">
                <div className="et-success-icon">
                  <i className="fas fa-check"></i>
                </div>
                <div className="et-success-title">Session Requested! 🎉</div>
                <p className="et-success-detail">
                  We will call you at <strong>{scheduleForm.phone}</strong> on{" "}
                  <strong>{scheduleForm.date}</strong> at{" "}
                  <strong>{scheduleForm.timeSlot}</strong> via{" "}
                  <strong>{scheduleForm.sessionType}</strong>.
                </p>
                <p className="et-success-note">
                  Our team will confirm your appointment within 2 hours on WhatsApp.
                  A WhatsApp message is being sent to our Head Office with your details.
                </p>
                <button className="et-success-close-btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Green header pill */}
                <div className="et-modal-pill">
                  <h3>📅 Schedule Your Free Counselling Session</h3>
                </div>

                {/* Error message */}
                {formError && (
                  <div className="et-form-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {formError}
                  </div>
                )}

                {/* 1. Student Full Name */}
                <div className="et-form-group">
                  <label className="et-form-label">Student Full Name <span>*</span></label>
                  <input
                    type="text"
                    className="et-input"
                    placeholder="Enter student's full name"
                    value={scheduleForm.name}
                    onChange={e => setScheduleForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>

                {/* 2. Phone Number */}
                <div className="et-form-group">
                  <label className="et-form-label">Phone Number <span>*</span></label>
                  <input
                    type="tel"
                    className="et-input"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={scheduleForm.phone}
                    onChange={e => setScheduleForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))}
                  />
                </div>

                {/* 3. Select Branch */}
                <div className="et-form-group">
                  <label className="et-form-label">Select Branch <span>*</span></label>
                  <select
                    className="et-select"
                    value={scheduleForm.branch}
                    onChange={e => handleBranchChange(e.target.value)}
                  >
                    <option value="">— Choose a branch —</option>
                    {BRANCHES.slice(1).map(b => (
                      <option key={b} value={b}>{b}{b === "Latur" ? " (Head Office)" : ""}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Preferred Expert */}
                <div className="et-form-group">
                  <label className="et-form-label">Preferred Expert</label>
                  <select
                    className="et-select"
                    value={scheduleForm.preferredExpert}
                    onChange={e => setScheduleForm(p => ({ ...p, preferredExpert: e.target.value }))}
                    disabled={!scheduleForm.branch}
                  >
                    <option value="No Preference">No Preference</option>
                    {branchExpertsForModal.map(e => (
                      <option key={e.name} value={e.name}>{e.name}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Session Type */}
                <div className="et-form-group">
                  <label className="et-form-label">Session Type</label>
                  <div className="et-session-row">
                    {["Phone Call", "WhatsApp Call", "Zoom / Video Call"].map(type => (
                      <button
                        key={type}
                        className={`et-session-btn${scheduleForm.sessionType === type ? " active" : ""}`}
                        onClick={() => setScheduleForm(p => ({ ...p, sessionType: type }))}
                      >
                        {type === "Phone Call" && "📞 Phone Call"}
                        {type === "WhatsApp Call" && "💬 WhatsApp Call"}
                        {type === "Zoom / Video Call" && "🎥 Zoom / Video"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Preferred Date */}
                <div className="et-form-group">
                  <label className="et-form-label">Preferred Date <span>*</span></label>
                  <input
                    type="date"
                    className="et-input"
                    min={TODAY}
                    value={scheduleForm.date}
                    onChange={e => setScheduleForm(p => ({ ...p, date: e.target.value }))}
                  />
                </div>

                {/* 7. Time Slot Grid */}
                <div className="et-form-group">
                  <label className="et-form-label">Preferred Time Slot <span>*</span></label>
                  {Object.entries(TIME_SLOTS).map(([period, slots]) => (
                    <div className="et-timeslot-period" key={period}>
                      <span className="et-timeslot-period-label">{period}</span>
                      <div className="et-timeslot-grid">
                        {slots.map(slot => (
                          <button
                            key={slot}
                            className={`et-timeslot-pill${scheduleForm.timeSlot === slot ? " active" : ""}`}
                            onClick={() => setScheduleForm(p => ({ ...p, timeSlot: slot }))}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 8. Message / Note */}
                <div className="et-form-group">
                  <label className="et-form-label">Message / Note <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
                  <textarea
                    className="et-textarea"
                    placeholder="Any specific questions or topics you want to discuss?"
                    value={scheduleForm.message}
                    onChange={e => setScheduleForm(p => ({ ...p, message: e.target.value }))}
                  />
                </div>

                {/* Submit */}
                <button className="et-submit-btn" onClick={handleSubmit}>
                  ✅ Confirm My Session
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
