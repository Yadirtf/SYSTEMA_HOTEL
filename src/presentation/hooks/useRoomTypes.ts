'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RoomType } from '@/domain/entities/RoomType';

export const useRoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/room-types', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await res.json();
      if (res.ok) setRoomTypes(data);
    } catch {
      toast.error('Error al cargar tipos de habitación');
    } finally {
      setLoading(false);
    }
  };

  const createRoomType = async (dto: Partial<RoomType>) => {
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
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error desconocido');
    }
  };

  const updateRoomType = async (id: string, dto: Partial<RoomType>) => {
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
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error desconocido');
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
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error desconocido');
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  return { roomTypes, loading, fetchRoomTypes, createRoomType, updateRoomType, deleteRoomType };
};
