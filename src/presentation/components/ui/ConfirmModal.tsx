'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/shared/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  isLoading?: boolean;
  showCancel?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  showCancel = true
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "p-3 rounded-2xl",
                  variant === 'danger' ? "bg-red-50 text-red-600" :
                    variant === 'warning' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                )}>
                  {variant === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {showCancel && (
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1 rounded-xl h-12"
                    disabled={isLoading}
                  >
                    {cancelText}
                  </Button>
                )}
                <Button
                  variant={variant === 'danger' ? 'primary' : 'primary'} // Ajustar según estilos globales
                  onClick={onConfirm}
                  isLoading={isLoading}
                  className={cn(
                    "flex-1 rounded-xl h-12",
                    variant === 'danger' && "bg-red-600 hover:bg-red-700 shadow-red-100",
                    variant === 'success' && "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                  )}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};



