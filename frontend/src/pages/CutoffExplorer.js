import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CutoffExplorer.css';

import api from '@/lib/api';

export default function CutoffExplorer() {
  const navigate = useNavigate();
  const [view, setView] = useState('lead'); // 'lead' or 'dashboard'
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState({ sheets: [], filters: {} });
  const [filters, setFilters] = useState({
    sheetName: '',
    category: 'OPEN',
    gender: 'G',
    state: 'ALL STATE'
  });
  const [tableData, setTableData] = useState({ head: [], body: [] });
  const [error, setError] = useState('');
  const [studentName, setStudentName] = useState('');
  const [showDevToolsError, setShowDevToolsError] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Check for existing lead
  useEffect(() => {
    const savedName = localStorage.getItem('ame_student_name');
    const savedPhone = localStorage.getItem('ame_student_phone');
    if (savedName && savedPhone) {
      setStudentName(savedName);
      setView('dashboard');
    }
  }, []);

  // Security Locks (L1-L4) & DevTools Trap (L6)
  useEffect(() => {
    if (view !== 'dashboard') return;

    // L1-L4: Disable common scraping vectors
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      // Disable PrintScreen, F12, Ctrl+Shift+I, Ctrl+U, Ctrl+C, Ctrl+V, Ctrl+S
      if (
        e.key === 'PrintScreen' || 
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'p' || e.key === 'c' || e.key === 'v'))
      ) {
        e.preventDefault();
        return false;
      }
    };
    const handleSelectStart = (e) => e.preventDefault();
    const handleCopy = (e) => e.preventDefault();

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);

    // L6: DevTools Trap (Window size monitoring)
    // Increased threshold and limited to desktop to prevent mobile browser UI false positives
    const threshold = 300;
    const checkDevTools = () => {
      if (window.innerWidth > 1024) {
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;
        if (widthDiff || heightDiff) {
          setShowDevToolsError(true);
        }
      }
    };

    const devToolsInterval = setInterval(checkDevTools, 1000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      clearInterval(devToolsInterval);
    };
  }, [view]);

  // Fetch Metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await api.get("/cutoff/metadata");
        const data = res.data;
        setMetadata(data);
        if (data.sheets.length > 0) {
          setFilters(prev => ({ ...prev, sheetName: data.sheets[0] }));
        }
      } catch (err) {
        console.error(err);
        setError('Error connecting to server.');
      }
    };
    fetchMetadata();
  }, []);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const phone = formData.get('whatsapp');
    const course = formData.get('course');
    const score = formData.get('score');
    const location = formData.get('location');
    
    // Save to localStorage as per architecture doc
    localStorage.setItem('ame_student_name', name);
    localStorage.setItem('ame_student_phone', phone);
    
    // Push data to Google Sheets via Web App URL
    const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwOKoDjkqcvKucf0-hxMijLCDPEGdHQp4wQrRTtsSfagbehVZRmHkXS_EpxF2hbvGCFnQ/exec";
    
    const data = new FormData();
    data.append('timestamp', new Date().toLocaleString());
    data.append('name', name);
    data.append('phone', phone);
    data.append('course', course);
    data.append('score', score);
    data.append('location', location);

    fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: data
    }).catch(err => console.error('Error saving lead to sheet:', err));
    
    setStudentName(name);
    setView('dashboard');
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post("/cutoff/data", filters);
      const data = res.data.data;

      if (!data || data.length < 2) {
        setError('No data available for these filters.');
        setLoading(false);
        return;
      }

      processTableData(data);
    } catch (err) {
      setError('Failed to load cutoff data.');
    } finally {
      setLoading(false);
    }
  };

  const processTableData = (data) => {
    const rawHeaderRow = data[0];
    const subHeaderRow = data[1] || [];
    const sheetName = filters.sheetName.toUpperCase();

    const isStateQuota = sheetName.includes('STATE QUOTA');

    let baseColsEndIndex = 2;
    for (let i = 0; i < 5; i++) {
      let h = (rawHeaderRow[i] || "").toString().toUpperCase();
      if (h.includes(' R1') || h.includes('ROUND 1')) {
        baseColsEndIndex = i - 1;
        break;
      }
    }

    let colsToRender = [];
    for (let i = 0; i <= baseColsEndIndex; i++) colsToRender.push(i);

    if (isStateQuota) {
      const cat = filters.category.toUpperCase();
      const gen = filters.gender.toUpperCase();
      const searchKey = `${cat} ${gen}`;
      
      // Special case for ALL CATEGORY
      if (cat === 'ALL CATEGORY') {
         for (let i = baseColsEndIndex + 1; i < rawHeaderRow.length; i++) {
            let hStr = (rawHeaderRow[i] || "").toString().toUpperCase();
            if (hStr.includes(` ${gen} `) || hStr.includes(` ${gen}R`) || hStr.includes(`${gen} R`)) {
                colsToRender.push(i);
            }
         }
      } else {
        for (let i = baseColsEndIndex + 1; i < rawHeaderRow.length; i++) {
          let hStr = (rawHeaderRow[i] || "").toString().toUpperCase();
          if (hStr.startsWith(searchKey)) colsToRender.push(i);
        }
      }
    } else {
      // AIIMS or Deemed or others
      for (let i = baseColsEndIndex + 1; i < rawHeaderRow.length; i++) {
        colsToRender.push(i);
      }
    }

    if (colsToRender.length <= baseColsEndIndex + 1) {
        setError("No data found for this category/gender combination.");
        return;
    }

    // Prepare final data
    const head = colsToRender.map(idx => ({
      title: (rawHeaderRow[idx] || "").toString().replace(/\.[0-9]$/, ''),
      subtitle: (subHeaderRow[idx] || "").toString().trim()
    }));

    let startRow = (subHeaderRow.includes('AIR') || subHeaderRow.includes('SCORE')) ? 2 : 1;
    const body = data.slice(startRow)
      .filter(row => row && row[1]) // Ensure data exists
      .map(row => colsToRender.map(idx => row[idx] ?? '-'));

    setTableData({ head, body });
  };

  return (
    <div className="ce-root">
      <Helmet>
        <title>NEET 2026 Cutoff Explorer | Predicting Your Success</title>
        <meta name="description" content="Analyze last year's cutoff data across all categories and colleges in Maharashtra. Data-driven insights to help you secure your dream medical seat." />
        <meta property="og:title" content="Maharashtra NEET Cutoff Explorer | Admissions Made Easy" />
        <meta property="og:description" content="Unlock precise, verified previous-year cutoff data for Maharashtra Medical Admissions. Secure your dream college seat." />
        <meta property="og:url" content="https://admissionsmadeeasy.in/last-year-cutoff" />
      </Helmet>
      {/* Background decoration */}
      <div className="ce-bg-blobs">
        <div className="ce-blob ce-blob-1"></div>
        <div className="ce-blob ce-blob-2"></div>
      </div>

      {loading && (
        <div className="ce-loader">
          <div className="ce-spinner"></div>
          <p>Processing Data...</p>
        </div>
      )}

      {view === 'lead' ? (
        <main className="ce-view-container ce-lead-view">
          <div className="ce-glass-card ce-lead-card">
            <div className="ce-brand">
              <img src="/landing-assets/images/branding/logo1.png" alt="AME Logo" className="ce-mini-logo" />
              <span>Admissions Made Easy</span>
            </div>
            <h1>NEET 2025 Cutoff Explorer</h1>
            <p className="ce-subtitle">Unlock precise, verified previous-year cutoff data for Maharashtra Medical Admissions.</p>

            <form className="ce-modern-form" onSubmit={handleLeadSubmit}>
              <div className="ce-form-group">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="e.g. Rahul Patil" required />
              </div>
              <div className="ce-form-group">
                <label>WhatsApp Number</label>
                <input type="tel" name="whatsapp" placeholder="e.g. 9876543210" required />
              </div>
              <div className="ce-form-group">
                <label>Target Course</label>
                <select name="course" className="ce-modern-select">
                  <option>MBBS</option>
                  <option>BDS</option>
                  <option>BAMS / BHMS</option>
                </select>
              </div>
              <div className="ce-form-group">
                <label>NEET Expected Score</label>
                <input type="number" name="score" placeholder="e.g. 550" required />
              </div>
              <div className="ce-form-group">
                <label>Location</label>
                <select name="location" className="ce-modern-select" required defaultValue="">
                  <option value="" disabled>Select District</option>
                  {["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Chhatrapati Sambhajinagar", "Solapur", "Kolhapur", "Sangli", "Satara", "Ratnagiri", "Sindhudurg", "Raigad", "Palghar", "Ahmednagar", "Jalgaon", "Dhule", "Nandurbar", "Beed", "Latur", "Dharashiv", "Nanded", "Parbhani", "Hingoli", "Washim", "Akola", "Amravati", "Yavatmal", "Buldhana", "Wardha", "Chandrapur", "Gadchiroli", "Gondia", "Bhandara", "Jalna", "Other"].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button type="submit" className="ce-btn-primary">Unlock Dashboard</button>
            </form>
          </div>
        </main>
      ) : (
        <main className="ce-view-container ce-dashboard-view">
          <header className="ce-glass-header ce-dashboard-header">
            <div className="ce-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <img src="/landing-assets/images/branding/logo1.png" alt="AME Logo" className="ce-mini-logo" />
              <span>AME Cutoffs</span>
            </div>
            <div className="ce-user-info">
              <a href="https://forms.gle/ns7NxapvAda6mEnBA" target="_blank" rel="noopener noreferrer" className="ce-desktop-counselling-link">
                <i className="fas fa-calendar-check"></i> Book a free counselling session to discuss with us
              </a>
              <span className="ce-welcome-text">Welcome, <strong>{studentName || 'Student'}</strong></span>
              <button className="ce-btn-home" onClick={() => navigate('/')}>Home</button>
            </div>
          </header>

          <div className="ce-handbook-banner">
            <Link to="/#lp-handbooks">
              ( ही कटऑफ माहिती फिजिकल हँडबुकच्या स्वरूपात मिळवण्यासाठी - <span>येथे क्लिक करा</span> - )
            </Link>
          </div>

          <div className="ce-coming-soon-note">
            <i className="fas fa-info-circle"></i> All India Rank wise cutoff - <span>Coming Soon</span>
          </div>

          <div className="ce-dashboard-layout">
            <div className="ce-mobile-header-actions">
              <button className="ce-mobile-filter-toggle" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
                <i className="fas fa-filter"></i> {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
              <a href="https://forms.gle/ns7NxapvAda6mEnBA" target="_blank" rel="noopener noreferrer" className="ce-mobile-counselling-link">
                <i className="fas fa-calendar-check"></i> Book Free Session
              </a>
            </div>

            <aside className={`ce-sidebar ce-glass-panel ${isMobileFiltersOpen ? 'ce-sidebar-open' : ''}`}>
              <h3>Search Filters</h3>
              
              <div className="ce-filter-group">
                <label>Cutoff Type</label>
                <select 
                  className="ce-modern-select" 
                  value={filters.sheetName}
                  onChange={(e) => setFilters(prev => ({ ...prev, sheetName: e.target.value }))}
                >
                  {metadata.sheets.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {filters.sheetName.toUpperCase().includes('STATE QUOTA') && (
                <>
                  <div className="ce-filter-group">
                    <label>Category</label>
                    <select 
                      className="ce-modern-select"
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    >
                      {['OPEN', 'OBC', 'SC', 'ST', 'EWS', 'SEBC', 'VJA', 'NTB', 'NTC', 'NTD', 'DEF 1', 'DEF 2', 'DEF 3'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="ce-filter-group">
                    <label>Gender Quota</label>
                    <select 
                      className="ce-modern-select"
                      value={filters.gender}
                      onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                    >
                      <option value="G">General / Male</option>
                      <option value="W">Women Quota</option>
                    </select>
                  </div>
                </>
              )}

              {filters.sheetName.toUpperCase().includes('AIIMS') && (
                 <div className="ce-filter-group">
                 <label>Category</label>
                 <select 
                   className="ce-modern-select"
                   value={filters.category}
                   onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                 >
                   {['ALL CATEGORY', 'OPEN', 'OBC', 'EWS', 'SC', 'ST', 'OPEN PWD', 'OBC PWD', 'EWS PWD', 'SC PWD', 'ST PWD'].map(c => (
                     <option key={c} value={c}>{c}</option>
                   ))}
                 </select>
               </div>
              )}

              {filters.sheetName.toUpperCase().includes('DEEMED') && (
                <div className="ce-filter-group">
                  <label>State</label>
                  <select 
                    className="ce-modern-select"
                    value={filters.state}
                    onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                  >
                    <option value="ALL STATE">ALL STATE</option>
                    {(metadata.filters[filters.sheetName]?.states || []).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              <button className="ce-btn-primary" onClick={handleApplyFilters}>Apply Filters</button>
              {error && <p className="ce-error-text">{error}</p>}
            </aside>

            <section className="ce-data-section">
              <div className="ce-table-container ce-glass-panel">
                <div className="ce-watermark">
                  <img src="/landing-assets/images/branding/ame_logo_watermark.png" alt="Watermark" />
                </div>
                <div className="ce-table-scroll">
                  {tableData.head.length > 0 ? (
                    <table className="ce-modern-table">
                      <thead>
                        <tr>
                          {tableData.head.map((h, i) => (
                            <th key={i}>
                              {h.title}
                              {h.subtitle && h.subtitle !== 'nan' && h.subtitle !== '--' && (
                                <><br/><small className="ce-th-sub">{h.subtitle}</small></>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.body.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => {
                              const h = tableData.head[ci];
                              const combined = `${h?.title || ''} ${h?.subtitle || ''}`;
                              const roundMatch = combined.match(/R(\d+)/i);
                              const label = roundMatch
                                ? `R${roundMatch[1]} Score`
                                : (h?.subtitle && h.subtitle !== 'nan' ? h.subtitle : h?.title || '');
                              return (
                                <td key={ci} data-label={label}>
                                  {(!cell || cell === 'nan' || cell === 'NaN') ? '-' : cell}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="ce-empty-state">
                      <i className="fas fa-search"></i>
                      <p>Select filters and click "Apply" to view cutoff data.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      )}
      {showDevToolsError && (
        <div className="ce-devtools-overlay">
          <div className="ce-glass-card ce-error-card">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Security Breach Detected</h2>
            <p>Access denied. Inspect Element or Developer Tools are not allowed on this dashboard to protect proprietary data.</p>
            <button className="ce-btn-primary" onClick={() => window.location.reload()}>Reload Page</button>
          </div>
        </div>
      )}
    </div>
  );
}
