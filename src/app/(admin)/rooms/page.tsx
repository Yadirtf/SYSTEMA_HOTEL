'use client';

import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { Button } from '@/presentation/components/ui/Button';
import { useRooms } from '@/presentation/hooks/useRooms';
import { useFloors } from '@/presentation/hooks/useFloors';
import { useRoomTypes } from '@/presentation/hooks/useRoomTypes';
import { RoomCard } from '@/presentation/components/features/RoomCard';
import { Plus, Filter, RefreshCw, Layers, X, Home, Settings, FileText } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/shared/utils';
import { FilterBar, FilterField } from '@/presentation/components/ui/FilterBar';
import { toast } from 'sonner';
import { Input } from '@/presentation/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoomsPage() {
  const { floors } = useFloors();
  const { roomTypes } = useRoomTypes();
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const { rooms, loading, fetchRooms, createRoom } = useRooms(selectedFloorId || undefined);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ status: '', typeId: '' });
  
  const [formData, setFormData] = useState({
    code: '', floorId: '', typeId: '', description: ''
  });

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

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchStatus = !filters.status || r.status === filters.status;
      const matchType = !filters.typeId || r.typeId === filters.typeId;
      return matchStatus && matchType;
    });
  }, [rooms, filters]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.floorId || !formData.typeId) {
        toast.error('Debe seleccionar un piso y un tipo');
        return;
      }
      await createRoom(formData);
      toast.success('Habitación creada correctamente');
      setIsModalOpen(false);
      setFormData({ code: '', floorId: '', typeId: '', description: '' });
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
            <Button onClick={() => setIsModalOpen(true)} className="h-12 rounded-xl gap-2">
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
        onFilterChange={setFilters}
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
            />
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[3rem]">
          <Layers size={48} className="mb-4 opacity-10" />
          <p className="text-sm font-bold uppercase tracking-[0.2em]">Sin resultados en este nivel</p>
        </div>
      )}

      {/* Modal de Creación de Habitación */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Nueva Habitación</h3>
                    <p className="text-slate-400 text-sm">Configure una nueva unidad en el inventario.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                  <Input 
                    label="Código / Número" 
                    placeholder="Ej. 101" 
                    icon={<Home size={18}/>} 
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value})} 
                    required 
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Piso / Nivel</label>
                      <div className="relative">
                        <select 
                          className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all outline-none"
                          value={formData.floorId}
                          onChange={e => setFormData({...formData, floorId: e.target.value})}
                          required
                        >
                          <option value="">Seleccionar...</option>
                          {floors.map(f => (
                            <option key={f.id} value={f.id}>Piso {f.number}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Categoría</label>
                      <div className="relative">
                        <select 
                          className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all outline-none"
                          value={formData.typeId}
                          onChange={e => setFormData({...formData, typeId: e.target.value})}
                          required
                        >
                          <option value="">Seleccionar...</option>
                          {roomTypes.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <Input 
                    label="Descripción (Opcional)" 
                    placeholder="Ej. Vista al mar, cama king..." 
                    icon={<FileText size={18}/>} 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                  />

                  <Button type="submit" className="w-full h-14 rounded-2xl">
                    Registrar Habitación
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
