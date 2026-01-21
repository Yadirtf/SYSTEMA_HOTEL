'use client';

import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartSidebarProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartSidebar = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onCheckout,
}: CartSidebarProps) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header del Carrito */}
      <div className="p-6 bg-slate-900 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Venta Actual</h2>
              <p className="text-slate-400 text-xs">{items.length} productos añadidos</p>
            </div>
          </div>
          {items.length > 0 && (
            <button 
              onClick={onClearCart}
              className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
              title="Vaciar carrito"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Lista de Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <ShoppingBag size={32} />
            </div>
            <p className="text-sm font-medium text-center px-8">
              El carrito está vacío. <br /> Selecciona productos o escanea un código.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl group transition-all hover:bg-slate-100">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                <p className="text-xs text-slate-500">${item.price.toFixed(2)} c/u</p>
              </div>
              
              <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1">
                <button 
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="p-1 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-black text-slate-900">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="p-1 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button 
                onClick={() => onRemoveItem(item.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer / Resumen */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-6">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Total a Pagar</span>
          <span className="text-3xl font-black text-slate-900">${total.toFixed(2)}</span>
        </div>
        
        <Button 
          disabled={items.length === 0}
          onClick={onCheckout}
          className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 text-lg font-bold flex items-center justify-center gap-3"
        >
          <CreditCard size={24} /> Pagar Ahora
        </Button>
      </div>
    </div>
  );
};

