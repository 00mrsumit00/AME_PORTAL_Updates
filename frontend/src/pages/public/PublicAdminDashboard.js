import { useState, useEffect } from "react";
import { usePublicAdmin } from "@/contexts/PublicAdminAuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { Users, UserCheck, UserX, TrendingUp, Shield, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AMBER = "#f39c12";
const CHART_COLORS = ["#f39c12", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#eab308", "#64748b", "#f97316", "#14b8a6"];
const cardStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 };
const tooltipStyle = { backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f8fafc', fontSize: 12 };

export default function PublicAdminDashboard() {
  const { authHeader } = usePublicAdmin();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/public-admin/dashboard", authHeader());
        setData(res.data);
      } catch (err) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);// eslint-disable-line

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: AMBER }} />
    </div>
  );

  if (!data) return null;

  const genderPie = Object.entries(data.gender_distribution || {}).map(([k, v]) => ({ name: k, value: v }));
  const categoryPie = Object.entries(data.category_distribution || {}).map(([k, v]) => ({ name: k, value: v }));
  const districtBar = Object.entries(data.district_distribution || {}).map(([k, v]) => ({ name: k, value: v }));
  const scoreBar = (data.score_distribution || []).map(d => ({
    name: d.range < 200 ? "0-200" : d.range < 300 ? "200-300" : d.range < 400 ? "300-400" : d.range < 500 ? "400-500" : d.range < 600 ? "500-600" : d.range < 700 ? "600-700" : "700+",
    count: d.count
  }));

  const StatCard = ({ icon: Icon, label, value, color, sub }) => (
    <div className="p-5 flex items-start gap-4 group hover:scale-[1.02] transition-transform" style={cardStyle}>
      <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: '#64748b' }}>{label}</p>
        <p className="text-3xl font-black mt-1 leading-none" style={{ color: '#f8fafc' }}>{value}</p>
        {sub && <p className="text-xs mt-1 font-medium" style={{ color: '#64748b' }}>{sub}</p>}
      </div>
    </div>
  );

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#f8fafc" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: '#f8fafc' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Public Student Portal Analytics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={data.total_users} color="#f39c12" />
        <StatCard icon={UserCheck} label="Active" value={data.active_users} color="#10b981" />
        <StatCard icon={UserX} label="Disabled" value={data.disabled_users} color="#ef4444" />
        <StatCard icon={TrendingUp} label="Last 7 Days" value={data.recent_registrations} color="#3b82f6" sub="New registrations" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Pie */}
        <div className="p-6" style={cardStyle}>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#94a3b8' }}>Gender Distribution</h3>
          {genderPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={genderPie} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" labelLine={false} label={CustomPieLabel}>
                  {genderPie.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-center py-16" style={{ color: '#64748b' }}>No data yet</p>}
        </div>

        {/* Category Pie */}
        <div className="p-6" style={cardStyle}>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#94a3b8' }}>Category Distribution</h3>
          {categoryPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryPie} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" labelLine={false} label={CustomPieLabel}>
                  {categoryPie.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-center py-16" style={{ color: '#64748b' }}>No data yet</p>}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NEET Score Bar */}
        <div className="p-6" style={cardStyle}>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#94a3b8' }}>NEET Score Distribution</h3>
          {scoreBar.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={scoreBar}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {scoreBar.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-center py-16" style={{ color: '#64748b' }}>No data yet</p>}
        </div>

        {/* District Bar */}
        <div className="p-6" style={cardStyle}>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#94a3b8' }}>Top Districts</h3>
          {districtBar.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={districtBar} layout="vertical">
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={120} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#f39c12" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-center py-16" style={{ color: '#64748b' }}>No data yet</p>}
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 flex items-center gap-4" style={cardStyle}>
          <Shield className="h-8 w-8" style={{ color: '#3b82f6' }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>Sub-Admins</p>
            <p className="text-2xl font-black" style={{ color: '#f8fafc' }}>{data.sub_admin_count}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
