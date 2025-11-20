import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { DeliveryDashboard } from './DeliveryDashboard';
import { ClientDashboard } from './ClientDashboard';
import { MaintenanceDashboard } from './MaintenanceDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.userType) {
      case 'admin':
        return <AdminDashboard />;
      case 'delivery':
        return <DeliveryDashboard />;
      case 'client':
        return <ClientDashboard />;
      case 'maintenance':
        return <MaintenanceDashboard />;
      default:
        return <div>Tipo de usuario no reconocido</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderDashboard()}
    </div>
  );
};