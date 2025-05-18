
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';

const AdminRoute = () => {
  const { role } = useAppSelector((state) => state.auth);

  if (role !== 'admin') {
    // Redirect to dashboard if not an admin
    return <Navigate to="/dashboard" replace />;
  }

  // If admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;
