import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Checkout from './pages/Checkout.jsx';
import Receipt from './pages/Receipt.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/receipt/:orderId" element={<Receipt />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
