import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Phone, MapPin, Award, BookOpen, UserCircle, Edit3, ChevronDown, Check, Search, LogOut, ArrowRight } from "lucide-react";

// ─── Custom Select Component with Search ──────────────────────────────────────────────
function CustomSelect({ label, value, options, onChange, name, icon: Icon, placeholder, showSearch = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when opening/closing
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen, showSearch]);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLabel = options.find(opt => opt === value) || placeholder;

  return (
    <div className="relative" ref={dropdownRef} style={{ zIndex: isOpen ? 1000 : 1 }}>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 700, color: '#94a3b8',
        textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6, paddingLeft: 4
      }}>{label}</label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative group transition-all duration-300"
        style={{
          display: 'flex', alignItems: 'center', height: 48, width: '100%', borderRadius: 12,
          border: isOpen ? '2px solid #f39c12' : '1px solid rgba(255,255,255,0.1)', 
          background: isOpen ? '#0f172a' : 'rgba(15,23,42,0.5)',
          padding: Icon ? '0 16px 0 44px' : '0 16px', fontSize: 14, color: value ? '#f8fafc' : '#64748b', 
          fontWeight: 500, cursor: 'pointer', boxShadow: isOpen ? '0 0 20px rgba(243,156,18,0.2)' : 'none'
        }}
      >
        {Icon && <Icon className="absolute top-1/2 -translate-y-1/2 transition-colors" style={{ left: 14, height: 18, width: 18, color: isOpen ? '#f39c12' : '#94a3b8' }} />}
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#f39c12]' : 'text-[#94a3b8]'}`} />
      </div>

      {isOpen && (
        <div 
          className="absolute left-0 w-full mt-2 py-0 overflow-hidden"
          style={{ 
            backgroundColor: '#020617', 
            border: '2px solid #f39c12', 
            borderRadius: 14, 
            boxShadow: '0 30px 60px rgba(0,0,0,1)',
            maxHeight: 320,
            zIndex: 1001,
            opacity: 1
          }}
        >
          {showSearch && (
            <div className="p-2 border-b border-white/5 bg-white/[0.02] sticky top-0 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Type to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#f39c12]/50 placeholder:text-slate-600"
                />
              </div>
            </div>
          )}

          {/* Custom Scrollbar Style */}
          <style>{`
            .custom-scroll::-webkit-scrollbar { width: 4px; }
            .custom-scroll::-webkit-scrollbar-track { background: transparent; }
            .custom-scroll::-webkit-scrollbar-thumb { background: rgba(243,156,18,0.5); border-radius: 10px; }
          `}</style>
          
          <div className="custom-scroll overflow-y-auto max-h-[260px]" style={{ backgroundColor: '#020617', opacity: 1 }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange({ target: { name, value: opt } });
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-white/10"
                  style={{
                    color: value === opt ? '#f39c12' : '#f8fafc',
                    background: value === opt ? 'rgba(243,156,18,0.15)' : 'transparent',
                    fontWeight: value === opt ? 700 : 500,
                    fontSize: 13,
                    borderBottom: '1px solid rgba(255,255,255,0.03)'
                  }}
                >
                  {opt}
                  {value === opt && <Check className="h-4 w-4" />}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-xs text-slate-500">
                No matching results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicProfile() {
  const navigate = useNavigate();
  const { user, setUser, logout } = usePublicAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    neet_score: user?.neet_score || "",
    category: user?.category || "",
    gender: user?.gender || "",
    district: user?.district || "",
    special_reservation: user?.special_reservation || "",
  });

  const MAHARASHTRA_DISTRICTS = [
    "Ahmednagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur", 
    "Chhatrapati Sambhajinagar", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", 
    "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", 
    "Nandurbar", "Nashik", "Dharashiv", "Palghar", "Parbhani", "Pune", "Raigad", 
    "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal", "Other"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        neet_score: formData.neet_score ? parseInt(formData.neet_score) : null
      };
      const res = await api.put("/public/profile", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("ame_public_token")}` }
      });
      setUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    display: 'flex', height: 48, width: '100%', borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.5)',
    padding: '0 16px 0 44px', fontSize: 14, color: '#f8fafc', fontWeight: 500,
    outline: 'none', transition: 'all 0.3s'
  };

  const labelStyle = {
    display: 'block', fontSize: 10, fontWeight: 700, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6, paddingLeft: 4
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Card */}
      <div className="overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24 }}>
        <div className="absolute top-0 w-full" style={{ height: 128, background: 'linear-gradient(135deg, #f39c12, #d35400)', zIndex: 0 }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
        </div>
        
        <div className="px-6 pb-6 pt-20 relative flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left" style={{ zIndex: 1 }}>
          <div className="flex items-center justify-center text-4xl font-black" style={{ height: 112, width: 112, background: '#0f172a', color: '#f39c12', borderRadius: '50%', border: '4px solid #020617', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div className="mb-2">
            <h2 className="text-2xl font-bold" style={{ color: '#f8fafc' }}>{user?.full_name}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 font-medium mt-1 px-3 py-1 rounded-full w-fit mx-auto md:mx-0" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
              <Phone className="h-4 w-4" />
              {user?.phone}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 relative" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24 }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, background: 'rgba(243,156,18,0.05)', borderRadius: '50%', filter: 'blur(40px)' }} />
        
        <div className="flex items-center gap-3 pb-4 mb-6 relative" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', zIndex: 1 }}>
          <div style={{ padding: 8, background: 'rgba(243,156,18,0.1)', borderRadius: 8 }}>
            <Award className="h-6 w-6" style={{ color: '#f39c12' }} />
          </div>
          <div>
            <h3 className="font-bold text-xl" style={{ color: '#f8fafc' }}>Academic Identity</h3>
            <p className="text-xs" style={{ color: '#94a3b8' }}>This helps us personalize your Predictor and Cutoffs automatically.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative" style={{ zIndex: 20 }}>
          <div className="md:col-span-2">
            <label style={labelStyle}>Full Name</label>
            <div className="relative group">
              <UserCircle className="absolute top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#f39c12]" style={{ left: 14, height: 20, width: 20, color: '#94a3b8' }} />
              <input
                name="full_name"
                type="text"
                style={inputStyle}
                value={formData.full_name}
                onChange={handleChange}
                className="focus:border-[#f39c12] focus:ring-1 focus:ring-[#f39c12]/20"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Expected NEET Score</label>
            <div className="relative group">
              <Edit3 className="absolute top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#f39c12]" style={{ left: 14, height: 20, width: 20, color: '#94a3b8' }} />
              <input
                name="neet_score"
                type="number"
                placeholder="e.g. 650"
                style={inputStyle}
                value={formData.neet_score}
                onChange={handleChange}
                className="focus:border-[#f39c12] focus:ring-1 focus:ring-[#f39c12]/20"
              />
            </div>
          </div>

          <CustomSelect
            label="Gender"
            name="gender"
            value={formData.gender}
            options={["Male", "Female"]}
            placeholder="-- Select Gender --"
            onChange={handleChange}
          />

          <CustomSelect
            label="Category"
            name="category"
            value={formData.category}
            options={['OPEN', 'OBC', 'SC', 'ST', 'VJ', 'NTB', 'NTC', 'NTD', 'SEBC', 'EWS', 'SBC']}
            placeholder="-- Select Category --"
            onChange={handleChange}
            showSearch={true}
          />

          <CustomSelect
            label="Special Reservation"
            name="special_reservation"
            value={formData.special_reservation}
            options={['None', 'DEF 1', 'DEF 2', 'DEF 3', 'ORPHAN', 'PWD', 'HILLY AREA', 'MKB']}
            placeholder="-- Select Reservation --"
            onChange={handleChange}
            showSearch={true}
          />

          <div className="md:col-span-2">
            <CustomSelect
              label="District (Maharashtra)"
              name="district"
              icon={MapPin}
              value={formData.district}
              options={MAHARASHTRA_DISTRICTS}
              placeholder="-- Select District --"
              onChange={handleChange}
              showSearch={true}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 relative" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', zIndex: 1 }}>
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="flex items-center justify-center font-bold text-sm hover:scale-105 active:scale-95 transition-all"
            style={{ height: 48, borderRadius: 12, background: 'rgba(239, 68, 68, 0.1)', padding: '0 24px', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center font-bold text-sm hover:scale-105 active:scale-95 transition-all"
            style={{ height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f39c12, #d35400)', padding: '0 32px', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px rgba(243,156,18,0.3)', minWidth: 140, opacity: loading ? 0.5 : 1 }}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
          </button>
        </div>
      </form>

      {/* College Info Directory Coming Soon */}
      <div className="relative overflow-hidden p-8" style={{ background: 'linear-gradient(135deg, rgba(243,156,18,0.1), rgba(211,84,0,0.1))', border: '1px solid rgba(243,156,18,0.15)', borderRadius: 24 }}>
        <BookOpen className="absolute pointer-events-none" style={{ right: -32, bottom: -32, height: 192, width: 192, color: 'rgba(243,156,18,0.05)', transform: 'rotate(-15deg)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 2px 2px, rgba(243,156,18,0.05) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        
        <div className="relative" style={{ zIndex: 1 }}>
          <div className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
            Exclusive Feature • Live Now
          </div>
          <h3 className="font-extrabold text-2xl md:text-3xl mb-2" style={{ color: '#f8fafc' }}>
            College Information Directory
          </h3>
          <p className="max-w-lg leading-relaxed text-sm md:text-base" style={{ color: '#94a3b8' }}>
            Access a comprehensive, verified database of all medical and engineering colleges. Get insights on fee structures, hostel facilities, campus life, and real student reviews.
          </p>
          <button
            type="button"
            onClick={() => navigate('/app/colleges')}
            className="flex items-center justify-center font-bold text-sm hover:scale-105 active:scale-95 transition-all mt-6"
            style={{ height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #f39c12, #d35400)', padding: '0 24px', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(243,156,18,0.2)', width: 'fit-content' }}
          >
            Explore Colleges <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
