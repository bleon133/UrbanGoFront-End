import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Alert, AlertDescription } from '../../ui/alert';
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  User, 
  Clock, 
  Phone,
  CreditCard,
  Star,
  Navigation,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Delivery } from './DeliveriesManagement';
import { DeliveryTracking } from './DeliveryTracking';

interface DeliveryDetailProps {
  delivery: Delivery;
  onBack: () => void;
}

export const DeliveryDetail: React.FC<DeliveryDetailProps> = ({ delivery, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(delivery.status);
  const [deliveryPersonId, setDeliveryPersonId] = useState(delivery.deliveryPersonId || '');
  const [notes, setNotes] = useState('');

  // Mock data de domiciliarios disponibles
  const deliveryPersons = [
    { id: '2', name: 'María González', available: true, rating: 4.8 },
    { id: '3', name: 'Juan Pérez', available: true, rating: 4.5 },
    { id: '4', name: 'Diego López', available: false, rating: 4.9 }
  ];

  const getStatusIcon = (status: Delivery['status']) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      case 'pending': return Clock;
      default: return AlertCircle;
    }
  };

  const getStatusBadge = (status: Delivery['status']) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, label: 'Pendiente' },
      assigned: { variant: 'secondary' as const, label: 'Asignado' },
      in_pickup: { variant: 'default' as const, label: 'Recolectando' },
      picked_up: { variant: 'default' as const, label: 'Recogido' },
      in_transit: { variant: 'default' as const, label: 'En camino' },
      delivered: { variant: 'secondary' as const, label: 'Entregado' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelado' }
    };

    const config = statusConfig[status];
    const Icon = getStatusIcon(status);

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Delivery['priority']) => {
    const priorityConfig = {
      normal: { variant: 'outline' as const, label: 'Normal' },
      urgent: { variant: 'secondary' as const, label: 'Urgente' },
      express: { variant: 'destructive' as const, label: 'Express' }
    };

    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(date);
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia'
    };
    return methods[method as keyof typeof methods] || method;
  };

  const handleUpdateStatus = () => {
    console.log('Actualizando estado:', currentStatus);
    console.log('Notas:', notes);
    setIsEditing(false);
  };

  const handleAssignDeliveryPerson = () => {
    console.log('Asignando domiciliario:', deliveryPersonId);
  };

  const timeline = [
    { 
      status: 'Domicilio creado', 
      time: delivery.createdAt, 
      completed: true,
      icon: Package
    },
    { 
      status: 'Domiciliario asignado', 
      time: delivery.assignedAt, 
      completed: !!delivery.assignedAt,
      icon: User
    },
    { 
      status: 'Paquete recogido', 
      time: delivery.pickedUpAt, 
      completed: !!delivery.pickedUpAt,
      icon: CheckCircle
    },
    { 
      status: 'En tránsito', 
      time: delivery.pickedUpAt, 
      completed: ['in_transit', 'delivered'].includes(delivery.status),
      icon: Navigation
    },
    { 
      status: 'Entregado', 
      time: delivery.deliveredAt, 
      completed: !!delivery.deliveredAt,
      icon: CheckCircle
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Regresar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{delivery.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              Creado el {formatDateTime(delivery.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {getStatusBadge(delivery.status)}
          {getPriorityBadge(delivery.priority)}
        </div>
      </div>

      {/* Tracking en Tiempo Real */}
      {['assigned', 'in_pickup', 'picked_up', 'in_transit'].includes(delivery.status) && delivery.currentLocation && (
        <DeliveryTracking 
          delivery={delivery}
          pickupCoords={{ lat: 4.6782, lng: -74.0532 }}
          deliveryCoords={{ lat: 4.7110, lng: -74.0721 }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{delivery.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <p className="font-medium">{delivery.clientPhone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direcciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Direcciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Dirección de Recogida</p>
                    <p className="text-sm mt-1">{delivery.pickupAddress}</p>
                    {delivery.pickupDetail && (
                      <p className="text-sm text-muted-foreground">{delivery.pickupDetail}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900">Dirección de Entrega</p>
                    <p className="text-sm mt-1">{delivery.deliveryAddress}</p>
                    {delivery.deliveryDetail && (
                      <p className="text-sm text-muted-foreground">{delivery.deliveryDetail}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Paquete */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Información del Paquete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Descripción</p>
                <p className="font-medium">{delivery.packageDescription}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {delivery.packageWeight && (
                  <div>
                    <p className="text-sm text-muted-foreground">Peso</p>
                    <p className="font-medium">{delivery.packageWeight}</p>
                  </div>
                )}
                {delivery.packageSize && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tamaño</p>
                    <p className="font-medium capitalize">{delivery.packageSize}</p>
                  </div>
                )}
                {delivery.estimatedValue && (
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium">{delivery.estimatedValue}</p>
                  </div>
                )}
              </div>

              {delivery.specialInstructions && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                  <p className="text-sm font-medium text-amber-900">Instrucciones Especiales</p>
                  <p className="text-sm mt-1">{delivery.specialInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Línea de Tiempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`mt-1 rounded-full p-2 ${
                        item.completed 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${item.completed ? '' : 'text-muted-foreground'}`}>
                          {item.status}
                        </p>
                        {item.time && (
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(item.time)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Lateral */}
        <div className="space-y-6">
          {/* Información del Domiciliario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Domiciliario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {delivery.deliveryPersonName ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Asignado a</p>
                    <p className="font-medium">{delivery.deliveryPersonName}</p>
                  </div>
                  {delivery.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{delivery.rating}</span>
                      <span className="text-sm text-muted-foreground">/5.0</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Alert>
                    <AlertDescription>
                      Domicilio sin asignar. Selecciona un domiciliario disponible.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Select value={deliveryPersonId} onValueChange={setDeliveryPersonId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar domiciliario" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryPersons.map(person => (
                          <SelectItem 
                            key={person.id} 
                            value={person.id}
                            disabled={!person.available}
                          >
                            {person.name} - ⭐ {person.rating}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleAssignDeliveryPerson}
                      className="w-full"
                      disabled={!deliveryPersonId}
                    >
                      Asignar Domiciliario
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Información de Pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Método de pago</p>
                <p className="font-medium">{getPaymentMethodLabel(delivery.paymentMethod)}</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Tarifa del domicilio</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(delivery.deliveryFee)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actualizar Estado */}
          <Card>
            <CardHeader>
              <CardTitle>Actualizar Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select value={currentStatus} onValueChange={setCurrentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="assigned">Asignado</SelectItem>
                    <SelectItem value="in_pickup">Recolectando</SelectItem>
                    <SelectItem value="picked_up">Recogido</SelectItem>
                    <SelectItem value="in_transit">En camino</SelectItem>
                    <SelectItem value="delivered">Entregado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notas adicionales..."
                    rows={3}
                  />
                </div>
              )}

              <Button 
                onClick={() => isEditing ? handleUpdateStatus() : setIsEditing(true)}
                className="w-full"
              >
                {isEditing ? 'Guardar Cambios' : 'Cambiar Estado'}
              </Button>
            </CardContent>
          </Card>

          {/* Notas */}
          {(delivery.clientNotes || delivery.deliveryNotes) && (
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {delivery.clientNotes && (
                  <div>
                    <p className="text-sm font-medium">Notas del cliente</p>
                    <p className="text-sm text-muted-foreground mt-1">{delivery.clientNotes}</p>
                  </div>
                )}
                {delivery.deliveryNotes && (
                  <div>
                    <p className="text-sm font-medium">Notas del domiciliario</p>
                    <p className="text-sm text-muted-foreground mt-1">{delivery.deliveryNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
