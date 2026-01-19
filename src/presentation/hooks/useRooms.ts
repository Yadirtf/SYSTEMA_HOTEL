'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useRooms = (floorId?: string) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const url = floorId ? `/api/rooms?floorId=${floorId}` : '/api/rooms';
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await res.json();
      if (res.ok) setRooms(data);
    } catch (err) {
      toast.error('Error al cargar habitaciones');
    } finally {
      setLoading(false);
    }
  }, [floorId]);

  const createRoom = async (dto: any) => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(dto)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear habitación');
      }
      await fetchRooms();
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, fetchRooms, createRoom };
};

