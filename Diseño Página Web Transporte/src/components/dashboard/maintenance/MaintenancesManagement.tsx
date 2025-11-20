import React, { useState } from 'react';
import { MaintenancesTable, Maintenance } from './MaintenancesTable';
import { MaintenanceDetail } from './MaintenanceDetail';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Wrench, Calendar, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '../../ui/alert';

export const MaintenancesManagement: React.FC = () => {
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);

  // Mock data centrado en correctivos (en ausencia de API real)
  const mockMaintenances: Maintenance[] = [
    {
      id: 'MC-101',
      vehicleId: 'V-011',
      vehicleName: 'Honda XR 190',
      vehiclePhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=100',
      type: 'correctivo',
      category: 'Motocicleta',
      branch: 'Centro',
      scheduledDate: '2025-11-10',
      status: 'in-progress',
      description: 'Vibración en freno delantero',
      assignedTo: 'Carlos Méndez',
      startedAt: '2025-11-09 08:30',
    },
    {
      id: 'MC-102',
      vehicleId: 'V-023',
      vehicleName: 'Xiaomi M365',
      vehiclePhoto: 'https://images.unsplash.com/photo-1559564484-e48749ee9531?w=100',
      type: 'correctivo',
      category: 'Patineta Eléctrica',
      branch: 'Norte',
      scheduledDate: '2025-11-11',
      status: 'pending',
      description: 'Batería no carga correctamente',
    },
    {
      id: 'MC-103',
      vehicleId: 'V-031',
      vehicleName: 'Trek FX 2',
      vehiclePhoto: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=100',
      type: 'correctivo',
      category: 'Bicicleta',
      branch: 'Sur',
      scheduledDate: '2025-11-08',
      status: 'pending',
      description: 'Cambio de cadena y ajuste de frenos',
    },
    {
      id: 'MC-104',
      vehicleId: 'V-004',
      vehicleName: 'Yamaha FZ 2.0',
      vehiclePhoto: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=100',
      type: 'correctivo',
      category: 'Motocicleta',
      branch: 'Centro',
      scheduledDate: '2025-11-07',
      status: 'completed',
      description: 'Cambio de aceite y revisión de frenos',
      assignedTo: 'Laura Díaz',
      startedAt: '2025-11-07 08:00',
      completedAt: '2025-11-07 10:30',
    },
  ];

  const pendingMaintenances = mockMaintenances.filter((m) => m.status === 'pending');
  const inProgressMaintenances = mockMaintenances.filter((m) => m.status === 'in-progress');
  const completedMaintenances = mockMaintenances.filter((m) => m.status === 'completed');

  const handleViewDetails = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
  };

  const handleBack = () => {
    setSelectedMaintenance(null);
  };

  if (selectedMaintenance) {
    return (
      <MaintenanceDetail
        maintenance={selectedMaintenance}
        onBack={handleBack}
        readOnly={true}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mantenimientos Correctivos</h1>
        <p className="text-muted-foreground">
          Tabla de vehículos con órdenes correctivas y acciones para visualizar el proceso.
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Vista de seguimiento; los mantenimientos se gestionan desde el personal técnico.
        </AlertDescription>
      </Alert>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total correctivos</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMaintenances.length}</div>
            <p className="text-xs text-muted-foreground">Órdenes activas y planificadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingMaintenances.length}</div>
            <p className="text-xs text-muted-foreground">Esperando asignación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En proceso</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressMaintenances.length}</div>
            <p className="text-xs text-muted-foreground">Ejecutándose</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMaintenances.length}</div>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de mantenimientos correctivos */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos ({mockMaintenances.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes ({pendingMaintenances.length})</TabsTrigger>
          <TabsTrigger value="in-progress">En Proceso ({inProgressMaintenances.length})</TabsTrigger>
          <TabsTrigger value="completed">Completados ({completedMaintenances.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <MaintenancesTable maintenances={mockMaintenances} onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="pending">
          <MaintenancesTable maintenances={pendingMaintenances} onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="in-progress">
          <MaintenancesTable maintenances={inProgressMaintenances} onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="completed">
          <MaintenancesTable maintenances={completedMaintenances} onViewDetails={handleViewDetails} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
