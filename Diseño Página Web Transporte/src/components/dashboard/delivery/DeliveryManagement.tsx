import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Package, 
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  Navigation,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Mock data para domicilios
const mockDeliveries = [
  {
    id: 'DOM-001',
    orderId: 'ORD-2024-1234',
    customer: {
      name: 'Ana Rodríguez',
      phone: '+57 300 123 4567',
      address: 'Calle 45 #23-67, Cabecera del Llano',
      neighborhood: 'Cabecera'
    },
    restaurant: {
      name: 'Restaurante El Buen Sabor',
      address: 'Carrera 27 #45-12, Centro',
      phone: '+57 310 987 6543'
    },
    items: [
      'Bandeja Paisa x1',
      'Jugo Natural x2',
      'Postre x1'
    ],
    amount: 45000,
    deliveryFee: 5000,
    estimatedTime: 25,
    distance: '3.2 km',
    status: 'assigned', // assigned, accepted, picked_up, delivering, delivered, cancelled
    priority: 'normal', // low, normal, high, urgent
    assignedAt: '2025-01-24 14:30:00',
    pickupTime: null,
    deliveryTime: null,
    notes: 'Casa blanca con portón negro. Tocar el timbre dos veces.'
  },
  {
    id: 'DOM-002',
    orderId: 'ORD-2024-1235',
    customer: {
      name: 'Carlos Méndez',
      phone: '+57 320 234 5678',
      address: 'Carrera 35 #67-89, Cañaveral',
      neighborhood: 'Cañaveral'
    },
    restaurant: {
      name: 'Pizza Express',
      address: 'Calle 56 #23-45, Chapinero',
      phone: '+57 315 456 7890'
    },
    items: [
      'Pizza Familiar x1',
      'Gaseosa 2L x1'
    ],
    amount: 32000,
    deliveryFee: 4000,
    estimatedTime: 30,
    distance: '4.1 km',
    status: 'picked_up',
    priority: 'high',
    assignedAt: '2025-01-24 14:15:00',
    pickupTime: '2025-01-24 14:45:00',
    deliveryTime: null,
    notes: 'Apartamento 501, edificio azul.'
  },
  {
    id: 'DOM-003',
    orderId: 'ORD-2024-1236',
    customer: {
      name: 'Laura Gómez',
      phone: '+57 311 345 6789',
      address: 'Av. Santander #123-45, Floridablanca',
      neighborhood: 'Floridablanca'
    },
    restaurant: {
      name: 'Comidas Rápidas Central',
      address: 'Calle 30 #15-20, Centro',
      phone: '+57 318 123 4567'
    },
    items: [
      'Hamburguesa Especial x2',
      'Papas Fritas x2',
      'Malteada x1'
    ],
    amount: 38000,
    deliveryFee: 6000,
    estimatedTime: 35,
    distance: '5.8 km',
    status: 'delivering',
    priority: 'normal',
    assignedAt: '2025-01-24 13:45:00',
    pickupTime: '2025-01-24 14:20:00',
    deliveryTime: null,
    notes: 'Oficina en el segundo piso, empresa TechSolutions.'
  }
];

