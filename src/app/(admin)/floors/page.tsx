'use client';

import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { Button } from '@/presentation/components/ui/Button';
import { Card, CardContent } from '@/presentation/components/ui/Card';
import { DataTable, ColumnDef } from '@/presentation/components/ui/DataTable';
import { useFloors } from '@/presentation/hooks/useFloors';
import { Plus, RefreshCw, Trash2, Edit, Layers, Hash } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/presentation/components/ui/ConfirmModal';
import { FormDrawer, FormField } from '@/presentation/components/ui/FormDrawer';
import { toast } from 'sonner';
import { Floor } from '@/domain/entities/Floor';

export default function FloorsPage() {
  const { floors, loading, fetchFloors, deleteFloor, createFloor, updateFloor } = useFloors();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<Floor | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const fields: FormField[] = [
    { key: 'number', label: 'Número de Piso', type: 'number', icon: <Hash size={18} />, required: true },
    { key: 'name', label: 'Nombre Identificador', type: 'text', icon: <Layers size={18} />, required: true },
    { key: 'description', label: 'Descripción', type: 'textarea', colSpan: 2 }
  ];

  const columns: ColumnDef<Floor>[] = [
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
      key: 'id',
      align: 'right',
      render: (f) => (
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            className="h-8 w-8 p-0 rounded-lg"
            onClick={() => {
              setEditData(f);
              setIsDrawerOpen(true);
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

  const handleSave = async (data: Record<string, any>) => {
    try {
      if (editData) {
        await updateFloor(editData.id, { ...data, number: Number(data.number) });
        toast.success('Piso actualizado');
      } else {
        await createFloor({ ...data, number: Number(data.number) } as any);
        toast.success('Piso registrado');
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
        title="Gestión de Pisos"
        subtitle="Organice los niveles operativos de su establecimiento."
        actions={
          <>
            <Button variant="outline" onClick={fetchFloors} className="h-12 rounded-xl">
              <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
            </Button>
            <Button onClick={() => { setEditData(null); setIsDrawerOpen(true); }} className="h-12 rounded-xl gap-2">
              <Plus size={18} /> Nuevo Piso
            </Button>
          </>
        }
      />

      <Card className="border-none shadow-sm overflow-hidden rounded-[2rem]">
        <CardContent className="p-0">
          <DataTable
            data={floors}
            columns={columns}
            isLoading={loading}
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
                    onClick={() => { setEditData(f); setIsDrawerOpen(true); }}
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
        title={editData ? 'Editar Piso' : 'Nuevo Piso'}
        description={editData ? 'Modifique los detalles del nivel.' : 'Configure un nuevo nivel operativo.'}
        fields={fields}
        initialData={editData ?? undefined}
        onSubmit={handleSave}
      />

      <ConfirmModal
        isOpen={deleteModal.open}
        title="¿Eliminar piso?"
        description="Esta acción solo se completará si el piso no tiene habitaciones asociadas."
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={async () => {
          try {
            if (deleteModal.id) {
              await deleteFloor(deleteModal.id);
              toast.success('Piso eliminado');
              setDeleteModal({ open: false, id: null });
            }
          } catch (err: any) {
            toast.error(err.message);
          }
        }}
      />
    </div>
  );
}
