'use client';

import { Card, CardHeader, CardContent } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { UserTable } from '@/presentation/components/features/UserTable';
import { useUsers } from '@/presentation/hooks/useUsers';
import { UserPlus, RefreshCw, X, Mail, Lock, User as UserIcon, Phone, FileText } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/presentation/components/ui/Input';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { toast } from 'sonner';
import { ConfirmModal } from '@/presentation/components/ui/ConfirmModal';

export default function UsersManagementPage() {
  const { users, loading, fetchUsers, deleteUser, toggleUserStatus, createUser } = useUsers();
  
  // Estados para Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  const [statusModal, setStatusModal] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    document: '', phone: '', role: 'RECEPCIONISTA'
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      toast.success('Colaborador registrado', {
        description: `El acceso para ${formData.firstName} ha sido configurado.`
      });
      setIsModalOpen(false);
      setFormData({
        firstName: '', lastName: '', email: '', password: '',
        document: '', phone: '', role: 'RECEPCIONISTA'
      });
    } catch (err: any) {
      toast.error('Error de registro', { description: err.message });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.user) return;
    try {
      await deleteUser(deleteModal.user.id);
      toast.success('Usuario eliminado permanentemente');
      setDeleteModal({ open: false, user: null });
    } catch (err: any) {
      if (err.message === 'CANNOT_DELETE_SELF') {
        toast.error('Operación restringida', {
          description: 'No es posible eliminar su propia cuenta administrativa.'
        });
      } else {
        toast.error('Error', { description: err.message });
      }
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
    <div className="space-y-8">
      <PageHeader 
        title="Gestión de Personal" 
        subtitle="Administre los accesos y roles de su equipo operativo."
        actions={
          <>
            <Button variant="outline" onClick={fetchUsers} className="rounded-xl h-12">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="rounded-xl h-12 gap-2">
              <UserPlus className="h-5 w-5" /> Registrar Nuevo
            </Button>
          </>
        }
      />

      <Card className="border-none shadow-sm">
        
        <CardContent className="p-0">
          <UserTable 
            users={users} 
            isLoading={loading} 
            onDelete={(user) => setDeleteModal({ open: true, user })} 
            onToggleStatus={(user) => setStatusModal({ open: true, user })}
          />
        </CardContent>
      </Card>

      {/* MODAL: ELIMINAR */}
      <ConfirmModal 
        isOpen={deleteModal.open}
        title="¿Eliminar colaborador?"
        description={`Esta acción eliminará permanentemente a ${deleteModal.user?.firstName} de la base de datos. Esta operación no se puede deshacer.`}
        confirmText="Eliminar permanentemente"
        variant="danger"
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={confirmDelete}
      />

      {/* MODAL: ESTADO */}
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
