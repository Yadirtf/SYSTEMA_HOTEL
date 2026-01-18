'use client';

import { Card, CardHeader, CardContent } from '@/presentation/components/ui/Card';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { LayoutDashboard, Users, Hotel, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { name: 'Usuarios Totales', value: '4', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Habitaciones', value: '0', icon: Hotel, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Ocupación', value: '0%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Panel de Resumen" 
        subtitle="Bienvenido al centro de operaciones de LuxuryHotel." 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-6 p-6">
              <div className={`${stat.bg} p-4 rounded-2xl`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{stat.name}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader title="Actividad Reciente" subtitle="Próximamente verás aquí las últimas acciones del sistema." />
        <CardContent className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-4">
          <LayoutDashboard className="h-12 w-12 opacity-20" />
          <p className="italic">No hay actividad registrada para mostrar.</p>
        </CardContent>
      </Card>
    </div>
  );
}

