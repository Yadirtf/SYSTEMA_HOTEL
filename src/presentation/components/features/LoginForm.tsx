'use client';

import { Mail, Lock, LogIn, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '@/presentation/hooks/useAuth';

export const LoginForm = () => {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      router.push('/dashboard');
    } catch (err) {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">Iniciar Sesión</h2>
        <p className="text-slate-500 text-sm italic font-serif leading-relaxed">Acceda al portal de gestión operativa.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Email de Usuario"
            name="email"
            type="email"
            placeholder="usuario@hotel.com"
            icon={<Mail size={18} />}
            onChange={handleChange}
            autoFocus
            required
            className="h-12"
          />
          <div className="space-y-1">
            <Input
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>
        </div>
        
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-[11px] font-bold text-center uppercase tracking-wider">
            Credenciales Incorrectas
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-14 rounded-2xl bg-slate-900" 
          isLoading={loading}
        >
          Acceder <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
