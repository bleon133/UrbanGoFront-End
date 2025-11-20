import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation() as any;
  const from: string | undefined = location?.state?.from;

  useEffect(() => {
    if (user) navigate(from || '/dashboard', { replace: true });
  }, [user, navigate, from]);
  return (
    <LoginForm
      onForgotPassword={() => navigate('/forgot-password')}
      onRegister={() => navigate('/register')}
      onBackToHome={() => navigate('/')}
    />
  );
};
