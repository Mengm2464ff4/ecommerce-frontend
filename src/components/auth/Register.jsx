import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  UserPlus,
  User as UserIcon,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Star,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { validateRegisterForm } from "../../utils/validation";

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [agree, setAgree] = useState(false);

  //  Auto-redirect if already logged in
  if (user) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/"} replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(form);
    if (!agree) {
      validationErrors.agree = "Please accept the Terms & Conditions";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate("/login");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✨ Exit animation → then navigate
  const goToLogin = (e) => {
    if (e) e.preventDefault();
    const card = document.querySelector(".animate-enter-right");
    if (card) {
      card.style.transition = "all 0.35s cubic-bezier(0.22,1,0.36,1)";
      card.style.opacity = "0";
      card.style.transform = "translateX(-60px) scale(0.98)";
    }
    setTimeout(() => navigate("/login"), 350);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#6c7bf5] p-4 sm:p-8 overflow-hidden animate-fade-in">
      {/* ============ DECORATIVE BACKGROUND ============ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white/10 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-white/10 animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-white/40 animate-float"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="absolute top-2/3 left-1/4 w-2 h-2 rounded-full bg-white/40 animate-float"
          style={{ animationDelay: "2.2s" }}
        />
        <svg
          className="absolute inset-0 w-full h-full opacity-10 animate-wave"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="waves"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 100 Q 50 50 100 100 T 200 100"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M0 140 Q 50 90 100 140 T 200 140"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M0 180 Q 50 130 100 180 T 200 180"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      {/* ============ MAIN CARD (slides in from RIGHT) ============ */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[680px] animate-enter-right">
        {/* ---------- LEFT PANEL (branding) ---------- */}
        <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#5b6cf0] via-[#6c7bf5] to-[#7f8cf7] p-12 text-white overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md">
              <ShoppingBag className="w-5 h-5 text-[#5b6cf0]" />
            </div>
            <span className="text-xl font-semibold tracking-wide">ShopHub</span>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-5">
              Join thousands
              <br />
              of happy shoppers.
            </h2>
            <p className="text-white/80 text-sm max-w-sm leading-relaxed mb-8">
              Create your free account and unlock exclusive deals, faster
              checkout, order tracking, and personalised picks.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <span>Fast, free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>100% secure payments & returns</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                <span>Rated 4.9★ by 12,000+ shoppers</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 illustration-float">
            <RegisterIllustration />
          </div>
        </div>

        {/* ---------- RIGHT PANEL (form) ---------- */}
        <div className="relative flex flex-col justify-center px-8 sm:px-10 lg:px-12 py-10 bg-white">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create an account
          </h1>
          <p className="text-gray-500 text-sm mb-7">
            Get started with ShopHub in less than a minute
          </p>

          {serverError && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatingField
              id="username"
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Full Name"
              autoComplete="username"
              icon={UserIcon}
              error={errors.username}
            />

            <FloatingField
              id="email"
              label="Your email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
              autoComplete="email"
              icon={Mail}
              error={errors.email}
            />

            <div className="grid grid-cols-2 gap-3">
              <FloatingField
                id="firstName"
                label="First name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                autoComplete="given-name"
                error={errors.firstName}
              />
              <FloatingField
                id="lastName"
                label="Last name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                autoComplete="family-name"
                error={errors.lastName}
              />
            </div>

            <FloatingField
              id="password"
              label="Password"
              name="password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              icon={Lock}
              error={errors.password}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="text-gray-400 hover:text-gray-700 transition"
                  tabIndex={-1}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />

            <FloatingField
              id="confirmPassword"
              label="Confirm password"
              name="confirmPassword"
              type={showPwd ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              icon={Lock}
              error={errors.confirmPassword}
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-glow flex-1 flex items-center justify-center gap-2 bg-[#6c7bf5] hover:bg-[#5b6cf0] disabled:bg-gray-300 text-white py-3.5 rounded-xl font-semibold tracking-wide transition shadow-lg shadow-[#6c7bf5]/30 text-sm uppercase"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Register
                  </>
                )}
              </button>

              {/* ✨ Sign In button triggers exit animation → then navigates */}
              <button
                type="button"
                onClick={goToLogin}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 py-3.5 rounded-xl font-semibold tracking-wide transition text-sm uppercase"
              >
                Sign In
              </button>
            </div>

            <label className="flex items-start gap-3 cursor-pointer select-none pt-3">
              <span
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition flex-shrink-0 ${
                  agree
                    ? "bg-[#6c7bf5] border-[#6c7bf5]"
                    : "bg-white border-gray-300"
                }`}
              >
                {agree && <Check className="w-3.5 h-3.5 text-white" />}
              </span>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => {
                  setAgree(e.target.checked);
                  setErrors({ ...errors, agree: "" });
                }}
                className="sr-only"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                By registering you agree with our{" "}
                <Link
                  to="/terms"
                  className="text-[#6c7bf5] hover:underline font-medium"
                >
                  Terms & Conditions
                </Link>
                , and{" "}
                <Link
                  to="/privacy"
                  className="text-[#6c7bf5] hover:underline font-medium"
                >
                  Privacy and Cookie Policy
                </Link>
                .
              </span>
            </label>
            {errors.agree && (
              <p className="text-red-500 text-xs mt-1">{errors.agree}</p>
            )}
          </form>

          <div className="flex items-center justify-center gap-6 mt-6 pt-5 border-t border-gray-100">
            {["Facebook", "LinkedIn", "Google"].map((label) => (
              <button
                key={label}
                type="button"
                className="text-sm text-gray-500 hover:text-[#6c7bf5] transition"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/* FloatingField — underlined input with optional left icon     */
/* ============================================================ */
function FloatingField({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  icon: Icon,
  error,
  trailing,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-gray-400 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-transparent border-0 border-b ${
            error ? "border-red-400" : "border-gray-200"
          } focus:border-[#6c7bf5] focus:ring-0 ${
            Icon ? "pl-6" : "pl-0"
          } py-2 pr-8 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors`}
        />
        {trailing && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* ============================================================ */
/* SVG ILLUSTRATION                                              */
/* ============================================================ */
function RegisterIllustration() {
  return (
    <svg
      viewBox="0 0 400 240"
      className="w-full max-w-md mx-auto drop-shadow-2xl"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 90 L140 90 L155 108 L320 108 C330 108 338 116 338 126 L338 210 C338 220 330 228 320 228 L80 228 C70 228 62 220 62 210 Z"
        fill="#3b82f6"
      />
      <path
        d="M60 118 L340 118 L340 210 C340 220 332 228 322 228 L78 228 C68 228 60 220 60 210 Z"
        fill="#60a5fa"
      />
      <rect x="110" y="70" width="90" height="110" rx="8" fill="#ffffff" />
      <rect x="122" y="86" width="40" height="8" rx="4" fill="#cbd5e1" />
      <rect x="122" y="102" width="66" height="6" rx="3" fill="#e2e8f0" />
      <rect x="122" y="114" width="52" height="6" rx="3" fill="#e2e8f0" />
      <circle cx="150" cy="150" r="16" fill="#ef4444" />
      <path
        d="M144 150 L148 154 L157 145"
        stroke="#fff"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="200"
        y="60"
        width="90"
        height="110"
        rx="8"
        fill="#ffffff"
        transform="rotate(8 245 115)"
      />
      <rect
        x="214"
        y="78"
        width="40"
        height="8"
        rx="4"
        fill="#cbd5e1"
        transform="rotate(8 234 82)"
      />
      <rect
        x="214"
        y="94"
        width="60"
        height="6"
        rx="3"
        fill="#e2e8f0"
        transform="rotate(8 244 97)"
      />
      <rect
        x="214"
        y="106"
        width="48"
        height="6"
        rx="3"
        fill="#e2e8f0"
        transform="rotate(8 238 109)"
      />
      <rect
        x="240"
        y="30"
        width="80"
        height="70"
        rx="8"
        fill="#fff"
        transform="rotate(-6 280 65)"
      />
      <rect
        x="250"
        y="42"
        width="60"
        height="30"
        rx="4"
        fill="#fbbf24"
        transform="rotate(-6 280 57)"
      />
      <circle cx="266" cy="55" r="4" fill="#f97316" />
      <path
        d="M250 78 L270 62 L285 74 L300 60 L310 70 L310 78 Z"
        fill="#22c55e"
        transform="rotate(-6 280 70)"
      />
      <circle
        cx="170"
        cy="180"
        r="30"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="10"
      />
      <circle cx="170" cy="180" r="22" fill="#ffffff" opacity="0.5" />
      <rect
        x="188"
        y="200"
        width="40"
        height="12"
        rx="6"
        fill="#facc15"
        transform="rotate(45 208 206)"
      />
    </svg>
  );
}
