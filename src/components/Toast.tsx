import React, { useEffect } from 'react';
import { Sparkles, Info, Check, AlertCircle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info' | 'broadcast';
  title?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.type === 'broadcast' ? 8000 : 4000);
    return () => clearTimeout(timer);
  }, [onClose, toast.type]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'broadcast':
        return <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />;
      default:
        return <Info className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="animate-slide-up bg-slate-900/90 border border-slate-800/80 text-slate-100 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-start gap-3 relative overflow-hidden group">
      {/* Decorative gradient glow */}
      <div className={`absolute top-0 left-0 w-1 h-full ${
        toast.type === 'success' ? 'bg-emerald-500' :
        toast.type === 'error' ? 'bg-rose-500' :
        toast.type === 'broadcast' ? 'bg-blue-500' : 'bg-sky-500'
      }`} />
      
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
            {toast.title}
          </h4>
        )}
        <p className="text-sm font-medium text-slate-200 leading-relaxed">{toast.text}</p>
      </div>

      <button 
        onClick={onClose} 
        className="text-slate-500 hover:text-slate-300 transition-colors text-xs p-1"
      >
        ✕
      </button>
    </div>
  );
};
