import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, LayoutDashboard } from "lucide-react";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');
    * { font-family: 'DM Sans', sans-serif; }
    h1,h2,h3,.font-display { font-family: 'Sora', sans-serif; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-10px); }
    }
    .fade-up   { animation: fadeUp .5s ease both; }
    .fade-up-1 { animation: fadeUp .5s .1s ease both; }
    .fade-up-2 { animation: fadeUp .5s .2s ease both; }
    .fade-up-3 { animation: fadeUp .5s .3s ease both; }
    .fade-up-4 { animation: fadeUp .5s .4s ease both; }
    .fade-up-5 { animation: fadeUp .5s .5s ease both; }
    .float     { animation: float 4s ease-in-out infinite; }

    .input-field {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.75rem;
      background: rgba(255,255,255,0.7);
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.9rem;
      color: #1e293b;
      outline: none;
      transition: all .2s ease;
    }
    .input-field:focus {
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 4px rgba(59,130,246,.1);
    }
    .input-field::placeholder { color: #94a3b8; }

    .glass-card {
      background: rgba(255,255,255,0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.9);
    }
  `}</style>
);

export default function Register() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await api.post("/users/register", userInfo);
      await login(userInfo.email, userInfo.password);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 px-4">
      <GlobalStyles />

      {/* decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-blue-500 opacity-20 blur-3xl pointer-events-none float" />
      <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-purple-600 opacity-20 blur-3xl pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-indigo-400 opacity-10 blur-2xl pointer-events-none" />

      {/* card */}
      <div className="glass-card rounded-3xl shadow-2xl w-full max-w-md p-8 sm:p-10">

        {/* logo */}
        <div className="flex justify-center mb-8 fade-up">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ExpenseTracker
            </span>
          </Link>
        </div>

        {/* heading */}
        <div className="text-center mb-8 fade-up-1">
          <h2 className="text-2xl font-bold font-display text-gray-900 mb-1">Create your account</h2>
          <p className="text-gray-500 text-sm">Start tracking your finances for free</p>
        </div>

        {/* error */}
        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl fade-up">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* username */}
          <div className="fade-up-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                className="input-field"
                placeholder="johndoe"
                value={userInfo.username}
                onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                required
              />
            </div>
          </div>

          {/* email */}
          <div className="fade-up-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="email"
                className="input-field"
                placeholder="john@example.com"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* password */}
          <div className="fade-up-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Create a strong password"
                value={userInfo.password}
                onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* submit */}
          <div className="fade-up-5 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* divider */}
        <div className="flex items-center gap-3 my-6 fade-up-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* login link */}
        <p className="text-center text-sm text-gray-500 fade-up-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:text-purple-600 transition">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}