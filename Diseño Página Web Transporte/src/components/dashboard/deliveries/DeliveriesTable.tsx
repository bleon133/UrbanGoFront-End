import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Eye, Search, MapPin, Clock, Package, AlertCircle } from 'lucide-react';
import { Delivery } from './DeliveriesManagement';

interface DeliveriesTableProps {
  onViewDelivery: (delivery: Delivery) => void;
}

export const DeliveriesTable: React.FC<DeliveriesTableProps> = ({ onViewDelivery }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const deliveries: Delivery[] = [
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
      estimatedValue: '$50,000',
      paymentMethod: 'card',
      deliveryFee: 12000,
      status: 'in_transit',
      priority: 'urgent',
      specialInstructions: 'Entregar en portería si no hay nadie',
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
      id: '2',
      orderNumber: 'DOM-2024-002',
      clientId: '2',
      clientName: 'Carlos Mendoza',
      clientPhone: '+57 301 987 6543',
      deliveryPersonId: '3',
      deliveryPersonName: 'Juan Pérez',
      pickupAddress: 'Avenida 19 # 104-56, Bogotá',
      deliveryAddress: 'Calle 127 # 53-45, Bogotá',
      packageDescription: 'Paquete con ropa',
      packageWeight: '2 kg',
      packageSize: 'Mediano',
      paymentMethod: 'cash',
      deliveryFee: 15000,
      status: 'picked_up',
      priority: 'normal',
      createdAt: '2024-11-04T11:00:00',
      assignedAt: '2024-11-04T11:05:00',
      pickedUpAt: '2024-11-04T11:20:00',
      estimatedDeliveryTime: '2024-11-04T12:15:00',
      currentLocation: {
        lat: 4.7110,
        lng: -74.0721
      }
    },
    {
      id: '3',
      orderNumber: 'DOM-2024-003',
      clientId: '3',
      clientName: 'Laura Martínez',
      clientPhone: '+57 302 555 8888',
      deliveryPersonId: '2',
      deliveryPersonName: 'María González',
      pickupAddress: 'Centro Comercial Andino, Bogotá',
      deliveryAddress: 'Calle 85 # 15-20, Bogotá',
      packageDescription: 'Compras de supermercado',
      packageWeight: '5 kg',
      packageSize: 'Grande',
      paymentMethod: 'transfer',
      deliveryFee: 18000,
      status: 'assigned',
      priority: 'normal',
      createdAt: '2024-11-04T11:30:00',
      assignedAt: '2024-11-04T11:32:00',
      estimatedDeliveryTime: '2024-11-04T13:00:00'
    },
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
      estimatedValue: '$3,000,000',
      paymentMethod: 'card',
      deliveryFee: 25000,
      status: 'delivered',
      priority: 'express',
      createdAt: '2024-11-04T08:00:00',
      assignedAt: '2024-11-04T08:05:00',
      pickedUpAt: '2024-11-04T08:25:00',
      deliveredAt: '2024-11-04T09:10:00',
      rating: 5,
      clientNotes: 'Excelente servicio, muy rápido'
    }
  ];

  const getStatusBadge = (status: Delivery['status']) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, label: 'Pendiente', icon: Clock },
      assigned: { variant: 'secondary' as const, label: 'Asignado', icon: AlertCircle },
      accepted: { variant: 'secondary' as const, label: 'Aceptado', icon: Package },
      picked_up: { variant: 'default' as const, label: 'Paquete Recogido', icon: Package },
      in_transit: { variant: 'default' as const, label: 'En camino', icon: MapPin },
      delivered: { variant: 'secondary' as const, label: 'Entregado', icon: Package },
      cancelled: { variant: 'destructive' as const, label: 'Cancelado', icon: AlertCircle }
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
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.deliveryPersonName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeDeliveries = deliveries.filter(d => 
    ['pending', 'assigned', 'accepted', 'picked_up', 'in_transit'].includes(d.status)
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Domicilios</CardTitle>
        <CardDescription>
          Monitorea todos los domicilios en tiempo real (Solo visualización)
        </CardDescription>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, cliente o domiciliario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="assigned">Asignado</SelectItem>
              <SelectItem value="accepted">Aceptado</SelectItem>
              <SelectItem value="picked_up">Paquete Recogido</SelectItem>
              <SelectItem value="in_transit">En camino</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Domicilios Activos</p>
            <p className="text-2xl font-bold text-primary">{activeDeliveries}</p>
          </div>
          <div className="bg-green-100 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Entregados Hoy</p>
            <p className="text-2xl font-bold text-green-700">
              {deliveries.filter(d => d.status === 'delivered').length}
            </p>
          </div>
          <div className="bg-orange-100 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Pendientes</p>
            <p className="text-2xl font-bold text-orange-700">
              {deliveries.filter(d => d.status === 'pending').length}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Domiciliario</TableHead>
                <TableHead>Origen → Destino</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Tarifa</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No se encontraron domicilios
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>
                      <div className="font-medium">{delivery.orderNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{delivery.clientName}</div>
                        <div className="text-xs text-muted-foreground">{delivery.clientPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {delivery.deliveryPersonName ? (
                        <div className="font-medium text-sm">{delivery.deliveryPersonName}</div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 max-w-xs">
                        <div className="flex items-start gap-1 text-xs">
                          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-600" />
                          <span className="line-clamp-1">{delivery.pickupAddress}</span>
                        </div>
                        <div className="flex items-start gap-1 text-xs">
                          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0 text-red-600" />
                          <span className="line-clamp-1">{delivery.deliveryAddress}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                    <TableCell>{getPriorityBadge(delivery.priority)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(delivery.deliveryFee)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDateTime(delivery.createdAt)}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDelivery(delivery)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
