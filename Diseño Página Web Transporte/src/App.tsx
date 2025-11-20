import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Dashboard } from './components/dashboard/Dashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
          {/* Client top-level shortcuts */}
          <Route path="/availability" element={<ClientDashboard />} />
          <Route path="/new-reservation" element={<ClientDashboard />} />
          <Route path="/history" element={<ClientDashboard />} />
          <Route path="/request-delivery" element={<ClientDashboard />} />
          <Route path="/my-deliveries" element={<ClientDashboard />} />
          <Route path="/profile" element={<ClientDashboard />} />
          {/* Admin top-level */}
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
