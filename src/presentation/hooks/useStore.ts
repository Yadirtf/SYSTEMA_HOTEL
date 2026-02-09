'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ProductCategory, Unit, Product, InventoryMovement, Sale } from '@/domain/entities/Store';

export const useStore = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper para obtener headers con token
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, []);

  // --- CATEGORÍAS ---
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/store/categories', { headers: getHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
        if (data.error) console.error('Error categories:', data.error);
      }
    } catch {
      setCategories([]);
      toast.error('Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  const createCategory = async (data: Partial<ProductCategory>) => {
    try {
      const res = await fetch('/api/store/categories', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al crear categoría');
      toast.success('Categoría creada');
      fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const updateCategory = async (id: string, data: Partial<ProductCategory>) => {
    try {
      const res = await fetch(`/api/store/categories/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al actualizar categoría');
      toast.success('Categoría actualizada');
      fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/store/categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Error al eliminar categoría');
      }
      toast.success('Categoría eliminada');
      fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  // --- UNIDADES ---
  const fetchUnits = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/store/units', { headers: getHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUnits(data);
      } else {
        setUnits([]);
      }
    } catch {
      setUnits([]);
      toast.error('Error al cargar unidades');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  const createUnit = async (data: Partial<Unit>) => {
    try {
      const res = await fetch('/api/store/units', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al crear unidad');
      toast.success('Unidad creada');
      fetchUnits();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const updateUnit = async (id: string, data: Partial<Unit>) => {
    try {
      const res = await fetch(`/api/store/units/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al actualizar unidad');
      toast.success('Unidad actualizada');
      fetchUnits();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      const res = await fetch(`/api/store/units/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Error al eliminar unidad');
      }
      toast.success('Unidad eliminada');
      fetchUnits();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  // --- PRODUCTOS ---
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/store/products', { headers: getHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
      toast.error('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  const createProduct = async (data: Partial<Product>) => {
    try {
      const res = await fetch('/api/store/products', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al crear producto');
      toast.success('Producto creado');
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    try {
      const res = await fetch(`/api/store/products/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al actualizar producto');
      toast.success('Producto actualizado');
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/store/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Error al eliminar producto');
      }
      toast.success('Producto eliminado');
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  // --- KARDEX ---
  const fetchKardex = useCallback(async (filters: Record<string, string> = {}) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/store/kardex?${params}`, { headers: getHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMovements(data);
      } else {
        setMovements([]);
      }
    } catch {
      setMovements([]);
      toast.error('Error al cargar movimientos');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  const registerMovement = async (data: Partial<InventoryMovement>) => {
    try {
      const res = await fetch('/api/store/kardex', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al registrar movimiento');
      toast.success('Movimiento registrado');
      fetchKardex();
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  return {
    categories, fetchCategories, createCategory, updateCategory, deleteCategory,
    units, fetchUnits, createUnit, updateUnit, deleteUnit,
    products, fetchProducts, createProduct, updateProduct, deleteProduct,
    movements, fetchKardex, registerMovement,
    isLoading
  };
};

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, []);

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/store/sales', { headers: getHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSales(data);
      } else {
        setSales([]);
      }
    } catch {
      setSales([]);
      toast.error('Error al cargar ventas');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  const createSale = async (data: Partial<Sale>) => {
    try {
      const res = await fetch('/api/store/sales', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al registrar venta');
      toast.success('Venta registrada con éxito');
      fetchSales();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
      return false;
    }
  };

  return { sales, fetchSales, createSale, isLoading };
};
