import { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, TrendingUp, Layers } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/hooks/useApi';

const templeId = import.meta.env.VITE_TEMPLE_ID;

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
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
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        {loading ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <h2 className="text-lg font-medium mb-3">Revenue by Offering</h2>
              {byOffering.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Offering</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Orders</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byOffering.map(row => (
                          <tr key={row.offeringId} className="border-b last:border-0">
                            <td className="px-4 py-3 flex items-center gap-2">
                              <Layers className="size-3.5 text-muted-foreground" />
                              {row.offeringName}
                            </td>
                            <td className="px-4 py-3 text-right">{row.count}</td>
                            <td className="px-4 py-3 text-right font-medium">{fmt(row.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
