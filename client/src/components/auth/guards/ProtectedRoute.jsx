import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

export default function ProtectedRoute({ children }) {
    const location = useLocation();
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink/70">
                Checking your session...
            </div>
        );
    }

    if (!isAuthenticated) {
        const from = `${location.pathname}${location.search}`;

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from,
                    authError: 'Please sign in to access this page.',
                }}
            />
        );
    }

    return children ?? <Outlet />;
}
