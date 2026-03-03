import { useNavigate } from "react-router-dom";
import { Wallet, TrendingUp, TrendingDown, PieChart, ShieldCheck, Zap, ArrowRight, BadgeIndianRupee } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp size={22} className="text-blue-600" />,
      bg: "bg-blue-50",
      title: "Track Income",
      desc: "Log every income source and watch your earnings grow over time with clear visual reports.",
    },
    {
      icon: <TrendingDown size={22} className="text-red-500" />,
      bg: "bg-red-50",
      title: "Monitor Expenses",
      desc: "Categorize your spending and instantly see where your money goes each month.",
    },
    {
      icon: <PieChart size={22} className="text-purple-600" />,
      bg: "bg-purple-50",
      title: "Visual Analytics",
      desc: "Beautiful charts and breakdowns so you can make smarter financial decisions.",
    },
    {
      icon: <ShieldCheck size={22} className="text-green-600" />,
      bg: "bg-green-50",
      title: "Secure & Private",
      desc: "Your financial data stays yours. Authenticated access keeps your records safe.",
    },
    {
      icon: <Zap size={22} className="text-yellow-500" />,
      bg: "bg-yellow-50",
      title: "Instant Insights",
      desc: "Real-time balance, income, and expense stats always visible on your dashboard.",
    },
    {
      icon: <BadgeIndianRupee size={22} className="text-indigo-600" />,
      bg: "bg-indigo-50",
      title: "INR Focused",
      desc: "Built specifically for Indian users with native ₹ currency formatting throughout.",
    },
  ];

  const mockTransactions = [
    { id: 1, desc: "Freelance Payment", category: "Income", amount: "+₹45,000", type: "income", date: "Mar 1" },
    { id: 2, desc: "Grocery Shopping", category: "Food", amount: "-₹2,340", type: "expense", date: "Mar 2" },
    { id: 3, desc: "Netflix Subscription", category: "Entertainment", amount: "-₹649", type: "expense", date: "Mar 3" },
    { id: 4, desc: "Salary Credit", category: "Income", amount: "+₹85,000", type: "income", date: "Mar 5" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ExpenseTracker
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg transition"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left copy */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-white/10 border border-white/20 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              Personal Finance Made Simple
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Take Control of <br />
              <span className="text-yellow-300">Your Money</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              Track income, manage expenses, and visualize your financial health — all in one beautiful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/register")}
                className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Start for Free <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition"
              >
                Log In
              </button>
            </div>
          </div>

          {/* Right: mock dashboard card */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
              {/* mini stat row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Balance", value: "₹1,26,011", color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Income", value: "₹1,30,000", color: "text-green-600", bg: "bg-green-50" },
                  { label: "Expenses", value: "₹3,989", color: "text-red-500", bg: "bg-red-50" },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                    <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                    <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* mini transaction list */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Transactions</p>
              <div className="space-y-2">
                {mockTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${t.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                        {t.type === "income"
                          ? <TrendingUp size={14} className="text-green-600" />
                          : <TrendingDown size={14} className="text-red-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{t.desc}</p>
                        <p className="text-xs text-gray-400">{t.date} · {t.category}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${t.type === "income" ? "text-green-600" : "text-gray-700"}`}>
                      {t.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { value: "100%", label: "Free to Use" },
            { value: "Real-time", label: "Balance Updates" },
            { value: "₹ INR", label: "Native Currency" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                {s.value}
              </p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Everything you need to manage money
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A complete toolkit for tracking your personal finances without the complexity.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
            >
              <div className={`${f.bg} w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to take charge of your finances?
          </h2>
          <p className="text-blue-100 mb-10 text-lg">
            Join and start tracking your money in minutes — no credit card required.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-10 py-4 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-base"
          >
            Create Free Account <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ExpenseTracker
          </span>
          <p>© {new Date().getFullYear()} ExpenseTracker. Built for India 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
