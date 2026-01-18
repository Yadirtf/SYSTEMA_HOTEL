import { useState, useEffect } from 'react';

export function useSystemStatus() {
  const [initialized, setInitialized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/system-status');
      const data = await res.json();
      setInitialized(data.initialized);
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return { initialized, loading, error, checkStatus };
}

