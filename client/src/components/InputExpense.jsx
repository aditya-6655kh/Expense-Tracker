import React, { useState } from "react";

export default function InputExpense() {
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Food",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        description: newExpense.description,
        amount: newExpense.amount,
        category: newExpense.category,
      };

      await fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      window.location.reload();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Add New Expense
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Description Input */}
        <input
          type="text"
          placeholder="Description (e.g. Coffee)"
          className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          required
        />

        {/* Category Dropdown */}
        <select
          className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 bg-white"
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
        >
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>

        {/* Amount Input */}
        <input
          type="number"
          placeholder="Amount"
          className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          required
        />

        {/* Add Button */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200">
          Add Expense
        </button>
      </form>
    </div>
  );
}
