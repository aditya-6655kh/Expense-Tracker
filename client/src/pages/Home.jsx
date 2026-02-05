import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Expense Tracker</h1>
      <p className="text-lg mb-8">
        Track your expenses easily and efficiently.
      </p>
      <div className="space-x-4">
        <a href="/login" className="border rounded p-2 bg-blue-500 text-white">
          Sign In
        </a>
        <a href="/register" className="border rounded p-2 bg-blue-500 text-white">
          Sign Up
        </a>
      </div>
    </div>
  );
}
