import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/guards/ProtectedRoute';
import PublicOnlyRoute from '@/components/auth/guards/PublicOnlyRoute';
import AppLayout from '@/layouts/AppLayout';
import BoardPage from '@/pages/BoardPage';
import DashboardPage from '@/pages/DashboardPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import LogoutPage from '@/pages/LogoutPage';
import NotFoundPage from '@/pages/NotFoundPage';
import RegisterPage from '@/pages/RegisterPage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />

                <Route element={<PublicOnlyRoute />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="board/:roomId" element={<BoardPage />} />
                    <Route path="board" element={<Navigate replace to="/board/default-room" />} />
                    <Route path="logout" element={<LogoutPage />} />
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
