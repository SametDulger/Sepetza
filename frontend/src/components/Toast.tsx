import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../utils/cn';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
          text: 'text-green-800',
          accent: 'border-l-green-500'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200',
          text: 'text-red-800',
          accent: 'border-l-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200',
          text: 'text-yellow-800',
          accent: 'border-l-yellow-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
          text: 'text-blue-800',
          accent: 'border-l-blue-500'
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        mass: 0.8
      }}
      className={cn(
        "w-full border rounded-xl shadow-xl pointer-events-auto backdrop-blur-sm border-l-4",
        styles.bg,
        styles.accent
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      layout
    >
      <div className="p-5">
        <div className="flex items-start">
          <motion.div 
            className="flex-shrink-0"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {getIcon()}
          </motion.div>
          <div className="ml-4 w-0 flex-1">
            <motion.p 
              className={cn("text-base font-semibold", styles.text)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.p>
            {message && (
              <motion.p 
                className={cn("mt-2 text-sm opacity-90 leading-relaxed", styles.text)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </motion.p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <motion.button
              onClick={() => onClose(id)}
              className={cn(
                "inline-flex p-2 rounded-full transition-all duration-200 hover:bg-black hover:bg-opacity-10",
                styles.text
              )}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        
        {/* Progress bar */}
        {duration > 0 && (
          <motion.div
            className="mt-3 h-1 bg-black bg-opacity-10 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className={cn(
                "h-full rounded-full",
                type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              )}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}; 