'use client';

import { 
  Trash2, 
  CheckCircle, 
  XCircle,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils';

interface UserTableProps {
  users: any[];
  onToggleStatus: (user: any) => void;
  onDelete: (user: any) => void;
  isLoading: boolean;
}

export const UserTable = ({ users, onToggleStatus, onDelete, isLoading }: UserTableProps) => {
  if (isLoading) return (
    <div className="h-64 flex flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      <p className="text-sm font-medium text-slate-400 animate-pulse uppercase tracking-[0.2em]">Sincronizando</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Colaborador</th>
            <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Rol</th>
            <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Estado</th>
            <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Gestión</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map((user) => (
            <motion.tr 
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-slate-50/50 transition-colors group"
            >
              <td className="py-5 px-8">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm border border-white shadow-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 tracking-tight">{user.firstName} {user.lastName}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-5 px-8">
                <span className={cn(
                  "px-3 py-1.5 rounded-xl text-[9px] font-extrabold tracking-[0.1em] uppercase border shadow-sm",
                  user.role === 'ADMIN' 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-white text-slate-600 border-slate-200"
                )}>
                  {user.role}
                </span>
              </td>
              <td className="py-5 px-8">
                <div className="flex items-center gap-2">
                  {user.isActive ? (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Activo</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Inactivo</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="py-5 px-8">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    className="h-9 w-9 p-0 rounded-xl hover:bg-white hover:shadow-md border-none"
                    onClick={() => onToggleStatus(user)}
                  >
                    {user.isActive ? <XCircle className="h-4 w-4 text-slate-400" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 hover:text-red-600 border-none hover:shadow-md transition-all"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
