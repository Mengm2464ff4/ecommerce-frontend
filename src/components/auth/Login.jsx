import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  LogIn,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Star,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../api/auth";
import { GoogleLogin } from "@react-oauth/google";
import { validateLoginForm } from "../../utils/validation";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);

  // ✅ Auto-redirect if already logged in
  if (user) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/"} replace />;
  }
  
 const handleGoogleSuccess = async (credentialResponse) => {
   console.log("GOOGLE SUCCESS CALLBACK:", credentialResponse);
   console.log("Credential exists:", Boolean(credentialResponse?.credential));

   if (!credentialResponse?.credential) {
     console.error("Google returned no credential");
     setServerError("Google did not return a credential");
     return;
   }

   try {
     setLoading(true);
     setServerError("");

     console.log("Calling backend Google login...");

     const res = await authApi.googleLogin(credentialResponse.credential);

     console.log("BACKEND GOOGLE LOGIN SUCCESS:", res.data);

     const data = res.data;

     localStorage.setItem("token", data.token);

     localStorage.setItem(
       "user",
       JSON.stringify({
         id: data.id,
         username: data.username,
         email: data.email,
         role: data.role,
         firstName: data.firstName,
         lastName: data.lastName,
       }),
     );

     if (data.role === "ADMIN") {
       navigate("/admin");
     } else {
       navigate("/");
     }

     window.location.reload();
   } catch (err) {
     console.error(
       "BACKEND GOOGLE LOGIN FAILED:",
       err.response?.status,
       err.response?.data || err.message,
     );

     setServerError(
       err.response?.data?.message || err.message || "Login failed. Check your credentials."
      //  err.response?.data?.message ||
      //    err.response?.data ||
      //    "Google sign-in failed",
     );
   } finally {
     setLoading(false);
   }
 };

 const handleGoogleError = () => {
   console.error("GOOGLE ERROR CALLBACK");
   setServerError("Google popup/sign-in failed");
 };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const loggedInUser = await login(form);
      if (loggedInUser.role === "ADMIN") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✨ Exit animation → then navigate
  const goToRegister = (e) => {
    e.preventDefault();
    const card = document.querySelector(".animate-enter-left");
    if (card) {
      card.style.transition = "all 0.35s cubic-bezier(0.22,1,0.36,1)";
      card.style.opacity = "0";
      card.style.transform = "translateX(60px) scale(0.98)";
    }
    setTimeout(() => navigate("/register"), 350);
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

      {/* ============ MAIN CARD (slides in from LEFT) ============ */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[640px] animate-enter-left">
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
              Shop smarter,
              <br />
              live better.
            </h2>
            <p className="text-white/80 text-sm max-w-sm leading-relaxed mb-8">
              Welcome back. Sign in to track orders, save favourites, and unlock
              exclusive member deals.
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
            <LoginIllustration />
          </div>
        </div>

        {/* ---------- RIGHT PANEL (form) ---------- */}
        <div className="flex flex-col justify-center bg-white px-8 sm:px-12 lg:px-14 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-500 text-sm mb-8">
            Welcome back, please enter your details
          </p>

          {serverError && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#6c7bf5] focus:ring-2 focus:ring-[#6c7bf5]/20 transition"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#6c7bf5] focus:ring-2 focus:ring-[#6c7bf5]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#6c7bf5]"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-[#6c7bf5] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full flex items-center justify-center gap-2 bg-[#6c7bf5] hover:bg-[#5b6cf0] disabled:bg-gray-300 text-white py-3.5 rounded-xl font-medium transition shadow-lg shadow-[#6c7bf5]/30"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              className="w-11 h-11 rounded-full bg-white border border-gray-200 hover:border-[#6c7bf5] flex items-center justify-center transition shadow-sm"
              aria-label="Continue with Facebook"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#1877f2]"
                fill="currentColor"
              >
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.9h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z" />
              </svg>
            </button>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              logo_alignment="left"
            />
          </div>

          <p className="text-center mt-8 text-sm text-gray-500">
            Don't have an account?{" "}
            {/* ✨ Uses exit animation → then navigates */}
            <a
              href="/register"
              onClick={goToRegister}
              className="text-[#6c7bf5] hover:underline font-semibold cursor-pointer"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/* SVG ILLUSTRATION                                              */
/* ============================================================ */
function LoginIllustration() {
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
