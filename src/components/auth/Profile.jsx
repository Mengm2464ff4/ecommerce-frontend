import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Add this
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  Pencil,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Hash,
  ShoppingBag,
  Heart,
  Sparkles,
  Award,
  ArrowLeft, // 👈 Add this
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate(); // 👈 Initialize navigate

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    memberSince: new Date().getFullYear().toString(),
    rewardPoints: 0,
  });

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    shippingAddress: user?.shippingAddress || "",
  });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // const response = await api.get("/users/me/stats");
        const response = await api.get(`/users/me/stats?t=${new Date().getTime()}`);
        const realData = response.data.data || response.data;
        
        if (realData) {
          setStats({
            orders: realData.orders || 0,
            wishlist: realData.wishlist || 0,
            memberSince: realData.memberSince || new Date().getFullYear().toString(),
            rewardPoints: realData.rewardPoints || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load user stats", err);
      }
    };

    if (user) fetchStats();
  }, [user]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePwdChange = (e) =>
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });

  const handleCancel = () => {
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      shippingAddress: user?.shippingAddress || "",
    });
    setEditing(false);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      try {
        await api.put("/users/me", form);
        showToast("Profile updated successfully");
      } catch (err) {
        if (err.response?.status === 404) {
          localStorage.setItem("user", JSON.stringify({ ...user, ...form }));
          showToast("Profile saved locally", "error");
        } else {
          throw err;
        }
      }
      setEditing(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Update failed";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    if (pwdForm.newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    try {
      setChangingPwd(true);
      await api.post("/users/me/change-password", {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      showToast("Password changed successfully");
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Password change failed";
      showToast(msg, "error");
    } finally {
      setChangingPwd(false);
    }
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }
    return (user?.username?.[0] || "U").toUpperCase();
  };

  const displayName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user?.username || "User";

  const statCards = [
    {
      label: "ORDERS",
      value: stats.orders,
      subtext: "Total purchases",
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "WISHLIST",
      value: stats.wishlist,
      subtext: "Saved items",
      icon: Heart,
      color: "from-pink-500 to-rose-600",
    },
    {
      label: "MEMBER SINCE",
      value: stats.memberSince,
      subtext: "Valued customer",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "REWARD POINTS",
      value: stats.rewardPoints,
      subtext: "Points earned",
      icon: Award,
      color: "from-orange-500 to-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16 transition-colors">
      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-5 duration-300 ${
            toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {toast.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 pt-8">
        
        {/* 👈 BACK BUTTON */}
        <button
          onClick={() => navigate(-1)} // Goes back to the previous page
          className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-6"
        >
          <div className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600 shadow-sm transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back
        </button>

        {/* HEADER */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4 border border-blue-100 dark:border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Account Settings
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName || user?.username}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your personal information, track orders, and update your password.
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
          
          {/* Avatar + Name */}
          <div className="p-6 lg:p-8 flex items-center gap-6 flex-wrap bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white dark:ring-gray-900 flex-shrink-0">
                {getInitials()}
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                {displayName}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  @{user?.username}
                </span>
                {user?.role && (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-red-50 text-red-600 border border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                        : "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    {user.role}
                  </span>
                )}
              </div>
            </div>

            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* DYNAMIC STATS ROW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 lg:px-8 pb-8 pt-2">
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                    {stat.subtext}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* PROFILE FORM */}
          <div className="p-6 lg:p-8">
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Personal Information
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  Phone Number
                </label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Shipping Address
                </label>
                <textarea
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  disabled={!editing}
                  rows="3"
                  placeholder="Street, city, state, ZIP"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all resize-none"
                />
              </div>

              {editing && (
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm shadow-blue-500/30 disabled:opacity-70"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* PASSWORD CARD */}
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 lg:p-8 transition-colors">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <Lock className="w-5 h-5 text-rose-500" />
            Security & Password
          </h3>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type={showPwd ? "text" : "password"}
                name="currentPassword"
                value={pwdForm.currentPassword}
                onChange={handlePwdChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type={showPwd ? "text" : "password"}
                  name="newPassword"
                  value={pwdForm.newPassword}
                  onChange={handlePwdChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showPwd ? "text" : "password"}
                  name="confirmPassword"
                  value={pwdForm.confirmPassword}
                  onChange={handlePwdChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPwd}
                onChange={(e) => setShowPwd(e.target.checked)}
                className="w-4 h-4 rounded accent-rose-500"
              />
              {showPwd ? (
                <><EyeOff className="w-4 h-4" /> Hide passwords</>
              ) : (
                <><Eye className="w-4 h-4" /> Show passwords</>
              )}
            </label>

            <button
              type="submit"
              disabled={changingPwd}
              className="flex items-center gap-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm disabled:opacity-70 mt-2"
            >
              {changingPwd ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}