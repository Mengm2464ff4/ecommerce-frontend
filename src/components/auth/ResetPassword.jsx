import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if no token in URL
  useEffect(() => {
    if (!token) {
      navigate("/forgot-password", { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = {};
    if (!form.password || form.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (form.password !== form.confirm) {
      errs.confirm = "Passwords do not match";
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, form.password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2200);
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Reset failed. The link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#6c7bf5] p-4 sm:p-8 overflow-hidden animate-fade-in">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white/10 animate-float" />
        <div
          className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-white/10 animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-white/40 animate-float" />
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

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 sm:p-10 animate-enter-right">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5b6cf0] to-[#7f8cf7] flex items-center justify-center shadow-lg shadow-[#6c7bf5]/30 mx-auto mb-6">
          <KeyRound className="w-6 h-6 text-white" />
        </div>

        {/* ---------- SUCCESS STATE ---------- */}
        {success ? (
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-60" />
              <div className="relative w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Password updated!
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Redirecting you to login...
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[#6c7bf5] hover:underline font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {/* ---------- FORM STATE ---------- */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Reset your password
            </h1>
            <p className="text-gray-500 text-sm mb-8 text-center">
              Choose a new password for your ShopHub account.
            </p>

            {serverError && (
              <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New password */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPwd ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full pl-11 pr-12 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6c7bf5]/20 transition ${
                      errors.password
                        ? "border-red-400 focus:border-red-400"
                        : "border-transparent focus:border-[#6c7bf5]"
                    }`}
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
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPwd ? "text" : "password"}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6c7bf5]/20 transition ${
                      errors.confirm
                        ? "border-red-400 focus:border-red-400"
                        : "border-transparent focus:border-[#6c7bf5]"
                    }`}
                  />
                </div>
                {errors.confirm && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.confirm}
                  </p>
                )}
              </div>

              {/* Security note */}
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Use a strong password with at least 6 characters. This link
                  expires in 30 minutes.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-glow w-full flex items-center justify-center gap-2 bg-[#6c7bf5] hover:bg-[#5b6cf0] disabled:bg-gray-300 text-white py-3.5 rounded-xl font-medium transition shadow-lg shadow-[#6c7bf5]/30"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Update password
                  </>
                )}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-500">
              Remembered it?{" "}
              <Link
                to="/login"
                className="text-[#6c7bf5] hover:underline font-semibold"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
