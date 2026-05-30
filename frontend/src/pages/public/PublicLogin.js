// Build Refresh: 2026-05-14 00:31:57
import { useState, useEffect, useCallback, useRef, cloneElement } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import { toast } from "sonner";
import {
  Loader2, Phone, Lock, User, ChevronRight,
  CheckCircle2, Star, ShieldCheck, Zap, BarChart3,
  Users, Trophy, GraduationCap, MapPin, PhoneCall,
  Headset, Database, LayoutDashboard, Search, FileText,
  Home, MessageSquare, Target
} from "lucide-react";

/* ─── DATA FOR MARQUEE ─── */
const MED_ACHIEVERS = [
  { name: "Mule Darshan", college: "AIIMS, New Delhi" },
  { name: "Patil Devraj", college: "AIIMS, New Delhi" },
  { name: "Khandade Kanhaiya", college: "AIIMS, New Delhi" },
  { name: "Khanzode Akshata", college: "AIIMS" },
  { name: "Rajmane Pushkar", college: "AIIMS" },
  { name: "More Anurag", college: "AIIMS" },
  { name: "Kawade Omkar", college: "AIIMS" },
  { name: "Girwalkar Shravani", college: "AIIMS" },
  { name: "Pokale Shreyas", college: "AIIMS" },
  { name: "Biradar Ramkrushna", college: "AIIMS" },
  { name: "Biyani Harshwardhan", college: "AIIMS" },
  { name: "Dhanshette Agastya", college: "AIIMS" },
  { name: "Surve Krishna", college: "AIIMS" },
  { name: "Tidke Shivanand", college: "AIIMS" },
  { name: "Musne Ajinkya", college: "AIIMS" },
  { name: "Sirsat Anushka", college: "AIIMS" },
];

const ecosystemFeatures = [
  {
    title: "Real-time Updates",
    desc: "Get instant notifications on counseling schedules, choice filling dates, and seat allotment releases.",
    icon: <Home className="h-6 w-6" />,
    color: "amber"
  },
  {
    title: "Community & Expert Chats",
    desc: "Discuss with thousands of aspirants or get 1-on-1 guidance from our 'Admissions Made Easy' professional counsellors.",
    icon: <MessageSquare className="h-6 w-6" />,
    color: "blue"
  },
  {
    title: "Precision Predictor",
    desc: "Our core engine analyzes your rank against 2 years of granular data to predict your admission chance.",
    icon: <Target className="h-6 w-6" />,
    color: "emerald"
  },
  {
    title: "Detailed Cutoffs",
    desc: "Browse through thousands of rows of historical data with advanced filters for category, state, and quota.",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "purple"
  },
  {
    title: "Student Profile",
    desc: "Manage your documents, track your application status, and keep your admission credentials secure.",
    icon: <User className="h-6 w-6" />,
    color: "rose"
  }
];

