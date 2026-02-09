'use client';

import {
  Trash2,
  CheckCircle,
  XCircle,
  User as UserIcon,
  Mail,
  Activity
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { DataTable, ColumnDef } from '@/presentation/components/ui/DataTable';
import { cn } from '@/shared/utils';

import { UserWithDetails } from '@/presentation/types/UserWithDetails';
import { UserMobileCard } from './UserMobileCard';

interface UserTableProps {
  users: UserWithDetails[];
  onToggleStatus: (user: UserWithDetails) => void;
  onDelete: (user: UserWithDetails) => void;
  onEdit: (user: UserWithDetails) => void;
  isLoading: boolean;
}

export const UserTable = ({ users, onToggleStatus, onDelete, onEdit, isLoading }: UserTableProps) => {

  // 1. Definición de Columnas para Desktop
  const columns: ColumnDef<UserWithDetails>[] = [
    {
      header: 'Colaborador',
      key: 'name',
      render: (user) => (
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm border border-white shadow-sm shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 tracking-tight truncate">{user.firstName} {user.lastName}</p>
            <p className="text-[11px] text-slate-400 font-medium truncate">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Rol',
      key: 'role',
      render: (user) => (
        <span className={cn(
          "px-3 py-1.5 rounded-xl text-[9px] font-extrabold tracking-[0.1em] uppercase border shadow-sm",
          user.role === 'ADMIN'
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-white text-slate-600 border-slate-200"
        )}>
          {user.role}
        </span>
      )
    },
    {
      header: 'Estado',
      key: 'status',
      render: (user) => (
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
      )
    },
    {
      header: 'Gestión',
      key: 'actions',
      align: 'right',
      render: (user) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            className="h-9 w-9 p-0 rounded-xl hover:bg-white hover:shadow-md border-none"
            onClick={() => onEdit(user)}
          >
            <UserIcon size={16} className="text-slate-600" />
          </Button>
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
      )
    }
  ];

  // 2. Template para Vista Móvil
  const renderMobileCard = (user: UserWithDetails) => (
    <UserMobileCard
      user={user}
      onEdit={onEdit}
      onToggleStatus={onToggleStatus}
      onDelete={onDelete}
    />
  );

  return (
    <DataTable
      data={users}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No se encontraron colaboradores"
      renderMobileCard={renderMobileCard}
    />
  );
};
