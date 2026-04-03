import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, PowerOff } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useApi } from '@/hooks/useApi';

const templeId = import.meta.env.VITE_TEMPLE_ID;

const CATEGORY_LABELS = {
  DAILY_RITUAL: 'Daily Ritual',
  FESTIVAL: 'Festival',
  ARCHANA: 'Archana',
  ANNADANAM: 'Annadanam',
  DONATION: 'Donation',
  SPECIAL_SEVA: 'Special Seva',
};

export default function Offerings() {
  const { request } = useApi();
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await request(`/offerings?templeId=${templeId}&includeInactive=true`);
      setOfferings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const deactivate = async (id) => {
    try {
      await request(`/offerings/${id}`, { method: 'DELETE' });
      setOfferings(prev => prev.map(o => o.id === id ? { ...o, isActive: false } : o));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Offerings</h1>
          <Button asChild>
            <Link to="/admin/offerings/new">
              <Plus className="size-4 mr-1" /> Add Offering
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : offerings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No offerings yet. Add one to get started.</p>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offerings.map(o => (
                    <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <span className="mr-2">{o.emoji}</span>
                        <span className="font-medium">{o.name}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {CATEGORY_LABELS[o.category] ?? o.category}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        ₹{Number(o.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={o.isActive ? 'default' : 'secondary'}>
                          {o.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/offerings/${o.id}/edit`}>
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          {o.isActive && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                  <PowerOff className="size-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Deactivate offering?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    "{o.name}" will be hidden from devotees. You can re-enable it by editing.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deactivate(o.id)}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                  >
                                    Deactivate
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
