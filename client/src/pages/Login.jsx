import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, LayoutDashboard } from "lucide-react";
import Button from "../components/ui/Button";

export default function Login() {
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(userDetails.email, userDetails.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 px-4">
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-blue-500 opacity-15 blur-3xl pointer-events-none float" />
      <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-indigo-600 opacity-15 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md p-8 sm:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-8 fade-up">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-[var(--color-primary)] p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display text-[var(--color-text)]">
              Expense<span className="text-[var(--color-primary)]">Tracker</span>
            </span>
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-8 fade-up-1">
          <h2 className="text-2xl font-bold font-display text-[var(--color-text)] mb-1">Welcome back</h2>
          <p className="text-[var(--color-text-muted)] text-sm">Log in to your account to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 bg-[var(--color-danger-light)] border border-red-100 text-[var(--color-danger)] text-sm rounded-xl fade-up font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="fade-up-2">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="email"
                className="input-field input-with-icon"
                placeholder="john@example.com"
                value={userDetails.email}
                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="fade-up-3">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                className="input-field input-with-icon"
                placeholder="Enter your password"
                value={userDetails.password}
                onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="fade-up-4 pt-2">
            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
              {isLoading ? "Logging in…" : <><span>Log In</span> <ArrowRight size={17} /></>}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6 fade-up-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-[var(--color-text-muted)] font-medium">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-[var(--color-text-muted)] fade-up-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline transition">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}