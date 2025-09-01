import { useState, useRef, useEffect, useCallback } from 'react';
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
  id?: string;
}

export default function CustomSelect({
  label,
  error,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  id
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLButtonElement[]>([]);
  
  const selectId = id || `custom-select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const listboxId = `${selectId}-listbox`;

  const selectedOption = options.find(option => option.value === value);

  const handleOptionClick = useCallback((optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setActiveIndex(-1);
    buttonRef.current?.focus();
  }, [onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Focus management for active option
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && optionsRef.current[activeIndex]) {
      optionsRef.current[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, isOpen]);

  
  const handleButtonClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      // When opening, set active index to current selection if it exists
      const currentIndex = options.findIndex(opt => opt.value === value);
      setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
    } else {
      setActiveIndex(-1);
    }
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        e.stopPropagation();
        
        if (isOpen && activeIndex >= 0) {
          // If dropdown is open and an option is highlighted, select it
          handleOptionClick(options[activeIndex].value);
        } else {
          // Otherwise, open the dropdown
          handleButtonClick();
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          const currentIndex = options.findIndex(opt => opt.value === value);
          setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
        } else {
          setActiveIndex(prev => prev < options.length - 1 ? prev + 1 : 0);
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          const currentIndex = options.findIndex(opt => opt.value === value);
          setActiveIndex(currentIndex >= 0 ? currentIndex : options.length - 1);
        } else {
          setActiveIndex(prev => prev > 0 ? prev - 1 : options.length - 1);
        }
        break;
        
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          setActiveIndex(-1);
        }
        break;
        
      case 'Home':
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;
        
      case 'End':
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(options.length - 1);
        }
        break;
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div ref={selectRef} className="relative">
        <button
          ref={buttonRef}
          id={selectId}
          type="button"
          onClick={handleButtonClick}
          onKeyDown={handleButtonKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-describedby={errorId}
          aria-invalid={error ? 'true' : 'false'}
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
              aria-hidden="true"
            />
          </div>
        </button>

        {isOpen && (
          <div 
            className="absolute z-50 w-full min-w-max mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-2xl overflow-hidden"
            role="listbox"
            id={listboxId}
            aria-labelledby={selectId}
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option, index) => (
                <button
                  key={option.value}
                  ref={el => {
                    if (el) {
                      optionsRef.current[index] = el;
                    }
                  }}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleOptionClick(option.value)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOptionClick(option.value);
                    }
                  }}
                  className={`
                    w-full px-4 py-3 text-left transition-colors duration-150
                    flex items-center justify-between font-medium whitespace-nowrap
                    focus:outline-none focus:bg-blue-50/80
                    ${option.value === value 
                      ? 'bg-blue-100/80 text-blue-700' 
                      : 'text-slate-700'
                    }
                    ${index === activeIndex 
                      ? 'bg-blue-50/80 text-slate-900' 
                      : 'hover:bg-blue-50/80 hover:text-slate-900'
                    }
                  `}
                >
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-blue-600 ml-3 flex-shrink-0" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
}