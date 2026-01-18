'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Hotel } from 'lucide-react';
import { SystemStatusCheck } from '@/presentation/components/features/SystemStatusCheck';
import { RegisterAdminForm } from '@/presentation/components/features/RegisterAdminForm';
import { LoginForm } from '@/presentation/components/features/LoginForm';

type ViewState = 'CHECKING' | 'REGISTER' | 'LOGIN';

export default function HomePage() {
  const [view, setView] = useState<ViewState>('CHECKING');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      
      {/* Decoración de fondo sutil para dar profundidad */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-slate-200/40 blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-blue-50/50 blur-3xl"></div>
      </div>

      <div className="w-full max-w-[1000px] flex flex-col items-center relative z-10">
        
        {/* Header Compacto */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="bg-slate-900 p-3 rounded-[1.2rem] shadow-2xl mb-4">
            <Hotel className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-[0.2em] uppercase">
            LuxuryHotel <span className="text-slate-400 font-light">Management</span>
          </h1>
        </motion.div>

        {/* Contenedor Principal con ancho controlado */}
        <div className="w-full flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={view === 'REGISTER' ? "w-full max-w-2xl" : "w-full max-w-md"}
            >
              <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_30px_60px_rgba(0,0,0,0.04)] p-8 lg:p-12">
                {view === 'CHECKING' && (
                  <SystemStatusCheck 
                    onStartRegistration={() => setView('REGISTER')}
                    onGoToLogin={() => setView('LOGIN')}
                  />
                )}

                {view === 'REGISTER' && (
                  <RegisterAdminForm 
                    onSuccess={() => setView('LOGIN')}
                  />
                )}

                {view === 'LOGIN' && (
                  <LoginForm />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Minimalista */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex items-center gap-6 text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase"
        >
          <span>Estándar Global</span>
          <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
          <span>Protocolo Seguro</span>
          <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
          <span>&copy; {new Date().getFullYear()}</span>
        </motion.div>
      </div>
    </div>
  );
}
