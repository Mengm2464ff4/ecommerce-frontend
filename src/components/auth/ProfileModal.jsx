import { useState, useEffect, useRef } from "react";
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
  ArrowRight,
  Camera,
  Bell,
  Globe,
  CreditCard,
  Trash2,
  LogOut,
  Key,
  Smartphone,
  Activity,
  TrendingUp,
  Award,
  Clock,
  Star,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: "profile", label: "Personal Info", icon: UserIcon },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "danger", label: "Danger Zone", icon: AlertCircle },
];

export default function ProfileModal({ open, onClose }) {
  const { user, logout } = useAuth();
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState(null);

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

  const [prefs, setPrefs] = useState({
    emailOrders: true,
    emailPromos: false,
    emailNewsletter: true,
    pushOrders: true,
  });

  // Lock scroll + Esc close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape" && !saving && !changingPwd) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, saving, changingPwd, onClose]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setActiveTab("profile");
      setEditing(false);
      setError("");
    }
  }, [open]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePwdChange = (e) =>
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    // TODO: upload to your backend when ready
    showToast("Avatar selected — upload endpoint not wired yet", "info");
  };

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
        await api.put("/api/users/me", form);
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
      await api.post("/api/users/me/change-password", {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      showToast("Password changed successfully");
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Password change failed";
      showToast(msg, "error");
    } finally {
      setChangingPwd(false);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    ) {
      showToast("Account deletion requires backend confirmation", "error");
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

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md overflow-y-auto"
          onClick={() => !saving && !changingPwd && onClose()}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!saving && !changingPwd) onClose();
            }}
            className="fixed top-4 right-4 z-[60] w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 shadow-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="min-h-full flex items-start sm:items-center justify-center p-4 py-10 sm:py-16">
            <motion.div
              initial={{ scale: 0.96, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 24, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* ============ COVER + AVATAR ============ */}
              <div className="relative">
                {/* Cover gradient */}
                <div className="relative h-32 sm:h-44 overflow-hidden bg-slate-900">
                  {/* Aurora blobs */}
                  <div className="absolute inset-0">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-pulse" />
                    <div
                      className="absolute -top-16 right-1/3 w-80 h-80 bg-fuchsia-500/30 rounded-full blur-3xl animate-pulse"
                      style={{ animationDelay: "1s" }}
                    />
                    <div
                      className="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-500/40 rounded-full blur-3xl animate-pulse"
                      style={{ animationDelay: "2s" }}
                    />
                  </div>

                  {/* Subtle grid overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />

                  {/* Bottom fade to blend into modal */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />

                  <div className="absolute top-4 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    My Account
                  </div>
                </div>

                {/* Avatar overlapping */}
                {/* Avatar overlapping — circular */}
                <div className="px-6 sm:px-8 -mt-14 sm:-mt-16 relative">
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 flex-wrap">
                    {/* Avatar ring + circle */}
                    <div className="relative group flex-shrink-0">
                      {/* Outer gradient ring */}
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-[3px] shadow-xl">
                        {/* White gap ring */}
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 p-[3px]">
                          {/* Actual avatar */}
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold overflow-hidden">
                            {avatarPreview ? (
                              <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              getInitials()
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Camera button — bottom right of circle */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-95 transition shadow-md"
                        title="Change avatar"
                      >
                        <Camera className="w-4 h-4" />
                      </button>

                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarPick}
                        className="hidden"
                      />

                      {/* Online indicator — bottom left of circle */}
                      <div className="absolute bottom-2 left-1 w-5 h-5 rounded-full bg-green-500 ring-4 ring-white dark:ring-gray-900" />
                    </div>

                    {/* Name + badges */}
                    <div className="flex-1 min-w-0 pb-1 sm:pb-2 text-center sm:text-left">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
                        {displayName}
                      </h2>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          @{user?.username}
                        </span>
                        {user?.role && (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              user.role === "ADMIN"
                                ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            {user.role}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============ STATS BAR ============ */}
              <div className="px-6 sm:px-8 mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Orders",
                      value: "12",
                      icon: ShoppingBag,
                      color: "from-blue-500 to-blue-600",
                      trend: "+2 this month",
                    },
                    {
                      label: "Wishlist",
                      value: "8",
                      icon: Heart,
                      color: "from-pink-500 to-rose-600",
                      trend: "3 on sale",
                    },
                    {
                      label: "Member Since",
                      value: memberSince,
                      icon: Calendar,
                      color: "from-purple-500 to-purple-600",
                      trend: "Gold tier",
                    },
                    {
                      label: "Reward Points",
                      value: "245",
                      icon: Award,
                      color: "from-amber-500 to-orange-600",
                      trend: "+30 earned",
                    },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-3.5 border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-500/30 transition group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition`}
                          >
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            {stat.label}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                          {stat.value}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5 truncate">
                          {stat.trend}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ============ TABS + CONTENT ============ */}
              <div className="px-6 sm:px-8 py-6">
                {error && (
                  <div className="mb-5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                  {/* Sidebar tabs */}
                  <div className="sm:col-span-1 space-y-1">
                    {TABS.map((tab) => {
                      const Icon = tab.icon;
                      const active = activeTab === tab.id;
                      const isDanger = tab.id === "danger";
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setError("");
                            setEditing(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                            active
                              ? isDanger
                                ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300"
                                : "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                              : isDanger
                                ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="flex-1 text-left">{tab.label}</span>
                          {active && <ArrowRight className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}

                    {/* Quick sign out at bottom */}
                    <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-800">
                      <button
                        onClick={() => {
                          logout();
                          onClose?.();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>

                  {/* Tab content */}
                  <div className="sm:col-span-3">
                    {/* ========== PROFILE TAB ========== */}
                    {activeTab === "profile" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                          <div>
                            <h3 className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                              <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              Personal Information
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              Manage your account details
                            </p>
                          </div>
                          {!editing && (
                            <button
                              onClick={() => setEditing(true)}
                              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition shadow-sm shadow-blue-500/30"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <Field
                              label="First Name"
                              name="firstName"
                              value={form.firstName}
                              onChange={handleChange}
                              disabled={!editing}
                              placeholder="First name"
                            />
                            <Field
                              label="Last Name"
                              name="lastName"
                              value={form.lastName}
                              onChange={handleChange}
                              disabled={!editing}
                              placeholder="Last name"
                            />
                          </div>
                          <Field
                            label="Email"
                            icon={Mail}
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="you@example.com"
                          />
                          <Field
                            label="Phone Number"
                            icon={Phone}
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="+1 (555) 123-4567"
                          />
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
                              rows={3}
                              placeholder="Street, city, state, ZIP"
                              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 transition resize-none"
                            />
                          </div>

                          {editing && (
                            <div className="flex gap-3 pt-1">
                              <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm shadow-blue-500/30"
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
                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium transition"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            </div>
                          )}
                        </form>
                      </motion.div>
                    )}

                    {/* ========== SECURITY TAB ========== */}
                    {activeTab === "security" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                            <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
                            Change Password
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-4">
                            Use a strong, unique password
                          </p>

                          <form
                            onSubmit={handlePasswordChange}
                            className="space-y-4"
                          >
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
                                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                              />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
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
                                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Confirm Password
                                </label>
                                <input
                                  type={showPwd ? "text" : "password"}
                                  name="confirmPassword"
                                  value={pwdForm.confirmPassword}
                                  onChange={handlePwdChange}
                                  required
                                  minLength={6}
                                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                />
                              </div>
                            </div>
                            <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={showPwd}
                                onChange={(e) => setShowPwd(e.target.checked)}
                                className="w-4 h-4 rounded"
                              />
                              {showPwd ? (
                                <>
                                  <EyeOff className="w-4 h-4" /> Hide passwords
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4" /> Show passwords
                                </>
                              )}
                            </label>
                            <button
                              type="submit"
                              disabled={changingPwd}
                              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm shadow-red-500/30"
                            >
                              {changingPwd ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <Key className="w-4 h-4" />
                                  Update Password
                                </>
                              )}
                            </button>
                          </form>
                        </div>

                        {/* Two-factor */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-5">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Two-Factor Authentication
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  Add an extra layer of security
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                showToast("2FA setup coming soon", "info")
                              }
                              className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
                            >
                              Enable
                            </button>
                          </div>
                        </div>

                        {/* Active sessions */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-5">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-500" />
                            Active Sessions
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                              <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Current Session
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Windows · Chrome · Phnom Penh
                                </p>
                              </div>
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ========== NOTIFICATIONS TAB ========== */}
                    {activeTab === "notifications" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h3 className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-white mb-1">
                          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Notification Preferences
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                          Choose how you want to be notified
                        </p>

                        <div className="space-y-3">
                          {[
                            {
                              key: "emailOrders",
                              title: "Order updates",
                              desc: "Shipping confirmations and delivery alerts",
                              icon: ShoppingBag,
                            },
                            {
                              key: "emailPromos",
                              title: "Promotions & deals",
                              desc: "Exclusive discounts and seasonal sales",
                              icon: TrendingUp,
                            },
                            {
                              key: "emailNewsletter",
                              title: "Newsletter",
                              desc: "Weekly picks, trends, and style tips",
                              icon: Star,
                            },
                            {
                              key: "pushOrders",
                              title: "Push notifications",
                              desc: "Real-time order status on your device",
                              icon: Smartphone,
                            },
                          ].map((item) => {
                            const Icon = item.icon;
                            const on = prefs[item.key];
                            return (
                              <div
                                key={item.key}
                                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-500/30 transition"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    setPrefs({
                                      ...prefs,
                                      [item.key]: !on,
                                    })
                                  }
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition ${
                                    on
                                      ? "bg-blue-600"
                                      : "bg-gray-300 dark:bg-gray-700"
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition ${
                                      on ? "translate-x-5" : "translate-x-0.5"
                                    } mt-0.5`}
                                  />
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => showToast("Preferences saved")}
                          className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm shadow-blue-500/30"
                        >
                          <Save className="w-4 h-4" />
                          Save Preferences
                        </button>
                      </motion.div>
                    )}

                    {/* ========== DANGER ZONE ========== */}
                    {activeTab === "danger" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h3 className="text-base font-semibold flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                          <AlertCircle className="w-4 h-4" />
                          Danger Zone
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                          Irreversible actions — please be careful
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Sign out everywhere
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Log out from all devices and browsers
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                showToast("Logged out from all devices")
                              }
                              className="px-3.5 py-2 rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                              Sign out all
                            </button>
                          </div>

                          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/5">
                            <div>
                              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                                Delete account
                              </p>
                              <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">
                                Permanently delete your account and all data
                              </p>
                            </div>
                            <button
                              onClick={handleDeleteAccount}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`fixed top-20 right-6 z-[80] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 ${
                  toast.type === "error"
                    ? "bg-red-500 text-white"
                    : toast.type === "info"
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-white"
                }`}
              >
                {toast.type === "error" ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">{toast.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Sub-component ---------- */

function Field({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 transition"
      />
    </div>
  );
}
