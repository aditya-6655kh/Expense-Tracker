import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState, useMemo } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import AddTransaction from "./AddTransaction.jsx";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  Plus, Wallet, TrendingUp, TrendingDown, LogOut,
  Tag, Trash2, Edit2, LayoutDashboard, ChevronDown,
  ArrowUpRight, ArrowDownRight, Sparkles,
} from "lucide-react";
import AddCategories from "./AddCategories.jsx";

/* ─── tiny pulse animation injected once ─── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

    * { font-family: 'DM Sans', sans-serif; }
    h1,h2,h3,.font-display { font-family: 'Sora', sans-serif; }

    @keyframes fadeUp {
      from { opacity:0; transform:translateY(18px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    .fade-up          { animation: fadeUp .45s ease both; }
    .fade-up-1        { animation: fadeUp .45s .08s ease both; }
    .fade-up-2        { animation: fadeUp .45s .16s ease both; }
    .fade-up-3        { animation: fadeUp .45s .24s ease both; }
    .fade-up-4        { animation: fadeUp .45s .32s ease both; }

    .glass {
      background: rgba(255,255,255,0.55);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    .card-hover {
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .card-hover:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(59,130,246,.13);
    }
    .row-hover:hover { background: #f8faff; }

    /* custom scrollbar */
    .custom-scroll::-webkit-scrollbar { width: 4px; }
    .custom-scroll::-webkit-scrollbar-track { background: transparent; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #dbeafe; border-radius: 99px; }
  `}</style>
);

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount ?? 0);

/* ─── Stat Card ─── */
const StatCard = ({ title, amount, icon, gradient, delay = "" }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 shadow-md card-hover fade-up${delay}`}
       style={{ background: gradient }}>
    {/* decorative circle */}
    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white opacity-10" />
    <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white opacity-5" />

    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-2">{title}</p>
        <h3 className="text-2xl font-bold text-white font-display">{formatCurrency(amount)}</h3>
      </div>
      <div className="bg-white/20 p-3 rounded-xl">
        {icon}
      </div>
    </div>
  </div>
);

