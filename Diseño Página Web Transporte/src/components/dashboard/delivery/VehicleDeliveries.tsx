import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  MapPin, 
  Package, 
  Phone,
  Clock,
  DollarSign,
  User,
  CheckCircle2,
  Bike,
  Building2,
  Home,
  Navigation,
  AlertCircle,
  Camera,
  Upload,
  Star,
  Ban
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { toast } from 'sonner@2.0.3';

interface VehicleDelivery {
  id: string;
  reservationId: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  deliveryType: 'pickup' | 'return'; // 'pickup' = entregar al cliente, 'return' = recoger del cliente
  clientName: string;
  clientPhone: string;
  
  // Si es entrega a cliente
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryNeighborhood?: string;
  deliveryDetail?: string;
  
  // Si es recogida del cliente
  pickupAddress?: string;
  pickupCity?: string;
  pickupNeighborhood?: string;
  pickupDetail?: string;
  
  // Sucursal de referencia
  branchName: string;
  branchAddress: string;
  
  scheduledDate: string;
  scheduledTime: string;
  deliveryFee: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
  specialInstructions?: string;
  createdAt: string;
  
  // Calificación del cliente
  rating?: number;
  clientNotes?: string;
}

interface VehicleDeliveriesProps {
  isAvailable: boolean;
}

