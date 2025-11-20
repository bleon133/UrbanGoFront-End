import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { 
  Navigation, 
  MapPin,
  Clock,
  Fuel,
  Route,
  Zap,
  Map,
  Settings,
  Phone,
  MessageSquare,
  Car,
  Timer,
  Target,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

// Mock data para rutas y domicilios activos
const activeDelivery = {
  id: 'DOM-001',
  customer: {
    name: 'Ana Rodríguez',
    phone: '+57 300 123 4567',
    instructions: 'Apartamento 501, torre B. Timbre funciona.'
  },
  pickup: {
    name: 'Restaurante El Buen Sabor',
    address: 'Carrera 27 #34-12, Centro',
    phone: '+57 310 987 6543',
    coordinates: { lat: 7.1193, lng: -73.1227 }
  },
  destination: {
    address: 'Calle 45 #23-67, Cabecera',
    coordinates: { lat: 7.1235, lng: -73.1198 }
  },
  route: {
    distance: '3.2 km',
    estimatedTime: '12 min',
    remainingTime: '8 min',
    traffic: 'moderate',
    progress: 65 // Porcentaje completado
  },
  order: {
    items: ['Pizza Margherita', 'Coca Cola 500ml'],
    total: '$32.500',
    paymentMethod: 'Efectivo'
  },
  status: 'en_camino' // recogido, en_camino, entregado
};

const activeRoutes = [
  {
    id: 'R001',
    name: 'Ruta Centro-Cabecera',
    status: 'active',
    startPoint: 'Restaurante El Buen Sabor',
    endPoint: 'Calle 45 #23-67, Cabecera',
    distance: '3.2 km',
    estimatedTime: '12 min',
    traffic: 'moderate',
    deliveries: 2
  },
  {
    id: 'R002',
    name: 'Ruta Chapinero-Cañaveral',
    status: 'planned',
    startPoint: 'Pizza Express',
    endPoint: 'Carrera 35 #67-89, Cañaveral',
    distance: '4.1 km',
    estimatedTime: '15 min',
    traffic: 'light',
    deliveries: 1
  }
];

const routeHistory = [
  {
    id: 'H001',
    date: '2025-01-24',
    name: 'Ruta Matutina',
    deliveries: 6,
    totalDistance: '18.5 km',
    totalTime: '2h 15min',
    efficiency: 92
  },
  {
    id: 'H002',
    date: '2025-01-23',
    name: 'Ruta Vespertina',
    deliveries: 8,
    totalDistance: '22.3 km',
    totalTime: '2h 45min',
    efficiency: 88
  }
];

const optimizationTips = [
  {
    title: 'Agrupa entregas por zona',
    description: 'Optimiza tu ruta agrupando múltiples entregas en la misma área',
    impact: 'high',
    icon: MapPin
  },
  {
    title: 'Evita horas pico',
    description: 'Planifica entregas fuera de las 7-9 AM y 5-7 PM cuando sea posible',
    impact: 'medium',
    icon: Clock
  },
  {
    title: 'Usa rutas alternativas',
    description: 'Conoce múltiples caminos para evitar el tráfico pesado',
    impact: 'medium',
    icon: Route
  }
];

export const RoutesManagement: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(true); // Simular navegación activa
  const [currentPosition, setCurrentPosition] = useState({ lat: 7.1210, lng: -73.1215 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simular actualización de posición en tiempo real
  useEffect(() => {
    if (isNavigating) {
      const interval = setInterval(() => {
        setCurrentPosition(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.0001,
          lng: prev.lng + (Math.random() - 0.5) * 0.0001
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isNavigating]);

  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case 'light':
        return 'bg-green-100 text-green-700';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700';
      case 'heavy':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrafficLabel = (traffic: string) => {
    switch (traffic) {
      case 'light':
        return 'Fluido';
      case 'moderate':
        return 'Moderado';
      case 'heavy':
        return 'Pesado';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'planned':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'En curso';
      case 'planned':
        return 'Planificada';
      case 'completed':
        return 'Completada';
      default:
        return 'Desconocido';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleRefreshLocation = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const calculateDistance = (pos1: any, pos2: any) => {
    // Fórmula simplificada para calcular distancia
    const dx = pos1.lat - pos2.lat;
    const dy = pos1.lng - pos2.lng;
    return Math.sqrt(dx * dx + dy * dy) * 111; // Aproximación en km
  };

  const distanceToDestination = calculateDistance(currentPosition, activeDelivery.destination.coordinates);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="font-bold">Navegación y Rutas</h1>
          <p className="text-muted-foreground">
            {isNavigating ? 'Navegación activa - Domicilio en curso' : 'Optimiza tus rutas de entrega y mejora tu eficiencia'}
          </p>
        </div>
        {isNavigating && (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Navegando
          </Badge>
        )}
      </div>

      {/* Domicilio Activo con Mapa de Navegación */}
      {isNavigating && activeDelivery && (
        <Card className="border-green-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="h-5 w-5 text-green-600" />
                <span>Domicilio en Curso</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {activeDelivery.status === 'en_camino' && 'En camino'}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRefreshLocation}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mapa de Navegación */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-80 lg:h-96 relative overflow-hidden border">
                  {/* Simulación del mapa */}
                  <div className="absolute inset-0 p-4">
                    {/* Punto de recogida */}
                    <div 
                      className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
                      style={{ left: '20%', top: '70%' }}
                      title="Punto de recogida"
                    >
                      <div className="absolute -inset-2 border-2 border-blue-300 rounded-full animate-ping"></div>
                    </div>
                    
                    {/* Posición actual */}
                    <div 
                      className="absolute w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg z-10"
                      style={{ left: '45%', top: '50%' }}
                      title="Tu ubicación actual"
                    >
                      <div className="absolute -inset-2 border-2 border-green-300 rounded-full animate-ping"></div>
                    </div>
                    
                    {/* Destino */}
                    <div 
                      className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
                      style={{ left: '75%', top: '25%' }}
                      title="Destino"
                    >
                      <div className="absolute -inset-2 border-2 border-red-300 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Ruta trazada */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path
                        d="M 20% 70% Q 45% 50% 75% 25%"
                        stroke="#059669"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        fill="none"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>
                  
                  {/* Indicadores del mapa */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <p className="font-medium mb-2">Navegación GPS</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Recogida</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Mi ubicación</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Destino</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Información de navegación */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Siguiente giro</p>
                        <p className="text-sm text-muted-foreground">Gira a la derecha en Carrera 33</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{activeDelivery.route.remainingTime}</p>
                        <p className="text-sm text-muted-foreground">{distanceToDestination.toFixed(1)} km</p>
                      </div>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progreso</span>
                        <span>{activeDelivery.route.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${activeDelivery.route.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Panel de información del domicilio */}
              <div className="space-y-4">
                {/* Información del cliente */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Cliente</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{activeDelivery.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{activeDelivery.destination.address}</p>
                    </div>
                    
                    {activeDelivery.customer.instructions && (
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700 font-medium mb-1">Instrucciones:</p>
                        <p className="text-xs text-blue-600">{activeDelivery.customer.instructions}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Información del pedido */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Detalles del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      {activeDelivery.order.items.map((item, index) => (
                        <p key={index} className="text-sm">{item}</p>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total:</span>
                      <span className="font-medium">{activeDelivery.order.total}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pago:</span>
                      <span className="text-sm">{activeDelivery.order.paymentMethod}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tiempos estimados */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2">
                      <Timer className="h-4 w-4" />
                      <span>Tiempos</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tiempo restante:</span>
                      <span className="font-medium text-green-600">{activeDelivery.route.remainingTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Distancia:</span>
                      <span className="font-medium">{distanceToDestination.toFixed(1)} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tráfico:</span>
                      <Badge className={getTrafficColor(activeDelivery.route.traffic)}>
                        {getTrafficLabel(activeDelivery.route.traffic)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Acciones rápidas */}
                <div className="space-y-2">
                  <Button className="w-full" onClick={() => setIsNavigating(false)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Entregado
                  </Button>
                  <Button variant="outline" className="w-full">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Reportar Problema
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rutas planificadas y otras funcionalidades */}
      {!isNavigating && (
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="h-5 w-5" />
            <span>Rutas Activas</span>
          </CardTitle>
          <CardDescription>
            Rutas actualmente en progreso o planificadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeRoutes.map((route) => (
              <div 
                key={route.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedRoute === route.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => setSelectedRoute(route.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{route.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {route.deliveries} entrega{route.deliveries !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTrafficColor(route.traffic)}>
                      {getTrafficLabel(route.traffic)}
                    </Badge>
                    <Badge className={getStatusColor(route.status)}>
                      {getStatusLabel(route.status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">Desde:</span>
                      <span>{route.startPoint}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span className="text-muted-foreground">Hasta:</span>
                      <span>{route.endPoint}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Distancia</p>
                      <p className="font-medium">{route.distance}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tiempo estimado</p>
                      <p className="font-medium">{route.estimatedTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {route.status === 'active' && (
                    <>
                      <Button size="sm" className="flex-1">
                        <Navigation className="h-4 w-4 mr-2" />
                        Ver en Mapa
                      </Button>
                      <Button size="sm" variant="outline">
                        <Zap className="h-4 w-4 mr-2" />
                        Optimizar
                      </Button>
                    </>
                  )}
                  
                  {route.status === 'planned' && (
                    <>
                      <Button size="sm" className="flex-1">
                        Iniciar Ruta
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Historial y estadísticas */}
      {!isNavigating && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Historial de Rutas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routeHistory.map((route) => (
                <div key={route.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{route.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {route.date}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Entregas</p>
                      <p className="font-medium">{route.deliveries}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Distancia</p>
                      <p className="font-medium">{route.totalDistance}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tiempo</p>
                      <p className="font-medium">{route.totalTime}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Eficiencia</p>
                      <p className={`font-medium ${route.efficiency >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {route.efficiency}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Consejos de Optimización</span>
            </CardTitle>
            <CardDescription>
              Mejora tu eficiencia con estos consejos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimizationTips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{tip.title}</h4>
                          <Badge className={`text-xs ${getImpactColor(tip.impact)}`}>
                            {tip.impact === 'high' ? 'Alto impacto' : 
                             tip.impact === 'medium' ? 'Impacto medio' : 'Bajo impacto'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Acciones rápidas */}
      {!isNavigating && (
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col space-y-2">
              <Map className="h-6 w-6" />
              <span>Ver Mapa General</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex flex-col space-y-2">
              <Route className="h-6 w-6" />
              <span>Planificar Nueva Ruta</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex flex-col space-y-2">
              <Fuel className="h-6 w-6" />
              <span>Calcular Combustible</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Panel de acceso rápido para navegación */}
      {isNavigating && (
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col space-y-2">
                <Phone className="h-6 w-6" />
                <span>Llamar Cliente</span>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 flex flex-col space-y-2">
                <Navigation className="h-6 w-6" />
                <span>Recalcular Ruta</span>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 flex flex-col space-y-2">
                <AlertCircle className="h-6 w-6" />
                <span>Reportar Problema</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};