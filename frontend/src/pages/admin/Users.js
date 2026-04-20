import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { Users as UsersIcon, Search, User, Shield, CheckCircle, ChevronRight, Activity, Calendar, Mail } from "lucide-react";

export default function Users() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]     = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/users", { params: { page, limit: 15, search } });
      setUsers(res.data.users);
      setTotal(res.data.total);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("USER_FETCH_FAILURE", err);
    } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const initials = (name) => name ? name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "U";

  return (
    <Layout>
      {/* Header Matrix */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
           <div className="inline-flex items-center gap-2 bg-soft-blue px-4 py-1.5 rounded-full text-[10px] font-black text-soft-teal tracking-widest uppercase mb-4">
              <UsersIcon size={14} /> Identity Registry
           </div>
           <h1 className="text-4xl font-bold font-brand text-slate-900 tracking-[-0.5px] uppercase leading-none">Registered Nodes</h1>
           <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] mt-3">{total} Authenticated Users</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-md px-6 py-4 rounded-[2.5rem] border border-white flex items-center gap-6 shadow-soft">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Network Operational</span>
           </div>
        </div>
      </div>

      {/* Control Module */}
      <div className="bg-slate-50 p-6 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row items-center gap-4 mb-10 shadow-sm">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH BY IDENTITY NAME OR EMAIL ADDR..." 
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white pl-14 pr-6 py-4 rounded-full border border-transparent focus:border-soft-teal/20 focus:outline-none text-xs font-black uppercase tracking-widest transition-all shadow-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-soft-teal rounded-full animate-spin" />
              <p className="mt-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Synchronizing Registry...</p>
           </div>
        </div>
      ) : (
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="bg-slate-50 rounded-[3rem] py-24 text-center border border-slate-100 flex flex-col items-center">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-soft border border-slate-50">
                  <User className="text-slate-300" size={32} />
               </div>
               <h3 className="text-lg font-black text-slate-900 uppercase">No Identity Match</h3>
               <p className="text-[10px] font-black text-slate-500 mt-2 uppercase tracking-widest leading-relaxed">Adjust your scan parameters or verify registry connectivity.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {users.map((u) => (
                <div key={u._id} className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border border-white shadow-soft hover:shadow-hover transition-all group">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      
                      {/* Identity Bar */}
                      <div className="flex items-center gap-6">
                         <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center shrink-0 shadow-lg text-xl font-black transform transition-transform group-hover:-rotate-6 ${u.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-soft-blue text-soft-teal'}`}>
                            {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover rounded-[1.8rem]" /> : initials(u.name)}
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{u.name}</h3>
                               {u.role === 'admin' && (
                                 <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Admin Node</span>
                               )}
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                                  <Mail size={12} className="text-slate-400" /> {u.email}
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Meta Distribution */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
                         <div className="flex flex-col hidden lg:flex">
                             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Calendar size={10} /> Established
                             </div>
                             <div className="text-[11px] font-black text-slate-900 uppercase">
                                {new Date(u.createdAt).toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"})}
                             </div>
                         </div>
                         <div className="flex flex-col">
                             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Activity size={10} /> Security Status
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase">
                                <CheckCircle size={12} /> Active Node
                             </div>
                         </div>
                         <div className="flex flex-col items-end justify-center">
                            <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-soft-teal group-hover:text-white transition-all shadow-sm">
                               <ChevronRight size={20} />
                            </button>
                         </div>
                      </div>

                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Matrix */}
      {totalPages > 1 && (
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 py-10 px-8 bg-slate-50 rounded-[3rem] border border-slate-100">
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Registry Page {page} of {totalPages}</span>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-900 shadow-sm border border-slate-200 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-900 hover:text-white transition-all"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
                className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-900 shadow-sm border border-slate-200 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-900 hover:text-white transition-all"
              >
                <ChevronRight size={20} />
              </button>
           </div>
        </div>
      )}
    </Layout>
  );
}
