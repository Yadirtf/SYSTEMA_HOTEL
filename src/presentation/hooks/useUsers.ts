import { useState, useEffect } from 'react';
import { User } from '@/domain/entities/User';
import { UserWithDetails } from '@/presentation/types/UserWithDetails';

export function useUsers() {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar usuarios');
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Partial<User>) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear usuario');
      await fetchUsers();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error desconocido');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar usuario');
      }
      await fetchUsers();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error desconocido');
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al actualizar usuario');
      }
      await fetchUsers();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error desconocido');
    }
  };

  const updateUser = async (userData: Partial<User> & { id: string }) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/users/${userData.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al actualizar usuario');
      }
      await fetchUsers();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error desconocido');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers, createUser, deleteUser, toggleUserStatus, updateUser };
}

