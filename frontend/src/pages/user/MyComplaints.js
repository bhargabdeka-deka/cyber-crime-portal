import { useEffect, useState } from "react";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  ChevronRight, 
  Search, 
  X, 
  Activity, 
  LayoutList, 
  ShieldCheck, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Zap,
  Filter,
  Download
} from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_URL;

const statusMeta = {
  Pending:       { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: Clock },
  Investigating: { color: "text-blue-600",bg: "bg-blue-50", border: "border-blue-100", icon: Search },
  Resolved:      { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: CheckCircle },
};

const priorityMeta = {
  Critical: { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  High:     { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
  Medium:   { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  Low:      { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
};

const riskMeta = (score) => {
  if (score >= 80) return { label: "High",   color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" };
  if (score >= 50) return { label: "Medium", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" };
  return               { label: "Low",    color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" };
};

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const STEPS = ["Pending", "Investigating", "Resolved"];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/complaints/my")
      .then(res => setComplaints(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openDetails = async (id) => {
    try {
      const res = await API.get(`/complaints/${id}`);
      setSelected(res.data);
    } catch {}
  };

  const filtered = filter === "All" ? complaints : complaints.filter(c => c.status === filter);

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-soft-teal rounded-full animate-spin" />
            <p className="mt-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Accessing Incident Database...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="inline-flex items-center gap-2 bg-soft-blue px-4 py-1.5 rounded-full text-xs font-semibold text-soft-teal tracking-wide mb-4 border border-slate-100 shadow-sm">
              <LayoutList size={14} /> User Record Archive
           </div>
           <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 tracking-tight leading-none">My Reports</h1>
           <p className="text-sm font-medium font-serif text-slate-500 tracking-wide mt-4">{complaints.length} Records Verified</p>
        </div>
        <button onClick={() => navigate("/submit-complaint")} className="bg-slate-900 text-white rounded-full text-sm font-semibold tracking-wide px-8 py-4 flex items-center gap-3 hover:shadow-lg hover:bg-soft-teal hover:shadow-soft-teal/40 transition-all">
           <Plus size={16} /> New Report
        </button>
      </div>

      {/* Filter Matrix */}
      {complaints.length > 0 && (
        <div className="bg-slate-50 p-6 rounded-[3rem] border border-slate-100 flex flex-wrap items-center gap-3 mb-10 shadow-sm">
           <Filter className="text-slate-600 ml-4 hidden md:block" size={18} />
           {["All", "Pending", "Investigating", "Resolved"].map(f => {
             const active = filter === f;
             return (
               <button 
                 key={f} 
                 onClick={() => setFilter(f)}
                 className={`px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all ${active ? 'bg-soft-teal text-white shadow-lg' : 'text-slate-600 hover:text-slate-700'}`}
               >
                 {f} <span className="opacity-40 ml-2">[{f === "All" ? complaints.length : complaints.filter(c => c.status === f).length}]</span>
               </button>
             );
           })}
        </div>
      )}

      {/* Content Area */}
      {complaints.length === 0 ? (
        <div className="bg-slate-50 rounded-[4rem] py-32 text-center border border-slate-100">
          <div className="inline-flex w-24 h-24 bg-white rounded-[2rem] items-center justify-center mb-8 shadow-soft">
             <ShieldCheck className="text-slate-200" size={48} />
          </div>
          <h3 className="text-xl font-black text-slate-800 uppercase">Archived Index Empty</h3>
          <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest">You have zero recorded incidents.</p>
          <button onClick={() => navigate("/submit-complaint")} className="mt-10 bg-soft-teal text-white px-10 py-4 rounded-full font-black text-xs tracking-widest hover:scale-105 transition-all">FILE COMPLAINT</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-50 rounded-[3rem] py-20 text-center border border-slate-100 font-bold uppercase tracking-widest text-slate-500">
           No matching logs found.
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map(c => {
            const sm = statusMeta[c.status] || statusMeta.Pending;
            const pm = priorityMeta[c.priority] || priorityMeta.Low;
            const rm = riskMeta(c.riskScore);
            return (
              <div 
                key={c._id} 
                onClick={() => openDetails(c._id)}
                className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-soft hover:shadow-hover transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-4">
                       <span className="text-sm font-black text-slate-900 tracking-tighter uppercase">{c.caseId}</span>
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${pm.bg} ${pm.color} ${pm.border}`}>{c.priority}</span>
                    </div>
                    <div className="text-lg font-bold text-slate-700 tracking-tight leading-tight mb-2 group-hover:text-soft-teal transition-colors">{c.title}</div>
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                       {c.crimeType} • {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`px-5 py-3 rounded-full text-[10px] font-black uppercase ${rm.color} ${rm.bg} border ${rm.border}`}>
                       Risk Factor: {c.riskScore}
                    </div>
                    <div className={`px-5 py-3 rounded-full text-[10px] font-black uppercase ${sm.color} ${sm.bg} border ${sm.border} flex items-center gap-2`}>
                       <sm.icon size={14} /> {c.status}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-soft-teal/20 group-hover:text-soft-teal transition-all hidden md:flex">
                       <ChevronRight size={22} />
                    </div>
                  </div>
                </div>

                {/* Tracking Bar */}
                <div className="mt-8 flex items-center gap-2">
                   {STEPS.map((step, i) => {
                     const stepIdx = STEPS.indexOf(c.status);
                     const done = i <= stepIdx;
                     const current = i === stepIdx;
                     return (
                       <div key={step} className="flex-grow h-2 rounded-full relative bg-slate-50 overflow-hidden">
                          <div className={`absolute inset-0 transition-all duration-1000 ${done ? sm.bg.replace('bg-', 'bg-') : 'bg-transparent'} ${done ? (current ? 'brightness-100' : 'brightness-90 opacity-40') : ''} ${current ? sm.bg.replace('bg-', 'bg-').replace('50', '500') : ''}`} style={{ width: done ? '100%' : '0%' }} />
                       </div>
                     );
                   })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-900/10 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelected(null)}>
          <div className="w-full max-w-4xl bg-white shadow-hover p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 md:top-10 md:right-10 w-10 h-10 md:w-12 md:h-12 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all">
               <X size={20} />
            </button>

            <div className="flex-grow overflow-y-auto pr-6 custom-scrollbar">
               <div className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-14 h-14 bg-soft-teal rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <FileText size={28} />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black tracking-tighter uppercase leading-none text-slate-900">{selected.caseId}</h3>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-3">Personal Case File</p>
                     </div>
                  </div>
                  <div className="h-1 w-20 bg-soft-teal/20 rounded-full" />
               </div>

               <div className="grid md:grid-cols-2 gap-10 md:gap-16">
                  <div className="space-y-8 md:space-y-12">
                     <section>
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 md:mb-6">Threat Summary</h4>
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-white">
                           <div className="text-lg font-black text-slate-800 uppercase tracking-tighter mb-4">{selected.title}</div>
                           <div className="flex gap-2 flex-wrap">
                              <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase ${statusMeta[selected.status].bg} ${statusMeta[selected.status].color} border ${statusMeta[selected.status].border}`}>
                                 {selected.status}
                              </span>
                              <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase ${priorityMeta[selected.priority].bg} ${priorityMeta[selected.priority].color} border ${priorityMeta[selected.priority].border}`}>
                                 {selected.priority}
                              </span>
                           </div>
                        </div>
                     </section>

                     <section>
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Description Payload</h4>
                        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 text-sm font-semibold leading-relaxed text-slate-600 shadow-sm">
                           "{selected.description}"
                        </div>
                     </section>
                  </div>

                  <div className="space-y-12">
                     <section>
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Status Timeline</h4>
                        <div className="flex gap-2 p-2 bg-slate-50 rounded-full border border-white">
                          {STEPS.map((step, i) => {
                            const stepIdx = STEPS.indexOf(selected.status);
                            const done = i <= stepIdx;
                            return (
                              <div key={step} className={`flex-grow h-12 rounded-full flex items-center justify-center transition-all ${done ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 font-bold'}`}>
                                 <span className="text-[10px] font-black uppercase">{step}</span>
                              </div>
                            );
                          })}
                        </div>
                     </section>

                     {selected.evidence && (
                       <section>
                          <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Logged Evidence</h4>
                          <div className="relative group rounded-[3rem] overflow-hidden shadow-soft border-4 border-white">
                             <img src={buildImageUrl(selected.evidence)} alt="Evidence" className="w-full grayscale transition-all duration-700 group-hover:grayscale-0" />
                             <a 
                               href={buildImageUrl(selected.evidence)} 
                               target="_blank" 
                               rel="noreferrer"
                               className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500"
                             >
                                <div className="bg-white text-slate-900 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest">Open Evidence</div>
                             </a>
                          </div>
                          <a href={buildImageUrl(selected.evidence)} download className="mt-6 flex items-center gap-3 text-[10px] font-black text-soft-teal tracking-widest uppercase hover:underline">
                             <Download size={14} /> Download File Metadata
                          </a>
                       </section>
                     )}
                     
                     <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-white">
                        <div>
                           <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Filed Date</div>
                           <div className="text-[11px] font-black uppercase text-slate-900">{new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Risk Rating</div>
                           <div className={`text-xl font-black tracking-tighter ${riskMeta(selected.riskScore).color}`}>{selected.riskScore}</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
