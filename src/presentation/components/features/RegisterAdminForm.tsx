'use client';

import { Mail, Lock, User, Phone, FileText, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '@/presentation/hooks/useAuth';

interface RegisterFormProps {
  onSuccess: () => void;
}

import { ConfirmModal } from '@/presentation/components/ui/ConfirmModal';

export const RegisterAdminForm = ({ onSuccess }: RegisterFormProps) => {
  const { registerAdmin, loading, error } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    document: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las claves no coinciden.');
      return;
    }
    try {
      await registerAdmin(formData);
      setShowSuccess(true);
    } catch (err) { }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = Object.values(formData).every(val => val !== '') &&
    formData.password === formData.confirmPassword;

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">Configuración Inicial</h2>
        <p className="text-slate-500 text-sm font-light italic font-serif">Establezca la identidad del administrador maestro.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            name="firstName"
            icon={<User size={16} />}
            onChange={handleChange}
            required
          />
          <Input
            label="Apellido"
            name="lastName"
            icon={<User size={16} />}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Documento"
            name="document"
            icon={<FileText size={16} />}
            onChange={handleChange}
            required
          />
          <Input
            label="Teléfono"
            name="phone"
            icon={<Phone size={16} />}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Email Corporativo"
          name="email"
          type="email"
          icon={<Mail size={16} />}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Clave Maestra"
            name="password"
            type="password"
            icon={<Lock size={16} />}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirmar"
            name="confirmPassword"
            type="password"
            icon={<Lock size={16} />}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold text-center uppercase tracking-widest">
            Protocolo de Registro Bloqueado
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-14 rounded-2xl bg-slate-900"
          isLoading={loading}
          disabled={!isFormValid}
        >
          Finalizar Registro <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <ConfirmModal
        isOpen={showSuccess}
        title="¡Registro Exitoso!"
        description="El administrador ha sido registrado correctamente en el sistema. Ahora puede iniciar sesión con sus credenciales."
        confirmText="Ir al Login"
        variant="success"
        showCancel={false}
        onClose={() => { }} // Bloquéalo o permítele cerrar
        onConfirm={() => {
          setShowSuccess(false);
          onSuccess();
        }}
      />
    </div>
  );
};
