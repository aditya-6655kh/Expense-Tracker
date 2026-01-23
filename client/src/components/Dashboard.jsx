import React from "react";
import { useState, useEffect } from "react";
import InputExpense from "./InputExpense.jsx";

export default function Dashboard() {
  const [expense, setExpense] = useState([]);

  const getExpense = async () => {
    try {
      const response = await fetch("http://localhost:3000/expenses");
      const data = await response.json();
      console.log(data);
      setExpense(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    getExpense();
  }, []);

  return (
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Expense Dashboard</h2>
      <InputExpense />
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-center">Amount</th>
              <th className="py-3 px-6 text-center">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {expense.map((expense) => (
              <tr
                key={expense.expense_id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{expense.description}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span className="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs">
                    {expense.category}
                  </span>
                </td>
                <td className="py-3 px-6 text-center font-bold text-green-600">
                  ₹{expense.amount}
                </td>
                <td className="py-3 px-6 text-center">
                  {new Date(expense.expense_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
