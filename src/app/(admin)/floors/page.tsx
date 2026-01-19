'use client';

import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { Button } from '@/presentation/components/ui/Button';
import { Card, CardContent } from '@/presentation/components/ui/Card';
import { DataTable, ColumnDef } from '@/presentation/components/ui/DataTable';
import { useFloors } from '@/presentation/hooks/useFloors';
import { Plus, RefreshCw, Trash2, Edit, X } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/presentation/components/ui/ConfirmModal';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloorsPage() {
  const { floors, loading, fetchFloors, deleteFloor, createFloor, updateFloor } = useFloors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [formData, setFormData] = useState({ number: '', name: '', description: '' });

  const columns: ColumnDef<any>[] = [
    { header: 'Nivel', key: 'number', render: (f) => <span className="font-bold text-slate-900">Piso {f.number}</span> },
    { header: 'Nombre Identificador', key: 'name' },
    { header: 'Descripción', key: 'description', render: (f) => f.description || '-' },
    { 
      header: 'Estado', 
      key: 'isActive', 
      render: (f) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${f.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
          {f.isActive ? 'Operativo' : 'Inactivo'}
        </span>
      ) 
    },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (f) => (
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="secondary" 
            className="h-8 w-8 p-0 rounded-lg"
            onClick={() => {
              setEditData(f);
              setFormData({ number: f.number.toString(), name: f.name, description: f.description || '' });
            }}
          >
            <Edit size={14} />
          </Button>
          <Button 
            variant="secondary" 
            className="h-8 w-8 p-0 rounded-lg text-red-400 hover:text-red-600"
            onClick={() => setDeleteModal({ open: true, id: f.id })}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )
    }
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editData) {
        await updateFloor(editData.id, { ...formData, number: Number(formData.number), isActive: editData.isActive });
        toast.success('Piso actualizado');
      } else {
        await createFloor({ ...formData, number: Number(formData.number) });
        toast.success('Piso registrado');
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
    setFormData({ number: '', name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestión de Pisos" 
        subtitle="Organice los niveles operativos de su establecimiento."
        actions={
          <>
            <Button variant="outline" onClick={fetchFloors} className="h-12 rounded-xl">
              <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="h-12 rounded-xl gap-2">
              <Plus size={18} /> Nuevo Piso
            </Button>
          </>
        }
      />

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <DataTable 
            data={floors} 
            columns={columns} 
            isLoading={loading}
            emptyMessage="No hay pisos registrados"
            renderMobileCard={(f) => (
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900">Piso {f.number} - {f.name}</h4>
                  <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase ${f.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100'}`}>
                    {f.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 h-10 rounded-xl" 
                    variant="secondary"
                    onClick={() => {
                      setEditData(f);
                      setFormData({ number: f.number.toString(), name: f.name, description: f.description || '' });
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit size={14} className="mr-2" /> Editar
                  </Button>
                  <Button 
                    className="w-10 h-10 rounded-xl text-red-400" 
                    variant="secondary"
                    onClick={() => setDeleteModal({ open: true, id: f.id })}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <ConfirmModal 
        isOpen={deleteModal.open}
        title="¿Eliminar piso?"
        description="Esta acción solo se completará si el piso no tiene habitaciones asociadas."
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={async () => {
          try {
            await deleteFloor(deleteModal.id!);
            toast.success('Piso eliminado');
            setDeleteModal({ open: false, id: null });
          } catch (err: any) {
            toast.error(err.message);
          }
        }}
      />

      {/* Modal de Creación/Edición */}
      <AnimatePresence>
        {(isModalOpen || editData) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Card className="rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <button onClick={closeModal} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
                <CardContent className="p-10 space-y-6">
                  <h3 className="text-xl font-bold text-slate-900">{editData ? 'Editar Piso' : 'Configurar Nuevo Piso'}</h3>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Número de Piso</label>
                      <input 
                        type="number" 
                        className="w-full h-12 rounded-xl bg-slate-50 border-none px-4 font-medium focus:ring-2 focus:ring-slate-900 transition-all"
                        value={formData.number}
                        onChange={e => setFormData({...formData, number: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nombre Identificador</label>
                      <input 
                        className="w-full h-12 rounded-xl bg-slate-50 border-none px-4 font-medium focus:ring-2 focus:ring-slate-900 transition-all"
                        placeholder="Ej. Piso Ejecutivo"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Descripción</label>
                      <textarea 
                        className="w-full h-24 rounded-xl bg-slate-50 border-none p-4 font-medium focus:ring-2 focus:ring-slate-900 transition-all resize-none"
                        placeholder="Detalles adicionales..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="secondary" onClick={closeModal} className="flex-1 h-12 rounded-xl">Cancelar</Button>
                      <Button type="submit" className="flex-[2] h-12 rounded-xl">{editData ? 'Guardar Cambios' : 'Crear Piso'}</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
