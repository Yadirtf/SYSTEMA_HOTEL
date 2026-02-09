'use client';

import { Product } from "@/domain/entities/Store";
import { Package, Search, AlertTriangle, Info, Plus } from "lucide-react";

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export const ProductCatalog = ({ products, onAddToCart, search, onSearchChange }: ProductCatalogProps) => {
  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Barra de Búsqueda */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o código de barras..."
          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border-2 border-transparent shadow-sm focus:border-slate-900 outline-none transition-all font-medium"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Grid de Productos */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {products.map((product) => {
            const isOutOfStock = product.currentStock <= 0;
            const isInactive = !product.isActive;
            const canSell = !isOutOfStock && !isInactive;

            return (
              <button
                key={product.id}
                disabled={!canSell}
                onClick={() => onAddToCart(product)}
                className={`group relative flex flex-col p-5 rounded-[32px] transition-all text-left border-2 h-full min-h-[200px] ${canSell
                    ? 'bg-white border-transparent hover:border-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1'
                    : 'bg-slate-50 border-slate-100 opacity-80 cursor-not-allowed'
                  }`}
              >
                {/* Status Badges & Stock */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Stock</span>
                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black shadow-sm ${isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700'
                      }`}>
                      {product.currentStock}
                    </span>
                  </div>

                  {isInactive && (
                    <span className="px-2 py-1 rounded-lg bg-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-tighter">
                      Inactivo
                    </span>
                  )}
                </div>

                {/* Icon/Image Placeholder */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${canSell ? 'bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                  <Package size={24} />
                </div>

                <div className="flex-1 pr-12"> {/* Padding right para que el texto no choque con el stock */}
                  <h3 className="font-bold text-slate-900 leading-snug mb-1 group-hover:text-slate-900 line-clamp-2 h-10 pr-2">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                    {product.categoryName || 'Sin Categoría'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Precio Venta</span>
                    <span className="text-xl font-black text-slate-900">
                      ${product.salePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <Plus size={16} />
                  </div>
                </div>

                {!canSell && (
                  <div className="absolute inset-0 bg-white/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
                      <Info size={14} /> No disponible
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

