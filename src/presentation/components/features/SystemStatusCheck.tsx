'use client';

import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useSystemStatus } from '@/presentation/hooks/useSystemStatus';

interface SystemStatusCheckProps {
  onStartRegistration: () => void;
  onGoToLogin: () => void;
}

export const SystemStatusCheck = ({ onStartRegistration, onGoToLogin }: SystemStatusCheckProps) => {
  const { initialized, loading, error } = useSystemStatus();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="h-10 w-10 text-slate-200 animate-spin stroke-[1.5]" />
        <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Sincronizando</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="bg-red-50 p-4 rounded-full">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Error de Conexión</h2>
          <p className="text-sm text-slate-500 leading-relaxed">No ha sido posible conectar con la base de datos.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
          Reintentar Protocolo
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center space-y-8">
      <div className="space-y-3">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
          {initialized ? 'Panel de Acceso' : 'Bienvenida Maestro'}
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto">
          {initialized 
            ? 'El sistema LuxuryHotel se encuentra operativo y listo para su uso.' 
            : 'Inicie la configuración del núcleo administrativo para comenzar.'}
        </p>
      </div>

      <div className="w-full space-y-4">
        {initialized ? (
          <>
            <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Sistema Listo</p>
                <p className="text-[11px] text-emerald-700 font-medium">Administrador verificado.</p>
              </div>
            </div>
            <Button onClick={onGoToLogin} className="w-full h-14 rounded-2xl">
              Entrar al Sistema <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Estado: Nuevo</p>
                <p className="text-[11px] text-blue-700 font-medium">Se requiere inicialización.</p>
              </div>
            </div>
            <Button onClick={onStartRegistration} className="w-full h-14 rounded-2xl">
              Comenzar Configuración <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
