import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Eye, Search, Filter, Calendar, Users } from 'lucide-react';
import { Reservation } from './ReservationsManagement';

interface ReservationsTableProps {
  onViewReservation: (reservation: Reservation) => void;
}

// Mock data para demostración
const mockReservations: Reservation[] = [
  {
    id: 'RES001',
    clientId: '1',
    clientName: 'Ana García Pérez',
    clientEmail: 'ana.garcia@email.com',
    clientPhone: '+57 300 123 4567',
    branchId: '1',
    branchName: 'Sucursal Centro',
    vehicleId: '1',
    vehicleType: 'moto',
    vehicleBrand: 'Honda',
    vehicleModel: 'XR 150',
    startDate: '2024-10-01',
    endDate: '2024-10-01',
    startTime: '08:00',
    endTime: '18:00',
    totalHours: 10,
    pricePerHour: 8000,
    totalAmount: 80000,
    paymentMethod: 'tarjeta',
    paymentStatus: 'pagado',
    reservationStatus: 'completada',
    requiresDelivery: false,
    deposit: 24000,
    createdAt: '2024-09-28T10:00:00Z',
    updatedAt: '2024-10-01T18:00:00Z',
    createdBy: 'admin'
  },
  {
    id: 'RES002',
    clientId: '2',
    clientName: 'Carlos Mendoza López',
    clientEmail: 'carlos.mendoza@email.com',
    clientPhone: '+57 310 234 5678',
    branchId: '2',
    branchName: 'Sucursal Norte',
    vehicleId: '3',
    vehicleType: 'patineta-electrica',
    vehicleBrand: 'Xiaomi',
    vehicleModel: 'Mi Scooter Pro',
    startDate: '2024-10-02',
    endDate: '2024-10-02',
    startTime: '14:00',
    endTime: '20:00',
    totalHours: 6,
    pricePerHour: 4000,
    totalAmount: 39000,
    paymentMethod: 'efectivo',
    paymentStatus: 'pendiente',
    reservationStatus: 'confirmada',
    requiresDelivery: true,
    deliveryAddress: 'Calle 85 #15-30, Chapinero',
    deliveryFee: 15000,
    deposit: 12000,
    createdAt: '2024-09-30T15:30:00Z',
    updatedAt: '2024-09-30T15:30:00Z',
    createdBy: 'admin'
  },
  {
    id: 'RES003',
    clientId: '3',
    clientName: 'María José Rodríguez',
    clientEmail: 'maria.rodriguez@email.com',
    clientPhone: '+57 320 345 6789',
    branchId: '3',
    branchName: 'Sucursal Sur',
    vehicleId: '5',
    vehicleType: 'patines-linea',
    vehicleBrand: 'Rollerblade',
    vehicleModel: 'Spark 84',
    startDate: '2024-10-03',
    endDate: '2024-10-03',
    startTime: '10:00',
    endTime: '16:00',
    totalHours: 6,
    pricePerHour: 2500,
    totalAmount: 15000,
    paymentMethod: 'transferencia',
    paymentStatus: 'pagado',
    reservationStatus: 'en-curso',
    requiresDelivery: false,
    deposit: 4500,
    createdAt: '2024-10-01T09:00:00Z',
    updatedAt: '2024-10-03T10:00:00Z',
    createdBy: 'admin'
  }
];

export const ReservationsTable: React.FC<ReservationsTableProps> = ({
  onViewReservation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    const variants = {
      'pendiente': 'secondary',
      'confirmada': 'default',
      'en-curso': 'default',
      'completada': 'secondary',
      'cancelada': 'destructive'
    };
    const labels = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'en-curso': 'En Curso',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return {
      variant: variants[status as keyof typeof variants] || 'secondary',
      label: labels[status as keyof typeof labels] || status
    };
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      'pendiente': 'destructive',
      'pagado': 'default',
      'reembolsado': 'secondary'
    };
    const labels = {
      'pendiente': 'Pendiente',
      'pagado': 'Pagado',
      'reembolsado': 'Reembolsado'
    };
    return {
      variant: variants[status as keyof typeof variants] || 'secondary',
      label: labels[status as keyof typeof labels] || status
    };
  };

  const getVehicleTypeLabel = (type: string) => {
    const labels = {
      'moto': 'Moto',
      'patineta-electrica': 'Patineta eléctrica',
      'bicicleta-manual': 'Bicicleta manual',
      'bicicleta-electrica': 'Bicicleta eléctrica',
      'patines-linea': 'Patines de línea'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('es-CO')} ${timeString}`;
  };

  const filteredReservations = mockReservations.filter(reservation => {
    const matchesSearch = reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${reservation.vehicleBrand} ${reservation.vehicleModel}`.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatusFilter = statusFilter === 'all' || reservation.reservationStatus === statusFilter;
    const matchesPaymentFilter = paymentFilter === 'all' || reservation.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatusFilter && matchesPaymentFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Reservas</h1>
          <p className="text-muted-foreground">
            Administra las reservas de vehículos y alquileres (Solo visualización)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reservas</p>
                <p className="text-2xl font-bold">{mockReservations.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Curso</p>
                <p className="text-2xl font-bold">
                  {mockReservations.filter(r => r.reservationStatus === 'en-curso').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-2xl font-bold">
                  {mockReservations.filter(r => r.reservationStatus === 'completada').length}
                </p>
              </div>
              <Badge className="h-8 w-8 text-green-500 bg-transparent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Hoy</p>
                <p className="text-2xl font-bold">$134K</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por cliente, sucursal o vehículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Estado reserva" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="confirmada">Confirmada</SelectItem>
              <SelectItem value="en-curso">En Curso</SelectItem>
              <SelectItem value="completada">Completada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Estado pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los pagos</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="pagado">Pagado</SelectItem>
              <SelectItem value="reembolsado">Reembolsado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Sucursal</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado Reserva</TableHead>
                <TableHead>Estado Pago</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No se encontraron reservas
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservations.map((reservation) => {
                  const statusBadge = getStatusBadge(reservation.reservationStatus);
                  const paymentBadge = getPaymentStatusBadge(reservation.paymentStatus);
                  
                  return (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reservation.clientName}</p>
                          <p className="text-sm text-muted-foreground">{reservation.clientPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reservation.vehicleBrand} {reservation.vehicleModel}</p>
                          <p className="text-sm text-muted-foreground">
                            {getVehicleTypeLabel(reservation.vehicleType)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{reservation.branchName}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}</p>
                          <p className="text-sm text-muted-foreground">{reservation.startTime} - {reservation.endTime}</p>
                          <p className="text-xs text-muted-foreground">{reservation.totalHours}h total</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(reservation.totalAmount)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(reservation.pricePerHour)}/h
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant as any}>
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={paymentBadge.variant as any}>
                          {paymentBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewReservation(reservation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredReservations.length} de {mockReservations.length} reservas
      </div>
    </div>
  );
};