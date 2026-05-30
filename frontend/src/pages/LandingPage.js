import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import {
  Loader2, Phone, Lock, User, ChevronRight,
  CheckCircle2, Star, ShieldCheck, Zap, BarChart3,
  Users, Trophy, GraduationCap, MapPin, PhoneCall,
  Headset, Database, LayoutDashboard, Search, FileText,
  Home, MessageSquare, Target
} from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────────────── */

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
  { name: "Devshetwar Shradha", college: "AIIMS" },
  { name: "Pawar Amruta", college: "AIIMS" },
  { name: "More Shriyash", college: "AIIMS" },
  { name: "Tarke Viraj", college: "AIIMS" },
  { name: "Kende Apurva", college: "AIIMS" },
  { name: "Sayed Uzma", college: "AIIMS" },
  { name: "More Aryan", college: "AIIMS" },
  { name: "Gaikwad Santosh", college: "AIIMS" },
  { name: "Pitlawar Rishikesh", college: "AIIMS" },
  { name: "Gaikwad Siddhi", college: "AIIMS" },
  { name: "Mane Avadhut", college: "AIIMS" },
  { name: "Irlod Revanth", college: "AIIMS" },
  { name: "Raut Shreyash", college: "AIIMS" },
  { name: "Bhandari Shreyas", college: "AIIMS" },
  { name: "Yadav Siddhi", college: "AIIMS" },
  { name: "Mahato Ishika", college: "AIIMS" },
  { name: "Budde Kartik", college: "AIIMS" },
  { name: "Kurandale Kunal", college: "AIIMS" },
  { name: "Deshpande Aditi", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Kubade Swanandini", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Yadav Sairaj", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Malani Janhavi", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Budhivant Soham", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Waghmare Siddhi", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Pachpinde Suyash", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Chougule Shrikant", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Alame Shantanu", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Drona Pradeep", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Dhavale Saisha", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Shinde Siddhesh", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Karpe Deepashri", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Kokare Manish", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Mhatre Rahul", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Karlewad Pratik", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Suradkar Vedant", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Kature Kartikey", college: "Seth GSMC (KEM), Mumbai" },
  { name: "Jaiswal Krishkumar", college: "Seth GSMC (KEM), Mumbai" },
];

const ENG_ACHIEVERS = [
  { name: "Gitte Prashant", college: "IIT Bombay" },
  { name: "Chavan Vishwavardhan", college: "IIT Kharagpur" },
  { name: "Agrawal Ronak", college: "IIT Delhi" },
  { name: "Narache Atharv", college: "IIT Kanpur" },
  { name: "Kulkarni Madhusudan", college: "IIT Madras" },
  { name: "Giri Namdev", college: "IIT Madras" },
  { name: "Wange Atharva", college: "IIT Kanpur" },
  { name: "Bajoria Tanishq", college: "IIT Kharagpur" },
  { name: "Bejgamwar Kaustubh", college: "NIT Rourkela" },
  { name: "Kurulekar Vedant", college: "IIT Dharwad" },
  { name: "Rathi Gaurav", college: "IIT Roorkee" },
  { name: "Mulla Ismail", college: "NIT Agartala" },
  { name: "Kasle Janhavi", college: "IIT Patna" },
  { name: "Patil Anmol", college: "IIIT Jabalpur" },
  { name: "Agrawal Mahek", college: "IIT BHU" },
  { name: "Jogdand Pranav", college: "IIIT Gwalior" },
  { name: "Kulkarni Gayatri", college: "IIT Guwahati" },
  { name: "Bachpalle Veer", college: "IIIT Gwalior" },
  { name: "Chame Aryan", college: "IIIT Nagpur" },
  { name: "Modani Krish", college: "IIIT Kurnool" },
  { name: "Jadhav Mahesh", college: "IIIT Kottayam" },
  { name: "Patil Aditya", college: "IIIT Raichur" },
  { name: "Varma Viraj", college: "IIT, Goa" },
  { name: "Sathe Shivasmita", college: "IIIT Pune" },
  { name: "Mahajan Shashwat", college: "COEP, Pune" },
  { name: "Jogdand Praniti", college: "COEP, Pune" },
  { name: "Rathod Krishna", college: "SGGS, Nanded" },
  { name: "Shetiya Riddhi", college: "SGGS, Nanded" },
  { name: "Wankhede Sharvil", college: "VIT Vellore" },
  { name: "Nigade Pratham", college: "SRM University" },
  { name: "Deshmukh Sujal", college: "COEP, Pune" },
  { name: "Patil Roshan", college: "PICT, Pune" },
  { name: "Waghmare Swaraj", college: "PICT, Pune" },
  { name: "Dube Yash", college: "VIT, Pune" },
  { name: "Sontakke Indrayani", college: "WCOE, Sangli" },
  { name: "Khalse Janhvi", college: "WCOE, Sangli" },
  { name: "Suwarnakar Rudra", college: "PCCOE, Pune" },
];

const MED_PROCESS = [
  { num: "01", title: "Register on CET Cell Portal", desc: "Create login, fill personal details, pay registration fee on cetcell.mahacet.org.", icon: "fa-user-plus" },
  { num: "02", title: "Upload Documents", desc: "Submit caste certificate, domicile, income proof, NEET scorecard, and photographs for verification.", icon: "fa-file-upload" },
  { num: "03", title: "Choice Filling", desc: "Fill and prioritize college preferences across all Maharashtra medical colleges — strategy matters here.", icon: "fa-list-ol" },
  { num: "04", title: "Mock Allotment", desc: "Preview expected allotment based on current choices. Revise your preference list before final lock.", icon: "fa-eye" },
  { num: "05", title: "CAP Rounds 1 · 2 · 3", desc: "Seats allocated in multiple rounds. Report to allotted college with original documents within deadline.", icon: "fa-graduation-cap" },
  { num: "06", title: "Online Stray Round", desc: "Final round for remaining vacant seats — last opportunity to secure an allotment.", icon: "fa-search" },
  { num: "07", title: "Final Reporting & Fee Payment", desc: "Submit all original documents at college and complete fee payment to confirm your admission.", icon: "fa-check-circle" },
];

const ENG_PROCESS = [
  { num: "01", title: "JEE Main / Advanced Results", desc: "Your rank and category determine eligibility: JEE Advanced → IITs, JEE Main → NITs / IIITs / GFTIs.", icon: "fa-chart-bar" },
  { num: "02", title: "JOSAA Registration", desc: "Register on josaa.nic.in within the window. Pay registration fee and fill your details accurately.", icon: "fa-user-plus" },
  { num: "03", title: "Choice Filling & Mock Allotments", desc: "Add institute + branch preferences. Use Mock Allotments 1 & 2 to refine your list before auto-lock.", icon: "fa-list-ol" },
  { num: "04", title: "Rounds 1–6 Allotment (SAF)", desc: "Seats allocated across 6 rounds. Accept by paying Seat Acceptance Fee (SAF) and uploading documents online.", icon: "fa-file-invoice-dollar" },
  { num: "05", title: "Willingness: Freeze / Slide / Float", desc: "Freeze = keep seat. Slide = better branch, same institute. Float = better institute in next round.", icon: "fa-random" },
  { num: "06", title: "CSAB & Online Stray Rounds", desc: "After JOSAA closes, CSAB conducts additional rounds for vacant NIT+ and CFTI seats across India.", icon: "fa-sync" },
  { num: "07", title: "Physical Reporting at Institute", desc: "Report to institute with all original documents. Pay tuition and hostel fees to confirm admission.", icon: "fa-check-circle" },
];

const BRANCHES = [
  {
    city: "Latur", cityMar: "लातूर", isMain: true,
    address: "Ground Floor, Vishwa Travels Office, Near Udyog Bhavan Complex, Beside Jijaau Girls Hostel, Shivaji Nagar, Latur",
    phones: ["+91 93095 53235", "+91 99708 09003"],
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.418689429285!2d76.5646061!3d18.3969362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcf83c1ef3fffff%3A0xd8ab805ccd1ed7ab!2sAdmissions%20Made%20Easy!5e0!3m2!1sen!2sin!4v1712061121234"
  },
  {
    city: "Pune", cityMar: "पुणे",
    address: "Shop No 10 & 11, Ground Floor, Elora Shopee, Indrayani Nagar,Bhosari, Pune, Pimpri-Chinchwad, Maharashtra 411039",
    phones: ["+91 80878 13700", "+91 96654 75432"]
  },
  {
    city: "Kolhapur", cityMar: "कोल्हापूर",
    address: "Shop No. 2,The Hub Apartment, 4th Lane, Below Homocare Hospital, Shahupuri, Kolhapur",
    phones: ["+91 88550 85858"]
  },
  {
    city: "Nanded", cityMar: "नांदेड",
    address: "Near Bhagyanagar Corner,Opposite to IIB Classes, Inside Hostel Campus Gate, Patnurkar Nagar, Nanded",
    phones: ["+91 89830 01441", "+91 77988 09365"]
  },
  {
    city: "Solapur", cityMar: "सोलापूर",
    address: "Yogeshwar Net Cafe, 28 Nath Plaza, Railway Station Road, Near Yatri Hotel, Solapur",
    phones: ["+91 99237 54628"]
  }
];

/* ─── PORTAL PREVIEW CARDS ────────────────────────────────────────────── */

