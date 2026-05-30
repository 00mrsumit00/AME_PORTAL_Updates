import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, MessageCircle, Target, BarChart2, User, LogOut, Smartphone, Bell, Compass } from "lucide-react";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import { useState, useEffect } from "react";
import api from "@/lib/api";

const navItems = [
  { name: "Updates", path: "/app/home", icon: Home },
  { name: "Chats", path: "/app/chats", icon: MessageCircle },
  { name: "Predictor", path: "/app/predictor", icon: Target },
  { name: "Cutoffs", path: "/app/cutoffs", icon: BarChart2 },
  { name: "Colleges", path: "/app/colleges", icon: Compass },
  { name: "Profile", path: "/app/profile", icon: User },
];

export default function PublicLayout({ children }) {
  const { user, token, logout } = usePublicAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [ticker, setTicker] = useState({ text: "", link: "" });

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const res = await api.get("/public/ticker");
        setTicker(res.data);
      } catch (err) {
        console.error("Ticker fetch failed");
      }
    };
    fetchTicker();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  };

  useEffect(() => {
    if (!token) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get("/public/chats/unread-count", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount(res.data.unread);
      } catch (err) {
        console.error("Unread fetch failed");
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/public-login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
      
      <style>{`
        .portal-ticker {
          background: #ef4444;
          color: #fff;
          padding: 8px 0;
          overflow: hidden;
          position: sticky;
          top: 0;
          z-index: 100;
          font-weight: 800;
          font-size: 0.75rem;
          text-transform: uppercase;
          cursor: pointer;
        }
        .portal-ticker-track {
          display: flex;
          white-space: nowrap;
          animation: portal-ticker-scroll 30s linear infinite;
          width: fit-content;
        }
        @keyframes portal-ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Breaking News Ticker */}
      {ticker.text && (
        <div 
          className="portal-ticker w-full md:hidden" 
          onClick={() => ticker.link && window.open(ticker.link, '_blank')}
        >
          <div className="portal-ticker-track">
            <span className="px-10">🚨 {ticker.text} 🚨</span>
            <span className="px-10">🚨 {ticker.text} 🚨</span>
            <span className="px-10">🚨 {ticker.text} 🚨</span>
          </div>
        </div>
      )}

      {/* Mobile Top Header */}
      <header className={`sticky z-40 w-full md:hidden ${ticker.text ? 'top-[33px]' : 'top-0'}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="flex h-14 items-center justify-between px-4">
          <div className="font-bold text-lg tracking-tight" style={{ color: '#f39c12' }}>Admissions Made Easy Portal</div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: 'rgba(243,156,18,0.15)', color: '#f39c12' }}>
              {user?.full_name?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen sticky top-0" style={{ backgroundColor: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex h-16 items-center px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="font-extrabold text-xl tracking-tight" style={{ color: '#f39c12' }}>Admissions Made Easy Portal</div>
        </div>
        <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'rgba(243,156,18,0.15)', color: '#f39c12' }}>
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none" style={{ color: '#f8fafc' }}>{user?.full_name || "Student"}</span>
            <span className="text-xs mt-1" style={{ color: '#94a3b8' }}>Normal User</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-sm font-medium relative`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, #f39c12, #d35400)',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(243,156,18,0.3)'
              } : {
                color: '#94a3b8'
              }}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
              {item.name === "Chats" && unreadCount > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white border-2 border-[#0f172a]">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 space-y-2 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {installPrompt && (
            <button
              onClick={handleInstall}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-sm font-bold bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black"
            >
              <Smartphone className="h-5 w-5" />
              Install AME App
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-sm font-medium"
            style={{ color: '#ef4444' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto w-full" style={{ backgroundColor: '#020617' }}>
        <div className="p-4 md:p-8 w-full">
          {children || <Outlet />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around pb-safe" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(12px)', boxShadow: '0 -4px 20px rgba(0,0,0,0.3)' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-all relative"
            style={({ isActive }) => ({
              color: isActive ? '#f39c12' : '#94a3b8'
            })}
          >
            <item.icon className="h-5 w-5" />
            {item.name === "Chats" && unreadCount > 0 && (
              <span className="absolute top-2 right-[25%] flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-black text-white border border-[#0f172a]">
                {unreadCount}
              </span>
            )}
            <span className="text-[10px] font-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
