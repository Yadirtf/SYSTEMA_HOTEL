'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { DataTable, ColumnDef } from '@/presentation/components/ui/DataTable';
import { FilterBar, FilterField } from '@/presentation/components/ui/FilterBar';
import { FormDrawer, FormField } from '@/presentation/components/ui/FormDrawer';
import { ConfirmModal } from '@/presentation/components/ui/ConfirmModal';
import { useStore } from '@/presentation/hooks/useStore';
import { ShoppingBag, Plus, Barcode, Edit, Trash2, Power } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { cn } from '@/shared/utils';

export default function ProductsPage() {
  const { 
    products, fetchProducts, createProduct, updateProduct, deleteProduct,
    categories, fetchCategories,
    units, fetchUnits,
    isLoading 
  } = useStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);
  const [filters, setFilters] = useState({ search: '', categoryId: '' });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchUnits();
  }, [fetchProducts, fetchCategories, fetchUnits]);

  // Configuración de Columnas
  const columns: ColumnDef<any>[] = [
    { 
      header: 'Producto', 
      key: 'name',
      render: (row) => (
        <div className="flex flex-col">
          <span className={cn("font-bold", !row.isActive && "text-slate-400 line-through")}>{row.name}</span>
          {!row.isActive && <span className="text-[9px] text-rose-500 font-black uppercase tracking-tighter">Desactivado</span>}
        </div>
      )
    },
    { 
      header: 'Código', 
      key: 'barcode', 
      render: (row) => (
        <div className="flex items-center gap-2 text-slate-500">
          <Barcode size={14} className="opacity-50" />
          <span className="font-mono text-xs">{row.barcode || '-'}</span>
        </div>
      )
    },
    { 
      header: 'Categoría', 
      key: 'categoryId', 
      render: (row) => categories.find((c: any) => c.id === row.categoryId)?.name || 'Sin categoría' 
    },
    { 
      header: 'Stock', 
      key: 'currentStock', 
      render: (row) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          row.currentStock <= 5 
            ? "bg-rose-50 text-rose-600 border-rose-100" 
            : "bg-emerald-50 text-emerald-600 border-emerald-100"
        )}>
          {row.currentStock} {units.find((u: any) => u.id === row.unitId)?.abbreviation}
        </span>
      )
    },
    { 
      header: 'Precio Venta', 
      key: 'salePrice', 
      render: (row) => <span className="font-bold text-slate-900">${row.salePrice.toFixed(2)}</span> 
    },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => { setEditingProduct(row); setIsCreateOpen(true); }}
          >
            <Edit size={14} className="text-blue-500" />
          </Button>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => updateProduct(row.id, { isActive: !row.isActive })}
          >
            <Power size={14} className={row.isActive ? "text-emerald-500" : "text-slate-300"} />
          </Button>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => setDeletingProduct(row)}
          >
            <Trash2 size={14} className="text-rose-500" />
          </Button>
        </div>
      )
    }
  ];

  // Configuración de Filtros
  const filterConfig: FilterField[] = [
    { key: 'search', label: 'Buscar Producto', type: 'search', placeholder: 'Nombre o Código...' },
    { 
      key: 'categoryId', 
      label: 'Categoría', 
      type: 'select', 
      options: Array.isArray(categories) ? categories.map((c: any) => ({ label: c.name, value: c.id })) : []
    },
  ];

  // Configuración de Formulario
  const formFields: FormField[] = [
    { key: 'name', label: 'Nombre del Producto', type: 'text' as const, required: true },
    { 
      key: 'barcode', 
      label: 'Código de Barras (Opcional)', 
      type: 'text' as const, 
      icon: <Barcode size={18} />,
      onlyNumbers: true // Validación limpia: solo números
    },
    { 
      key: 'categoryId', 
      label: 'Categoría', 
      type: 'select' as const, 
      required: true,
      options: Array.isArray(categories) ? categories.map((c: any) => ({ label: c.name, value: c.id })) : []
    },
    { 
      key: 'unitId', 
      label: 'Unidad de Medida', 
      type: 'select' as const, 
      required: true,
      options: Array.isArray(units) ? units.map((u: any) => ({ label: `${u.name} (${u.abbreviation})`, value: u.id })) : []
    },
    // Solo mostrar Stock Inicial al crear, no al editar (el stock se maneja por Kardex)
    ...(!editingProduct ? [{ key: 'currentStock', label: 'Stock Inicial', type: 'number' as const, required: true }] : []),
    { key: 'purchasePrice', label: 'Precio Compra', type: 'number' as const, required: true },
    { key: 'salePrice', label: 'Precio Venta', type: 'number' as const, required: true },
    { key: 'description', label: 'Descripción', type: 'text' as const, colSpan: 2 },
  ];

  const handleProductSubmit = async (data: any) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await createProduct(data);
    }
    setIsCreateOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = Array.isArray(products) ? products.filter((p: any) => {
    const matchSearch = p.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                         (p.barcode && p.barcode.toLowerCase().includes(filters.search.toLowerCase()));
    const matchCategory = !filters.categoryId || p.categoryId === filters.categoryId;
    return matchSearch && matchCategory;
  }) : [];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Gestión de Tienda" 
        subtitle="Catálogo de productos y control de inventario"
        actions={
          <>
             <Button 
              variant="secondary" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn("h-12 rounded-xl", isFilterOpen && "bg-slate-900 text-white")}
            >
              Filtros
            </Button>
            <Button onClick={() => { setEditingProduct(null); setIsCreateOpen(true); }} className="h-12 rounded-xl">
              <Plus size={18} className="mr-2" /> Nuevo Producto
            </Button>
          </>
        }
      />

      <FilterBar 
        isOpen={isFilterOpen}
        config={filterConfig}
        filters={filters}
        onFilterChange={setFilters}
        onClear={() => setFilters({ search: '', categoryId: '' })}
      />

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-sm">
        <DataTable 
          columns={columns}
          data={filteredProducts}
          isLoading={isLoading}
          renderMobileCard={(row) => (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className={cn("font-bold text-slate-900", !row.isActive && "text-slate-400 line-through")}>
                    {row.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {categories.find((c: any) => c.id === row.categoryId)?.name || 'Sin categoría'}
                  </span>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase border",
                  row.currentStock <= 5 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                )}>
                  Stock: {row.currentStock}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
                <Barcode size={14} className="opacity-50" />
                {row.barcode || 'Sin código'}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-black text-slate-900">${row.salePrice.toFixed(2)}</span>
                <div className="flex gap-2">
                  <Button variant="secondary" className="h-9 w-9 p-0 rounded-xl" onClick={() => { setEditingProduct(row); setIsCreateOpen(true); }}>
                    <Edit size={14} className="text-blue-500" />
                  </Button>
                  <Button variant="secondary" className="h-9 w-9 p-0 rounded-xl" onClick={() => updateProduct(row.id, { isActive: !row.isActive })}>
                    <Power size={14} className={row.isActive ? "text-emerald-500" : "text-slate-300"} />
                  </Button>
                  <Button variant="secondary" className="h-9 w-9 p-0 rounded-xl" onClick={() => setDeletingProduct(row)}>
                    <Trash2 size={14} className="text-rose-500" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        />
      </div>

      <FormDrawer 
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); setEditingProduct(null); }}
        title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
        initialData={editingProduct}
        fields={formFields}
        onSubmit={handleProductSubmit}
      />

      <ConfirmModal 
        isOpen={!!deletingProduct}
        title="¿Eliminar producto?"
        description={`Esta acción eliminará "${deletingProduct?.name}" permanentemente del catálogo.`}
        confirmText="Eliminar permanentemente"
        onClose={() => setDeletingProduct(null)}
        onConfirm={async () => {
          await deleteProduct(deletingProduct.id);
          setDeletingProduct(null);
        }}
      />
    </div>
  );
}
