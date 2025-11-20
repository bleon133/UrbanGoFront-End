import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { ArrowLeft, Calendar, Clock, User, MapPin, Truck, CreditCard, Package } from 'lucide-react';
import { Reservation } from './ReservationsManagement';

interface ReservationDetailProps {
  reservation: Reservation;
  onBack: () => void;
}

export const ReservationDetail: React.FC<ReservationDetailProps> = ({ reservation, onBack }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-blue-500';
      case 'en-curso':
        return 'bg-yellow-500';
      case 'completada':
        return 'bg-green-500';
      case 'cancelada':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pagado':
        return 'bg-green-500';
      case 'pendiente':
        return 'bg-yellow-500';
      case 'reembolsado':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Reserva #{reservation.id}</h1>
            <p className="text-muted-foreground">
              Creada el {formatDate(reservation.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge className={`${getStatusColor(reservation.reservationStatus)} text-white`}>
            {reservation.reservationStatus.toUpperCase()}
          </Badge>
          <Badge className={`${getPaymentStatusColor(reservation.paymentStatus)} text-white`}>
            {reservation.paymentStatus.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Cliente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">{reservation.clientName}</p>
              <p className="text-sm text-muted-foreground">{reservation.clientEmail}</p>
              <p className="text-sm text-muted-foreground">{reservation.clientPhone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Vehículo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Vehículo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">{reservation.vehicleBrand} {reservation.vehicleModel}</p>
              <p className="text-sm text-muted-foreground">Tipo: {reservation.vehicleType}</p>
              <p className="text-sm text-muted-foreground">ID: {reservation.vehicleId}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sucursal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Sucursal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">{reservation.branchName}</p>
              <p className="text-sm text-muted-foreground">ID: {reservation.branchId}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles de la Reserva */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Detalles de la Reserva</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha de Inicio</label>
                <p className="font-medium">{formatDate(reservation.startDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Hora de Inicio</label>
                <p className="font-medium">{reservation.startTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total de Horas</label>
                <p className="font-medium">{reservation.totalHours} horas</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha de Fin</label>
                <p className="font-medium">{formatDate(reservation.endDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Hora de Fin</label>
                <p className="font-medium">{reservation.endTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Precio por Hora</label>
                <p className="font-medium">{formatCurrency(reservation.pricePerHour)}</p>
              </div>
            </div>
          </div>

          {reservation.requiresDelivery && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Información de Entrega</span>
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dirección de Entrega</label>
                    <p>{reservation.deliveryAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Costo de Entrega</label>
                    <p className="font-medium">{formatCurrency(reservation.deliveryFee || 0)}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {reservation.notes && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notas</label>
                <p className="mt-1">{reservation.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Información de Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Información de Pago</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Método de Pago</label>
                <p className="font-medium capitalize">{reservation.paymentMethod.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Depósito</label>
                <p className="font-medium">{formatCurrency(reservation.deposit)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado del Pago</label>
                <Badge className={`${getPaymentStatusColor(reservation.paymentStatus)} text-white ml-2`}>
                  {reservation.paymentStatus.toUpperCase()}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total a Pagar</label>
                <p className="text-xl font-bold text-primary">{formatCurrency(reservation.totalAmount)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Imprimir Reserva
        </Button>
        <Button variant="outline">
          Editar Reserva
        </Button>
        {reservation.reservationStatus === 'confirmada' && (
          <Button>
            Iniciar Alquiler
          </Button>
        )}
        {reservation.reservationStatus === 'en-curso' && (
          <Button>
            Finalizar Alquiler
          </Button>
        )}
      </div>
    </div>
  );
};