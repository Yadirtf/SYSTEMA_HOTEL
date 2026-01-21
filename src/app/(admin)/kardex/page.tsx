'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { DataTable, ColumnDef } from '@/presentation/components/ui/DataTable';
import { FilterBar, FilterField } from '@/presentation/components/ui/FilterBar';
import { FormDrawer, FormField } from '@/presentation/components/ui/FormDrawer';
import { useStore } from '@/presentation/hooks/useStore';
import { History, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { cn } from '@/shared/utils';

export default function KardexPage() {
  const { 
    movements, fetchKardex, registerMovement,
    products, fetchProducts,
    isLoading 
  } = useStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filters, setFilters] = useState({ productId: '', type: '' });

  useEffect(() => {
    fetchKardex();
    fetchProducts();
  }, [fetchKardex, fetchProducts]);

  const columns: ColumnDef<any>[] = [
    { 
      header: 'Fecha', 
      key: 'createdAt', 
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{new Date(row.createdAt).toLocaleDateString()}</span>
          <span className="text-[10px] text-slate-400">{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )
    },
    { 
      header: 'Producto', 
      key: 'productId', 
      render: (row) => (
        <span className="font-bold text-slate-900">
          {products.find((p: any) => p.id === row.productId)?.name || 'Producto eliminado'}
        </span>
      )
    },
    { 
      header: 'Tipo', 
      key: 'type', 
      render: (row) => (
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[10px] font-black tracking-tighter uppercase",
          row.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        )}>
          {row.type === 'IN' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
          {row.type === 'IN' ? 'ENTRADA' : 'SALIDA'}
        </div>
      )
    },
    { 
      header: 'Cant.', 
      key: 'quantity',
      align: 'center',
      render: (row) => <span className="font-black text-slate-900">{row.quantity}</span>
    },
    { 
      header: 'Costo Unit.', 
      key: 'unitCost', 
      render: (row) => <span className="font-medium text-slate-600">${row.unitCost.toFixed(2)}</span> 
    },
    { 
      header: 'Motivo', 
      key: 'reason',
      className: 'text-slate-500 italic text-xs'
    },
    { 
      header: 'Realizado por', 
      key: 'performedBy', 
      align: 'right',
      render: (row) => (
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-700">{(row.performedBy as any)?.email?.split('@')[0]}</span>
          <span className="text-[10px] text-slate-400">@Sistema</span>
        </div>
      ) 
    },
  ];

  const filterConfig: FilterField[] = [
    { 
      key: 'productId', 
      label: 'Producto', 
      type: 'select', 
      options: Array.isArray(products) ? products.map((p: any) => ({ label: p.name, value: p.id })) : []
    },
    { 
      key: 'type', 
      label: 'Tipo Movimiento', 
      type: 'select', 
      options: [
        { label: 'ENTRADAS', value: 'IN' },
        { label: 'SALIDAS', value: 'OUT' }
      ] 
    },
  ];

  const formFields: FormField[] = [
    { 
      key: 'productId', 
      label: 'Producto', 
      type: 'select', 
      required: true,
      options: Array.isArray(products) ? products.map((p: any) => ({ label: p.name, value: p.id })) : []
    },
    { 
      key: 'type', 
      label: 'Tipo de Movimiento', 
      type: 'select', 
      required: true,
      options: [
        { label: 'ENTRADA (Compra / Ajuste +)', value: 'IN' },
        { label: 'SALIDA (Consumo / Ajuste -)', value: 'OUT' }
      ]
    },
    { key: 'quantity', label: 'Cantidad', type: 'number', required: true },
    { key: 'unitCost', label: 'Costo Unitario', type: 'number', required: true },
    { key: 'reason', label: 'Motivo / Referencia', type: 'text', required: true },
  ];

  const filteredMovements = Array.isArray(movements) ? movements : [];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Kardex de Inventario" 
        subtitle="Registro histórico de todas las entradas y salidas"
        actions={
          <>
             <Button 
               variant="secondary" 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className={cn("h-12 rounded-xl", isFilterOpen && "bg-slate-900 text-white")}
             >
              Filtros
            </Button>
            <Button onClick={() => setIsCreateOpen(true)} className="h-12 rounded-xl">
              <Plus size={18} className="mr-2" /> 
              Registrar Movimiento
            </Button>
          </>
        }
      />

      <FilterBar 
        isOpen={isFilterOpen}
        config={filterConfig}
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          fetchKardex(newFilters);
        }}
        onClear={() => {
          setFilters({ productId: '', type: '' });
          fetchKardex({});
        }}
      />

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-4">
        <DataTable 
          columns={columns}
          data={filteredMovements}
          isLoading={isLoading}
          renderMobileCard={(row) => (
            <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 space-y-4 shadow-sm h-full flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1.5">
                      {new Date(row.createdAt).toLocaleDateString()} {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <h4 className="font-bold text-slate-900 leading-tight truncate pr-2">
                      {products.find((p: any) => p.id === row.productId)?.name || 'Producto eliminado'}
                    </h4>
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-xl text-[9px] font-black tracking-tighter uppercase flex items-center gap-1 shrink-0",
                    row.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  )}>
                    {row.type === 'IN' ? <ArrowUpCircle size={10} /> : <ArrowDownCircle size={10} />}
                    {row.type === 'IN' ? 'Entrada' : 'Salida'}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-y border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Cantidad</span>
                    <span className="text-sm font-black text-slate-900">{row.quantity} uds</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Costo Unit.</span>
                    <span className="text-sm font-black text-slate-900">${row.unitCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[10px] text-slate-500 italic line-clamp-1 flex-1 pr-4">"{row.reason}"</p>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter shrink-0 bg-slate-50 px-2 py-0.5 rounded-md">
                  {(row.performedBy as any)?.email?.split('@')[0] || 'Sist.'}
                </span>
              </div>
            </div>
          )}
        />
      </div>

      <FormDrawer 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Registrar Movimiento"
        fields={formFields}
        onSubmit={registerMovement}
      />
    </div>
  );
}
