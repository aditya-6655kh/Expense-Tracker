import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight, Wallet, TrendingUp, TrendingDown, PieChart as PieChartIcon,
  ShieldCheck, Zap, BadgeIndianRupee, LayoutDashboard, CheckCircle2,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50",
      title: "Track Income",
      desc: "Log every income source and watch your earnings grow with clear visual reports.",
    },
    {
      icon: TrendingDown, color: "text-red-500", bg: "bg-red-50",
      title: "Monitor Expenses",
      desc: "Categorize spending and instantly see where your money goes each month.",
    },
    {
      icon: PieChartIcon, color: "text-violet-600", bg: "bg-violet-50",
      title: "Visual Analytics",
      desc: "Beautiful charts and breakdowns for smarter financial decisions.",
    },
    {
      icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50",
      title: "Secure & Private",
      desc: "JWT authentication, rate limiting, and encrypted passwords keep you safe.",
    },
    {
      icon: Zap, color: "text-amber-500", bg: "bg-amber-50",
      title: "Instant Insights",
      desc: "Real-time balance, income, and expense stats always at your fingertips.",
    },
    {
      icon: BadgeIndianRupee, color: "text-indigo-600", bg: "bg-indigo-50",
      title: "INR Focused",
      desc: "Built for Indian users with native ₹ currency formatting throughout.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[var(--color-text)] overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[var(--color-primary)] p-2 rounded-xl">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold font-display">
              Expense<span className="text-[var(--color-primary)]">Tracker</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2 rounded-xl shadow-sm transition"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] px-4 py-2 rounded-lg transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="text-sm font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2 rounded-xl shadow-sm transition"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Gradient overlay */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[var(--color-primary)] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 fade-up">
              <Wallet size={14} />
              Personal Finance Made Simple
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold font-display leading-[1.1] mb-6 fade-up-1 text-[var(--color-text)]">
              Take control of{" "}
              <span className="text-[var(--color-primary)]">your money</span>
            </h1>

            <p className="text-lg text-[var(--color-text-secondary)] max-w-lg mx-auto mb-10 leading-relaxed fade-up-2">
              Track income, manage expenses, and visualize your financial health — all in one clean dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center fade-up-3">
              <button
                onClick={() => navigate(user ? "/dashboard" : "/register")}
                className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {user ? "Go to Dashboard" : "Start for Free"} <ArrowRight size={18} />
              </button>
              {!user && (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 border border-gray-200 text-[var(--color-text-secondary)] font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition"
                >
                  Log In
                </button>
              )}
            </div>
          </div>

          {/* Dashboard preview card */}
          <div className="mt-16 max-w-3xl mx-auto fade-up-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6">
              {/* Mini stat row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Balance", value: "₹1,26,011", color: "text-[var(--color-primary)]", bg: "bg-blue-50" },
                  { label: "Income", value: "₹1,30,000", color: "text-[var(--color-success)]", bg: "bg-emerald-50" },
                  { label: "Expenses", value: "₹3,989", color: "text-[var(--color-danger)]", bg: "bg-red-50" },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                    <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{s.label}</p>
                    <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Mini transaction rows */}
              <div className="space-y-1">
                {[
                  { desc: "Freelance Payment", cat: "Income", amount: "+₹45,000", type: "income", date: "Mar 1" },
                  { desc: "Grocery Shopping", cat: "Food", amount: "-₹2,340", type: "expense", date: "Mar 2" },
                  { desc: "Netflix Subscription", cat: "Entertainment", amount: "-₹649", type: "expense", date: "Mar 3" },
                  { desc: "Salary Credit", cat: "Income", amount: "+₹85,000", type: "income", date: "Mar 5" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === "income" ? "bg-emerald-50 text-[var(--color-success)]" : "bg-red-50 text-[var(--color-danger)]"}`}>
                        {t.type === "income" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">{t.desc}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{t.date} · {t.cat}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${t.type === "income" ? "text-[var(--color-success)]" : "text-[var(--color-text-secondary)]"}`}>
                      {t.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--color-text)] mb-3">
              Get started in 3 steps
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
              No credit card, no complex setup. Just sign up and start tracking.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Create Account", desc: "Sign up in seconds with just your email." },
              { step: "2", title: "Add Categories", desc: "Set up income and expense categories that fit your life." },
              { step: "3", title: "Track & Analyze", desc: "Log transactions and see your finances in real time." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-[var(--color-text)] mb-1">{s.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--color-text)] mb-3">
            Everything you need to manage money
          </h2>
          <p className="text-[var(--color-text-muted)] max-w-lg mx-auto">
            A complete toolkit for personal finance — without the complexity.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-gray-200 transition group"
            >
              <div className={`${f.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon size={20} className={f.color} />
              </div>
              <h3 className="font-bold text-[var(--color-text)] mb-1.5">{f.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social proof / trust ── */}
      <section className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--color-text)] mb-8">
            Why choose ExpenseTracker?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
            {[
              "100% free — no hidden charges",
              "No data selling — your finances stay private",
              "Works on any device — fully responsive",
              "Built with modern security standards",
              "Real-time dashboard with charts",
              "Native ₹ INR formatting throughout",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-[var(--color-success)] shrink-0 mt-0.5" />
                <span className="text-sm text-[var(--color-text-secondary)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[var(--sidebar-bg)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-4">
            Ready to take charge of your finances?
          </h2>
          <p className="text-slate-400 mb-8 text-base">
            Join and start tracking your money in minutes.
          </p>
          <button
            onClick={() => navigate(user ? "/dashboard" : "/register")}
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
          >
            {user ? "Open Dashboard" : "Create Free Account"} <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-[var(--color-primary)] p-1.5 rounded-lg">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold font-display">
              Expense<span className="text-[var(--color-primary)]">Tracker</span>
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} ExpenseTracker. Built for India 🇮🇳
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
