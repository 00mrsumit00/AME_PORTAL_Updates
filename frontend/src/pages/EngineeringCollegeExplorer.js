import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

const formatFees = (feesStr) => {
  if (!feesStr) return '—';
  const cleaned = String(feesStr)
    .replace(/[₹\u20B9]/g, '') // remove existing rupees symbols
    .replace(/rs\.?/i, '')     // remove "Rs." or "Rs"
    .trim();
  return `₹${cleaned}`;
};

/* ─── MODAL ─────────────────────────────────────────────────────────────── */
function CollegeModal({ college, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const normalizedStatus = college.status ? String(college.status).trim() : '';
  
  let statusColor = '#f59e0b'; // default Private (amber)
  let statusIcon = 'fa-building';
  
  if (/^Government$/i.test(normalizedStatus) || /^Govt\.?$/i.test(normalizedStatus) || /^Semi-Govt\.?$/i.test(normalizedStatus) || /^Municipal$/i.test(normalizedStatus)) {
    statusColor = '#10b981'; // Emerald Green
    statusIcon = 'fa-university';
  } else if (/^Government-Aided$/i.test(normalizedStatus) || /^Govt\.?\s+Aided$/i.test(normalizedStatus)) {
    statusColor = '#38bdf8'; // Sky Blue
    statusIcon = 'fa-award';
  } else if (/^University$/i.test(normalizedStatus)) {
    statusColor = '#a855f7'; // Purple
    statusIcon = 'fa-graduation-cap';
  } else if (/^Private$/i.test(normalizedStatus)) {
    statusColor = '#f59e0b'; // Amber/Orange
    statusIcon = 'fa-building';
  }

  const hostelAvail = college.hostel && (
    String(college.hostel).trim().toUpperCase() === 'YES' ||
    String(college.hostel).trim().toUpperCase() === 'AVAILABLE'
  );
  
  let hostelColor = '#ef4444'; // Red for No
  let hostelIcon = 'fa-times-circle'; // Cross icon
  
  if (hostelAvail) {
    hostelColor = '#10b981'; // Green for Yes
    hostelIcon = 'fa-check-circle'; // Right tick icon
  } else if (!college.hostel || String(college.hostel).trim() === '—' || String(college.hostel).trim() === '') {
    hostelColor = '#6b7280'; // Gray for empty
    hostelIcon = 'fa-question-circle';
  }

  let quotaNote = null;
  if (college.course_type && ['MBBS', 'BDS', 'BAMS'].includes(college.course_type)) {
    if (normalizedStatus && normalizedStatus.toLowerCase().includes('govt')) {
      quotaNote = "Total Seats = 15% AIQ Quota + 85% State Quota";
    } else if (normalizedStatus.toLowerCase() === 'private' && college.course_type === 'BAMS') {
      quotaNote = "Total Seats = 15% AIQ Private Quota + 85% State Quota";
    }
  }

  return (
    <div className="ce-modal-overlay" onClick={onClose}>
      <div className="ce-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="ce-modal-close" onClick={onClose}><i className="fas fa-times" /></button>
        <div className="ce-modal-header">
          {college.code && <span className="ce-modal-code-badge">CODE #{college.code}</span>}
          {college.course_type && (
            <span style={{ marginLeft: college.code ? '0.5rem' : '0', fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', padding: '0.2rem 0.75rem', borderRadius: '50px' }}>{college.course_type}</span>
          )}
          <h2 className="ce-modal-title">{college.name}</h2>
          <span className="ce-modal-status-badge" style={{ background: statusColor + '20', color: statusColor, border: `1px solid ${statusColor}40` }}>
            <i className={`fas ${statusIcon}`}></i> {college.status || '—'}
          </span>
        </div>
        <div className="ce-modal-grid">
          <div className="ce-modal-info-item">
            <i className="fas fa-calendar-alt" style={{ color: '#f59e0b' }}></i>
            <div><span className="ce-modal-info-label">Established</span><span className="ce-modal-info-value">{college.establishment || '—'}</span></div>
          </div>
          <div className="ce-modal-info-item">
            <i className="fas fa-money-bill-wave" style={{ color: '#10b981' }}></i>
            <div><span className="ce-modal-info-label">Annual Fees</span><span className="ce-modal-info-value">{formatFees(college.fees)}</span></div>
          </div>
          <div className="ce-modal-info-item" style={{ display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
               <i className="fas fa-user-graduate" style={{ color: '#3b82f6' }}></i>
              <div><span className="ce-modal-info-label">Intake Capacity</span><span className="ce-modal-info-value">{college.intake_capacity ? `${college.intake_capacity} seats` : '—'}</span></div>
            </div>
            {quotaNote && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px dashed rgba(255,255,255,0.15)', color: '#f59e0b', fontStyle: 'italic', fontSize: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <i className="fas fa-exclamation-circle" style={{ marginTop: '0.1rem', fontSize: '0.85rem' }}></i>
                <span>{quotaNote}</span>
              </div>
            )}
          </div>
          <div className="ce-modal-info-item">
            <i className={`fas ${hostelIcon}`} style={{ color: hostelColor }}></i>
            <div><span className="ce-modal-info-label">Hostel</span><span className="ce-modal-info-value">{college.hostel || '—'}</span></div>
          </div>
          {college.state && (
            <div className="ce-modal-info-item">
              <i className="fas fa-map-marker-alt" style={{ color: '#60a5fa' }}></i>
              <div><span className="ce-modal-info-label">State</span><span className="ce-modal-info-value">{college.state}</span></div>
            </div>
          )}
        </div>
        <div className="ce-modal-note">
          <i className="fas fa-info-circle"></i> Contact your branch counselor for admission guidance and seat availability.
        </div>
        {/* Website + Contact */}
        {(college.website || college.contact_no) && (
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {college.website && (
              <a href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                 target="_blank" rel="noopener noreferrer"
                 style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#60a5fa', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                <i className="fas fa-globe"></i> Visit Website
              </a>
            )}
            {college.contact_no && (
              <a href={`tel:${college.contact_no}`}
                 style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                <i className="fas fa-phone-alt"></i> {college.contact_no}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── COLLEGE CARD ───────────────────────────────────────────────────────── */
function CollegeCard({ college, onDetails }) {
  const normalizedStatus = college.status ? String(college.status).trim() : '';
  
  let statusColor = '#f59e0b'; // default Private (amber)
  let statusIcon = 'fa-building';
  
  if (/^Government$/i.test(normalizedStatus) || /^Govt\.?$/i.test(normalizedStatus) || /^Semi-Govt\.?$/i.test(normalizedStatus) || /^Municipal$/i.test(normalizedStatus)) {
    statusColor = '#10b981'; // Emerald Green
    statusIcon = 'fa-university';
  } else if (/^Government-Aided$/i.test(normalizedStatus) || /^Govt\.?\s+Aided$/i.test(normalizedStatus)) {
    statusColor = '#38bdf8'; // Sky Blue
    statusIcon = 'fa-award';
  } else if (/^University$/i.test(normalizedStatus)) {
    statusColor = '#a855f7'; // Purple
    statusIcon = 'fa-graduation-cap';
  } else if (/^Private$/i.test(normalizedStatus)) {
    statusColor = '#f59e0b'; // Amber/Orange
    statusIcon = 'fa-building';
  }

  const hostelAvail = college.hostel && (
    String(college.hostel).trim().toUpperCase() === 'YES' ||
    String(college.hostel).trim().toUpperCase() === 'AVAILABLE'
  );
  
  let hostelColor = '#ef4444'; // Red for No
  let hostelIcon = 'fa-times-circle'; // Cross icon
  
  if (hostelAvail) {
    hostelColor = '#10b981'; // Green for Yes
    hostelIcon = 'fa-check-circle'; // Right tick icon
  } else if (!college.hostel || String(college.hostel).trim() === '—' || String(college.hostel).trim() === '') {
    hostelColor = '#6b7280'; // Gray for empty
    hostelIcon = 'fa-question-circle';
  }

  return (
    <div className="ce-college-card">
      <div className="ce-card-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          {college.code && <span className="ce-card-code">#{college.code}</span>}
          {college.course_type && (
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#f59e0b', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', padding: '0.1rem 0.55rem', borderRadius: '50px', letterSpacing: '0.5px' }}>{college.course_type}</span>
          )}
        </div>
        <h3 className="ce-card-name">{college.name}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
          {college.establishment && (
            <span className="ce-card-est"><i className="fas fa-calendar-alt" /> Est. {college.establishment}</span>
          )}
          {college.state && (
            <span className="ce-card-est" style={{ color: '#60a5fa', fontWeight: 600 }}><i className="fas fa-map-marker-alt" /> {college.state}</span>
          )}
        </div>
      </div>
      <div className="ce-card-mid">
        <span className="ce-badge" style={{ background: statusColor + '18', color: statusColor, border: `1px solid ${statusColor}35` }}>
          <i className={`fas ${statusIcon}`}></i> {college.status || '—'}
        </span>
        <span className="ce-badge" style={{ background: hostelColor + '18', color: hostelColor, border: `1px solid ${hostelColor}35` }}>
          <i className={`fas ${hostelIcon}`}></i> {college.hostel || '—'}
        </span>
      </div>
      <div className="ce-card-right">
        {college.fees && (
          <div className="ce-card-fee">
            <span className="ce-fee-label">Annual Fees</span>
            <span className="ce-fee-value">{formatFees(college.fees)}</span>
          </div>
        )}
        {college.intake_capacity && (
          <div className="ce-card-intake">
            <i className="fas fa-user-graduate"></i> {college.intake_capacity} seats
          </div>
        )}
        <button className="ce-btn-details" onClick={() => onDetails(college)}>
          More Details <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────────────────────── */
export default function EngineeringCollegeExplorer() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState('');
  const [allColleges, setAllColleges] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [metadata, setMetadata] = useState({ statuses: [], hostel_options: [], course_types: [], states: [] });
  const [searchInput, setSearchInput] = useState('');
  const [courseType, setCourseType] = useState('ALL');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [hostel, setHostel] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [feesRange, setFeesRange] = useState('ALL');
  const statusDropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const debounceRef = useRef(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setShowMobileFilters(true);
    }
  }, []);

  const FEES_RANGES = [
    { label: 'All Fees', value: 'ALL' },
    { label: 'Under ₹2 Lakh (Govt.)', value: 'under2' },
    { label: '₹2L – ₹10L', value: '2to10' },
    { label: '₹10L – ₹15L', value: '10to15' },
    { label: '₹15L – ₹20L', value: '15to20' },
    { label: 'Above ₹20L', value: 'above20' },
  ];

  const parseFees = (feesStr) => {
    if (!feesStr) return 0;
    return parseInt(String(feesStr).replace(/,/g, ''), 10) || 0;
  };

  const applyFeesFilter = (list, range) => {
    if (range === 'ALL') return list;
    return list.filter(c => {
      const f = parseFees(c.fees);
      if (range === 'under2')  return f < 200000;
      if (range === '2to10')   return f >= 200000 && f < 1000000;
      if (range === '10to15')  return f >= 1000000 && f < 1500000;
      if (range === '15to20')  return f >= 1500000 && f < 2000000;
      if (range === 'above20') return f >= 2000000;
      return true;
    });
  };

  const fetchColleges = useCallback(async (proc, search, ct, statList, hs, st, fr) => {
    setLoading(true);
    try {
      const params = { process: proc };
      if (search.trim()) params.search = search.trim();
      if (ct !== 'ALL') params.course_type = ct;
      if (statList && statList.length > 0) params.status = statList.join(',');
      if (hs !== 'ALL') params.hostel = hs;
      if (st !== 'ALL') params.state = st;
      
      const res = await api.get('/engg-colleges/process-search', { params });
      const raw = res.data || [];
      setAllColleges(raw);
      const filtered = applyFeesFilter(raw, fr);
      setColleges(filtered);
      setTotalResults(filtered.length);
    } catch (err) {
      console.error('College search error:', err);
      setAllColleges([]);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load processes on mount
  useEffect(() => {
    api.get('/engg-colleges/processes').then(res => setProcesses(res.data.processes)).catch(console.error);
  }, []);

  // Load process-specific metadata and initial data
  useEffect(() => {
    if (!selectedProcess) {
      setAllColleges([]);
      setColleges([]);
      setTotalResults(0);
      return;
    }
    setLoading(true);
    api.get('/engg-colleges/process-metadata', { params: { process: selectedProcess } })
      .then(res => setMetadata(res.data))
      .catch(console.error);
    
    // Reset filters when process changes
    setCourseType('ALL');
    setSelectedStatuses([]);
    setHostel('ALL');
    setSelectedState('ALL');
    setFeesRange('ALL');
    
    fetchColleges(selectedProcess, searchInput, 'ALL', [], 'ALL', 'ALL', 'ALL');
  }, [selectedProcess, fetchColleges]);

  // Close status dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target))
        setShowStatusDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Re-apply fees filter client-side when feesRange changes
  useEffect(() => {
    const filtered = applyFeesFilter(allColleges, feesRange);
    setColleges(filtered);
    setTotalResults(filtered.length);
  }, [feesRange, allColleges]);

  // Debounced search on filter change
  useEffect(() => {
    if (!selectedProcess) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchColleges(selectedProcess, searchInput, courseType, selectedStatuses, hostel, selectedState, feesRange);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [selectedProcess, searchInput, courseType, selectedStatuses, hostel, selectedState, feesRange, fetchColleges]);

  const handleManualSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchColleges(selectedProcess, searchInput, courseType, selectedStatuses, hostel, selectedState, feesRange);
  };

  const handleReset = () => {
    setSearchInput('');
    setCourseType('ALL');
    setSelectedStatuses([]);
    setHostel('ALL');
    setSelectedState('ALL');
    setFeesRange('ALL');
  };

  const toggleStatus = (s) => {
    setSelectedStatuses(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const statusLabel = selectedStatuses.length === 0
    ? 'College Status'
    : selectedStatuses.length === 1
      ? selectedStatuses[0]
      : `${selectedStatuses.length} selected`;

  return (
    <>
      <style>{`
        /* ─── GLOBAL RESET ─── */
        .ce2-root { all: unset; display: block; font-family: 'Montserrat', system-ui, sans-serif; background: #0d1b2a; min-height: 100vh; color: #e2e8f0; }
        .ce2-root *:not(.fas):not(.fab):not(.far):not([class^="fa-"]),
        .ce2-root *:not(.fas):not(.fab):not(.far):not([class^="fa-"])::before,
        .ce2-root *:not(.fas):not(.fab):not(.far):not([class^="fa-"])::after { box-sizing: border-box; font-family: 'Montserrat', system-ui, sans-serif; }

        /* ─── HEADER ─── */
        .ce2-header { position: sticky; top: 0; z-index: 100; background: rgba(13,27,42,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.07); padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
        .ce2-header-brand { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }
        .ce2-header-brand img { height: 38px; width: auto; }
        .ce2-header-title { font-size: 0.9rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 1.5px; }
        .ce2-header-actions { display: flex; align-items: center; gap: 1rem; }
        .ce2-home-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.8); padding: 0.45rem 1rem; border-radius: 50px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
        .ce2-home-btn:hover { background: rgba(245,158,11,0.15); border-color: #f59e0b; color: #f59e0b; }
        .ce2-cutoff-btn { background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); color: #f59e0b; padding: 0.45rem 1rem; border-radius: 50px; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
        .ce2-cutoff-btn:hover { background: rgba(245,158,11,0.25); }

        /* ─── STATUS CHECKBOX DROPDOWN ─── */
        .ce2-status-wrap { position: relative; }
        .ce2-status-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 0.65rem 1rem; border-radius: 8px; font-size: 0.88rem; font-family: inherit; outline: none; cursor: pointer; transition: border-color 0.2s; min-width: 160px; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; white-space: nowrap; }
        .ce2-status-btn.ce2-active { border-color: #f59e0b; color: #f59e0b; }
        .ce2-status-panel { position: absolute; top: calc(100% + 6px); left: 0; background: #112233; border: 1px solid rgba(245,158,11,0.3); border-radius: 10px; padding: 0.5rem; min-width: 200px; z-index: 200; box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
        .ce2-status-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 6px; cursor: pointer; transition: background 0.15s; font-size: 0.85rem; color: rgba(255,255,255,0.8); }
        .ce2-status-item:hover { background: rgba(245,158,11,0.1); }
        .ce2-status-item input[type=checkbox] { accent-color: #f59e0b; width: 15px; height: 15px; cursor: pointer; }
        .ce2-status-item.checked { color: #f59e0b; font-weight: 700; }

        /* ─── PROCESS TABS ─── */
        .ce2-process-bar { display: flex; gap: 0.5rem; padding: 1.5rem 2rem 0; background: rgba(255,255,255,0.02); }
        .ce2-process-tab { padding: 0.6rem 1.25rem; border-radius: 8px 8px 0 0; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.05); border-bottom: none; color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.03); }
        .ce2-process-tab:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .ce2-process-tab.active { background: #1a3050; color: #f59e0b; border-color: rgba(245,158,11,0.3); border-bottom: 2px solid #f59e0b; }

        /* ─── HERO BANNER ─── */
        .ce2-hero { background: linear-gradient(135deg, #0d1b2a 0%, #1a3050 100%); padding: 2.5rem 2rem; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06); position: relative; overflow: hidden; }
        .ce2-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 65%); pointer-events: none; }
        .ce2-hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); color: #f59e0b; padding: 0.35rem 1rem; border-radius: 50px; font-size: 0.72rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 1rem; }
        .ce2-hero h1 { font-size: clamp(1.6rem, 4vw, 2.5rem); font-weight: 900; color: #fff; margin-bottom: 0.5rem; }
        .ce2-hero p { color: rgba(255,255,255,0.55); font-size: 0.95rem; max-width: 540px; margin: 0 auto; }

        /* ─── FILTER BAR ─── */
        .ce2-filter-bar { background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.07); padding: 1.25rem 2rem; display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
        .ce2-search-wrap { position: relative; flex: 1; min-width: 220px; max-width: 400px; }
        .ce2-search-wrap i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); font-size: 0.9rem; }
        .ce2-search-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 0.65rem 1rem 0.65rem 2.5rem; border-radius: 8px; font-size: 0.9rem; font-family: inherit; outline: none; transition: border-color 0.2s; }
        .ce2-search-input::placeholder { color: rgba(255,255,255,0.3); }
        .ce2-search-input:focus { border-color: #f59e0b; }
        .ce2-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 0.65rem 1rem; border-radius: 8px; font-size: 0.88rem; font-family: inherit; outline: none; cursor: pointer; transition: border-color 0.2s; min-width: 160px; }
        .ce2-select:focus { border-color: #f59e0b; }
        .ce2-select option { background: #1a3050; }
        .ce2-search-btn { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; padding: 0.65rem 1.5rem; border-radius: 8px; border: none; cursor: pointer; font-size: 0.9rem; font-family: inherit; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; white-space: nowrap; }
        .ce2-search-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .ce2-reset-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.6); padding: 0.65rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.88rem; font-family: inherit; transition: all 0.2s; }
        .ce2-reset-btn:hover { border-color: rgba(255,255,255,0.3); color: #fff; }

        /* ─── RESULTS META ─── */
        .ce2-results-meta { padding: 0.9rem 2rem; display: flex; align-items: center; gap: 1rem; font-size: 0.82rem; color: rgba(255,255,255,0.45); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .ce2-results-count { font-weight: 700; color: #f59e0b; }

        /* ─── LIST ─── */
        .ce2-list { padding: 1.5rem 2rem; display: flex; flex-direction: column; gap: 0.85rem; max-width: 1200px; margin: 0 auto; }

        /* ─── COLLEGE CARD ─── */
        .ce-college-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1.5rem; transition: all 0.25s; cursor: default; }
        .ce-college-card:hover { border-color: rgba(245,158,11,0.35); background: rgba(255,255,255,0.06); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
        .ce-card-left { flex: 1; min-width: 0; }
        .ce-card-code { font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: 1px; display: block; margin-bottom: 0.3rem; }
        .ce-card-name { font-size: 1rem; font-weight: 700; color: #fff; line-height: 1.4; margin: 0 0 0.4rem; }
        .ce-card-est { font-size: 0.78rem; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 0.4rem; }
        .ce-card-mid { display: flex; flex-direction: column; gap: 0.5rem; flex-shrink: 0; }
        .ce-badge { padding: 0.35rem 0.85rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; white-space: nowrap; display: flex; align-items: center; gap: 0.4rem; }
        .ce-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; flex-shrink: 0; text-align: right; }
        .ce-card-fee { display: flex; flex-direction: column; }
        .ce-fee-label { font-size: 0.68rem; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .ce-fee-value { font-size: 1rem; font-weight: 800; color: #10b981; }
        .ce-card-intake { font-size: 0.8rem; color: rgba(255,255,255,0.45); display: flex; align-items: center; gap: 0.4rem; }
        .ce-btn-details { background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); color: #f59e0b; padding: 0.5rem 1.1rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
        .ce-btn-details:hover { background: rgba(245,158,11,0.25); border-color: #f59e0b; }

        /* ─── STATES ─── */
        .ce2-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 2rem; gap: 1rem; }
        .ce2-spinner { width: 44px; height: 44px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: ce2-spin 0.8s linear infinite; }
        @keyframes ce2-spin { to { transform: rotate(360deg); } }
        .ce2-loading p { color: rgba(255,255,255,0.45); font-size: 0.9rem; }
        .ce2-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 2rem; gap: 1rem; }
        .ce2-empty i { font-size: 3rem; color: rgba(255,255,255,0.1); }
        .ce2-empty p { color: rgba(255,255,255,0.4); font-size: 1rem; }

        /* ─── MODAL ─── */
        .ce-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .ce-modal-card { background: #112233; border: 1px solid rgba(245,158,11,0.25); border-radius: 16px; width: 100%; max-width: 600px; padding: 2rem; position: relative; box-shadow: 0 30px 80px rgba(0,0,0,0.6); }
        .ce-modal-close { position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; transition: all 0.2s; }
        .ce-modal-close:hover { background: rgba(239,68,68,0.2); border-color: #ef4444; color: #ef4444; }
        .ce-modal-header { margin-bottom: 1.75rem; }
        .ce-modal-code-badge { font-size: 0.72rem; font-weight: 800; color: rgba(255,255,255,0.35); letter-spacing: 1.5px; text-transform: uppercase; }
        .ce-modal-title { font-size: 1.25rem; font-weight: 800; color: #fff; line-height: 1.4; margin: 0.5rem 0 0.75rem; }
        .ce-modal-status-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; border-radius: 50px; font-size: 0.78rem; font-weight: 700; }
        .ce-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .ce-modal-info-item { display: flex; align-items: center; gap: 0.85rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 1rem; }
        .ce-modal-info-item i { font-size: 1.1rem; flex-shrink: 0; }
        .ce-modal-info-label { display: block; font-size: 0.68rem; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.2rem; }
        .ce-modal-info-value { display: block; font-size: 0.95rem; font-weight: 700; color: #fff; }
        .ce-modal-note { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); border-radius: 10px; padding: 0.85rem 1rem; font-size: 0.82rem; color: rgba(255,255,255,0.55); display: flex; align-items: flex-start; gap: 0.6rem; line-height: 1.5; }
        .ce-modal-note i { color: #f59e0b; margin-top: 0.1rem; flex-shrink: 0; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 768px) {
          .ce-college-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .ce-card-right { align-items: flex-start; text-align: left; width: 100%; flex-direction: row; flex-wrap: wrap; gap: 0.75rem; }
          .ce-card-mid { flex-direction: row; }
          
          /* Mobile Filters overrides */
          .ce2-filter-bar { padding: 1rem; justify-content: center; background: transparent; border-bottom: none; }
          .ce2-desktop-filters { display: none !important; }
          .ce2-mobile-filter-trigger-wrap { display: block !important; }
          
          /* Header Button Fixes */
          .ce2-header-actions { gap: 0.5rem; }
          .ce2-cutoff-btn, .ce2-home-btn { height: 36px; white-space: nowrap; padding: 0 0.75rem; font-size: 0.75rem; }

          .ce2-list { padding: 1rem; }
          .ce-modal-grid { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
          .ce-modal-info-item { padding: 0.75rem 0.6rem; gap: 0.5rem; }
          .ce-modal-info-item i { font-size: 0.95rem; }
          .ce-modal-info-label { font-size: 0.55rem; margin-bottom: 0.1rem; }
          .ce-modal-info-value { font-size: 0.8rem; word-break: break-word; }
          .ce2-header-title { display: none; }
          .ce2-process-bar { padding: 1rem 1rem 0; overflow-x: auto; white-space: nowrap; }
          .ce2-process-tab { padding: 0.5rem 1rem; }
        }

        /* ─── MOBILE FILTER DRAWER ─── */
        .ce2-mobile-drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 999; animation: ce2-fadeIn 0.25s ease; }
        .ce2-mobile-drawer-sheet { position: fixed; bottom: 0; left: 0; right: 0; background: #112233; border-radius: 24px 24px 0 0; border-top: 2px solid rgba(245,158,11,0.3); padding: 2rem 1.5rem; z-index: 1000; animation: ce2-slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1); max-height: 85vh; overflow-y: auto; display: flex; flex-direction: column; }
        .ce2-drawer-drag-handle { width: 40px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: -1rem auto 1.5rem; }
        .ce2-drawer-title { font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 1.5rem; }
        .ce2-drawer-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .ce2-drawer-label { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.5px; }
        .ce2-drawer-select, .ce2-drawer-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 0.8rem 1rem; border-radius: 12px; font-size: 0.95rem; font-family: inherit; outline: none; }
        .ce2-drawer-select:focus, .ce2-drawer-input:focus { border-color: #f59e0b; }
        .ce2-drawer-select option { background: #112233; }
        .ce2-drawer-apply-btn { width: 100%; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; padding: 0.9rem; border-radius: 12px; border: none; font-size: 1rem; margin-top: 0.5rem; cursor: pointer; transition: transform 0.15s; }
        .ce2-drawer-apply-btn:active { transform: scale(0.98); }
        .ce2-mobile-filter-trigger { width: 100%; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); color: #f59e0b; padding: 0.8rem; border-radius: 12px; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

        @keyframes ce2-slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes ce2-fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div className="ce2-root">
        {/* Header */}
        <header className="ce2-header">
          <div className="ce2-header-brand" onClick={() => navigate('/')}>
            <img src="/landing-assets/images/branding/logo1.png" alt="AME Logo" />
            <span className="ce2-header-title">Engineering Explorer</span>
          </div>
        </header>

        {/* Hero */}
        <div className="ce2-hero">
          <div className="ce2-hero-badge"><i className="fas fa-microchip"></i> {selectedProcess ? `${selectedProcess} Admissions` : 'Select Admissions Process'}</div>
          <h1>Engineering College Explorer</h1>
          <p>Browse top {selectedProcess ? `${selectedProcess} engineering colleges` : 'engineering colleges'} — filter by course, hostel availability, fees &amp; more.</p>
        </div>

        {/* Process Tabs */}
        <div className="ce2-process-bar">
          {processes.map(p => (
            <div
              key={p}
              className={`ce2-process-tab ${selectedProcess === p ? 'active' : ''}`}
              onClick={() => setSelectedProcess(p)}
            >
              {p === 'AIIMS' ? 'AIIMS / JIPMER' : p}
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="ce2-filter-bar">
          <div className="ce2-desktop-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
            <div className="ce2-search-wrap">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="ce2-search-input"
                placeholder="Search college name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            {metadata.course_types && metadata.course_types.length > 0 && (
              <select className="ce2-select" value={courseType} onChange={(e) => setCourseType(e.target.value)}>
                <option value="ALL">All Courses</option>
                {metadata.course_types.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}

            {/* State Filter (AIIMS & DEEMED) */}
            {(selectedProcess === 'DEEMED' || selectedProcess === 'AIIMS') && (
              <select className="ce2-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                <option value="ALL">All States</option>
                {metadata.states && metadata.states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}

            {/* Multi-checkbox Status Dropdown */}
            {metadata.statuses && metadata.statuses.length > 0 && selectedProcess !== 'AIIMS' && selectedProcess !== 'DEEMED' && (
              <div className="ce2-status-wrap" ref={statusDropdownRef}>
                <button
                  className={`ce2-status-btn${selectedStatuses.length > 0 ? ' ce2-active' : ''}`}
                  onClick={() => setShowStatusDropdown(v => !v)}
                >
                  <i className="fas fa-filter"></i> {statusLabel}
                  <i className={`fas fa-chevron-${showStatusDropdown ? 'up' : 'down'}`} style={{ fontSize: '0.7rem', opacity: 0.6 }}></i>
                </button>
                {showStatusDropdown && (
                  <div className="ce2-status-panel">
                    {selectedStatuses.length > 0 && (
                      <div
                        onClick={() => setSelectedStatuses([])}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: '#f59e0b', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '0.25rem' }}
                      >
                        <i className="fas fa-times"></i> Clear selection
                      </div>
                    )}
                    {metadata.statuses.map(s => (
                      <label key={s} className={`ce2-status-item${selectedStatuses.includes(s) ? ' checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(s)}
                          onChange={() => toggleStatus(s)}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {metadata.hostel_options && metadata.hostel_options.length > 0 && selectedProcess !== 'AIIMS' && (
              <select className="ce2-select" value={hostel} onChange={(e) => setHostel(e.target.value)}>
                <option value="ALL">Hostel Status</option>
                {metadata.hostel_options.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            )}

            {/* Fees Filter (Not for AIIMS) */}
            {selectedProcess !== 'AIIMS' && (
              <select className="ce2-select" value={feesRange} onChange={(e) => setFeesRange(e.target.value)}>
                {FEES_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            )}
            <button className="ce2-search-btn" onClick={handleManualSearch}>
              <i className="fas fa-search"></i> Search
            </button>
            <button className="ce2-reset-btn" onClick={handleReset}>
              <i className="fas fa-redo-alt"></i> Reset
            </button>
          </div>

          {/* Mobile Filter Trigger */}
          <div style={{ display: 'none', width: '100%' }} className="ce2-mobile-filter-trigger-wrap">
            <button className="ce2-mobile-filter-trigger" onClick={() => setShowMobileFilters(true)} style={{ marginBottom: '1rem' }}>
              <i className="fas fa-sliders-h"></i> Adjust Search Filters
            </button>
            <div className="ce2-search-wrap" style={{ width: '100%', maxWidth: '100%' }}>
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="ce2-search-input"
                placeholder="Search college name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results meta */}
        {!loading && colleges.length > 0 && selectedProcess && (
          <div className="ce2-results-meta">
            <span className="ce2-results-count">{totalResults}</span>
            <span>college{totalResults !== 1 ? 's' : ''} found</span>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="ce2-loading">
            <div className="ce2-spinner" />
            <p>Searching colleges...</p>
          </div>
        ) : !selectedProcess ? (
          <div className="ce2-empty">
            <i className="fas fa-hand-pointer" style={{ fontSize: '3rem', color: 'rgba(245,158,11,0.5)' }}></i>
            <p style={{ marginTop: '1rem' }}>Please select an Admission Process / Quota to view colleges.</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="ce2-empty">
            <i className="fas fa-university"></i>
            <p>No colleges found matching your search.</p>
          </div>
        ) : (
          <div className="ce2-list">
            {colleges.map((college, idx) => (
              <CollegeCard key={college.code || idx} college={college} onDetails={setSelectedCollege} />
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedCollege && (
          <CollegeModal college={selectedCollege} onClose={() => setSelectedCollege(null)} />
        )}

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="ce2-mobile-drawer-overlay" onClick={() => setShowMobileFilters(false)}>
            <div className="ce2-mobile-drawer-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="ce2-drawer-drag-handle" />
              <h3 className="ce2-drawer-title">Filter Results</h3>
              
              <div className="ce2-drawer-group">
                <span className="ce2-drawer-label">Select Admission Process / Quota</span>
                <select 
                  className="ce2-drawer-select" 
                  value={selectedProcess} 
                  onChange={(e) => setSelectedProcess(e.target.value)}
                  style={{ border: '1px solid #f59e0b', background: 'rgba(245,158,11,0.08)', fontWeight: '700', color: '#f59e0b' }}
                >
                  <option value="" disabled hidden>Please select</option>
                  {processes.map(p => (
                    <option key={p} value={p}>{p === 'AIIMS' ? 'AIIMS / JIPMER' : p}</option>
                  ))}
                </select>
              </div>

              {metadata.course_types && metadata.course_types.length > 0 && (
                <div className="ce2-drawer-group">
                  <span className="ce2-drawer-label">Course Type</span>
                  <select className="ce2-drawer-select" value={courseType} onChange={(e) => setCourseType(e.target.value)}>
                    <option value="ALL">All Courses</option>
                    {metadata.course_types.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}

              {(selectedProcess === 'DEEMED' || selectedProcess === 'AIIMS') && (
                <div className="ce2-drawer-group">
                  <span className="ce2-drawer-label">State</span>
                  <select className="ce2-drawer-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                    <option value="ALL">All States</option>
                    {metadata.states && metadata.states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {metadata.statuses && metadata.statuses.length > 0 && selectedProcess !== 'AIIMS' && selectedProcess !== 'DEEMED' && (
                <div className="ce2-drawer-group">
                  <span className="ce2-drawer-label">College Status</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.2rem' }}>
                    {metadata.statuses.map(s => {
                      const isSelected = selectedStatuses.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleStatus(s)}
                          style={{
                            background: isSelected ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
                            border: `1px solid ${isSelected ? '#f59e0b' : 'rgba(255,255,255,0.12)'}`,
                            color: isSelected ? '#f59e0b' : 'rgba(255,255,255,0.7)',
                            padding: '0.5rem 0.8rem',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: isSelected ? 700 : 500
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {metadata.hostel_options && metadata.hostel_options.length > 0 && selectedProcess !== 'AIIMS' && (
                <div className="ce2-drawer-group">
                  <span className="ce2-drawer-label">Hostel Availability</span>
                  <select className="ce2-drawer-select" value={hostel} onChange={(e) => setHostel(e.target.value)}>
                    <option value="ALL">Hostel Status</option>
                    {metadata.hostel_options.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              )}

              {selectedProcess !== 'AIIMS' && (
                <div className="ce2-drawer-group">
                  <span className="ce2-drawer-label">Fee Range</span>
                  <select className="ce2-drawer-select" value={feesRange} onChange={(e) => setFeesRange(e.target.value)}>
                    {FEES_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              )}

              <button className="ce2-drawer-apply-btn" onClick={() => { handleManualSearch(); setShowMobileFilters(false); }}>
                Apply Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
