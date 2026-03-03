import { useState } from "react";
import { X, Tag, TrendingUp, TrendingDown } from "lucide-react";
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
    .card-in    { animation: cardIn   .25s ease both; }

    .type-btn {
      flex: 1;
      padding: .55rem .5rem;
      font-size: .85rem;
      font-weight: 700;
      border-radius: 10px;
      transition: all .18s ease;
      text-transform: capitalize;
    }

    .category-input {
      width: 100%;
      padding: .75rem 1rem;
      background: rgba(248,250,252,0.8);
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: .9rem;
      color: #1e293b;
      outline: none;
      transition: all .2s ease;
    }
    .category-input:focus {
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 4px rgba(59,130,246,.1);
    }
    .category-input::placeholder { color: #94a3b8; }
  `}</style>
);

const AddCategories = ({ isOpen, isClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: "", type: "expense" });
  const [isLoading, setIsLoading] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) isClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/categories", formData);
      onSuccess();
      isClose();
      setFormData({ ...formData, name: "" });
    } catch {
      alert("Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isIncome = formData.type === "income";

  return (
    <>
      <GlobalStyles />

      {/* Overlay — blurs the dashboard behind */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-in"
        style={{ background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        onClick={handleOverlayClick}
      >
        {/* Modal card */}
        <div className="card-in bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow">
                <Tag size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-gray-900 leading-tight">New Category</h2>
                <p className="text-xs text-gray-400 mt-0.5">Organise your transactions</p>
              </div>
            </div>
            <button
              onClick={isClose}
              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Thin gradient divider */}
          <div className="h-px mx-6 bg-gradient-to-r from-blue-100 via-purple-100 to-transparent mb-5" />

          {/* Body */}
          <div className="px-6 pb-6 space-y-5">

            {/* Type toggle */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Category Type</p>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                {["expense", "income"].map((type) => {
                  const active = formData.type === type;
                  const isInc = type === "income";
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type })}
                      className={`type-btn flex items-center justify-center gap-2
                        ${active
                          ? isInc
                            ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                            : "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
                          : "text-gray-500 hover:text-gray-700 hover:bg-white hover:shadow-sm"
                        }`}
                    >
                      {isInc
                        ? <TrendingUp size={15} />
                        : <TrendingDown size={15} />}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Category Name
              </label>
              <input
                type="text"
                required
                className="category-input"
                placeholder={isIncome ? "e.g. Salary, Freelance…" : "e.g. Groceries, Rent…"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Preview pill */}
            {formData.name && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Preview:</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
                  ${isIncome ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {isIncome ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {formData.name}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.name.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all mt-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategories;