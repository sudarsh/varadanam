import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';

// Admin pages
import Login from './admin/Login.jsx';
import Dashboard from './admin/Dashboard.jsx';
import Offerings from './admin/Offerings.jsx';
import AddEditOffering from './admin/AddEditOffering.jsx';
import Orders from './admin/Orders.jsx';

// User pages
import Home from './user/Home.jsx';
import Checkout from './user/Checkout.jsx';
import Receipt from './user/Receipt.jsx';

function AdminGuard({ children }) {
  const { token, isAdmin } = useAuth();
  if (!token || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public / devotee routes */}
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/receipt/:orderId" element={<Receipt />} />

      {/* Auth */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminGuard><Dashboard /></AdminGuard>} />
      <Route path="/admin/offerings" element={<AdminGuard><Offerings /></AdminGuard>} />
      <Route path="/admin/offerings/new" element={<AdminGuard><AddEditOffering /></AdminGuard>} />
      <Route path="/admin/offerings/:id/edit" element={<AdminGuard><AddEditOffering /></AdminGuard>} />
      <Route path="/admin/orders" element={<AdminGuard><Orders /></AdminGuard>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  );
}
