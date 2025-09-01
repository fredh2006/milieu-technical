import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CustomSelectProps {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomSelect({
  label,
  error,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = ''
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm bg-white/70 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
            disabled:bg-slate-100/70 disabled:cursor-not-allowed transition-all duration-200
            text-slate-700 font-medium cursor-pointer text-left
            hover:border-slate-300 hover:shadow-md
            ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : ''}
            ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-400' : ''}
            ${className}
          `}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOption ? 'text-slate-700' : 'text-slate-400'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown 
              className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full min-w-max mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-2xl overflow-hidden">
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-blue-50/80 transition-colors duration-150
                    flex items-center justify-between font-medium whitespace-nowrap
                    ${option.value === value 
                      ? 'bg-blue-100/80 text-blue-700' 
                      : 'text-slate-700 hover:text-slate-900'
                    }
                  `}
                >
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-blue-600 ml-3 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}