import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({
    children,
    allowedRoles
}: {
    children: React.ReactNode;
    allowedRoles?: string[]
}) {
    const { role } = useAuth();

    // 1. Not logged in at all? Go to login.
    if (!role) {
        return <Navigate to="/login" replace />;
    }

    // 2. Logged in, but trying to access a route restricted to certain roles?
    if (allowedRoles && !allowedRoles.includes(role)) {
        // Send them to the default employee page instead of login
        return <Navigate to="/employees" replace />;
    }

    // 3. Authorized! Render the page.
    return <>{children}</>;
}