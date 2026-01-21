'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { DataTable, ColumnDef } from '@/presentation/components/ui/DataTable';
import { FormDrawer, FormField } from '@/presentation/components/ui/FormDrawer';
import { ConfirmModal } from '@/presentation/components/ui/ConfirmModal';
import { useStore } from '@/presentation/hooks/useStore';
import { Settings, Plus, Tag, Ruler, Edit, Trash2, Power } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { cn } from '@/shared/utils';

export default function StoreSettingsPage() {
  const { 
    categories, fetchCategories, createCategory, updateCategory, deleteCategory,
    units, fetchUnits, createUnit, updateUnit, deleteUnit,
    isLoading 
  } = useStore();

  // Estados para Categorías
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategory, setDeletingCategory] = useState<any>(null);

  // Estados para Unidades
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [deletingUnit, setDeletingUnit] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
    fetchUnits();
  }, [fetchCategories, fetchUnits]);

  // --- CONFIGURACIÓN DE COLUMNAS ---
  const categoryColumns: ColumnDef<any>[] = [
    { 
      header: 'Categoría', 
      key: 'name',
      render: (row) => (
        <div className="flex flex-col">
          <span className={cn("font-bold", !row.isActive && "text-slate-400 line-through")}>{row.name}</span>
          {!row.isActive && <span className="text-[9px] text-rose-500 font-black uppercase tracking-tighter">Desactivada</span>}
        </div>
      )
    },
    { header: 'Descripción', key: 'description' },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => { setEditingCategory(row); setIsCategoryOpen(true); }}
          >
            <Edit size={14} className="text-blue-500" />
          </Button>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => updateCategory(row.id, { isActive: !row.isActive })}
          >
            <Power size={14} className={row.isActive ? "text-emerald-500" : "text-slate-300"} />
          </Button>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => setDeletingCategory(row)}
          >
            <Trash2 size={14} className="text-rose-500" />
          </Button>
        </div>
      )
    }
  ];

  const unitColumns: ColumnDef<any>[] = [
    { 
      header: 'Unidad', 
      key: 'name',
      render: (row) => (
        <div className="flex flex-col">
          <span className={cn("font-bold", !row.isActive && "text-slate-400 line-through")}>{row.name}</span>
          {!row.isActive && <span className="text-[9px] text-rose-500 font-black uppercase tracking-tighter">Inactiva</span>}
        </div>
      )
    },
    { header: 'Abrev.', key: 'abbreviation', render: (row) => <span className="font-mono text-slate-500 uppercase">{row.abbreviation}</span> },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => { setEditingUnit(row); setIsUnitOpen(true); }}
          >
            <Edit size={14} className="text-blue-500" />
          </Button>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => updateUnit(row.id, { isActive: !row.isActive })}
          >
            <Power size={14} className={row.isActive ? "text-emerald-500" : "text-slate-300"} />
          </Button>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => setDeletingUnit(row)}
          >
            <Trash2 size={14} className="text-rose-500" />
          </Button>
        </div>
      )
    }
  ];

  // --- HANDLERS ---
  const handleCategorySubmit = async (data: any) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await createCategory(data);
    }
    setEditingCategory(null);
  };

  const handleUnitSubmit = async (data: any) => {
    if (editingUnit) {
      await updateUnit(editingUnit.id, data);
    } else {
      await createUnit(data);
    }
    setEditingUnit(null);
  };

  return (
    <div className="space-y-12">
      <PageHeader 
        title="Configuración de Tienda" 
        subtitle="Gestione las categorías de productos y unidades de medida"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Sección Categorías */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-2xl">
                <Tag size={20} className="text-blue-600" />
              </div> 
              Categorías
            </h3>
            <Button onClick={() => { setEditingCategory(null); setIsCategoryOpen(true); }} className="h-11 rounded-xl">
              <Plus size={16} className="mr-2" /> Nueva
            </Button>
          </div>
          <DataTable 
            columns={categoryColumns} 
            data={categories} 
            isLoading={isLoading} 
            renderMobileCard={(row) => (
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className={cn("font-bold text-slate-900", !row.isActive && "text-slate-400 line-through")}>
                      {row.name}
                    </span>
                    <p className="text-xs text-slate-500 line-clamp-1">{row.description || 'Sin descripción'}</p>
                  </div>
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full ring-4",
                    row.isActive ? "bg-emerald-500 ring-emerald-50" : "bg-slate-300 ring-slate-50"
                  )} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" className="flex-1 h-10 rounded-xl" onClick={() => { setEditingCategory(row); setIsCategoryOpen(true); }}>
                    <Edit size={14} className="mr-2 text-blue-500" /> Editar
                  </Button>
                  <Button variant="secondary" className="h-10 w-10 p-0 rounded-xl" onClick={() => updateCategory(row.id, { isActive: !row.isActive })}>
                    <Power size={14} className={row.isActive ? "text-emerald-500" : "text-slate-300"} />
                  </Button>
                  <Button variant="secondary" className="h-10 w-10 p-0 rounded-xl" onClick={() => setDeletingCategory(row)}>
                    <Trash2 size={14} className="text-rose-500" />
                  </Button>
                </div>
              </div>
            )}
          />
        </div>

        {/* Sección Unidades */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="bg-amber-50 p-2.5 rounded-2xl">
                <Ruler size={20} className="text-amber-600" />
              </div> 
              Unidades
            </h3>
            <Button onClick={() => { setEditingUnit(null); setIsUnitOpen(true); }} className="h-11 rounded-xl">
              <Plus size={16} className="mr-2" /> Nueva
            </Button>
          </div>
          <DataTable 
            columns={unitColumns} 
            data={units} 
            isLoading={isLoading} 
            renderMobileCard={(row) => (
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className={cn("font-bold text-slate-900", !row.isActive && "text-slate-400 line-through")}>
                      {row.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest">{row.abbreviation}</span>
                  </div>
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full ring-4",
                    row.isActive ? "bg-emerald-500 ring-emerald-50" : "bg-slate-300 ring-slate-50"
                  )} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" className="flex-1 h-10 rounded-xl" onClick={() => { setEditingUnit(row); setIsUnitOpen(true); }}>
                    <Edit size={14} className="mr-2 text-blue-500" /> Editar
                  </Button>
                  <Button variant="secondary" className="h-10 w-10 p-0 rounded-xl" onClick={() => updateUnit(row.id, { isActive: !row.isActive })}>
                    <Power size={14} className={row.isActive ? "text-emerald-500" : "text-slate-300"} />
                  </Button>
                  <Button variant="secondary" className="h-10 w-10 p-0 rounded-xl" onClick={() => setDeletingUnit(row)}>
                    <Trash2 size={14} className="text-rose-500" />
                  </Button>
                </div>
              </div>
            )}
          />
        </div>
      </div>

      {/* MODALES Y DRAWERS PARA CATEGORÍAS */}
      <FormDrawer 
        isOpen={isCategoryOpen}
        onClose={() => { setIsCategoryOpen(false); setEditingCategory(null); }}
        title={editingCategory ? "Editar Categoría" : "Nueva Categoría"}
        initialData={editingCategory}
        fields={[
          { key: 'name', label: 'Nombre de Categoría', type: 'text', required: true },
          { key: 'description', label: 'Descripción', type: 'text' }
        ]}
        onSubmit={handleCategorySubmit}
      />
      <ConfirmModal 
        isOpen={!!deletingCategory}
        title="¿Eliminar categoría?"
        description={`Esta acción eliminará "${deletingCategory?.name}". Esto podría afectar a los productos asociados.`}
        confirmText="Eliminar permanentemente"
        onClose={() => setDeletingCategory(null)}
        onConfirm={async () => {
          await deleteCategory(deletingCategory.id);
          setDeletingCategory(null);
        }}
      />

      {/* MODALES Y DRAWERS PARA UNIDADES */}
      <FormDrawer 
        isOpen={isUnitOpen}
        onClose={() => { setIsUnitOpen(false); setEditingUnit(null); }}
        title={editingUnit ? "Editar Unidad" : "Nueva Unidad"}
        initialData={editingUnit}
        fields={[
          { key: 'name', label: 'Nombre de Unidad', type: 'text', required: true, placeholder: 'Ej: Unidad, Botella, Kilogramo' },
          { key: 'abbreviation', label: 'Abreviación', type: 'text', required: true, placeholder: 'Ej: un, bot, kg' }
        ]}
        onSubmit={handleUnitSubmit}
      />
      <ConfirmModal 
        isOpen={!!deletingUnit}
        title="¿Eliminar unidad?"
        description={`Esta acción eliminará "${deletingUnit?.name}".`}
        confirmText="Eliminar permanentemente"
        onClose={() => setDeletingUnit(null)}
        onConfirm={async () => {
          await deleteUnit(deletingUnit.id);
          setDeletingUnit(null);
        }}
      />
    </div>
  );
}
