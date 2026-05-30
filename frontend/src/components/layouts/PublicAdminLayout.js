import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { usePublicAdmin } from "@/contexts/PublicAdminAuthContext";
import {
  LayoutDashboard, Users, UserPlus, MessageCircle,
  Megaphone, ScrollText, LogOut, ShieldCheck, Bell
} from "lucide-react";

export default function PublicAdminLayout({ children }) {
  const { admin, logout } = usePublicAdmin();
  const navigate = useNavigate();
  const isMaster = admin?.role === "PUBLIC_ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/portal-admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/portal-admin", icon: LayoutDashboard, end: true },
    { name: "Users", path: "/portal-admin/users", icon: Users },
    { name: "Chats", path: "/portal-admin/chats", icon: MessageCircle },
    { name: "Broadcast", path: "/portal-admin/broadcast", icon: Megaphone },
    { name: "Manage Portal", path: "/portal-admin/updates", icon: Bell },
    { name: "Audit Logs", path: "/portal-admin/audit", icon: ScrollText },
  ];

  if (isMaster) {
    navItems.splice(2, 0, { name: "Sub-Admins", path: "/portal-admin/sub-admins", icon: UserPlus });
  }

  const linkStyle = (isActive) => isActive ? {
    background: 'linear-gradient(135deg, #f39c12, #d35400)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(243,156,18,0.3)'
  } : { color: '#94a3b8' };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 w-full md:hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" style={{ color: '#f39c12' }} />
            <span className="font-bold text-sm tracking-tight" style={{ color: '#f39c12' }}>Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: 'rgba(243,156,18,0.15)', color: '#f39c12' }}>
              {admin?.name?.charAt(0) || "A"}
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen sticky top-0" style={{ backgroundColor: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex h-16 items-center px-6 gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <ShieldCheck className="h-6 w-6" style={{ color: '#f39c12' }} />
          <div className="font-extrabold text-lg tracking-tight" style={{ color: '#f39c12' }}>Admin Panel</div>
        </div>

        <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'rgba(243,156,18,0.15)', color: '#f39c12' }}>
            {admin?.name?.charAt(0) || "A"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold leading-none truncate" style={{ color: '#f8fafc' }}>{admin?.name || "Admin"}</span>
            <span className="text-[10px] mt-1 font-bold uppercase tracking-wider" style={{ color: isMaster ? '#f39c12' : '#3b82f6' }}>
              {isMaster ? "Master Admin" : "Sub-Admin"}
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-sm font-medium"
              style={({ isActive }) => linkStyle(isActive)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-sm font-medium"
            style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto w-full" style={{ backgroundColor: '#020617' }}>
        <div className="p-4 md:p-8 w-full">
          {children || <Outlet />}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center px-2 overflow-x-auto pb-safe custom-scroll-x" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(12px)', boxShadow: '0 -4px 20px rgba(0,0,0,0.3)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .custom-scroll-x::-webkit-scrollbar { display: none; }
        `}</style>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className="flex flex-col items-center justify-center h-full space-y-1 transition-all flex-shrink-0 min-w-[72px] px-1"
            style={({ isActive }) => ({ color: isActive ? '#f39c12' : '#94a3b8' })}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
