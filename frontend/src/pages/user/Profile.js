import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import {
  User, MapPin, Camera, LogOut, Save,
  CheckCircle, AlertTriangle
} from "lucide-react";

export default function Profile() {
  const navigate   = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({
    name:     storedUser.name     || "",
    phone:    storedUser.phone    || "",
    location: storedUser.location || "",
    bio:      storedUser.bio      || "",
  });
  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(true);
  const [status, setStatus]         = useState({ type: "", msg: "" });
  const [complaints, setComplaints] = useState([]);
  const [avatar, setAvatar]         = useState(storedUser.avatar || "");
  const [uploading, setUploading]   = useState(false);
  const fileInputRef = useRef(null);

  const initials = form.name
    ? form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  useEffect(() => {
    API.get("/users/profile").then(res => {
      const u = res.data.user;
      setForm({ name: u.name || "", phone: u.phone || "", location: u.location || "", bio: u.bio || "" });
      setAvatar(u.avatar || "");
    }).catch(() => {}).finally(() => setFetching(false));

    API.get("/complaints/my").then(res => setComplaints(res.data)).catch(() => {});
  }, []);

  const handleAvatarClick  = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setStatus({ type: "error", msg: "Image exceeds 5 MB limit." }); return; }

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
      setStatus({ type: "success", msg: "Profile photo updated." });
    } catch {
      setStatus({ type: "error", msg: "Upload failed. Please try again." });
    } finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setStatus({ type: "error", msg: "Name is required." }); return; }
    setLoading(true); setStatus({ type: "", msg: "" });
    try {
      const res = await API.put("/users/profile", form);
      const current = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...current, ...res.data.user }));
      setStatus({ type: "success", msg: "Profile updated successfully." });
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Update failed. Try again." });
    } finally { setLoading(false); }
  };

  if (fetching) {
    return (
      <UserLayout>
        <div className="min-h-[400px] flex items-center justify-center text-sm text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin mr-3" />
          Loading profile...
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-3xl">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Profile & Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Update your account information.</p>
        </div>

        {/* Status Banner */}
        {status.msg && (
          <div className={`mb-5 p-3 rounded-md border flex items-center gap-2 text-sm ${
            status.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {status.type === "success" ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
            {status.msg}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-5">

          {/* Left: Avatar Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center sticky top-6">

              {/* Avatar */}
              <div
                className="relative mx-auto w-20 h-20 mb-4 group cursor-pointer"
                onClick={handleAvatarClick}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-xl font-bold overflow-hidden">
                  {avatar ? <img src={avatar} className="w-full h-full object-cover" alt="Avatar" /> : initials}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Camera size={18} className="text-white" />
                </div>
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-white/80 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-slate-900 truncate">{form.name || "No name"}</h3>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{storedUser.email}</p>

              {/* Stats */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm border border-slate-100 rounded-md px-3 py-2">
                  <span className="text-slate-500">Reports</span>
                  <span className="font-semibold text-slate-800">{complaints.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm border border-slate-100 rounded-md px-3 py-2">
                  <span className="text-slate-500">Status</span>
                  <span className="text-emerald-600 font-semibold text-xs">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Edit Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">Account Details</h2>
              <form onSubmit={handleSave} className="space-y-4">

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 00000 00000"
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      placeholder="City, Country"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    placeholder="A short bio..."
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-slate-700 disabled:opacity-60 transition"
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Save size={15} /> Save Changes</>
                  }
                </button>
              </form>
            </div>

            {/* Sign Out */}
            <div className="bg-white border border-red-100 rounded-lg p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-red-50 flex items-center justify-center text-red-500">
                  <LogOut size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Sign Out</p>
                  <p className="text-xs text-slate-500">End your current session.</p>
                </div>
              </div>
              <button
                onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); }}
                className="text-sm font-medium text-red-600 border border-red-200 px-4 py-2 rounded-md hover:bg-red-50 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
