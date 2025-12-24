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
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to authorized dashboard if role doesn't match
        // e.g. Patient trying to access /dashboard/doctor
        return <Navigate to={`/dashboard/${role}`} replace />;
    }

    return <>{children}</>;
}
