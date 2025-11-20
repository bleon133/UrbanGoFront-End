import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { 
  MapPin, 
  Package, 
  Phone,
  Navigation,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Camera,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  Star
} from 'lucide-react';
import { DeliveryTracking } from '../deliveries/DeliveryTracking';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { toast } from 'sonner@2.0.3';
import type { Delivery } from '../deliveries/DeliveriesManagement';

export const ActiveDeliveries: React.FC = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showPickupPhotoModal, setShowPickupPhotoModal] = useState(false);
  const [showDeliveryPhotoModal, setShowDeliveryPhotoModal] = useState(false);
  const [pickupPhotoFile, setPickupPhotoFile] = useState<File | null>(null);
  const [deliveryPhotoFile, setDeliveryPhotoFile] = useState<File | null>(null);
  const [pickupPhotoPreview, setPickupPhotoPreview] = useState<string | null>(null);
  const [deliveryPhotoPreview, setDeliveryPhotoPreview] = useState<string | null>(null);

  // Mock data - domicilio activo del domiciliario (solo puede tener 1)
  const activeDelivery: Delivery | null = {
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
    status: 'accepted', // accepted -> picked_up -> in_transit -> delivered
    priority: 'urgent',
    specialInstructions: 'Entregar en portería si no hay nadie',
    createdAt: '2024-11-04T10:30:00',
    acceptedAt: '2024-11-04T10:35:00',
    estimatedDeliveryTime: '2024-11-04T11:30:00',
    currentLocation: {
      lat: 4.6787,
      lng: -74.0539
    }
  };

  const completedToday: Delivery[] = [
    {
      id: '5',
      orderNumber: 'DOM-2024-005',
      clientId: '1',
      clientName: 'Ana García',
      clientPhone: '+57 300 123 4567',
      deliveryPersonId: '2',
      deliveryPersonName: 'María González',
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
      acceptedAt: '2024-11-04T08:05:00',
      pickedUpAt: '2024-11-04T08:25:00',
      deliveredAt: '2024-11-04T09:10:00',
      rating: 5,
      clientNotes: 'Excelente servicio, muy rápido y profesional',
      pickupPhotoUrl: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400',
      deliveryPhotoUrl: 'https://images.unsplash.com/photo-1516442719524-a603408c90cb?w=400'
    }
  ];

  const getStatusBadge = (status: Delivery['status']) => {
    const statusConfig = {
      accepted: { variant: 'secondary' as const, label: 'Aceptado', color: 'bg-blue-100 text-blue-700' },
      picked_up: { variant: 'default' as const, label: 'Paquete Recogido', color: 'bg-yellow-100 text-yellow-700' },
      in_transit: { variant: 'default' as const, label: 'En camino', color: 'bg-purple-100 text-purple-700' },
      delivered: { variant: 'secondary' as const, label: 'Entregado', color: 'bg-green-100 text-green-700' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
  };

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

  const handlePickupPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPickupPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPickupPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeliveryPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDeliveryPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDeliveryPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPickup = () => {
    if (!pickupPhotoFile) {
      toast.error('Debes tomar una foto del paquete');
      return;
    }
    console.log('Confirmando recogida con foto:', pickupPhotoFile);
    // Aquí se subiría la foto al servidor y se actualizaría el estado a 'picked_up'
    toast.success('Recogida confirmada', {
      description: 'Foto guardada. Puedes iniciar la entrega.'
    });
    setShowPickupPhotoModal(false);
    setPickupPhotoFile(null);
    setPickupPhotoPreview(null);
  };

  const handleConfirmDelivery = () => {
    if (!deliveryPhotoFile) {
      toast.error('Debes tomar una foto del paquete entregado');
      return;
    }
    console.log('Confirmando entrega con foto:', deliveryPhotoFile);
    // Aquí se subiría la foto al servidor y se actualizaría el estado a 'delivered'
    toast.success('¡Entrega completada!', {
      description: 'El domicilio ha sido marcado como entregado exitosamente.'
    });
    setShowDeliveryPhotoModal(false);
    setDeliveryPhotoFile(null);
    setDeliveryPhotoPreview(null);
  };

  const handleStartTransit = (deliveryId: string) => {
    console.log(`Iniciando tránsito para ${deliveryId}`);
    // Actualizar estado a 'in_transit'
  };

  const handleViewTracking = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowTrackingModal(true);
  };

  const totalEarningsToday = completedToday.reduce((sum, d) => sum + d.deliveryFee, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mi Domicilio Activo</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tu entrega en curso
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Domicilio Activo</p>
                <p className="text-3xl font-bold text-primary">
                  {activeDelivery ? '1' : '0'}
                </p>
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
                <p className="text-sm text-muted-foreground">Completados Hoy</p>
                <p className="text-3xl font-bold text-green-600">{completedToday.length}</p>
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
                <p className="text-sm text-muted-foreground">Ganado Hoy</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalEarningsToday)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Domicilio Activo */}
      {activeDelivery ? (
        <Card>
          <CardHeader>
            <CardTitle>Domicilio en Curso</CardTitle>
            <CardDescription>
              Completa este domicilio antes de poder aceptar otro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card className="border-2 border-primary">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{activeDelivery.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        Aceptado a las {formatTime(activeDelivery.acceptedAt || activeDelivery.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {getStatusBadge(activeDelivery.status)}
                      {activeDelivery.priority === 'urgent' && (
                        <Badge className="bg-orange-100 text-orange-700">Urgente</Badge>
                      )}
                      {activeDelivery.priority === 'express' && (
                        <Badge className="bg-red-100 text-red-700">Express</Badge>
                      )}
                    </div>
                  </div>

                  {/* Progress steps */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0" />
                      <div 
                        className="absolute top-5 left-0 h-1 bg-primary z-0 transition-all duration-500"
                        style={{
                          width: activeDelivery.status === 'accepted' ? '0%' :
                                 activeDelivery.status === 'picked_up' ? '50%' :
                                 activeDelivery.status === 'in_transit' ? '75%' : '100%'
                        }}
                      />
                      
                      <div className="flex flex-col items-center z-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                          activeDelivery.status !== 'accepted' ? 'bg-primary text-white' : 'bg-white border-2 border-primary'
                        }`}>
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-center">Aceptado</span>
                      </div>

                      <div className="flex flex-col items-center z-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                          activeDelivery.status === 'picked_up' || activeDelivery.status === 'in_transit' || activeDelivery.status === 'delivered' 
                            ? 'bg-primary text-white' : 'bg-white border-2 border-gray-300'
                        }`}>
                          <Package className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-center">Recogido</span>
                      </div>

                      <div className="flex flex-col items-center z-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                          activeDelivery.status === 'in_transit' || activeDelivery.status === 'delivered' 
                            ? 'bg-primary text-white' : 'bg-white border-2 border-gray-300'
                        }`}>
                          <Navigation className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-center">En camino</span>
                      </div>

                      <div className="flex flex-col items-center z-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                          activeDelivery.status === 'delivered' 
                            ? 'bg-primary text-white' : 'bg-white border-2 border-gray-300'
                        }`}>
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-center">Entregado</span>
                      </div>
                    </div>
                  </div>

                  {/* Cliente */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{activeDelivery.clientName}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {activeDelivery.clientPhone}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${activeDelivery.clientPhone}`}>Llamar</a>
                      </Button>
                    </div>
                  </div>

                  {/* Direcciones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-900">Recogida</p>
                          <p className="text-sm mt-1">{activeDelivery.pickupAddress}</p>
                          {activeDelivery.pickupDetail && (
                            <p className="text-xs text-muted-foreground mt-1">{activeDelivery.pickupDetail}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">Entrega</p>
                          <p className="text-sm mt-1">{activeDelivery.deliveryAddress}</p>
                          {activeDelivery.deliveryDetail && (
                            <p className="text-xs text-muted-foreground mt-1">{activeDelivery.deliveryDetail}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Paquete */}
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{activeDelivery.packageDescription}</p>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        {activeDelivery.packageWeight && <span>Peso: {activeDelivery.packageWeight}</span>}
                        {activeDelivery.packageSize && <span>Tamaño: {activeDelivery.packageSize}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Instrucciones Especiales */}
                  {activeDelivery.specialInstructions && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-900">
                        <strong>Instrucciones:</strong> {activeDelivery.specialInstructions}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Fotos */}
                  {(activeDelivery.pickupPhotoUrl || activeDelivery.deliveryPhotoUrl) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeDelivery.pickupPhotoUrl && (
                        <div className="border rounded-lg p-3">
                          <p className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            Foto de Recogida
                          </p>
                          <img 
                            src={activeDelivery.pickupPhotoUrl} 
                            alt="Paquete recogido" 
                            className="w-full h-40 object-cover rounded"
                          />
                        </div>
                      )}
                      {activeDelivery.deliveryPhotoUrl && (
                        <div className="border rounded-lg p-3">
                          <p className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            Foto de Entrega
                          </p>
                          <img 
                            src={activeDelivery.deliveryPhotoUrl} 
                            alt="Paquete entregado" 
                            className="w-full h-40 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {activeDelivery.status === 'accepted' && (
                      <Button 
                        onClick={() => setShowPickupPhotoModal(true)}
                        className="flex-1"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Confirmar Recogida
                      </Button>
                    )}
                    
                    {activeDelivery.status === 'picked_up' && (
                      <Button 
                        onClick={() => handleStartTransit(activeDelivery.id)}
                        className="flex-1"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Iniciar Entrega
                      </Button>
                    )}
                    
                    {activeDelivery.status === 'in_transit' && (
                      <Button 
                        onClick={() => setShowDeliveryPhotoModal(true)}
                        className="flex-1"
                        variant="default"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Confirmar Entrega
                      </Button>
                    )}

                    {['picked_up', 'in_transit'].includes(activeDelivery.status) && (
                      <Button 
                        variant="outline"
                        onClick={() => handleViewTracking(activeDelivery)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Ver Mapa
                      </Button>
                    )}

                    <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-700" />
                      <span className="font-bold text-green-700">{formatCurrency(activeDelivery.deliveryFee)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            No tienes un domicilio activo. Ve a <strong>Solicitudes Disponibles</strong> para aceptar un nuevo domicilio.
          </AlertDescription>
        </Alert>
      )}

      {/* Domicilios Completados Hoy */}
      {completedToday.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completados Hoy</CardTitle>
            <CardDescription>
              Entregas realizadas exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedToday.map((delivery) => (
                <div key={delivery.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{delivery.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{delivery.clientName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(delivery.deliveryFee)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(delivery.deliveredAt || delivery.createdAt)}
                      </p>
                    </div>
                  </div>
                  {delivery.rating && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-green-300">
                      <span className="text-sm text-muted-foreground">Calificación del cliente:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (delivery.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                        <span className="text-sm font-medium ml-1">({delivery.rating})</span>
                      </div>
                    </div>
                  )}
                  {delivery.clientNotes && (
                    <div className="mt-2 pt-2 border-t border-green-300">
                      <p className="text-xs text-muted-foreground">Comentario:</p>
                      <p className="text-sm text-gray-700 italic">"{delivery.clientNotes}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Tracking */}
      <Dialog open={showTrackingModal} onOpenChange={setShowTrackingModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mi Ubicación - {selectedDelivery?.orderNumber}</DialogTitle>
            <DialogDescription>
              Vista del mapa con tu ruta actual
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

      {/* Modal de Foto de Recogida */}
      <Dialog open={showPickupPhotoModal} onOpenChange={setShowPickupPhotoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Recogida de Paquete</DialogTitle>
            <DialogDescription>
              Toma una foto del paquete para confirmar que lo has recogido
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="pickup-photo">Foto del Paquete</Label>
              <div className="mt-2">
                {pickupPhotoPreview ? (
                  <div className="relative">
                    <img 
                      src={pickupPhotoPreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-lg border-2 border-primary"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setPickupPhotoFile(null);
                        setPickupPhotoPreview(null);
                      }}
                    >
                      Cambiar
                    </Button>
                  </div>
                ) : (
                  <label 
                    htmlFor="pickup-photo"
                    className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click para tomar/seleccionar foto</span>
                    <Input
                      id="pickup-photo"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePickupPhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Asegúrate de que la foto muestre claramente el paquete que estás recogiendo
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPickupPhotoModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmPickup} disabled={!pickupPhotoFile}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Recogida
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Foto de Entrega */}
      <Dialog open={showDeliveryPhotoModal} onOpenChange={setShowDeliveryPhotoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Entrega de Paquete</DialogTitle>
            <DialogDescription>
              Toma una foto del paquete entregado para finalizar el domicilio
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="delivery-photo">Foto del Paquete Entregado</Label>
              <div className="mt-2">
                {deliveryPhotoPreview ? (
                  <div className="relative">
                    <img 
                      src={deliveryPhotoPreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-lg border-2 border-primary"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setDeliveryPhotoFile(null);
                        setDeliveryPhotoPreview(null);
                      }}
                    >
                      Cambiar
                    </Button>
                  </div>
                ) : (
                  <label 
                    htmlFor="delivery-photo"
                    className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click para tomar/seleccionar foto</span>
                    <Input
                      id="delivery-photo"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleDeliveryPhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900">
                Una vez confirmes la entrega, podrás aceptar un nuevo domicilio
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeliveryPhotoModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelivery} disabled={!deliveryPhotoFile}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Entrega
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
