import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { DOCUMENTS, CATEGORY_RULES, RESERVATION_RULES } from "./data";
import {
  CategorySelector,
  ReservationSelector,
  ProgressBar,
  ChecklistCard
} from "./components";
import "./MedicalDocumentsChecklist.css";

const STORAGE_KEY = "ame_medical_checklist_v1";

export default function MedicalDocumentsChecklist() {
  const navigate = useNavigate();

  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────
  const [category, setCategory] = useState("OPEN");
  const [reservation, setReservation] = useState([]);
  const [checkedDocs, setCheckedDocs] = useState([]);
  const [showChecklist, setShowChecklist] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");

  // ─── PERSISTENCE (LOCAL STORAGE) ──────────────────────────────────────
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.reservation) setReservation(Array.isArray(parsed.reservation) ? parsed.reservation : [parsed.reservation]);
        if (parsed.checked) setCheckedDocs(parsed.checked);
        // If they had already loaded filters, immediately show the checklist
        setShowChecklist(true);
      }
    } catch (e) {
      console.error("Error reading checklist localStorage:", e);
    }
  }, []);

  const saveToStorage = (newCategory, newReservation, newChecked) => {
    try {
      const dataToSave = {
        category: newCategory,
        reservation: newReservation,
        checked: newChecked
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Error writing checklist localStorage:", e);
    }
  };

  // Get current date time for print header
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }) + " | " + now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit"
        })
      );
    };
    updateDateTime();
  }, []);

  // ─── DYNAMIC DOCUMENT CALCULATION ─────────────────────────────────────
  // 1. General base documents
  const baseDocIds = [
    "neet-admit",
    "neet-marksheet",
    "nationality-proof",
    "domicile-cert",
    "hsc-marksheet",
    "ssc-cert",
    "med-fitness",
    "character-cert"
  ];

  // 2. Mapped category documents
  const categoryDocIds = CATEGORY_RULES[category] || [];

  // 3. Mapped reservation documents (supports multiple selections)
  const reservationDocIds = reservation.reduce((acc, res) => [...acc, ...(RESERVATION_RULES[res] || [])], []);

  // Union of all required document IDs
  const requiredDocIds = Array.from(
    new Set([...baseDocIds, ...categoryDocIds, ...reservationDocIds])
  );

  // Group into General vs Reservation/Category sections
  const generalDocs = requiredDocIds
    .filter((id) => DOCUMENTS[id]?.section === "general")
    .map((id) => ({ id, ...DOCUMENTS[id] }));

  const conditionalDocs = requiredDocIds
    .filter((id) => DOCUMENTS[id]?.section !== "general")
    .map((id) => ({ id, ...DOCUMENTS[id] }));

  const totalRequiredCount = requiredDocIds.length;
  const completedCount = checkedDocs.filter((id) => requiredDocIds.includes(id)).length;

  // ─── EVENT HANDLERS ────────────────────────────────────────────────────
  const handleToggleDoc = (docId) => {
    let updated;
    if (checkedDocs.includes(docId)) {
      updated = checkedDocs.filter((id) => id !== docId);
    } else {
      updated = [...checkedDocs, docId];
    }
    setCheckedDocs(updated);
    saveToStorage(category, reservation, updated);
  };

  const handleVerify = () => {
    setShowChecklist(true);
    saveToStorage(category, reservation, checkedDocs);
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    saveToStorage(val, reservation, checkedDocs);
  };

  const handleReservationChange = (val) => {
    setReservation(val);
    saveToStorage(category, val, checkedDocs);
  };

  const handleReset = () => {
    setCheckedDocs([]);
    setCategory("OPEN");
    setReservation([]);
    setShowChecklist(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // List of constants for selections
  const CATEGORIES = Object.keys(CATEGORY_RULES);
  const RESERVATIONS = Object.keys(RESERVATION_RULES);

  return (
    <>
      <Helmet>
        <title>Maharashtra Medical Admission Documents Checklist | Admissions Made Easy</title>
        <meta name="description" content="Generate your customized document checklist for Maharashtra NEET UG 2026 medical counselling based on your category and special reservation criteria." />
      </Helmet>

      <div className="mdc-wrapper">
        <div className="mdc-container">
          
          {/* Header */}
          <header className="mdc-nav-bar">
            <button className="mdc-back-btn" onClick={() => navigate("/medical-admission")}>
              <i className="fas fa-arrow-left" /> Back to Medical Admission
            </button>
            <div className="mdc-brand">
              <img src="/landing-assets/images/branding/logo1.png" alt="AME Logo" />
            </div>
          </header>

          {/* Hidden Print Header (Will render in print media preview) */}
          <div className="mdc-print-header" style={{ display: "none" }}>
            <h1 className="mdc-print-title">Admissions Made Easy</h1>
            <p className="mdc-print-sub">NEET UG 2026 Maharashtra Medical Admission Documents Checklist</p>
            <div className="mdc-print-meta">
              <div className="mdc-print-meta-item">Category: <span>{category}</span></div>
              <div className="mdc-print-meta-item">Special Reservation: <span>{reservation.length === 0 ? "None" : reservation.join(", ")}</span></div>
              <div className="mdc-print-meta-item">Completed Checklist: <span>{completedCount} of {totalRequiredCount} required</span></div>
              <div className="mdc-print-meta-item">Generated On: <span>{currentDateTime}</span></div>
            </div>
          </div>

          {/* Hero Section */}
          <section className="mdc-hero">
            <div className="mdc-hero-badge">
              <i className="fas fa-clipboard-check" /> AME SMART DIAGNOSTICS
            </div>
            <h1>Your Personalized <span>Admission Checklist</span></h1>
            <p>
              Avoid last-minute document rejection at verification centres. Select your details to dynamically calculate your required documents for NEET UG 2026.
            </p>
          </section>

          {/* Setup Panel (Selectors) */}
          <section className="mdc-panel">
            <h3 className="mdc-panel-title">
              <i className="fas fa-sliders-h" /> Customize Your Profile
            </h3>
            <div className="mdc-selectors-grid">
              <CategorySelector 
                value={category} 
                onChange={handleCategoryChange} 
                categories={CATEGORIES} 
              />
              <ReservationSelector 
                value={reservation} 
                onChange={handleReservationChange} 
                reservations={RESERVATIONS} 
              />
            </div>
            {!showChecklist && (
              <button className="mdc-verify-btn" onClick={handleVerify}>
                <i className="fas fa-check-double" /> Verify My Documents
              </button>
            )}
          </section>

          {/* Checklist Dashboard & Progress */}
          {showChecklist && (
            <div style={{ animation: "mdcFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
              <ProgressBar 
                completed={completedCount} 
                total={totalRequiredCount} 
                onPrint={handlePrint}
                onReset={handleReset}
              />

              <div className="mdc-sections-wrapper">
                
                {/* Section 1: Academic & General */}
                {generalDocs.length > 0 && (
                  <div className="mdc-section">
                    <div className="mdc-section-header">
                      <div className="mdc-section-badge">1</div>
                      <h4 className="mdc-section-title">Step 1: General &amp; Academic Documents</h4>
                    </div>
                    <div className="mdc-list">
                      {generalDocs.map((doc, idx) => (
                        <ChecklistCard 
                          key={doc.id}
                          docId={doc.id}
                          doc={doc}
                          checked={checkedDocs.includes(doc.id)}
                          onToggle={() => handleToggleDoc(doc.id)}
                          index={idx}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 2: Reservation & Category */}
                {conditionalDocs.length > 0 && (
                  <div className="mdc-section">
                    <div className="mdc-section-header">
                      <div className="mdc-section-badge">2</div>
                      <h4 className="mdc-section-title">Step 2: Category &amp; Special Reservation Documents</h4>
                    </div>
                    <div className="mdc-list">
                      {conditionalDocs.map((doc, idx) => (
                        <ChecklistCard 
                          key={doc.id}
                          docId={doc.id}
                          doc={doc}
                          checked={checkedDocs.includes(doc.id)}
                          onToggle={() => handleToggleDoc(doc.id)}
                          index={idx + generalDocs.length}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Guiding Box */}
              <div className="mdc-guidance-card">
                <i className="fas fa-info-circle" />
                <div className="mdc-guidance-text">
                  <h4>Crucial Verification Guidance</h4>
                  <p>
                    Ensure that all certificates match the spelling of the name printed on the candidate's NEET UG 2026 Admit Card exactly. If there is a spelling mismatch, carry a notarized <a href="/document-formats/name_change_affidavit.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#f59e0b", textDecoration: "underline", fontWeight: "700" }}>Name Change Affidavit</a> along with these files.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
