import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const fetchDashBoardData = async () => {
    try {
      const statsResponse = await api.get("/routes/stats/dashboard/");
      setStats(statsResponse.data);
      const transactionsResponse = await api.get("/transactions/");
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashBoardData();
  }, []);

  if (loading)
    return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};
export default Dashboard;
