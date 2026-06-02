import React, { useState } from "react";

/* ─── TOOLTIP INFO ───────────────────────────────────────────────────────── */
export function TooltipInfo({ text }) {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <i className="fas fa-info-circle mdc-tooltip-trigger" />
      {visible && (
        <div 
          className="mdc-tooltip-box"
          style={{
            position: "absolute",
            bottom: "125%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
            pointerEvents: "none"
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

/* ─── CATEGORY SELECTOR ─────────────────────────────────────────────────── */
export function CategorySelector({ value, onChange, categories }) {
  return (
    <div className="mdc-select-group">
      <span className="mdc-select-label">1. Candidate Category</span>
      <div className="mdc-select-wrapper">
        <select 
          className="mdc-select" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <i className="fas fa-chevron-down" />
      </div>
    </div>
  );
}

/* ─── RESERVATION SELECTOR ────────────────────────────────────────────── */
export function ReservationSelector({ value, onChange, reservations }) {
  return (
    <div className="mdc-select-group">
      <span className="mdc-select-label">2. Special Reservation</span>
      <div className="mdc-select-wrapper">
        <select 
          className="mdc-select" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        >
          {reservations.map((res) => (
            <option key={res} value={res}>
              {res === "NONE" ? "No Special Reservation" : res}
            </option>
          ))}
        </select>
        <i className="fas fa-chevron-down" />
      </div>
    </div>
  );
}

/* ─── PROGRESS BAR ──────────────────────────────────────────────────────── */
export function ProgressBar({ completed, total, onPrint, onReset }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mdc-dashboard">
      <div className="mdc-progress-info">
        <div className="mdc-progress-label">Documents Completed</div>
        <div className="mdc-progress-count">
          {completed} / {total}
          <span className="mdc-progress-percentage">{percentage}%</span>
        </div>
      </div>

      <div className="mdc-progress-bar-container">
        <div 
          className="mdc-progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mdc-actions">
        <button className="mdc-action-btn print-btn" onClick={onPrint}>
          <i className="fas fa-print" /> Print Checklist
        </button>
        <button className="mdc-action-btn" onClick={onReset} title="Clear saved progress">
          <i className="fas fa-redo-alt" /> Reset
        </button>
      </div>
    </div>
  );
}

/* ─── CHECKLIST CARD ────────────────────────────────────────────────────── */
export function ChecklistCard({ docId, doc, checked, onToggle, index }) {
  const badgeClassMap = {
    important: "badge-important",
    warning: "badge-warning",
    renewal: "badge-renewal",
    info: "badge-info"
  };

  const badgeClass = doc.badge ? badgeClassMap[doc.badge.type] || "badge-important" : "badge-important";

  return (
    <div 
      className={`mdc-card${checked ? ' checked' : ''}`}
      onClick={onToggle}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="mdc-checkbox-container">
        <i className="fas fa-check" />
      </div>

      <div className="mdc-card-content">
        <div className="mdc-doc-info">
          <div className="mdc-doc-title-wrap">
            <span className="mdc-doc-title">{doc.title}</span>
            {doc.badge && (
              <span className={`mdc-badge ${badgeClass}`}>
                {doc.badge.text}
              </span>
            )}
            {doc.tooltip && <TooltipInfo text={doc.tooltip} />}
          </div>
        </div>

        <div className="mdc-card-actions" onClick={(e) => e.stopPropagation()}>
          {doc.sampleUrl && (
            <a 
              href={doc.sampleUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mdc-download-link"
            >
              <i className="fas fa-file-download" /> Download Format
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
