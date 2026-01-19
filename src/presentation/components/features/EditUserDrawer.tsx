'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShieldCheck, Mail, Lock, Phone, FileText, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useState, useEffect } from 'react';

interface EditUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export const EditUserDrawer = ({ isOpen, onClose, user, onSave, isLoading }: EditUserDrawerProps) => {
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        document: user.document,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive
      });
    }
  }, [user]);

  if (!formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[80]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[90] flex flex-col"
          >
            <div className="p-8 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2.5 rounded-xl">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Editar Perfil</h3>
                  <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
              <div className="p-8 space-y-10">
                {/* Sección Identidad */}
                <section className="space-y-6">
                  <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Información Personal</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Nombre"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      icon={<User size={16} />}
                      required
                    />
                    <Input
                      label="Apellido"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      icon={<User size={16} />}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Documento"
                      value={formData.document}
                      onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                      icon={<FileText size={16} />}
                      required
                    />
                    <Input
                      label="Teléfono"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      icon={<Phone size={16} />}
                      required
                    />
                  </div>
                </section>

                {/* Sección Permisos */}
                <section className="space-y-6">
                  <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Control de Acceso</h4>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Rol en el Sistema</label>
                    <div className="flex gap-2">
                      {['ADMIN', 'RECEPCIONISTA'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: r })}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-bold transition-all border",
                            formData.role === r 
                              ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Estado de la cuenta</p>
                      <p className="text-xs text-slate-500">Permitir el acceso al sistema</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                      className={cn(
                        "relative w-12 h-6 rounded-full transition-colors duration-300",
                        formData.isActive ? "bg-slate-900" : "bg-slate-300"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                        formData.isActive ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 mt-auto">
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl text-lg group" 
                  isLoading={isLoading}
                >
                  Guardar Cambios <Save className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

import { cn } from '@/shared/utils';

