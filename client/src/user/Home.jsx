import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [offerings, setOfferings] = useState([]);
  const navigate = useNavigate();
  const templeId = import.meta.env.VITE_TEMPLE_ID;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/offerings?templeId=${templeId}`)
      .then(r => r.json())
      .then(setOfferings)
      .catch(console.error);
  }, [templeId]);

  return (
    <div>
      <h1>Welcome to the Temple</h1>
      <h2>Available Offerings</h2>
      <ul>
        {offerings.map(o => (
          <li key={o._id}>
            <strong>{o.name}</strong> — ₹{o.amount}
            <p>{o.description}</p>
            <button onClick={() => navigate('/checkout', { state: { offering: o } })}>
              Book Now
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
