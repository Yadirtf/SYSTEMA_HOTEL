'use client';

import { Card, CardContent } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { UserTable } from '@/presentation/components/features/UserTable';
import { useUsers } from '@/presentation/hooks/useUsers';
import { UserPlus, RefreshCw, X, Mail, Lock, User as UserIcon, Phone, FileText, SlidersHorizontal, Shield } from 'lucide-react';
import { useState, useMemo } from 'react';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { toast } from 'sonner';
import { ConfirmModal } from '@/presentation/components/ui/ConfirmModal';
import { FilterBar, FilterField } from '@/presentation/components/ui/FilterBar';
import { EditUserDrawer } from '@/presentation/components/features/EditUserDrawer';
import { FormDrawer, FormField } from '@/presentation/components/ui/FormDrawer';
import { cn } from '@/shared/utils';
import { UserWithDetails } from '@/presentation/types/UserWithDetails';

export default function UsersManagementPage() {
  const { users, loading, fetchUsers, deleteUser, toggleUserStatus, createUser } = useUsers();

  // 1. Configuración de Filtros Dinámicos
  const userFilterConfig: FilterField[] = [
    { key: 'search', label: 'Búsqueda General', type: 'search', placeholder: 'Nombre o email...' },
    {
      key: 'role',
      label: 'Rol de Acceso',
      type: 'select',
      options: [
        { label: 'ADMIN', value: 'ADMIN' },
        { label: 'RECEPCIONISTA', value: 'RECEPCIONISTA' },
        { label: 'LIMPIEZA', value: 'LIMPIEZA' }
      ]
    },
    {
      key: 'isActive',
      label: 'Estado de Cuenta',
      type: 'select',
      options: [
        { label: 'ACTIVOS', value: 'true' },
        { label: 'INACTIVOS', value: 'false' }
      ]
    },
    { key: 'document', label: 'Identificación', type: 'text', placeholder: 'DNI / Pasaporte...' },
  ];

  // Configuración de Formulario de Creación (Nuevo estándar)
  const createUserFields: FormField[] = [
    { key: 'firstName', label: 'Nombre', type: 'text', icon: <UserIcon size={18} />, required: true },
    { key: 'lastName', label: 'Apellido', type: 'text', icon: <UserIcon size={18} />, required: true },
    { key: 'email', label: 'Email', type: 'email', icon: <Mail size={18} />, required: true, colSpan: 2 },
    { key: 'password', label: 'Clave Temporal', type: 'password', icon: <Lock size={18} />, required: true },
    { key: 'phone', label: 'Teléfono', type: 'text', icon: <Phone size={18} />, required: true },
    { key: 'document', label: 'Identificación', type: 'text', icon: <FileText size={18} />, required: true },
    {
      key: 'role',
      label: 'Rol Asignado',
      type: 'select',
      required: true,
      options: [
        { label: 'ADMINISTRADOR', value: 'ADMIN' },
        { label: 'RECEPCIONISTA', value: 'RECEPCIONISTA' },
        { label: 'LIMPIEZA', value: 'LIMPIEZA' }
      ]
    }
  ];

  // Estados de UI
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editDrawer, setEditDrawer] = useState<{ open: boolean; user: UserWithDetails | null }>({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: UserWithDetails | null }>({ open: false, user: null });
  const [statusModal, setStatusModal] = useState<{ open: boolean; user: UserWithDetails | null }>({ open: false, user: null });

  // Estado de Filtros
  const [filters, setFilters] = useState({ search: '', role: '', isActive: '', document: '' });

  // Lógica de Filtrado
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = !filters.search ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchRole = !filters.role || user.role === filters.role;
      const matchStatus = !filters.isActive || String(user.isActive) === filters.isActive;
      const matchDoc = !filters.document || user.document.includes(filters.document);

      return matchSearch && matchRole && matchStatus && matchDoc;
    });
  }, [users, filters]);

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  // Handlers
  const handleCreateUser = async (data: any) => {
    try {
      await createUser(data);
      toast.success('Usuario creado con éxito');
      setIsCreateDrawerOpen(false);
    } catch (err: any) {
      toast.error('Error al crear usuario', { description: err.message });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.user) return;
    try {
      await deleteUser(deleteModal.user.id);
      toast.success('Usuario eliminado permanentemente');
      setDeleteModal({ open: false, user: null });
    } catch (err: any) {
      toast.error('Error', { description: err.message });
      setDeleteModal({ open: false, user: null });
    }
  };

  const confirmToggleStatus = async () => {
    if (!statusModal.user) return;
    try {
      await toggleUserStatus(statusModal.user.id, statusModal.user.isActive);
      toast.info('Estado actualizado correctamente');
      setStatusModal({ open: false, user: null });
    } catch (err: any) {
      toast.error('Error', { description: err.message });
      setStatusModal({ open: false, user: null });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Personal"
        subtitle="Administre los accesos y roles de su equipo operativo."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "rounded-xl h-12 gap-2 border-slate-200 transition-all",
                isFilterOpen && "bg-slate-900 text-white border-slate-900",
                hasActiveFilters && !isFilterOpen && "ring-2 ring-blue-500 ring-offset-2"
              )}
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filtros</span>
            </Button>
            <Button variant="outline" onClick={fetchUsers} className="rounded-xl h-12 px-3">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => setIsCreateDrawerOpen(true)} className="rounded-xl h-12 gap-2">
              <UserPlus className="h-5 w-5" /> <span className="hidden sm:inline">Registrar Nuevo</span>
            </Button>
          </>
        }
      />

      {/* BARRA DE FILTROS DINÁMICA */}
      <FilterBar
        isOpen={isFilterOpen}
        config={userFilterConfig}
        filters={filters}
        onFilterChange={(newFilters) => setFilters(newFilters as any)}
        onClear={() => setFilters({ search: '', role: '', isActive: '', document: '' })}
      />

      <Card className="border-none shadow-sm overflow-visible rounded-[2rem]">
        <CardContent className="p-0">
          <UserTable
            users={filteredUsers}
            isLoading={loading}
            onDelete={(user) => setDeleteModal({ open: true, user })}
            onToggleStatus={(user) => setStatusModal({ open: true, user })}
            onEdit={(user) => setEditDrawer({ open: true, user })}
          />
        </CardContent>
      </Card>

      {/* Edición (Ahora auto-gestionado) */}
      {editDrawer.open && editDrawer.user && (
        <EditUserDrawer
          isOpen={editDrawer.open}
          user={editDrawer.user}
          onClose={() => setEditDrawer({ open: false, user: null })}
        />
      )}

      {/* Creación (Usando el nuevo FormDrawer genérico) */}
      <FormDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        title="Nuevo Colaborador"
        description="Complete el perfil para otorgar acceso al sistema."
        fields={createUserFields}
        onSubmit={handleCreateUser}
      />

      <ConfirmModal
        isOpen={deleteModal.open}
        title="¿Eliminar colaborador?"
        description={`Esta acción eliminará permanentemente a ${deleteModal.user?.firstName}.`}
        confirmText="Eliminar permanentemente"
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={confirmDelete}
      />

      <ConfirmModal
        isOpen={statusModal.open}
        title={statusModal.user?.isActive ? 'Desactivar acceso' : 'Activar acceso'}
        description={`¿Desea cambiar el estado de acceso para ${statusModal.user?.firstName}?`}
        confirmText={statusModal.user?.isActive ? 'Desactivar' : 'Activar'}
        variant="warning"
        onClose={() => setStatusModal({ open: false, user: null })}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
