import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AdminSidebar } from './AdminSidebar';
import { GestionarUsuarios } from './users/GestionarUsuarios';
import { BranchesManagement } from './branches/BranchesManagement';
import { VehiclesManagement } from './vehicles/VehiclesManagement';
import { MaintenancesManagement } from './maintenance/MaintenancesManagement';
import { ReservationsManagement } from './reservations/ReservationsManagement';
import { TransportMapManagement } from './transport-map/TransportMapManagement';
import { DeliveriesManagement } from './deliveries/DeliveriesManagement';
import { RatesManagement } from './rates/RatesManagement';
import { UserProfile } from './UserProfile';
import { 
  Users, 
  MapPin, 
  Truck, 
  User, 
  LogOut, 
  BarChart3,
  Settings,
  Bell,
  Calendar,
  Package,
  DollarSign
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';

const sectionToPath = (section: string) => (section === 'dashboard' ? '/admin' : `/admin/${section}`);
const pathToSection = (pathname: string) => {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'admin') return 'dashboard';
  return parts[1] || 'dashboard';
};

export const AdminDashboard: React.FC = () => {
  const { user, logout, permissions } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => pathToSection(location.pathname));

  const idToModulo: Record<string, string> = {
    users: 'USUARIOS',
    branches: 'SUCURSALES',
    vehicles: 'TRANSPORTES',
    maintenance: 'MANTENIMIENTOS',
    'transport-map': 'MAPA_DE_TRANSPORTES',
    reservations: 'RESERVAS',
    deliveries: 'DOMICILIOS',
    rates: 'TARIFAS',
    profile: 'MI_PERFIL',
  };

  const canSee = (id: string) => {
    const modulo = idToModulo[id];
    if (!modulo) return true; // dashboard default visible
    return permissions[modulo]?.puedeVer ?? true; // por defecto visible si no llegó permiso
  };

  useEffect(() => {
    const current = pathToSection(location.pathname);
    setActiveSection((prev) => (prev === current ? prev : current));
  }, [location.pathname]);

  const quickActions = [
    {
      id: 'users',
      title: 'Usuarios',
      description: 'Gestionar usuarios del sistema',
      icon: Users,
      color: 'bg-blue-500',
      count: '127'
    },
    {
      id: 'branches',
      title: 'Sucursales',
      description: 'Administrar sucursales',
      icon: MapPin,
      color: 'bg-green-500',
      count: '4'
    },
    {
      id: 'vehicles',
      title: 'Vehículos',
      description: 'Gestionar flota de vehículos',
      icon: Truck,
      color: 'bg-purple-500',
      count: '89'
    },
    {
      id: 'reservations',
      title: 'Reservas',
      description: 'Administrar reservas',
      icon: Calendar,
      color: 'bg-indigo-500',
      count: '24'
    },
    {
      id: 'deliveries',
      title: 'Domicilios',
      description: 'Gestionar domicilios',
      icon: Package,
      color: 'bg-orange-500',
      count: '18'
    },
    {
      id: 'maintenance',
      title: 'Mantenimientos',
      description: 'Control de mantenimientos',
      icon: Settings,
      color: 'bg-red-500',
      count: '5'
    }
  ];

  const stats = [
    { label: 'Total Usuarios', value: '127', change: '+12', icon: Users },
    { label: 'Vehículos Activos', value: '89', change: '+5', icon: Truck },
    { label: 'Reservas Activas', value: '24', change: '+8', icon: Calendar },
    { label: 'Domicilios Hoy', value: '18', change: '+3', icon: Package }
  ];

  const renderMainContent = () => {
    switch (activeSection) {
      case 'users':
        return <GestionarUsuarios />;
      case 'branches':
        return <BranchesManagement />;
      case 'vehicles':
        return <VehiclesManagement />;
      case 'maintenance':
        return <MaintenancesManagement />;
      case 'transport-map':
        return <TransportMapManagement />;
      case 'reservations':
        return <ReservationsManagement />;
      case 'deliveries':
        return <DeliveriesManagement />;
      case 'rates':
        return <RatesManagement />;
      case 'profile':
        return <UserProfile />;
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Resumen general del sistema y accesos rápidos a módulos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold">{stat.value}</p>
                      <span className="text-sm text-green-600 font-medium">
                        +{stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-semibold mb-6">Gestión del Sistema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.filter(a => canSee(a.id)).map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSectionChange(action.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{action.title}</h3>
                        {action.count && (
                          <Badge variant="outline" className="ml-2">{action.count}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Alertas Importantes</span>
            </CardTitle>
            <CardDescription>
              Notificaciones que requieren atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '10:30 AM', alert: 'SOAT próximo a vencer: Honda CB 190 (XYZ789)', type: 'warning' },
                { time: '10:25 AM', alert: 'Tecnomecánica próxima a vencer: Honda CB 190', type: 'warning' },
                { time: '09:45 AM', alert: 'Nueva solicitud de domiciliario', type: 'info' },
                { time: '09:15 AM', alert: 'Reserva cancelada por cliente', type: 'neutral' },
                { time: '08:30 AM', alert: 'Mantenimiento pendiente: 3 vehículos', type: 'warning' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start justify-between py-2 border-b border-border last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.alert}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Badge 
                    variant={activity.type === 'warning' ? 'destructive' : activity.type === 'info' ? 'default' : 'secondary'}
                    className="text-xs ml-2"
                  >
                    {activity.type === 'warning' ? 'Urgente' : activity.type === 'info' ? 'Nuevo' : 'Info'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Resumen del Día</span>
            </CardTitle>
            <CardDescription>
              Actividad operacional de hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Nuevas reservas', value: '8', color: 'text-blue-600' },
                { label: 'Domicilios completados', value: '18', color: 'text-green-600' },
                { label: 'Vehículos disponibles', value: '78', color: 'text-purple-600' },
                { label: 'Domiciliarios activos', value: '12', color: 'text-orange-600' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const handleSectionChange = (section: string) => {
    if (section === activeSection) return;
    navigate(sectionToPath(section));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-border shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AdminSidebar 
              activeSection={activeSection} 
              onSectionChange={handleSectionChange}
            />
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="font-bold">MobiAdmin</h1>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Admin
          </Badge>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <main className="h-screen overflow-y-auto">
            <div className="p-4 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {renderMainContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
