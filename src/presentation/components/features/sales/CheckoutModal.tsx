'use client';

import { useState, useEffect } from "react";
import { X, CreditCard, Banknote, Wallet, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (paymentMethod: string, receivedAmount: number) => void;
  isLoading?: boolean;
}

export const CheckoutModal = ({ isOpen, onClose, total, onConfirm, isLoading }: CheckoutModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER'>('CASH');
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [change, setChange] = useState<number>(0);

  useEffect(() => {
    const received = parseFloat(receivedAmount) || 0;
    setChange(Math.max(0, received - total));
  }, [receivedAmount, total]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(paymentMethod, parseFloat(receivedAmount) || total);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Finalizar Venta</h2>
              <p className="text-slate-500 font-medium">Completa los detalles del pago</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Total a Pagar Display */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-center text-white">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Neto</p>
              <h3 className="text-5xl font-black">${total.toFixed(2)}</h3>
            </div>

            {/* Métodos de Pago */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'CASH', label: 'Efectivo', icon: Banknote, color: 'emerald' },
                { id: 'CARD', label: 'Tarjeta', icon: CreditCard, color: 'blue' },
                { id: 'TRANSFER', label: 'Transf.', icon: Wallet, color: 'amber' },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all ${
                    paymentMethod === method.id 
                      ? `border-slate-900 bg-slate-900 text-white shadow-lg` 
                      : `border-slate-100 bg-white text-slate-400 hover:border-slate-200`
                  }`}
                >
                  <method.icon size={24} />
                  <span className="text-xs font-bold uppercase tracking-wider">{method.label}</span>
                </button>
              ))}
            </div>

            {/* Calculadora de Cambio (Solo para efectivo) */}
            {paymentMethod === 'CASH' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Monto Recibido</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
                    <input
                      autoFocus
                      type="number"
                      step="0.01"
                      className="w-full h-16 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-[24px] pl-10 pr-4 text-xl font-black text-slate-900 outline-none transition-all"
                      placeholder="0.00"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">Cambio / Vuelto</label>
                  <div className="h-16 flex items-center justify-end pr-4">
                    <span className={`text-3xl font-black ${change > 0 ? 'text-emerald-500' : 'text-slate-300'}`}>
                      ${change.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de Confirmación */}
            <Button
              isLoading={isLoading}
              onClick={handleConfirm}
              className="w-full h-20 rounded-[28px] bg-slate-900 hover:bg-slate-800 text-white text-xl font-black flex items-center justify-center gap-4 shadow-xl shadow-slate-200"
            >
              Confirmar Venta <ArrowRight size={24} />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

