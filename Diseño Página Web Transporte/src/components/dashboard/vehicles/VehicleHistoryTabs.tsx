import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  History, 
  Calendar,
  DollarSign,
  Wrench,
  User,
  MapPin,
  Clock,
  FileText,
  TrendingUp,
  BarChart3,
  Plus,
  Package
} from 'lucide-react';

interface RentalHistory {
  id: string;
  deliveryPersonName: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  totalAmount?: number;
  dailyRate: number;
  daysRented?: number;
}

interface MaintenanceHistory {
  id: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  technician: string;
  status: 'completed' | 'pending' | 'in-progress';
}

interface VehicleStatusHistory {
  id: string;
  date: string;
  type: 'ingreso-sistema' | 'arriendo-inicio' | 'arriendo-fin' | 'bodega' | 'mantenimiento-inicio' | 'mantenimiento-fin';
  description: string;
  relatedId?: string; // ID del arrendamiento o mantenimiento relacionado
  details?: string;
}

interface VehicleHistoryTabsProps {
  vehicleId: string;
  vehicleName: string;
  acquisitionDate: string;
}

export const VehicleHistoryTabs: React.FC<VehicleHistoryTabsProps> = ({ 
  vehicleId, 
  vehicleName, 
  acquisitionDate 
}) => {
  // Mock data más extenso para histórico
  const [rentalHistory] = useState<RentalHistory[]>([
    {
      id: 'ARR-001',
      deliveryPersonName: 'Juan Pérez Rodríguez',
      startDate: '2024-09-01',
      endDate: '2024-09-15',
      status: 'completed',
      totalAmount: 450000,
      dailyRate: 30000,
      daysRented: 15
    },
    {
      id: 'ARR-002',
      deliveryPersonName: 'María García López',
      startDate: '2024-09-16',
      endDate: '2024-10-01',
      status: 'completed',
      totalAmount: 512000,
      dailyRate: 32000,
      daysRented: 16
    },
    {
      id: 'ARR-003',
      deliveryPersonName: 'Carlos Mendoza Silva',
      startDate: '2024-10-02',
      endDate: '2024-10-16',
      status: 'completed',
      totalAmount: 450000,
      dailyRate: 30000,
      daysRented: 15
    },
    {
      id: 'ARR-004',
      deliveryPersonName: 'Ana Patricia López',
      startDate: '2024-10-17',
      status: 'active',
      dailyRate: 35000,
      daysRented: 8
    },
    {
      id: 'ARR-005',
      deliveryPersonName: 'Diego Fernández Martín',
      startDate: '2024-08-15',
      endDate: '2024-08-30',
      status: 'completed',
      totalAmount: 480000,
      dailyRate: 32000,
      daysRented: 15
    },
    {
      id: 'ARR-006',
      deliveryPersonName: 'Sofía Restrepo Gómez',
      startDate: '2024-07-20',
      endDate: '2024-08-10',
      status: 'completed',
      totalAmount: 672000,
      dailyRate: 32000,
      daysRented: 21
    }
  ]);

  const [maintenanceHistory] = useState<MaintenanceHistory[]>([
    {
      id: 'MNT-001',
      date: '2024-10-20',
      type: 'Mantenimiento Preventivo',
      description: 'Cambio de aceite motor, revisión de frenos delanteros y traseros, ajuste de cadena, revisión de luces y sistema eléctrico',
      cost: 125000,
      technician: 'Carlos Mendoza Técnico',
      status: 'completed'
    },
    {
      id: 'MNT-002',
      date: '2024-09-15',
      type: 'Reparación Correctiva',
      description: 'Cambio de llanta trasera por desgaste excesivo, reemplazo de cable de freno trasero',
      cost: 180000,
      technician: 'Ana López Martínez',
      status: 'completed'
    },
    {
      id: 'MNT-003',
      date: '2024-08-10',
      type: 'Mantenimiento Preventivo',
      description: 'Revisión general de 5000 km, cambio de filtros de aire y aceite, ajuste de carburador, revisión de suspensión',
      cost: 95000,
      technician: 'Miguel Ángel Ruiz',
      status: 'completed'
    },
    {
      id: 'MNT-004',
      date: '2024-07-22',
      type: 'Reparación Correctiva',
      description: 'Reparación de sistema de encendido, cambio de bujía, ajuste de carburador por falla en ralentí',
      cost: 65000,
      technician: 'Patricia Gómez Rivera',
      status: 'completed'
    },
    {
      id: 'MNT-005',
      date: '2024-06-30',
      type: 'Mantenimiento de Ingreso',
      description: 'Mantenimiento de ingreso al sistema - Revisión completa del vehículo, cambio de aceite, revisión de documentos, inspección técnica inicial',
      cost: 150000,
      technician: 'Equipo Técnico MobiTransport',
      status: 'completed'
    }
  ]);

  // Histórico completo de estados del vehículo
  const [vehicleStatusHistory] = useState<VehicleStatusHistory[]>([
    {
      id: 'VH-001',
      date: acquisitionDate,
      type: 'ingreso-sistema',
      description: 'Vehículo ingresado al sistema MobiTransport',
      details: 'Registro inicial, documentación completa, inspección técnica aprobada'
    },
    {
      id: 'VH-002',
      date: '2024-07-01',
      type: 'bodega',
      description: 'Vehículo disponible en bodega después del ingreso',
      details: 'Estado: Disponible para arrendamiento'
    },
    {
      id: 'VH-003',
      date: '2024-07-20',
      type: 'arriendo-inicio',
      description: 'Inicio de arrendamiento con Sofía Restrepo Gómez',
      relatedId: 'ARR-006',
      details: 'Entrega en Sucursal Centro - Revisión pre-entrega completa'
    },
    {
      id: 'VH-004',
      date: '2024-08-10',
      type: 'arriendo-fin',
      description: 'Fin de arrendamiento - Retorno a bodega',
      relatedId: 'ARR-006',
      details: 'Recepción en Sucursal Centro - Revisión post-entrega completa'
    },
    {
      id: 'VH-005',
      date: '2024-08-10',
      type: 'mantenimiento-inicio',
      description: 'Inicio de mantenimiento preventivo programado',
      relatedId: 'MNT-003',
      details: 'Revisión de 5000 km - Taller principal'
    },
    {
      id: 'VH-006',
      date: '2024-08-12',
      type: 'mantenimiento-fin',
      description: 'Fin de mantenimiento - Vehículo listo para uso',
      relatedId: 'MNT-003',
      details: 'Mantenimiento completado - Regreso a bodega'
    },
    {
      id: 'VH-007',
      date: '2024-08-15',
      type: 'arriendo-inicio',
      description: 'Inicio de arrendamiento con Diego Fernández Martín',
      relatedId: 'ARR-005',
      details: 'Entrega en Sucursal Norte - Revisión pre-entrega completa'
    },
    {
      id: 'VH-008',
      date: '2024-08-30',
      type: 'arriendo-fin',
      description: 'Fin de arrendamiento - Retorno a bodega',
      relatedId: 'ARR-005',
      details: 'Recepción en Sucursal Norte - Revisión post-entrega completa'
    },
    {
      id: 'VH-009',
      date: '2024-09-01',
      type: 'arriendo-inicio',
      description: 'Inicio de arrendamiento con Juan Pérez Rodríguez',
      relatedId: 'ARR-001',
      details: 'Entrega en Sucursal Centro - Revisión pre-entrega completa'
    },
    {
      id: 'VH-010',
      date: '2024-09-15',
      type: 'arriendo-fin',
      description: 'Fin de arrendamiento - Retorno a bodega',
      relatedId: 'ARR-001',
      details: 'Recepción en Sucursal Centro - Revisión post-entrega completa'
    },
    {
      id: 'VH-011',
      date: '2024-09-15',
      type: 'mantenimiento-inicio',
      description: 'Inicio de reparación correctiva',
      relatedId: 'MNT-002',
      details: 'Cambio de llanta trasera - Taller especializado'
    },
    {
      id: 'VH-012',
      date: '2024-09-16',
      type: 'mantenimiento-fin',
      description: 'Fin de reparación - Vehículo listo para uso',
      relatedId: 'MNT-002',
      details: 'Reparación completada - Regreso a bodega'
    },
    {
      id: 'VH-013',
      date: '2024-09-16',
      type: 'arriendo-inicio',
      description: 'Inicio de arrendamiento con María García López',
      relatedId: 'ARR-002',
      details: 'Entrega en Sucursal Sur - Revisión pre-entrega completa'
    },
    {
      id: 'VH-014',
      date: '2024-10-01',
      type: 'arriendo-fin',
      description: 'Fin de arrendamiento - Retorno a bodega',
      relatedId: 'ARR-002',
      details: 'Recepción en Sucursal Sur - Revisión post-entrega completa'
    },
    {
      id: 'VH-015',
      date: '2024-10-02',
      type: 'arriendo-inicio',
      description: 'Inicio de arrendamiento con Carlos Mendoza Silva',
      relatedId: 'ARR-003',
      details: 'Entrega en Sucursal Centro - Revisión pre-entrega completa'
    },
    {
      id: 'VH-016',
      date: '2024-10-16',
      type: 'arriendo-fin',
      description: 'Fin de arrendamiento - Retorno a bodega',
      relatedId: 'ARR-003',
      details: 'Recepción en Sucursal Centro - Revisión post-entrega completa'
    },
    {
      id: 'VH-017',
      date: '2024-10-17',
      type: 'arriendo-inicio',
      description: 'Inicio de arrendamiento con Ana Patricia López',
      relatedId: 'ARR-004',
      details: 'Entrega en Sucursal Norte - Revisión pre-entrega completa'
    },
    {
      id: 'VH-018',
      date: '2024-10-20',
      type: 'mantenimiento-inicio',
      description: 'Inicio de mantenimiento preventivo programado',
      relatedId: 'MNT-001',
      details: 'Mantenimiento mensual - Taller principal'
    },
    {
      id: 'VH-019',
      date: '2024-10-22',
      type: 'mantenimiento-fin',
      description: 'Fin de mantenimiento - Vehículo listo para uso',
      relatedId: 'MNT-001',
      details: 'Mantenimiento completado - Vehículo en arrendamiento activo'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Activo</Badge>;
      case 'completed':
        return <Badge variant="outline">Completado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pendiente</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-700">En Progreso</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getVehicleStatusIcon = (type: string) => {
    switch (type) {
      case 'ingreso-sistema':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'arriendo-inicio':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'arriendo-fin':
        return <MapPin className="h-4 w-4 text-gray-600" />;
      case 'bodega':
        return <Package className="h-4 w-4 text-gray-600" />;
      case 'mantenimiento-inicio':
        return <Wrench className="h-4 w-4 text-orange-600" />;
      case 'mantenimiento-fin':
        return <Wrench className="h-4 w-4 text-green-600" />;
      default:
        return <History className="h-4 w-4 text-gray-600" />;
    }
  };

  const getVehicleStatusColor = (type: string) => {
    switch (type) {
      case 'ingreso-sistema':
        return 'bg-green-100';
      case 'arriendo-inicio':
        return 'bg-blue-100';
      case 'arriendo-fin':
        return 'bg-gray-100';
      case 'bodega':
        return 'bg-gray-100';
      case 'mantenimiento-inicio':
        return 'bg-orange-100';
      case 'mantenimiento-fin':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getVehicleStatusLabel = (type: string) => {
    switch (type) {
      case 'ingreso-sistema':
        return 'Ingreso al Sistema';
      case 'arriendo-inicio':
        return 'Inicio de Arrendamiento';
      case 'arriendo-fin':
        return 'Regreso a Bodega';
      case 'bodega':
        return 'Disponible en Bodega';
      case 'mantenimiento-inicio':
        return 'Inicio de Mantenimiento';
      case 'mantenimiento-fin':
        return 'Fin de Mantenimiento';
      default:
        return type;
    }
  };

  const getMaintenanceTypeColor = (type: string) => {
    if (type.includes('Preventivo')) return 'bg-blue-100 text-blue-700';
    if (type.includes('Correctiva')) return 'bg-orange-100 text-orange-700';
    if (type.includes('Ingreso')) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  // Calcular estadísticas
  const totalRentals = rentalHistory.length;
  const activeRentals = rentalHistory.filter(r => r.status === 'active').length;
  const completedRentals = rentalHistory.filter(r => r.status === 'completed').length;
  const totalRevenue = rentalHistory.reduce((acc, rental) => acc + (rental.totalAmount || 0), 0);
  const totalMaintenanceCost = maintenanceHistory.reduce((acc, maintenance) => acc + maintenance.cost, 0);
  const totalDaysRented = rentalHistory.reduce((acc, rental) => acc + (rental.daysRented || 0), 0);
  const averageDailyRate = rentalHistory.length > 0 
    ? rentalHistory.reduce((acc, rental) => acc + rental.dailyRate, 0) / rentalHistory.length 
    : 0;

  const utilizationRate = totalDaysRented > 0 
    ? ((totalDaysRented / ((new Date().getTime() - new Date(acquisitionDate).getTime()) / (1000 * 60 * 60 * 24))) * 100).toFixed(1)
    : 0;

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="general">Histórico General</TabsTrigger>
        <TabsTrigger value="timeline">Línea de Tiempo</TabsTrigger>
        <TabsTrigger value="rentals">Arrendamientos</TabsTrigger>
        <TabsTrigger value="maintenance">Mantenimientos</TabsTrigger>
        <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
      </TabsList>

      {/* Histórico General */}
      <TabsContent value="general" className="space-y-6">
        {/* Información del Vehículo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Información del Vehículo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Ingreso al Sistema</p>
                  <p className="font-medium">{formatDate(acquisitionDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tiempo en Sistema</p>
                  <p className="font-medium">
                    {Math.floor((new Date().getTime() - new Date(acquisitionDate).getTime()) / (1000 * 60 * 60 * 24))} días
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tasa de Utilización</p>
                  <p className="font-medium">{utilizationRate}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Arrendamientos</p>
                  <p className="font-bold">{totalRentals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                  <p className="font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Wrench className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Costos Mantenimiento</p>
                  <p className="font-bold text-orange-600">{formatCurrency(totalMaintenanceCost)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Días Arrendados</p>
                  <p className="font-bold">{totalDaysRented}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Eventos Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Eventos Recientes</CardTitle>
            <CardDescription>
              Últimos movimientos del vehículo en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehicleStatusHistory
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((event, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 border border-border rounded-lg">
                    <div className={`p-2 rounded-lg ${getVehicleStatusColor(event.type)}`}>
                      {getVehicleStatusIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{getVehicleStatusLabel(event.type)}</h4>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      {event.details && (
                        <p className="text-xs text-muted-foreground mt-1">{event.details}</p>
                      )}
                      {event.relatedId && (
                        <Badge variant="outline" className="mt-2">
                          {event.relatedId}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab de Línea de Tiempo Completa */}
      <TabsContent value="timeline" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Línea de Tiempo Completa del Vehículo</span>
            </CardTitle>
            <CardDescription>
              Histórico detallado de todos los estados y movimientos del vehículo desde su ingreso al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Línea vertical */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
              
              <div className="space-y-6">
                {vehicleStatusHistory
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((event, index) => (
                    <div key={event.id} className="relative flex items-start space-x-4">
                      {/* Punto en la línea de tiempo */}
                      <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full ${getVehicleStatusColor(event.type)} border-4 border-white shadow-lg flex items-center justify-center`}>
                        {getVehicleStatusIcon(event.type)}
                      </div>
                      
                      {/* Contenido del evento */}
                      <div className="flex-1 min-w-0 pb-8">
                        <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-lg">{getVehicleStatusLabel(event.type)}</h3>
                            <span className="text-sm text-muted-foreground">{formatDateTime(event.date)}</span>
                          </div>
                          
                          <p className="text-muted-foreground mb-3">{event.description}</p>
                          
                          {event.details && (
                            <div className="bg-muted/50 rounded-md p-3 mb-3">
                              <p className="text-sm">{event.details}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge className={`${getVehicleStatusColor(event.type)} text-gray-700`}>
                                {getVehicleStatusLabel(event.type)}
                              </Badge>
                              {event.relatedId && (
                                <Badge variant="outline">
                                  {event.relatedId}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Información adicional basada en el tipo */}
                            {event.type === 'arriendo-inicio' && (
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Estado actual</p>
                                <Badge className="bg-blue-100 text-blue-700">En Arrendamiento</Badge>
                              </div>
                            )}
                            
                            {event.type === 'arriendo-fin' && (
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Estado actual</p>
                                <Badge className="bg-gray-100 text-gray-700">En Bodega</Badge>
                              </div>
                            )}
                            
                            {event.type === 'mantenimiento-inicio' && (
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Estado actual</p>
                                <Badge className="bg-orange-100 text-orange-700">En Mantenimiento</Badge>
                              </div>
                            )}
                            
                            {event.type === 'mantenimiento-fin' && (
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Estado actual</p>
                                <Badge className="bg-green-100 text-green-700">Disponible</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab de Arrendamientos */}
      <TabsContent value="rentals" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Histórico de Arrendamientos</span>
                </CardTitle>
                <CardDescription>
                  Registro completo de todos los arrendamientos del vehículo
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Arrendamiento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Domiciliario</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Fecha Fin</TableHead>
                  <TableHead>Días</TableHead>
                  <TableHead>Tarifa Diaria</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentalHistory.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="font-medium">{rental.id}</TableCell>
                    <TableCell>{rental.deliveryPersonName}</TableCell>
                    <TableCell>{formatDate(rental.startDate)}</TableCell>
                    <TableCell>{rental.endDate ? formatDate(rental.endDate) : 'En curso'}</TableCell>
                    <TableCell>{rental.daysRented || 0}</TableCell>
                    <TableCell>{formatCurrency(rental.dailyRate)}</TableCell>
                    <TableCell className="font-medium">
                      {rental.totalAmount ? formatCurrency(rental.totalAmount) : formatCurrency(rental.dailyRate * (rental.daysRented || 1))}
                    </TableCell>
                    <TableCell>{getStatusBadge(rental.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab de Mantenimientos */}
      <TabsContent value="maintenance" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5" />
                  <span>Histórico de Mantenimientos</span>
                </CardTitle>
                <CardDescription>
                  Registro completo de todos los mantenimientos realizados al vehículo
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Programar Mantenimiento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceHistory.map((maintenance) => (
                  <TableRow key={maintenance.id}>
                    <TableCell className="font-medium">{maintenance.id}</TableCell>
                    <TableCell>{formatDate(maintenance.date)}</TableCell>
                    <TableCell>
                      <Badge className={getMaintenanceTypeColor(maintenance.type)}>
                        {maintenance.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={maintenance.description}>
                        {maintenance.description.length > 50 
                          ? maintenance.description.substring(0, 50) + '...' 
                          : maintenance.description
                        }
                      </div>
                    </TableCell>
                    <TableCell>{maintenance.technician}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(maintenance.cost)}</TableCell>
                    <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab de Estadísticas */}
      <TabsContent value="statistics" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estadísticas de Arrendamiento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Estadísticas de Arrendamiento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de arrendamientos:</span>
                <span className="font-medium">{totalRentals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Arrendamientos activos:</span>
                <span className="font-medium text-green-600">{activeRentals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Arrendamientos completados:</span>
                <span className="font-medium">{completedRentals}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ingresos totales:</span>
                <span className="font-medium text-green-600">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tarifa diaria promedio:</span>
                <span className="font-medium">{formatCurrency(averageDailyRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Días totales arrendados:</span>
                <span className="font-medium">{totalDaysRented}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tasa de utilización:</span>
                <span className="font-medium">{utilizationRate}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de Mantenimiento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Estadísticas de Mantenimiento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total mantenimientos:</span>
                <span className="font-medium">{maintenanceHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mantenimientos preventivos:</span>
                <span className="font-medium text-blue-600">
                  {maintenanceHistory.filter(m => m.type.includes('Preventivo')).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reparaciones correctivas:</span>
                <span className="font-medium text-orange-600">
                  {maintenanceHistory.filter(m => m.type.includes('Correctiva')).length}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Costo total mantenimiento:</span>
                <span className="font-medium text-red-600">{formatCurrency(totalMaintenanceCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Costo promedio:</span>
                <span className="font-medium">
                  {formatCurrency(maintenanceHistory.length > 0 ? totalMaintenanceCost / maintenanceHistory.length : 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Último mantenimiento:</span>
                <span className="font-medium">
                  {maintenanceHistory.length > 0 ? formatDate(maintenanceHistory[0].date) : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Análisis de Rentabilidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Análisis de Rentabilidad</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-2">Ingresos Brutos</h4>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-2">Gastos de Mantenimiento</h4>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalMaintenanceCost)}</p>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-2">Ganancia Neta</h4>
                <p className={`text-2xl font-bold ${totalRevenue - totalMaintenanceCost > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalRevenue - totalMaintenanceCost)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};