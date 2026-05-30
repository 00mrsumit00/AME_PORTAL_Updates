import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import LandingPage from "@/pages/LandingPage";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentProfile from "@/pages/student/StudentProfile";
import StudentDocuments from "@/pages/student/StudentDocuments";
import BranchDashboard from "@/pages/branch/BranchDashboard";
import RegisterStudent from "@/pages/branch/RegisterStudent";
import StudentList from "@/pages/branch/StudentList";
import VerificationQueue from "@/pages/branch/VerificationQueue";
import VerificationView from "@/pages/branch/VerificationView";
import BranchAudit from "@/pages/branch/BranchAudit";
import StaffManagement from "@/pages/branch/StaffManagement";
import BranchAnalytics from "@/pages/branch/BranchAnalytics";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import BranchManagement from "@/pages/admin/BranchManagement";
import Analytics from "@/pages/admin/Analytics";
import AdminAudit from "@/pages/admin/AdminAudit";
import UserManagement from "@/pages/admin/UserManagement";
import StudentChat from "@/pages/student/StudentChat";
import ExpenseManager from "@/pages/branch/ExpenseManager";
import RegistrationWorkspace from "@/pages/branch/RegistrationWorkspace";
import CutoffExplorer from "@/pages/CutoffExplorer";
import PollPage from "@/pages/PollPage";
import UpdatesPage from "@/pages/UpdatesPage";
import MhtCetForm from "@/pages/MhtCetForm";

import { ServerWakeupProvider } from "@/contexts/ServerWakeupContext";
import { PublicAuthProvider, usePublicAuth } from "@/contexts/PublicAuthContext";
import { PublicAdminAuthProvider, usePublicAdmin } from "@/contexts/PublicAdminAuthContext";
import PublicLayout from "@/components/layouts/PublicLayout";
import PublicAdminLayout from "@/components/layouts/PublicAdminLayout";
import PublicLogin from "@/pages/public/PublicLogin";
import PublicRegister from "@/pages/public/PublicRegister";
import PublicHome from "@/pages/public/PublicHome";
import PublicChats from "@/pages/public/PublicChats";
import PublicPredictor from "@/pages/public/PublicPredictor";
import PublicCutoffs from "@/pages/public/PublicCutoffs";
import PublicProfile from "@/pages/public/PublicProfile";
import CollegeExplorer from "@/pages/CollegeExplorer";
import EngineeringCollegeExplorer from "@/pages/EngineeringCollegeExplorer";
import MedicalAdmission from "@/pages/details/MedicalAdmission";
import EngineeringAdmission from "@/pages/details/EngineeringAdmission";
import EngineeringTeam from "@/pages/details/EngineeringTeam";

import PublicAdminLogin from "@/pages/public/PublicAdminLogin";
import PublicAdminDashboard from "@/pages/public/PublicAdminDashboard";
import PublicAdminUserManagement from "@/pages/public/PublicAdminUserManagement";
import PublicAdminSubAdminManagement from "@/pages/public/PublicAdminSubAdminManagement";
import PublicAdminChat from "@/pages/public/PublicAdminChat";
import PublicAdminBroadcast from "@/pages/public/PublicAdminBroadcast";
import PublicAdminAudit from "@/pages/public/PublicAdminAudit";
import PublicAdminUpdates from "@/pages/public/PublicAdminUpdates";

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function PublicProtectedRoute({ children }) {
  const { user, loading } = usePublicAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/public-login" replace />;
  return <PublicLayout>{children}</PublicLayout>;
}

function PublicAdminProtectedRoute({ children }) {
  const { admin, loading } = usePublicAdmin();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!admin) return <Navigate to="/portal-admin/login" replace />;
  return <PublicAdminLayout>{children}</PublicAdminLayout>;
}

function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const routes = { ADMIN: "/admin", BRANCH_HEAD: "/branch", STAFF: "/branch", STUDENT: "/student" };
  return <Navigate to={routes[user.role] || "/login"} replace />;
}