export const VehicleDeliveries: React.FC<VehicleDeliveriesProps> = ({ isAvailable }) => {
  const [activeTab, setActiveTab] = useState('available');
  const [acceptedDeliveries, setAcceptedDeliveries] = useState<string[]>([]);
  const [completedDeliveries, setCompletedDeliveries] = useState<string[]>([]);
  const [inProgressDeliveries, setInProgressDeliveries] = useState<string[]>([]);
  
  // Estados para fotos
  const [showPickupPhotoModal, setShowPickupPhotoModal] = useState(false);
  const [showDeliveryPhotoModal, setShowDeliveryPhotoModal] = useState(false);
  const [currentDeliveryId, setCurrentDeliveryId] = useState<string | null>(null);
  const [pickupPhotoFile, setPickupPhotoFile] = useState<File | null>(null);
  const [deliveryPhotoFile, setDeliveryPhotoFile] = useState<File | null>(null);
  const [pickupPhotoPreview, setPickupPhotoPreview] = useState<string | null>(null);
  const [deliveryPhotoPreview, setDeliveryPhotoPreview] = useState<string | null>(null);

  // Mock data - Domicilios de vehículos disponibles (programados para hoy/pronto)
  const availableDeliveries: VehicleDelivery[] = [
    {
      id: 'VD-001',
      reservationId: 'RSV-2025-001',
      vehicleType: 'Moto',
      vehicleBrand: 'Honda',
      vehicleModel: 'XR 150',
      deliveryType: 'pickup', // Entregar vehículo al cliente
      clientName: 'Ana García',
      clientPhone: '+57 300 123 4567',
      deliveryAddress: 'Calle 72 # 10-34',
      deliveryCity: 'Bogotá',
      deliveryNeighborhood: 'Chapinero',
      deliveryDetail: 'Apartamento 301, Torre B',
      branchName: 'Sucursal Centro',
      branchAddress: 'Carrera 7 #12-34, Centro',
      scheduledDate: '2025-01-24',
      scheduledTime: '10:00',
      deliveryFee: 15000,
      status: 'pending',
      specialInstructions: 'Llamar al llegar',
      createdAt: '2025-01-23T14:30:00'
    },
    {
      id: 'VD-002',
      reservationId: 'RSV-2025-002',
      vehicleType: 'Bicicleta Eléctrica',
      vehicleBrand: 'Trek',
      vehicleModel: 'E-Bike 500',
      deliveryType: 'pickup',
      clientName: 'Carlos Mendoza',
      clientPhone: '+57 310 234 5678',
      deliveryAddress: 'Carrera 15 # 93-80',
      deliveryCity: 'Bogotá',
      deliveryNeighborhood: 'Usaquén',
      branchName: 'Sucursal Norte',
      branchAddress: 'Calle 100 #15-25, Chapinero',
      scheduledDate: '2025-01-24',
      scheduledTime: '11:00',
      deliveryFee: 15000,
      status: 'pending',
      createdAt: '2025-01-23T15:00:00'
    },
    {
      id: 'VD-003',
      reservationId: 'RSV-2025-003',
      vehicleType: 'Patineta Eléctrica',
      vehicleBrand: 'Xiaomi',
      vehicleModel: 'Mi Scooter Pro',
      deliveryType: 'return', // Recoger vehículo del cliente
      clientName: 'María José Rodríguez',
      clientPhone: '+57 320 345 6789',
      pickupAddress: 'Avenida Boyacá #123-45',
      pickupCity: 'Bogotá',
      pickupNeighborhood: 'Kennedy',
      pickupDetail: 'Casa 5, Conjunto Los Robles',
      branchName: 'Sucursal Sur',
      branchAddress: 'Avenida Sur #45-67, Kennedy',
      scheduledDate: '2025-01-24',
      scheduledTime: '14:00',
      deliveryFee: 15000,
      status: 'pending',
      specialInstructions: 'Verificar estado del vehículo antes de recoger',
      createdAt: '2025-01-23T16:00:00'
    },
    {
      id: 'VD-004',
      reservationId: 'RSV-2025-004',
      vehicleType: 'Moto',
      vehicleBrand: 'Yamaha',
      vehicleModel: 'FZ 250',
      deliveryType: 'pickup',
      clientName: 'Pedro Gómez',
      clientPhone: '+57 315 456 7890',
      deliveryAddress: 'Calle 50 # 25-30',
      deliveryCity: 'Bogotá',
      deliveryNeighborhood: 'Teusaquillo',
      branchName: 'Sucursal Centro',
      branchAddress: 'Carrera 7 #12-34, Centro',
      scheduledDate: '2025-01-24',
      scheduledTime: '09:00',
      deliveryFee: 15000,
      status: 'completed',
      rating: 5,
      clientNotes: 'Excelente servicio, muy puntual y profesional',
      createdAt: '2025-01-24T08:00:00'
    },
    {
      id: 'VD-005',
      reservationId: 'RSV-2025-005',
      vehicleType: 'Bicicleta',
      vehicleBrand: 'Specialized',
      vehicleModel: 'Rockhopper',
      deliveryType: 'return',
      clientName: 'Laura Martínez',
      clientPhone: '+57 318 567 8901',
      pickupAddress: 'Carrera 30 # 50-15',
      pickupCity: 'Bogotá',
      pickupNeighborhood: 'Chapinero',
      branchName: 'Sucursal Norte',
      branchAddress: 'Calle 100 #15-25, Chapinero',
      scheduledDate: '2025-01-24',
      scheduledTime: '10:30',
      deliveryFee: 15000,
      status: 'completed',
      rating: 4,
      clientNotes: 'Buen servicio, llegó un poco tarde',
      createdAt: '2025-01-24T09:30:00'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleAcceptDelivery = (deliveryId: string) => {
    setAcceptedDeliveries(prev => [...prev, deliveryId]);
    toast.success('Domicilio de vehículo aceptado', {
      description: 'El domicilio ha sido agregado a tu lista de entregas activas.'
    });
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

  const handleStartDelivery = (deliveryId: string) => {
    setCurrentDeliveryId(deliveryId);
    setShowPickupPhotoModal(true);
  };

  const confirmPickup = () => {
    if (!pickupPhotoFile) {
      toast.error('Debes tomar una foto del vehículo');
      return;
    }
    
    if (currentDeliveryId) {
      setInProgressDeliveries(prev => [...prev, currentDeliveryId]);
      toast.success('Recogida confirmada', {
        description: 'Foto guardada. Procede a la entrega.'
      });
    }
    
    setShowPickupPhotoModal(false);
    setPickupPhotoFile(null);
    setPickupPhotoPreview(null);
    setCurrentDeliveryId(null);
  };

  const handleCompleteDelivery = (deliveryId: string) => {
    setCurrentDeliveryId(deliveryId);
    setShowDeliveryPhotoModal(true);
  };

  const confirmDelivery = () => {
    if (!deliveryPhotoFile) {
      toast.error('Debes tomar una foto del vehículo entregado');
      return;
    }
    
    if (currentDeliveryId) {
      setCompletedDeliveries(prev => [...prev, currentDeliveryId]);
      setInProgressDeliveries(prev => prev.filter(id => id !== currentDeliveryId));
      setAcceptedDeliveries(prev => prev.filter(id => id !== currentDeliveryId));
      toast.success('¡Domicilio completado!', {
        description: 'La entrega ha sido marcada como completada.'
      });
    }
    
    setShowDeliveryPhotoModal(false);
    setDeliveryPhotoFile(null);
    setDeliveryPhotoPreview(null);
    setCurrentDeliveryId(null);
  };

  const getDeliveryTypeInfo = (delivery: VehicleDelivery) => {
    if (delivery.deliveryType === 'pickup') {
      return {
        label: 'Entrega al Cliente',
        icon: <Home className="h-4 w-4" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        from: delivery.branchName,
        fromAddress: delivery.branchAddress,
        to: delivery.clientName,
        toAddress: `${delivery.deliveryAddress}, ${delivery.deliveryNeighborhood}, ${delivery.deliveryCity}`,
        toDetail: delivery.deliveryDetail
      };
    } else {
      return {
        label: 'Recogida del Cliente',
        icon: <Building2 className="h-4 w-4" />,
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
        from: delivery.clientName,
        fromAddress: `${delivery.pickupAddress}, ${delivery.pickupNeighborhood}, ${delivery.pickupCity}`,
        fromDetail: delivery.pickupDetail,
        to: delivery.branchName,
        toAddress: delivery.branchAddress
      };
    }
  };

  const myAcceptedDeliveries = availableDeliveries.filter(d => acceptedDeliveries.includes(d.id));
  const myCompletedDeliveries = availableDeliveries.filter(d => completedDeliveries.includes(d.id) || d.status === 'completed');
  const pendingDeliveries = availableDeliveries.filter(d => !acceptedDeliveries.includes(d.id) && !completedDeliveries.includes(d.id) && d.status !== 'completed');

  const totalEarnings = myAcceptedDeliveries.reduce((sum, d) => sum + d.deliveryFee, 0);
  const completedEarnings = myCompletedDeliveries.reduce((sum, d) => sum + d.deliveryFee, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Domicilios de Vehículos</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona las entregas y recogidas de vehículos programadas
        </p>
      </div>

      {/* Alerta de disponibilidad */}
      {!isAvailable && (
        <Alert className="border-red-200 bg-red-50">
          <Ban className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-900">
            <strong>No estás disponible.</strong> Activa tu disponibilidad laboral en el panel de Resumen para poder aceptar domicilios de vehículos.
          </AlertDescription>
        </Alert>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disponibles</p>
                <p className="text-3xl text-blue-600">{pendingDeliveries.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aceptados</p>
                <p className="text-3xl text-orange-600">{myAcceptedDeliveries.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Navigation className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completados Hoy</p>
                <p className="text-3xl text-green-600">{myCompletedDeliveries.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ganancia Potencial</p>
                <p className="text-2xl text-green-600">{formatCurrency(totalEarnings)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Domicilios de Vehículos:</strong> Puedes aceptar múltiples entregas al mismo tiempo. 
          No hay tracking en tiempo real. Los clientes han pactado fecha y hora específica.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">
            Disponibles ({pendingDeliveries.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Mis Domicilios ({myAcceptedDeliveries.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completados ({myCompletedDeliveries.length})
          </TabsTrigger>
        </TabsList>

        {/* Disponibles */}
        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domicilios Disponibles para Aceptar</CardTitle>
              <CardDescription>
                {!isAvailable 
                  ? 'Activa tu disponibilidad laboral para poder aceptar domicilios de vehículos'
                  : 'Puedes aceptar múltiples domicilios de vehículos al mismo tiempo'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingDeliveries.length === 0 ? (
                <Alert>
                  <Package className="h-4 w-4" />
                  <AlertDescription>
                    No hay domicilios de vehículos disponibles en este momento
                  </AlertDescription>
                </Alert>
              ) : (
                pendingDeliveries.map((delivery) => {
                  const typeInfo = getDeliveryTypeInfo(delivery);
                  
                  return (
                    <Card key={delivery.id} className={`border-2 ${typeInfo.bgColor}`}>
                      <CardContent className="p-6 space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{delivery.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              Reserva: {delivery.reservationId}
                            </p>
                          </div>
                          <Badge className={`${typeInfo.color} bg-white border`}>
                            <span className="flex items-center gap-2">
                              {typeInfo.icon}
                              {typeInfo.label}
                            </span>
                          </Badge>
                        </div>

                        {/* Vehículo */}
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <Bike className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">{delivery.vehicleBrand} {delivery.vehicleModel}</p>
                            <p className="text-sm text-muted-foreground">{delivery.vehicleType}</p>
                          </div>
                        </div>

                        {/* Programación */}
                        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Programado para</p>
                            <p className="font-medium">{formatDate(delivery.scheduledDate)} a las {formatTime(delivery.scheduledTime)}</p>
                          </div>
                        </div>

                        {/* Ruta */}
                        <div className="space-y-3">
                          <div className={`p-4 rounded-lg border-2 ${delivery.deliveryType === 'pickup' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-green-900">Origen: {typeInfo.from}</p>
                                <p className="text-sm mt-1">{typeInfo.fromAddress}</p>
                                {typeInfo.fromDetail && (
                                  <p className="text-xs text-muted-foreground mt-1">{typeInfo.fromDetail}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className={`p-4 rounded-lg border-2 ${delivery.deliveryType === 'pickup' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-red-900">Destino: {typeInfo.to}</p>
                                <p className="text-sm mt-1">{typeInfo.toAddress}</p>
                                {typeInfo.toDetail && (
                                  <p className="text-xs text-muted-foreground mt-1">{typeInfo.toDetail}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cliente */}
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <User className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{delivery.clientName}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {delivery.clientPhone}
                            </p>
                          </div>
                        </div>

                        {/* Instrucciones */}
                        {delivery.specialInstructions && (
                          <Alert className="border-yellow-200 bg-yellow-50">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-900">
                              <strong>Instrucciones:</strong> {delivery.specialInstructions}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Acciones */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Button 
                            onClick={() => handleAcceptDelivery(delivery.id)}
                            className="flex-1"
                            disabled={!isAvailable}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {!isAvailable ? 'No disponible' : 'Aceptar Domicilio'}
                          </Button>

                          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-lg">
                            <DollarSign className="h-5 w-5 text-green-700" />
                            <span className="font-bold text-green-700">{formatCurrency(delivery.deliveryFee)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mis Domicilios Aceptados */}
        <TabsContent value="accepted" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mis Domicilios de Vehículos</CardTitle>
              <CardDescription>
                Domicilios que has aceptado y debes completar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myAcceptedDeliveries.length === 0 ? (
                <Alert>
                  <Package className="h-4 w-4" />
                  <AlertDescription>
                    No tienes domicilios de vehículos aceptados
                  </AlertDescription>
                </Alert>
              ) : (
                myAcceptedDeliveries.map((delivery) => {
                  const typeInfo = getDeliveryTypeInfo(delivery);
                  
                  return (
                    <Card key={delivery.id} className="border-2 border-primary">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{delivery.id}</h3>
                            <Badge className="bg-orange-100 text-orange-700 mt-1">En Proceso</Badge>
                          </div>
                          <Badge variant="outline" className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Bike className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">{delivery.vehicleBrand} {delivery.vehicleModel}</p>
                            <p className="text-sm text-muted-foreground">{delivery.vehicleType}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Programado</p>
                            <p className="font-medium">{formatDate(delivery.scheduledDate)} - {formatTime(delivery.scheduledTime)}</p>
                          </div>
                        </div>

                        {/* Progreso del domicilio */}
                        <div className="p-3 bg-muted rounded-lg">
                          {inProgressDeliveries.includes(delivery.id) ? (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Vehículo recogido - Procede a entrega</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-orange-600" />
                              <span className="text-orange-600 font-medium">Pendiente de recogida</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-4 border-t">
                          {!inProgressDeliveries.includes(delivery.id) ? (
                            <Button 
                              onClick={() => handleStartDelivery(delivery.id)}
                              className="flex-1"
                              variant="default"
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Confirmar Recogida (Foto)
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleCompleteDelivery(delivery.id)}
                              className="flex-1"
                              variant="default"
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Confirmar Entrega (Foto)
                            </Button>
                          )}

                          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-lg">
                            <DollarSign className="h-5 w-5 text-green-700" />
                            <span className="font-bold text-green-700">{formatCurrency(delivery.deliveryFee)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completados */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domicilios Completados</CardTitle>
              <CardDescription>
                Entregas de vehículos finalizadas hoy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {myCompletedDeliveries.length === 0 ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    No has completado domicilios de vehículos hoy
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {myCompletedDeliveries.map((delivery) => {
                    const typeInfo = getDeliveryTypeInfo(delivery);
                    
                    return (
                      <div key={delivery.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{delivery.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {delivery.vehicleBrand} {delivery.vehicleModel}
                              </p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {typeInfo.label}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{formatCurrency(delivery.deliveryFee)}</p>
                            <p className="text-xs text-muted-foreground">{delivery.clientName}</p>
                          </div>
                        </div>
                        
                        {delivery.rating && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-green-300">
                            <span className="text-sm text-muted-foreground">Calificación del cliente:</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= (delivery.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
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
                    );
                  })}
                  
                  <div className="p-4 bg-primary/5 rounded-lg mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total ganado hoy:</span>
                      <span className="text-2xl text-primary">{formatCurrency(completedEarnings)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Foto de Recogida */}
      <Dialog open={showPickupPhotoModal} onOpenChange={setShowPickupPhotoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Recogida del Vehículo</DialogTitle>
            <DialogDescription>
              Toma una foto del vehículo antes de salir para entregarlo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="pickup-photo">Foto del Vehículo</Label>
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
                Verifica que el vehículo esté en buen estado antes de proceder. 
                La foto debe mostrar claramente el vehículo.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPickupPhotoModal(false);
              setPickupPhotoFile(null);
              setPickupPhotoPreview(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={confirmPickup} disabled={!pickupPhotoFile}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirmar Recogida
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Foto de Entrega */}
      <Dialog open={showDeliveryPhotoModal} onOpenChange={setShowDeliveryPhotoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Entrega del Vehículo</DialogTitle>
            <DialogDescription>
              Toma una foto del vehículo entregado para finalizar el domicilio
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="delivery-photo">Foto del Vehículo Entregado</Label>
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

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Asegúrate de que la foto muestre el vehículo entregado en buenas condiciones. 
                Esta será la evidencia de finalización del servicio.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDeliveryPhotoModal(false);
              setDeliveryPhotoFile(null);
              setDeliveryPhotoPreview(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={confirmDelivery} disabled={!deliveryPhotoFile}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Finalizar Domicilio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
