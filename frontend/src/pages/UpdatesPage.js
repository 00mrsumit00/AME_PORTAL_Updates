import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './UpdatesPage.css';

const REG_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxhqQrz6KfRifmHI9TSiAtaGZNwpczLOfOT1KFg8NSc97eqlFqG4oYILKqnZPLqMkoX/exec";

const ensureAbsoluteUrl = (url) => {
  if (!url) return "";
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export default function UpdatesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regFormData, setRegFormData] = useState({
    name: '',
    whatsapp: '',
    district: ''
  });
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    // Check if already registered in this browser
    if (localStorage.getItem('ame_seminar_registered')) {
      setRegSuccess(true);
      const savedData = JSON.parse(localStorage.getItem('ame_seminar_data') || '{}');
      setRegFormData(savedData);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'events') {
      setActiveTab('events');
    }
  }, [location.search]);

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    if (!regFormData.name || !regFormData.whatsapp) return;

    setIsSubmitting(true);
    try {
      await fetch(REG_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "register_event",
          event_name: upcomingEvents[0].title,
          name: regFormData.name,
          whatsapp: regFormData.whatsapp,
          district: regFormData.district
        })
      });

      // Save to browser storage
      localStorage.setItem('ame_seminar_registered', 'true');
      localStorage.setItem('ame_seminar_data', JSON.stringify(regFormData));

      setRegSuccess(true);
    } catch (error) {
      alert("Registration failed. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [updates, setUpdates] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortalUpdates = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api/public/portal-updates`);
        const data = await response.json();
        setUpdates(data.filter(u => u.type === 'OFFICIAL_UPDATE'));
        setUpcomingEvents(data.filter(u => u.type === 'UPCOMING_EVENT'));
      } catch (err) {
        console.error("Failed to load updates");
      } finally {
        setLoading(false);
      }
    };
    fetchPortalUpdates();
  }, []);

  const maharashtraDistricts = [
    "Ahmednagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur",
    "Chhatrapati Sambhajinagar", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon",
    "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
    "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad",
    "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha",
    "Washim", "Yavatmal"
  ];

  const getWhatsAppLink = (district) => {
    return "https://chat.whatsapp.com/EcuqL2ncS8YGuUGIphIPir?mode=gi_t";
  };

  return (
    <div className="updates-root">
      <Helmet>
        <title>Latest NEET & JEE Updates | Official Notifications & Answer Keys</title>
        <meta name="description" content="Stay ahead with real-time updates on NEET 2026, provisional answer keys, and official CET Cell releases. Your official source for reliable admission news." />
        <meta property="og:title" content="NEET & JEE Admission Updates | Admissions Made Easy" />
        <meta property="og:description" content="Get real-time alerts on answer keys, official notifications, and admission trends from CET Cell & NTA." />
        <meta property="og:url" content="https://admissionsmadeeasy.in/updates" />
      </Helmet>
      <header className="updates-top-nav">
        <div className="updates-nav-brand" onClick={() => navigate('/')}>
          <img src="/landing-assets/images/branding/logo1.png" alt="Admissions Made Easy" className="updates-logo" />
        </div>
        <div className="updates-nav-links">
          <button onClick={() => navigate('/public-login')} className="updates-nav-btn updates-nav-highlight">
            <i className="fas fa-chart-line"></i> <span>Check Last Year Cutoff</span>
          </button>
        </div>
      </header>


      <div className="updates-container">
        <div className="updates-card">
          <div className="updates-header">
            <div className="updates-title-group">
              <h1 className="updates-title">Notifications & Events</h1>
            </div>
            <div className="updates-bell-icon">
              <i className="fas fa-bell"></i>
            </div>
          </div>

          <div className="updates-tabs">
            <button
              className={`update-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <i className="fas fa-list-ul"></i>
              <span>Official Updates</span>
            </button>
            <button
              className={`update-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <i className="fas fa-calendar-star"></i>
              <span>Upcoming Events</span>
            </button>
          </div>

          {activeTab === 'notifications' ? (
            <div className="updates-list">
              {updates.map((update, idx) => (
                <a
                  key={idx}
                  href={ensureAbsoluteUrl(update.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="update-link-item"
                >
                  <div className="update-icon-box">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                  <div className="update-content">
                    <div className="update-meta">
                      <span className="update-date"><i className="far fa-calendar-alt"></i> {update.date}</span>
                      <span className="update-badge">{update.type}</span>
                    </div>
                    <h3 className="update-title-text">{update.title}</h3>
                    <div className="update-footer">
                      <span className="update-download-text">Click to view or download official PDF</span>
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="events-list">
              {upcomingEvents.length > 0 ? (
                <>
                  <div className="zoom-live-banner">
                    <div className="zoom-info">
                      <div className="zoom-icon-pulse">
                        <i className="fas fa-video"></i>
                      </div>
                      <div className="zoom-text">
                        <h4>{upcomingEvents[0].title}</h4>
                        <p>{upcomingEvents[0].description || "Medical Admission Guidance Webinar 2026"}</p>
                      </div>
                    </div>
                    <a 
                      href={ensureAbsoluteUrl(upcomingEvents[0].link)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="zoom-join-btn"
                    >
                      <i className="fas fa-external-link-alt"></i> {upcomingEvents[0].link.toLowerCase().includes('zoom') ? 'Join Zoom Meeting' : 'View Event'}
                    </a>
                  </div>

                  {upcomingEvents.slice(1).map((event, idx) => (
                    <div key={idx} className="event-card-small">
                      <div className="event-icon-small">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="event-info-small">
                        <h4 className="event-title-small">{event.title}</h4>
                        <p className="event-desc-small">{event.description}</p>
                      </div>
                      <a href={ensureAbsoluteUrl(event.link)} target="_blank" rel="noopener noreferrer" className="event-link-small">
                        View <i className="fas fa-chevron-right"></i>
                      </a>
                    </div>
                  ))}
                </>
              ) : (
                <div className="no-events-placeholder">
                  <div className="no-events-icon">
                    <i className="fas fa-calendar-day"></i>
                  </div>
                  <h3>No upcoming events currently</h3>
                  <p>Stay tuned! We are planning something special for you. Check back soon or join our WhatsApp community for instant alerts.</p>
                  <button className="no-events-refresh-btn" onClick={() => window.location.reload()}>
                    <i className="fas fa-sync-alt"></i> Check for Updates
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="updates-footer-note">
            <i className="fas fa-info-circle"></i>
            <span>New updates are posted as soon as they are officially released by NTA / CET Cell.</span>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav className="lp-bottom-nav" aria-label="Mobile navigation">
        <button className="lp-bottom-nav-item" onClick={() => navigate('/#lp-home')}>
          <i className="fas fa-home lp-bottom-nav-icon"></i>
          <span className="lp-bottom-nav-label">Home</span>
        </button>
        <button className="lp-bottom-nav-item" onClick={() => navigate('/#lp-services')}>
          <i className="fas fa-briefcase lp-bottom-nav-icon"></i>
          <span className="lp-bottom-nav-label">Services</span>
        </button>
        <button className="lp-bottom-nav-item" onClick={() => navigate('/#lp-handbooks')}>
          <i className="fas fa-book lp-bottom-nav-icon"></i>
          <span className="lp-bottom-nav-label">Handbooks</span>
        </button>
        <button className="lp-bottom-nav-item" onClick={() => navigate('/public-login')}>
          <i className="fas fa-chart-bar lp-bottom-nav-icon"></i>
          <span className="lp-bottom-nav-label">Cutoff</span>
        </button>
        <button className={`lp-bottom-nav-item ${activeTab === 'notifications' || activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
          <i className="fas fa-bell lp-bottom-nav-icon"></i>
          <span className="lp-bottom-nav-label">Updates</span>
        </button>
      </nav>
    </div>
  );
}
