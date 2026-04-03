import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_BASE_URL || '/api';
      const res = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, templeId: import.meta.env.VITE_TEMPLE_ID }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }
      if (data.user.role !== 'ADMIN') {
        setError('Access denied. Admin only.');
        return;
      }
      login(data.token, data.user);
      navigate('/admin');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
            <span className="text-primary font-bold text-lg">V</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Varadanam</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to the admin portal</p>
        </div>

        <div
          className="bg-card rounded-xl p-8"
          style={{ boxShadow: '0 10px 30px -10px rgba(28,25,23,0.10)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="rounded-md bg-background border-border focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="rounded-md bg-background border-border focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            {error && (
              <p className="text-xs text-destructive bg-destructive/8 rounded-md px-3 py-2">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full rounded-md font-medium"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
