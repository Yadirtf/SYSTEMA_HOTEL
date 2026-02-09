'use client';

import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { Button } from '@/presentation/components/ui/Button';
import { Card, CardContent } from '@/presentation/components/ui/Card';
import { DataTable, ColumnDef } from '@/presentation/components/ui/DataTable';
import { useRoomTypes } from '@/presentation/hooks/useRoomTypes';
import { Plus, RefreshCw, Trash2, Edit, Users, DollarSign, Tag, Info } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmModal } from '@/presentation/components/ui/ConfirmModal';
import { FormDrawer, FormField } from '@/presentation/components/ui/FormDrawer';

import { RoomType } from '@/domain/entities/RoomType';

export default function RoomTypesPage() {
  const { roomTypes, loading, fetchRoomTypes, createRoomType, updateRoomType, deleteRoomType } = useRoomTypes();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<RoomType | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const fields: FormField[] = [
    { key: 'name', label: 'Nombre de Categoría', type: 'text', icon: <Tag size={18} />, required: true },
    { key: 'capacity', label: 'Capacidad Base', type: 'number', icon: <Users size={18} />, required: true },
    { key: 'basePrice', label: 'Tarifa Base ($)', type: 'number', icon: <DollarSign size={18} />, required: true },
    { key: 'extraPersonPrice', label: 'Persona Extra ($)', type: 'number', icon: <DollarSign size={18} />, required: true },
    { key: 'description', label: 'Descripción de la Categoría', type: 'textarea', colSpan: 2 }
  ];

  const columns: ColumnDef<RoomType>[] = [
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
    {
      header: 'Acciones',
      key: 'id', // Changed from 'actions' which doesn't exist on RoomType, using id or just empty string if handled by render
      align: 'right',
      render: (t) => (
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            className="h-8 w-8 p-0 rounded-lg"
            onClick={() => {
              setEditData(t);
              setIsDrawerOpen(true);
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

  const handleSave = async (data: Record<string, any>) => {
    try {
      const formattedData = {
        name: data.name,
        description: data.description,
        basePrice: Number(data.basePrice),
        capacity: Number(data.capacity),
        extraPersonPrice: Number(data.extraPersonPrice)
      };

      if (editData) {
        await updateRoomType(editData.id, formattedData);
        toast.success('Categoría actualizada');
      } else {
        await createRoomType(formattedData as any); // createRoomType might expect Omit<RoomType, 'id'>
        toast.success('Categoría creada');
      }
      setIsDrawerOpen(false);
      setEditData(null);
    } catch (err: any) {
      toast.error(err.message);
    }
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
            <Button onClick={() => { setEditData(null); setIsDrawerOpen(true); }} className="h-12 rounded-xl gap-2">
              <Plus size={18} /> Nueva Categoría
            </Button>
          </>
        }
      />

      <Card className="border-none shadow-sm overflow-hidden rounded-[2rem]">
        <CardContent className="p-0">
          <DataTable
            data={roomTypes}
            columns={columns}
            isLoading={loading}
            renderMobileCard={(t) => (
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-400">{t.capacity} Personas Max.</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">${t.basePrice.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 h-10 rounded-xl"
                    variant="secondary"
                    onClick={() => { setEditData(t); setIsDrawerOpen(true); }}
                  >
                    <Edit size={14} className="mr-2" /> Editar
                  </Button>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setEditData(null); }}
        title={editData ? 'Editar Categoría' : 'Nueva Categoría'}
        description={editData ? 'Actualice tarifas y capacidades.' : 'Configure un nuevo tipo de habitación.'}
        fields={fields}
        initialData={editData ?? undefined}
        onSubmit={handleSave}
      />

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
    </div>
  );
}
