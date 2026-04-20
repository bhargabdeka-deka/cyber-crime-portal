import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Layout from "../../components/Layout";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import { Shield, AlertTriangle, CheckCircle, Clock, BarChart2, List, ChevronRight, Zap } from "lucide-react";

const COLORS = ["#06B2B2", "#f59e0b", "#10b981", "#ef4444", "#6366f1", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-white shadow-hover p-4 rounded-[1.5rem]">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{label}</p>
        <p className="text-xl font-black text-slate-900">{payload[0].value} Cases</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") { navigate("/login"); return; }

    API.get("/complaints/analytics")
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-soft-teal rounded-full animate-spin" />
            <p className="mt-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Analyzing Data Nodes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout>
        <div className="text-center py-20 bg-rose-50/50 rounded-[3rem] border border-rose-100">
          <AlertTriangle className="mx-auto text-rose-500 mb-4" size={40} />
          <p className="text-rose-900 font-black uppercase tracking-tighter text-xl">Connection Interrupted</p>
          <p className="text-rose-600 text-xs font-semibold mt-2 uppercase tracking-widest">Failed to communicate with intelligence server</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-rose-600 text-white px-10 py-4 rounded-full font-black text-sm tracking-widest shadow-lg shadow-rose-200">RETRY SYNC</button>
        </div>
      </Layout>
    );
  }

  const total    = stats.statusDistribution?.reduce((s, i) => s + i.count, 0) || 0;
  const resolved = stats.statusDistribution?.find(s => s.status === "Resolved")?.count || 0;
  const invest   = stats.statusDistribution?.find(s => s.status === "Investigating")?.count || 0;

  const summaryStats = [
    { label: "Total Reports", value: total, icon: List, bg: "bg-blue-50", text: "text-blue-600" },
    { label: "Resolved", value: resolved, icon: CheckCircle, bg: "bg-emerald-50", text: "text-emerald-600" },
    { label: "In Progress", value: invest, icon: Clock, bg: "bg-indigo-50", text: "text-indigo-600" },
    { label: "Critical Risk", value: stats.criticalCases || 0, icon: AlertTriangle, bg: "bg-rose-50", text: "text-rose-600" },
  ];

  return (
    <Layout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Operations Analytics</h1>
           <p className="font-serif italic text-slate-600 text-lg font-medium tracking-tight mt-3">"Data Driven Intelligence for a Secure Tomorrow"</p>
           <div className="flex items-center gap-3 mt-5">
              <div className="h-1 w-12 bg-soft-teal rounded-full" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Sector 7G Intelligence Feed</p>
           </div>
        </div>
        <div className="flex items-center gap-4 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full border border-emerald-100">
           <Zap className="fill-emerald-500 text-emerald-500" size={16} />
           <span className="text-[10px] font-black uppercase tracking-widest">System Optimization Active</span>
        </div>
      </div>

      {/* Critical Alert Pin */}
      {stats.criticalCases > 0 && (
        <div className="bg-rose-600 text-white p-8 rounded-[2.5rem] mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-rose-200 overflow-hidden relative">
          <div className="relative z-10 flex items-center gap-6">
             <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                <AlertTriangle className="text-white" size={28} />
             </div>
             <div>
                <h4 className="text-xl font-black uppercase tracking-tighter leading-none">High-Risk Detection Alert</h4>
                <p className="text-sm font-semibold opacity-80 mt-2">{stats.criticalCases} cases require immediate triage (Risk Factor > 80%).</p>
             </div>
          </div>
          <button onClick={() => navigate("/complaints")} className="relative z-10 bg-white text-rose-600 px-10 py-5 rounded-full font-black text-sm tracking-widest hover:scale-105 transition-all">
            TRIAGE NOW
          </button>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
        </div>
      )}

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
        {summaryStats.map(stat => (
          <div key={stat.label} className={`${stat.bg} p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] transition-soft hover:scale-105 cursor-default border border-white/50`}>
            <div className="bg-white/60 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
               <stat.icon className={stat.text} size={20} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div className={`text-3xl md:text-4xl font-black text-slate-900 tracking-tighter`}>{stat.value}</div>
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Main Trend Card */}
          <div className="bg-slate-50 p-10 rounded-[4rem] border border-slate-100">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <BarChart2 className="text-soft-teal" size={16} /> Flux Pattern Analysis
               </h3>
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">6 Month Matrix</span>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyTrend}>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#06B2B2" 
                    strokeWidth={5} 
                    dot={{ fill: '#fff', stroke: '#06B2B2', strokeWidth: 3, r: 6 }} 
                    activeDot={{ r: 9, fill: '#06B2B2', stroke: '#fff', strokeWidth: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Status Pill Bars */}
            <div className="bg-slate-50 p-10 rounded-[4rem] border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 mb-10">State Distribution</h3>
              <div className="space-y-8">
                {stats.statusDistribution?.map((item, i) => {
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                  const colors = {
                    Pending: 'bg-orange-400 shadow-orange-100',
                    Investigating: 'bg-indigo-500 shadow-indigo-100',
                    Resolved: 'bg-emerald-500 shadow-emerald-100'
                  };
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-end mb-3 px-2">
                         <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{item.status}</span>
                         <span className="text-sm font-black text-slate-900">{pct}%</span>
                      </div>
                      <div className="w-full bg-white h-4 rounded-full overflow-hidden p-1 shadow-inner">
                        <div className={`h-full rounded-full transition-all duration-1000 ${colors[item.status] || 'bg-slate-400'} shadow-lg`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Categorization Bubble List */}
            <div className="bg-slate-900 text-white p-10 rounded-[4rem] shadow-soft relative overflow-hidden">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-soft-teal mb-10 relative z-10">Top Threat Vectors</h3>
              <div className="space-y-4 relative z-10">
                 {stats.crimeDistribution?.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                       <span className="text-xs font-bold text-slate-200 uppercase tracking-tight">{item.crimeType}</span>
                       <span className="text-sm font-black text-soft-teal">{item.count}</span>
                    </div>
                 ))}
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-soft-teal/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-10">
           <div className="bg-soft-teal text-white p-10 rounded-[4rem] shadow-lg shadow-soft-teal/20">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                 <Shield size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-6">Security <br/>Assurance</h3>
              <p className="text-sm font-medium text-white/80 leading-relaxed mb-10">
                Independent node monitoring verified <span className="font-black text-white">{total}</span> unique patterns. 
              </p>
              <div className="space-y-5">
                 {[
                   { l: "Security", v: "Verified", b: "bg-blue-400" },
                   { l: "Protocol", v: "AES-256", b: "bg-indigo-400" }
                 ].map(line => (
                   <div key={line.l} className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{line.l}</span>
                     <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${line.b} text-slate-900`}>{line.v}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-[#FEF9C3] p-10 rounded-[4rem] border border-yellow-200">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-700 mb-10">Priority Map</h3>
              <div className="h-[250px] mt-[-20px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={stats.priorityDistribution} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="priority" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#854d0e', fontSize: 11, fontWeight: 900 }}
                        width={70}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                      <Bar dataKey="count" radius={[0, 20, 20, 0]}>
                        {stats.priorityDistribution?.map((entry, index) => (
                           <Cell key={index} fill={entry.priority === 'Critical' ? '#ef4444' : entry.priority === 'High' ? '#f59e0b' : '#3b82f6'} shadow="0 4px 10px rgba(0,0,0,0.1)" />
                        ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
}
