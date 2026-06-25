import { forwardRef } from "react";

const variants = {
  primary:
    "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-sm hover:shadow-md",
  secondary:
    "bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-gray-50 shadow-sm",
  danger:
    "bg-[var(--color-danger)] hover:bg-red-700 text-white shadow-sm",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:bg-gray-100",
  gradient:
    "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:from-[var(--color-primary-hover)] hover:to-[var(--color-accent-hover)] text-white shadow-md hover:shadow-lg",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-sm rounded-xl gap-2",
};

const Button = forwardRef(
  ({ variant = "primary", size = "md", isLoading = false, children, className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center font-semibold
          transition-all duration-200 ease-out
          active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
