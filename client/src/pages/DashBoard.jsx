import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import AddTransaction from "./AddTransaction.jsx";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Plus, Wallet, TrendingUp, TrendingDown, LogOut, Tag, Trash2, Edit2 } from "lucide-react";
import AddCategories from "./AddCategories.jsx";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [chartData, setChartData] = useState([]);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const fetchDashBoardData = async () => {
    try {
      const [statsRes, transactionsRes, chartRes] = await Promise.all([
        api.get("/stats/dashboard"),
        api.get("/transactions"),
        api.get("/stats/chart"),
      ]);
      setStats(statsRes.data);
      setTransactions(transactionsRes.data);
      
      const formattedChartData = chartRes.data.map((item) => ({
        name: item.category_name || item.name || "Uncategorized",
        value: parseFloat(item.total),
      }));
      setChartData(formattedChartData);
    }catch(err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you wanna delete this transaction ? This action cannot be undone.")) return;

    try{
      await api.delete(`/transactions/${id}`);
      fetchDashBoardData();
    }catch(err) {
      alert("Failed to delete transaction");
    }
  }

  useEffect(() => {
    fetchDashBoardData();
  }, []);

  if (loading)
    return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ExpenseTracker
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium hidden sm:block">
                  {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-600 transition bg-gray-100 rounded-full hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-gray-500 text-sm">Overview of your finances</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsCategoryModalOpen(true)} className="flex item-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg shadow-sm transition">
                <Tag size={20} className="text-blue-500" />
                <span className="hidden sm:inline"> Add Category </span>
              </button>
              <button
                onClick={() => {setTransactionToEdit(null); setIsModalOpen(true);}}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition transform hover:scale-105"
              >
                <Plus size={20} /> Add Transaction
              </button>
            </div>
            
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Balance"
              amount={stats.balance}
              icon={<Wallet className="text-white" size={24} />}
              color="bg-blue-600"
              formatCurrency={formatCurrency}
            />
            <StatCard
              title="Income"
              amount={stats.income}
              icon={<TrendingUp className="text-white" size={24} />}
              color="bg-green-500"
              formatCurrency={formatCurrency}
            />
            <StatCard
              title="Expenses"
              amount={stats.expense}
              icon={<TrendingDown className="text-white" size={24} />}
              color="bg-red-500"
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Content Grid: Charts & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Transactions List (Takes up 2/3 space) */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-700">Recent Transactions</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <div key={t.transaction_id} className="p-4 hover:bg-gray-50 flex justify-between items-center transition">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${t.category_type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {t.category_type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{t.description}</p>
                          <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()} • {t.category_name || "Uncategorized"}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${t.category_type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                        {t.category_type === 'expense' && "-"}
                        {formatCurrency(t.amount)}
                      </span>
                      <div className="flex item-center gap-4">
                        <span className={`font-bold ${t.category_type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                          {t.category_type === 'expense' && "-"}
                          {formatCurrency(t.amount)}
                        </span>

                        <button onClick={() => {setTransactionToEdit(t); setIsModalOpen(true);}} className="text-gray-300 hover:text-blue-50 p-2 rounded-full transition" title="Edit transaction"><Edit2 size={18} /></button>

                        <button onClick={() => handleDeleteTransaction(t.transaction_id)} className="text-gray-300 hover:text-red-500 p-2 rounded-full transition" title="delete transaction"><Trash2 size={18}></Trash2></button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-gray-400">No transactions found.</div>
                )}
              </div>
            </div>

            {/* Right Column: Analytics (Takes up 1/3 space) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-700 mb-6">Spending by Category</h3>
              <div className="w-full" style={{minHeight: "250px"}}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Add expenses to see analytics
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Modal Component */}
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


  // Helper Component for the top cards
  const StatCard = ({ title, amount, icon, color, formatCurrency }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 transition hover:shadow-md">
      <div className={`${color} p-4 rounded-full shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(amount)}</h3>
      </div>
    </div>
);

export default Dashboard;
