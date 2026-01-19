'use client';

import { Card, CardContent } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { UserTable } from '@/presentation/components/features/UserTable';
import { useUsers } from '@/presentation/hooks/useUsers';
import { UserPlus, RefreshCw, X, Mail, Lock, User as UserIcon, Phone, FileText, SlidersHorizontal } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/presentation/components/ui/Input';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { toast } from 'sonner';
import { ConfirmModal } from '@/presentation/components/ui/ConfirmModal';
import { FilterBar, FilterField } from '@/presentation/components/ui/FilterBar';
import { EditUserDrawer } from '@/presentation/components/features/EditUserDrawer';
import { cn } from '@/shared/utils';

export default function UsersManagementPage() {
  const { users, loading, fetchUsers, deleteUser, toggleUserStatus, createUser, updateUser } = useUsers();
  
  // 1. Configuración de Filtros Dinámicos
  const userFilterConfig: FilterField[] = [
    { key: 'search', label: 'Búsqueda General', type: 'search', placeholder: 'Nombre o email...' },
    { 
      key: 'role', 
      label: 'Rol de Acceso', 
      type: 'select', 
      options: [
        { label: 'ADMIN', value: 'ADMIN' },
        { label: 'RECEPCIONISTA', value: 'RECEPCIONISTA' }
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

  // Estados de UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editDrawer, setEditDrawer] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  const [statusModal, setStatusModal] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  
  // Estado de Filtros
  const [filters, setFilters] = useState({ search: '', role: '', isActive: '', document: '' });

  // Formulario de Creación
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    document: '', phone: '', role: 'RECEPCIONISTA'
  });

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
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      toast.success('Usuario creado con éxito');
      setIsModalOpen(false);
      setFormData({
        firstName: '', lastName: '', email: '', password: '',
        document: '', phone: '', role: 'RECEPCIONISTA'
      });
    } catch (err: any) {
      toast.error('Error al crear usuario', { description: err.message });
    }
  };

  const handleUpdateUser = async (data: any) => {
    try {
      await updateUser({ id: editDrawer.user.id, ...data });
      toast.success('Perfil actualizado');
      setEditDrawer({ open: false, user: null });
    } catch (err: any) {
      toast.error('Error al actualizar', { description: err.message });
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
            <Button onClick={() => setIsModalOpen(true)} className="rounded-xl h-12 gap-2">
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
        onFilterChange={setFilters}
        onClear={() => setFilters({ search: '', role: '', isActive: '', document: '' })}
      />

      <Card className="border-none shadow-sm overflow-visible">
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

      <EditUserDrawer 
        isOpen={editDrawer.open}
        user={editDrawer.user}
        onClose={() => setEditDrawer({ open: false, user: null })}
        onSave={handleUpdateUser}
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

      {/* Modal de Creación */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Nuevo Colaborador</h3>
                    <p className="text-slate-400 text-sm">Complete el perfil para otorgar acceso al sistema.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Nombre" placeholder="Ej. Ana" icon={<UserIcon size={18}/>} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                    <Input label="Apellido" placeholder="Ej. Lopez" icon={<UserIcon size={18}/>} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Email" type="email" placeholder="ana@hotel.com" icon={<Mail size={18}/>} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    <Input label="Clave Temporal" type="password" placeholder="••••••••" icon={<Lock size={18}/>} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Documento" placeholder="ID / DNI" icon={<FileText size={18}/>} value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} required />
                    <Input label="Teléfono" placeholder="+1..." icon={<Phone size={18}/>} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Rol Asignado</label>
                    <select 
                      className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all outline-none"
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="RECEPCIONISTA">RECEPCIONISTA</option>
                      <option value="ADMIN">ADMINISTRADOR</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full h-14 rounded-2xl">
                    Crear y Notificar Colaborador
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
