import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import Layout from "../../components/Layout";
import useWindowWidth from "../../hooks/useWindowWidth";

export default function Users() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]     = useState(0);
  const w = useWindowWidth();
  const isMobile = w < 768;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/users", { params: { page, limit: 15, search } });
      setUsers(res.data.users);
      setTotal(res.data.total);
      setTotalPages(res.data.pages);
    } catch {} finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const initials = (name) => name ? name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "U";

  return (
    <Layout>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ color:"white", fontSize:22, fontWeight:700, margin:"0 0 4px" }}>Users</h1>
          <p style={{ color:"#64748b", fontSize:14, margin:0 }}>{total} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 16px", marginBottom:20, display:"flex", gap:10, alignItems:"center" }}>
        <span style={{ color:"#64748b", fontSize:14 }}>🔍</span>
        <input type="text" placeholder="Search by name or email..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ flex:1, background:"none", border:"none", color:"white", fontSize:14, outline:"none", fontFamily:"inherit" }} />
      </div>

      {loading ? (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300 }}>
          <div style={{ width:32, height:32, border:"3px solid rgba(59,130,246,0.3)", borderTop:"3px solid #3b82f6", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        </div>
      ) : (
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, overflow:"hidden" }}>
          {/* Header row — desktop only */}
          {!isMobile && (
            <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr", padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.02)" }}>
              {["User","Email","Role","Joined","Status"].map(h => (
                <div key={h} style={{ color:"#64748b", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</div>
              ))}
            </div>
          )}

          {users.length === 0 ? (
            <div style={{ padding:"40px 24px", textAlign:"center", color:"#475569" }}>No users found.</div>
          ) : users.map((u, i) => (
            <div key={u._id}
              style={{ display: isMobile ? "block" : "grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr", padding: isMobile ? "14px 16px" : "14px 20px", borderBottom: i < users.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems:"center" }}>

              {/* Name + avatar */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom: isMobile ? 8 : 0 }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background: u.avatar ? "transparent" : "linear-gradient(135deg,#3b82f6,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:12, fontWeight:700, flexShrink:0, overflow:"hidden" }}>
                  {u.avatar ? <img src={u.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : initials(u.name)}
                </div>
                <div>
                  <div style={{ color:"white", fontSize:13, fontWeight:600 }}>{u.name}</div>
                  {isMobile && <div style={{ color:"#64748b", fontSize:12 }}>{u.email}</div>}
                </div>
              </div>

              {!isMobile && <div style={{ color:"#94a3b8", fontSize:13 }}>{u.email}</div>}

              <div>
                <span style={{ background: u.role==="admin" ? "rgba(239,68,68,0.12)" : "rgba(59,130,246,0.12)", color: u.role==="admin" ? "#f87171" : "#93c5fd", border:`1px solid ${u.role==="admin" ? "rgba(239,68,68,0.25)" : "rgba(59,130,246,0.25)"}`, padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600 }}>
                  {u.role==="admin" ? "👑 Admin" : "👤 User"}
                </span>
              </div>

              <div style={{ color:"#64748b", fontSize:12 }}>
                {new Date(u.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
              </div>

              <div>
                <span style={{ background:"rgba(16,185,129,0.1)", color:"#6ee7b7", border:"1px solid rgba(16,185,129,0.2)", padding:"2px 8px", borderRadius:20, fontSize:11 }}>Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:16, flexWrap:"wrap", gap:10 }}>
          <span style={{ color:"#64748b", fontSize:13 }}>Page {page} of {totalPages}</span>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color: page===1?"#475569":"white", padding:"7px 14px", borderRadius:8, cursor: page===1?"not-allowed":"pointer", fontSize:13 }}>← Prev</button>
            <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color: page===totalPages?"#475569":"white", padding:"7px 14px", borderRadius:8, cursor: page===totalPages?"not-allowed":"pointer", fontSize:13 }}>Next →</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
