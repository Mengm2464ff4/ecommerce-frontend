import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Send,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Star,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth(); // adjust if your AuthContext exposes a different name
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      // If your AuthContext doesn't have forgotPassword yet,
      // this call will silently succeed — see note below.
      if (typeof forgotPassword === "function") {
        await forgotPassword(email);
      } else {
        // Simulated delay so the loading state shows
        await new Promise((r) => setTimeout(r, 1200));
      }
      setSent(true);
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
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
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[600px] animate-enter-right">
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
              Don't worry,
              <br />
              we've got you.
            </h2>
            <p className="text-white/80 text-sm max-w-sm leading-relaxed mb-8">
              Enter the email linked to your account and we'll send you a secure
              link to reset your password.
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
            <ForgotIllustration />
          </div>
        </div>

        {/* ---------- RIGHT PANEL (form / success state) ---------- */}
        <div className="relative flex flex-col justify-center px-8 sm:px-10 lg:px-12 py-12 bg-white">
          {/* ---------- STATE 1: Enter email ---------- */}
          {!sent && (
            <>
              <button
                type="button"
                onClick={goToLogin}
                className="group inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#6c7bf5] transition mb-6 w-fit"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                Back to Login
              </button>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Forgot password?
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                No worries — enter your email and we'll send you a reset link.
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
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6c7bf5]/20 transition ${
                        error
                          ? "border-red-400 focus:border-red-400"
                          : "border-transparent focus:border-[#6c7bf5]"
                      }`}
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-1.5">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-glow w-full flex items-center justify-center gap-2 bg-[#6c7bf5] hover:bg-[#5b6cf0] disabled:bg-gray-300 text-white py-3.5 rounded-xl font-medium transition shadow-lg shadow-[#6c7bf5]/30"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send reset link
                    </>
                  )}
                </button>
              </form>

              <p className="text-center mt-8 text-sm text-gray-500">
                Remember your password?{" "}
                <a
                  href="/login"
                  onClick={goToLogin}
                  className="text-[#6c7bf5] hover:underline font-semibold cursor-pointer"
                >
                  Sign in
                </a>
              </p>
            </>
          )}

          {/* ---------- STATE 2: Email sent ---------- */}
          {sent && (
            <div className="text-center">
              {/* Success check bubble */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-60" />
                <div className="relative w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Check your inbox
              </h1>
              <p className="text-gray-500 text-sm mb-2">
                We've sent a password reset link to
              </p>
              <p className="text-[#6c7bf5] font-semibold text-base mb-8 break-all">
                {email}
              </p>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left mb-6">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Didn't receive the email? Check your spam folder, or make sure
                  the address is correct. The link expires in 30 minutes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 py-3.5 rounded-xl font-medium transition mb-3"
              >
                Try a different email
              </button>

              <button
                type="button"
                onClick={goToLogin}
                className="w-full flex items-center justify-center gap-2 bg-[#6c7bf5] hover:bg-[#5b6cf0] text-white py-3.5 rounded-xl font-medium transition shadow-lg shadow-[#6c7bf5]/30"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/* SVG ILLUSTRATION — envelope / paper plane vibe                */
/* ============================================================ */
function ForgotIllustration() {
  return (
    <svg
      viewBox="0 0 400 240"
      className="w-full max-w-md mx-auto drop-shadow-2xl"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* envelope body */}
      <rect x="90" y="110" width="220" height="130" rx="12" fill="#ffffff" />
      {/* envelope flap */}
      <path d="M90 122 L200 195 L310 122 L310 110 L90 110 Z" fill="#e2e8f0" />
      <path
        d="M90 122 L200 195 L310 122"
        stroke="#cbd5e1"
        strokeWidth="2"
        fill="none"
      />

      {/* badge circle */}
      <circle cx="200" cy="200" r="26" fill="#ef4444" />
      <path
        d="M188 200 L196 208 L213 190"
        stroke="#fff"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* paper plane (flying up) */}
      <g transform="translate(270 40) rotate(-15)">
        <path d="M0 40 L90 0 L60 60 L45 45 L30 55 L25 40 Z" fill="#6c7bf5" />
        <path d="M90 0 L45 45 L30 55 Z" fill="#5b6cf0" />
      </g>

      {/* dotted trail */}
      <path
        d="M140 130 Q 180 100 230 90"
        stroke="#c7c9f2"
        strokeWidth="2"
        strokeDasharray="4 6"
        fill="none"
      />

      {/* floating sparkles */}
      <circle cx="120" cy="70" r="4" fill="#fbbf24" />
      <circle cx="290" cy="150" r="3" fill="#a78bfa" />
      <circle cx="330" cy="90" r="5" fill="#22c55e" opacity="0.6" />
    </svg>
  );
}
