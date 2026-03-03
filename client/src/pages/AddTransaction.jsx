import { useState, useEffect } from "react";
import { X, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Receipt } from "lucide-react";
import api from "../api/axios";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
    * { font-family: 'DM Sans', sans-serif; }
    .font-display { font-family: 'Sora', sans-serif; }

    @keyframes overlayIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes cardIn {
      from { opacity: 0; transform: scale(.94) translateY(16px); }
      to   { opacity: 1; transform: scale(1)  translateY(0); }
    }
    .overlay-in { animation: overlayIn .2s ease both; }
    .card-in    { animation: cardIn .25s ease both; }

    .form-input {
      width: 100%;
      padding: .7rem 1rem;
      background: rgba(248,250,252,0.8);
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: .875rem;
      color: #1e293b;
      outline: none;
      transition: all .2s ease;
    }
    .form-input:focus {
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 4px rgba(59,130,246,.1);
    }
    .form-input::placeholder { color: #94a3b8; }

    .amount-input {
      width: 100%;
      padding: .7rem 1rem .7rem 2.25rem;
      background: rgba(248,250,252,0.8);
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: .875rem;
      color: #1e293b;
      outline: none;
      transition: all .2s ease;
    }
    .amount-input:focus {
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 4px rgba(59,130,246,.1);
    }
    .amount-input::placeholder { color: #94a3b8; }
  `}</style>
);

const AddTransaction = ({ isOpen, isClose, onSuccess, transactionToEdit }) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get("/categories").then((res) => setCategories(res.data));

      if (transactionToEdit) {
        setFormData({
          amount: transactionToEdit.amount,
          description: transactionToEdit.description,
          type: transactionToEdit.type,
          date: new Date(transactionToEdit.date).toISOString().split("T")[0],
          category_id: transactionToEdit.category_id,
        });
      } else {
        setFormData({
          amount: "",
          description: "",
          type: "expense",
          date: new Date().toISOString().split("T")[0],
          category_id: "",
        });
      }
    }
  }, [isOpen, transactionToEdit]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) isClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (transactionToEdit) {
        await api.put(`/transactions/${transactionToEdit.transaction_id}`, formData);
      } else {
        await api.post("/transactions", formData);
      }
      onSuccess();
      isClose();
      setFormData({ ...formData, amount: "", description: "", category_id: "" });
    } catch {
      alert("Failed to save transaction");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isIncome = formData.type === "income";
  const filteredCategories = categories.filter((c) => c.type === formData.type);

  return (
    <>
      <GlobalStyles />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-in"
        style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        onClick={handleOverlayClick}
      >
        <div className="card-in bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl shadow ${isIncome ? "bg-gradient-to-br from-green-500 to-teal-500" : "bg-gradient-to-br from-red-500 to-pink-500"}`}>
                <Receipt size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-gray-900 leading-tight">
                  {transactionToEdit ? "Edit Transaction" : "New Transaction"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {transactionToEdit ? "Update the details below" : "Fill in the details below"}
                </p>
              </div>
            </div>
            <button
              onClick={isClose}
              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Gradient divider */}
          <div className="h-px mx-6 bg-gradient-to-r from-blue-100 via-purple-100 to-transparent mb-5" />

          {/* Body */}
          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                {["expense", "income"].map((type) => {
                  const active = formData.type === type;
                  const isInc = type === "income";
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type, category_id: "" })}
                      className={`flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl capitalize transition-all
                        ${active
                          ? isInc
                            ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                            : "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
                          : "text-gray-500 hover:text-gray-700 hover:bg-white hover:shadow-sm"
                        }`}
                    >
                      {isInc ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  );
                })}
              </div>

              {/* Amount & Date row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm pointer-events-none">₹</span>
                    <input
                      type="number"
                      required
                      className="amount-input"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
                <select
                  required
                  className="form-input appearance-none cursor-pointer"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select a category…</option>
                  {filteredCategories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>{c.name}</option>
                  ))}
                </select>
                {filteredCategories.length === 0 && (
                  <p className="text-xs text-amber-500 mt-1.5 font-medium">
                    No {formData.type} categories yet — add one first.
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="What was this for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Amount preview badge */}
              {formData.amount && (
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isIncome ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
                  {isIncome
                    ? <ArrowUpRight size={16} className="text-green-600 shrink-0" />
                    : <ArrowDownRight size={16} className="text-red-500 shrink-0" />}
                  <span className={`text-sm font-bold ${isIncome ? "text-green-700" : "text-red-600"}`}>
                    {isIncome ? "+" : "−"}₹{parseFloat(formData.amount || 0).toLocaleString("en-IN")}
                  </span>
                  {formData.description && (
                    <span className="text-xs text-gray-400 truncate">· {formData.description}</span>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all mt-1"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  transactionToEdit ? "Update Transaction" : "Save Transaction"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTransaction;