'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Input } from './Input';
import { cn } from '@/shared/utils';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'search' | 'select' | 'text';
  placeholder?: string;
  options?: FilterOption[];
  colSpan?: number; // Opcional: para forzar ancho en desktop
}

interface FilterBarProps {
  isOpen: boolean;
  config: FilterField[];
  filters: any;
  onFilterChange: (newFilters: any) => void;
  onClear: () => void;
}

export const FilterBar = ({ isOpen, config, filters, onFilterChange, onClear }: FilterBarProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
          animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-6 sm:p-8">
            {/* Contenedor flexible para adaptarse al número de filtros */}
            <div className="flex flex-wrap items-start gap-y-8 gap-x-12">
              
              {config.map((field) => (
                <div 
                  key={field.key} 
                  className={cn(
                    "space-y-3 min-w-[240px]",
                    // Si es un select con muchas opciones, le damos más ancho base en escritorio
                    field.type === 'select' && (field.options?.length || 0) > 3 ? "flex-[2]" : "flex-1"
                  )}
                >
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {field.label}
                    </label>
                  </div>

                  {/* Renderizado Dinámico */}
                  {field.type === 'search' && (
                    <Input
                      placeholder={field.placeholder || "Buscar..."}
                      icon={<Search size={16} />}
                      value={filters[field.key] || ''}
                      onChange={(e) => onFilterChange({ ...filters, [field.key]: e.target.value })}
                      className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-2xl"
                    />
                  )}

                  {field.type === 'text' && (
                    <Input
                      placeholder={field.placeholder || "Escriba aquí..."}
                      value={filters[field.key] || ''}
                      onChange={(e) => onFilterChange({ ...filters, [field.key]: e.target.value })}
                      className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-2xl"
                    />
                  )}

                  {field.type === 'select' && field.options && (
                    <div className={cn(
                      "p-1 bg-slate-100/80 rounded-2xl flex flex-wrap gap-1",
                    )}>
                      {field.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => onFilterChange({ 
                            ...filters, 
                            [field.key]: filters[field.key] === option.value ? '' : option.value 
                          })}
                          className={cn(
                            "py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all min-w-fit flex-1",
                            filters[field.key] === option.value 
                              ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                              : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Botón Maestro de Limpiar */}
              <div className="w-full flex justify-end pt-4 border-t border-slate-50 mt-2">
                <button 
                  onClick={onClear}
                  className="flex items-center gap-2 text-[10px] font-black text-rose-500 hover:text-rose-700 transition-all uppercase tracking-[0.2em] hover:scale-105"
                >
                  <X size={14} className="stroke-[3px]" /> Limpiar todos los filtros
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
