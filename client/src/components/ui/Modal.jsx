import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, subtitle, icon: Icon, iconBg = "bg-gradient-to-br from-blue-500 to-purple-600", children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-in"
      style={{ background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      onClick={handleOverlayClick}
    >
      <div className={`card-in bg-white rounded-2xl shadow-xl w-full ${maxWidth} overflow-hidden`}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`p-2.5 rounded-xl shadow-sm ${iconBg}`}>
                <Icon size={18} className="text-white" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold font-display text-[var(--color-text)] leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px mx-6 bg-gradient-to-r from-[var(--color-border)] via-[var(--color-border-light)] to-transparent mb-5" />

        {/* Content */}
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