const PortalPreview = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const ecosystemFeatures = [
    {
      title: "Real-time Updates",
      desc: "Get instant notifications on counseling schedules and choice filling dates.",
      icon: <Home className="h-6 w-6" />,
      type: 'updates'
    },
    {
      title: "Community & Expert Chats",
      desc: "Discuss with thousands of aspirants or get 1-on-1 expert guidance.",
      icon: <MessageSquare className="h-6 w-6" />,
      type: 'chats'
    },
    {
      title: "Precision Predictor",
      desc: "Our core engine analyzes your rank to predict your admission chance.",
      icon: <Target className="h-6 w-6" />,
      type: 'predictor'
    },
    {
      title: "AME Digital Portal",
      desc: "Your unified hub for all admission tools, predictors, and real-time tracking.",
      icon: <LayoutDashboard className="h-6 w-6" />,
      type: 'dashboard'
    },
    {
      title: "Student Profile",
      desc: "Manage your documents and track your application status securely.",
      icon: <User className="h-6 w-6" />,
      type: 'profile'
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ecosystemFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, ecosystemFeatures.length]);

  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector('.lp-portal-card').offsetWidth;
      scrollRef.current.scrollTo({
        left: activeIndex * (cardWidth + 32),
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const renderMockUI = (type) => {
    const content = (() => {
      switch (type) {
        case 'updates':
          return (
            <div className="space-y-2 sm:space-y-2.5">
              {[
                { title: "Maharashtra NEET State Merit List 2025", type: "Urgent", color: "amber", time: "2m ago" },
                { title: "AIIMS New Delhi Reporting Schedule", type: "Update", color: "cyan", time: "1h ago" },
                { title: "MCC Round 2 Choice Filling Starts", type: "News", color: "emerald", time: "3h ago" },
                { title: "Deemed University Fee Structure Update", type: "Fee", color: "rose", time: "5h ago" },
                { title: "Ayush Counselling Registration Date", type: "Ayush", color: "purple", time: "Yesterday" }
              ].map((news, i) => (
                <div key={i} className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/5 flex gap-2 sm:gap-3 hover:bg-white/10 transition-all">
                  <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-${news.color}-500/10 flex items-center justify-center text-${news.color}-500 shrink-0`}><Zap size={12} className="sm:h-[14px] sm:w-[14px]" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className={`text-[8px] font-black text-${news.color}-500 uppercase tracking-widest`}>{news.type}</span>
                      <span className="text-[7px] text-slate-500 font-bold">{news.time}</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-white font-bold truncate">{news.title}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        case 'chats':
          return (
            <div className="space-y-2.5 sm:space-y-4 h-full flex flex-col justify-between">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[8px] sm:text-[9px] font-black text-amber-500 uppercase tracking-widest ml-1">Sachin Bangad (Expert)</span>
                <div className="p-2 sm:p-3.5 bg-amber-500/5 border border-amber-500/30 rounded-xl sm:rounded-2xl text-[11px] sm:text-[12px] font-bold text-slate-100 rounded-tl-none max-w-[95%]">Hello Vikrant! GMC Mumbai cutoff was 685 in Round 1. We expect a slight drop in Round 2.</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest mr-1">Vikrant (Student)</span>
                <div className="p-2 sm:p-3.5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-[11px] sm:text-[12px] font-bold text-slate-300 rounded-tr-none max-w-[95%]">Thanks sir! Should I wait for Round 2 or take BJMC Pune?</div>
              </div>
              <div className="flex flex-col items-start gap-1">
                <div className="p-2 bg-amber-500/5 border border-amber-500/20 rounded-xl sm:rounded-2xl text-[11px] sm:text-[12px] font-bold text-slate-100 rounded-tl-none max-w-[95%]">Based on your rank, BJMC Pune is a safe bet, but wait for R2 GMC Mumbai.</div>
              </div>
              <div className="mt-1 sm:mt-auto flex items-center gap-2 px-2 text-cyan-500 shrink-0">
                <div className="flex gap-1">
                  <div className="h-1 w-1 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="h-1 w-1 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="h-1 w-1 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-60">Expert is typing...</span>
              </div>
            </div>
          );
        case 'predictor':
          return (
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-2 sm:mb-4 shrink-0">
                <div className="bg-cyan-500/10 border border-cyan-500/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest block">Predicted Rank</span>
                  <span className="text-xs sm:text-sm font-black text-white">1,245 - 1,420</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Data Confidence</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-500">98.4%</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center py-1 sm:py-2">
                <div className="relative h-32 w-32 sm:h-44 sm:w-44 flex items-center justify-center shrink-0">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="42%" className="stroke-white/5 fill-none" strokeWidth="6" />
                    <circle cx="50%" cy="50%" r="42%" className="stroke-cyan-500 fill-none drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" strokeWidth="6" strokeDasharray="263" strokeDashoffset={263 * 0.08} strokeLinecap="round" />
                  </svg>
                  <div className="text-center z-10 flex flex-col items-center">
                    <span className="text-3xl sm:text-[3.5rem] font-black text-white drop-shadow-lg leading-none">92%</span>
                    <p className="text-[8px] sm:text-[10px] font-black text-cyan-500 uppercase tracking-widest mt-1 sm:mt-2">Probability</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-4 shrink-0">
                <div className="p-2 sm:p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Dream College</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-white">GMC Mumbai</span>
                </div>
                <div className="p-2 sm:p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Safety College</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-white">BJMC Pune</span>
                </div>
              </div>
            </div>
          );
        case 'dashboard':
          return (
            <div className="space-y-2.5 sm:space-y-4 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between px-2 mb-1 shrink-0">
                <div>
                  <h4 className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Hub</h4>
                  <p className="text-xs sm:text-sm font-black text-white">Welcome Back, Vikrant</p>
                </div>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Database size={12} className="text-amber-500 sm:h-[14px] sm:w-[14px]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1">
                {[
                  { label: "Predictor", icon: <Target size={14} />, color: "cyan" },
                  { label: "Features", icon: <BarChart3 size={14} />, color: "amber" },
                  { label: "Choice List", icon: <FileText size={14} />, color: "emerald" },
                  { label: "Community", icon: <Users size={14} />, color: "purple" }
                ].map((item, i) => (
                  <div key={i} className="p-2 sm:p-3 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-1 sm:gap-2 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-500 group-hover:scale-105 transition-transform`}>
                      {item.icon}
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-300">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-between shrink-0">
                <span className="text-[8px] sm:text-[9px] font-black text-cyan-500 uppercase tracking-widest">Active Counselling</span>
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map(i => <div key={i} className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border border-[#01040a] bg-slate-800" />)}
                </div>
              </div>
            </div>
          );
        case 'cutoffs':
          return (
            <div className="space-y-2">
              <div className="grid grid-cols-4 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                <span className="col-span-2">College</span><span className="text-center">R1</span><span className="text-right">Trend</span>
              </div>
              {[
                { name: "Grant Medical College, Mumbai", r1: 685, trend: "up", color: "emerald" },
                { name: "BJ Medical College, Pune", r1: 672, trend: "down", color: "rose" },
                { name: "LTMC Sion, Mumbai", r1: 668, trend: "stable", color: "cyan" },
                { name: "GMC Nagpur", r1: 645, trend: "down", color: "rose" },
                { name: "Topiwala National, Mumbai", r1: 662, trend: "up", color: "emerald" },
                { name: "Indira Gandhi GMC, Nagpur", r1: 638, trend: "down", color: "rose" }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-4 p-2.5 bg-white/5 rounded-xl border border-white/5 text-[11px] font-bold text-slate-300">
                  <span className="col-span-2 truncate">{row.name}</span>
                  <span className="text-cyan-500 text-center">{row.r1}</span>
                  <span className={`text-right text-${row.color}-500`}>
                    {row.trend === 'up' ? '▲' : row.trend === 'down' ? '▼' : '●'}
                  </span>
                </div>
              ))}
              <div className="text-center mt-2">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Showing 6 of 450+ Colleges</span>
              </div>
            </div>
          );
        case 'profile':
          return (
            <div className="space-y-3.5 sm:space-y-6 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center relative">
                  <User size={20} className="text-amber-500 sm:h-7 sm:w-7" />
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 bg-emerald-500 rounded-full border border-[#01040a] flex items-center justify-center text-[8px] sm:text-[10px] text-white font-bold">✓</div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-lg font-black text-white leading-none">Vikrant Patil</h4>
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 sm:mt-1.5">NEET Score: 685 | Rank: 1,245</p>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3 shrink-0">
                <div className="flex justify-between text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Document Status</span>
                  <span className="text-amber-500">80% Verified</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[80%] bg-amber-500 shadow-[0_0_15px_rgba(243,156,18,0.5)]" />
                </div>
              </div>
              <div className="flex-1 space-y-1.5 sm:space-y-2 mt-1 sm:mt-2">
                <span className="text-[8px] sm:text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Recent Activity</span>
                {[
                  { act: "Choice List Updated", time: "1h ago" },
                  { act: "Caste Certificate Verified", time: "4h ago" },
                  { act: "GMC Mumbai Prediction Viewed", time: "Yesterday" }
                ].map((act, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-white/[0.02] border border-white/5 rounded-lg text-[9px] sm:text-[10px]">
                    <span className="font-bold text-slate-300 truncate max-w-[150px] sm:max-w-none">{act.act}</span>
                    <span className="text-slate-500 font-medium shrink-0 ml-1">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        default: return null;
      }
    })();

    return (
      <div className="lp-hologram-stage">
        <div className="lp-hologram-scanlines" />
        <div className="lp-hologram-content">
          {content}
        </div>
        <div className="lp-hologram-beam" />
      </div>
    );
  };

  return (
    <section id="lp-portal-preview" className={`lp-portal-preview ${isLightMode ? 'light-mode' : ''}`}>
      <div className="lp-container">
        <div className="lp-section-title">
          <h2 style={isLightMode ? { color: '#0f172a' } : { color: '#fff' }}>Experience Our Digital Portal</h2>
          <p style={isLightMode ? { color: '#64748b' } : { color: 'rgba(255,255,255,0.6)' }}>Everything you need for a stress-free admission process, now in your pocket.</p>
        </div>

        {/* Branded Premium Mode Toggle Switcher */}
        <div className="flex justify-center mb-8">
          <div 
            className="flex p-1 rounded-2xl border transition-all duration-300 gap-1 shadow-2xl shrink-0" 
            style={isLightMode ? { backgroundColor: 'rgba(15,23,42,0.05)', borderColor: 'rgba(15,23,42,0.08)' } : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <button
              onClick={() => setIsLightMode(false)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${!isLightMode ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-[1.03]' : 'text-slate-400 hover:text-white'}`}
            >
              🌌 Dark Mode
            </button>
            <button
              onClick={() => setIsLightMode(true)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${isLightMode ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-[1.03]' : 'text-slate-500 hover:text-slate-900'}`}
            >
              ☀️ Light Mode
            </button>
          </div>
        </div>

        <div className="lp-portal-scroll-hint" style={isLightMode ? { color: '#475569', borderColor: 'rgba(15,23,42,0.1)', background: 'rgba(15,23,42,0.02)' } : {}}>Live Portal Showcase</div>
        <div className="lp-portal-grid-wrap">
          <div
            ref={scrollRef}
            className="lp-portal-grid"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {ecosystemFeatures.map((feature, idx) => (
              <div key={idx} className={`lp-portal-card ${activeIndex === idx ? 'active' : ''}`}>
                <div className="lp-portal-card-header">
                  <div className="lp-portal-icon-wrap" style={isLightMode ? { background: 'rgba(243,156,18,0.1)', color: '#f39c12' } : {}}>{feature.icon}</div>
                  <h3 style={isLightMode ? { color: '#0f172a', marginTop: '1rem' } : { marginTop: '1rem' }}>{feature.title}</h3>
                  <p style={isLightMode ? { color: '#64748b' } : {}}>{feature.desc}</p>
                </div>
                {renderMockUI(feature.type)}
                <button
                  onClick={() => navigate('/public-login')}
                  className="lp-portal-btn"
                >
                  Explore in Portal <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            onClick={() => navigate('/public-login')}
            className="lp-hero-btn-primary"
            style={{ padding: '1rem 4rem' }}
          >
            Join 17,500+ Students <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

const StudentCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = 15;
  const timerRef = useRef(null);
  const images = Array.from({ length: totalSlides }, (_, i) => `/landing-assets/images/students/01-1-images-${i}.jpg`);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    if (!isPaused) timerRef.current = setInterval(nextSlide, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [nextSlide, isPaused]);

  const stats = [
    { label: "AIIMS", value: "33", icon: "🏥" },
    { label: "AFMC", value: "01", icon: "🎖️" },
    { label: "Govt MBBS", value: "447", icon: "🏛️" },
    { label: "Semi-Govt", value: "297", icon: "🏫" },
    { label: "Deemed", value: "165", icon: "🎓" },
    { label: "Other Private", value: "138", icon: "🌐" },
  ];

  return (
    <section id="lp-students" className="lp-students-section" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="lp-container">
        <div className="lp-section-title">
          <h2>Our Allotted Students — NEET 2025</h2>
        </div>
        <p className="lp-students-tagline">1080+ विद्यार्थ्यांचे हार्दिक अभिनंदन!</p>
        <div className="lp-carousel-wrapper">
          <div className="lp-carousel-badge">{currentIndex + 1} / {totalSlides}</div>
          <button className="lp-carousel-btn lp-carousel-btn-prev" onClick={prevSlide} aria-label="Previous Slide"><i className="fas fa-chevron-left"></i></button>
          <button className="lp-carousel-btn lp-carousel-btn-next" onClick={nextSlide} aria-label="Next Slide"><i className="fas fa-chevron-right"></i></button>
          <div className="lp-carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {images.map((src, idx) => (
              <div className="lp-carousel-slide" key={idx}>
                <img src={src} alt={`Batch ${idx + 1}`} loading={idx === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>
        <div className="lp-carousel-dots">
          {images.map((_, idx) => (
            <button key={idx} className={`lp-carousel-dot ${currentIndex === idx ? "active" : ""}`} onClick={() => setCurrentIndex(idx)} aria-label={`Go to slide ${idx + 1}`} />
          ))}
        </div>
        <div className="lp-allot-stats">
          {stats.map((s, i) => (
            <div className="lp-allot-stat" key={i}>
              <span className="lp-allot-stat-icon">{s.icon}</span>
              <span className="lp-allot-stat-num">{s.value}</span>
              <span className="lp-allot-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── MAIN PAGE ─────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [processTab, setProcessTab] = useState("medical");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(window.location.hash || '#lp-home');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [ticker, setTicker] = useState({ text: "", link: "" });

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api/public/ticker`);
        const data = await response.json();
        setTicker(data);
      } catch (err) {
        console.error("Ticker fetch failed");
      }
    };
    fetchTicker();
  }, []);

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

  const handleTabClick = (e, target, isExternal = false) => {
    e.preventDefault();
    setIsLoading(true);

    const delay = isExternal ? 800 : 600;

    setTimeout(() => {
      if (isExternal) {
        navigate(target);
      } else {
        setIsLoading(false);
        setActiveTab(target);
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, delay);
  };

  // Sync active tab with hash on mount and popstate
  useEffect(() => {
    const syncTab = () => {
      const hash = window.location.hash;
      if (hash) {
        setActiveTab(hash);
        // Delay scroll to allow content to render
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
      }
    };
    syncTab();
    window.addEventListener('popstate', syncTab);
    return () => window.removeEventListener('popstate', syncTab);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isNavOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isNavOpen]);

  useEffect(() => {
    const statsSection = document.querySelector(".lp-stats");
    const statNumbers = document.querySelectorAll(".lp-stat-number");
    let started = false;
    function startCount(el) {
      const target = +el.getAttribute("data-target");
      const hasPlus = el.innerText.includes("+");
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      const updateCount = () => {
        current += increment;
        if (current < target) { el.innerText = Math.ceil(current).toLocaleString() + (hasPlus ? "+" : ""); requestAnimationFrame(updateCount); }
        else { el.innerText = target.toLocaleString() + (hasPlus ? "+" : ""); }
      };
      updateCount();
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) { statNumbers.forEach((num) => startCount(num)); started = true; }
    }, { threshold: 0.5 });
    if (statsSection) observer.observe(statsSection);
    return () => { observer.disconnect(); };
  }, []);

  const dupEngAchievers = [...ENG_ACHIEVERS, ...ENG_ACHIEVERS];

  return (
    <>
      <Helmet>
        <title>Admissions Made Easy | Best NEET & Engineering Counselling in Maharashtra</title>
        <meta name="description" content="Expert medical & engineering admissions counselling. Specializing in NEET (MBBS, BDS, BAMS) & JEE admissions guidance with 15+ years of excellence." />
        <link rel="canonical" href="https://admissionsmadeeasy.in/" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Admissions Made Easy",
              "url": "https://admissionsmadeeasy.in",
              "logo": "https://admissionsmadeeasy.in/landing-assets/images/branding/logo1.png",
              "description": "Expert Medical & Engineering admissions counselling portal for NEET, JEE and CET aspirants.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Latur",
                "addressRegion": "Maharashtra",
                "addressCountry": "IN"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "17500"
              }
            }
          `}
        </script>
      </Helmet>

      <style>{`
        /* ===== GLOBAL RESET & MOBILE-FIRST ===== */
        .lp-root { all: unset; display: block; font-size: 16px; }
        .lp-root *:not(.fas):not(.fab):not(.far):not(.fal):not(.fad):not([class^="fa-"]),
        .lp-root *:not(.fas):not(.fab):not(.far):not(.fal):not(.fad):not([class^="fa-"])::before,
        .lp-root *:not(.fas):not(.fab):not(.far):not(.fal):not(.fad):not([class^="fa-"])::after {
          box-sizing: border-box;
          font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
        }
        .lp-root { background-color: #f8f9fa; color: #2c3e50; line-height: 1.6; min-height: 100vh; -webkit-font-smoothing: antialiased; overflow-x: hidden; width: 100%; }
        .lp-container { width: 92%; max-width: 1200px; margin: 0 auto; position: relative; }
        @media (min-width: 1300px) { .lp-container { width: 95%; max-width: 1400px; } }

        /* ---- HEADER ---- */
        .lp-header { position: sticky; top: 0; left: 0; width: 100%; z-index: 1000; background: #1a1a2e; height: 5.5rem; display: flex; align-items: center; box-shadow: 0 0.125rem 0.625rem rgba(0,0,0,0.3); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        @media (max-width: 767px) { .lp-header { display: none; } }

        /* ---- MOBILE BOTTOM TAB BAR ---- */
        .lp-bottom-nav { display: none; }
        @media (max-width: 767px) {
          .lp-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(15, 23, 42, 0.97);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid rgba(243,156,18,0.25);
            border-radius: 20px 20px 0 0;
            box-shadow: 0 -8px 32px rgba(0,0,0,0.45), 0 -1px 0 rgba(243,156,18,0.15);
            padding: 0.5rem 0.5rem calc(0.5rem + env(safe-area-inset-bottom, 0px));
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            align-items: center;
            gap: 0;
          }
          .lp-bottom-nav::-webkit-scrollbar { display: none; }
          .lp-bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.3rem;
            padding: 0.5rem 1rem;
            background: none;
            border: none;
            cursor: pointer;
            text-decoration: none;
            color: rgba(255,255,255,0.4);
            font-family: inherit;
            font-size: 0;
            transition: all 0.25s ease;
            flex: 0 0 auto;
            min-width: 68px;
            min-height: 56px;
            position: relative;
            border-radius: 12px;
          }
          .lp-bottom-nav-item::before {
            content: '';
            position: absolute;
            top: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 3px;
            background: #f39c12;
            border-radius: 0 0 4px 4px;
            transition: width 0.25s ease;
            box-shadow: 0 0 8px rgba(243,156,18,0.6);
          }
          .lp-bottom-nav-item.active {
            color: #f39c12;
            background: rgba(243,156,18,0.08);
          }
          .lp-bottom-nav-item.active::before { width: 24px; }
          .lp-bottom-nav-item:hover {
            color: rgba(255,255,255,0.85);
            background: rgba(255,255,255,0.05);
          }
          .lp-bottom-nav-icon {
            font-size: 1.3rem;
            line-height: 1;
            display: block;
            text-align: center;
            transition: transform 0.2s ease;
          }
          .lp-bottom-nav-item.active .lp-bottom-nav-icon {
            filter: drop-shadow(0 0 6px rgba(243,156,18,0.5));
            transform: translateY(-1px);
          }
          .lp-bottom-nav-label {
            font-size: 0.58rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            display: block;
            line-height: 1.2;
            text-align: center;
            white-space: nowrap;
            text-transform: uppercase;
          }
          /* push page content so it doesn't hide behind the tab bar */
          .lp-root { padding-bottom: 72px; }
        }
        .lp-header-content { display: flex; align-items: center; width: 100%; gap: 0.75rem; justify-content: space-between; position: relative; }
        .lp-header-right { display: flex; order: 2; align-items: center; gap: 0.5rem; }
        .lp-branding { flex-shrink: 1; z-index: 10; order: 1; min-width: 0; overflow: hidden; }
        .lp-brand-logo { height: 3.5rem; width: auto; display: block; object-fit: contain; transition: height 0.3s ease; max-width: 100%; }
        @media (max-width: 767px) { .lp-brand-logo { height: 2.4rem; } }
        @media (max-width: 480px) { .lp-brand-logo { height: 2.1rem; } }

        /* ---- MOBILE NAV ---- */
        .lp-nav { position: fixed; top: 0; right: 0; width: 80%; max-width: 320px; height: 100vh; background: rgba(13,27,42,0.98); backdrop-filter: blur(15px); transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); padding: 6rem 2rem; z-index: 999; display: flex; flex-direction: column; visibility: hidden; }
        .lp-nav.lp-nav-active { transform: translateX(0); visibility: visible; }
        .lp-nav ul { display: flex; flex-direction: column; gap: 1.5rem; list-style: none; padding: 0; margin: 0; }
        .lp-nav li a, .lp-nav li button { color: #fff; text-decoration: none; font-weight: 600; font-size: 1.25rem; display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; min-height: 48px; }
        .lp-mobile-toggle { display: flex; align-items: center; justify-content: center; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0.5rem; min-width: 44px; min-height: 44px; z-index: 1001; order: 3; }
        @media (max-width: 480px) { .lp-mobile-toggle { min-width: 36px; min-height: 36px; font-size: 1.25rem; } }
        .lp-nav-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 998; backdrop-filter: blur(2px); }
        .lp-nav-backdrop.lp-nav-backdrop-active { display: block; }
        .lp-helpline-btn { display: flex; align-items: center; order: 2; }
        @media (max-width: 1199px) { .lp-helpline-btn { margin-left: 0.25rem; } }
        @media (max-width: 767px) { .lp-helpline-btn { margin-left: auto; margin-right: 0.25rem; } }

        /* ---- DESKTOP NAV (Enhanced Responsiveness) ---- */
        @media (min-width: 1300px) {
          .lp-mobile-toggle { display: none; }
          .lp-nav-backdrop { display: none !important; }
          .lp-header-content { display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; align-items: center; justify-content: stretch; }
          .lp-branding { order: 1; }
          .lp-nav { position: static; width: auto; height: auto; max-width: none; transform: none; background: transparent; padding: 0; display: flex; justify-self: end; visibility: visible; order: 2; }
          .lp-header-right { display: flex; justify-self: end; order: 3; margin-left: 1rem; }
          .lp-nav ul { flex-direction: row; gap: 0.15rem; }
          /* Hide icons at 1300px to keep items from overflowing */
          .lp-nav li a i, .lp-nav li button i { display: none; }
          .lp-nav li a, .lp-nav li button { font-size: 0.72rem; padding: 0.5rem 0.2rem; color: rgba(255,255,255,0.9); white-space: nowrap; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          .lp-nav li a:hover, .lp-nav li button:hover { color: #f39c12; }
          /* Normalize gold button for desktop bar consistency */
          .lp-nav li button[style*="color: #f39c12"], 
          .lp-nav li button[style*="color: rgb(243, 156, 18)"] { color: rgba(255,255,255,0.9) !important; }
          .lp-nav li button[style*="color: #f39c12"]:hover,
          .lp-nav li button[style*="color: rgb(243, 156, 18)"]:hover { color: #f39c12 !important; }
          .lp-helpline-btn { font-size: 0.72rem; padding: 4px 10px; gap: 6px; }
          .lp-helpline-text { align-items: flex-end; }
          .lp-helpline-number { font-size: 0.85rem; font-weight: 800; }
          .lp-phone-icon { width: 28px; height: 28px; font-size: 13px; }
        }
        @media (min-width: 1400px) {
          .lp-nav ul { gap: 0.25rem; }
          .lp-nav li a, .lp-nav li button { font-size: 0.8rem; padding: 0.5rem 0.4rem; }
          .lp-nav li a i, .lp-nav li button i { display: inline-block; margin-right: 0.25rem; font-size: 0.8rem; }
        }
        @media (min-width: 1500px) {
          .lp-header-content { grid-template-columns: 280px 1fr 280px; gap: 1rem; }
          .lp-nav ul { gap: 1rem; }
          .lp-nav li a, .lp-nav li button { font-size: 0.85rem; padding: 0.5rem 0.65rem; }
          .lp-helpline-btn { font-size: 0.95rem; padding: 8px 22px; gap: 12px; border-width: 1.5px; }
          .lp-helpline-number { font-size: 1.1rem; font-weight: 800; }
          .lp-phone-icon { width: 38px; height: 38px; font-size: 18px; }
        }

        /* ---- HELPLINE BTN ---- */
        .lp-helpline-btn { background: rgba(255,255,255,0.1); color: white; padding: 8px 20px; border-radius: 50px; text-decoration: none; display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.2); animation: lp-pulseGlow 3s infinite; white-space: nowrap; }
        @keyframes lp-pulseGlow {
          0%   { box-shadow: 0 0 5px rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
          50%  { box-shadow: 0 0 20px rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.4); }
          100% { box-shadow: 0 0 5px rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        }
        .lp-helpline-btn:hover { transform: translateY(-2px); background: rgba(255,255,255,0.15); border-color: #f1c40f; }
        .lp-phone-icon { width: 36px; height: 36px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1a1a1a; font-size: 18px; transform: scaleX(-1); flex-shrink: 0; }
        @media (max-width: 767px) { .lp-phone-icon { width: 30px; height: 30px; font-size: 15px; } }
        .lp-helpline-label { font-size: 0.7rem; opacity: 0.8; font-weight: 600; text-transform: uppercase; }
        .lp-helpline-number { font-size: 1rem; font-weight: 800; letter-spacing: 0.5px; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.2); }
        @media (max-width: 991px) { 
          .lp-helpline-text { display: flex; align-items: flex-start; text-align: left; margin-left: 10px; } 
          .lp-helpline-number { font-size: 0.85rem; }
          .lp-helpline-label { font-size: 0.6rem; }
          .lp-helpline-btn { padding: 4px 12px; border-radius: 30px; }
          .lp-phone-icon { order: -1; width: 28px; height: 28px; font-size: 13px; }
        }
        @media (max-width: 480px) {
          .lp-helpline-label { display: none; }
          .lp-helpline-number { font-size: 0.75rem; }
          .lp-helpline-btn { padding: 4px 8px; gap: 6px; }
          .lp-brand-logo { height: 1.8rem; }
        }
        @media (max-width: 360px) {
          .lp-branding { max-width: 120px; }
          .lp-helpline-number { font-size: 0.7rem; }
        }

        /* ---- WHATSAPP BAR ---- */
        .lp-whatsapp-bar { display: flex; align-items: center; justify-content: center; width: 100%; padding: 16px 20px; font-size: 1.2rem; font-weight: 700; text-decoration: none; color: white; background: linear-gradient(90deg, #1ebe57, #128C7E); gap: 12px; letter-spacing: 0.5px; transition: filter 0.25s ease, letter-spacing 0.25s ease; border: none; cursor: pointer; min-height: 60px; }
        .lp-whatsapp-bar:hover { filter: brightness(1.1); letter-spacing: 1px; }
        .lp-whatsapp-bar i { font-size: 1.4rem; }

        /* ---- SECTIONS ---- */
        .lp-section { padding: clamp(3rem, 8vw, 5rem) 0; }
        .lp-section-title { text-align: center; margin-bottom: clamp(1.5rem, 5vw, 3rem); display: flex; flex-direction: column; align-items: center; }
        .lp-section-title h2 { font-size: clamp(1.5rem, 5vw, 2.5rem); color: #1a5276; position: relative; display: inline-block; padding-bottom: 15px; margin-bottom: 15px; }
        .lp-section-title h2::after { content: ''; position: absolute; width: 80px; height: 4px; background-color: #f39c12; bottom: 0; left: 50%; transform: translateX(-50%); }
        .lp-section-title p { max-width: 700px; margin: 0 auto; color: #95a5a6; font-size: clamp(0.95rem, 3vw, 1.1rem); }

        /* ---- HERO (Variant D — Minimal Centered) ---- */
        .lp-creative-hero { background: #0d1b38; min-height: 90vh; display: flex; flex-direction: column; position: relative; overflow: hidden; color: white; }
        .lp-creative-hero::before { content: ''; position: absolute; bottom: -10%; left: 50%; transform: translateX(-50%); width: 80%; height: 60%; background: radial-gradient(ellipse, rgba(243,156,18,0.10) 0%, transparent 65%); filter: blur(60px); z-index: 1; pointer-events: none; }
        .lp-creative-hero::after { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px); background-size: 72px 72px; z-index: 1; pointer-events: none; }
        .lp-hero-grid { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2.5rem 2rem 2rem; }
        .lp-hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(243,156,18,0.12); border: 1px solid rgba(243,156,18,0.3); color: #f39c12; padding: 0.45rem 1.1rem; border-radius: 50px; font-size: 0.78rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 1.75rem; }
        .lp-hero-pretitle { display: none; }
        .lp-hero-title { font-size: clamp(2.2rem, 8vw, 5rem); line-height: 1.3; font-weight: 900; color: #fff; letter-spacing: -1.5px; margin-bottom: 0.5rem; padding-top: 0.2rem; }
        .lp-hero-title-accent { font-size: 1em; line-height: 1.06; font-weight: 900; letter-spacing: -1.5px; display: inline-block; margin-left: 0.5rem; background: linear-gradient(90deg, #f59e0b, #fcd34d, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .lp-hero-subtitle { font-size: clamp(0.9rem, 2.5vw, 1.1rem); color: rgba(255,255,255,0.7); margin: 0 auto 2rem; max-width: 640px; line-height: 1.7; }
        @media (max-width: 767px) { .lp-hero-subtitle { max-width: 90%; } }
        .lp-hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem; }
        .lp-hero-btn-primary { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000 !important; font-weight: 800; font-size: 1.1rem; padding: 1.1rem 2.5rem; border-radius: 50px; cursor: pointer; border: none; font-family: inherit; box-shadow: 0 8px 28px rgba(245,158,11,0.4); transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem; white-space: nowrap; }
        .lp-hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(245,158,11,0.45); }
        .lp-hero-btn-ghost { background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.22); color: #fff !important; font-size: 1rem; font-weight: 600; padding: 1rem 2rem; border-radius: 50px; cursor: pointer; font-family: inherit; transition: background 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; }
        .lp-hero-btn-ghost:hover { background: rgba(255,255,255,0.12); }
        @media (max-width: 767px) {
          .lp-hero-actions { gap: 0.75rem; }
          .lp-hero-btn-primary { padding: 0.85rem 1.5rem; font-size: 1rem; }
          .lp-hero-btn-ghost { padding: 0.85rem 1.5rem; font-size: 0.95rem; }
        }
        @media (max-width: 600px) {
          .lp-hero-actions { flex-direction: column; width: 100%; max-width: 400px; margin: 0 auto 2rem; padding: 0 1rem; }
          .lp-hero-btn-primary, .lp-hero-btn-ghost { width: 100%; padding: 1rem; font-size: 0.95rem; white-space: normal; }
        }
        .lp-hero-stats-pill { display: flex; align-items: stretch; border: 1px solid rgba(255,255,255,0.09); border-radius: 1.25rem; background: rgba(255,255,255,0.04); backdrop-filter: blur(20px); overflow: hidden; flex-wrap: wrap; justify-content: center; }
        .lp-hero-stat-item { padding: 1.1rem 2rem; text-align: center; border-right: 1px solid rgba(255,255,255,0.09); }
        .lp-hero-stat-item:last-child { border-right: none; }
        .lp-hero-stat-n { font-size: 1.6rem; font-weight: 900; color: #f59e0b; line-height: 1; }
        .lp-hero-stat-l { font-size: 0.65rem; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-top: 0.3rem; }

        /* ---- PWA INSTALL BANNER ---- */
        .lp-pwa-banner { background: linear-gradient(90deg, #1e3a8a, #3b82f6); padding: 1.25rem 0; color: white; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .lp-pwa-content { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
        .lp-pwa-text-group { display: flex; align-items: center; gap: 1rem; }
        .lp-pwa-icon { font-size: 2rem; color: #facc15; animation: lp-bounce 2s infinite; }
        .lp-pwa-h4 { font-size: 1.1rem; font-weight: 800; margin: 0; }
        .lp-pwa-p { font-size: 0.85rem; opacity: 0.9; margin: 0; }
        .lp-pwa-btn { background: #fff; color: #1e40af !important; font-weight: 800; padding: 0.6rem 1.5rem; border-radius: 50px; border: none; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s; }
        .lp-pwa-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
        @keyframes lp-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @media (max-width: 767px) { 
          .lp-pwa-content { justify-content: center; text-align: center; gap: 1rem; }
          .lp-pwa-text-group { flex-direction: column; gap: 0.5rem; }
          .lp-pwa-btn { width: 100%; justify-content: center; }
        }
        .lp-hero-marathi { font-family: 'Mukta', sans-serif; font-weight: 700; letter-spacing: 0 !important; font-variant-ligatures: common-ligatures; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; }
        /* keep old classes inert */
        .lp-hero-content { width: 100%; }
        .lp-hero-visual { display: none; }
        .lp-hero-stats-card { display: none; }
        .lp-hero-circle-bg { display: none; }
        .lp-hero-founder-img { display: none; }
        /* trust bar - Ultra Compact Design */
        .lp-trust-card { position: relative; z-index: 2; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-top: 1px solid rgba(255,255,255,0.15); display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 0.75rem 2rem; justify-content: center; margin-top: 0; box-shadow: 0 -15px 40px rgba(0,0,0,0.3); backdrop-filter: blur(10px); }
        .lp-trust-layer-1 { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; width: 100%; max-width: 1100px; }
        .lp-trust-layer-2 { width: 100%; overflow: hidden; margin-top: 0.1rem; }
        .lp-trust-layer-separator { width: 80%; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); margin: 0.15rem 0; }
        @media (max-width: 1100px) { .lp-trust-layer-1 { gap: 1rem; } }
        @media (max-width: 991px) { .lp-trust-layer-1 { flex-direction: column; gap: 0.85rem; text-align: center; } .lp-trust-card { padding: 0.75rem 1rem; gap: 0.4rem; } }
        .lp-trust-rating-flex { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        .lp-trust-number { font-size: 1.5rem; font-weight: 900; color: #f39c12; line-height: 1; }
        .lp-trust-stars { color: #f39c12; font-size: 0.85rem; letter-spacing: 2px; margin-bottom: 0; }
        .lp-trust-review-count { font-size: 0.8rem; font-weight: 700; color: #fff; }
        .lp-trust-source { font-size: 0.7rem; color: rgba(255,255,255,0.5); }
        .lp-trust-locations-container { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; justify-content: center; flex: unset; }
        .lp-trust-locations-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0; }
        .lp-trust-location-tag { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.3rem 0.75rem; border-radius: 20px; font-size: 0.75rem; color: rgba(255,255,255,0.6); white-space: nowrap; display: inline-flex; align-items: center; gap: 0; }
        .lp-trust-location-tag::before { display: none; }
        .lp-trust-dot { display: none; }
        @keyframes lp-pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46,204,113,0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(46,204,113,0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46,204,113,0); } }
        .lp-trust-status { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); padding: 0.4rem 1rem; border-radius: 40px; font-size: 0.75rem; color: #10b981; display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 700; white-space: nowrap; transition: all 0.3s ease; }
        .lp-trust-status:hover { background: rgba(16,185,129,0.2); border-color: #10b981; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16,185,129,0.2); }
        @media (max-width: 1200px) { .lp-trust-card { padding: 1rem 1.5rem; } }

        /* ---- SERVICES ---- */
        .lp-services { background-color: white; }
        .lp-services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
        @media (min-width: 768px) { .lp-services-grid { gap: 1.2rem; } }
        @media (min-width: 1100px) { .lp-services-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; max-width: 1200px; margin: 0 auto; } }
        .lp-service-card { background: white; border-radius: 0.625rem; overflow: hidden; box-shadow: 0 0.3rem 1rem rgba(0,0,0,0.08); display: flex; flex-direction: column; }
        .lp-service-img { width: 100%; height: auto; background-size: cover; background-position: center; aspect-ratio: 16/9; }
        .lp-service-content { padding: 1rem; flex: 1; display: flex; flex-direction: column; }
        .lp-service-content h3 { font-size: 1.1rem; color: #1a5276; margin-bottom: 0.5rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; }
        .lp-btn-details { width: 100%; margin-top: auto; padding: 0.75rem; border-radius: 0.5rem; background: #f1f2f6; color: #1a5276; border: none; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .lp-btn-details:hover { background: #1a5276; color: white; }
        @media (max-width: 600px) { 
          .lp-service-content { padding: 0.75rem; }
          .lp-service-content h3 { font-size: 0.95rem; }
          .lp-service-content p { font-size: 0.8rem; line-height: 1.4; }
        }
        @media (min-width: 992px) {
          .lp-service-content h3 { font-size: 1.25rem; }
          .lp-service-content p { font-size: 0.95rem; }
        }

        /* ---- HANDBOOKS ---- */
        .lp-handbooks { background: linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%); }
        .lp-handbooks .lp-section-title h2 { color: #fff; }
        .lp-handbooks .lp-section-title h2::after { background: #f39c12; }
        .lp-handbooks .lp-section-title p { color: rgba(255,255,255,0.65); }
        .lp-handbooks-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 768px) { .lp-handbooks-grid { grid-template-columns: 1fr 1fr; } }
        .lp-handbook-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 1.25rem; overflow: hidden; display: flex; flex-direction: column; transition: all 0.3s ease; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .lp-handbook-card:hover { transform: translateY(-8px); border-color: rgba(243,156,18,0.5); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        .lp-handbook-cover { width: 100%; aspect-ratio: 4/3; position: relative; overflow: hidden; background: #000; }
        .lp-handbook-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .lp-handbook-body { padding: 1.75rem; flex: 1; display: flex; flex-direction: column; gap: 1.25rem; background: #1a2634; }
        .lp-handbook-label-title { font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 0.25rem; }
        .lp-handbook-authors { font-size: 0.9rem; color: rgba(255,255,255,0.9); line-height: 1.4; font-weight: 600; }
        .lp-handbook-branding { font-size: 0.75rem; color: rgba(255,255,255,0.45); margin-top: 0.2rem; }
        .lp-handbook-topics { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 0.5rem 0; }
        .lp-handbook-topic { background: rgba(243,156,18,0.05); border: 1px solid rgba(243,156,18,0.2); color: #f39c12; font-size: 0.7rem; font-weight: 700; padding: 0.35rem 0.8rem; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.3s; }
        .lp-handbook-topic:hover { background: rgba(243,156,18,0.15); border-color: #f39c12; }
        .lp-handbook-btns { display: flex; gap: 1rem; margin-top: auto; }
        .lp-handbook-btn { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.85rem 1.5rem; border-radius: 50px; font-weight: 700; font-size: 0.9rem; text-decoration: none; transition: all 0.3s; flex: 1; justify-content: center; }
        .lp-handbook-btn-primary { background: linear-gradient(135deg, #f39c12, #d35400); color: white; border: none; box-shadow: 0 4px 15px rgba(211, 84, 0, 0.3); }
        .lp-handbook-btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(211, 84, 0, 0.4); }
        .lp-handbook-btn-outline { background: transparent; border: 2px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); }
        .lp-handbook-btn-outline:hover { border-color: #f39c12; color: #f39c12; background: rgba(243,156,18,0.05); }

        /* ---- ABOUT ---- */
        .lp-about { background-color: #ecf0f1; }
        .lp-about-content { display: grid; grid-template-columns: 1fr; gap: 2rem; align-items: center; }
        @media (min-width: 768px) { .lp-about-content { grid-template-columns: 1fr 1fr; gap: clamp(1.5rem, 5vw, 3rem); } }
        .lp-about-badge { display: inline-block; background: #2e86c1; color: white; padding: 0.6rem 1.5rem; border-radius: 3rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 1.5rem; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(46,134,193,0.2); width: fit-content; }
        .lp-about-text h3 { font-size: clamp(1.5rem, 4vw, 2.2rem); color: #1a5276; margin-bottom: 1.5rem; font-weight: 800; }
        .lp-about-tagline { font-size: 0.85rem !important; color: #2e86c1 !important; font-weight: 700; margin-top: 5px !important; margin-bottom: 30px; letter-spacing: 1.5px; text-transform: uppercase; position: relative; display: inline-block; width: fit-content; }
        .lp-about-tagline::after { content: ''; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 40px; height: 3px; background: #f39c12; }
        .lp-results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-top: 2rem; }
        .lp-result-tag { background: white; padding: 1rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.05); border-bottom: 0.25rem solid #f39c12; }
        .lp-result-tag strong { display: block; font-size: 1.5rem; color: #1a5276; }
        .lp-result-tag span { font-size: 0.8rem; font-weight: 600; color: #777; text-transform: uppercase; }

        /* ---- PROCESS ---- */
        .lp-process { background: white; }
        .lp-process-tabs { display: flex; gap: 1rem; justify-content: center; margin-bottom: 2.5rem; flex-wrap: wrap; }
        .lp-process-tab { padding: 0.75rem 2rem; border-radius: 50px; border: 2px solid #1a5276; background: transparent; color: #1a5276; font-weight: 700; cursor: pointer; transition: all 0.3s; font-size: 0.95rem; font-family: inherit; }
        .lp-process-tab.active { background: linear-gradient(135deg, #1a5276, #2e86c1); color: white; border-color: transparent; box-shadow: 0 8px 20px rgba(46,134,193,0.3); }
        .lp-process-steps { display: grid; grid-template-columns: 1fr; gap: 0.75rem; max-width: 900px; margin: 0 auto; }
        @media (min-width: 768px) { .lp-process-steps { grid-template-columns: 1fr 1fr; } }
        .lp-process-step { display: flex; align-items: flex-start; gap: 1.25rem; padding: 1.25rem 1.5rem; background: #f8fbfc; border-radius: 1rem; border: 1px solid #e1e8ed; transition: all 0.3s; }
        .lp-process-step:hover { box-shadow: 0 10px 25px rgba(0,0,0,0.08); border-color: #2e86c1; transform: translateY(-2px); background: white; }
        .lp-process-num { width: 48px; height: 48px; min-width: 48px; background: linear-gradient(135deg, #1a5276, #2e86c1); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; }
        .lp-process-content h4 { font-size: 1rem; font-weight: 700; color: #1a5276; margin-bottom: 0.3rem; }
        .lp-process-content p { font-size: 0.85rem; color: #666; margin: 0; line-height: 1.5; }
        .lp-process-note { text-align: center; margin-top: 2rem; padding: 1.25rem 1.5rem; background: linear-gradient(135deg, rgba(243,156,18,0.1), rgba(211,84,0,0.05)); border: 1px solid rgba(243,156,18,0.3); border-radius: 1rem; }
        .lp-process-note p { color: #7d3c00; font-weight: 600; font-size: 0.95rem; margin: 0; }

        /* ---- STUDENTS CAROUSEL ---- */
        .lp-students-section { padding: 4rem 0 2rem; background: linear-gradient(160deg, #0d1b2a 0%, #1a3a5c 60%, #0d1b2a 100%); position: relative; overflow: hidden; }
        .lp-students-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(243,156,18,0.08) 0%, transparent 70%); pointer-events: none; }
        .lp-students-section .lp-section-title h2 { color: #fff; }
        .lp-students-section .lp-section-title h2::after { background: #f39c12; }
        .lp-students-tagline { color: rgba(255,255,255,0.75); font-size: 1.1rem; text-align: center; margin: -1.5rem 0 2rem; font-style: italic; letter-spacing: 0.5px; }
        .lp-carousel-wrapper { position: relative; width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); background: #000; }
        .lp-carousel-track { display: flex; transition: transform 0.55s cubic-bezier(0.77,0,0.175,1); will-change: transform; }
        .lp-carousel-slide { min-width: 100%; flex-shrink: 0; }
        .lp-carousel-slide img { width: 100%; height: auto; display: block; max-height: 82vh; object-fit: contain; background: #f5f0e8; }
        .lp-carousel-badge { position: absolute; top: 14px; right: 18px; background: rgba(0,0,0,0.55); backdrop-filter: blur(6px); color: #fff; font-size: 0.85rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2); z-index: 10; letter-spacing: 1px; }
        .lp-carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px); border: 2px solid rgba(255,255,255,0.3); color: #fff; width: 50px; height: 50px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .lp-carousel-btn:hover { background: rgba(243,156,18,0.8); border-color: #f39c12; transform: translateY(-50%) scale(1.1); }
        .lp-carousel-btn-prev { left: 14px; }
        .lp-carousel-btn-next { right: 14px; }
        .lp-carousel-dots { display: flex; justify-content: center; gap: 7px; margin: 1.4rem 0 2rem; flex-wrap: wrap; }
        .lp-carousel-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: all 0.3s; padding: 0; }
        .lp-carousel-dot.active { background: #f39c12; transform: scale(1.4); }
        .lp-allot-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin: 0.5rem 0 1rem; }
        .lp-allot-stat { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 1.2rem 1rem; text-align: center; transition: all 0.3s; cursor: default; }
        .lp-allot-stat:hover { background: rgba(243,156,18,0.15); border-color: #f39c12; transform: translateY(-4px); }
        .lp-allot-stat-icon { font-size: 1.6rem; margin-bottom: 0.5rem; display: block; }
        .lp-allot-stat-num { font-size: 2rem; font-weight: 800; color: #f39c12; display: block; line-height: 1.1; }
        .lp-allot-stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.75); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 0.3rem; display: block; }

        /* ---- MEDICAL ACHIEVERS MARQUEE ---- */
        .lp-med-achievers { background: linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%); padding: clamp(3rem, 8vw, 5rem) 0; }
        .lp-med-achievers .lp-section-title h2 { color: #fff; }
        .lp-med-achievers .lp-section-title h2::after { background: #f39c12; }
        .lp-med-achievers .lp-section-title p { color: rgba(255,255,255,0.65); }
        .lp-marquee-label { text-align: center; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,255,255,0.35); margin-bottom: 1.25rem; }
        .lp-marquee-wrap { overflow: hidden; position: relative; padding: 0.5rem 0; }
        .lp-marquee-wrap::before, .lp-marquee-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; }
        .lp-marquee-wrap::before { left: 0; background: linear-gradient(to right, #0d1b2a, transparent); }
        .lp-marquee-wrap::after { right: 0; background: linear-gradient(to left, #1a3a5c, transparent); }
        .lp-marquee-track { display: flex; gap: 0.75rem; width: max-content; animation: lp-marquee-scroll 60s linear infinite; }
        .lp-marquee-track:hover { animation-play-state: paused; }
        @keyframes lp-marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .lp-achiever-chip { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; padding: 0.6rem 1.25rem; white-space: nowrap; display: flex; flex-direction: column; gap: 0.1rem; transition: all 0.3s; }
        .lp-achiever-chip:hover { background: rgba(243,156,18,0.12); border-color: rgba(243,156,18,0.4); }
        .lp-achiever-name { font-size: 0.85rem; font-weight: 700; color: #fff; }
        .lp-achiever-college { font-size: 0.7rem; color: #f39c12; font-weight: 600; }
        .lp-med-stats-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 1.5rem; margin-top: 2.5rem; }
        .lp-med-stat-badge { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.25rem 2rem; text-align: center; min-width: 130px; }
        .lp-med-stat-badge .num { font-size: 2rem; font-weight: 900; color: #f39c12; display: block; line-height: 1; }
        .lp-med-stat-badge .lbl { font-size: 0.78rem; color: rgba(255,255,255,0.7); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 0.3rem; display: block; }

        /* ---- ENGINEERING ACHIEVERS ---- */
        .lp-eng-achievers { background: linear-gradient(135deg, #0d1b2a 0%, #1e3a5f 100%); padding: clamp(3rem, 8vw, 5rem) 0; }
        .lp-eng-achievers .lp-section-title h2 { color: #fff; }
        .lp-eng-achievers .lp-section-title h2::after { background: #f39c12; }
        .lp-eng-achievers .lp-section-title p { color: rgba(255,255,255,0.65); }
        .lp-eng-marquee-label { text-align: center; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,255,255,0.35); margin-bottom: 1.25rem; }
        .lp-eng-marquee-wrap { overflow: hidden; position: relative; padding: 0.5rem 0; }
        .lp-eng-marquee-wrap::before, .lp-eng-marquee-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; }
        .lp-eng-marquee-wrap::before { left: 0; background: linear-gradient(to right, #0d1b2a, transparent); }
        .lp-eng-marquee-wrap::after { right: 0; background: linear-gradient(to left, #1e3a5f, transparent); }
        .lp-eng-marquee-track { display: flex; gap: 0.75rem; width: max-content; animation: lp-eng-marquee-scroll 50s linear infinite; }
        .lp-eng-marquee-track:hover { animation-play-state: paused; }
        @keyframes lp-eng-marquee-scroll { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .lp-eng-stat-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 1.5rem; margin-top: 2.5rem; }
        .lp-eng-stat-badge { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.25rem 2rem; text-align: center; min-width: 130px; }
        .lp-eng-stat-badge .num { font-size: 2rem; font-weight: 900; color: #f39c12; display: block; line-height: 1; }
        .lp-eng-stat-badge .lbl { font-size: 0.78rem; color: rgba(255,255,255,0.7); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 0.3rem; display: block; }

        /* ---- STATS / CTA ---- */
        .lp-cta { background: linear-gradient(rgba(46,134,193,0.95), rgba(46,134,193,0.95)); padding: clamp(3rem, 8vw, 5rem) 0; text-align: center; color: white; }
        .lp-cta h2 { font-size: clamp(1.8rem, 5vw, 2.8rem); margin-bottom: 1.5rem; }
        .lp-cta p { max-width: 44rem; margin: 0 auto 2.5rem; font-size: 1.1rem; opacity: 0.9; }
        .lp-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1.5rem; margin: 3rem 0; }
        .lp-stat-item { background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 0.75rem; transition: transform 0.3s, background 0.3s; }
        .lp-stat-item:hover { transform: translateY(-0.5rem); background: rgba(255,255,255,0.15); }
        .lp-stat-number { font-size: 2.5rem; font-weight: 800; color: #f39c12; margin-bottom: 0.5rem; }
        .lp-stat-title { font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .lp-btn-consult { display: inline-flex; align-items: center; justify-content: center; padding: 1.25rem 2.5rem; font-size: 1.25rem; font-weight: 700; border-radius: 3rem; background: linear-gradient(135deg, #f39c12, #d35400); color: white; text-decoration: none; text-transform: uppercase; box-shadow: 0 0.625rem 1.5rem rgba(0,0,0,0.2); transition: all 0.3s cubic-bezier(0.4,0,0.2,1); min-height: 3.5rem; }
        .lp-btn-consult:hover { transform: scale(1.03) translateY(-0.25rem); box-shadow: 0 1rem 2rem rgba(0,0,0,0.3); }
        .lp-btn-consult i { margin-right: 0.75rem; }

        /* ---- FOUNDER NOTE ---- */
        .lp-founder { background: #0d1b2a; padding: clamp(3rem, 8vw, 5rem) 0; }
        .lp-founder .lp-section-title h2 { color: #fff; }
        .lp-founder .lp-section-title h2::after { background: #f39c12; }
        .lp-founder-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; padding: clamp(2rem, 5vw, 3rem); display: grid; grid-template-columns: 1fr; gap: 2rem; max-width: 900px; margin: 0 auto; position: relative; overflow: hidden; }
        @media (min-width: 768px) { .lp-founder-card { grid-template-columns: auto 1fr; gap: 3rem; } }
        .lp-founder-card::before { content: '\\201C'; position: absolute; top: -1rem; left: 1.5rem; font-size: 10rem; color: rgba(243,156,18,0.1); font-family: serif; line-height: 1; pointer-events: none; }
        .lp-founder-photo-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .lp-founder-photo { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; object-position: center 15%; border: 3px solid #f39c12; box-shadow: 0 0 0 6px rgba(243,156,18,0.15); background: rgba(255,255,255,0.05); }
        .lp-founder-sig strong { display: block; font-size: 1.1rem; color: #f39c12; text-align: center; }
        .lp-founder-sig span { display: block; font-size: 0.82rem; color: rgba(255,255,255,0.5); text-align: center; }
        .lp-founder-quote-area { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: center; }
        .lp-founder-quote { font-size: clamp(1rem, 2.5vw, 1.15rem); color: rgba(255,255,255,0.88); line-height: 1.85; font-style: italic; margin-bottom: 1.5rem; }
        .lp-founder-since { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(243,156,18,0.15); border: 1px solid rgba(243,156,18,0.3); color: #f39c12; padding: 0.5rem 1.25rem; border-radius: 50px; font-size: 0.85rem; font-weight: 700; }

        /* ---- CONTACT / BRANCHES ---- */
        .lp-contact { background: white; padding: clamp(3rem, 8vw, 5rem) 0; border-top: 0.25rem solid #1e5a7d; }
        .lp-contact-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
        .lp-branch-label { display: inline-block; background: #2874A6; color: white; padding: 0.25rem 0.75rem; border-radius: 1.25rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 0.06rem; }
        .lp-branch-name { font-size: 1.75rem; font-weight: 800; color: #1a5276; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem; }
        .lp-branch-name i { color: #f39c12; }
        .lp-branch-item { display: flex; align-items: flex-start; gap: 1rem; font-size: 0.95rem; color: #444; text-decoration: none; line-height: 1.5; padding: 0.5rem 0; }
        .lp-branch-item i { color: #2874A6; font-size: 1.1rem; flex-shrink: 0; margin-top: 0.2rem; }
        .lp-branch-card { background: #fff; border: 1px solid #eee; border-radius: 1rem; padding: 1.5rem; transition: all 0.3s; box-shadow: 0 0.25rem 1rem rgba(0,0,0,0.03); }
        .lp-branch-card:hover { transform: translateY(-0.25rem); border-color: #2874A6; box-shadow: 0 1rem 2.5rem rgba(40,116,166,0.1); }
        .lp-branch-card h4 { font-size: 1.25rem; font-weight: 700; color: #1a5276; margin-bottom: 1rem; }
        .lp-main-branch-container { display: grid; grid-template-columns: 1fr; gap: 2rem; background: #f8fbfc; border-radius: 1.25rem; padding: 1.5rem; border: 1px solid #e1e8ed; }
        @media (min-width: 768px) { .lp-main-branch-container { grid-template-columns: 1fr 1fr; padding: 2.5rem; } }
        .lp-map-container { aspect-ratio: 16/9; width: 100%; border-radius: 0.75rem; overflow: hidden; }
        .lp-map-container iframe { width: 100%; height: 100%; border: 0; }
        .lp-branches-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 640px) { .lp-branches-grid { grid-template-columns: repeat(2, 1fr); } }
        .lp-other-branches-title { font-size: clamp(1.2rem, 4vw, 1.5rem); color: #1a5276; font-weight: 700; margin-bottom: 1.5rem; }

        /* ---- FOOTER ---- */
        .lp-footer { background: #12121f; color: rgba(255,255,255,0.75); padding: clamp(3rem, 6vw, 4rem) 0 1.5rem; border-top: 3px solid #f39c12; }
        .lp-footer-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; margin-bottom: 3rem; }
        @media (min-width: 640px) { .lp-footer-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 992px) { .lp-footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; } }
        .lp-footer-brand p { font-size: 0.88rem; line-height: 1.7; color: rgba(255,255,255,0.55); margin-top: 1rem; }
        .lp-footer-brand-logo { height: 3rem; width: auto; margin-bottom: 0.75rem; }
        .lp-footer-col h5 { font-size: 0.9rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; margin-bottom: 1.25rem; padding-bottom: 0.5rem; border-bottom: 2px solid rgba(243,156,18,0.4); display: inline-block; }
        .lp-footer-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
        .lp-footer-links li a { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.87rem; transition: color 0.2s; display: flex; align-items: center; gap: 0.5rem; }
        .lp-footer-links li a:hover { color: #f39c12; }
        .lp-footer-links li a i { font-size: 0.75rem; color: #f39c12; }
        .lp-footer-contact-item { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-bottom: 0.75rem; }
        .lp-footer-contact-item i { color: #f39c12; margin-top: 0.15rem; flex-shrink: 0; }
        .lp-footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; }
        @media (min-width: 640px) { .lp-footer-bottom { flex-direction: row; justify-content: space-between; } }
        .lp-footer-bottom p { font-size: 0.82rem; color: rgba(255,255,255,0.4); }
        .lp-footer-policy-links { display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
        .lp-footer-policy-links a { font-size: 0.8rem; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
        .lp-footer-policy-links a:hover { color: #f39c12; }
        .lp-social-links { display: flex; justify-content: flex-start; gap: 0.75rem; margin-top: 1rem; }
        .lp-social-link { width: 2.5rem; height: 2.5rem; background: rgba(255,255,255,0.07); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.7); font-size: 1rem; transition: all 0.3s; text-decoration: none; }
        .lp-social-link:hover { background: #f39c12; color: white; transform: translateY(-3px); }

        /* ---- HERO FEATURES & ACHIEVEMENT CARDS ---- */
        .lp-hero-title { font-size: clamp(2.2rem, 8vw, 4.2rem) !important; line-height: 1.4 !important; font-weight: 800; margin-bottom: 0.5rem !important; color: white; letter-spacing: 0 !important; padding-top: 0.3rem; }
        .lp-hero-title-accent { color: #f39c12; display: inline-block; font-size: 1em; margin-top: 0; letter-spacing: 0 !important; margin-left: 0.5rem; font-family: 'Mukta', sans-serif; padding-top: 0.5rem; line-height: 1.5; vertical-align: bottom; }
        .lp-hero-brand-name { font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 4px; margin: 0.75rem auto 1rem; display: inline-block; padding: 0.5rem 1.5rem; background: rgba(243,156,18,0.1); border: 1.5px solid rgba(243,156,18,0.4); border-radius: 50px; box-shadow: 0 0 20px rgba(243,156,18,0.1); }
        .lp-hero-brand-name span { color: #f39c12; }
        
        .lp-hero-features { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 1.25rem; padding: 1.5rem; margin-bottom: 2rem; backdrop-filter: blur(10px); display: flex; flex-direction: column; gap: 0.85rem; }
        .lp-hero-feature { font-size: 0.95rem; color: rgba(255,255,255,0.85); font-weight: 500; line-height: 1.6; display: flex; align-items: flex-start; gap: 0.75rem; text-align: left; }
        .lp-hero-feature-mark { color: #f59e0b; flex-shrink: 0; font-size: 0.6rem; margin-top: 0.5rem; background: #f59e0b; width: 6px; height: 6px; border-radius: 50%; box-shadow: 0 0 10px #f59e0b; }
        .lp-hero-achieve-row { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem; width: 100%; }
        .lp-hero-achieve-card { border-radius: 16px; padding: 1.25rem 1rem; text-align: center; display: flex; flex-direction: column; gap: 0.25rem; flex: 1; min-width: 140px; max-width: 200px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); background: rgba(255,255,255,0.03); }
        .lp-hero-achieve-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.06); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .lp-achieve-mbbs { border: 1px solid rgba(245,158,11,0.2); }
        .lp-achieve-bds  { border: 1px solid rgba(59,130,246,0.2); }
        .lp-achieve-bams { border: 1px solid rgba(34,197,94,0.2);  }
        .lp-achieve-iit  { border: 1px solid rgba(168,85,247,0.2); }
        .lp-achieve-num { font-size: 2rem; font-weight: 900; line-height: 1; display: block; letter-spacing: -0.5px; }
        .lp-achieve-icon { font-size: 1.5rem; margin-bottom: 0.5rem; opacity: 0.8; }
        .lp-achieve-mbbs .lp-achieve-num, .lp-achieve-mbbs .lp-achieve-icon { color: #f59e0b; }
        .lp-achieve-bds  .lp-achieve-num, .lp-achieve-bds .lp-achieve-icon { color: #60a5fa; }
        .lp-achieve-bams .lp-achieve-num, .lp-achieve-bams .lp-achieve-icon { color: #4ade80; }
        .lp-achieve-iit  .lp-achieve-num, .lp-achieve-iit .lp-achieve-icon { color: #c084fc; }
        .lp-achieve-lbl { font-size: 0.7rem; color: rgba(255,255,255,0.5); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: block; line-height: 1.4; margin-top: 0.3rem; }
        /* ---- MILESTONE BANNER (Merged) ---- */
        .lp-hero-milestone-banner { 
          background: linear-gradient(90deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          max-width: 900px;
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          text-align: left;
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .lp-milestone-year {
          background: #f59e0b;
          color: #000;
          padding: 0.4rem 1rem;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(245,158,11,0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .lp-milestone-text {
          font-size: 0.95rem;
          color: #fff;
          font-weight: 600;
          line-height: 1.5;
          flex: 1;
        }
        .lp-milestone-icon {
          font-size: 1.5rem;
          color: #f59e0b;
          filter: drop-shadow(0 0 8px rgba(245,158,11,0.5));
        }
        @media (max-width: 767px) {
          .lp-hero-milestone-banner { flex-direction: column; text-align: center; gap: 1rem; padding: 1.25rem; }
          .lp-milestone-text { font-size: 0.85rem; }
        }


        /* ---- FLOATING MOBILE CTA ---- */
        .lp-floating-cta { position: fixed; bottom: 1.5rem; right: 1.5rem; background: #25d366; color: white; width: 3.8rem; height: 3.8rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.4); z-index: 9999; text-decoration: none; font-size: 2.2rem; animation: lp-float-bounce 2s infinite; border: 2px solid rgba(255,255,255,0.2); }
        @keyframes lp-float-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @media (min-width: 992px) { .lp-floating-cta { display: none; } }
        @media (max-width: 767px) { .lp-floating-cta { bottom: 7rem; right: 1rem; width: 3.2rem; height: 3.2rem; font-size: 1.8rem; z-index: 10001; } }

        /* ---- REVIEWS MARQUEE ---- */
        .lp-reviews-marquee-container { flex: 1; min-width: 250px; overflow: hidden; position: relative; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
        .lp-reviews-marquee-track { display: flex; gap: 2.5rem; width: max-content; animation: lp-reviews-scroll 45s linear infinite; padding: 0.5rem 0; }
        .lp-reviews-marquee-track:hover { animation-play-state: paused; }
        .lp-review-pill { display: flex; align-items: center; gap: 1rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 0.65rem 1.5rem; border-radius: 50px; white-space: nowrap; transition: all 0.3s ease; }
        .lp-review-pill:hover { background: rgba(243,156,18,0.1); border-color: rgba(243,156,18,0.3); transform: translateY(-2px); }
        .lp-review-user { font-weight: 800; font-size: 0.8rem; color: #f39c12; letter-spacing: 0.5px; }
        .lp-review-text { font-size: 0.82rem; color: rgba(255,255,255,0.85); font-weight: 500; font-style: italic; }
        .lp-review-stars-small { color: #f39c12; font-size: 0.65rem; display: flex; gap: 2px; }
        @keyframes lp-reviews-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (max-width: 991px) { .lp-reviews-marquee-container { width: 100%; min-width: 100%; order: 4; margin-top: 0.5rem; } }
        @media (max-width: 991px) {
          .lp-creative-hero { min-height: auto; padding: 3rem 0 2rem; }
          .lp-hero-content { text-align: center; }
          .lp-hero-subtitle { max-width: 100%; }
          .lp-trust-card { flex-direction: column; align-items: center; gap: 1rem; }
        }
        @media (max-width: 767px) {
          .lp-creative-hero { padding: 1rem 0 0.5rem; }
          .lp-hero-grid { padding: 1rem 1.25rem 2rem; }
          .lp-hero-title { font-size: clamp(1.8rem, 9vw, 2.6rem) !important; line-height: 1.2 !important; }
          .lp-hero-title-accent { margin-top: 1.25rem; font-size: 1em; }
          .lp-hero-brand-name { font-size: 0.85rem; letter-spacing: 3px; padding: 0.5rem 1.25rem; margin: 1rem auto 1.25rem; }
          .lp-hero-subtitle { font-size: 0.93rem !important; margin-bottom: 1.25rem; }
          .lp-hero-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.75rem; }
          .lp-hero-btn-primary { flex: 1; min-width: 200px; justify-content: center; font-size: 0.95rem; padding: 0.85rem 1rem; }
          .lp-btn-consult { font-size: 0.9rem; padding: 0.8rem 1rem; width: 100%; justify-content: center; }
          /* Achieve cards on mobile */
          .lp-hero-features { padding: 1.25rem; }
          .lp-hero-achieve-card { min-width: calc(50% - 0.5rem); max-width: none; flex: unset; padding: 1rem 0.75rem; }
          .lp-achieve-num { font-size: 1.6rem; }
          .lp-hero-feature { font-size: 0.85rem; }
          .lp-hero-claim { font-size: 0.8rem; padding: 1rem; }
          /* Trust bar */
          .lp-trust-card { padding: 0.85rem 1rem; gap: 0.75rem; }
          .lp-trust-number { font-size: 1.2rem; }
          .lp-trust-review-count { font-size: 0.75rem; }
          /* Stat Rows - Engineering & Medical */
          .lp-eng-stat-row, .lp-med-stat-row { 
            flex-wrap: nowrap !important; 
            overflow-x: visible; 
            gap: 0.35rem !important; 
            margin-top: 1.5rem !important; 
            padding: 0 0.25rem;
          }
          .lp-eng-stat-badge, .lp-med-stat-badge { 
            padding: 0.6rem 0.25rem !important; 
            min-width: 0 !important; 
            flex: 1; 
            border-radius: 0.75rem !important; 
          }
          .lp-eng-stat-badge .num, .lp-med-stat-badge .num { font-size: 1.1rem !important; }
          .lp-eng-stat-badge .lbl, .lp-med-stat-badge .lbl { font-size: 0.55rem !important; letter-spacing: 0; line-height: 1.2; }
          /* Services */
          .lp-services-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.6rem !important; }
          .lp-service-content h3 { font-size: 1.1rem; }
          /* Handbooks */
          .lp-handbook-btns { flex-direction: column; gap: 0.75rem; }
          .lp-handbook-btn { flex: unset; width: 100%; padding: 0.8rem 1rem; font-size: 0.85rem; }
          /* Results */
          .lp-results-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          /* Branches */
          .lp-branch-name { font-size: 1.3rem; }
          .lp-map-container { height: 220px !important; aspect-ratio: unset !important; }
          .lp-branches-grid { grid-template-columns: 1fr !important; }
          /* Carousel */
          .lp-carousel-slide img { max-height: 40vh; }
          .lp-carousel-btn { width: 38px; height: 38px; font-size: 1rem; }
          .lp-allot-stats { grid-template-columns: repeat(2, 1fr); gap: 0.4rem; }
          .lp-allot-stat { padding: 0.6rem 0.5rem; }
          .lp-allot-stat-icon { font-size: 1.2rem; margin-bottom: 0.25rem; }
          .lp-allot-stat-num { font-size: 1.15rem; }
          .lp-allot-stat-label { font-size: 0.58rem; letter-spacing: 0; }
          /* Achievers */
          .lp-eng-stat-row, .lp-med-stats-row { gap: 0.75rem; }
          .lp-eng-stat-badge, .lp-med-stat-badge { padding: 1rem 1.25rem; min-width: 100px; }
          /* Floating CTA */
          .lp-floating-cta { width: 3.5rem; height: 3.5rem; font-size: 2rem; bottom: 7rem; right: 1rem; z-index: 10001; }
          /* Footer */
          .lp-footer-brand-logo { height: 2.25rem; }
        }
        @media (max-width: 480px) {
          .lp-allot-stats { grid-template-columns: repeat(2, 1fr); }
          .lp-hero-stat-item { min-width: 50%; }
          .lp-process-tab { padding: 0.6rem 1.25rem; font-size: 0.85rem; }
        }
        @media (max-width: 420px) {
          .lp-allot-stats { grid-template-columns: repeat(2, 1fr); gap: 0.35rem; }
          .lp-allot-stat { padding: 0.5rem 0.35rem; }
          .lp-hero-title { font-size: clamp(1.6rem, 8vw, 2rem) !important; }
          .lp-hero-title-accent { font-size: clamp(1.6rem, 8vw, 2rem) !important; }
          .lp-hero-grid { padding: 3.5rem 1rem 2rem; }
          .lp-hero-stat-item { min-width: 50%; }
          .lp-map-container { height: 200px !important; }
          .lp-eng-grid { grid-template-columns: 1fr; }
          .lp-footer-grid { gap: 1.75rem; }
          .lp-branch-card { padding: 1.25rem; }
        }
        .lp-portal-preview { padding: 6rem 0; background: #01040a; overflow: hidden; position: relative; transition: all 0.5s ease; }
        
        /* ─── PORTAL PREVIEW LIGHT MODE OVERRIDES ─── */
        .lp-portal-preview.light-mode {
          background: radial-gradient(circle at top right, rgba(243, 156, 18, 0.04), transparent 60%), #f8fafc;
          border-top: 1px solid rgba(15, 23, 42, 0.05);
          border-bottom: 1px solid rgba(15, 23, 42, 0.05);
        }
        
        .lp-portal-preview.light-mode .lp-portal-card {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(15, 23, 42, 0.06);
          box-shadow: 0 30px 70px rgba(15, 23, 42, 0.04);
        }
        
        .lp-portal-preview.light-mode .lp-portal-card.active {
          background: #ffffff;
          border-color: rgba(243, 156, 18, 0.4);
          box-shadow: 0 40px 90px rgba(15, 23, 42, 0.08), inset 0 0 45px rgba(243, 156, 18, 0.02);
        }
        
        .lp-portal-preview.light-mode .lp-portal-card-header h3 {
          color: #0f172a !important;
        }
        
        .lp-portal-preview.light-mode .lp-portal-card-header p {
          color: #64748b !important;
        }
        
        .lp-portal-preview.light-mode .lp-hologram-stage {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
        }
        
        .lp-portal-preview.light-mode .lp-portal-card.active .lp-hologram-stage,
        .lp-portal-preview.light-mode .lp-portal-card:hover .lp-hologram-stage {
          border-color: rgba(6, 182, 212, 0.4);
          box-shadow: 0 15px 40px rgba(6, 182, 212, 0.08), 0 25px 60px rgba(15, 23, 42, 0.05);
        }
        
        /* Inside mockup stage elements styling overrides */
        .lp-portal-preview.light-mode .lp-hologram-stage text {
          fill: #0f172a;
        }
        .lp-portal-preview.light-mode .lp-hologram-stage circle[class*="stroke-white"] {
          stroke: rgba(15, 23, 42, 0.08) !important;
        }
        .lp-portal-preview.light-mode .lp-hologram-stage div[class*="bg-white/5"] {
          background-color: rgba(15, 23, 42, 0.03) !important;
          border-color: rgba(15, 23, 42, 0.06) !important;
        }
        .lp-portal-preview.light-mode .lp-hologram-stage div[class*="bg-white/[0.02]"] {
          background-color: rgba(15, 23, 42, 0.01) !important;
          border-color: rgba(15, 23, 42, 0.03) !important;
        }
        .lp-portal-preview.light-mode .lp-hologram-stage div[class*="border-white/5"] {
          border-color: rgba(15, 23, 42, 0.06) !important;
        }
        .lp-portal-preview.light-mode .lp-hologram-stage div[class*="border-white/10"] {
          border-color: rgba(15, 23, 42, 0.08) !important;
        }
        
        /* Updates mockup text overrides */
        .lp-portal-preview.light-mode .lp-hologram-stage .text-white {
          color: #0f172a !important;
        }
        .lp-portal-preview.light-mode .lp-hologram-stage .text-slate-300 {
          color: #334155 !important;
        }
        .lp-portal-preview.light-mode .lp-hologram-stage .text-slate-500 {
          color: #64748b !important;
        }
        
        /* Chat mockup overrides */
        .lp-portal-preview.light-mode .lp-hologram-stage div[class*="bg-amber-500/5"] {
          background-color: rgba(243, 156, 18, 0.06) !important;
          border-color: rgba(243, 156, 18, 0.15) !important;
        }
        .lp-portal-preview.light-mode .lp-hologram-stage .text-slate-100 {
          color: #1e293b !important;
        }
        .lp-portal-preview.light-mode .lp-hologram-stage div[class*="bg-white/5"] span.text-white {
          color: #0f172a !important;
        }
        .lp-portal-grid-wrap { position: relative; width: 100%; max-width: 1200px; margin: 0 auto; overflow: visible; }
        .lp-portal-grid { display: flex; gap: 2rem; overflow-x: auto; padding: 4rem 1rem; scroll-snap-type: x mandatory; scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; perspective: 2500px; }
        .lp-portal-grid::-webkit-scrollbar { display: none; }
        
        /* Fixed 2-card layout for Desktop */
        .lp-portal-card { 
          flex: 0 0 calc(50% - 1rem); 
          min-width: calc(50% - 1rem);
          background: rgba(255,255,255,0.02); 
          border: 1px solid rgba(255,255,255,0.08); 
          border-radius: 3rem; 
          padding: 3rem; 
          scroll-snap-align: start; 
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1); 
          display: flex; 
          flex-direction: column; 
          gap: 2.5rem; 
          position: relative; 
          transform-style: preserve-3d;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8);
        }

        .lp-portal-card.active {
          background: rgba(255,255,255,0.04);
          border-color: rgba(243,156,18,0.5);
          box-shadow: 0 50px 120px rgba(0,0,0,0.9), inset 0 0 40px rgba(243,156,18,0.05);
        }

        /* Bold Highlights */
        .lp-portal-card-header h3 { font-size: 1.75rem; font-weight: 900; color: #fff; margin-bottom: 0.75rem; transform: translateZ(40px); letter-spacing: -0.5px; }
        .lp-portal-card-header p { font-size: 1rem; color: rgba(255,255,255,0.5); line-height: 1.7; transform: translateZ(30px); font-weight: 500; }

        /* Hologram Stage */
        .lp-hologram-stage {
          position: relative;
          background: rgba(1, 4, 10, 0.9);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2rem;
          padding: 2rem;
          min-height: 280px;
          flex: 1;
          transform: translateZ(60px) rotateX(-5deg);
          transform-style: preserve-3d;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 0 50px rgba(0,0,0,0.7);
        }

        .lp-portal-card:hover .lp-hologram-stage, 
        .lp-portal-card.active .lp-hologram-stage {
          transform: translateZ(100px) rotateX(-10deg);
          border-color: rgba(6, 182, 212, 0.6);
          box-shadow: 0 0 60px rgba(6, 182, 212, 0.2), 0 0 120px rgba(0,0,0,0.8);
        }

        /* Bold Data Points */
        .lp-hologram-value { font-size: 4rem; font-weight: 900; color: #fff; text-shadow: 0 0 20px rgba(6, 182, 212, 0.5); }
        .lp-hologram-label { color: #06b6d4; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; font-size: 0.85rem; }

        /* Hologram Light Beam */
        .lp-hologram-beam {
          position: absolute;
          bottom: -30px;
          left: 5%;
          right: 5%;
          height: 60px;
          background: radial-gradient(ellipse at bottom, rgba(6, 182, 212, 0.4), transparent 75%);
          filter: blur(15px);
          opacity: 0;
          transition: opacity 0.6s;
          pointer-events: none;
        }
        .lp-portal-card.active .lp-hologram-beam { opacity: 1; }

        .lp-portal-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 1.25rem;
          border: none;
          background: linear-gradient(45deg, #f39c12, #e67e22);
          color: #000;
          font-weight: 900;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: auto;
          box-shadow: 0 10px 20px rgba(243, 156, 18, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transform: translateZ(20px);
        }
        .lp-portal-btn:hover {
          transform: translateZ(30px) translateY(-2px);
          box-shadow: 0 15px 30px rgba(243, 156, 18, 0.4);
          filter: brightness(1.1);
        }

        @media (max-width: 1023px) {
          .lp-portal-card { flex: 0 0 90%; min-width: 90%; padding: 2.5rem; scroll-snap-align: center; }
          .lp-portal-grid-wrap { padding: 0 15px; }
        }
        @media (max-width: 767px) {
          .lp-portal-preview { padding: 3rem 0; }
          .lp-portal-grid { gap: 1rem; padding: 2rem 0.5rem; }
          .lp-portal-card {
            flex: 0 0 86%; 
            min-width: 86%; 
            padding: 1.25rem; 
            border-radius: 2rem;
            gap: 1.5rem;
          }
          .lp-portal-grid-wrap { padding: 0 8px; }
          .lp-hologram-stage {
            padding: 1rem;
            min-height: 250px;
            border-radius: 1.5rem;
          }
          .lp-portal-card-header h3 {
            font-size: 1.4rem;
            margin-bottom: 0.5rem;
          }
          .lp-portal-card-header p {
            font-size: 0.85rem;
            line-height: 1.5;
          }
          .lp-portal-btn {
            padding: 0.85rem;
            font-size: 0.8rem;
          }
        }
        .lp-spinner-ring {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(243, 156, 18, 0.1);
          border-top: 4px solid #f39c12;
          border-radius: 50%;
          animation: lp-spin-load 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 20px rgba(243, 156, 18, 0.2);
        }
        .lp-loading-text {
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-size: 0.9rem;
          color: #f39c12;
          animation: lp-text-pulse 1.5s ease-in-out infinite;
        }
        @keyframes lp-spin-load {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes lp-text-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        /* --- BREAKING NEWS TICKER --- */
        .lp-breaking-ticker {
          background: #e74c3c;
          color: white;
          padding: 10px 0;
          font-weight: 800;
          font-size: 0.9rem;
          overflow: hidden;
          position: relative;
          z-index: 99999;
          cursor: pointer;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 10px rgba(231, 76, 60, 0.3);
        }
        .lp-ticker-wrapper {
          display: flex;
          white-space: nowrap;
          animation: lp-ticker-scroll 35s linear infinite;
          width: fit-content;
        }
        @keyframes lp-ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* --- NEWS MODAL --- */
        .lp-news-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
          backdrop-filter: blur(5px);
        }
        .lp-news-modal-content {
          position: relative;
          width: 100%;
          max-width: 500px;
          animation: lp-modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes lp-modal-pop {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .lp-news-modal-img {
          width: 100%;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.2);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .lp-news-modal-close {
          position: absolute;
          top: -50px;
          right: 0;
          background: #e74c3c;
          color: white;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
        }
      `}</style>

      <div className="lp-root">
        <Helmet>
          <title>Admissions Made Easy | Leading NEET & JEE Admission Experts in Maharashtra</title>
          <meta name="description" content="Trust Maharashtra’s most experienced admission consultants. Over 15 years of excellence, 17,500+ success stories. End-to-end guidance for Medical & Engineering aspirants." />
          <meta property="og:title" content="Admissions Made Easy | Leading NEET & JEE Admission Experts" />
          <meta property="og:description" content="15+ Years of Excellence. 17,500+ Students Guided. End-to-end counselling for NEET & JEE aspirants in Maharashtra." />
          <meta property="og:url" content="https://admissionsmadeeasy.in/" />
        </Helmet>
        {isLoading && (
          <div className="lp-loading-overlay">
            <div className="lp-spinner-ring"></div>
            <div className="lp-loading-text">Loading Excellence...</div>
          </div>
        )}

        {/* ===== BREAKING NEWS TICKER (Dynamic) ===== */}
        {ticker.text && (
          <div
            className="lp-breaking-ticker"
            onClick={() => ticker.link ? window.open(ticker.link, '_blank') : setIsNewsModalOpen(true)}
          >
            <div className="lp-ticker-wrapper">
              <span style={{ paddingRight: '100px' }}>🚨 {ticker.text} 🚨</span>
              <span style={{ paddingRight: '100px' }}>🚨 {ticker.text} 🚨</span>
              <span style={{ paddingRight: '100px' }}>🚨 {ticker.text} 🚨</span>
            </div>
          </div>
        )}

        {/* ===== NEWS DETAIL MODAL ===== */}
        {isNewsModalOpen && (
          <div className="lp-news-modal-overlay" onClick={() => setIsNewsModalOpen(false)}>
            <div className="lp-news-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="lp-news-modal-close" onClick={() => setIsNewsModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
              <img
                src="/landing-assets/images/updates/neet_reexam_nta.jpg"
                alt="NTA Official Announcement"
                className="lp-news-modal-img"
              />
              <div style={{ textAlign: 'center', marginTop: '15px', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                Tap outside to close
              </div>
            </div>
          </div>
        )}

        {/* ===== MOBILE BOTTOM TAB BAR (mobile only) ===== */}
        <nav className="lp-bottom-nav" aria-label="Mobile navigation">
          <a href="#lp-home" className={`lp-bottom-nav-item ${activeTab === '#lp-home' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, '#lp-home')}>
            <i className="fas fa-home lp-bottom-nav-icon"></i>
            <span className="lp-bottom-nav-label">Home</span>
          </a>
          <a href="#lp-services" className={`lp-bottom-nav-item ${activeTab === '#lp-services' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, '#lp-services')}>
            <i className="fas fa-briefcase lp-bottom-nav-icon"></i>
            <span className="lp-bottom-nav-label">Services</span>
          </a>
          <a href="#lp-handbooks" className={`lp-bottom-nav-item ${activeTab === '#lp-handbooks' ? 'active' : ''}`} onClick={(e) => handleTabClick(e, '#lp-handbooks')}>
            <i className="fas fa-book lp-bottom-nav-icon"></i>
            <span className="lp-bottom-nav-label">Handbooks</span>
          </a>
          <button className="lp-bottom-nav-item" onClick={(e) => handleTabClick(e, '/public-login', true)}>
            <i className="fas fa-user-circle lp-bottom-nav-icon"></i>
            <span className="lp-bottom-nav-label">Profile</span>
          </button>
          <button className="lp-bottom-nav-item" onClick={(e) => handleTabClick(e, '/updates', true)}>
            <i className="fas fa-bell lp-bottom-nav-icon"></i>
            <span className="lp-bottom-nav-label">Updates</span>
          </button>
        </nav>

        {/* ===== HEADER ===== */}
        <header className="lp-header">
          <div className="lp-container">
            <div className="lp-header-content">
              <div className="lp-branding">
                <img src="/landing-assets/images/branding/logo1.png" alt="Admissions Made Easy" className="lp-brand-logo" />
              </div>
              <button className="lp-mobile-toggle" onClick={() => setIsNavOpen(!isNavOpen)} aria-label="Toggle navigation">
                <i className={isNavOpen ? "fas fa-times" : "fas fa-bars"}></i>
              </button>
              <div className={`lp-nav-backdrop ${isNavOpen ? "lp-nav-backdrop-active" : ""}`} onClick={() => setIsNavOpen(false)} aria-hidden="true" />
              <nav className={`lp-nav ${isNavOpen ? "lp-nav-active" : ""}`}>
                <ul>
                  <li><a href="#lp-home" onClick={(e) => { setIsNavOpen(false); handleTabClick(e, '#lp-home'); }}><i className="fas fa-home"></i> Home</a></li>
                  <li><a href="#lp-services" onClick={(e) => { setIsNavOpen(false); handleTabClick(e, '#lp-services'); }}><i className="fas fa-briefcase"></i> Services</a></li>
                  <li><a href="#lp-handbooks" onClick={(e) => { setIsNavOpen(false); handleTabClick(e, '#lp-handbooks'); }}><i className="fas fa-book"></i> Handbooks</a></li>
                  <li><a href="#lp-contact" onClick={(e) => { setIsNavOpen(false); handleTabClick(e, '#lp-contact'); }}><i className="fas fa-map-marker-alt"></i> Branches</a></li>
                  <li>
                    <button onClick={(e) => { setIsNavOpen(false); handleTabClick(e, "/public-login", true); }} style={{ color: "#f39c12", background: "none", border: "none", cursor: "pointer", font: "inherit", fontWeight: "bold" }}>
                      <i className="fas fa-user-circle"></i> Profile
                    </button>
                  </li>
                  <li>
                    <button onClick={(e) => { setIsNavOpen(false); handleTabClick(e, "/updates", true); }} style={{ color: "white", background: "none", border: "none", cursor: "pointer", font: "inherit", fontWeight: "bold" }}>
                      <i className="fas fa-bell"></i> Updates
                    </button>
                  </li>
                  <li>
                    <button onClick={(e) => { setIsNavOpen(false); handleTabClick(e, "/login", true); }} style={{ color: "white", background: "none", border: "none", cursor: "pointer", font: "inherit" }}>
                      <i className="fas fa-sign-in-alt"></i> Login
                    </button>
                  </li>
                </ul>
              </nav>
              <div className="lp-header-right">
                <a href="tel:+919309553235" className="lp-helpline-btn">
                  <div className="lp-phone-icon"><i className="fas fa-phone-alt"></i></div>
                  <div className="lp-helpline-text">
                    <span className="lp-helpline-number">+91 93095 53235</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* ===== HERO ===== */}
        <section id="lp-home" className="lp-creative-hero">
          <div className="lp-container lp-hero-grid">

            {/* Marathi main title */}
            <h1 className="lp-hero-title lp-hero-marathi">
              प्रवेश प्रक्रिया <span className="lp-hero-title-accent">मार्गदर्शन केंद्र</span>
            </h1>

            {/* Brand Signature - Highlighted */}
            <div className="lp-hero-brand-name">
              Admissions <span>Made Easy</span>
            </div>

            {/* English sub-line */}
            <p className="lp-hero-subtitle" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
              Maharashtra's most trusted admission counselling centre for <strong>NEET (MBBS / BDS / BAMS / BHMS / BUMS BPTh/ BOTh / BASLP / BPO / BVSc & AH)
              </strong> and <strong>JEE / MHT-CET (IIT / NIT / IIIT / JOSAA / CSAB / MAHACET CAP)</strong> — expert guidance since 2011.
            </p>

            {/* Marathi feature panel */}
            <div className="lp-hero-features">
              {[
                { icon: "fa-history", text: "15 वर्षापासून कार्यरत एकमेव मार्गदर्शन केंद्र" },
                { icon: "fa-smile-beam", text: "17,500+ समाधानी विद्यार्थी व पालक" },
                { icon: "fa-file-alt", text: "प्रवेश प्रक्रियेसंबंधी परिपूर्ण माहिती व वैयक्तिक लक्ष" },
                { icon: "fa-graduation-cap", text: "कमीत कमी मार्क्स असताना चांगल्या महाविद्यालयात प्रवेशाची परंपरा" },
              ].map((f, i) => (
                <div className="lp-hero-feature lp-hero-marathi" key={i}>
                  <i className={`fas ${f.icon} lp-hero-feature-icon`} style={{ color: '#f59e0b', fontSize: '0.9rem', marginTop: '0.3rem' }}></i>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className="lp-hero-actions">
              <a href="https://forms.gle/ns7NxapvAda6mEnBA" target="_blank" rel="noopener noreferrer" className="lp-hero-btn-primary">
                <i className="fas fa-calendar-check"></i> Book Free Counselling Session
              </a>
            </div>

            {/* Unified Milestone Banner - Merged Achievement */}
            <div className="lp-hero-milestone-banner lp-hero-marathi">
              <div className="lp-milestone-year">
                <i className="fas fa-calendar-alt"></i>
                2025-26
              </div>
              <div className="lp-milestone-text">
                एवढ्या मोठ्या प्रमाणात विद्यार्थ्यांची निवड झालेले बहुदा महाराष्ट्रातील एकमेव प्रवेश प्रक्रिया मार्गदर्शन केंद्र.
              </div>
            </div>

            {/* Achievement cards - English Only as requested */}
            <div className="lp-hero-achieve-row">
              <div className="lp-hero-achieve-card lp-achieve-mbbs">
                <i className="fas fa-user-md lp-achieve-icon"></i>
                <span className="lp-achieve-num">1,081+</span>
                <span className="lp-achieve-lbl">MBBS Selections</span>
              </div>
              <div className="lp-hero-achieve-card lp-achieve-bds">
                <i className="fas fa-tooth lp-achieve-icon"></i>
                <span className="lp-achieve-num">175+</span>
                <span className="lp-achieve-lbl">BDS Selections</span>
              </div>
              <div className="lp-hero-achieve-card lp-achieve-bams">
                <i className="fas fa-leaf lp-achieve-icon"></i>
                <span className="lp-achieve-num">445+</span>
                <span className="lp-achieve-lbl">BAMS Selections</span>
              </div>
              <div className="lp-hero-achieve-card lp-achieve-iit">
                <i className="fas fa-microchip lp-achieve-icon"></i>
                <span className="lp-achieve-num">235+</span>
                <span className="lp-achieve-lbl">Engineering Seats</span>
              </div>
            </div>

          </div>

          {/* Trust bar */}
          {/* Trust bar - Layered Layout */}
          <div className="lp-trust-card">
            {/* LAYER 1: Rating + Branches + Action (All Trust Signals) */}
            <div className="lp-trust-layer-1">
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Latur Rating */}
                <div className="lp-trust-rating-flex">
                  <div className="lp-trust-number">4.8</div>
                  <div>
                    <div className="lp-trust-stars">{[1, 2, 3, 4, 5].map(i => <i key={i} className="fas fa-star"></i>)}</div>
                    <div className="lp-trust-review-count">1,511+ Reviews</div>
                    <div className="lp-trust-source">Latur (HQ)</div>
                  </div>
                </div>

                <div className="lp-trust-v-sep"></div>

                {/* Pune Rating */}
                <div className="lp-trust-rating-flex">
                  <div className="lp-trust-number">4.9</div>
                  <div>
                    <div className="lp-trust-stars">{[1, 2, 3, 4, 5].map(i => <i key={i} className="fas fa-star"></i>)}</div>
                    <div className="lp-trust-review-count">1,435+ Reviews</div>
                    <div className="lp-trust-source">Pune Branch</div>
                  </div>
                </div>
              </div>

              <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} className="lp-desktop-only"></div>

              <div className="lp-trust-locations-container">
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>Our Branches:</span>
                <div className="lp-trust-locations-grid">
                  {["Latur (HQ)", "Pune", "Kolhapur", "Nanded", "Solapur", "+ Online"].map(loc => (
                    <div key={loc} className="lp-trust-location-tag" style={loc === "+ Online" ? { borderStyle: "dashed" } : {}}>{loc}</div>
                  ))}
                </div>
              </div>

              <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} className="lp-desktop-only"></div>

              <a
                href="https://www.google.com/maps/place/Admissions+Made+Easy/@18.3969362,76.5646061,17z/data=!4m8!3m7!1s0x3bcf83c1ef3fffff:0xd8ab805ccd1ed7ab!8m2!3d18.3969362!4d76.5646061!9m1!1b1!16s%2Fg%2F11b6_v_z7z"
                target="_blank"
                rel="noopener noreferrer"
                className="lp-trust-status"
                style={{ textDecoration: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <i className="fab fa-google" style={{ fontSize: '0.8rem' }}></i>
                SHOW GOOGLE REVIEWS
              </a>
            </div>

            <div className="lp-trust-layer-separator"></div>

            {/* LAYER 2: Reviews Marquee (Social Proof) */}
            <div className="lp-trust-layer-2">
              <div className="lp-reviews-marquee-container">
                <div className="lp-reviews-marquee-track">
                  {[
                    { name: "Aditya Kulkarni (Pune)", text: "Best admission guidance in Pune! Helped me throughout the JOSAA process." },
                    { name: "Rahul Sharma (Latur)", text: "Admission made easy team make easy path for medical/engg admissions" },
                    { name: "Priya Singh (Pune)", text: "Excellent staff at Pune branch. Very helpful for NEET counselling." },
                    { name: "Snehal Patil (Latur)", text: "Excellent work! Accurate and authentic information for NEET admissions" },
                    { name: "Abhishek Deshmukh (Latur)", text: "Sachin Bangad sir is one of the best consultant in Latur" },
                    { name: "Dr. Amit Bhale (Medical)", text: "Most trustworthy and helpful consultancy for medical admissions" },
                    { name: "Vikas Kulkarni (JEE/CET)", text: "Best guidance for JEE and MHT-CET admissions in Maharashtra" },
                    // Duplicate for seamless loop
                    { name: "Aditya Kulkarni (Pune)", text: "Best admission guidance in Pune! Helped me throughout the JOSAA process." },
                    { name: "Rahul Sharma (Latur)", text: "Admission made easy team make easy path for medical/engg admissions" },
                    { name: "Priya Singh (Pune)", text: "Excellent staff at Pune branch. Very helpful for NEET counselling." },
                    { name: "Snehal Patil (Latur)", text: "Excellent work! Accurate and authentic information for NEET admissions" },
                    { name: "Abhishek Deshmukh (Latur)", text: "Sachin Bangad sir is one of the best consultant in Latur" },
                    { name: "Dr. Amit Bhale (Medical)", text: "Most trustworthy and helpful consultancy for medical admissions" },
                    { name: "Vikas Kulkarni (JEE/CET)", text: "Best guidance for JEE and MHT-CET admissions in Maharashtra" }
                  ].map((rev, idx) => (
                    <div key={idx} className="lp-review-pill">
                      <span className="lp-review-user">{rev.name}</span>
                      <div className="lp-review-stars-small">
                        {[1, 2, 3, 4, 5].map(s => <i key={s} className="fas fa-star"></i>)}
                      </div>
                      <span className="lp-review-text">"{rev.text}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PWA INSTALL BANNER */}
        {installPrompt && (
          <section className="lp-pwa-banner" style={{ marginTop: '-1rem', position: 'relative', zIndex: 10, borderBottom: '2px solid rgba(243,156,18,0.3)' }}>
            <div className="lp-container">
              <div className="lp-pwa-content">
                <div className="lp-pwa-text-group">
                  <div className="lp-pwa-icon-wrap" style={{ background: 'white', padding: '6px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/icons/icon-192x192.png" alt="App Logo" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h4 className="lp-pwa-h4" style={{ color: '#fff' }}>Install AME Mobile App</h4>
                    <p className="lp-pwa-p" style={{ color: 'rgba(255,255,255,0.8)' }}>Access Cutoffs & Updates instantly from your home screen.</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleInstall();
                  }}
                  className="lp-pwa-btn"
                  style={{ background: '#f39c12', color: '#000 !important', border: 'none' }}
                >
                  <i className="fas fa-cloud-download-alt"></i> Install Now
                </button>
              </div>
            </div>
          </section>
        )}
        {/* ===== SERVICES ===== */}
        <section id="lp-services" className="lp-section lp-services">
          <div className="lp-container">
            <div className="lp-section-title">
              <h2>Our Counselling Services</h2>
              <p>End-to-end admission support — from entrance exam strategy to document verification and final seat confirmation.</p>
            </div>
            <div className="lp-services-grid">
              <div className="lp-service-card">
                <div className="lp-service-img" style={{ backgroundImage: "url('/landing-assets/images/services/medical.jpg')" }}></div>
                <div className="lp-service-content">
                  <h3><i className="fas fa-stethoscope"></i> Medical Admissions</h3>
                  <p>Comprehensive guidance for MBBS, BDS, and other medical courses. We help you navigate entrance exams, college selection, and admission procedures.</p>
                  <button className="lp-btn-details" onClick={() => navigate("/medical-admission")}>
                    View More Details <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
              <div className="lp-service-card">
                <div className="lp-service-img" style={{ backgroundImage: "url('/landing-assets/images/services/engineering.jpg')" }}></div>
                <div className="lp-service-content">
                  <h3><i className="fas fa-drafting-compass"></i> Engineering Admissions</h3>
                  <p>Expert counselling for B.Tech, B.E and other engineering programs. Get assistance with JEE counselling, college comparisons, and branch selection.</p>
                  <button className="lp-btn-details" onClick={() => navigate("/engineering-admission")}>
                    View More Details <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
              <div className="lp-service-card">
                <div className="lp-service-img" style={{ backgroundImage: "url('/landing-assets/images/services/veterinary.jpg')" }}></div>
                <div className="lp-service-content">
                  <h3><i className="fas fa-dog"></i> Veterinary Admissions</h3>
                  <p>Expert guidance for B.V.Sc & A.H. admissions. We assist with NEET counselling for Veterinary seats, state-level selection processes, and securing admissions in top Veterinary colleges.</p>
                  <button className="lp-btn-details" onClick={() => toast.info("Detailed counselling portal for this course is coming soon! Please contact us on calls and whatsapp for immediate guidance.")}>
                    View More Details <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
              <div className="lp-service-card">
                <div className="lp-service-img" style={{ backgroundImage: "url('/landing-assets/images/services/pharmacy.jpg')" }}></div>
                <div className="lp-service-content">
                  <h3><i className="fas fa-pills"></i> Pharmacy Admissions</h3>
                  <p>Comprehensive support for B.Pharm and D.Pharm admissions. Get expert guidance on MHT-CET/NEET counselling, college preferences, and career paths in Pharmaceutical Sciences.</p>
                  <button className="lp-btn-details" onClick={() => toast.info("Detailed counselling portal for this course is coming soon! Please contact us on calls and whatsapp for immediate guidance.")}>
                    View More Details <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HANDBOOKS ===== */}
        <section id="lp-handbooks" className="lp-section lp-handbooks">
          <div className="lp-container">
            <div className="lp-section-title">
              <h2>Admission Process Handbooks 2026</h2>
              <p>Authored by our experts — your complete step-by-step guide to navigating the admission process with confidence.</p>
            </div>
            <div className="lp-handbooks-grid">

              {/* NEET UG 2026 */}
              <div className="lp-handbook-card">
                <div className="lp-handbook-cover">
                  <img src="/landing-assets/images/handbooks/med-cover.jpeg" alt="Medical Admission Process Handbook 2026" />
                </div>

                <div className="lp-handbook-body">
                  <div className="lp-handbook-info-group">
                    <div className="lp-handbook-label-title">Authors</div>
                    <div className="lp-handbook-authors">Sachin Bangad · Kailash Toshniwal</div>
                    <div className="lp-handbook-branding">Admissions Made Easy — Since 2011</div>
                  </div>

                  <div className="lp-handbook-topics">
                    <span className="lp-handbook-topic">AIIMS</span>
                    <span className="lp-handbook-topic">AFMC</span>
                    <span className="lp-handbook-topic">AIQ</span>
                    <span className="lp-handbook-topic">State Quota</span>
                    <span className="lp-handbook-topic">Deemed</span>
                    <span className="lp-handbook-topic">Other State Private MBBS / BAMS</span>
                  </div>

                  <div className="lp-handbook-btns">
                    <a href="https://wa.me/919970809003?text=Hey%20%2C%20I%20saw%20this%20book%20on%20your%20website%20-%20would%20like%20to%20order%20one%20-%20please%20share%20the%20details" target="_blank" rel="noopener noreferrer" className="lp-handbook-btn lp-handbook-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      <i className="fab fa-whatsapp"></i> Order Now
                    </a>
                  </div>
                </div>
              </div>

              {/* Engineering 2026 */}
              <div className="lp-handbook-card">
                <div className="lp-handbook-cover">
                  <img src="/landing-assets/images/handbooks/eng-cover.jpeg" alt="Engineering Admission Process Handbook 2026" />
                </div>

                <div className="lp-handbook-body">
                  <div className="lp-handbook-info-group">
                    <div className="lp-handbook-label-title">Authors</div>
                    <div className="lp-handbook-authors">Sachin Bangad · Kailash Toshniwal · Sunil Govindpurkar</div>
                    <div className="lp-handbook-branding">Admissions Made Easy — Since 2011</div>
                  </div>

                  <div className="lp-handbook-topics">
                    <span className="lp-handbook-topic">IIT</span>
                    <span className="lp-handbook-topic">NIT</span>
                    <span className="lp-handbook-topic">IIIT</span>
                    <span className="lp-handbook-topic">JOSAA</span>
                    <span className="lp-handbook-topic">CSAB</span>
                    <span className="lp-handbook-topic">Maharashtra CAP</span>
                  </div>

                  <div className="lp-handbook-btns">
                    <a href="https://wa.me/919970809003?text=Hey%20%2C%20I%20saw%20this%20book%20on%20your%20website%20-%20would%20like%20to%20order%20one%20-%20please%20share%20the%20details" target="_blank" rel="noopener noreferrer" className="lp-handbook-btn lp-handbook-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      <i className="fab fa-whatsapp"></i> Order Now
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===== PORTAL PREVIEW ===== */}
        <PortalPreview />


        {/* ===== ADMISSION PROCESS ===== */}
        <section id="lp-process" className="lp-section lp-process">
          <div className="lp-container">
            <div className="lp-section-title">
              <h2>How the Admission Process Works</h2>
              <p>A clear step-by-step roadmap so you never miss a deadline or a critical choice.</p>
            </div>
            <div className="lp-process-tabs">
              <button className={`lp-process-tab ${processTab === "medical" ? "active" : ""}`} onClick={() => setProcessTab("medical")}>
                <i className="fas fa-stethoscope"></i> &nbsp;Medical (NEET / CAP)
              </button>
              <button className={`lp-process-tab ${processTab === "engineering" ? "active" : ""}`} onClick={() => setProcessTab("engineering")}>
                <i className="fas fa-drafting-compass"></i> &nbsp;Engineering (JEE / JOSAA)
              </button>
            </div>
            <div className="lp-process-steps">
              {(processTab === "medical" ? MED_PROCESS : ENG_PROCESS).map(step => (
                <div className="lp-process-step" key={step.num}>
                  <div className="lp-process-num">{step.num}</div>
                  <div className="lp-process-content">
                    <h4><i className={`fas ${step.icon}`} style={{ color: "#f39c12", marginRight: "0.4rem" }}></i>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lp-process-note">
              <p><i className="fas fa-lightbulb" style={{ color: "#f39c12", marginRight: "0.5rem" }}></i>
                Confused at any step? Our counsellors at all 5 branches are available Mon–Sat 11AM–9PM. Walk in or call <strong>+91 93095 53235</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* ===== STUDENT CAROUSEL ===== */}
        <StudentCarousel />

        {/* ===== ENGINEERING ACHIEVERS ===== */}
        <section className="lp-section lp-eng-achievers">
          <div className="lp-container">
            <div className="lp-section-title">
              <h2>Engineering Achievers — 2025</h2>
              <p>Our students who cracked JEE and secured seats at IITs, NITs, IIITs, and top state institutes.</p>
            </div>
            <p className="lp-eng-marquee-label">IIT Bombay · IIT Delhi · NIT Nagpur · COEP Pune</p>
            <div className="lp-eng-marquee-wrap">
              <div className="lp-eng-marquee-track">
                {dupEngAchievers.map((a, i) => (
                  <div className="lp-achiever-chip" key={i}>
                    <span className="lp-achiever-name">{a.name}</span>
                    <span className="lp-achiever-college">{a.college}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-eng-stat-row">
              {[
                { num: "14", lbl: "IIT Selections" },
                { num: "10", lbl: "NIT / IIIT" },
                { num: "06", lbl: "COEP / PICT" },
                { num: "41", lbl: "VIT / Walchand" },
                { num: "45", lbl: "Private Universities" },
              ].map(s => (
                <div className="lp-eng-stat-badge" key={s.lbl}>
                  <span className="num">{s.num}</span>
                  <span className="lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTACT / BRANCHES ===== */}
        <section id="lp-contact" className="lp-section lp-contact">
          <div className="lp-container">
            <div className="lp-section-title">
              <h2>Find a Branch Near You</h2>
              <p>Walk in for a complimentary consultation at any of our offices across Maharashtra. No appointment needed.</p>
            </div>
            <div className="lp-contact-grid">
              {BRANCHES.filter(b => b.isMain).map(branch => (
                <div className="lp-main-branch-container" key={branch.city}>
                  <div>
                    <span className="lp-branch-label">Main Branch — Headquarters</span>
                    <h3 className="lp-branch-name"><i className="fas fa-building"></i> {branch.city} <span style={{ fontSize: "0.9rem", color: "#888" }}>{branch.cityMar}</span></h3>
                    <div className="lp-branch-item"><i className="fas fa-location-dot"></i><span>{branch.address}</span></div>
                    {branch.phones.map(phone => (
                      <a href={`tel:${phone.replace(/\s+/g, "")}`} className="lp-branch-item" key={phone}><i className="fas fa-phone"></i><span>{phone}</span></a>
                    ))}
                    <div className="lp-branch-item"><i className="fas fa-clock"></i><span><strong>Mon – Sat:</strong> 11 AM – 9 PM &nbsp;|&nbsp; <strong>Sun:</strong> 11 AM – 5 PM</span></div>
                    <div style={{ marginTop: "1.5rem" }}>
                      <a href="https://wa.me/919970809003?text=Hello%20Admissions%20Made%20Easy%0Amy%20name%20is%20" target="_blank" rel="noopener noreferrer" className="lp-btn-consult" style={{ fontSize: "1rem", padding: "0.9rem 1.75rem", background: "linear-gradient(135deg,#1ebe57,#128C7E)" }}>
                        <i className="fab fa-whatsapp"></i> CHAT ON WHATSAPP
                      </a>
                    </div>
                  </div>
                  <div className="lp-map-container">
                    <iframe src={branch.mapEmbed} allowFullScreen="" loading="lazy" title="Latur Office Location"></iframe>
                  </div>
                </div>
              ))}
              <div>
                <h3 className="lp-other-branches-title">Regional Branch Offices</h3>
                <div className="lp-branches-grid">
                  {BRANCHES.filter(b => !b.isMain).map(branch => (
                    <div className="lp-branch-card" key={branch.city}>
                      <h4><i className="fas fa-map-pin"></i> {branch.city} <span style={{ fontSize: "0.85rem", color: "#888", fontWeight: 400 }}>{branch.cityMar}</span></h4>
                      <div className="lp-branch-item"><i className="fas fa-location-dot"></i><span>{branch.address}</span></div>
                      {branch.phones.map(phone => (
                        <a href={`tel:${phone.replace(/\s+/g, "")}`} className="lp-branch-item" key={phone}><i className="fas fa-phone-alt"></i><span>{phone}</span></a>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FLOATING CTA ===== */}
        <a href="https://wa.me/919970809003?text=Hello%20Admissions%20Made%20Easy%0Amy%20name%20is%20" className="lp-floating-cta" aria-label="Chat on WhatsApp" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-whatsapp"></i>
        </a>

        {/* ===== FOOTER ===== */}
        <footer className="lp-footer">
          <div className="lp-container">
            <div className="lp-footer-grid">

              {/* Brand column */}
              <div className="lp-footer-brand">
                <img src="/landing-assets/images/branding/logo1.png" alt="Admissions Made Easy" className="lp-footer-brand-logo" />
                <p>Maharashtra's most trusted Medical & Engineering admissions consultancy. Guiding students and families since 2011 across 5 branches.</p>
                <div className="lp-social-links">
                  {[["fab fa-facebook-f", "https://www.facebook.com/admissionsmadeeasy"], ["fab fa-instagram", "https://www.instagram.com/admissionsmadeeasy"], ["fab fa-youtube", "https://www.youtube.com/@sachinbangad21"], ["fab fa-linkedin-in", "https://www.linkedin.com/company/admissions-made-easy"]].map(([icon, url]) => (
                    <a key={icon} href={url} className="lp-social-link" target="_blank" rel="noopener noreferrer"><i className={icon}></i></a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="lp-footer-col">
                <h5>Quick Links</h5>
                <ul className="lp-footer-links">
                  <li><a href="#lp-home"><i className="fas fa-chevron-right"></i> Home</a></li>
                  <li><a href="#lp-services"><i className="fas fa-chevron-right"></i> Our Services</a></li>
                  <li><a href="#lp-handbooks"><i className="fas fa-chevron-right"></i> Handbooks 2026</a></li>
                  <li><a href="#lp-process"><i className="fas fa-chevron-right"></i> Admission Process</a></li>
                  <li><a href="#lp-students"><i className="fas fa-chevron-right"></i> Our Results</a></li>
                  <li><a href="#lp-contact"><i className="fas fa-chevron-right"></i> Branches</a></li>
                </ul>
              </div>

              {/* Handbooks */}
              <div className="lp-footer-col">
                <h5>Downloads</h5>
                <ul className="lp-footer-links">
                  <li><a href="/landing-assets/handbooks/med-2026.pdf" download><i className="fas fa-file-pdf"></i> NEET UG 2026 Handbook</a></li>
                  <li><a href="/landing-assets/handbooks/engg-2026.pdf" download><i className="fas fa-file-pdf"></i> Engineering 2026 Handbook</a></li>
                  <li><a href="https://forms.gle/ns7NxapvAda6mEnBA" target="_blank" rel="noopener noreferrer"><i className="fas fa-calendar-check"></i> Book Free Counselling Session</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div className="lp-footer-col">
                <h5>Contact Us</h5>
                <div className="lp-footer-contact-item"><i className="fas fa-map-marker-alt"></i><span>Shivaji Nagar, Latur — 413512 (HQ)</span></div>
                <div className="lp-footer-contact-item"><i className="fas fa-phone"></i><span>+91 93095 53235<br />+91 99708 09003</span></div>
                <div className="lp-footer-contact-item"><i className="fas fa-envelope"></i><span>sachinbangad2020@gmail.com</span></div>
                <div className="lp-footer-contact-item"><i className="fas fa-clock"></i><span>Mon–Sat: 11AM – 9PM<br />Sunday: 11AM – 5PM</span></div>
              </div>

            </div>

            <div className="lp-footer-bottom">
              <p>© 2026 Admissions Made Easy, Latur. All Rights Reserved.</p>
              <div className="lp-footer-policy-links">
                <a href="#lp-home">Privacy Policy</a>
                <a href="#lp-home">Refund Policy</a>
                <a href="#lp-home">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
