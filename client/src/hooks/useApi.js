import { useAuth } from '@/context/AuthContext';

export function useApi() {
  const { token } = useAuth();

  const request = async (path, options = {}) => {
    const base = import.meta.env.VITE_API_BASE_URL || '/api';
    const res = await fetch(`${base}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  };

  return { request };
}
