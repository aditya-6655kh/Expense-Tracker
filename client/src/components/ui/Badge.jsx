const variantStyles = {
  success: "bg-[var(--color-success-light)] text-[var(--color-success)]",
  danger: "bg-[var(--color-danger-light)] text-[var(--color-danger)]",
  warning: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  info: "bg-[var(--color-info-light)] text-[var(--color-info)]",
  neutral: "bg-gray-100 text-[var(--color-text-secondary)]",
};

const Badge = ({ variant = "neutral", children, className = "", dot = false }) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg
        ${variantStyles[variant]} ${className}
      `}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
      )}
      {children}
    </span>
  );
};

export default Badge;
