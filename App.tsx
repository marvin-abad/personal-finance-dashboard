import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './hooks/useAuthStore';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import { Spinner } from './components/ui/Spinner';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};


const App: React.FC = () => {
    const { checkAuthStatus } = useAuthStore();

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <HashRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/budget" element={<Budget />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </HashRouter>
        </>
    );
};

export default App;