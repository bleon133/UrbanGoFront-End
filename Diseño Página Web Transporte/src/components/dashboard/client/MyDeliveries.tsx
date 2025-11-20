import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import { 
  Package, 
  MapPin, 
  Clock, 
  Eye, 
  Search,
  Star,
  Navigation,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { DeliveryTracking } from '../deliveries/DeliveryTracking';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { toast } from 'sonner@2.0.3';
import type { Delivery } from '../deliveries/DeliveriesManagement';

export const MyDeliveries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [deliveryToRate, setDeliveryToRate] = useState<Delivery | null>(null);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  // Mock data de domicilios del cliente
  const [myDeliveries, setMyDeliveries] = useState<Delivery[]>([
    {
      id: '1',
      orderNumber: 'DOM-2024-001',
      clientId: '1',
      clientName: 'Ana García',
      clientPhone: '+57 300 123 4567',
      deliveryPersonId: '2',
      deliveryPersonName: 'María González',
      pickupAddress: 'Calle 72 # 10-34, Bogotá',
      pickupDetail: 'Oficina 301',
      deliveryAddress: 'Carrera 15 # 93-80, Bogotá',
      deliveryDetail: 'Apartamento 502, Torre B',
      packageDescription: 'Documentos importantes',
      packageWeight: '0.5 kg',
      packageSize: 'Pequeño',
      paymentMethod: 'card',
      deliveryFee: 12000,
      status: 'in_transit',
      priority: 'urgent',
      createdAt: '2024-11-04T10:30:00',
      assignedAt: '2024-11-04T10:35:00',
      pickedUpAt: '2024-11-04T10:50:00',
      estimatedDeliveryTime: '2024-11-04T11:30:00',
      currentLocation: {
        lat: 4.6787,
        lng: -74.0539
      }
    },
    {
      id: '5',
      orderNumber: 'DOM-2024-005',
      clientId: '1',
      clientName: 'Ana García',
      clientPhone: '+57 300 123 4567',
      deliveryPersonId: '4',
      deliveryPersonName: 'Diego López',
      pickupAddress: 'Calle 45 # 7-50, Bogotá',
      deliveryAddress: 'Carrera 7 # 71-21, Bogotá',
      packageDescription: 'Laptop',
      packageWeight: '3 kg',
      packageSize: 'Mediano',
      paymentMethod: 'card',
      deliveryFee: 25000,
      status: 'delivered',
      priority: 'express',
      createdAt: '2024-11-04T08:00:00',
      assignedAt: '2024-11-04T08:05:00',
      pickedUpAt: '2024-11-04T08:25:00',
      deliveredAt: '2024-11-04T09:10:00',
      rating: null
    },
    {
      id: '6',
      orderNumber: 'DOM-2024-012',
      clientId: '1',
      clientName: 'Ana García',
      clientPhone: '+57 300 123 4567',
      deliveryPersonId: '2',
      deliveryPersonName: 'María González',
      pickupAddress: 'Centro Comercial Andino, Bogotá',
      deliveryAddress: 'Calle 100 # 20-30, Bogotá',
      packageDescription: 'Compras de supermercado',
      packageWeight: '8 kg',
      packageSize: 'Grande',
      paymentMethod: 'cash',
      deliveryFee: 20000,
      status: 'picked_up',
      priority: 'normal',
      createdAt: '2024-11-04T09:00:00',
      assignedAt: '2024-11-04T09:05:00',
      pickedUpAt: '2024-11-04T09:25:00',
      estimatedDeliveryTime: '2024-11-04T10:30:00',
      currentLocation: {
        lat: 4.6897,
        lng: -74.0489
      }
    },
    {
      id: '7',
      orderNumber: 'DOM-2024-008',
      clientId: '1',
      clientName: 'Ana García',
      clientPhone: '+57 300 123 4567',
      pickupAddress: 'Calle 85 # 12-50, Bogotá',
      deliveryAddress: 'Avenida 68 # 48-20, Bogotá',
      packageDescription: 'Libros',
      packageWeight: '1.5 kg',
      packageSize: 'Pequeño',
      paymentMethod: 'card',
      deliveryFee: 15000,
      status: 'pending',
      priority: 'normal',
      createdAt: '2024-11-04T11:00:00',
      estimatedDeliveryTime: '2024-11-04T13:00:00'
    },
    {
      id: '8',
      orderNumber: 'DOM-2024-003',
      clientId: '1',
      clientName: 'Ana García',
      clientPhone: '+57 300 123 4567',
      deliveryPersonId: '3',
      deliveryPersonName: 'Carlos Rodríguez',
      pickupAddress: 'Calle 53 # 15-80, Bogotá',
      deliveryAddress: 'Carrera 30 # 20-10, Bogotá',
      packageDescription: 'Ropa',
      packageWeight: '2 kg',
      packageSize: 'Mediano',
      paymentMethod: 'card',
      deliveryFee: 18000,
      status: 'delivered',
      priority: 'normal',
      createdAt: '2024-11-03T14:00:00',
      assignedAt: '2024-11-03T14:05:00',
      pickedUpAt: '2024-11-03T14:20:00',
      deliveredAt: '2024-11-03T15:10:00',
      rating: 5,
      clientNotes: 'Excelente servicio, muy profesional'
    }
  ]);

  const getStatusBadge = (status: Delivery['status']) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, label: 'Pendiente', icon: Clock },
      assigned: { variant: 'secondary' as const, label: 'Asignado', icon: AlertCircle },
      accepted: { variant: 'secondary' as const, label: 'Aceptado', icon: CheckCircle },
      picked_up: { variant: 'default' as const, label: 'Paquete Recogido', icon: Package },
      in_transit: { variant: 'default' as const, label: 'En camino', icon: Navigation },
      delivered: { variant: 'secondary' as const, label: 'Entregado', icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, label: 'Cancelado', icon: Clock }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleTrackDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowTrackingModal(true);
  };

  const handleRateDelivery = (delivery: Delivery) => {
    setDeliveryToRate(delivery);
    setRating(delivery.rating || 0);
    setRatingComment(delivery.clientNotes || '');
    setShowRatingModal(true);
  };

  const submitRating = () => {
    if (!deliveryToRate) return;
    
    if (rating === 0) {
      toast.error('Calificación requerida', {
        description: 'Por favor selecciona al menos una estrella'
      });
      return;
    }

    // Actualizar el domicilio con la calificación
    setMyDeliveries(prev => 
      prev.map(d => 
        d.id === deliveryToRate.id 
          ? { ...d, rating, clientNotes: ratingComment }
          : d
      )
    );

    toast.success('Calificación enviada', {
      description: `Has calificado el domicilio ${deliveryToRate.orderNumber} con ${rating} estrella${rating !== 1 ? 's' : ''}`
    });

    setShowRatingModal(false);
    setDeliveryToRate(null);
    setRating(0);
    setRatingComment('');
  };

  const activeDeliveries = myDeliveries.filter(d => 
    ['pending', 'assigned', 'accepted', 'picked_up', 'in_transit'].includes(d.status)
  );

  const completedDeliveries = myDeliveries.filter(d => 
    d.status === 'delivered'
  );

  const filteredActiveDeliveries = activeDeliveries.filter(delivery =>
    delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.packageDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompletedDeliveries = completedDeliveries.filter(delivery =>
    delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.packageDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const DeliveryCard: React.FC<{ delivery: Delivery; showRateButton?: boolean }> = ({ delivery, showRateButton = false }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">{delivery.orderNumber}</h3>
            <p className="text-sm text-muted-foreground">{formatDateTime(delivery.createdAt)}</p>
          </div>
          {getStatusBadge(delivery.status)}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Recogida</p>
              <p className="text-sm font-medium line-clamp-1">{delivery.pickupAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Entrega</p>
              <p className="text-sm font-medium line-clamp-1">{delivery.deliveryAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <p className="text-sm line-clamp-1">{delivery.packageDescription}</p>
          </div>

          {delivery.deliveryPersonName && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {delivery.deliveryPersonName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{delivery.deliveryPersonName}</p>
                  <p className="text-xs text-muted-foreground">Domiciliario</p>
                </div>
              </div>
              {delivery.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{delivery.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(delivery.deliveryFee)}</p>
            </div>
            <div className="flex gap-2">
              {['accepted', 'picked_up', 'in_transit'].includes(delivery.status) && (
                <Button 
                  size="sm" 
                  onClick={() => handleTrackDelivery(delivery)}
                  className="gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  Rastrear
                </Button>
              )}
              {showRateButton && !delivery.rating && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleRateDelivery(delivery)}
                  className="gap-2"
                >
                  <Star className="h-4 w-4" />
                  Calificar
                </Button>
              )}
            </div>
          </div>

          {delivery.estimatedDeliveryTime && !delivery.deliveredAt && (
            <div className="bg-primary/10 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Entrega estimada</p>
                  <p className="text-sm font-medium">{formatDateTime(delivery.estimatedDeliveryTime)}</p>
                </div>
              </div>
            </div>
          )}

          {delivery.status === 'delivered' && delivery.rating && delivery.clientNotes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-900 font-medium mb-1">Tu calificación</p>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= (delivery.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-yellow-900">{delivery.clientNotes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Domicilios</h1>
          <p className="text-muted-foreground mt-2">
            Rastrea tus domicilios en tiempo real y ve tu historial
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Domicilios Activos</p>
                  <p className="text-3xl font-bold text-primary">{activeDeliveries.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completados</p>
                  <p className="text-3xl font-bold text-green-600">{completedDeliveries.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Gastado</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(myDeliveries.reduce((sum, d) => sum + d.deliveryFee, 0))}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de orden o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Activos ({activeDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completados ({completedDeliveries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {filteredActiveDeliveries.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No hay domicilios activos</h3>
                  <p className="text-sm text-muted-foreground">
                    Cuando solicites un domicilio, aparecerá aquí
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredActiveDeliveries.map(delivery => (
                  <DeliveryCard key={delivery.id} delivery={delivery} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredCompletedDeliveries.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No hay domicilios completados</h3>
                  <p className="text-sm text-muted-foreground">
                    Tu historial de domicilios aparecerá aquí
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCompletedDeliveries.map(delivery => (
                  <DeliveryCard key={delivery.id} delivery={delivery} showRateButton />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Tracking Modal */}
      <Dialog open={showTrackingModal} onOpenChange={setShowTrackingModal}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rastreo en Vivo</DialogTitle>
            <DialogDescription>
              {selectedDelivery && `Domicilio ${selectedDelivery.orderNumber}`}
            </DialogDescription>
          </DialogHeader>
          {selectedDelivery && (
            <DeliveryTracking 
              delivery={selectedDelivery}
              pickupCoords={{ lat: 4.6782, lng: -74.0532 }}
              deliveryCoords={{ lat: 4.7110, lng: -74.0721 }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Calificar Domicilio</DialogTitle>
            <DialogDescription>
              {deliveryToRate && `¿Cómo fue tu experiencia con ${deliveryToRate.deliveryPersonName}?`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Estrellas */}
            <div>
              <p className="text-sm font-medium mb-3 text-center">Calificación</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= (hoveredStar || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {rating === 1 && 'Muy malo'}
                  {rating === 2 && 'Malo'}
                  {rating === 3 && 'Regular'}
                  {rating === 4 && 'Bueno'}
                  {rating === 5 && 'Excelente'}
                </p>
              )}
            </div>

            {/* Comentario */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Comentario (opcional)
              </label>
              <Textarea
                placeholder="Cuéntanos sobre tu experiencia..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {ratingComment.length}/500
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRatingModal(false);
                setDeliveryToRate(null);
                setRating(0);
                setRatingComment('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={submitRating} disabled={rating === 0}>
              <Star className="h-4 w-4 mr-2" />
              Enviar Calificación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
