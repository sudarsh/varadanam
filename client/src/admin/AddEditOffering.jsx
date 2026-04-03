import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApi } from '@/hooks/useApi';

const templeId = import.meta.env.VITE_TEMPLE_ID;

const CATEGORIES = [
  { value: 'DAILY_RITUAL', label: 'Daily Ritual' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'ARCHANA', label: 'Archana' },
  { value: 'ANNADANAM', label: 'Annadanam' },
  { value: 'DONATION', label: 'Donation' },
  { value: 'SPECIAL_SEVA', label: 'Special Seva' },
];

const EMPTY = {
  name: '',
  description: '',
  amount: '',
  category: '',
  emoji: '🪔',
  sortOrder: 0,
  isActive: true,
};

export default function AddEditOffering() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request } = useApi();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!isEdit) return;
    request(`/offerings/${id}`)
      .then(data => setForm({
        name: data.name,
        description: data.description,
        amount: data.amount,
        category: data.category,
        emoji: data.emoji,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      }))
      .catch(console.error);
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount), sortOrder: Number(form.sortOrder), templeId };
      if (isEdit) {
        await request(`/offerings/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await request('/offerings', { method: 'POST', body: JSON.stringify(payload) });
      }
      navigate('/admin/offerings');
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/offerings"><ChevronLeft className="size-4" /></Link>
          </Button>
          <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Offering' : 'Add Offering'}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Offering details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1.5 col-span-3">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="emoji">Emoji</Label>
                  <Input id="emoji" name="emoji" value={form.emoji} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" value={form.description} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input id="amount" name="amount" type="number" min="1" value={form.amount} onChange={handleChange} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input id="sortOrder" name="sortOrder" type="number" min="0" value={form.sortOrder} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={val => setForm(prev => ({ ...prev, category: val }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isEdit && (
                <div className="flex items-center gap-2">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="size-4"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving…' : isEdit ? 'Update Offering' : 'Create Offering'}
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/offerings">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
