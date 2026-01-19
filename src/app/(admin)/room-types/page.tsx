'use client';

import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { Button } from '@/presentation/components/ui/Button';
import { Card, CardContent } from '@/presentation/components/ui/Card';
import { DataTable, ColumnDef } from '@/presentation/components/ui/DataTable';
import { useRoomTypes } from '@/presentation/hooks/useRoomTypes';
import { Plus, RefreshCw, Trash2, Edit, Users, DollarSign, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmModal } from '@/presentation/components/ui/ConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoomTypesPage() {
  const { roomTypes, loading, fetchRoomTypes, createRoomType, updateRoomType, deleteRoomType } = useRoomTypes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  
  const [formData, setFormData] = useState({
    name: '', description: '', basePrice: '', capacity: '2', extraPersonPrice: '0'
  });

  const columns: ColumnDef<any>[] = [
    { header: 'Categoría', key: 'name', render: (t) => <span className="font-bold text-slate-900">{t.name}</span> },
    { 
      header: 'Tarifa Base', 
      key: 'basePrice', 
      render: (t) => (
        <div className="flex items-center gap-1 text-slate-900 font-medium">
          <DollarSign size={14} className="text-slate-400" />
          {t.basePrice.toLocaleString()}
        </div>
      ) 
    },
    { 
      header: 'Capacidad', 
      key: 'capacity', 
      render: (t) => (
        <div className="flex items-center gap-2 text-slate-500">
          <Users size={14} />
          {t.capacity} {t.capacity === 1 ? 'Persona' : 'Personas'}
        </div>
      ) 
    },
    { header: 'Persona Extra', key: 'extraPersonPrice', render: (t) => t.extraPersonPrice > 0 ? `$${t.extraPersonPrice.toLocaleString()}` : 'N/A' },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (t) => (
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="secondary" 
            className="h-8 w-8 p-0 rounded-lg"
            onClick={() => {
              setEditData(t);
              setFormData({
                name: t.name,
                description: t.description || '',
                basePrice: t.basePrice.toString(),
                capacity: t.capacity.toString(),
                extraPersonPrice: t.extraPersonPrice.toString()
              });
              setIsModalOpen(true);
            }}
          >
            <Edit size={14} />
          </Button>
          <Button 
            variant="secondary" 
            className="h-8 w-8 p-0 rounded-lg text-red-400 hover:text-red-600"
            onClick={() => setDeleteModal({ open: true, id: t.id })}
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
      const data = {
        ...formData,
        basePrice: Number(formData.basePrice),
        capacity: Number(formData.capacity),
        extraPersonPrice: Number(formData.extraPersonPrice)
      };

      if (editData) {
        await updateRoomType(editData.id, { ...data, isActive: editData.isActive });
        toast.success('Categoría actualizada');
      } else {
        await createRoomType(data);
        toast.success('Categoría creada');
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
    setFormData({ name: '', description: '', basePrice: '', capacity: '2', extraPersonPrice: '0' });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tipos de Habitación" 
        subtitle="Defina las categorías y tarifas base para su inventario."
        actions={
          <>
            <Button variant="outline" onClick={fetchRoomTypes} className="h-12 rounded-xl">
              <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="h-12 rounded-xl gap-2">
              <Plus size={18} /> Nueva Categoría
            </Button>
          </>
        }
      />

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <DataTable 
            data={roomTypes} 
            columns={columns} 
            isLoading={loading}
            emptyMessage="No hay tipos de habitación registrados"
            renderMobileCard={(t) => (
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-400">{t.capacity} Personas Max.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">${t.basePrice.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Base</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 h-10 rounded-xl" 
                    variant="secondary"
                    onClick={() => {
                      setEditData(t);
                      setFormData({
                        name: t.name,
                        description: t.description || '',
                        basePrice: t.basePrice.toString(),
                        capacity: t.capacity.toString(),
                        extraPersonPrice: t.extraPersonPrice.toString()
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit size={14} className="mr-2" /> Editar
                  </Button>
                  <Button 
                    className="w-10 h-10 rounded-xl text-red-400" 
                    variant="secondary"
                    onClick={() => setDeleteModal({ open: true, id: t.id })}
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
        title="¿Eliminar categoría?"
        description="Esta acción eliminará el tipo de habitación. Asegúrese que no haya habitaciones usándolo."
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={async () => {
          try {
            await deleteRoomType(deleteModal.id!);
            toast.success('Categoría eliminada');
            setDeleteModal({ open: false, id: null });
          } catch (err: any) {
            toast.error(err.message);
          }
        }}
      />

      {/* Modal de Creación/Edición */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg"
            >
              <Card className="rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <button onClick={closeModal} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
                <CardContent className="p-10 space-y-8">
                  <h3 className="text-xl font-bold text-slate-900">{editData ? 'Editar Categoría' : 'Nueva Categoría de Habitación'}</h3>
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nombre</label>
                        <input 
                          className="w-full h-12 rounded-xl bg-slate-50 px-4 font-medium border-none focus:ring-2 focus:ring-slate-900 transition-all"
                          placeholder="Ej. Suite Nupcial"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Capacidad Base</label>
                        <input 
                          type="number"
                          className="w-full h-12 rounded-xl bg-slate-50 px-4 font-medium border-none focus:ring-2 focus:ring-slate-900 transition-all"
                          value={formData.capacity}
                          onChange={e => setFormData({...formData, capacity: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Tarifa Base ($)</label>
                        <input 
                          type="number"
                          className="w-full h-12 rounded-xl bg-slate-50 px-4 font-medium border-none focus:ring-2 focus:ring-slate-900 transition-all"
                          value={formData.basePrice}
                          onChange={e => setFormData({...formData, basePrice: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Persona Extra ($)</label>
                        <input 
                          type="number"
                          className="w-full h-12 rounded-xl bg-slate-50 px-4 font-medium border-none focus:ring-2 focus:ring-slate-900 transition-all"
                          value={formData.extraPersonPrice}
                          onChange={e => setFormData({...formData, extraPersonPrice: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={closeModal} className="flex-1 h-12 rounded-xl">Cancelar</Button>
                      <Button type="submit" className="flex-[2] h-12 rounded-xl">{editData ? 'Guardar Cambios' : 'Guardar Categoría'}</Button>
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
