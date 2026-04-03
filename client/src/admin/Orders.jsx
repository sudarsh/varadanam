import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
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

const STATUS_STYLE = {
  CREATED: 'bg-amber-50 text-amber-700',
  PAID: 'bg-green-50 text-green-700',
  FAILED: 'bg-red-50 text-red-700',
  REFUNDED: 'bg-muted text-muted-foreground',
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
    ['Receipt Sent', order.receiptSent ? 'Yes' : 'No'],
    ['Created At', fmtDate(order.createdAt)],
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md backdrop-blur-xl bg-popover/90" style={{ boxShadow: '0 10px 30px -10px rgba(28,25,23,0.12)' }}>
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Order Details</DialogTitle>
          <p className="font-mono text-xs text-muted-foreground pt-1">{order.id}</p>
        </DialogHeader>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mt-2">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground text-xs uppercase tracking-wide font-medium">{label}</dt>
              <dd className="break-all text-sm">{value}</dd>
            </div>
          ))}
        </dl>
        {order.razorpayPaymentId && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1.5">Razorpay Payment ID</p>
            <p className="font-mono text-xs text-foreground">{order.razorpayPaymentId}</p>
          </div>
        )}
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
      <div className="space-y-8 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
            <p className="text-sm text-muted-foreground mt-1">Track devotee seva bookings</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 rounded-md bg-card border-border/60 text-sm">
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
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders found.</p>
        ) : (
          <div className="bg-card rounded-lg overflow-hidden" style={{ boxShadow: '0 10px 30px -10px rgba(28,25,23,0.08)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Devotee</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Offering</th>
                  <th className="text-right px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Amount</th>
                  <th className="text-center px-5 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                      {fmtDate(o.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 font-medium">{o.devoteeName || o.guestName || '—'}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{o.offering?.name ?? '—'}</td>
                    <td className="px-5 py-3.5 text-right font-semibold">{fmt(o.amount)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLE[o.status] ?? 'bg-muted text-muted-foreground'}`}>
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-md"
                        onClick={() => setSelected(o)}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
