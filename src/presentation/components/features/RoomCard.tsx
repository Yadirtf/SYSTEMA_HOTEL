'use client';

import { Room, RoomStatus } from '@/domain/entities/Room';
import { RoomType } from '@/domain/entities/RoomType';
import { Floor } from '@/domain/entities/Floor';
import { cn } from '@/shared/utils';
import { motion } from 'framer-motion';
import { Home, Users, Settings, Edit3, MoreHorizontal } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  roomType?: RoomType;
  floor?: Floor;
  onEdit?: (room: Room) => void;
  onStatusChange?: (room: Room, status: RoomStatus) => void;
}

const statusConfig = {
  [RoomStatus.AVAILABLE]: { label: 'Disponible', color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  [RoomStatus.OCCUPIED]: { label: 'Ocupada', color: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
  [RoomStatus.RESERVED]: { label: 'Reservada', color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  [RoomStatus.CLEANING]: { label: 'Limpieza', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  [RoomStatus.MAINTENANCE]: { label: 'Mantenimiento', color: 'bg-slate-600', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

export const RoomCard = ({ room, roomType, floor, onEdit }: RoomCardProps) => {
  const config = statusConfig[room.status as RoomStatus] || statusConfig[RoomStatus.AVAILABLE];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "relative group bg-white rounded-[2rem] border p-6 transition-all duration-300 shadow-sm hover:shadow-xl",
        config.border
      )}
    >
      {/* Header: Diseño original estable */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-xl shadow-inner", config.bg)}>
            <Home size={20} className={config.text} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight">
              #{room.code}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Piso {floor?.number || 'S/N'}
            </p>
          </div>
        </div>

        <div className={cn(
          "px-3 py-1 rounded-full flex items-center gap-1.5 border shadow-sm",
          config.bg, config.border
        )}>
          <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", config.color)} />
          <span className={cn("text-[10px] font-black uppercase tracking-wider", config.text)}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Info: Tipo y Precio */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-slate-500">
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-slate-300" />
            <span className="text-xs font-bold text-slate-600">{roomType?.name || 'Habitación'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} className="text-slate-300" />
            <span className="text-xs font-bold text-slate-600">{roomType?.capacity || '0'}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarifa Diaria</p>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xs font-bold text-slate-400">$</span>
            <span className="text-lg font-black text-slate-900">
              {(room.basePrice || roomType?.basePrice || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit?.(room)}
          className="flex-1 h-10 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
        >
          <Edit3 size={14} /> Gestionar
        </button>
        <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-100">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </motion.div>
  );
};
