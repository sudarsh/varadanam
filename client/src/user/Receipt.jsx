import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Receipt() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`)
      .then(r => r.json())
      .then(setOrder)
      .catch(console.error);
  }, [orderId]);

  if (!order) return <p>Loading receipt...</p>;

  return (
    <div>
      <h1>Booking Confirmed</h1>
      <p>Order ID: {order._id}</p>
      <p>Offering: {order.offeringSnapshot?.name}</p>
      <p>Amount: ₹{order.totalAmount}</p>
      <p>Devotee: {order.devotee?.name}</p>
      <p>Status: {order.status}</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
