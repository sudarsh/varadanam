import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EMPTY_DEVOTEE = { name: '', email: '', phone: '', nakshatram: '', gotram: '' };

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const offering = state?.offering;
  const [devotee, setDevotee] = useState(EMPTY_DEVOTEE);
  const [loading, setLoading] = useState(false);

  if (!offering) {
    navigate('/');
    return null;
  }

  const handleChange = e => setDevotee(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offering: offering._id, devotee }),
      });
      const order = await res.json();
      navigate(`/receipt/${order._id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <p>
        {offering.name} — ₹{offering.amount}
      </p>
      <form onSubmit={handleSubmit}>
        {['name', 'email', 'phone', 'nakshatram', 'gotram'].map(field => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
            <input
              name={field}
              value={devotee[field]}
              onChange={handleChange}
              required={field === 'name'}
            />
          </label>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Placing order...' : 'Confirm'}
        </button>
      </form>
    </div>
  );
}
