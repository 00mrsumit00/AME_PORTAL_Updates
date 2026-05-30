import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Eye, EyeOff, Loader2, Mail, Lock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setErrorShake(false);

    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      const routes = {
        ADMIN: "/admin",
        BRANCH_HEAD: "/branch",
        STAFF: "/branch",
        STUDENT: "/student"
      };
      navigate(routes[user.role] || "/");
    } catch (err) {
      console.error("Login error:", err);
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);

      const errorMessage = err.response?.data?.detail || "Invalid email or password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Top Banner Button - Restored and Styled */}
      <div className="absolute top-8 left-0 right-0 z-20 flex justify-center px-4">
        <button
          className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 hover:bg-amber-500/20 text-amber-500 font-bold rounded-full px-8 py-3 shadow-2xl transition-all hover:scale-105 flex items-center gap-3 group"
          onClick={() => navigate('/mht-cet-registration')}
        >
          <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>MHT-CET 2026 Student Registration</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Ambient Background Glows */}
      <div className="login-bg-mesh">
        <div className="mesh-circle mesh-1"></div>
        <div className="mesh-circle mesh-2"></div>
      </div>

      <Card className={`login-card-premium ${errorShake ? 'error-shake' : ''}`}>
        <CardHeader className="space-y-2 pb-8">
          <div className="flex justify-center mb-6">
            <div className="p-1 bg-amber-500/5 rounded-2xl border border-amber-500/10 shadow-2xl">
              <img src="/icons/icon-512x512.png" alt="AME Logo" className="h-20 w-20 rounded-xl object-contain" />
            </div>
          </div>
          <CardTitle className="login-title">System Login</CardTitle>
          <CardDescription className="login-description">
            Access Maharashtra's Premier Admission Portal
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-400 font-medium ml-1">Email Address</Label>
              <div className="relative-input">
                <Mail className="input-icon h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-premium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" className="text-slate-400 font-medium">Password</Label>
                <a href="#" className="text-xs text-amber-500/70 hover:text-amber-500 transition-colors">Forgot Password?</a>
              </div>
              <div className="relative-input">
                <Lock className="input-icon h-5 w-5" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-premium"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors"
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="btn-login-premium"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center space-y-4">
            <p className="text-sm text-slate-500">
              New staff user? <a href="#" className="text-amber-500 hover:underline font-semibold">Request Access</a>
            </p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-sm text-slate-400 mb-3">Are you a normal student looking for Cutoffs & Predictor?</p>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 transition-all font-semibold"
                onClick={() => navigate('/public-login')}
              >
                Go to Public Student Portal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
