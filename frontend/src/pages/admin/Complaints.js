import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { 
  Search, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  X, 
  ExternalLink,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_URL;

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const statusConfig = {
  Pending:       { label: "Pending",     color: "text-amber-600 bg-amber-50 border-amber-100", icon: Clock },
  Investigating: { label: "In Progress", color: "text-blue-600 bg-blue-50 border-blue-100", icon: Search },
  Resolved:      { label: "Resolved",    color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle },
};

const priorityConfig = {
  Critical: { color: "text-rose-600 bg-rose-50 border-rose-100" },
  High:     { color: "text-orange-600 bg-orange-50 border-orange-100" },
  Medium:   { color: "text-blue-600 bg-blue-50 border-blue-100" },
  Low:      { color: "text-slate-500 bg-slate-50 border-slate-200" },
};

const STEPS = ["Pending", "Investigating", "Resolved"];

export default function Complaints() {
  const [complaints, setComplaints]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalCount, setTotalCount]     = useState(0);
  const [priorityFilter, setPriority]   = useState("");
  const [statusFilter, setStatus]       = useState("");
  const [search, setSearch]             = useState("");
  const [sort, setSort]                 = useState("-createdAt");
  const [selected, setSelected]         = useState(null);
  const [updating, setUpdating]         = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/complaints", {
        params: { page, limit: 12, priority: priorityFilter, status: statusFilter, search, sort }
      });
      setComplaints(res.data.complaints);
      setTotalPages(res.data.pages);
      setTotalCount(res.data.total || 0);
    } catch {
      showToast("Server communication error", "error");
    } finally {
      setLoading(false);
    }
  }, [page, priorityFilter, statusFilter, search, sort]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await API.put(`/complaints/${id}/status`, { status: newStatus });
      showToast(`Case ${id.slice(-6).toUpperCase()} updated to ${newStatus}`);
      fetchComplaints();
      if (selected?._id === id) setSelected(prev => ({ ...prev, status: newStatus }));
    } catch {
      showToast("Update authorization failed", "error");
    } finally {
      setUpdating(null);
    }
  };

  const resetFilters = () => {
    setPriority(""); setStatus(""); setSearch(""); setSort("-createdAt"); setPage(1);
  };

  return (
    <Layout>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-12 right-12 z-[150] px-8 py-5 rounded-[2rem] shadow-hover border-2 flex items-center gap-4 animate-in fade-in slide-in-from-right-10 duration-500 ${toast.type === "success" ? "bg-white border-emerald-50 text-emerald-900" : "bg-white border-rose-50 text-rose-900"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
            {toast.type === "success" ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          </div>
          <span className="text-xs font-black uppercase tracking-widest">{toast.msg}</span>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
           <div className="inline-flex items-center gap-2 bg-soft-blue px-4 py-1.5 rounded-full text-[10px] font-black text-soft-teal tracking-widest uppercase mb-4">
              <Activity size={14} /> Intelligence Index
           </div>
           <h1 className="text-4xl font-bold font-brand text-slate-900 tracking-[-0.5px] uppercase leading-none">Incident Log</h1>
           <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] mt-3">{totalCount} Record Entries</p>
        </div>
        <div className="flex gap-4">
          <a href={`${process.env.REACT_APP_API_URL || ""}/api/complaints/export/csv`}
            className="bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest px-8 py-4 flex items-center gap-3 hover:brightness-110 transition-all shadow-lg">
            <Download size={16} /> Export CSV
          </a>
        </div>
      </div>

      {/* Filter Pillbox */}
      <div className="bg-slate-50 p-4 md:p-6 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 flex flex-col lg:flex-row lg:items-center gap-4 mb-8 md:mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Case ID or Keyword..." 
            value={search}
            onChange={e => { setPage(1); setSearch(e.target.value); }}
            className="w-full bg-white border border-transparent pl-14 pr-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest focus:border-soft-teal/20 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-between lg:justify-end">
          <div className="grid grid-cols-2 sm:flex items-center gap-3 md:gap-4 w-full sm:w-auto">
            {[
              { value: priorityFilter, setter: setPriority, options: [["", "Priorities"], ["Critical", "Critical"], ["High", "High"], ["Medium", "Medium"], ["Low", "Low"]] },
              { value: statusFilter,   setter: setStatus,   options: [["", "Statuses"], ["Pending", "Pending"], ["Investigating", "Investigating"], ["Resolved", "Resolved"]] },
            ].map((sel, i) => (
              <select 
                key={i} 
                value={sel.value} 
                onChange={e => { setPage(1); sel.setter(e.target.value); }}
                className="flex-grow sm:flex-none bg-white border border-transparent px-4 md:px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-widest focus:border-soft-teal/20 outline-none cursor-pointer shadow-sm appearance-none"
              >
                {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select 
              value={sort} 
              onChange={e => { setPage(1); setSort(e.target.value); }}
              className="flex-grow sm:flex-none bg-white border border-transparent px-4 md:px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-widest focus:border-soft-teal/20 outline-none cursor-pointer shadow-sm appearance-none"
            >
              {[["-createdAt", "Newest"], ["createdAt", "Oldest"], ["-riskScore", "High Risk"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            
            {(priorityFilter || statusFilter || search) && (
              <button onClick={resetFilters} className="shrink-0 w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors shadow-sm">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-soft-teal rounded-full animate-spin" />
              <p className="mt-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Syncing Archives...</p>
           </div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-slate-50 rounded-[4rem] py-32 text-center border border-slate-100 px-6">
          <div className="inline-flex w-20 h-20 bg-white rounded-3xl items-center justify-center mb-8 shadow-soft">
             <FileText className="text-slate-200" size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 uppercase">No Matches Found</h3>
          <p className="text-sm font-medium text-slate-600 mt-2 uppercase tracking-widest">Adjust your scan parameters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] md:rounded-[3rem] border border-slate-100 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-0">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="py-6 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-500">ID / Case</th>
                    <th className="py-6 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Subject</th>
                    <th className="py-6 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Classification</th>
                    <th className="py-6 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Rank/Score</th>
                    <th className="py-6 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Protocol Status</th>
                    <th className="py-6 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Intel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {complaints.map((c) => (
                    <tr 
                      key={c._id} 
                      onClick={() => setSelected(c)}
                      className="hover:bg-white cursor-pointer transition-all group"
                    >
                      <td className="py-6 px-6 md:px-8">
                        <div className="text-xs font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap">{c.caseId.slice(0, 14)}...</div>
                        <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-6 px-6 md:px-8">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-400 uppercase shrink-0">
                               {c.user?.name?.[0]}
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 uppercase truncate max-w-[120px]">{c.user?.name || "REDACTED"}</span>
                         </div>
                      </td>
                      <td className="py-6 px-6 md:px-8">
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{c.crimeType}</span>
                      </td>
                      <td className="py-6 px-6 md:px-8">
                         <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${priorityConfig[c.priority]?.color || 'bg-slate-50'}`}>
                              {c.priority}
                            </span>
                            <span className={`text-[13px] font-black ${c.riskScore >= 80 ? 'text-rose-500' : 'text-slate-900'}`}>
                              {c.riskScore}
                            </span>
                         </div>
                      </td>
                      <td className="py-6 px-6 md:px-8 text-center" onClick={e => e.stopPropagation()}>
                         <select 
                           value={c.status} 
                           disabled={updating === c._id}
                           onChange={e => handleStatusChange(c._id, e.target.value)}
                           className={`text-[9px] font-black uppercase px-4 py-2 rounded-full border outline-none cursor-pointer transition-all ${statusConfig[c.status]?.color || 'bg-white'}`}
                         >
                           {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                      </td>
                      <td className="py-6 px-6 md:px-8 text-right">
                         <div className="inline-flex w-10 h-10 rounded-full bg-slate-50 border border-slate-100 items-center justify-center text-slate-400 group-hover:text-soft-teal group-hover:bg-white group-hover:shadow-sm transition-all">
                            <ChevronRight size={18} />
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-12 px-8">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Matrix Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm disabled:opacity-30 hover:text-soft-teal transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="px-8 h-12 flex items-center bg-white rounded-2xl shadow-sm text-[10px] font-black uppercase tracking-widest">
                   {page}
                </div>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm disabled:opacity-30 hover:text-soft-teal transition-all"
                >
                   <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
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
                     <div className="w-14 h-14 bg-soft-teal rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-soft-teal/20">
                        <FileText size={28} />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black tracking-tighter uppercase leading-none text-slate-900">{selected.caseId}</h3>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-3">Incident Payload Log</p>
                     </div>
                  </div>
                  <div className="h-1 w-20 bg-soft-teal/20 rounded-full" />
               </div>

               <div className="grid md:grid-cols-2 gap-16">
                  <div className="space-y-12">
                     <section>
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Subject Attribution</h4>
                        <div className="bg-slate-50 p-6 rounded-[2rem] flex items-center gap-5 border border-white">
                           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-soft-teal text-xl shadow-soft">
                              {selected.user?.name?.[0]}
                           </div>
                           <div>
                              <div className="text-lg font-black text-slate-800 uppercase tracking-tighter">{selected.user?.name}</div>
                              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">{selected.user?.email}</div>
                           </div>
                        </div>
                     </section>

                     <section>
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Classification Data</h4>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-slate-50 p-6 rounded-[2rem] border border-white">
                              <div className="text-[9px] font-black text-slate-600 uppercase mb-2">Category</div>
                              <div className="text-sm font-black text-slate-800 uppercase">{selected.crimeType}</div>
                           </div>
                           <div className="bg-slate-50 p-6 rounded-[2rem] border border-white">
                              <div className="text-[9px] font-black text-slate-600 uppercase mb-2">Priority</div>
                              <div className="text-sm font-black text-soft-teal uppercase">{selected.priority}</div>
                           </div>
                        </div>
                     </section>

                     <section>
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Workflow Status</h4>
                        <div className="flex gap-3 bg-slate-50 p-3 rounded-full border border-white">
                           {STEPS.map(step => {
                             const active = selected.status === step;
                             return (
                               <button 
                                 key={step} 
                                 onClick={() => handleStatusChange(selected._id, step)}
                                 disabled={active || updating === selected._id}
                                 className={`flex-grow h-12 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:text-slate-900'}`}
                               >
                                 {step}
                               </button>
                             );
                           })}
                        </div>
                     </section>
                  </div>

                  <div className="space-y-12">
                     <section>
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Description Payload</h4>
                        <div className="bg-soft-blue/20 p-8 rounded-[2.5rem] border border-white text-sm font-semibold leading-relaxed text-slate-600">
                           "{selected.description}"
                        </div>
                     </section>

                     {selected.evidence && (
                       <section>
                          <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Visual Evidence</h4>
                          <div className="relative group rounded-[3rem] overflow-hidden shadow-soft border-4 border-white">
                             <img src={buildImageUrl(selected.evidence)} alt="Evidence" className="w-full transition-transform duration-700 group-hover:scale-110" />
                             <a 
                               href={buildImageUrl(selected.evidence)} 
                               target="_blank" 
                               rel="noreferrer"
                               className="absolute inset-0 bg-soft-teal/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500"
                             >
                                <div className="bg-white text-soft-teal px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                                   Open Evidence
                                </div>
                             </a>
                          </div>
                       </section>
                     )}
                     
                     <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-white">
                        <div>
                           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Created At</div>
                           <div className="text-[11px] font-black uppercase text-slate-500">{new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Security Score</div>
                           <div className="text-xl font-black text-slate-900 tracking-tighter">{selected.riskScore}</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
