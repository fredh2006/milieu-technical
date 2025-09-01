import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={errorId}
          aria-invalid={error ? 'true' : 'false'}
          className={`
            w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm bg-white/70 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
            disabled:bg-slate-100/70 disabled:cursor-not-allowed transition-all duration-200
            placeholder:text-slate-400
            ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;