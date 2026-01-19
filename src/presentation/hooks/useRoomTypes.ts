'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useRoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/room-types', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await res.json();
      if (res.ok) setRoomTypes(data);
    } catch (err) {
      toast.error('Error al cargar tipos de habitación');
    } finally {
      setLoading(false);
    }
  };

  const createRoomType = async (dto: any) => {
    try {
      const res = await fetch('/api/room-types', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(dto)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear tipo');
      }
      await fetchRoomTypes();
    } catch (err: any) {
      throw err;
    }
  };

  const updateRoomType = async (id: string, dto: any) => {
    try {
      const res = await fetch(`/api/room-types/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(dto)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al actualizar tipo');
      }
      await fetchRoomTypes();
    } catch (err: any) {
      throw err;
    }
  };

  const deleteRoomType = async (id: string) => {
    try {
      const res = await fetch(`/api/room-types/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar tipo');
      }
      await fetchRoomTypes();
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  return { roomTypes, loading, fetchRoomTypes, createRoomType, updateRoomType, deleteRoomType };
};
