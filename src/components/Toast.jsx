import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast.visible) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} className="toast-icon text-green" />;
      case 'warning':
        return <AlertTriangle size={18} className="toast-icon text-yellow" />;
      case 'error':
        return <AlertCircle size={18} className="toast-icon text-red" />;
      default:
        return <Info size={18} className="toast-icon text-blue" />;
    }
  };

  return (
    <div className={`app-toast toast-${toast.type} animate-slide-down`}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-text">{toast.message}</span>
      </div>
    </div>
  );
}
