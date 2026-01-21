'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils';

export type FormField = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[]; // Para selects
  icon?: React.ReactNode;
  colSpan?: 1 | 2; // Para grids
  onlyNumbers?: boolean; // Nueva propiedad para restringir a solo números
};

interface FormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  fields: FormField[];
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export function FormDrawer({
  isOpen,
  onClose,
  title,
  description,
  fields,
  initialData,
  onSubmit,
  loading = false,
}: FormDrawerProps) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Inicializar con valores vacíos según los campos
      const initial: any = {};
      fields.forEach(f => initial[f.key] = '');
      setFormData(initial);
    }
  }, [initialData, fields, isOpen]);

  const handleChange = (key: string, value: any, field: FormField) => {
    let finalValue = value;

    // Validación limpia: si el campo pide solo números, removemos todo lo que no sea dígito
    if (field.onlyNumbers && typeof value === 'string') {
      finalValue = value.replace(/\D/g, '');
    }

    setFormData((prev: any) => ({ ...prev, [key]: finalValue }));
    
    if (errors[key]) {
      const newErrors = { ...errors };
      delete newErrors[key];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h3>
                  {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                {fields.map((field) => (
                  <div
                    key={field.key}
                    className={cn(
                      "space-y-2",
                      field.colSpan === 2 ? "col-span-2" : "col-span-2 sm:col-span-1"
                    )}
                  >
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <div className="relative group">
                        <select
                          value={formData[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value, field)}
                          required={field.required}
                          className="w-full h-14 rounded-2xl bg-slate-50 border-2 border-transparent px-4 font-medium text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none appearance-none"
                        >
                          <option value="">Seleccionar...</option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <AlertCircle size={16} className="opacity-0 group-focus-within:opacity-0" />
                        </div>
                      </div>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value, field)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full h-32 rounded-2xl bg-slate-50 border-2 border-transparent p-4 font-medium text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none resize-none"
                      />
                    ) : (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value, field)}
                        required={field.required}
                        icon={field.icon}
                        className="h-14 border-2 border-transparent focus:border-slate-900 bg-slate-50"
                      />
                    )}
                  </div>
                ))}
              </div>
            </form>

            {/* Footer */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/50">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 h-14 rounded-2xl font-bold"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-[2] h-14 rounded-2xl font-bold gap-2 shadow-xl shadow-slate-200"
                  onClick={handleSubmit}
                  isLoading={loading}
                >
                  <Save size={18} /> Guardar Cambios
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
