import { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  onClose: (id: string) => void;
  duration?: number;
}

export default function Toast({ 
  id, 
  type, 
  title, 
  message, 
  onClose, 
  duration = 2000
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const config = {
    success: {
      icon: CheckCircle,
      bgClass: 'bg-emerald-50 border-emerald-200',
      iconClass: 'text-emerald-600',
      titleClass: 'text-emerald-900',
      messageClass: 'text-emerald-700'
    },
    error: {
      icon: XCircle,
      bgClass: 'bg-red-50 border-red-200',
      iconClass: 'text-red-600',
      titleClass: 'text-red-900',
      messageClass: 'text-red-700'
    },
    warning: {
      icon: AlertTriangle,
      bgClass: 'bg-amber-50 border-amber-200',
      iconClass: 'text-amber-600',
      titleClass: 'text-amber-900',
      messageClass: 'text-amber-700'
    }
  };

  const { icon: Icon, bgClass, iconClass, titleClass, messageClass } = config[type];

  return (
    <div 
      className={`
        max-w-sm w-full ${bgClass} border rounded-xl shadow-lg p-4 
        pointer-events-auto transition-all duration-300 ease-out
        animate-in slide-in-from-right-full
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${iconClass} flex-shrink-0 mt-0.5`} aria-hidden="true" />
        <div className="ml-3 flex-1">
          <h4 className={`text-sm font-semibold ${titleClass}`}>
            {title}
          </h4>
          {message && (
            <p className={`mt-1 text-sm ${messageClass}`}>
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 rounded-lg"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}