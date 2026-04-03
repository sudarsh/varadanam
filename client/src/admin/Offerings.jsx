import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, PowerOff } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
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
      <div className="space-y-8 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Offerings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage temple seva offerings</p>
          </div>
          <Button asChild className="rounded-md gap-1.5">
            <Link to="/admin/offerings/new">
              <Plus className="size-3.5" /> Add Offering
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : offerings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No offerings yet. Add one to get started.</p>
        ) : (
          <div className="bg-card rounded-lg overflow-hidden" style={{ boxShadow: '0 10px 30px -10px rgba(28,25,23,0.08)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Category</th>
                  <th className="text-right px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Amount</th>
                  <th className="text-center px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {offerings.map((o, i) => (
                  <tr key={o.id} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                    <td className="px-5 py-3.5">
                      <span className="mr-2">{o.emoji}</span>
                      <span className="font-medium">{o.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs uppercase tracking-wide">
                      {CATEGORY_LABELS[o.category] ?? o.category}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold">
                      ₹{Number(o.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        o.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {o.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="size-8 rounded-md">
                          <Link to={`/admin/offerings/${o.id}/edit`}>
                            <Pencil className="size-3.5" />
                          </Link>
                        </Button>
                        {o.isActive && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8 rounded-md text-destructive hover:text-destructive hover:bg-destructive/10">
                                <PowerOff className="size-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="backdrop-blur-xl bg-popover/90">
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
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
