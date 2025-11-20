import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ClientSidebar } from './ClientSidebar';
import { VehicleAvailability } from './client/VehicleAvailability';
import { CreateHomeDeliveryReservation } from './client/CreateHomeDeliveryReservation';
import { ReservationHistory } from './client/ReservationHistory';
import { RequestDelivery } from './client/RequestDelivery';
import { MyDeliveries } from './client/MyDeliveries';
import { UserProfile } from './UserProfile';
import { 
  Calendar, 
  User, 
  LogOut, 
  MapPin,
  Clock,
  DollarSign,
  Star,
  History,
  CreditCard,
  Bike,
  Search,
  Home,
  Package
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();

  // Sections supported by routing
  const sections = new Set([
    'overview',
    'availability',
    'new-reservation',
    'history',
    'request-delivery',
    'my-deliveries',
    'profile',
  ]);

  const sectionToPath = (section: string) => {
    switch (section) {
      case 'availability':
        return '/availability';
      case 'new-reservation':
        return '/new-reservation';
      case 'history':
        return '/history';
      case 'request-delivery':
        return '/request-delivery';
      case 'my-deliveries':
        return '/my-deliveries';
      case 'profile':
        return '/profile';
      case 'overview':
      default:
        return '/dashboard';
    }
  };

  const pathToSection = (pathname: string): string => {
    // Support both new top-level paths and legacy /dashboard/<section>
    if (pathname === '/dashboard' || pathname === '/dashboard/') return 'overview';
    const legacyParts = pathname.split('/').filter(Boolean);
    const idx = legacyParts.indexOf('dashboard');
    if (idx >= 0) {
      const sec = legacyParts[idx + 1];
      if (sec && sections.has(sec)) return sec;
      return 'overview';
    }
    // New top-level mapping
    switch (pathname) {
      case '/availability':
        return 'availability';
      case '/new-reservation':
        return 'new-reservation';
      case '/history':
        return 'history';
      case '/request-delivery':
        return 'request-delivery';
      case '/my-deliveries':
        return 'my-deliveries';
      case '/profile':
        return 'profile';
      default:
        return 'overview';
    }
  };

  // Sync state from URL on navigation
  const hasSyncedRef = useRef(false);
  useEffect(() => {
    const normalized = pathToSection(location.pathname);
    if (normalized !== activeSection) setActiveSection(normalized);
    hasSyncedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Navegar solo cuando el usuario cambia sección explícitamente (desde la UI)
  // Evitamos empujar a /dashboard en montajes o navegación directa por URL
  // La función handleSectionChange se encarga de hacer navigate
  const [preselectedVehicle, setPreselectedVehicle] = useState<any>(null);

  const quickActions = [
    {
      id: 'availability',
      title: 'Ver Vehículos',
      description: 'Consultar disponibilidad',
      icon: Search,
      color: 'bg-blue-500',
      count: null
    },
    {
      id: 'new-reservation',
      title: 'Nueva Reserva',
      description: 'Reservar con entrega',
      icon: Home,
      color: 'bg-green-500',
      count: null
    },
    {
      id: 'request-delivery',
      title: 'Enviar Paquete',
      description: 'Solicitar domicilio',
      icon: Package,
      color: 'bg-purple-500',
      count: null
    },
    {
      id: 'history',
      title: 'Mis Reservas',
      description: 'Historial completo',
      icon: History,
      color: 'bg-orange-500',
      count: '3'
    }
  ];

  const accountStats = [
    { label: 'Reservas Activas', value: '3', icon: Calendar },
    { label: 'Domicilios en Curso', value: '1', icon: Package },
    { label: 'Gasto del Mes', value: '$180.000', icon: DollarSign },
    { label: 'Mi Calificación', value: '4.8/5', icon: Star }
  ];

  const activeReservations = [
    {
      id: 'RSV001',
      vehicle: 'Honda XR 150',
      type: 'Moto',
      branch: 'Sucursal Centro',
      startDate: '2025-01-24',
      endDate: '2025-01-25',
      status: 'Activa',
      amount: '$32.000'
    },
    {
      id: 'RSV002',
      vehicle: 'Trek E-Bike 500',
      type: 'Bicicleta eléctrica',
      branch: 'Sucursal Norte',
      startDate: '2025-01-26',
      endDate: '2025-01-26',
      status: 'Confirmada',
      amount: '$20.000'
    },
    {
      id: 'RSV003',
      vehicle: 'Xiaomi Mi Scooter Pro',
      type: 'Patineta eléctrica',
      branch: 'Sucursal Sur',
      startDate: '2025-01-28',
      endDate: '2025-01-28',
      status: 'Confirmada',
      amount: '$16.000'
    }
  ];

  const recentHistory = [
    {
      id: 'RSV-2024-089',
      vehicle: 'Rollerblade Spark 84',
      type: 'Patines de línea',
      date: '2025-01-20',
      duration: '4 hrs',
      amount: '$10.000',
      rating: 5
    },
    {
      id: 'RSV-2024-088',
      vehicle: 'Specialized Rockhopper',
      type: 'Bicicleta manual',
      date: '2025-01-18',
      duration: '6 hrs',
      amount: '$18.000',
      rating: 4
    }
  ];

  const formatCurrency = (amount: string) => {
    return amount;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activa':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Confirmada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleReserveFromAvailability = (vehicle: any) => {
    setPreselectedVehicle(vehicle);
    handleSectionChange('new-reservation');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'availability':
        return <VehicleAvailability onReserveVehicle={handleReserveFromAvailability} />;
      case 'new-reservation':
        return <CreateHomeDeliveryReservation preselectedVehicle={preselectedVehicle} onBack={() => setPreselectedVehicle(null)} />;
      case 'history':
        return <ReservationHistory />;
      case 'request-delivery':
        return <RequestDelivery />;
      case 'my-deliveries':
        return <MyDeliveries />;
      case 'profile':
        return <UserProfile />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold">¡Hola, {user?.firstName}!</h1>
          <p className="text-muted-foreground">
            Gestiona tus reservas y domicilios
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 w-fit mt-2 sm:mt-0">
          Cuenta Activa
        </Badge>
      </div>

      {/* Estadísticas de la cuenta */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {accountStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-bold">{stat.value}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Accesos Rápidos */}
      <div>
        <h2 className="font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSectionChange(action.id as string)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{action.title}</h3>
                        {action.count && (
                          <Badge variant="destructive" className="text-xs">{action.count}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
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

      {/* Reservas Activas y Próximas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Mis Reservas Activas</span>
                <Badge variant="destructive" className="ml-2">
                  {activeReservations.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Reservas confirmadas y próximas entregas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeReservations.map((reservation, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{reservation.vehicle}</h4>
                        <p className="text-xs text-muted-foreground">
                          {reservation.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary text-sm">{reservation.amount}</p>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${getStatusColor(reservation.status)}`}
                        >
                          {reservation.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{reservation.branch}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{reservation.startDate} - {reservation.endDate}</span>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSectionChange('history')}                >
                  Ver Todas las Reservas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Domicilios en Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">DOM-2024-089</span>
                    </div>
                    <Badge variant="default" className="text-xs">En camino</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Paquete a Calle 45 #23-67
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full"
                  onClick={() => handleSectionChange('my-deliveries')}                  >
                    Ver Tracking
                  </Button>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSectionChange('request-delivery')}                >
                  <Package className="h-4 w-4 mr-2" />
                  Nuevo Domicilio
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Última Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentHistory.slice(0, 2).map((item, index) => (
                  <div key={index} className="border-b border-border last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-medium">{item.vehicle}</h4>
                      <span className="text-xs font-medium text-primary">{item.amount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.date}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    navigate(sectionToPath(section));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-border shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClientSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="font-bold">MobiDelivery</h1>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Cliente
          </Badge>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ClientSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <main className="h-screen overflow-y-auto">
            <div className="p-4 lg:p-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
