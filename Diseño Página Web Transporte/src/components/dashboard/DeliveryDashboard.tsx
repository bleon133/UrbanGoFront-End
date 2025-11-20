import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { DeliverySidebar } from './DeliverySidebar';
import { AvailableDeliveries } from './delivery/AvailableDeliveries';
import { ActiveDeliveries } from './delivery/ActiveDeliveries';
import { VehicleDeliveries } from './delivery/VehicleDeliveries';
import { RatingsManagement } from './delivery/RatingsManagement';
import { UserProfile } from './UserProfile';
import { 
  Package, 
  User, 
  MapPin,
  Clock,
  Star,
  Navigation,
  Phone,
  Activity,
  Menu,
  Truck,
  AlertCircle
} from 'lucide-react';

export const DeliveryDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [hasActiveDelivery, setHasActiveDelivery] = useState(true); // Mock: domiciliario tiene domicilio activo
  const [isAvailable, setIsAvailable] = useState(true); // Estado de disponibilidad laboral

  const handleAcceptDelivery = (deliveryId: string) => {
    console.log('Domicilio aceptado:', deliveryId);
    setHasActiveDelivery(true);
    setActiveSection('active'); // Redirigir a la vista de domicilio activo
  };

  const renderDashboardContent = () => {
    const todayStats = [
      { label: 'Completados Hoy', value: '8', icon: Package },
      { label: 'En Curso', value: '2', icon: Navigation },
      { label: 'Mi Calificación', value: '4.9/5', icon: Star },
      { label: 'Tiempo Activo', value: '6.5 hrs', icon: Clock }
    ];

    const quickActions = [
      {
        title: 'Solicitudes',
        description: 'Domicilios disponibles',
        icon: Package,
        color: 'bg-blue-500',
        count: hasActiveDelivery ? null : '5',
        onClick: () => setActiveSection('available')
      },
      {
        title: 'Mis Entregas',
        description: 'Domicilios activos',
        icon: Navigation,
        color: 'bg-green-500',
        count: hasActiveDelivery ? '2' : null,
        onClick: () => setActiveSection('active')
      },
      {
        title: 'Entregas Vehículos',
        description: 'Domicilios en furgoneta',
        icon: Truck,
        color: 'bg-purple-500',
        count: '1',
        onClick: () => setActiveSection('vehicle-deliveries')
      }
    ];

    const activeDeliveries = [
      {
        id: 'DOM-001',
        customer: 'Ana Rodríguez',
        address: 'Calle 45 #23-67, Cabecera',
        type: 'Paquete',
        amount: '$15.000',
        status: 'En camino'
      },
      {
        id: 'VEH-002',
        customer: 'Carlos Méndez',
        address: 'Carrera 27 #156-23, Cañaveral',
        type: 'Entrega de vehículo',
        amount: '$22.500',
        status: 'Programado'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Header del Dashboard */}
        <div>
          <h1 className="font-bold">Panel de Domiciliario</h1>
          <p className="text-muted-foreground">
            Resumen de tu actividad y entregas en curso
          </p>
        </div>

        {/* Control de Disponibilidad Laboral - PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`border-2 shadow-lg ${isAvailable ? 'border-green-500 bg-green-50/50' : 'border-orange-500 bg-orange-50/50'}`}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className={`p-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-orange-500'}`}
                    animate={isAvailable ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Clock className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="font-bold text-lg">Disponibilidad Laboral</h2>
                    <p className="text-sm text-muted-foreground">
                      {isAvailable ? 'Estás recibiendo solicitudes de domicilios' : 'Activa tu disponibilidad para recibir solicitudes'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right mr-2">
                    <p className={`font-bold text-base ${isAvailable ? 'text-green-700' : 'text-orange-700'}`}>
                      {isAvailable ? 'DISPONIBLE' : 'NO DISPONIBLE'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAvailable ? 'En línea' : 'Fuera de línea'}
                    </p>
                  </div>
                  <Switch
                    id="availability-main"
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>
              {!isAvailable && (
                <motion.div 
                  className="mt-4 p-3 bg-white border-2 border-orange-300 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-orange-900">Modo Descanso Activado</p>
                      <p className="text-sm text-orange-800 mt-1">
                        No recibirás notificaciones de nuevas solicitudes. Activa el switch cuando estés listo para trabajar.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats del día */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {todayStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <p className="font-bold text-sm">{stat.value}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={action.onClick}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">{action.title}</h3>
                          {action.count && (
                            <Badge variant="destructive" className="text-xs ml-2">
                              {action.count}
                            </Badge>
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

        {/* Mis Entregas Activas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Navigation className="h-5 w-5" />
                  <span>Mis Entregas Activas</span>
                  <Badge variant="destructive" className="ml-2">
                    {activeDeliveries.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Domicilios en curso y programados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeDeliveries.map((delivery, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{delivery.customer}</h4>
                          <p className="text-xs text-muted-foreground">
                            #{delivery.id} • {delivery.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary text-sm">{delivery.amount}</p>
                          <Badge 
                            variant={delivery.status === 'En camino' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {delivery.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />
                        <span>{delivery.address}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Navigation className="h-4 w-4 mr-2" />
                          Navegar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {!hasActiveDelivery && (
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => setActiveSection('available')}
                    >
                      Ver Solicitudes Disponibles
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Estado Actual</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estado:</span>
                    <Badge variant="secondary" className={isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                      {isAvailable ? 'En línea' : 'Fuera de línea'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Zona actual:</span>
                    <span className="text-sm text-muted-foreground">Cabecera</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Último pedido:</span>
                    <span className="text-sm text-muted-foreground">Hace 12 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumen Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Domicilios</span>
                    <span className="font-bold text-primary">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completados</span>
                    <span className="font-bold text-green-600">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Calificación</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold">4.8/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Horas trabajadas</span>
                    <span className="font-bold">42h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mis Calificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveSection('ratings')}
                >
                  Ver Calificaciones Recibidas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'available':
        return <AvailableDeliveries hasActiveDelivery={hasActiveDelivery} onAcceptDelivery={handleAcceptDelivery} isAvailable={isAvailable} />;
      case 'active':
        return <ActiveDeliveries />;
      case 'vehicle-deliveries':
        return <VehicleDeliveries isAvailable={isAvailable} />;
      case 'ratings':
        return <RatingsManagement />;
      case 'profile':
        return <UserProfile />;
      case 'dashboard':
      default:
        return renderDashboardContent();
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-border shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DeliverySidebar 
              activeSection={activeSection} 
              setActiveSection={handleSectionChange}
            />
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="font-bold">MobiDelivery</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAvailable && (
              <motion.div
                className="h-2 w-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            <Badge 
              variant="secondary" 
              className={isAvailable ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}
            >
              {isAvailable ? 'Disponible' : 'No disponible'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <DeliverySidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
          />
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