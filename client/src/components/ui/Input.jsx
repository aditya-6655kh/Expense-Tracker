import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, icon: Icon, error, className = "", wrapperClassName = "", type = "text", ...props }, ref) => {
    return (
      <div className={wrapperClassName}>
        {label && (
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
            />
          )}
          <input
            ref={ref}
            type={type}
            className={`input-field ${Icon ? "input-with-icon" : ""} ${error ? "!border-[var(--color-danger)]" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[var(--color-danger)] mt-1 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
