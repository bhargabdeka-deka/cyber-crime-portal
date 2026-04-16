import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import useWindowWidth from "../../hooks/useWindowWidth";

export default function Profile() {
  const navigate = useNavigate();
  const w = useWindowWidth();
  const isMobile = w < 640;

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
    // Fetch latest profile from server
    API.get("/users/profile").then(res => {
      const u = res.data.user;
      setForm({ name: u.name||"", phone: u.phone||"", location: u.location||"", bio: u.bio||"" });
      setAvatar(u.avatar || "");
    }).catch(() => {}).finally(() => setFetching(false));

    // Fetch complaint count
    API.get("/complaints/my").then(res => setComplaints(res.data)).catch(() => {});
  }, []);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setStatus({ type:"error", msg:"Image must be under 5MB" }); return; }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const data = new FormData();
      data.append("avatar", file);
      const res = await API.post("/users/avatar", data, { headers: { "Content-Type": "multipart/form-data" } });
      setAvatar(res.data.avatar);
      const current = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...current, avatar: res.data.avatar }));
      setStatus({ type:"success", msg:"Profile photo updated!" });
    } catch {
      setStatus({ type:"error", msg:"Photo upload failed. Try again." });
    } finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setStatus({ type:"error", msg:"Name cannot be empty" }); return; }
    setLoading(true); setStatus({ type:"", msg:"" });
    try {
      const res = await API.put("/users/profile", form);
      // Update localStorage
      const current = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...current, ...res.data.user }));
      setStatus({ type:"success", msg:"Profile updated successfully!" });
    } catch (err) {
      setStatus({ type:"error", msg: err.response?.data?.message || "Failed to update profile" });
    } finally { setLoading(false); }
  };

  if (fetching) {
    return (
      <UserLayout>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300 }}>
          <div style={{ width:32, height:32, border:"3px solid rgba(59,130,246,0.3)", borderTop:"3px solid #3b82f6", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div style={{ maxWidth: 640 }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ color:"white", fontSize:22, fontWeight:700, margin:"0 0 4px" }}>My Profile</h1>
          <p style={{ color:"#64748b", fontSize:14, margin:0 }}>Manage your personal information.</p>
        </div>

        {/* Profile card */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding: isMobile ? "20px 16px" : "28px", marginBottom:20 }}>

          {/* Avatar + name */}
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24, paddingBottom:20, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ position:"relative", cursor:"pointer" }} onClick={handleAvatarClick} title="Click to change photo">
              {/* Hidden file input */}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:"none" }} />

              {/* Avatar circle */}
              <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:26, fontWeight:800, flexShrink:0, overflow:"hidden", position:"relative" }}>
                {avatar ? (
                  <img src={avatar} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                ) : initials}
                {/* Hover overlay */}
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"opacity 0.2s", borderRadius:"50%", fontSize:20 }}
                  onMouseEnter={e => e.currentTarget.style.opacity=1}
                  onMouseLeave={e => e.currentTarget.style.opacity=0}>
                  📷
                </div>
              </div>

              {/* Edit badge */}
              <div style={{ position:"absolute", bottom:0, right:0, width:24, height:24, borderRadius:"50%", background: uploading ? "#f59e0b" : "#3b82f6", border:"2px solid #0f172a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>
                {uploading ? <span style={{ width:10, height:10, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} /> : "📷"}
              </div>
            </div>
            <div>
              <div style={{ color:"white", fontSize:18, fontWeight:700 }}>{form.name || "Your Name"}</div>
              <div style={{ color:"#64748b", fontSize:13, marginTop:2 }}>{storedUser.email}</div>
              <div style={{ display:"flex", gap:8, marginTop:6, flexWrap:"wrap" }}>
                <span style={{ background:"rgba(59,130,246,0.12)", border:"1px solid rgba(59,130,246,0.25)", color:"#93c5fd", padding:"2px 10px", borderRadius:20, fontSize:11 }}>
                  {storedUser.role === "admin" ? "👑 Admin" : "👤 Citizen"}
                </span>
                <span style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", color:"#6ee7b7", padding:"2px 10px", borderRadius:20, fontSize:11 }}>
                  📋 {complaints.length} complaint{complaints.length !== 1 ? "s" : ""}
                </span>
                {form.location && (
                  <span style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", color:"#94a3b8", padding:"2px 10px", borderRadius:20, fontSize:11 }}>
                    📍 {form.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          {status.msg && (
            <div style={{ background: status.type==="success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border:`1px solid ${status.type==="success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`, color: status.type==="success" ? "#6ee7b7" : "#fca5a5", padding:"11px 14px", borderRadius:10, fontSize:14, marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
              {status.type==="success" ? "✅" : "⚠️"} {status.msg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} style={{ display:"flex", flexDirection:"column", gap:18 }}>

            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:16 }}>
              <div>
                <label style={lbl}>Full Name <span style={{ color:"#ef4444" }}>*</span></label>
                <input value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Your full name" style={inp}
                  onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
              </div>
              <div>
                <label style={lbl}>Phone Number</label>
                <input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="+91 98765 43210" style={inp}
                  onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
              </div>
            </div>

            <div>
              <label style={lbl}>Location</label>
              <input value={form.location} onChange={e => setForm({...form, location:e.target.value})} placeholder="e.g. Guwahati, Assam" style={inp}
                onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
            </div>

            <div>
              <label style={lbl}>Bio <span style={{ color:"#64748b", fontWeight:400 }}>(optional)</span></label>
              <textarea value={form.bio} onChange={e => setForm({...form, bio:e.target.value})} placeholder="Tell us a bit about yourself..." rows={3}
                style={{ ...inp, resize:"vertical", minHeight:80 }}
                onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
              <div style={{ textAlign:"right", color:"#475569", fontSize:11, marginTop:4 }}>{form.bio.length}/200</div>
            </div>

            {/* Read-only fields */}
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"14px 16px" }}>
              <div style={{ color:"#64748b", fontSize:12, marginBottom:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>Account Info</div>
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:12 }}>
                <div>
                  <div style={{ color:"#475569", fontSize:11, marginBottom:3 }}>Email</div>
                  <div style={{ color:"#94a3b8", fontSize:13 }}>{storedUser.email}</div>
                </div>
                <div>
                  <div style={{ color:"#475569", fontSize:11, marginBottom:3 }}>Member Since</div>
                  <div style={{ color:"#94a3b8", fontSize:13 }}>{storedUser.createdAt ? new Date(storedUser.createdAt).toLocaleDateString("en-IN",{month:"long",year:"numeric"}) : "—"}</div>
                </div>
                <div>
                  <div style={{ color:"#475569", fontSize:11, marginBottom:3 }}>Role</div>
                  <div style={{ color:"#94a3b8", fontSize:13, textTransform:"capitalize" }}>{storedUser.role || "user"}</div>
                </div>
                <div>
                  <div style={{ color:"#475569", fontSize:11, marginBottom:3 }}>Complaints Filed</div>
                  <div style={{ color:"#94a3b8", fontSize:13 }}>{complaints.length}</div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ background: loading ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"13px", borderRadius:10, cursor: loading ? "not-allowed" : "pointer", fontSize:15, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {loading ? <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} /> Saving...</> : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div style={{ background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ color:"#f87171", fontSize:14, fontWeight:600 }}>Sign out of your account</div>
            <div style={{ color:"#64748b", fontSize:13 }}>You'll need to log in again to access your dashboard.</div>
          </div>
          <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); }}
            style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171", padding:"9px 18px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>
            Logout
          </button>
        </div>
      </div>
    </UserLayout>
  );
}

const lbl = { color:"#94a3b8", fontSize:13, fontWeight:500, display:"block", marginBottom:6 };
const inp = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"11px 14px", color:"white", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.2s" };
