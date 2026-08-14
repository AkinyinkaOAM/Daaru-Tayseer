import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ roles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    if (user?.role === 'student') {
      return <Navigate to="/student/portal" replace />;
    }
    if (user?.role === 'parent') {
      return <Navigate to="/parent/portal" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

