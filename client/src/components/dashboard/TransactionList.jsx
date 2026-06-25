import { TrendingUp, TrendingDown, Edit2, Trash2, Wallet } from "lucide-react";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount ?? 0);

const TransactionList = ({ transactions = [], onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border-light)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between">
        <div>
          <h3 className="font-bold font-display text-[var(--color-text)]">Transactions</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {transactions.length} record{transactions.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--color-border-light)] max-h-[520px] overflow-y-auto custom-scroll">
        {transactions.length > 0 ? (
          transactions.map((t) => {
            const isIncome = t.category_type === "income";
            return (
              <div
                key={t.transaction_id}
                className="px-6 py-3.5 row-hover flex items-center justify-between gap-4 group"
              >
                {/* Icon + info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                    ${isIncome
                      ? "bg-[var(--color-success-light)] text-[var(--color-success)]"
                      : "bg-[var(--color-danger-light)] text-[var(--color-danger)]"
                    }`}
                  >
                    {isIncome ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[var(--color-text)] truncate">
                      {t.description || "Untitled"}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {new Date(t.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      &nbsp;·&nbsp;
                      <span className="text-[var(--color-primary)] font-medium">
                        {t.category_name || "Uncategorized"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Amount + actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`font-bold text-sm ${isIncome ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}
                  >
                    {isIncome ? "+" : "−"}{formatCurrency(t.amount)}
                  </span>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onEdit(t)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(t.transaction_id)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Wallet size={22} className="text-[var(--color-primary)]/40" />
            </div>
            <p className="text-[var(--color-text-secondary)] font-medium text-sm">
              No transactions yet
            </p>
            <p className="text-[var(--color-text-muted)] text-xs mt-1">
              Add your first transaction to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
