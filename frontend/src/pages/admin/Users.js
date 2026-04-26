import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { Search, User, ChevronLeft, ChevronRight, UserX, UserPlus, AlertCircle, CheckCircle } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [creating, setCreating] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

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

  if (!currentUser || Object.keys(currentUser).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
          Loading Users Node...
        </div>
      </div>
    );
  }

  const handleDisableUser = async (id, name) => {
    const shouldConfirm = window.BYPASS_CONFIRM ? true : window.confirm(`Disable account for "${name}"? This action cannot be undone.`);
    if (!shouldConfirm) return;
    
    console.log(`[FRONTEND] Attempting to disable user: ${id} (${name})`);
    try {
      const res = await API.put(`/admin/disable-user/${id}`);
      console.log(`[FRONTEND] Disable success:`, res.data);
      fetchUsers();
    } catch (err) {
      console.error(`[FRONTEND] Disable failure:`, err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to disable user.");
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setCreating(true);
    try {
      await API.post("/admin/create-admin", newAdmin);
      setShowCreateModal(false);
      setNewAdmin({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      setAuthError(err.response?.data?.message || "Failed to create admin.");
    } finally { setCreating(false); }
  };

  const initials = (name) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const roleBadge = (role) => {
    if (role === "superadmin") return <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-semibold rounded capitalize">Superadmin</span>;
    if (role === "admin") return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded capitalize">Admin</span>;
    return null;
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} registered accounts</p>
        </div>
        {currentUser?.role === "superadmin" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition"
          >
            <UserPlus size={15} /> Create Admin
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center text-sm text-slate-400">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin mr-3" />
            Loading users...
          </div>
        ) : (Array.isArray(users) ? users : []).length === 0 ? (
          <div className="py-20 flex flex-col items-center text-slate-400">
            <User size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500">User</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500">Role</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Trust</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
            <tbody className="divide-y divide-slate-100">
              {(Array.isArray(users) ? users : []).map(u => (
                <tr key={u._id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                        {initials(u.name)}
                      </div>
                      <span className="font-medium text-slate-800 truncate max-w-[120px]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{u.email}</td>
                  <td className="px-4 py-3">{roleBadge(u.role) || <span className="text-slate-400 text-xs capitalize">{u.role}</span>}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-semibold ${
                      (u.trustScore ?? 50) >= 50 ? "text-emerald-600" :
                      (u.trustScore ?? 50) >= 20 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {u.trustScore ?? 50}/100
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.isDisabled ? (
                      <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                        <UserX size={12} /> Disabled
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <CheckCircle size={12} /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!u.isDisabled && u.role !== "superadmin" &&
                      (currentUser?.role === "superadmin" || u.role === "user") ? (
                      <button
                        onClick={() => handleDisableUser(u._id, u.name)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium transition"
                      >
                        Disable
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateModal(false)} />
          <div className="bg-white w-full max-w-md rounded-lg p-6 relative z-10 shadow-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Create or Promote Admin</h2>
            <p className="text-sm text-slate-500 mb-5">Enter an email to create a new admin or promote an existing user to the Admin role.</p>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle size={14} /> {authError}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  required type="text"
                  value={newAdmin.name}
                  onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  required type="email"
                  value={newAdmin.email}
                  onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  required type="password"
                  value={newAdmin.password}
                  onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-slate-900 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-slate-700 disabled:opacity-60 transition"
                >
                  {creating ? "Creating..." : "Create Admin"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
