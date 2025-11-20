import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { 
  MapPin, 
  Package, 
  Phone,
  Clock,
  DollarSign,
  User,
  Navigation,
  AlertCircle,
  CheckCircle2,
  Ban
} from 'lucide-react';
import type { Delivery } from '../deliveries/DeliveriesManagement';

interface AvailableDeliveriesProps {
  hasActiveDelivery: boolean;
  onAcceptDelivery: (deliveryId: string) => void;
  isAvailable: boolean;
}

export const AvailableDeliveries: React.FC<AvailableDeliveriesProps> = ({ 
  hasActiveDelivery,
  onAcceptDelivery,
  isAvailable
}) => {
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // Mock data de domicilios disponibles (pending o sin domiciliario asignado)
  const availableDeliveries: Delivery[] = [
    {
      id: '4',
      orderNumber: 'DOM-2024-004',
      clientId: '4',
      clientName: 'Roberto Silva',
      clientPhone: '+57 304 222 3333',
      pickupAddress: 'Calle 100 # 20-30, Bogotá',
      deliveryAddress: 'Autopista Norte # 150-30, Bogotá',
      packageDescription: 'Medicamentos',
      packageWeight: '0.3 kg',
      packageSize: 'Pequeño',
      estimatedValue: '$150,000',
      paymentMethod: 'card',
      deliveryFee: 20000,
      status: 'pending',
      priority: 'express',
      specialInstructions: 'URGENTE - Medicamentos de nevera',
      createdAt: '2024-11-04T11:45:00',
      estimatedDeliveryTime: '2024-11-04T12:30:00'
    },
    {
      id: '7',
      orderNumber: 'DOM-2024-007',
      clientId: '5',
      clientName: 'Patricia Vargas',
      clientPhone: '+57 305 777 8888',
      pickupAddress: 'Centro Comercial Santafé, Bogotá',
      deliveryAddress: 'Calle 140 # 15-80, Bogotá',
      packageDescription: 'Ropa y accesorios',
      packageWeight: '1.5 kg',
      packageSize: 'Mediano',
      paymentMethod: 'cash',
      deliveryFee: 18000,
      status: 'pending',
      priority: 'normal',
      createdAt: '2024-11-04T12:00:00',
      estimatedDeliveryTime: '2024-11-04T13:30:00'
    },
    {
      id: '8',
      orderNumber: 'DOM-2024-008',
      clientId: '6',
      clientName: 'Miguel Ángel Torres',
      clientPhone: '+57 306 444 5555',
      pickupAddress: 'Calle 85 # 45-12, Bogotá',
      deliveryAddress: 'Carrera 50 # 127-35, Bogotá',
      packageDescription: 'Documentos legales',
      packageWeight: '0.2 kg',
      packageSize: 'Pequeño',
      paymentMethod: 'card',
      deliveryFee: 15000,
      status: 'pending',
      priority: 'urgent',
      specialInstructions: 'Entregar solo al destinatario, requiere firma',
      createdAt: '2024-11-04T12:15:00',
      estimatedDeliveryTime: '2024-11-04T13:00:00'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleAccept = (deliveryId: string) => {
    setAcceptingId(deliveryId);
    // Simular delay de aceptación
    setTimeout(() => {
      onAcceptDelivery(deliveryId);
      setAcceptingId(null);
    }, 500);
  };

  const getPriorityConfig = (priority: Delivery['priority']) => {
    const configs = {
      normal: { color: 'bg-blue-100 text-blue-700', label: 'Normal' },
      urgent: { color: 'bg-orange-100 text-orange-700', label: 'Urgente' },
      express: { color: 'bg-red-100 text-red-700', label: 'Express' }
    };
    return configs[priority];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Solicitudes Disponibles</h1>
        <p className="text-muted-foreground mt-2">
          Domicilios que puedes aceptar y realizar
        </p>
      </div>

      {/* Estado de disponibilidad */}
      {!isAvailable ? (
        <Alert className="border-red-200 bg-red-50">
          <Ban className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-900">
            <strong>No estás disponible.</strong> Activa tu disponibilidad laboral en el panel de Resumen para recibir solicitudes de domicilios.
          </AlertDescription>
        </Alert>
      ) : hasActiveDelivery ? (
        <Alert className="border-orange-200 bg-orange-50">
          <Ban className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-900">
            <strong>No puedes aceptar nuevos domicilios.</strong> Actualmente tienes un domicilio activo. 
            Completa tu domicilio actual antes de aceptar otro.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            <strong>Disponible para aceptar domicilios.</strong> Selecciona un domicilio de la lista para comenzar.
          </AlertDescription>
        </Alert>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Solicitudes Disponibles</p>
                <p className="text-3xl font-bold text-primary">{availableDeliveries.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgentes</p>
                <p className="text-3xl font-bold text-orange-600">
                  {availableDeliveries.filter(d => d.priority === 'urgent' || d.priority === 'express').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potencial de Ganancia</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(availableDeliveries.reduce((sum, d) => sum + d.deliveryFee, 0))}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de solicitudes */}
      <Card>
        <CardHeader>
          <CardTitle>Domicilios Disponibles para Aceptar</CardTitle>
          <CardDescription>
            {!isAvailable 
              ? 'Activa tu disponibilidad laboral para poder aceptar domicilios'
              : hasActiveDelivery 
                ? 'Completa tu domicilio actual para poder aceptar uno nuevo' 
                : 'Selecciona un domicilio para aceptar y comenzar'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableDeliveries.length === 0 ? (
            <Alert>
              <AlertDescription className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                No hay solicitudes disponibles en este momento
              </AlertDescription>
            </Alert>
          ) : (
            availableDeliveries.map((delivery) => {
              const priorityConfig = getPriorityConfig(delivery.priority);
              const isAccepting = acceptingId === delivery.id;

              return (
                <Card 
                  key={delivery.id} 
                  className={`border-2 ${
                    delivery.priority === 'express' ? 'border-red-300 bg-red-50/30' :
                    delivery.priority === 'urgent' ? 'border-orange-300 bg-orange-50/30' :
                    'border-gray-200'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{delivery.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            Creado a las {formatTime(delivery.createdAt)}
                          </p>
                        </div>
                        <Badge className={priorityConfig.color}>
                          {priorityConfig.label}
                        </Badge>
                      </div>

                      {/* Cliente */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{delivery.clientName}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {delivery.clientPhone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Direcciones */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-900">Recogida</p>
                              <p className="text-sm mt-1">{delivery.pickupAddress}</p>
                              {delivery.pickupDetail && (
                                <p className="text-xs text-muted-foreground mt-1">{delivery.pickupDetail}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-900">Entrega</p>
                              <p className="text-sm mt-1">{delivery.deliveryAddress}</p>
                              {delivery.deliveryDetail && (
                                <p className="text-xs text-muted-foreground mt-1">{delivery.deliveryDetail}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Paquete */}
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <Package className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">{delivery.packageDescription}</p>
                          <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                            {delivery.packageWeight && <span>Peso: {delivery.packageWeight}</span>}
                            {delivery.packageSize && <span>Tamaño: {delivery.packageSize}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Instrucciones Especiales */}
                      {delivery.specialInstructions && (
                        <Alert className="border-yellow-200 bg-yellow-50">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-900">
                            <strong>Instrucciones:</strong> {delivery.specialInstructions}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Tiempo estimado y pago */}
                      <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Entrega estimada</p>
                            <p className="text-sm font-medium">{formatTime(delivery.estimatedDeliveryTime || delivery.createdAt)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button 
                          onClick={() => handleAccept(delivery.id)}
                          className="flex-1"
                          disabled={!isAvailable || hasActiveDelivery || isAccepting}
                        >
                          {isAccepting ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Aceptando...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              {!isAvailable ? 'No disponible' : 'Aceptar Domicilio'}
                            </>
                          )}
                        </Button>

                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-lg">
                          <DollarSign className="h-5 w-5 text-green-700" />
                          <span className="font-bold text-green-700">{formatCurrency(delivery.deliveryFee)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
