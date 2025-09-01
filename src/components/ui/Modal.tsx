import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'md' 
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md transition-all duration-300"
          onClick={onClose}
        />
        <div className={`relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full ${maxWidthClasses[maxWidth]} z-10 transform transition-all duration-300 animate-in fade-in-0 zoom-in-95`}>
          <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-black hover:text-red-400 transition-all duration-200 p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 bg-gradient-to-br from-white/90 to-slate-50/50 rounded-b-2xl backdrop-blur-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}