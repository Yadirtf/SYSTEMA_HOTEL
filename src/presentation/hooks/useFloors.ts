'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useFloors = () => {
  const [floors, setFloors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFloors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/floors', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await res.json();
      if (res.ok) setFloors(data);
    } catch (err) {
      toast.error('Error al cargar pisos');
    } finally {
      setLoading(false);
    }
  };

  const createFloor = async (dto: any) => {
    try {
      const res = await fetch('/api/floors', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(dto)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear piso');
      }
      await fetchFloors();
    } catch (err: any) {
      throw err;
    }
  };

  const updateFloor = async (id: string, dto: any) => {
    try {
      const res = await fetch(`/api/floors/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(dto)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al actualizar piso');
      }
      await fetchFloors();
    } catch (err: any) {
      throw err;
    }
  };

  const deleteFloor = async (id: string) => {
    try {
      const res = await fetch(`/api/floors/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar piso');
      }
      await fetchFloors();
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchFloors();
  }, []);

  return { floors, loading, fetchFloors, createFloor, updateFloor, deleteFloor };
};

