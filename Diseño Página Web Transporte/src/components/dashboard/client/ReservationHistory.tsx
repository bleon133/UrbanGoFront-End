import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  CreditCard, 
  Search, 
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Bike,
  Car,
  Truck,
  Zap,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner@2.0.3';

export const ReservationHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<any>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [reservationToRate, setReservationToRate] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const [reservations, setReservations] = useState([
    {
      id: 'RSV-2025-001',
      vehicle: 'Honda XR 150',
      type: 'Moto',
      branch: 'Sucursal Centro',
      startDate: '2025-11-06',
      endDate: '2025-11-06',
      startTime: '09:00',
      endTime: '18:00',
      duration: '9 horas',
      status: 'Activa',
      amount: 45000,
      paymentMethod: 'Transferencia Bancaria',
      deliveryType: 'Recogida en sucursal',
      rating: null,
      address: 'Calle 26 #13-19',
      contactPhone: '300-123-4567',
      specialInstructions: ''
    },
    {
      id: 'RSV-2025-002',
      vehicle: 'Xiaomi Mi Scooter Pro',
      type: 'Patineta eléctrica',
      branch: 'Sucursal Norte',
      startDate: '2025-01-20',
      endDate: '2025-01-20',
      startTime: '14:00',
      endTime: '20:00',
      duration: '6 horas',
      status: 'Completada',
      amount: 29000,
      paymentMethod: 'Efectivo',
      deliveryType: 'Domicilio',
      rating: 5,
      deliveryNotes: 'Excelente servicio, muy puntual',
      address: 'Carrera 7 #45-12',
      contactPhone: '300-123-4567',
      specialInstructions: 'Entregar en portería'
    },
    {
      id: 'RSV-2025-006',
      vehicle: 'Honda CB 190',
      type: 'Moto',
      branch: 'Sucursal Centro',
      startDate: '2025-01-22',
      endDate: '2025-01-22',
      startTime: '08:00',
      endTime: '16:00',
      duration: '8 horas',
      status: 'Completada',
      amount: 48000,
      paymentMethod: 'Tarjeta',
      deliveryType: 'Domicilio',
      rating: null,
      address: 'Calle 80 #10-25',
      contactPhone: '310-987-6543',
      specialInstructions: 'Entrega a domicilio - pendiente de calificar'
    },
    {
      id: 'RSV-2025-003',
      vehicle: 'Trek E-Bike 500',
      type: 'Bicicleta eléctrica',
      branch: 'Sucursal Sur',
      startDate: '2025-01-18',
      endDate: '2025-01-18',
      startTime: '08:00',
      endTime: '16:00',
      duration: '8 horas',
      status: 'Completada',
      amount: 53000,
      paymentMethod: 'Transferencia',
      deliveryType: 'Domicilio',
      rating: 4,
      address: 'Avenida Boyacá #123-45',
      contactPhone: '300-123-4567',
      specialInstructions: ''
    },
    {
      id: 'RSV-2025-004',
      vehicle: 'Specialized Rockhopper',
      type: 'Bicicleta manual',
      branch: 'Sucursal Centro',
      startDate: '2025-01-15',
      endDate: '2025-01-15',
      startTime: '10:00',
      endTime: '17:00',
      duration: '7 horas',
      status: 'Completada',
      amount: 26000,
      paymentMethod: 'Billetera Digital',
      deliveryType: 'Recogida en sucursal',
      rating: 5,
      address: 'Calle 26 #13-19',
      contactPhone: '300-123-4567',
      specialInstructions: ''
    },
    {
      id: 'RSV-2025-005',
      vehicle: 'Rollerblade Spark 84',
      type: 'Patines de línea',
      branch: 'Sucursal Occidente',
      startDate: '2025-01-12',
      endDate: '2025-01-12',
      startTime: '15:00',
      endTime: '19:00',
      duration: '4 horas',
      status: 'Cancelada',
      amount: 15000,
      paymentMethod: 'Efectivo',
      deliveryType: 'Domicilio',
      rating: null,
      address: 'Calle 13 #68-45',
      contactPhone: '300-123-4567',
      specialInstructions: 'Cancelada por mal clima'
    }
  ]);

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'Activa', label: 'Activa' },
    { value: 'Completada', label: 'Completada' },
    { value: 'Cancelada', label: 'Cancelada' },
    { value: 'Confirmada', label: 'Confirmada' }
  ];

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'Moto':
        return <Car className="h-4 w-4" />;
      case 'Patineta eléctrica':
        return <Zap className="h-4 w-4" />;
      case 'Bicicleta eléctrica':
        return <Bike className="h-4 w-4" />;
      case 'Bicicleta manual':
        return <Bike className="h-4 w-4" />;
      case 'Patines de línea':
        return <Truck className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activa':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Completada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelada':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Confirmada':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const renderStars = (rating: number | null) => {
    if (rating === null) return <span className="text-xs text-muted-foreground">Sin calificar</span>;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  // Validar si se puede cancelar (mínimo 1 hora antes del inicio)
  const canCancelReservation = (reservation: any): { canCancel: boolean; reason?: string } => {
    if (reservation.status !== 'Activa' && reservation.status !== 'Confirmada') {
      return { canCancel: false, reason: 'Solo se pueden cancelar reservas activas o confirmadas' };
    }

    // Combinar fecha y hora de inicio
    const startDateTime = new Date(`${reservation.startDate}T${reservation.startTime}`);
    const now = new Date();
    const hoursUntilStart = (startDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilStart < 1) {
      return { canCancel: false, reason: 'No se puede cancelar con menos de 1 hora de anticipación' };
    }

    return { canCancel: true };
  };

  const handleCancelRequest = (reservation: any) => {
    const { canCancel, reason } = canCancelReservation(reservation);
    
    if (!canCancel) {
      toast.error('No se puede cancelar', {
        description: reason
      });
      return;
    }

    setReservationToCancel(reservation);
    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    if (!reservationToCancel) return;

    // Actualizar el estado de la reserva
    setReservations(prev => 
      prev.map(r => 
        r.id === reservationToCancel.id 
          ? { ...r, status: 'Cancelada', specialInstructions: 'Cancelada por el cliente' }
          : r
      )
    );

    toast.success('Reserva cancelada', {
      description: `La reserva ${reservationToCancel.id} ha sido cancelada exitosamente.`
    });

    setShowCancelModal(false);
    setReservationToCancel(null);
  };

  const handleRateDelivery = (reservation: any) => {
    setReservationToRate(reservation);
    setRating(reservation.rating || 0);
    setRatingComment(reservation.deliveryNotes || '');
    setShowRatingModal(true);
  };

  const submitRating = () => {
    if (!reservationToRate) return;
    
    if (rating === 0) {
      toast.error('Calificación requerida', {
        description: 'Por favor selecciona al menos una estrella'
      });
      return;
    }

    // Actualizar la reserva con la calificación
    setReservations(prev => 
      prev.map(r => 
        r.id === reservationToRate.id 
          ? { ...r, rating, deliveryNotes: ratingComment }
          : r
      )
    );

    toast.success('Calificación enviada', {
      description: `Has calificado el servicio de domicilio con ${rating} estrella${rating !== 1 ? 's' : ''}`
    });

    setShowRatingModal(false);
    setReservationToRate(null);
    setRating(0);
    setRatingComment('');
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = !searchTerm || 
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalSpent = reservations
    .filter(r => r.status === 'Completada')
    .reduce((sum, r) => sum + r.amount, 0);

  const handleViewDetails = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowDetails(true);
  };

  const handleDownloadReceipt = (reservationId: string) => {
    console.log('Descargando recibo para:', reservationId);
    toast.success('Recibo descargado', {
      description: 'El recibo se ha descargado exitosamente'
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Reservas</p>
                  <p className="font-semibold">{reservations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completadas</p>
                  <p className="font-semibold">{reservations.filter(r => r.status === 'Completada').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Activas</p>
                  <p className="font-semibold">{reservations.filter(r => r.status === 'Activa').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Gastado</p>
                  <p className="font-semibold">{formatCurrency(totalSpent)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por ID, vehículo o tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.map(reservation => {
            const cancelCheck = canCancelReservation(reservation);
            
            return (
              <Card key={reservation.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded">
                          {getVehicleIcon(reservation.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{reservation.vehicle}</h4>
                          <p className="text-sm text-muted-foreground">
                            {reservation.id} • {reservation.type}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline"
                          className={`text-xs ${getStatusColor(reservation.status)}`}
                        >
                          {reservation.status}
                        </Badge>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(reservation)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>
                            {(reservation.status === 'Activa' || reservation.status === 'Confirmada') && (
                              <DropdownMenuItem 
                                onClick={() => handleCancelRequest(reservation)}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancelar reserva
                              </DropdownMenuItem>
                            )}
                            {reservation.status === 'Completada' && reservation.deliveryType === 'Domicilio' && !reservation.rating && (
                              <DropdownMenuItem onClick={() => handleRateDelivery(reservation)}>
                                <Star className="h-4 w-4 mr-2" />
                                Calificar domicilio
                              </DropdownMenuItem>
                            )}
                            {reservation.status === 'Completada' && (
                              <DropdownMenuItem onClick={() => handleDownloadReceipt(reservation.id)}>
                                <Download className="h-4 w-4 mr-2" />
                                Descargar recibo
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.startDate}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.startTime} - {reservation.endTime}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.deliveryType}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-primary">
                          {formatCurrency(reservation.amount)}
                        </span>
                      </div>
                    </div>

                    {reservation.status === 'Completada' && (
                      <div className="mt-3 pt-3 border-t border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {reservation.deliveryType === 'Domicilio' ? 'Calificación del domicilio:' : 'Calificación:'}
                            </span>
                            {renderStars(reservation.rating)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Duración: {reservation.duration}
                          </div>
                        </div>
                        {reservation.deliveryNotes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                            <p className="text-xs text-yellow-900 italic">"{reservation.deliveryNotes}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredReservations.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No se encontraron reservas con los filtros seleccionados.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles de la Reserva</DialogTitle>
            <DialogDescription>
              Información completa de tu reserva {selectedReservation?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Vehículo:</p>
                  <p className="text-muted-foreground">{selectedReservation.vehicle}</p>
                </div>
                <div>
                  <p className="font-medium">Tipo:</p>
                  <p className="text-muted-foreground">{selectedReservation.type}</p>
                </div>
                <div>
                  <p className="font-medium">Sucursal:</p>
                  <p className="text-muted-foreground">{selectedReservation.branch}</p>
                </div>
                <div>
                  <p className="font-medium">Estado:</p>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${getStatusColor(selectedReservation.status)}`}
                  >
                    {selectedReservation.status}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium">Fecha:</p>
                  <p className="text-muted-foreground">{selectedReservation.startDate}</p>
                </div>
                <div>
                  <p className="font-medium">Horario:</p>
                  <p className="text-muted-foreground">
                    {selectedReservation.startTime} - {selectedReservation.endTime}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Duración:</p>
                  <p className="text-muted-foreground">{selectedReservation.duration}</p>
                </div>
                <div>
                  <p className="font-medium">Costo:</p>
                  <p className="text-primary font-medium">
                    {formatCurrency(selectedReservation.amount)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Método de pago:</p>
                  <p className="text-muted-foreground">{selectedReservation.paymentMethod}</p>
                </div>
                <div>
                  <p className="font-medium">Tipo de entrega:</p>
                  <p className="text-muted-foreground">{selectedReservation.deliveryType}</p>
                </div>
              </div>

              {selectedReservation.deliveryType === 'Domicilio' && (
                <div>
                  <p className="font-medium">Dirección de entrega:</p>
                  <p className="text-muted-foreground">{selectedReservation.address}</p>
                </div>
              )}

              {selectedReservation.specialInstructions && (
                <div>
                  <p className="font-medium">Instrucciones especiales:</p>
                  <p className="text-muted-foreground">{selectedReservation.specialInstructions}</p>
                </div>
              )}

              {selectedReservation.status === 'Completada' && (
                <div>
                  <p className="font-medium">Calificación:</p>
                  {renderStars(selectedReservation.rating)}
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                <Button onClick={() => setShowDetails(false)} className="flex-1">
                  Cerrar
                </Button>
                {selectedReservation.status === 'Completada' && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadReceipt(selectedReservation.id)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Recibo
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Calificar Servicio de Domicilio</DialogTitle>
            <DialogDescription>
              {reservationToRate && `¿Cómo fue el servicio de entrega/recogida del vehículo?`}
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
                placeholder="Cuéntanos sobre tu experiencia con el servicio de domicilio..."
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
                setReservationToRate(null);
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

      {/* Cancel Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Confirmar Cancelación</span>
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar esta reserva?
            </DialogDescription>
          </DialogHeader>

          {reservationToCancel && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {reservationToCancel.id}</p>
                    <p><strong>Vehículo:</strong> {reservationToCancel.vehicle}</p>
                    <p><strong>Fecha:</strong> {reservationToCancel.startDate}</p>
                    <p><strong>Hora:</strong> {reservationToCancel.startTime}</p>
                    <p><strong>Monto:</strong> {formatCurrency(reservationToCancel.amount)}</p>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-900 text-sm">
                  La cancelación es irreversible. Si necesitas reagendar, deberás crear una nueva reserva.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelModal(false);
                setReservationToCancel(null);
              }}
              className="flex-1"
            >
              No, mantener reserva
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancellation}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Sí, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
