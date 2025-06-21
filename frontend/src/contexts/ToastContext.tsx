import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ToastContainer';

interface ToastContextType {
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, showSuccess, showError, showWarning, showInfo, removeToast } = useToast();

  // Listen for custom toast events from API service
  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const { type, title, message } = event.detail;
      
      switch (type) {
        case 'success':
          showSuccess(title, message);
          break;
        case 'error':
          showError(title, message);
          break;
        case 'warning':
          showWarning(title, message);
          break;
        case 'info':
          showInfo(title, message);
          break;
        default:
          showInfo(title, message);
      }
    };

    window.addEventListener('showToast', handleShowToast as EventListener);
    
    return () => {
      window.removeEventListener('showToast', handleShowToast as EventListener);
    };
  }, [showSuccess, showError, showWarning, showInfo]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}; 