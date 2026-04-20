import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  FileText, 
  Calendar, 
  Camera, 
  LogOut, 
  Save,
  CheckCircle,
  AlertTriangle,
  Activity,
  Zap
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({
    name:     storedUser.name     || "",
    phone:    storedUser.phone    || "",
    location: storedUser.location || "",
    bio:      storedUser.bio      || "",
  });
  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(true);
  const [status, setStatus]         = useState({ type:"", msg:"" });
  const [complaints, setComplaints] = useState([]);
  const [avatar, setAvatar]         = useState(storedUser.avatar || "");
  const [uploading, setUploading]   = useState(false);
  const fileInputRef = useRef(null);

  const initials = form.name ? form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "U";

  useEffect(() => {
    API.get("/users/profile").then(res => {
      const u = res.data.user;
      setForm({ name: u.name||"", phone: u.phone||"", location: u.location||"", bio: u.bio||"" });
      setAvatar(u.avatar || "");
    }).catch(() => {}).finally(() => setFetching(false));

    API.get("/complaints/my").then(res => setComplaints(res.data)).catch(() => {});
  }, []);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setStatus({ type:"error", msg:"Image exceeds 5MB limit" }); return; }

    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const data = new FormData();
      data.append("avatar", file);
      const res = await API.post("/users/avatar", data, { headers: { "Content-Type": "multipart/form-data" } });
      setAvatar(res.data.avatar);
      const current = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...current, avatar: res.data.avatar }));
      setStatus({ type:"success", msg:"IDENTITY PHOTO UPDATED" });
    } catch {
      setStatus({ type:"error", msg:"UPLOAD FAILED: RETRY" });
    } finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setStatus({ type:"error", msg:"NAME_REQUIRED" }); return; }
    setLoading(true); setStatus({ type:"", msg:"" });
    try {
      const res = await API.put("/users/profile", form);
      const current = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...current, ...res.data.user }));
      setStatus({ type:"success", msg:"PROFILE SYNCED SUCCESSFULLY" });
    } catch (err) {
      setStatus({ type:"error", msg: err.response?.data?.message || "SYNC_ERROR" });
    } finally { setLoading(false); }
  };

  if (fetching) {
    return (
      <UserLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-soft-teal rounded-full animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-4xl">
        <div className="mb-12">
           <div className="inline-flex items-center gap-2 bg-soft-blue px-4 py-1.5 rounded-full text-xs font-semibold text-soft-teal tracking-wide mb-4 shadow-sm border border-slate-100">
              <User size={14} /> Security Profile
           </div>
           <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 tracking-tight leading-none">Settings</h1>
           <p className="text-sm font-medium font-serif text-slate-500 tracking-wide mt-4">Manage your network identity.</p>
        </div>

        {status.msg && (
          <div className={`p-6 rounded-[2.5rem] mb-10 flex items-center gap-4 border-2 animate-in fade-in slide-in-from-top-5 ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status.type === 'success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                {status.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest">{status.msg}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
           <div className="lg:col-span-1">
              <div className="bg-slate-900 text-white p-10 rounded-[4rem] text-center relative overflow-hidden shadow-xl sticky top-10">
                 <div className="relative z-10">
                    <div className="relative mx-auto w-32 h-32 mb-8 group" onClick={handleAvatarClick}>
                       <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                       <div className="w-full h-full rounded-[3rem] bg-soft-teal flex items-center justify-center text-white text-4xl font-black italic shadow-lg shadow-soft-teal/40 overflow-hidden cursor-pointer group-hover:scale-105 transition-all">
                          {avatar ? <img src={avatar} className="w-full h-full object-cover" alt="Avatar" /> : initials}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <Camera size={24} />
                          </div>
                       </div>
                    </div>
                    <h3 className="text-2xl font-bold capitalize tracking-tight mb-2">{form.name || "Unidentified"}</h3>
                    <p className="text-sm font-medium text-slate-300 opacity-90 mb-8">{storedUser.email}</p>
                    
                    <div className="flex flex-col gap-3">
                       <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex items-center justify-between">
                          <span className="text-xs font-medium tracking-wide text-slate-300">Reports</span>
                          <span className="text-sm font-semibold">{complaints.length}</span>
                       </div>
                       <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex items-center justify-between">
                          <span className="text-xs font-medium tracking-wide text-slate-300">Security</span>
                          <span className="text-sm font-semibold text-emerald-400">Verified</span>
                       </div>
                    </div>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-soft-teal/10 rounded-full blur-3xl text-slate-900" />
              </div>
           </div>

           <div className="lg:col-span-2 space-y-10">
              <div className="bg-slate-50 p-10 rounded-[4rem] border border-slate-100 h-full shadow-soft">
                 <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div>
                          <label className="text-xs font-semibold text-slate-700 capitalize tracking-wide mb-3 block px-4">Identification Name</label>
                          <input 
                            value={form.name} 
                            onChange={e => setForm({...form, name:e.target.value})} 
                            className="w-full bg-white border border-transparent px-8 py-4 rounded-full text-sm font-medium tracking-wide focus:border-soft-teal/30 outline-none shadow-sm text-slate-800 placeholder:text-slate-500"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-semibold text-slate-700 capitalize tracking-wide mb-3 block px-4">Contact Protocol (Phone)</label>
                          <input 
                            value={form.phone} 
                            onChange={e => setForm({...form, phone:e.target.value})} 
                            placeholder="+91 00000 00000"
                            className="w-full bg-white border border-transparent px-8 py-4 rounded-full text-sm font-medium tracking-wide focus:border-soft-teal/30 outline-none shadow-sm text-slate-800 placeholder:text-slate-500"
                          />
                       </div>
                    </div>

                    <div>
                       <label className="text-xs font-semibold text-slate-700 capitalize tracking-wide mb-3 block px-4">Geographic Node (Location)</label>
                       <div className="relative">
                          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                          <input 
                            value={form.location} 
                            onChange={e => setForm({...form, location:e.target.value})} 
                            placeholder="City, Country"
                            className="w-full bg-white border border-transparent pl-14 pr-8 py-4 rounded-full text-sm font-medium tracking-wide focus:border-soft-teal/30 outline-none shadow-sm text-slate-800 placeholder:text-slate-500"
                          />
                       </div>
                    </div>

                    <div>
                       <label className="text-xs font-semibold text-slate-700 capitalize tracking-wide mb-3 block px-4">Security Bio</label>
                       <textarea 
                         value={form.bio} 
                         onChange={e => setForm({...form, bio:e.target.value})} 
                         rows={4}
                         className="w-full bg-white border border-transparent px-8 py-6 rounded-[2.5rem] text-sm font-medium leading-relaxed outline-none focus:border-soft-teal/30 shadow-sm transition-all text-slate-800 placeholder:text-slate-500"
                       />
                    </div>

                    <div className="pt-6">
                       <button 
                         type="submit" 
                         disabled={loading}
                         className="w-full bg-slate-900 py-4 rounded-full text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-3 hover:bg-soft-teal hover:shadow-soft-teal/40 transition-all shadow-lg disabled:opacity-50"
                       >
                         {loading ? <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Update Identity</>}
                       </button>
                    </div>
                 </form>
              </div>

              <div className="bg-rose-50 p-10 rounded-[4rem] border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                       <LogOut size={24} />
                    </div>
                    <div>
                       <h4 className="text-lg font-bold font-serif tracking-tight text-slate-800">Terminate Session</h4>
                       <p className="text-xs font-medium text-slate-600 mt-1">Disconnect from security network</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); }}
                   className="bg-white text-rose-600 px-8 py-3 rounded-full font-semibold text-sm tracking-wide border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                 >
                   Exit Session
                 </button>
              </div>
           </div>
        </div>
      </div>
    </UserLayout>
  );
}
