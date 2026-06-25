import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { Plus, Tag, ChevronDown, Sparkles } from "lucide-react";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatCards from "../components/dashboard/StatCards";
import TransactionList from "../components/dashboard/TransactionList";
import SpendingChart from "../components/dashboard/SpendingChart";
import AddTransaction from "../components/modals/AddTransaction";
import AddCategories from "../components/modals/AddCategories";
import Button from "../components/ui/Button";

const Dashboard = () => {
  const toast = useToast();
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
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
      toast.success("Transaction deleted");
      fetchDashBoardData();
    } catch {
      toast.error("Failed to delete transaction");
    }
  };

  useEffect(() => { fetchDashBoardData(); }, []);

  /* ─── Month filtering ─── */
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
        const n = t.category_name || "Uncategorized";
        map[n] = (map[n] || 0) + parseFloat(t.amount);
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions, chartData, selectedMonth]);

  /* ─── Skeleton Loading ─── */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
            <div className="skeleton h-80 rounded-2xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-up">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
                {selectedMonth === "all"
                  ? "All Time Overview"
                  : new Date(selectedMonth + "-01T00:00:00").toLocaleString("default", { month: "long", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[var(--color-text)]">Dashboard</h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Month filter */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2.5 text-sm font-medium bg-white border border-[var(--color-border)] rounded-xl shadow-sm outline-none cursor-pointer text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary)]"
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
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsCategoryModalOpen(true)}
            >
              <Tag size={15} className="text-[var(--color-primary)]" />
              <span className="hidden sm:inline">Categories</span>
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => { setTransactionToEdit(null); setIsModalOpen(true); }}
            >
              <Plus size={17} />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <StatCards stats={displayStats} />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-up-4">
          <div className="lg:col-span-2">
            <TransactionList
              transactions={filteredTransactions}
              onEdit={(t) => { setTransactionToEdit(t); setIsModalOpen(true); }}
              onDelete={handleDeleteTransaction}
            />
          </div>
          <SpendingChart data={displayChartData} />
        </div>
      </div>

      {/* Modals */}
      <AddTransaction
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashBoardData}
        transactionToEdit={transactionToEdit}
      />
      <AddCategories
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => {
          fetchDashBoardData();
        }}
      />
    </DashboardLayout>
  );
};

export default Dashboard;