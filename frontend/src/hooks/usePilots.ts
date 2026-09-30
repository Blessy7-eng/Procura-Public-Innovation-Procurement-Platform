import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Pilot } from '../types';

export function usePilots() {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPilots = async () => {
    try {
      setLoading(true);
      const data = await api.getPilots();
      setPilots(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load pilots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPilots();
  }, []);

  return {
    pilots,
    loading,
    error,
    refresh: fetchPilots
  };
}
