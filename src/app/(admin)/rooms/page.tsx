'use client';

import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { Button } from '@/presentation/components/ui/Button';
import { useRooms } from '@/presentation/hooks/useRooms';
import { useFloors } from '@/presentation/hooks/useFloors';
import { useRoomTypes } from '@/presentation/hooks/useRoomTypes';
import { RoomCard } from '@/presentation/components/features/RoomCard';
import { Plus, Filter, Layers, Home } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/shared/utils';
import { FilterBar, FilterField } from '@/presentation/components/ui/FilterBar';
import { toast } from 'sonner';
import { FormDrawer, FormField } from '@/presentation/components/ui/FormDrawer';
import { Room } from '@/domain/entities/Room';

export default function RoomsPage() {
  const { floors } = useFloors();
  const { roomTypes } = useRoomTypes();
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const { rooms, loading, fetchRooms, createRoom, updateRoomStatus } = useRooms(selectedFloorId || undefined);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<Room | null>(null);
  const [filters, setFilters] = useState({ status: '', typeId: '' });

  // Configuración de Filtros
  const filterConfig: FilterField[] = [
    {
      key: 'status',
      label: 'Estado operativo',
      type: 'select',
      options: [
        { label: 'DISPONIBLE', value: 'AVAILABLE' },
        { label: 'OCUPADA', value: 'OCCUPIED' },
        { label: 'RESERVADA', value: 'RESERVED' },
        { label: 'LIMPIEZA', value: 'CLEANING' },
        { label: 'MANTENIMIENTO', value: 'MAINTENANCE' }
      ]
    },
    {
      key: 'typeId',
      label: 'Tipo de Habitación',
      type: 'select',
      options: roomTypes.map(t => ({ label: t.name, value: t.id }))
    }
  ];

  // Configuración de Formulario (Dynamic FormDrawer)
  const roomFormFields: FormField[] = [
    {
      key: 'code',
      label: 'Código / Número',
      type: 'text',
      placeholder: 'Ej. 101',
      icon: <Home size={18} />,
      required: true,
      colSpan: 2
    },
    {
      key: 'floorId',
      label: 'Piso / Nivel',
      type: 'select',
      required: true,
      options: floors.map(f => ({ label: `Piso ${f.number}`, value: f.id }))
    },
    {
      key: 'typeId',
      label: 'Categoría',
      type: 'select',
      required: true,
      options: roomTypes.map(t => ({ label: t.name, value: t.id }))
    },
    {
      key: 'status',
      label: 'Estado Actual',
      type: 'select',
      required: true,
      options: [
        { label: 'Disponible', value: 'AVAILABLE' },
        { label: 'Ocupada', value: 'OCCUPIED' },
        { label: 'Reservada', value: 'RESERVED' },
        { label: 'Limpieza', value: 'CLEANING' },
        { label: 'Mantenimiento', value: 'MAINTENANCE' }
      ]
    },
    {
      key: 'description',
      label: 'Descripción (Opcional)',
      type: 'textarea',
      placeholder: 'Ej. Vista al mar, cama king...',
      colSpan: 2
    }
  ];

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchStatus = !filters.status || r.status === filters.status;
      const matchType = !filters.typeId || r.typeId === filters.typeId;
      return matchStatus && matchType;
    });
  }, [rooms, filters]);

  const handleSave = async (data: Record<string, any>) => {
    try {
      if (editData) {
        // En esta fase solo actualizamos el estado si es necesario, 
        // pero el FormDrawer permite actualizar todo el objeto.
        // Implementaremos un updateRoom genérico si es necesario, por ahora usamos updateRoomStatus
        await updateRoomStatus(editData.id, data.status);
        toast.success('Habitación actualizada correctamente');
      } else {
        await createRoom(data as any);
        toast.success('Habitación creada correctamente');
      }
      setIsDrawerOpen(false);
      setEditData(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Inventario de Habitaciones"
        subtitle="Monitoreo en tiempo real y gestión operativa."
        actions={
          <>
            <Button variant="secondary" onClick={() => setIsFilterOpen(!isFilterOpen)} className="h-12 rounded-xl">
              <Filter size={18} className="mr-2" /> Filtros
            </Button>
            <Button onClick={() => { setEditData(null); setIsDrawerOpen(true); }} className="h-12 rounded-xl gap-2">
              <Plus size={18} /> Nueva Habitación
            </Button>
          </>
        }
      />

      {/* Selector de Pisos */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <button
          onClick={() => setSelectedFloorId(null)}
          className={cn(
            "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 border",
            !selectedFloorId
              ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200"
              : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
          )}
        >
          Todos los Pisos
        </button>
        {floors.map((floor) => (
          <button
            key={floor.id}
            onClick={() => setSelectedFloorId(floor.id)}
            className={cn(
              "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 border",
              selectedFloorId === floor.id
                ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200"
                : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
            )}
          >
            Piso {floor.number}
          </button>
        ))}
      </div>

      <FilterBar
        isOpen={isFilterOpen}
        config={filterConfig}
        filters={filters}
        onFilterChange={(val) => setFilters(val as any)}
        onClear={() => setFilters({ status: '', typeId: '' })}
      />

      {/* Grid de Habitaciones */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              roomType={roomTypes.find(t => t.id === room.typeId)}
              floor={floors.find(f => f.id === room.floorId)}
              onEdit={(r) => {
                setEditData(r);
                setIsDrawerOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[3rem]">
          <Layers size={48} className="mb-4 opacity-10" />
          <p className="text-sm font-bold uppercase tracking-[0.2em]">Sin resultados en este nivel</p>
        </div>
      )}

      {/* Drawer de Creación/Edición de Habitación (Nuevo Estándar) */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setEditData(null); }}
        title={editData ? 'Gestionar Habitación' : 'Nueva Habitación'}
        description={editData ? `Actualizando habitación #${editData.code}` : 'Configure una nueva unidad en el inventario.'}
        fields={roomFormFields}
        initialData={editData ?? undefined}
        onSubmit={handleSave}
      />
    </div>
  );
}