function App() {
  useEffect(() => {
    const handleOffline = () =>
      toast.warning("You are currently offline. Using cached data.", {
        id: "offline-status",
        duration: Infinity,
      });
    const handleOnline = () => {
      toast.dismiss("offline-status");
      toast.success("Back online!", { duration: 3000 });
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Security protections: Disable Right Click, Dragging, and Developer Tool hotkeys
    const disableContextMenu = (e) => e.preventDefault();
    const disableDrag = (e) => e.preventDefault();
    const disableShortcuts = (e) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C" || e.key === "i" || e.key === "j" || e.key === "c")) {
        e.preventDefault();
      }
      // Ctrl+U (View Source) / Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === "U" || e.key === "S" || e.key === "u" || e.key === "s")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("dragstart", disableDrag);
    document.addEventListener("keydown", disableShortcuts);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("dragstart", disableDrag);
      document.removeEventListener("keydown", disableShortcuts);
    };
  }, []);

  return (
    <HelmetProvider>
      <ServerWakeupProvider>
        <AuthProvider>
          <PublicAuthProvider>
            <PublicAdminAuthProvider>
              <BrowserRouter>
                <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/last-year-cutoff" element={<Navigate to="/public-login" replace />} />
                <Route path="/poll" element={<Navigate to="/public-login" replace />} />
                <Route path="/updates" element={<UpdatesPage />} />
                <Route path="/medical-admission" element={<MedicalAdmission />} />
                <Route path="/engineering-admission" element={<EngineeringAdmission />} />
                <Route path="/engineering-team" element={<EngineeringTeam />} />
                <Route path="/mht-cet-registration" element={<MhtCetForm />} />
                <Route path="/register-cet" element={<Navigate to="/mht-cet-registration" replace />} />
                <Route path="/mht-cet" element={<Navigate to="/mht-cet-registration" replace />} />

                <Route path="/public-login" element={<PublicLogin />} />
                <Route path="/public-register" element={<PublicRegister />} />
                
                <Route path="/portal-admin/login" element={<PublicAdminLogin />} />
                <Route path="/portal-admin" element={<PublicAdminProtectedRoute><PublicAdminDashboard /></PublicAdminProtectedRoute>} />
                <Route path="/portal-admin/users" element={<PublicAdminProtectedRoute><PublicAdminUserManagement /></PublicAdminProtectedRoute>} />
                <Route path="/portal-admin/sub-admins" element={<PublicAdminProtectedRoute><PublicAdminSubAdminManagement /></PublicAdminProtectedRoute>} />
                <Route path="/portal-admin/chats" element={<PublicAdminProtectedRoute><PublicAdminChat /></PublicAdminProtectedRoute>} />
                <Route path="/portal-admin/broadcast" element={<PublicAdminProtectedRoute><PublicAdminBroadcast /></PublicAdminProtectedRoute>} />
                <Route path="/portal-admin/updates" element={<PublicAdminProtectedRoute><PublicAdminUpdates /></PublicAdminProtectedRoute>} />
                <Route path="/portal-admin/audit" element={<PublicAdminProtectedRoute><PublicAdminAudit /></PublicAdminProtectedRoute>} />

                {/* Public PWA Routes */}
              <Route path="/app/home" element={<PublicProtectedRoute><PublicHome /></PublicProtectedRoute>} />
              <Route path="/app/chats" element={<PublicProtectedRoute><PublicChats /></PublicProtectedRoute>} />
              <Route path="/app/predictor" element={<PublicProtectedRoute><PublicPredictor /></PublicProtectedRoute>} />
              <Route path="/app/engineering" element={<PublicProtectedRoute><EngineeringAdmission /></PublicProtectedRoute>} />
              <Route path="/app/colleges" element={<PublicProtectedRoute><CollegeExplorer /></PublicProtectedRoute>} />
              <Route path="/app/engineering-colleges" element={<EngineeringCollegeExplorer />} />
              <Route path="/app/profile" element={<PublicProtectedRoute><PublicProfile /></PublicProtectedRoute>} />

              <Route path="/student" element={<ProtectedRoute roles={["STUDENT"]}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/profile" element={<ProtectedRoute roles={["STUDENT"]}><StudentProfile /></ProtectedRoute>} />
              <Route path="/student/documents" element={<ProtectedRoute roles={["STUDENT"]}><StudentDocuments /></ProtectedRoute>} />
              <Route path="/student/chat" element={<ProtectedRoute roles={["STUDENT"]}><StudentChat /></ProtectedRoute>} />
              <Route path="/branch" element={<ProtectedRoute roles={["BRANCH_HEAD", "STAFF"]}><BranchDashboard /></ProtectedRoute>} />
              <Route path="/branch/register" element={<ProtectedRoute roles={["BRANCH_HEAD", "STAFF"]}><RegisterStudent /></ProtectedRoute>} />
              <Route path="/branch/students" element={<ProtectedRoute roles={["BRANCH_HEAD", "STAFF"]}><StudentList /></ProtectedRoute>} />
              <Route path="/branch/verification" element={<ProtectedRoute roles={["BRANCH_HEAD", "STAFF"]}><VerificationQueue /></ProtectedRoute>} />
              <Route path="/branch/verification/:studentId" element={<ProtectedRoute roles={["BRANCH_HEAD", "STAFF"]}><VerificationView /></ProtectedRoute>} />
              <Route path="/branch/workplace" element={<ProtectedRoute roles={["BRANCH_HEAD", "STAFF"]}><RegistrationWorkspace /></ProtectedRoute>} />
              <Route path="/branch/audit" element={<ProtectedRoute roles={["BRANCH_HEAD", "STAFF"]}><BranchAudit /></ProtectedRoute>} />
              <Route path="/branch/staff" element={<ProtectedRoute roles={["BRANCH_HEAD"]}><StaffManagement /></ProtectedRoute>} />
              <Route path="/branch/analytics" element={<ProtectedRoute roles={["BRANCH_HEAD", "STAFF"]}><BranchAnalytics /></ProtectedRoute>} />
              <Route path="/branch/expenses" element={<ProtectedRoute roles={["BRANCH_HEAD", "STAFF"]}><ExpenseManager /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/branches" element={<ProtectedRoute roles={["ADMIN"]}><BranchManagement /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute roles={["ADMIN"]}><Analytics /></ProtectedRoute>} />
              <Route path="/admin/audit" element={<ProtectedRoute roles={["ADMIN"]}><AdminAudit /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute roles={["ADMIN"]}><UserManagement /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
            </PublicAdminAuthProvider>
          </PublicAuthProvider>
          <Toaster theme="dark" position="top-right" richColors />
          <VercelAnalytics />
        </AuthProvider>
      </ServerWakeupProvider>
    </HelmetProvider>
  );
}

export default App;
