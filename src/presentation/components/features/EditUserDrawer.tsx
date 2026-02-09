'use client';

import { useUsers } from '@/presentation/hooks/useUsers';
import { FormDrawer, FormField } from '@/presentation/components/ui/FormDrawer';
import { User, Mail, Shield, Smartphone, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { UserWithDetails } from '@/presentation/types/UserWithDetails';

interface EditUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithDetails;
}

export function EditUserDrawer({ isOpen, onClose, user }: EditUserDrawerProps) {
  const { updateUser } = useUsers();

  const fields: FormField[] = [
    {
      key: 'firstName', label: 'Nombre', type: 'text',
      icon: <User size={18} />, required: true
    },
    {
      key: 'lastName', label: 'Apellido', type: 'text',
      icon: <User size={18} />, required: true
    },
    {
      key: 'email', label: 'Correo Electrónico', type: 'email',
      icon: <Mail size={18} />, required: true, colSpan: 2
    },
    {
      key: 'document', label: 'Identificación (DNI/Pasaporte)', type: 'text',
      icon: <FileText size={18} />, required: true
    },
    {
      key: 'phone', label: 'Teléfono', type: 'text',
      icon: <Smartphone size={18} />, required: true
    },
    {
      key: 'role',
      label: 'Rol de Sistema',
      type: 'select',
      required: true,
      options: [
        { label: 'Administrador', value: 'ADMIN' },
        { label: 'Recepcionista', value: 'RECEPCIONISTA' },
        { label: 'Limpieza', value: 'LIMPIEZA' }
      ]
    }
  ];

  const handleSubmit = async (data: any) => {
    try {
      await updateUser({ id: user.id, ...data });
      toast.success('Perfil actualizado correctamente');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar usuario');
    }
  };

  return (
    <FormDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Perfil"
      description="Actualice la información personal y permisos del usuario."
      fields={fields}
      initialData={user}
      onSubmit={handleSubmit}
    />
  );
}