/* ─── Main Dashboard ─── */
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");

  const fetchDashBoardData = async () => {
    try {
      const [statsRes, transactionsRes, chartRes] = await Promise.all([
        api.get("/stats/dashboard"),
        api.get("/transactions"),
        api.get("/stats/chart"),
      ]);
      setStats(statsRes.data);
      setTransactions(transactionsRes.data);
      setChartData(
        chartRes.data.map((item) => ({
          name: item.category_name || item.name || "Uncategorized",
          value: parseFloat(item.total),
        }))
      );
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Delete this transaction? This cannot be undone.")) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchDashBoardData();
    } catch {
      alert("Failed to delete transaction");
    }
  };

  useEffect(() => { fetchDashBoardData(); }, []);

  /* ─── filtering logic (unchanged) ─── */
  const getLocalMonthYear = (dateString) => {
    if (!dateString) return "";
    const match = String(dateString).match(/^(\d{4})-(\d{2})/);
    if (match) return `${match[1]}-${match[2]}`;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const availableMonths = useMemo(() => {
    const months = transactions.map((t) => getLocalMonthYear(t.date));
    return [...new Set(months)].sort().reverse();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (selectedMonth === "all") return transactions;
    return transactions.filter((t) => getLocalMonthYear(t.date) === selectedMonth);
  }, [transactions, selectedMonth]);

  const displayStats = useMemo(() => {
    if (selectedMonth === "all") return stats;
    return filteredTransactions.reduce(
      (acc, t) => {
        const amount = parseFloat(t.amount);
        if (t.category_type === "income") { acc.income += amount; acc.balance += amount; }
        else { acc.expense += amount; acc.balance -= amount; }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [filteredTransactions, stats, selectedMonth]);

  const displayChartData = useMemo(() => {
    if (selectedMonth === "all") return chartData;
    const map = {};
    filteredTransactions.forEach((t) => {
      if (t.category_type === "expense") {
        const n = t.category_name || t.name || "Uncategorized";
        map[n] = (map[n] || 0) + parseFloat(t.amount);
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions, chartData, selectedMonth]);

  /* ─── Loading ─── */
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center">
        <GlobalStyles />
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-400 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-blue-200 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <GlobalStyles />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-30 glass border-b border-white/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold font-display bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ExpenseTracker
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* month filter */}
            <div className="relative hidden sm:flex items-center">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2 text-sm font-medium bg-white border border-blue-100 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer text-gray-700 transition"
              >
                <option value="all">All Time</option>
                {availableMonths.map((month) => {
                  const date = new Date(month + "-01T00:00:00");
                  return (
                    <option key={month} value={month}>
                      {date.toLocaleString("default", { month: "long", year: "numeric" })}
                    </option>
                  );
                })}
              </select>
              <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
            </div>

            {/* user pill */}
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-1.5 shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.username?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.username}</span>
            </div>

            <button
              onClick={logout}
              className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition shadow-sm"
              title="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-up">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-yellow-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                {selectedMonth === "all"
                  ? "All Time Overview"
                  : new Date(selectedMonth + "-01T00:00:00").toLocaleString("default", { month: "long", year: "numeric" })}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display text-gray-900">Dashboard</h2>
          </div>

          <div className="flex gap-3">
            {/* mobile month filter */}
            <div className="relative flex sm:hidden items-center">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 text-sm font-medium bg-white border border-blue-100 rounded-xl shadow-sm outline-none cursor-pointer text-gray-700"
              >
                <option value="all">All Time</option>
                {availableMonths.map((month) => {
                  const date = new Date(month + "-01T00:00:00");
                  return (
                    <option key={month} value={month}>
                      {date.toLocaleString("default", { month: "long", year: "numeric" })}
                    </option>
                  );
                })}
              </select>
              <ChevronDown size={14} className="absolute right-2 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl shadow-sm transition text-sm font-medium"
            >
              <Tag size={16} className="text-blue-500" />
              <span className="hidden sm:inline">Categories</span>
            </button>

            <button
              onClick={() => { setTransactionToEdit(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl shadow-md transition text-sm font-semibold"
            >
              <Plus size={18} /> Add Transaction
            </button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            title="Total Balance"
            amount={displayStats.balance}
            icon={<Wallet size={20} className="text-white" />}
            gradient="linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)"
            delay="-1"
          />
          <StatCard
            title="Total Income"
            amount={displayStats.income}
            icon={<ArrowUpRight size={20} className="text-white" />}
            gradient="linear-gradient(135deg, #059669 0%, #0d9488 100%)"
            delay="-2"
          />
          <StatCard
            title="Total Expenses"
            amount={displayStats.expense ?? displayStats.expenses}
            icon={<ArrowDownRight size={20} className="text-white" />}
            gradient="linear-gradient(135deg, #dc2626 0%, #db2777 100%)"
            delay="-3"
          />
        </div>

        {/* ── Main content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-up-4">

          {/* Transactions list — 2/3 */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* header */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold font-display text-gray-800">Transactions</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {filteredTransactions.length} record{filteredTransactions.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Live
                </span>
              </div>
            </div>

            {/* list */}
            <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto custom-scroll">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <div
                    key={t.transaction_id}
                    className="px-6 py-4 row-hover flex items-center justify-between gap-4 transition group"
                  >
                    {/* icon + info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm
                        ${t.category_type === "income"
                          ? "bg-gradient-to-br from-green-400 to-teal-500"
                          : "bg-gradient-to-br from-red-400 to-pink-500"}`}>
                        {t.category_type === "income"
                          ? <TrendingUp size={18} className="text-white" />
                          : <TrendingDown size={18} className="text-white" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{t.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          &nbsp;·&nbsp;
                          <span className="text-blue-400 font-medium">{t.category_name || "Uncategorized"}</span>
                        </p>
                      </div>
                    </div>

                    {/* amount + actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`font-bold text-sm ${t.category_type === "income" ? "text-green-600" : "text-red-500"}`}>
                        {t.category_type === "expense" ? "−" : "+"}{formatCurrency(t.amount)}
                      </span>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => { setTransactionToEdit(t); setIsModalOpen(true); }}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(t.transaction_id)}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Wallet size={26} className="text-blue-300" />
                  </div>
                  <p className="text-gray-400 font-medium">No transactions yet</p>
                  <p className="text-gray-300 text-sm mt-1">Add your first transaction to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Chart — 1/3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="font-bold font-display text-gray-800">Spending Breakdown</h3>
              <p className="text-xs text-gray-400 mt-0.5">By category</p>
            </div>

            {displayChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={displayChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={82}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {displayChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 16px rgba(0,0,0,.08)",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="mt-4 space-y-2">
                  {displayChartData.slice(0, 5).map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm text-gray-600 truncate max-w-[120px]">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingDown size={26} className="text-purple-300" />
                </div>
                <p className="text-gray-400 font-medium text-sm">No expense data</p>
                <p className="text-gray-300 text-xs mt-1">Add expenses to see breakdown</p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Modals */}
      <AddTransaction
        isOpen={isModalOpen}
        isClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashBoardData}
        transactionToEdit={transactionToEdit}
      />
      <AddCategories
        isOpen={isCategoryModalOpen}
        isClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => console.log("Category added successfully")}
      />
    </div>
  );
};

export default Dashboard;