import { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useApi } from '@/hooks/useApi';

const templeId = import.meta.env.VITE_TEMPLE_ID;

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="bg-card rounded-lg p-6" style={{ boxShadow: '0 10px 30px -10px rgba(28,25,23,0.08)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{title}</span>
        <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center">
          <Icon className="size-3.5 text-primary" />
        </div>
      </div>
      <div className="text-3xl font-semibold text-foreground tracking-tight">{value}</div>
      {description && <p className="text-xs text-muted-foreground mt-1.5">{description}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { request } = useApi();
  const [summary, setSummary] = useState(null);
  const [byOffering, setByOffering] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, b] = await Promise.all([
          request(`/reports/summary?templeId=${templeId}`),
          request(`/reports/by-offering?templeId=${templeId}`),
        ]);
        setSummary(s);
        setByOffering(b);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of temple activity</p>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Total Orders"
                value={summary?.totalOrders ?? 0}
                icon={ShoppingBag}
                description="Paid orders"
              />
              <StatCard
                title="Total Revenue"
                value={fmt(summary?.totalRevenue ?? 0)}
                icon={IndianRupee}
                description="From paid orders"
              />
              <StatCard
                title="Avg Order Value"
                value={fmt(summary?.avgOrderValue ?? 0)}
                icon={TrendingUp}
              />
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Revenue by Offering</h2>
              {byOffering.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              ) : (
                <div className="bg-card rounded-lg overflow-hidden" style={{ boxShadow: '0 10px 30px -10px rgba(28,25,23,0.08)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/60">
                        <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Offering</th>
                        <th className="text-right px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Orders</th>
                        <th className="text-right px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byOffering.map((row, i) => (
                        <tr key={row.offeringId} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                          <td className="px-5 py-3.5 font-medium">{row.offeringName}</td>
                          <td className="px-5 py-3.5 text-right text-muted-foreground font-mono text-xs">{row.count}</td>
                          <td className="px-5 py-3.5 text-right font-semibold">{fmt(row.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