export const DeliveryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const getStatusConfig = (status: string) => {
    const configs = {
      assigned: { 
        label: 'Asignado', 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: AlertCircle 
      },
      accepted: { 
        label: 'Aceptado', 
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle 
      },
      picked_up: { 
        label: 'Recogido', 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: Package 
      },
      delivering: { 
        label: 'En Camino', 
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Navigation 
      },
      delivered: { 
        label: 'Entregado', 
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle 
      },
      cancelled: { 
        label: 'Cancelado', 
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircle 
      }
    };
    return configs[status as keyof typeof configs] || configs.assigned;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      low: { label: 'Baja', color: 'bg-gray-100 text-gray-700' },
      normal: { label: 'Normal', color: 'bg-blue-100 text-blue-700' },
      high: { label: 'Alta', color: 'bg-orange-100 text-orange-700' },
      urgent: { label: 'Urgente', color: 'bg-red-100 text-red-700' }
    };
    return configs[priority as keyof typeof configs] || configs.normal;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDeliveries = mockDeliveries.filter(delivery => {
    const matchesSearch = delivery.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || delivery.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getDeliveriesByStatus = (status: string) => {
    if (status === 'pending') {
      return filteredDeliveries.filter(d => ['assigned', 'accepted'].includes(d.status));
    }
    if (status === 'active') {
      return filteredDeliveries.filter(d => ['picked_up', 'delivering'].includes(d.status));
    }
    if (status === 'completed') {
      return filteredDeliveries.filter(d => ['delivered', 'cancelled'].includes(d.status));
    }
    return filteredDeliveries;
  };

  const handleActionClick = (deliveryId: string, action: string) => {
    console.log(`Acción ${action} para domicilio ${deliveryId}`);
    // Aquí iría la lógica para manejar las acciones
  };

  const renderDeliveryCard = (delivery: any) => {
    const statusConfig = getStatusConfig(delivery.status);
    const priorityConfig = getPriorityConfig(delivery.priority);
    const StatusIcon = statusConfig.icon;

    return (
      <Card key={delivery.id} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate">{delivery.customer.name}</CardTitle>
              <CardDescription className="truncate">
                Pedido #{delivery.orderId} • {delivery.distance}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Badge className={`text-xs ${priorityConfig.color}`}>
                {priorityConfig.label}
              </Badge>
              <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{statusConfig.label}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Información del cliente */}
          <div className="space-y-2">
            <div className="flex items-start text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span className="break-words">{delivery.customer.address}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{delivery.customer.phone}</span>
            </div>
          </div>

          {/* Información del restaurante */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="font-medium text-sm truncate">{delivery.restaurant.name}</p>
            <p className="text-xs text-muted-foreground truncate">{delivery.restaurant.address}</p>
          </div>

          {/* Items del pedido */}
          <div>
            <p className="text-sm font-medium mb-1">Artículos:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {delivery.items.map((item, index) => (
                <li key={index} className="truncate">• {item}</li>
              ))}
            </ul>
          </div>

          {/* Tiempos y pagos */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">{formatCurrency(delivery.amount)}</p>
              <p className="text-xs text-muted-foreground">
                + {formatCurrency(delivery.deliveryFee)} envío
              </p>
            </div>
            <div>
              <p className="font-medium">{delivery.estimatedTime} min</p>
              <p className="text-xs text-muted-foreground">Tiempo estimado</p>
            </div>
          </div>

          {/* Tiempos de seguimiento */}
          {(delivery.pickupTime || delivery.deliveryTime) && (
            <div className="text-xs text-muted-foreground border-t pt-3">
              {delivery.pickupTime && (
                <p>Recogido: {formatTime(delivery.pickupTime)}</p>
              )}
              {delivery.deliveryTime && (
                <p>Entregado: {formatTime(delivery.deliveryTime)}</p>
              )}
            </div>
          )}

          {/* Notas */}
          {delivery.notes && (
            <div className="bg-yellow-50 p-2 rounded text-xs">
              <p className="font-medium">Nota:</p>
              <p className="break-words">{delivery.notes}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col space-y-2 pt-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            {delivery.status === 'assigned' && (
              <>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleActionClick(delivery.id, 'accept')}
                >
                  Aceptar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => handleActionClick(delivery.id, 'reject')}
                >
                  Rechazar
                </Button>
              </>
            )}
            
            {delivery.status === 'accepted' && (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleActionClick(delivery.id, 'pickup')}
              >
                <Package className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Marcar </span>Recogido
              </Button>
            )}
            
            {delivery.status === 'picked_up' && (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleActionClick(delivery.id, 'start_delivery')}
              >
                <Navigation className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Iniciar </span>Entrega
              </Button>
            )}
            
            {delivery.status === 'delivering' && (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleActionClick(delivery.id, 'complete')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Marcar </span>Entregado
              </Button>
            )}

            <div className="flex space-x-2 sm:flex-shrink-0">
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => handleActionClick(delivery.id, 'navigate')}
              >
                <Navigation className="h-4 w-4" />
                <span className="ml-2 sm:hidden">Navegar</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => handleActionClick(delivery.id, 'call')}
              >
                <Phone className="h-4 w-4" />
                <span className="ml-2 sm:hidden">Llamar</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold">Gestión de Domicilios</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          Administra tus pedidos asignados y en proceso
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4 lg:space-y-0 lg:flex lg:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente o número de pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="assigned">Asignados</SelectItem>
                  <SelectItem value="accepted">Aceptados</SelectItem>
                  <SelectItem value="picked_up">Recogidos</SelectItem>
                  <SelectItem value="delivering">En camino</SelectItem>
                  <SelectItem value="delivered">Entregados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="w-full sm:w-auto">
                <RefreshCw className="h-4 w-4" />
                <span className="ml-2 sm:hidden">Actualizar</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs por estado */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="all" className="text-xs lg:text-sm">
            <span className="hidden sm:inline">Todos </span>({filteredDeliveries.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs lg:text-sm">
            <span className="hidden sm:inline">Pendientes </span>({getDeliveriesByStatus('pending').length})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs lg:text-sm">
            <span className="hidden sm:inline">Activos </span>({getDeliveriesByStatus('active').length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs lg:text-sm">
            <span className="hidden sm:inline">Completados </span>({getDeliveriesByStatus('completed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredDeliveries.map(renderDeliveryCard)}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {getDeliveriesByStatus('pending').map(renderDeliveryCard)}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {getDeliveriesByStatus('active').map(renderDeliveryCard)}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {getDeliveriesByStatus('completed').map(renderDeliveryCard)}
          </div>
        </TabsContent>
      </Tabs>

      {filteredDeliveries.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No hay domicilios</h3>
            <p className="text-muted-foreground text-sm">
              No tienes domicilios que coincidan con los filtros aplicados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};