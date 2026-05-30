import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Loader2, Search, Filter, X, MessageCircle } from "lucide-react";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import ProfileGate from "@/components/public/ProfileGate";
import '../CutoffExplorer.css';

export default function PublicCutoffs() {
  const { user } = usePublicAuth();
  
  const [metadata, setMetadata] = useState({ sheets: [], filters: {} });
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem(`ame_cutoff_filters_${user?.id || 'guest'}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved filters", e);
      }
    }
    return {
      sheetName: "",
      category: user?.category || "OPEN",
      gender: "G",
      state: user?.state || "ALL STATE"
    };
  });
  
  const [tableData, setTableData] = useState({ head: [], body: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Open filters by default on mobile for first landing
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(() => {
    const isMobile = window.innerWidth < 768;
    const hasApplied = localStorage.getItem(`ame_cutoff_filters_${user?.id || 'guest'}`);
    return isMobile && !hasApplied;
  });
  const [showHandbookModal, setShowHandbookModal] = useState(false);

  // Fetch Metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await api.get("/cutoff/metadata");
        const data = res.data;
        setMetadata(data);
        
        const saved = localStorage.getItem(`ame_cutoff_filters_${user?.id || 'guest'}`);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setFilters(parsed);
            handleApplyFilters(parsed);
            return;
          } catch (e) {
            console.error("Failed to load saved filters", e);
          }
        }

        if (data.sheets.length > 0) {
          setFilters(prev => ({ ...prev, sheetName: data.sheets[0] }));
        }
      } catch (err) {
        console.error("Error connecting to server:", err);
      }
    };
    fetchMetadata();
  }, []);

  const handleApplyFilters = async (overrideFilters) => {
    const activeFilters = overrideFilters || filters;
    if (!activeFilters.sheetName) return;
    
    localStorage.setItem(`ame_cutoff_filters_${user?.id || 'guest'}`, JSON.stringify(activeFilters));
    
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/cutoff/data", activeFilters);
      const data = res.data.data;
      if (!data || data.length < 2) {
        setError("No data available for these filters.");
        setTableData({ head: [], body: [] });
        setLoading(false);
        return;
      }
      processTableData(data, activeFilters);
    } catch (err) {
      setError("Failed to load cutoff data.");
    } finally {
      setLoading(false);
    }
  };

  const processTableData = (data, activeFilters) => {
    const rawHeaderRow = data[0];
    const subHeaderRow = data[1] || [];
    const currentFilters = activeFilters || filters;
    const sheetName = currentFilters.sheetName.toUpperCase();
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
      const cat = currentFilters.category.toUpperCase();
      const gen = currentFilters.gender.toUpperCase();
      const searchKey = `${cat} ${gen}`;
      
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
      for (let i = baseColsEndIndex + 1; i < rawHeaderRow.length; i++) {
        colsToRender.push(i);
      }
    }

    if (colsToRender.length <= baseColsEndIndex + 1) {
        setError("No data found for this category/gender combination.");
        setTableData({ head: [], body: [] });
        return;
    }

    const head = colsToRender.map(idx => ({
      title: (rawHeaderRow[idx] || "").toString().replace(/\.[0-9]$/, ''),
      subtitle: (subHeaderRow[idx] || "").toString().trim()
    }));

    let startRow = (subHeaderRow.includes('AIR') || subHeaderRow.includes('SCORE')) ? 2 : 1;
    const body = data.slice(startRow)
      .filter(row => row && row[1]) 
      .map(row => colsToRender.map(idx => row[idx] ?? '-'));

    setTableData({ head, body });
  };

  return (
    <ProfileGate>
      <div className="ce-root" style={{ minHeight: 'auto', backgroundColor: 'transparent' }}>
      {loading && (
        <div className="ce-loader">
          <div className="ce-spinner"></div>
          <p>Processing Data...</p>
        </div>
      )}

      <div className="ce-dashboard-view" style={{ height: 'calc(100vh - 6rem)' }}>
        <div className="ce-sticky-header">
          <div className="ce-coming-soon-note">
            <i className="fas fa-info-circle"></i> All India Rank wise cutoff - <span>Coming Soon</span>
          </div>

          <div className="ce-handbook-banner">
            <button 
              onClick={() => setShowHandbookModal(true)}
              className="w-full bg-transparent border-none text-inherit cursor-pointer py-2"
            >
              ( ही कटऑफ माहिती फिजिकल हँडबुकच्या स्वरूपात मिळवण्यासाठी - <span className="underline decoration-amber-500 underline-offset-4">येथे क्लिक करा - </span> )
            </button>
          </div>
        </div>

        <div className="ce-dashboard-layout">
          <div className="ce-mobile-header-actions">
            <button className="ce-mobile-filter-toggle" onClick={() => setIsMobileFiltersOpen(true)}>
              <Filter className="h-4 w-4" /> Adjust Search
            </button>
            <a href="https://forms.gle/ns7NxapvAda6mEnBA" target="_blank" rel="noopener noreferrer" className="ce-mobile-counselling-link">
              <i className="fas fa-calendar-check"></i> Book Session
            </a>
          </div>

          {/* ── MOBILE BOTTOM DRAWER (HYBRID) ──────────────── */}
          <div 
            className={`ce-drawer-overlay ${isMobileFiltersOpen ? 'active' : ''}`} 
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className={`ce-bottom-drawer ${isMobileFiltersOpen ? 'active' : ''}`}>
            <div className="ce-drawer-handle" />
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 900 }}>Filter Results</h3>
            
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
                  <label>Select Category</label>
                  <div className="ce-pill-group">
                    {['OPEN', 'OBC', 'SC', 'ST', 'EWS', 'SEBC', 'VJA', 'NTB', 'NTC', 'NTD', 'DEF 1', 'DEF 2', 'DEF 3'].map(c => (
                      <button 
                        key={c}
                        onClick={() => setFilters(prev => ({ ...prev, category: c }))}
                        className={`ce-pill ${filters.category === c ? 'active' : ''}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ce-filter-group">
                  <label>Gender Quota</label>
                  <div className="ce-gender-grid">
                    <div 
                      className={`ce-gender-card ${filters.gender === 'G' ? 'active' : ''}`}
                      onClick={() => setFilters(prev => ({ ...prev, gender: 'G' }))}
                      style={{ padding: '1.25rem 1rem' }}
                    >
                      <span className="text-sm font-black uppercase tracking-wider">General</span>
                    </div>
                    <div 
                      className={`ce-gender-card ${filters.gender === 'W' ? 'active' : ''}`}
                      onClick={() => setFilters(prev => ({ ...prev, gender: 'W' }))}
                      style={{ padding: '1.25rem 1rem' }}
                    >
                      <span className="text-sm font-black uppercase tracking-wider">Women</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {filters.sheetName.toUpperCase().includes('AIIMS') && (
               <div className="ce-filter-group">
               <label>Select Category</label>
               <div className="ce-pill-group">
                 {['ALL CATEGORY', 'OPEN', 'OBC', 'EWS', 'SC', 'ST', 'OPEN PWD', 'OBC PWD', 'EWS PWD', 'SC PWD', 'ST PWD'].map(c => (
                   <button 
                     key={c}
                     onClick={() => setFilters(prev => ({ ...prev, category: c }))}
                     className={`ce-pill ${filters.category === c ? 'active' : ''}`}
                   >
                     {c}
                   </button>
                 ))}
               </div>
             </div>
            )}

            {filters.sheetName.toUpperCase().includes('DEEMED') && (
              <div className="ce-filter-group">
                <label>Select State</label>
                <div className="ce-pill-group">
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, state: "ALL STATE" }))}
                    className={`ce-pill ${filters.state === "ALL STATE" ? 'active' : ''}`}
                  >
                    ALL STATE
                  </button>
                  {(metadata.filters[filters.sheetName]?.states || []).map(s => (
                    <button 
                      key={s}
                      onClick={() => setFilters(prev => ({ ...prev, state: s }))}
                      className={`ce-pill ${filters.state === s ? 'active' : ''}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              className="ce-btn-primary" 
              style={{ marginTop: '1rem' }}
              onClick={() => {
                handleApplyFilters();
                setIsMobileFiltersOpen(false);
              }}
            >
              Apply Selection
            </button>
          </div>

          {/* ── DESKTOP SIDEBAR (REMAINS) ──────────────── */}
          <aside className="ce-sidebar ce-glass-panel">
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

            <button className="ce-btn-primary" onClick={() => handleApplyFilters()}>Apply Filters</button>
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

      {/* ── HANDBOOK MODAL ──────────────── */}
      {showHandbookModal && (
        <div className="ce-hb-overlay" onClick={() => setShowHandbookModal(false)}>
          <div className="ce-hb-modal" onClick={e => e.stopPropagation()}>
            <button className="ce-hb-close" onClick={() => setShowHandbookModal(false)}>
              <X className="h-5 w-5" />
            </button>
            
            <div className="ce-hb-cover" style={{ padding: 0, backgroundColor: '#e2f2ed', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src="/landing-assets/images/handbooks/med-cover.jpeg" 
                alt="NEET UG 2026 Handbook Cover" 
                className="w-full h-auto block shadow-lg"
                style={{ maxHeight: '420px', objectFit: 'contain' }}
              />
            </div>

            <div className="ce-hb-content">
              <div className="ce-hb-authors">
                <h4>AUTHORS</h4>
                <p>Sachin Bangad • Kailash Toshniwal</p>
                <span>Admissions Made Easy — Since 2011</span>
              </div>

              <div className="ce-hb-pills">
                {['AIIMS', 'AFMC', 'AIQ', 'STATE QUOTA', 'DEEMED', 'OTHER STATE PRIVATE MBBS / BAMS'].map(p => (
                  <span key={p} className="ce-hb-pill highlight">{p}</span>
                ))}
              </div>

              <button 
                className="ce-hb-order-btn"
                onClick={() => {
                  const msg = "Hi! I'm interested in ordering the NEET UG 2026 Handbook. Please share more details.";
                  window.open(`https://wa.me/917038251774?text=${encodeURIComponent(msg)}`, '_blank');
                }}
              >
                <MessageCircle className="h-6 w-6" /> Order Now
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
    </ProfileGate>
  );
}
