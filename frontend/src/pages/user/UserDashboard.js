import { useEffect, useState } from "react";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { 
  ShieldCheck, 
  Clock, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  Plus,
  Zap,
  Activity,
  FileText,
  User,
  ArrowRight
} from "lucide-react";

const statusConfig = {
  Pending:      { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "Pending Review", icon: Clock },
  Investigating:{ color: "text-blue-600",  bg: "bg-blue-50",  border: "border-blue-100",  label: "In Progress",    icon: Search },
  Resolved:     { color: "text-emerald-600",bg: "bg-emerald-50", border: "border-emerald-100", label: "Resolved",       icon: CheckCircle },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-white shadow-hover p-4 rounded-[1.5rem]">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-xl font-black text-slate-900">{payload[0].value} Cases</p>
      </div>
    );
  }
  return null;
};

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [impact, setImpact] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    API.get("/complaints/my")
      .then(res => setComplaints(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    API.get("/users/impact")
      .then(res => setImpact(res.data))
      .catch(() => {});
  }, []);

  const total         = complaints.length;
  const pending       = complaints.filter(c => c.status === "Pending").length;
  const investigating = complaints.filter(c => c.status === "Investigating").length;
  const resolved      = complaints.filter(c => c.status === "Resolved").length;

  const chartData = [
    { status: "Pending",       count: pending,       fill: "#f59e0b" },
    { status: "Investigating", count: investigating, fill: "#3b82f6" },
    { status: "Resolved",      count: resolved,      fill: "#10b981" },
  ];

  const recent = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const statCards = [
    { label: "Reports Filed", value: total,   color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Resolved",      value: resolved, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active",        value: pending + investigating, color: "text-soft-teal", bg: "bg-soft-blue/50" }
  ];

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-soft-teal rounded-full animate-spin" />
            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syncing User Profile...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {/* 1. Header Greeting */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-[10px] font-black text-soft-teal tracking-widest uppercase mb-4 shadow-sm border border-white">
              <Zap size={14} className="fill-soft-teal" /> Network Access Verified
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
             {greeting}, <span className="text-soft-teal">{user?.name?.split(" ")[0]}</span>
           </h1>
           <p className="font-serif italic text-slate-600 text-lg font-medium tracking-tight mt-3">"Vigilance today means safety tomorrow."</p>
           <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] mt-5">
             {total === 0 ? "No active incidents reported in your sector." : `Managing ${total} intelligence reports.`}
           </p>
        </div>
        <button onClick={() => navigate("/submit-complaint")} className="bg-soft-teal text-white px-8 py-4 rounded-full font-black text-xs tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-3">
           <Plus size={18} /> FILE NEW REPORT
        </button>
      </div>

      {/* 2. Impact Banner */}
      {impact && impact.estimatedProtected > 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[3rem] mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-50">
                 <ShieldCheck size={32} />
              </div>
              <div>
                 <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter leading-none">Security Contribution</h4>
                 <p className="text-sm font-semibold text-emerald-600 mt-2 uppercase tracking-wide">
                    Estimated {impact.estimatedProtected} persons protected via your reports.
                 </p>
              </div>
           </div>
           <div className="hidden lg:block h-10 w-px bg-emerald-200" />
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:block">System integrity boosted</p>
        </div>
      )}

      {/* 3. Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12">
        {statCards.map(stat => (
          <div key={stat.label} className={`${stat.bg} p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-white transition-soft hover:shadow-soft`}>
            <div className={`text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2`}>{stat.value}</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 4. Multi-Section Grid */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Status Analysis */}
        <div className="bg-slate-50 p-10 rounded-[4rem] border border-slate-100 h-full">
           <h3 className="text-sm font-bold text-slate-600 tracking-wide mb-10 flex items-center gap-2">
              <Activity className="text-soft-teal" size={18} strokeWidth={3} /> Status Breakdown
           </h3>
           
           {total === 0 ? (
             <div className="h-48 flex flex-col items-center justify-center text-center">
                <FileText className="text-slate-200 mb-4" size={40} />
                <p className="text-xs font-semibold text-slate-500 capitalize tracking-wide">No Intelligence Data</p>
             </div>
           ) : (
             <div className="space-y-8">
               {Object.entries(statusConfig).map(([key, cfg]) => {
                 const count = complaints.filter(c => c.status === key).length;
                 const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                 return (
                   <div key={key}>
                     <div className="flex justify-between items-end mb-3">
                        <span className="text-sm font-bold text-slate-800 capitalize">{key}</span>
                        <span className="text-sm font-semibold text-slate-600">{count} Units</span>
                     </div>
                     <div className="w-full bg-white h-4 rounded-full overflow-hidden p-1 shadow-inner border border-slate-100">
                        <div className={`h-full rounded-full transition-all duration-1000 ${cfg.color.replace('text-', 'bg-')} shadow-sm`} style={{ width: `${pct}%` }} />
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
        </div>

        {/* Recent Cases */}
        <div className="bg-white p-10 rounded-[4rem] shadow-soft border border-slate-50 h-full flex flex-col">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-bold text-slate-600 tracking-wide">Recent Reports</h3>
              {total > 0 && (
                <button onClick={() => navigate("/my-complaints")} className="text-xs font-bold text-soft-teal hover:underline tracking-wide">View All</button>
              )}
           </div>

           {recent.length === 0 ? (
             <div className="flex-grow flex flex-col items-center justify-center text-center gap-6">
                <div className="w-20 h-20 bg-soft-blue rounded-[2rem] flex items-center justify-center text-soft-teal">
                   <ShieldCheck size={40} />
                </div>
                <p className="text-sm font-bold text-slate-500 tracking-wide">Clean Status: Zero Reports</p>
                <button onClick={() => navigate("/submit-complaint")} className="text-sm font-bold text-soft-teal hover:underline transition-all">File Your First Case</button>
             </div>
           ) : (
             <div className="space-y-6">
                {recent.map((c, i) => (
                  <div key={c._id} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate("/my-complaints")}>
                     <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${statusConfig[c.status]?.bg} ${statusConfig[c.status]?.border} ${statusConfig[c.status]?.color}`}>
                           {(() => {
                              const StatusIcon = statusConfig[c.status]?.icon || FileText;
                              return <StatusIcon size={20} />;
                           })()}
                        </div>
                        <div>
                           <div className="text-sm font-bold text-slate-900 tracking-tight capitalize">{c.caseId}</div>
                           <div className="text-xs font-semibold text-slate-500 capitalize mt-1">{c.crimeType}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="text-xs font-semibold text-slate-500 hidden md:block">
                           {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-soft-teal transition-all" size={20} />
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
      
      {/* 5. Quick Actions Section */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 group cursor-pointer hover:shadow-xl transition-all" onClick={() => navigate("/check-scam")}>
            <div className="w-16 h-16 bg-soft-teal rounded-3xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
               <Search size={32} />
            </div>
            <div>
               <h4 className="text-xl font-black text-white uppercase tracking-tighter">Global Integrity Scan</h4>
               <p className="text-sm font-medium text-slate-400 mt-2">Verify phone numbers, UPI IDs, or URLs against our database.</p>
            </div>
            <div className="ml-auto">
               <ArrowRight className="text-slate-700 group-hover:text-soft-teal" size={24} />
            </div>
         </div>
         
         <div className="bg-soft-blue p-10 rounded-[3rem] border border-white flex flex-col md:flex-row items-center gap-8 group cursor-pointer hover:shadow-xl transition-all" onClick={() => navigate("/trending")}>
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-soft-teal shrink-0 group-hover:scale-110 transition-transform shadow-sm">
               <Zap size={32} />
            </div>
            <div>
               <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Threat Advisories</h4>
               <p className="text-sm font-medium text-slate-500 mt-2">Browse recently detected patterns and public security alerts.</p>
            </div>
            <div className="ml-auto">
               <ArrowRight className="text-slate-300 group-hover:text-soft-teal" size={24} />
            </div>
         </div>
      </section>
    </UserLayout>
  );
}
