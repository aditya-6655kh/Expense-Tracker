import { useState } from "react";
import { Tag, TrendingUp, TrendingDown } from "lucide-react";
import api from "../../api/axios";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useToast } from "../../context/ToastContext";

const AddCategories = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({ name: "", type: "expense" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/categories", formData);
      toast.success("Category created successfully");
      onSuccess();
      onClose();
      setFormData({ ...formData, name: "" });
    } catch {
      toast.error("Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  const isIncome = formData.type === "income";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Category"
      subtitle="Organise your transactions"
      icon={Tag}
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type toggle */}
        <div>
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
            Category Type
          </p>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {["expense", "income"].map((type) => {
              const active = formData.type === type;
              const isInc = type === "income";
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
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
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
            Category Name
          </label>
          <input
            type="text"
            required
            className="input-field"
            placeholder={isIncome ? "e.g. Salary, Freelance…" : "e.g. Groceries, Rent…"}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Preview */}
        {formData.name && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)]">Preview:</span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
              ${isIncome ? "bg-[var(--color-success-light)] text-[var(--color-success)]" : "bg-[var(--color-danger-light)] text-[var(--color-danger)]"}`}
            >
              {isIncome ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {formData.name}
            </span>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={!formData.name.trim()}
          className="w-full"
        >
          Create Category
        </Button>
      </form>
    </Modal>
  );
};

export default AddCategories;
