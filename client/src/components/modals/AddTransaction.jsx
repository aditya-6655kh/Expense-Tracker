import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Receipt } from "lucide-react";
import api from "../../api/axios";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useToast } from "../../context/ToastContext";

const AddTransaction = ({ isOpen, onClose, onSuccess, transactionToEdit }) => {
  const toast = useToast();
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
          type: transactionToEdit.category_type || "expense",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (transactionToEdit) {
        await api.put(`/transactions/${transactionToEdit.transaction_id}`, formData);
        toast.success("Transaction updated successfully");
      } else {
        await api.post("/transactions", formData);
        toast.success("Transaction added successfully");
      }
      onSuccess();
      onClose();
      setFormData({ ...formData, amount: "", description: "", category_id: "" });
    } catch {
      toast.error("Failed to save transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const isIncome = formData.type === "income";
  const filteredCategories = categories.filter((c) => c.type === formData.type);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? "Edit Transaction" : "New Transaction"}
      subtitle={transactionToEdit ? "Update the details below" : "Fill in the details below"}
      icon={Receipt}
      iconBg={isIncome
        ? "bg-gradient-to-br from-emerald-500 to-teal-600"
        : "bg-gradient-to-br from-red-500 to-pink-500"
      }
    >
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
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
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

        {/* Amount & Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm pointer-events-none">₹</span>
              <input
                type="number"
                required
                className="input-field input-with-icon"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">
              Date
            </label>
            <input
              type="date"
              required
              className="input-field"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">
            Category
          </label>
          <select
            required
            className="input-field appearance-none cursor-pointer"
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
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">
            Description
          </label>
          <input
            type="text"
            required
            className="input-field"
            placeholder="What was this for?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Amount preview */}
        {formData.amount && (
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isIncome ? "bg-[var(--color-success-light)] border-emerald-100" : "bg-[var(--color-danger-light)] border-red-100"}`}>
            {isIncome
              ? <ArrowUpRight size={16} className="text-[var(--color-success)] shrink-0" />
              : <ArrowDownRight size={16} className="text-[var(--color-danger)] shrink-0" />}
            <span className={`text-sm font-bold ${isIncome ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
              {isIncome ? "+" : "−"}₹{parseFloat(formData.amount || 0).toLocaleString("en-IN")}
            </span>
            {formData.description && (
              <span className="text-xs text-[var(--color-text-muted)] truncate">· {formData.description}</span>
            )}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-1"
        >
          {transactionToEdit ? "Update Transaction" : "Save Transaction"}
        </Button>
      </form>
    </Modal>
  );
};

export default AddTransaction;
