import { Navigate, useLocation } from 'react-router-dom';
import { useRole, UserRole } from '@/contexts/RoleContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { role, user } = useRole();
    const location = useLocation();

    if (!role || !user) {
       
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
       
        return <Navigate to={`/dashboard/${role}`} replace />;
    }

    return <>{children}</>;
}
