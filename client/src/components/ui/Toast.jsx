import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

const icons = {
  success: <CheckCircle2 size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

const styles = {
  success: "bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/20",
  error: "bg-[var(--color-danger-light)] text-[var(--color-danger)] border-[var(--color-danger)]/20",
  info: "bg-[var(--color-info-light)] text-[var(--color-info)] border-[var(--color-info)]/20",
  warning: "bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/20",
};

const Toast = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto slide-in-right
            flex items-center gap-3 px-4 py-3 rounded-xl border
            shadow-lg font-medium text-sm
            ${styles[toast.type] || styles.info}
          `}
        >
          <span className="shrink-0">{icons[toast.type] || icons.info}</span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
