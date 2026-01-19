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
  options?: FilterOption[]; // Solo para tipo 'select'
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
          <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {config.map((field) => (
                <div key={field.key} className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      {field.label}
                    </label>
                    {/* Botón de limpiar individual opcional podría ir aquí */}
                  </div>

                  {/* Renderizado Dinámico según Tipo */}
                  {field.type === 'search' && (
                    <Input
                      placeholder={field.placeholder || "Buscar..."}
                      icon={<Search size={16} />}
                      value={filters[field.key] || ''}
                      onChange={(e) => onFilterChange({ ...filters, [field.key]: e.target.value })}
                      className="h-11 bg-slate-50/50 border-transparent focus:bg-white"
                    />
                  )}

                  {field.type === 'text' && (
                    <Input
                      placeholder={field.placeholder || "Escriba aquí..."}
                      value={filters[field.key] || ''}
                      onChange={(e) => onFilterChange({ ...filters, [field.key]: e.target.value })}
                      className="h-11 bg-slate-50/50 border-transparent focus:bg-white"
                    />
                  )}

                  {field.type === 'select' && field.options && (
                    <div className="flex p-1 bg-slate-100/80 rounded-xl gap-1">
                      {field.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => onFilterChange({ 
                            ...filters, 
                            [field.key]: filters[field.key] === option.value ? '' : option.value 
                          })}
                          className={cn(
                            "flex-1 py-2 rounded-lg text-[10px] font-bold transition-all",
                            filters[field.key] === option.value 
                              ? "bg-white text-slate-900 shadow-sm" 
                              : "text-slate-500 hover:text-slate-700"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Botón Maestro de Limpiar (siempre al final o integrado) */}
              <div className="lg:col-span-4 flex justify-end pt-2">
                <button 
                  onClick={onClear}
                  className="flex items-center gap-2 text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                >
                  <X size={14} /> Limpiar todos los filtros
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

