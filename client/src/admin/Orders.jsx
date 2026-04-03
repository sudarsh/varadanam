import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApi } from '@/hooks/useApi';

const templeId = import.meta.env.VITE_TEMPLE_ID;

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'CREATED', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REFUNDED', label: 'Refunded' },
];

const STATUS_VARIANT = {
  CREATED: 'secondary',
  PAID: 'default',
  FAILED: 'destructive',
  REFUNDED: 'outline',
};

const STATUS_LABEL = {
  CREATED: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

function fmt(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function fmtDate(s) {
  return new Date(s).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function OrderDetailDialog({ order, open, onClose }) {
  if (!order) return null;
  const rows = [
    ['Order ID', order.id],
    ['Offering', order.offering?.name],
    ['Amount', fmt(order.amount)],
    ['Status', STATUS_LABEL[order.status] ?? order.status],
    ['Payment Method', order.paymentMethod ?? '—'],
    ['Devotee Name', order.devoteeName ?? '—'],
    ['Nakshatra', order.nakshatra ?? '—'],
    ['Gothram', order.gothram ?? '—'],
    ['Guest Email', order.guestEmail ?? '—'],
    ['Guest Mobile', order.guestMobile ?? '—'],
    ['Special Instructions', order.specialInstructions ?? '—'],
    ['Razorpay Order ID', order.razorpayOrderId ?? '—'],
    ['Razorpay Payment ID', order.razorpayPaymentId ?? '—'],
    ['Receipt Sent', order.receiptSent ? 'Yes' : 'No'],
    ['Created At', fmtDate(order.createdAt)],
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-2">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground font-medium">{label}</dt>
              <dd className="break-all">{value}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}

export default function Orders() {
  const { request } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);

  const load = async (status) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ templeId });
      if (status && status !== 'ALL') qs.set('status', status);
      const data = await request(`/orders?${qs}`);
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(statusFilter); }, [statusFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders found.</p>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Devotee</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Offering</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {fmtDate(o.createdAt)}
                      </td>
                      <td className="px-4 py-3">{o.devoteeName || o.guestName || '—'}</td>
                      <td className="px-4 py-3">{o.offering?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-right font-medium">{fmt(o.amount)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={STATUS_VARIANT[o.status] ?? 'secondary'}>
                          {STATUS_LABEL[o.status] ?? o.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelected(o)}
                        >
                          <Eye className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>

      <OrderDetailDialog
        order={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </AdminLayout>
  );
}
