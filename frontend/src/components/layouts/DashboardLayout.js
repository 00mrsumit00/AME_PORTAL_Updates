import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Building2, BarChart3, FileText, UserPlus, Users,
  ClipboardCheck, User, Files, LogOut, Menu, X, GraduationCap,
  UserCog, MessageCircle, Wallet, Smartphone
} from "lucide-react";

const NAV_ITEMS = {
  ADMIN: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Branches", path: "/admin/branches", icon: Building2 },
    { label: "User Management", path: "/admin/users", icon: UserCog },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { label: "Audit Logs", path: "/admin/audit", icon: FileText },
  ],
  BRANCH_HEAD: [
    { label: "Dashboard", path: "/branch", icon: LayoutDashboard },
    { label: "Register Student", path: "/branch/register", icon: UserPlus },
    { label: "Students", path: "/branch/students", icon: Users },
    { label: "Registration Workspace", path: "/branch/workplace", icon: ClipboardCheck },
    { label: "Verification", path: "/branch/verification", icon: ClipboardCheck },
    { label: "Analytics", path: "/branch/analytics", icon: BarChart3 },
    { label: "Expense Manager", path: "/branch/expenses", icon: Wallet },
    { label: "Staff Management", path: "/branch/staff", icon: UserCog },
    { label: "Audit Logs", path: "/branch/audit", icon: FileText },
  ],
  STAFF: [
    { label: "Dashboard", path: "/branch", icon: LayoutDashboard },
    { label: "Register Student", path: "/branch/register", icon: UserPlus },
    { label: "Students", path: "/branch/students", icon: Users },
    { label: "Registration Workspace", path: "/branch/workplace", icon: ClipboardCheck },
    { label: "Verification", path: "/branch/verification", icon: ClipboardCheck },
    { label: "Analytics", path: "/branch/analytics", icon: BarChart3 },
    { label: "Expense Manager", path: "/branch/expenses", icon: Wallet },
    { label: "Audit Logs", path: "/branch/audit", icon: FileText },
  ],
  STUDENT: [
    { label: "Dashboard", path: "/student", icon: LayoutDashboard },
    { label: "My Profile", path: "/student/profile", icon: User },
    { label: "Documents", path: "/student/documents", icon: Files },
    { label: "Chat", path: "/student/chat", icon: MessageCircle },
  ],
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const navItems = NAV_ITEMS[user?.role] || [];
  const roleLabel = { ADMIN: "Super Admin", BRANCH_HEAD: "Branch Head", STAFF: "Staff", STUDENT: "Student" }[user?.role] || "";

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen flex bg-background" data-testid="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5" data-testid="sidebar-logo">
            <GraduationCap className="w-8 h-8 text-primary" strokeWidth={2} />
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">Admission Management Portal</h1>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          {installPrompt && (
            <button
              onClick={handleInstall}
              className="relative w-full flex items-center gap-2.5 px-3 py-2.5 mb-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors overflow-hidden"
            >
              <span className="absolute inset-0 rounded-lg bg-blue-400 opacity-40 animate-ping" />
              <Smartphone className="w-[18px] h-[18px] relative shrink-0" strokeWidth={1.5} />
              <span className="relative">Install Mobile App</span>
            </button>
          )}
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
            data-testid="logout-btn"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.5} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <Button
            variant="ghost" size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="mobile-menu-btn"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex-1" />
          <p className="text-sm text-muted-foreground hidden sm:block">
            Welcome, <span className="text-foreground font-medium">{user?.name}</span>
          </p>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
