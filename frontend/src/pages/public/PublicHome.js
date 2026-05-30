import React, { useState, useEffect, useCallback } from "react"; // v2-amber-theme
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, Calendar, FileText, Video, ExternalLink, Loader2, Megaphone, Smartphone, Download, MessageSquare } from "lucide-react";
import api from "@/lib/api";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import { toast } from "sonner";
import ProfileGate from "@/components/public/ProfileGate";

const POLL_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwhYJtSa3PbpdCgTE-qAN_7RhbQrWjb-YPp-IQmXkS5z4vC7KpxbwRNwDRPN6wVLtI2/exec";

const SCORE_OPTIONS = [
  "401 to 425", "426 to 450", "451 to 475", "476 to 500",
  "501 to 525", "526 to 550", "551 to 575", "576 to 600",
  "601 to 615", "616 to 630", "631 to 645", "646 to 660",
  "661 to 670", "671 to 680", "681 to 690", "691 to 700",
  "701 to 705", "706 to 710", "711 to 715", "716 to 720"
];



const ensureAbsoluteUrl = (url) => {
  if (!url) return "";
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export default function PublicHome() {
  const { user, token } = usePublicAuth();
  const navigate = useNavigate();

  const [hasVoted, setHasVoted] = useState(false);
  const [currentStep, setCurrentStep] = useState("zone"); // "zone" or "range"
  const [selectedZone, setSelectedZone] = useState("");
  const [results, setResults] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [isSubmittingPoll, setIsSubmittingPoll] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(true);
  const [portalUpdates, setPortalUpdates] = useState([]);
  const [loadingPortalUpdates, setLoadingPortalUpdates] = useState(true);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  };

  const ZONES = [
    { id: "400s", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    { id: "500s", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    { id: "600s", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
    { id: "700s", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" }
  ];
  
  const getRangesForZone = (zone) => {
    switch(zone) {
      case "400s": return SCORE_OPTIONS.slice(0, 4);
      case "500s": return SCORE_OPTIONS.slice(4, 8);
      case "600s": return SCORE_OPTIONS.slice(8, 16);
      case "700s": return SCORE_OPTIONS.slice(16, 20);
      default: return [];
    }
  };

  const fetchBroadcasts = useCallback(async () => {
    try {
      const res = await api.get("/public/updates", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBroadcasts(res.data);
    } catch (err) {
      console.error("Failed to load broadcasts");
    } finally {
      setLoadingBroadcasts(false);
    }
  }, [token]);

  const fetchPortalUpdates = useCallback(async () => {
    try {
      const res = await api.get("/public/portal-updates");
      setPortalUpdates(res.data);
    } catch (err) {
      console.error("Failed to load portal updates");
    } finally {
      setLoadingPortalUpdates(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("ame_poll_voted_public")) {
      setHasVoted(true);
      fetchPollResults();
    }
    if (token) fetchBroadcasts();
    fetchPortalUpdates();
  }, [token, fetchBroadcasts, fetchPortalUpdates]);

  const fetchPollResults = async () => {
    setIsLoadingResults(true);
    try {
      const response = await fetch(`${POLL_WEBHOOK_URL}?action=results`);
      const data = await response.json();
      setResults(data.results || {});
      setTotalVotes(data.total || 0);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleVote = async (finalScore) => {
    if (!finalScore) return;
    setIsSubmittingPoll(true);
    try {
      await fetch(POLL_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "vote",
          name: user?.full_name || "Anonymous",
          score_range: finalScore
        })
      });
      localStorage.setItem("ame_poll_voted_public", "true");
      setHasVoted(true);
      toast.success("Vote cast successfully!");
      fetchPollResults();
    } catch (error) {
      toast.error("Error submitting vote. Please try again.");
    } finally {
      setIsSubmittingPoll(false);
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <ProfileGate>
      <div className="space-y-8">
      {/* Mobile Install App Banner */}
      {installPrompt && (
        <div className="md:hidden animate-in slide-in-from-top-4 duration-500" style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)', borderRadius: 24, padding: '1.25rem', color: '#fff', boxShadow: '0 15px 30px rgba(37,99,235,0.3)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div style={{ height: 50, width: 50, background: '#fff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                <img src="/landing-assets/images/branding/logo1.png" alt="AME Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight">Install AME App</h3>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Fast Access & Real-time Alerts</p>
              </div>
            </div>
            <button 
              onClick={handleInstall}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-2xl text-[11px] font-black shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              INSTALL
            </button>
          </div>
        </div>
      )}
      {/* Poll Card */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 256, height: 256, background: 'rgba(243,156,18,0.05)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }} />

        <div className="flex items-center gap-3 mb-2" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ padding: 8, background: 'rgba(243,156,18,0.1)', borderRadius: 10 }}>
            <BarChart3 className="h-6 w-6" style={{ color: '#f39c12' }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: '#f8fafc' }}>NEET 2026 Score Poll</h2>
        </div>
        <p className="text-sm mb-8" style={{ color: '#94a3b8', paddingLeft: 48, position: 'relative', zIndex: 1 }}>
          Join thousands of aspirants! Vote your expected score to see national trends.
        </p>

        {!hasVoted ? (
          <div className="space-y-4" style={{ position: 'relative', zIndex: 1 }}>
            {currentStep === "zone" ? (
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {ZONES.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => { setSelectedZone(zone.id); setCurrentStep("range"); }}
                    className="group transition-all duration-300"
                    style={{ 
                      background: zone.bg, 
                      border: `1px solid ${zone.color}30`, 
                      borderRadius: 20, 
                      padding: '1.25rem 0.5rem', 
                      color: '#f8fafc', 
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = zone.color;
                      e.currentTarget.style.boxShadow = `0 0 20px -5px ${zone.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${zone.color}30`;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1 transition-colors" style={{ color: zone.color }}>Target Zone</div>
                    <div className="text-2xl md:text-3xl font-black group-hover:scale-110 transition-transform">{zone.id}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <button 
                    onClick={() => setCurrentStep("zone")}
                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                  >
                    ← Back to Zones
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Selected Zone: {selectedZone}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(() => {
                    const activeZone = ZONES.find(z => z.id === selectedZone) || ZONES[0];
                    return getRangesForZone(selectedZone).map(range => (
                      <button
                        key={range}
                        disabled={isSubmittingPoll}
                        onClick={() => handleVote(range)}
                        className="hover:scale-[1.02] active:scale-[0.98] transition-all group"
                        style={{ 
                          background: activeZone.bg, 
                          border: `1px solid ${activeZone.color}30`, 
                          borderRadius: 12, 
                          padding: '12px 16px', 
                          color: '#f8fafc', 
                          fontSize: 14, 
                          fontWeight: 700, 
                          textAlign: 'left', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {range}
                        <div 
                          className="h-2 w-2 rounded-full transition-transform group-hover:scale-150" 
                          style={{ 
                            backgroundColor: activeZone.color, 
                            boxShadow: `0 0 8px ${activeZone.color}80` 
                          }} 
                        />
                      </button>
                    ));
                  })()}
                </div>
              </div>
            )}

            <button
              onClick={() => { setHasVoted(true); fetchPollResults(); }}
              style={{ width: '100%', height: 40, background: 'transparent', border: 'none', color: '#f39c12', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 12 }}
            >
              Skip and view results
            </button>
          </div>
        ) : (
          <div className="space-y-4 mt-2" style={{ position: 'relative', zIndex: 1 }}>
            {isLoadingResults ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mb-2" style={{ color: '#f39c12' }} />
                <p className="text-sm" style={{ color: '#94a3b8' }}>Fetching live results...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#94a3b8' }}>
                  <span>Score Range</span>
                  <span>{totalVotes} Total Votes</span>
                </div>
                <div className="grid grid-cols-2 gap-2 md:gap-3 pr-2" style={{ maxHeight: 350, overflowY: 'auto' }}>
                  {SCORE_OPTIONS.map(opt => {
                    const count = results[opt] || 0;
                    const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
                    return (
                      <div key={opt} className="relative w-full" style={{ height: 36, background: 'rgba(255,255,255,0.03)', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'rgba(243,156,18,0.15)', transition: 'width 1s', width: `${percentage}%` }} />
                        <div className="absolute inset-0 flex items-center justify-between px-2 md:px-3 text-[10px] md:text-[13px] font-medium" style={{ zIndex: 1 }}>
                          <span style={{ color: 'rgba(248,250,252,0.9)', whiteSpace: 'nowrap' }}>{opt}</span>
                          <span style={{ color: '#f39c12', fontWeight: 700, whiteSpace: 'nowrap' }}>{percentage}% <span style={{ color: '#94a3b8', fontSize: 9, fontWeight: 400, marginLeft: 2 }}>({count})</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => navigate('/app/chats')}
                  className="w-full mt-6 py-4 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #f39c12, #d35400)', color: '#fff', boxShadow: '0 10px 25px rgba(243,156,18,0.3)' }}
                >
                  <MessageSquare className="h-4 w-4" /> Share Thoughts in Community
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Latest Updates Feed */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6" style={{ color: '#f8fafc' }}>
          <TrendingUp className="h-6 w-6" style={{ color: '#f39c12' }} />
          Latest Updates
        </h2>

        <div className="space-y-4">
          {/* Dynamic Events / Zoom Banners */}
          {portalUpdates.filter(u => u.type === 'UPCOMING_EVENT').map((event, i) => (
            <div key={`event-${i}`} className="relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #f39c12, #d35400)', borderRadius: 16, padding: '1.5rem', color: '#fff', boxShadow: '0 10px 25px rgba(243,156,18,0.2)' }}>
              <div style={{ position: 'absolute', right: 0, top: 0, width: 128, height: 128, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 relative" style={{ zIndex: 1 }}>
                <div className="flex items-center gap-4">
                  <div className="animate-pulse" style={{ height: 48, width: 48, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{event.title}</h3>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{event.description || "Medical Admission Guidance Webinar 2026"}</p>
                  </div>
                </div>
                <a
                  href={ensureAbsoluteUrl(event.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-bold text-sm w-full md:w-auto justify-center"
                  style={{ background: '#fff', color: '#d35400', padding: '10px 20px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                >
                  <ExternalLink className="h-4 w-4" />
                  {event.link.includes('zoom') ? 'Join Zoom' : 'View Event'}
                </a>
              </div>
            </div>
          ))}

          {/* Broadcasts from Admin */}
          {loadingBroadcasts ? (
            <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-amber-500" /></div>
          ) : broadcasts.map((update, i) => (
            <div
              key={`bc-${i}`}
              className="flex items-start gap-4"
              style={{ background: 'rgba(243,156,18,0.05)', border: '1px solid rgba(243,156,18,0.2)', padding: '1.25rem', borderRadius: 16, transition: 'all 0.3s' }}
            >
              <div style={{ marginTop: 4, padding: 10, background: 'rgba(243,156,18,0.1)', borderRadius: 12 }}>
                <Megaphone className="h-6 w-6" style={{ color: '#f39c12' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#94a3b8' }}>
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(update.created_at)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase" style={{ background: '#f39c12', color: '#000' }}>
                    Announcement
                  </span>
                </div>
                <h3 className="font-bold leading-snug mb-1" style={{ color: '#f8fafc' }}>
                  {update.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{update.message}</p>
              </div>
            </div>
          ))}

          {/* Dynamic Official PDFs */}
          {portalUpdates.filter(u => u.type === 'OFFICIAL_UPDATE').map((update, i) => (
            <a
              key={`pdf-${i}`}
              href={ensureAbsoluteUrl(update.link)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 cursor-pointer group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: 16, textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(243,156,18,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <div style={{ marginTop: 4, padding: 10, background: 'rgba(239,68,68,0.1)', borderRadius: 12 }}>
                <FileText className="h-6 w-6" style={{ color: '#ef4444' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#94a3b8' }}>
                    <Calendar className="h-3.5 w-3.5" />
                    {update.date}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: 'rgba(243,156,18,0.1)', color: '#f39c12' }}>
                    Official PDF
                  </span>
                </div>
                <h3 className="font-semibold leading-snug" style={{ color: '#f8fafc' }}>
                  {update.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
      </div>
    </ProfileGate>
  );
}