export default function PublicLogin() {
  const navigate = useNavigate();
  const { login, register } = usePublicAuth();

  // Auth State
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // UI State
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const autoPlayRef = useRef(null);

  const handleTabChange = useCallback((index) => {
    if (index === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(index);
    setTimeout(() => setIsTabLoading(false), 600);
  }, [activeTab]);

  // ── Auto-Switch Showcase Logic ──
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      handleTabChange((activeTab + 1) % ecosystemFeatures.length);
    }, 4000); // 4s cycle for comfortable reading

    return () => clearInterval(autoPlayRef.current);
  }, [activeTab, handleTabChange, ecosystemFeatures.length]);

  const [deferredPrompt, setDeferredPrompt] = useState(null);


  const renderMockContent = () => {
    switch (activeTab) {
      case 0: // Updates
        return (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {[
              { title: "Maharashtra NEET State Merit List 2024-25", time: "2 mins ago", type: "Urgent" },
              { title: "AIIMS New Delhi Reporting Schedule Released", time: "1 hour ago", type: "Update" },
              { title: "Choice Filling for Deemed Univ. Round 2 Opens", time: "3 hours ago", type: "News" }
            ].map((news, i) => (
              <div key={i} className="p-2.5 md:p-3 bg-white/5 rounded-xl border border-white/5 flex gap-3 hover:bg-white/10 transition-colors cursor-default">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                  <Zap size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest">{news.type}</span>
                    <span className="text-[7px] text-slate-500 font-medium">{news.time}</span>
                  </div>
                  <p className="text-[10px] md:text-[13px] text-slate-200 font-bold leading-tight truncate">{news.title}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 1: // Chats
        return (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <div className="flex items-center justify-between px-2 mb-1">
              <div className="flex gap-1">
                <div className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-[7px] font-black text-amber-500 uppercase">Community</div>
                <div className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md text-[7px] font-black text-slate-500 uppercase">Expert Hub</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-emerald-500 lp-pulse" />
                <span className="text-[7px] font-black text-emerald-500 uppercase">Expert Online</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 flex-1">
              {[
                { user: "Aryan", msg: "What was the cutoff for GMC Mumbai last year?", type: "student" },
                { user: "Admissions Made Easy - Admissions Counsellor", msg: "Hello! For GMC Mumbai, the Round 1 cutoff was 685.", type: "expert" },
                { user: "Rahul", msg: "Thanks sir! This helps.", type: "student", self: true }
              ].map((chat, i) => (
                <div key={i} className={`flex flex-col ${chat.self ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1 mb-0.5 ml-1">
                    <span className={`text-[7px] font-bold ${chat.type === 'expert' ? 'text-amber-500' : 'text-slate-600'}`}>{chat.user}</span>
                    {chat.type === 'expert' && <CheckCircle2 size={6} className="text-amber-500" />}
                  </div>
                  <div className={`p-2.5 rounded-xl max-w-[90%] text-[10px] font-medium border transition-all ${chat.type === 'expert'
                    ? 'bg-amber-500/5 border-amber-500/30 text-slate-200 rounded-tl-none shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]'
                    : chat.self
                      ? 'bg-white/5 border-white/10 text-slate-400 rounded-tr-none'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 rounded-tl-none'
                    }`}>
                    {chat.msg}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-2 flex gap-2">
              <div className="flex-1 h-8 bg-white/5 border border-white/10 rounded-lg px-3 flex items-center text-[9px] text-slate-600">Ask the Expert...</div>
              <div className="h-8 w-8 bg-amber-500 rounded-lg flex items-center justify-center text-black shadow-lg shadow-amber-500/20"><ChevronRight size={14} /></div>
            </div>
          </div>
        );
      case 2: // Predictor
        return (
          <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
            <div className="flex-1 flex flex-col items-center justify-center py-2">
              <div className="relative h-28 w-28 md:h-36 md:w-36 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" className="stroke-white/5 fill-none" strokeWidth="6" />
                  <circle
                    cx="50%" cy="50%" r="45%"
                    className="stroke-amber-500 fill-none drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    strokeWidth="6"
                    strokeDasharray="283"
                    strokeDashoffset={283 * 0.08}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center z-10">
                  <span className="text-2xl md:text-4xl font-black text-white drop-shadow-2xl">92%</span>
                  <p className="text-[7px] md:text-[9px] font-black text-amber-500 uppercase tracking-widest mt-0.5">High Probability</p>
                </div>
                <div className="absolute top-0 right-0 h-2 w-2 bg-amber-500 rounded-full lp-pulse shadow-lg shadow-amber-500/40" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3 mt-1">
              {[
                { name: "GMC Mumbai", chance: "92%", color: "text-amber-500" },
                { name: "BJMC Pune", chance: "88%", color: "text-amber-500" }
              ].map((col, i) => (
                <div key={i} className="p-2.5 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-0.5">
                  <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{col.name}</span>
                  <span className={`text-xs md:text-sm font-black ${col.color}`}>{col.chance} Chance</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 3: // Cutoffs
        return (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-1.5">
                <thead>
                  <tr className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
                    <th className="pb-1 pl-3">College Name</th>
                    <th className="pb-1">R1</th>
                    <th className="pb-1">R2</th>
                    <th className="pb-1">R3</th>
                  </tr>
                </thead>
                <tbody className="text-[9px] md:text-[11px] font-bold text-slate-300">
                  {[
                    { name: "Grant Medical College, Mumbai", r1: 685, r2: 682, r3: 678 },
                    { name: "BJ Medical College, Pune", r1: 672, r2: 668, r3: 665 },
                    { name: "GMC Nagpur", r1: 645, r2: 641, r3: 638 },
                    { name: "LTMC Sion, Mumbai", r1: 668, r2: 665, r3: 662 }
                  ].map((row, i) => (
                    <tr key={i} className="bg-white/[0.03] border border-white/5 rounded-lg overflow-hidden group hover:bg-white/[0.06] transition-colors">
                      <td className="py-2 pl-3 rounded-l-lg text-white truncate max-w-[120px] md:max-w-none">{row.name}</td>
                      <td className="py-2 text-amber-500/80">{row.r1}</td>
                      <td className="py-2 text-amber-500/90">{row.r2}</td>
                      <td className="py-2 text-amber-500 rounded-r-lg">{row.r3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-auto text-[7px] text-slate-600 text-center font-bold uppercase tracking-widest pt-2">Data Source: MCC Official (2024-25)</div>
          </div>
        );
      case 4: // Profile
        return (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Left Column: Identity & Stats */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="relative group mb-3">
                  <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <User className="h-6 w-6 md:h-7 md:h-7 text-amber-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-emerald-500 rounded-full border-2 border-[#020617] flex items-center justify-center text-white">
                    <CheckCircle2 size={8} />
                  </div>
                </div>

                <h4 className="text-lg md:text-xl font-black text-white mb-0.5">Vikrant Patil</h4>
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified Aspirant</span>
                </div>

                <div className="w-full space-y-2">
                  {[
                    { label: "NEET Score", val: "685 / 720", icon: <Trophy size={12} /> },
                    { label: "AIR Rank", val: "1,245", icon: <Target size={12} /> }
                  ].map((stat, i) => (
                    <div key={i} className="h-10 bg-white/5 rounded-xl border border-white/5 flex items-center px-3 justify-between group hover:border-amber-500/30 transition-all">
                      <div className="flex items-center gap-2.5">
                        <div className="text-amber-500/50 group-hover:text-amber-500 transition-colors">{stat.icon}</div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-white">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Progress & Checklist */}
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl relative overflow-hidden">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Doc Status</span>
                    <span className="text-amber-500 text-[9px] font-black">80%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[80%] bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "NEET Scorecard", ok: true },
                    { name: "Caste Certificate", ok: true },
                    { name: "Domicile Cert.", ok: true }
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-white/[0.01] border border-white/5 rounded-lg">
                      <span className="text-[9px] font-bold text-slate-400">{doc.name}</span>
                      {doc.ok ? <CheckCircle2 size={10} className="text-emerald-500" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // Secret navigation trick for admin login
        if (phone === "9879879879" && password === "1231231231") {
          toast.info("Navigating to admin portal...");
          navigate("/portal-admin/login");
          return;
        }
        const userData = await login(phone, password);
        toast.success("Welcome back!");
        
        // Intelligent Redirection: Go to profile if incomplete
        const isComplete = !!(
          userData?.full_name && 
          userData?.neet_score !== null && 
          userData?.category && 
          userData?.gender && 
          userData?.district && 
          userData?.special_reservation
        );

        if (isComplete) {
          navigate("/app/home");
        } else {
          toast.info("Please complete your profile to unlock all features.");
          navigate("/app/profile");
        }
      } else {
        if (!fullName) {
          toast.error("Please enter your full name");
          setLoading(false);
          return;
        }
        await register(fullName, phone, password);
        toast.success("Account created successfully!");
        // New users always go to profile first
        navigate("/app/profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || (isLogin ? "Login failed" : "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const scrollToAuth = (mode = true) => {
    setIsLogin(mode);
    const element = document.getElementById("auth-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`lp-root bg-[#020617] text-slate-200 min-h-screen transition-all duration-500 ${isLightMode ? 'light-mode' : ''}`}>
      <Helmet>
        <title>Admissions Made Easy | India's Most Accurate Predictor</title>
      </Helmet>

      <style>{`
        .lp-root { font-family: 'Outfit', sans-serif; }
        .lp-container { width: 92%; max-width: 1200px; margin: 0 auto; }
        
        .lp-header { position: sticky; top: 0; width: 100%; z-index: 1000; background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .lp-nav-link { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.6); transition: all 0.3s; }
        .lp-nav-link:hover { color: #f39c12; }

        .lp-hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(243,156,18,0.1); border: 1px solid rgba(243,156,18,0.3); color: #f39c12; padding: 0.5rem 1.2rem; border-radius: 50px; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }

        .lp-stats-badge { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.75rem 1.5rem; border-radius: 1rem; text-align: center; }
        .lp-stats-badge-val { display: block; font-size: 1.25rem; font-weight: 900; color: #f39c12; line-height: 1.2; }
        .lp-stats-badge-lbl { display: block; font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; margin-top: 0.2rem; }

        @keyframes lp-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .lp-marquee-track { display: flex; gap: 1rem; width: max-content; animation: lp-marquee 40s linear infinite; }

        .lp-step-num { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #f39c12; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #f39c12; font-size: 0.9rem; margin-bottom: 1.5rem; background: rgba(243,156,18,0.05); }

        /* ─── PUBLIC LOGIN LIGHT MODE OVERRIDES ─── */
        .light-mode {
          background-color: #fafbfc !important;
          background-image: 
            radial-gradient(circle at 15% 15%, rgba(243, 156, 18, 0.08) 0%, transparent 55%),
            radial-gradient(circle at 85% 20%, rgba(56, 189, 248, 0.09) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(243, 156, 18, 0.04) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.07) 0%, transparent 50%) !important;
          color: #334155 !important;
          transition: all 0.5s ease !important;
        }
        
        .light-mode .lp-header {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(25px) !important;
          border-bottom: 1px solid rgba(243, 156, 18, 0.12) !important;
          box-shadow: 0 4px 30px rgba(15, 23, 42, 0.01) !important;
        }
        
        .light-mode .lp-nav-link {
          color: #475569 !important;
          font-weight: 800 !important;
          font-size: 0.82rem !important;
          letter-spacing: 0.5px !important;
          transition: all 0.3s ease !important;
          position: relative !important;
        }
        .light-mode .lp-nav-link:hover {
          color: #d35400 !important;
        }
        .light-mode .lp-nav-link::after {
          content: '' !important;
          position: absolute !important;
          bottom: -6px !important;
          left: 0 !important;
          width: 0% !important;
          height: 2px !important;
          background: linear-gradient(90deg, #f39c12, #d35400) !important;
          transition: all 0.3s ease !important;
          border-radius: 2px !important;
        }
        .light-mode .lp-nav-link:hover::after {
          width: 100% !important;
        }
        
        .light-mode h1 {
          color: #0b1329 !important;
          font-weight: 950 !important;
          letter-spacing: -2px !important;
          text-shadow: 0 2px 12px rgba(15, 23, 42, 0.01) !important;
        }
        .light-mode h2,
        .light-mode h3,
        .light-mode h4,
        .light-mode .text-white {
          color: #0f172a !important;
        }
        
        .light-mode h1 span[class*="bg-clip-text"] {
          background: linear-gradient(135deg, #d35400 0%, #f39c12 50%, #e67e22 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        
        .light-mode p,
        .light-mode .text-slate-400,
        .light-mode .text-slate-500 {
          color: #475569 !important;
        }
        .light-mode p span.text-white {
          color: #0f172a !important;
          font-weight: 800 !important;
          background: rgba(243, 156, 18, 0.08) !important;
          padding: 0.2rem 0.4rem !important;
          border-radius: 0.5rem !important;
          border: 1px solid rgba(243, 156, 18, 0.15) !important;
        }
        
        .light-mode .lp-hero-badge {
          background: linear-gradient(135deg, rgba(243, 156, 18, 0.12), rgba(243, 156, 18, 0.04)) !important;
          border: 1px solid rgba(243, 156, 18, 0.3) !important;
          color: #d35400 !important;
          box-shadow: 0 10px 25px -5px rgba(243, 156, 18, 0.1) !important;
        }
        
        .light-mode .lp-stats-badge {
          background: rgba(255, 255, 255, 0.85) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(243, 156, 18, 0.22) !important;
          box-shadow: 0 15px 30px -10px rgba(243, 156, 18, 0.08), 0 4px 12px -5px rgba(15, 23, 42, 0.04), inset 0 1px 0 #ffffff !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
          padding: 1.25rem 1.75rem !important;
        }
        .light-mode .lp-stats-badge:hover {
          transform: translateY(-5px) scale(1.02) !important;
          border-color: rgba(243, 156, 18, 0.5) !important;
          box-shadow: 0 25px 45px -10px rgba(243, 156, 18, 0.16), 0 8px 20px -5px rgba(15, 23, 42, 0.08) !important;
        }
        .light-mode .lp-stats-badge-val {
          color: #d35400 !important;
          font-weight: 900 !important;
          background: linear-gradient(135deg, #d35400, #f39c12) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        .light-mode .lp-stats-badge-lbl {
          color: #475569 !important;
          font-weight: 800 !important;
          font-size: 0.7rem !important;
          letter-spacing: 0.5px !important;
        }
        
        /* Predictors Section and Cards */
        .light-mode #predictors {
          background: radial-gradient(circle at bottom right, rgba(243, 156, 18, 0.03), transparent 60%), #f8fafc !important;
          border-top: 1px solid rgba(15, 23, 42, 0.03) !important;
          border-bottom: 1px solid rgba(15, 23, 42, 0.03) !important;
        }
        .light-mode #ecosystem {
          background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.03), transparent 50%), #f8fafc !important;
        }
        
        .light-mode #predictors .group {
          background: #ffffff !important;
          border: 1px solid rgba(243, 156, 18, 0.12) !important;
          box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.03), 0 10px 25px -10px rgba(243, 156, 18, 0.05) !important;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        
        .light-mode #predictors .group:hover {
          transform: translateY(-8px) scale(1.01) !important;
          border-color: rgba(243, 156, 18, 0.4) !important;
          box-shadow: 0 45px 85px -20px rgba(243, 156, 18, 0.15), 0 15px 35px -10px rgba(15, 23, 42, 0.05) !important;
        }
        
        .light-mode #predictors .group div[class*="bg-gradient-to-br"] {
          background: linear-gradient(135deg, rgba(243, 156, 18, 0.12), rgba(243, 156, 18, 0.03)) !important;
          border-color: rgba(243, 156, 18, 0.2) !important;
          color: #d35400 !important;
        }
        
        .light-mode #predictors .group button {
          background: #f8fafc !important;
          border: 1px solid rgba(15, 23, 42, 0.06) !important;
          color: #334155 !important;
        }
        
        .light-mode #predictors .group button:hover {
          background: linear-gradient(135deg, #f39c12, #d35400) !important;
          border-color: #d35400 !important;
          color: #ffffff !important;
          box-shadow: 0 15px 30px -5px rgba(243, 156, 18, 0.4) !important;
        }
        
        /* Ecosystem Dashboard App Mockup */
        .light-mode .lp-glass {
          background: rgba(255, 255, 255, 0.85) !important;
          backdrop-filter: blur(25px) !important;
          border: 1px solid rgba(243, 156, 18, 0.18) !important;
          box-shadow: 0 50px 100px -30px rgba(15, 23, 42, 0.08), 0 15px 35px -10px rgba(243, 156, 18, 0.04) !important;
        }
        
        .light-mode [class*="bg-white/[0.01]"] {
          background-color: rgba(255, 255, 255, 0.4) !important;
          border-color: rgba(15, 23, 42, 0.06) !important;
        }
        
        .light-mode [class*="bg-white/[0.01]"] h3,
        .light-mode [class*="bg-white/[0.01]"] p {
          color: #0f172a !important;
        }
        
        .light-mode [class*="bg-[#020617]/50"] {
          background-color: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid rgba(243, 156, 18, 0.16) !important;
          box-shadow: inset 0 2px 8px rgba(15, 23, 42, 0.02) !important;
        }
        
        .light-mode [class*="bg-[#020617]"] {
          background-color: rgba(255, 255, 255, 0.7) !important;
          backdrop-filter: blur(15px) !important;
          border: 1px solid rgba(243, 156, 18, 0.15) !important;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03) !important;
        }
        
        .light-mode button[class*="text-slate-600"] {
          color: #64748b !important;
        }
        
        .light-mode button[class*="text-slate-600"]:hover {
          color: #d35400 !important;
          background: rgba(243, 156, 18, 0.08) !important;
        }
        
        .light-mode button[class*="bg-amber-500"] {
          background: linear-gradient(135deg, #f39c12, #d35400) !important;
          color: #ffffff !important;
          box-shadow: 0 10px 25px -5px rgba(243, 156, 18, 0.3) !important;
        }
        
        /* Mockup elements overrides */
        .light-mode .lp-glass div[class*="bg-white/5"] {
          background-color: #f8fafc !important;
          border: 1px solid rgba(15, 23, 42, 0.06) !important;
          transition: all 0.3s ease !important;
        }
        .light-mode .lp-glass div[class*="bg-white/5"]:hover {
          background-color: #ffffff !important;
          border-color: rgba(243, 156, 18, 0.25) !important;
          box-shadow: 0 8px 20px rgba(243, 156, 18, 0.04) !important;
        }
        .light-mode .lp-glass div[class*="border-white/5"] {
          border-color: rgba(15, 23, 42, 0.06) !important;
        }
        .light-mode .lp-glass div[class*="border-white/10"] {
          border-color: rgba(15, 23, 42, 0.08) !important;
        }
        .light-mode .lp-glass .text-slate-200 {
          color: #1e293b !important;
        }
        .light-mode .lp-glass .text-slate-300 {
          color: #334155 !important;
        }
        .light-mode .lp-glass .text-slate-500 {
          color: #64748b !important;
          font-weight: 600 !important;
        }
        
        /* SVG Circle graph */
        .light-mode .lp-glass circle[class*="stroke-white/5"] {
          stroke: rgba(15, 23, 42, 0.06) !important;
        }
        
        /* Table rows overrides */
        .light-mode .lp-glass tr[class*="bg-white"] {
          background-color: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(15, 23, 42, 0.04) !important;
        }
        .light-mode .lp-glass tr[class*="bg-white"]:hover {
          background-color: rgba(243, 156, 18, 0.05) !important;
          border-color: rgba(243, 156, 18, 0.15) !important;
        }
        .light-mode .lp-glass td {
          color: #0f172a !important;
          font-weight: 800 !important;
        }
        .light-mode .lp-glass th {
          color: #64748b !important;
          font-weight: 900 !important;
          border-bottom: 2px solid rgba(243, 156, 18, 0.12) !important;
          padding-bottom: 0.5rem !important;
        }
        
        /* Chat bubble overrides */
        .light-mode .lp-glass div[class*="bg-amber-500/5"] {
          background-color: rgba(243, 156, 18, 0.08) !important;
          border-color: rgba(243, 156, 18, 0.2) !important;
          color: #1e293b !important;
          box-shadow: 0 4px 12px rgba(243, 156, 18, 0.02) !important;
        }
        .light-mode .lp-glass div[class*="bg-white/[0.02]"] {
          background-color: #f1f5f9 !important;
          border-color: rgba(15, 23, 42, 0.06) !important;
          color: #334155 !important;
        }
        
        /* Chat text field simulator */
        .light-mode .lp-glass div[class*="bg-white/5"].text-slate-600 {
          background-color: #f8fafc !important;
          border-color: rgba(15, 23, 42, 0.1) !important;
          color: #94a3b8 !important;
        }
        
        /* Student Profile Layout */
        .light-mode .lp-glass div[class*="bg-white/5"].h-10 {
          background-color: #f8fafc !important;
          border-color: rgba(15, 23, 42, 0.06) !important;
        }
        .light-mode .lp-glass div[class*="bg-white/5"].h-10:hover {
          border-color: rgba(243, 156, 18, 0.3) !important;
          background-color: #ffffff !important;
        }
        .light-mode .lp-glass div[class*="bg-white/5"].h-10 span {
          color: #0f172a !important;
        }
        .light-mode .lp-glass div[class*="bg-white/[0.03]"].p-4 {
          background-color: #f8fafc !important;
          border-color: rgba(15, 23, 42, 0.08) !important;
        }
        .light-mode .lp-glass div[class*="bg-white/[0.01]"].p-2\.5 {
          background-color: #ffffff !important;
          border-color: rgba(15, 23, 42, 0.06) !important;
        }
        .light-mode .lp-glass div[class*="bg-white/[0.01]"].p-2\.5 span {
          color: #334155 !important;
        }
        
        /* Auth Card overrides */
        .light-mode #auth-section {
          background: radial-gradient(circle at center, rgba(243, 156, 18, 0.06), transparent 70%), #fbfcfd !important;
        }
        
        .light-mode #auth-section > div > div {
          background: #ffffff !important;
          border: 1px solid rgba(243, 156, 18, 0.18) !important;
          box-shadow: 0 40px 90px -20px rgba(15, 23, 42, 0.06), 0 20px 40px -15px rgba(243, 156, 18, 0.06) !important;
          border-radius: 3rem !important;
        }
        
        .light-mode #auth-section label {
          color: #475569 !important;
          font-weight: 700 !important;
        }
        
        .light-mode #auth-section input {
          background-color: #fcfdfd !important;
          border: 1px solid rgba(15, 23, 42, 0.1) !important;
          color: #0f172a !important;
          border-radius: 1.25rem !important;
          transition: all 0.3s ease !important;
        }
        
        .light-mode #auth-section input::placeholder {
          color: #94a3b8 !important;
        }
        
        .light-mode #auth-section input:focus {
          background-color: #ffffff !important;
          border-color: #f39c12 !important;
          box-shadow: 0 0 0 4px rgba(243, 156, 18, 0.14) !important;
        }
        
        .light-mode #auth-section .text-slate-500 {
          color: #64748b !important;
        }
        
        .light-mode #auth-section button[class*="text-white"] {
          color: #0f172a !important;
          font-weight: 800 !important;
        }
        
        .light-mode #auth-section button[type="submit"] {
          background: linear-gradient(135deg, #f39c12, #d35400) !important;
          border: none !important;
          color: #ffffff !important;
          box-shadow: 0 15px 35px -5px rgba(243, 156, 18, 0.4) !important;
          transition: all 0.3s ease !important;
        }
        .light-mode #auth-section button[type="submit"]:hover {
          transform: translateY(-2px) scale(1.01) !important;
          box-shadow: 0 20px 45px -5px rgba(243, 156, 18, 0.5) !important;
        }
        
        /* Tactile CTA Button styling */
        .light-mode button[class*="bg-[#f39c12]"] {
          background: linear-gradient(135deg, #f39c12 0%, #e67e22 50%, #d35400 100%) !important;
          border: 1px solid rgba(211, 84, 0, 0.2) !important;
          color: #ffffff !important;
          font-weight: 900 !important;
          box-shadow: 0 20px 40px -10px rgba(243, 156, 18, 0.35), 0 5px 15px rgba(211, 84, 0, 0.1) !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .light-mode button[class*="bg-[#f39c12]"]:hover {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 25px 50px -5px rgba(243, 156, 18, 0.45), 0 8px 20px rgba(211, 84, 0, 0.2) !important;
        }
        
        .light-mode button[class*="bg-white/5"] {
          background: rgba(255, 255, 255, 0.8) !important;
          border: 1px solid rgba(15, 23, 42, 0.1) !important;
          color: #1e293b !important;
          font-weight: 900 !important;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.03) !important;
          transition: all 0.3s ease !important;
        }
        .light-mode button[class*="bg-white/5"]:hover {
          background: #ffffff !important;
          border-color: rgba(243, 156, 18, 0.4) !important;
          color: #d35400 !important;
          box-shadow: 0 15px 30px -5px rgba(243, 156, 18, 0.12) !important;
          transform: translateY(-2px) !important;
        }
        
        /* Mobile Install Banner Overrides */
        .light-mode button[class*="bg-gradient-to-r"] {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.75)) !important;
          border: 1px solid rgba(243, 156, 18, 0.22) !important;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.04), 0 5px 15px -5px rgba(243, 156, 18, 0.05) !important;
        }
        .light-mode button[class*="bg-gradient-to-r"]:hover {
          border-color: rgba(243, 156, 18, 0.45) !important;
          box-shadow: 0 25px 50px -10px rgba(243, 156, 18, 0.14) !important;
        }
        .light-mode button[class*="bg-gradient-to-r"] div[class*="text-amber-500"] {
          color: #d35400 !important;
        }
        
        /* Dark Mode Switch Floating button in Light Mode */
        .light-mode button[class*="fixed"] {
          background: #0f172a !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25) !important;
        }
        .light-mode button[class*="fixed"]:hover {
          background: #1e293b !important;
          transform: scale(1.05) translateY(-3px) !important;
          box-shadow: 0 25px 55px rgba(15, 23, 42, 0.35) !important;
        }
        
        /* ─── Brand Logo Dual-Layer Clip-Path Realignment ─── */
        .lp-logo-emblem {
          clip-path: inset(0 86.5% 0 0) !important;
          position: relative !important;
          z-index: 10 !important;
          transition: all 0.3s ease !important;
        }
        .lp-logo-text {
          clip-path: inset(0 0 0 13.5%) !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          z-index: 5 !important;
          transition: all 0.3s ease !important;
        }
        
        /* Light mode filter applied ONLY to the text portion, keeping the emblem perfectly colorful! */
        .light-mode .lp-logo-text {
          filter: brightness(0) !important;
          opacity: 0.95 !important;
        }
        
        /* Outer outline shadow to keep tiny sub-emblem texts ("Sachin Bangad", "Since 2011") crisp and legible */
        .light-mode .lp-logo-emblem {
          filter: drop-shadow(0.5px 0.5px 0px rgba(15, 23, 42, 0.45)) 
                  drop-shadow(-0.5px -0.5px 0px rgba(15, 23, 42, 0.45)) !important;
        }
        
        /* Footer Indigo contrast theme overrides */
        .light-mode footer {
          background: #0f172a !important;
          border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        .light-mode footer .text-slate-400 {
          color: #94a3b8 !important;
        }
        .light-mode footer h4,
        .light-mode footer .text-white {
          color: #ffffff !important;
        }
      `}</style>

      {/* ── Navbar ────────────────────────────────────────────────── */}
      <header className="lp-header px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center relative h-10 md:h-12 select-none">
            {/* Layer 1: Emblem (Original vibrant colors preserved) */}
            <img 
              src="/landing-assets/images/branding/logo1.png" 
              alt="Admissions Made Easy emblem" 
              className="h-full w-auto object-contain lp-logo-emblem" 
            />
            {/* Layer 2: Brand Text (Silhouetted to charcoal-black only in Light Mode) */}
            <img 
              src="/landing-assets/images/branding/logo1.png" 
              alt="Admissions Made Easy text" 
              className="absolute left-0 top-0 h-full w-auto object-contain lp-logo-text" 
            />
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="lp-nav-link">Home</Link>
            <a href="#predictors" className="lp-nav-link">Predictors</a>
            <a href="#process" className="lp-nav-link">About Portal</a>
            <button onClick={() => scrollToAuth(true)} className="lp-nav-link">Sign In</button>
            <button
              onClick={() => scrollToAuth(false)}
              className="px-6 py-2.5 bg-[#f39c12] text-black font-black text-sm rounded-xl shadow-xl shadow-[#f39c12]/20 hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#f39c12]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="lp-container relative z-10">
          <div className="lp-hero-badge mb-10">
            <ShieldCheck className="h-4 w-4" />
            MOST TRUSTED PREDICTOR 2024-25
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
            Experience the Most <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f39c12] via-amber-400 to-[#f39c12]">
              Accurate Medical Admissions Predictor.
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
            Stop guessing your future. Join <span className="text-white font-bold">Admissions Made Easy Portal</span>, using our real-time cutoff analyzer powered by verified cutoff data.
          </p>

          {/* New Stats Row from Port 3001 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
            <div className="lp-stats-badge">
              <span className="lp-stats-badge-val">All</span>
              <span className="lp-stats-badge-lbl">Colleges Covered</span>
            </div>
            <div className="lp-stats-badge">
              <span className="lp-stats-badge-val">2 Years</span>
              <span className="lp-stats-badge-lbl">Cutoff Data (24-25)</span>
            </div>
            <div className="lp-stats-badge">
              <span className="lp-stats-badge-val">3 Modes</span>
              <span className="lp-stats-badge-lbl">Prediction Engines</span>
            </div>
            <div className="lp-stats-badge">
              <span className="lp-stats-badge-val">11 Cat</span>
              <span className="lp-stats-badge-lbl">Category + Spec Resev</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <button
                onClick={() => scrollToAuth(false)}
                className="px-8 py-4 bg-[#f39c12] text-black font-black text-base md:text-lg rounded-2xl shadow-2xl shadow-[#f39c12]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                Analyze Your Chance Now
                <ChevronRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => scrollToAuth(true)}
                className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black text-base md:text-lg rounded-2xl hover:bg-white/10 transition-all"
              >
                Sign In
              </button>
            </div>

            {/* PWA Install Banner - Screenshot 1 Style */}
            {deferredPrompt && (
              <button
                onClick={() => {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                      console.log('User accepted the A2HS prompt');
                    }
                    setDeferredPrompt(null);
                  });
                }}
                className="w-full max-w-md group p-1 rounded-[1.5rem] bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-all text-left relative overflow-hidden"
              >
                <div className="flex items-center gap-4 p-3">
                  <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                    {/* Mock App Icon */}
                    <div className="h-10 w-10 bg-gradient-to-br from-[#f39c12] to-[#d35400] rounded-xl flex items-center justify-center">
                      <ShieldCheck className="text-white h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.2em] mb-1">Highly Recommended</div>
                    <div className="text-lg md:text-xl font-black text-white leading-tight">Install Portal as Mobile App</div>
                  </div>
                  <ChevronRight className="text-amber-500/50 group-hover:text-amber-500 transition-colors" />
                </div>
              </button>
            )}
          </div>
        </div>
      </section>


      {/* ── Predictor Engines Section ───────────────────────────── */}
      <section id="predictors" className="py-40 px-6 relative overflow-hidden bg-[#03081a]">
        {/* Subtle Section Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="lp-container relative">
          <div className="mb-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/5 border border-amber-500/10 rounded-full mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 lp-pulse" />
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Precision Prediction Engines</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6">
              Choose Your <span className="lp-text-gradient">Counselling Pool.</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
              Proprietary algorithms tailored for specific seat categories and historical trends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Maharashtra State Quota",
                desc: "Complete analysis for 85% State Quota seats in MBBS, BDS, BAMS, BHMS colleges across Maharashtra.",
                icon: <LayoutDashboard className="h-8 w-8" />,
                tag: "Local Pool (85%)",
                accent: "from-amber-500/20 to-amber-600/5"
              },
              {
                title: "AIIMS Colleges",
                desc: "Dedicated prediction engine for all 20+ AIIMS campuses across India based on your NEET AIR & Category.",
                icon: <Trophy className="h-8 w-8" />,
                tag: "National Pool",
                accent: "from-blue-500/20 to-blue-600/5"
              },
              {
                title: "Deemed Universities",
                desc: "Pan-India predictor for 50+ Deemed Universities. Real-time fee vs. merit analysis for smart choices.",
                icon: <Database className="h-8 w-8" />,
                tag: "Private Pool",
                accent: "from-emerald-500/20 to-emerald-600/5"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative p-10 bg-slate-900/30 border border-white/5 rounded-[3rem] hover:bg-slate-900/50 transition-all duration-700 flex flex-col h-full overflow-hidden"
              >
                {/* Dynamic Border Glow on Hover */}
                <div className="absolute inset-0 border-2 border-amber-500/0 group-hover:border-amber-500/20 rounded-[3rem] transition-all duration-700" />
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 pointer-events-none" />

                <div className="relative z-10">
                  <div className={`h-20 w-20 bg-gradient-to-br ${item.accent} border border-white/5 rounded-[1.5rem] flex items-center justify-center mb-10 text-amber-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                    {item.icon}
                  </div>

                  <div className="mb-4">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">{item.tag}</span>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-6 group-hover:text-amber-500 transition-colors duration-500 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 text-base leading-relaxed mb-12 flex-1 font-medium group-hover:text-slate-400 transition-colors">
                    {item.desc}
                  </p>

                  <button
                    onClick={() => scrollToAuth(false)}
                    className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-black hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
                  >
                    Start Analysis
                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Digital Ecosystem (Unified App UI) ────────────────── */}
      <section id="ecosystem" className="py-8 md:py-12 px-4 md:px-6 bg-[#03081a] relative overflow-hidden flex items-center justify-center min-h-[90vh]">
        <div className="lp-container relative w-full">
          <div className="text-center mb-6 md:mb-8">
            <span className="text-amber-500 text-[9px] font-black uppercase tracking-[0.4em] mb-2.5 block underline underline-offset-8 decoration-amber-500/30">The Digital Ecosystem</span>
            <h2 className="text-2xl md:text-5xl font-black text-white tracking-tighter leading-[0.9]">One Portal. <br /><span className="text-slate-500">Every Solution.</span></h2>
          </div>

          {/* Unified App Shell Mockup - Optimized for Zero-Scroll */}
          <div className="max-w-5xl mx-auto">
            <div className="lp-glass rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 shadow-[0_0_100px_-20px_rgba(245,158,11,0.15)] relative border border-white/10 overflow-hidden flex flex-col md:flex-row gap-5 md:gap-8 max-h-none md:max-h-[720px]">

              {/* Progress Bar */}
              {isTabLoading && (
                <div className="absolute top-0 left-0 h-1 bg-amber-500 z-[200] lp-progress-bar" />
              )}

              {/* ── Vertical Navigation Rail ── */}
              <div className="flex md:flex-col justify-between md:justify-start w-full md:w-auto gap-3 md:gap-5 items-center bg-[#020617]/50 md:bg-[#020617] rounded-[1.5rem] md:rounded-[2.5rem] p-2.5 md:p-4 border border-white/5 order-2 md:order-1 px-5 md:px-4 shrink-0">
                {ecosystemFeatures.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleTabChange(i)}
                    className={`h-10 w-10 md:h-13 md:w-13 rounded-xl md:rounded-2xl flex items-center justify-center transition-all flex-shrink-0 relative group ${activeTab === i ? 'bg-amber-500 text-black shadow-2xl shadow-amber-500/40' : 'text-slate-600 hover:text-amber-500 hover:bg-white/5'}`}
                  >
                    {activeTab === i && isTabLoading && <div className="lp-ripple absolute inset-0 m-auto" />}
                    {cloneElement(item.icon, { size: 18, strokeWidth: 2.5 })}

                    <div className="hidden md:block absolute left-full ml-4 px-3 py-1.5 bg-amber-500 text-black text-[8px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[300]">
                      {item.title}
                    </div>
                  </button>
                ))}
              </div>

              {/* ── Main App Content Window ── */}
              <div className="flex-1 bg-white/[0.01] rounded-[1.8rem] md:rounded-[2.5rem] border border-white/5 p-4 md:p-8 overflow-hidden relative order-1 md:order-2 flex flex-col min-w-0">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent pointer-events-none" />

                <div className={`flex flex-col h-full transition-all duration-500 ${isTabLoading ? 'opacity-20 blur-md scale-95' : 'opacity-100 scale-100'}`}>

                  {/* Module Header - Tightened */}
                  <div className="mb-4 md:mb-5 shrink-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="h-1 w-8 bg-amber-500 rounded-full" />
                      <span className="text-[8px] font-black text-amber-500 uppercase tracking-[0.4em]">Feature 0{activeTab + 1}</span>
                    </div>
                    <h3 className="text-xl md:text-3xl font-black text-white mb-1 md:mb-2 tracking-tighter">
                      {ecosystemFeatures[activeTab].title}
                    </h3>
                    <p className="text-slate-500 text-[10px] md:text-sm font-medium leading-relaxed max-w-xl line-clamp-2">
                      {ecosystemFeatures[activeTab].desc}
                    </p>
                  </div>

                  {/* Interactive Component Area - Optimized for Zero-Scroll */}
                  <div className="flex-1 rounded-[1.5rem] md:rounded-[2rem] bg-[#020617]/50 border border-white/5 p-4 md:p-6 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                      {cloneElement(ecosystemFeatures[activeTab].icon, { size: 80 })}
                    </div>
                    <div className="h-full">
                      {renderMockContent()}
                    </div>
                  </div>

                  {/* Footer Actions - Tightened */}
                  <div className="mt-4 md:mt-5 flex items-center justify-between border-t border-white/5 pt-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-amber-500 lp-pulse" />
                      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Active Module</span>
                    </div>
                    <button onClick={() => scrollToAuth(false)} className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-amber-500 hover:text-black transition-all">
                      Access Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Unified Auth Section ────────────────────────────────── */}
      <section id="auth-section" className="py-40 px-6 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0f1c]/80 pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f39c12]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 bg-white p-2 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#f39c12]/20 border border-[#f39c12]/10">
                <img src="/icons/icon-512x512.png" alt="Logo" className="h-full w-full object-contain" />
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-slate-400 text-sm">
                {isLogin ? "Access your portal tools" : "Join our admission community"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#f39c12] transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text" required
                      className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-2xl pl-12 focus:outline-none focus:border-[#f39c12]/50 transition-all"
                      placeholder="Your Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Mobile Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#f39c12] transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    type="tel" required maxLength="10"
                    className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-2xl pl-12 focus:outline-none focus:border-[#f39c12]/50 transition-all"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                  {isLogin && <button type="button" className="text-[10px] text-[#f39c12] font-black uppercase tracking-widest">Forgot?</button>}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#f39c12] transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password" required
                    className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-2xl pl-12 focus:outline-none focus:border-[#f39c12]/50 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full h-14 mt-4 rounded-2xl bg-gradient-to-r from-[#f39c12] to-[#d35400] text-white font-black text-lg shadow-xl shadow-[#f39c12]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <>
                    {isLogin ? "Sign In to Portal" : "Create My Account"}
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>


            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500">{isLogin ? "New here?" : "Already member?"}</span>{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-black text-white hover:text-[#f39c12] transition-colors underline underline-offset-4 decoration-[#f39c12]/30"
              >
                {isLogin ? "Register Now" : "Sign In here"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="py-16 md:py-20 px-6 border-t border-white/5 bg-[#010410]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-8 mb-12 md:mb-16">

            {/* Brand column */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center">
                <img src="/landing-assets/images/branding/logo1.png" alt="Admissions Made Easy" className="h-10 md:h-12 w-auto object-contain" />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Maharashtra's most trusted Medical & Engineering admissions consultancy. Guiding students and families since 2011 across 5 branches.
              </p>
              <div className="flex items-center gap-4">
                {[
                  { icon: "fab fa-facebook-f", url: "https://www.facebook.com/admissionsmadeeasy" },
                  { icon: "fab fa-instagram", url: "https://www.instagram.com/admissionsmadeeasy" },
                  { icon: "fab fa-youtube", url: "https://www.youtube.com/@sachinbangad21" },
                  { icon: "fab fa-linkedin-in", url: "https://www.linkedin.com/company/admissions-made-easy" }
                ].map((item, idx) => (
                  <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#f39c12] hover:bg-[#f39c12]/10 hover:border-[#f39c12]/30 transition-all">
                    <i className={item.icon}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-white font-bold tracking-widest text-xs uppercase mb-6">Quick Links</h5>
              <ul className="flex flex-col gap-4">
                <li><Link to="/" className="text-slate-400 hover:text-[#f39c12] text-sm font-medium transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#f39c12]" /> Home</Link></li>
                <li><a href="#services" className="text-slate-400 hover:text-[#f39c12] text-sm font-medium transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#f39c12]" /> Our Services</a></li>
                <li><a href="#handbooks" className="text-slate-400 hover:text-[#f39c12] text-sm font-medium transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#f39c12]" /> Handbooks 2026</a></li>
                <li><a href="#process" className="text-slate-400 hover:text-[#f39c12] text-sm font-medium transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#f39c12]" /> Admission Process</a></li>
                <li><a href="#results" className="text-slate-400 hover:text-[#f39c12] text-sm font-medium transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#f39c12]" /> Our Results</a></li>
                <li><a href="#branches" className="text-slate-400 hover:text-[#f39c12] text-sm font-medium transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#f39c12]" /> Branches</a></li>
              </ul>
            </div>

            {/* Handbooks */}
            <div>
              <h5 className="text-white font-bold tracking-widest text-xs uppercase mb-6">Downloads</h5>
              <ul className="flex flex-col gap-4">
                <li><a href="/landing-assets/handbooks/med-2026.pdf" download className="text-slate-400 hover:text-[#f39c12] text-sm font-medium transition-colors flex items-start gap-2"><FileText className="h-4 w-4 text-[#f39c12] mt-0.5 shrink-0" /> NEET UG 2026 Handbook</a></li>
                <li><a href="/landing-assets/handbooks/engg-2026.pdf" download className="text-slate-400 hover:text-[#f39c12] text-sm font-medium transition-colors flex items-start gap-2"><FileText className="h-4 w-4 text-[#f39c12] mt-0.5 shrink-0" /> Engineering 2026 Handbook</a></li>
                <li><a href="https://forms.gle/ns7NxapvAda6mEnBA" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#f39c12] text-sm font-medium transition-colors flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-[#f39c12] mt-0.5 shrink-0" /> Book Free Counselling</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="text-white font-bold tracking-widest text-xs uppercase mb-6">Contact Us</h5>
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#f39c12] mt-0.5 shrink-0" />
                  <span className="text-slate-400 text-sm leading-relaxed">Shivaji Nagar, Latur — 413512 (HQ)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-[#f39c12] mt-0.5 shrink-0" />
                  <span className="text-slate-400 text-sm leading-relaxed">+91 93095 53235<br />+91 99708 09003</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-4 w-4 shrink-0 flex items-center justify-center mt-0.5"><i className="fas fa-envelope text-[#f39c12] text-sm"></i></div>
                  <span className="text-slate-400 text-sm leading-relaxed">sachinbangad2020@gmail.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-4 w-4 shrink-0 flex items-center justify-center mt-0.5"><i className="fas fa-clock text-[#f39c12] text-sm"></i></div>
                  <span className="text-slate-400 text-sm leading-relaxed">Mon–Sat: 11AM – 9PM<br />Sunday: 11AM – 5PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2026 Admissions Made Easy, Latur. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#privacy" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#refund" className="text-slate-500 hover:text-white text-sm transition-colors">Refund Policy</a>
              <a href="#terms" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Branded Floating Theme Toggle Switch */}
      <button
        onClick={() => setIsLightMode(!isLightMode)}
        className="fixed bottom-6 right-6 z-[10002] h-14 px-5 rounded-2xl bg-[#f39c12] text-black font-black text-xs uppercase tracking-wider shadow-2xl shadow-[#f39c12]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
      >
        {isLightMode ? "🌌 Dark Mode" : "☀️ Light Mode"}
      </button>
    </div>
  );
}
