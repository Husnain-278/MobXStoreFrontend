import { Navigate } from 'react-router-dom';
import Spinner from './Spinner';
import { useAuth } from '../hooks/useAuth';

// Protected route component
export default function ProtectedRoute({ children }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
