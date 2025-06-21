import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast, ToastProps } from './Toast';

interface ToastContainerProps {
  toasts: ToastProps[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[9999] w-full max-w-sm md:max-w-md px-4 md:px-0 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { delay: index * 0.1 }
            }}
            exit={{ 
              opacity: 0, 
              x: 300, 
              scale: 0.8,
              transition: { duration: 0.3 }
            }}
            className="mb-3 pointer-events-auto"
            style={{ zIndex: 9999 - index }}
          >
            <Toast
              {...toast}
              onClose={onRemoveToast}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 