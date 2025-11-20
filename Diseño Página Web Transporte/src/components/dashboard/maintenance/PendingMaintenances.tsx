import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Wrench, AlertTriangle, Calendar, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { CompleteMaintenanceDialog } from "./CompleteMaintenanceDialog";

interface Maintenance {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: string;
  branch: string;
  type: 'preventive' | 'corrective';
  scheduledDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdBy: string;
  description?: string;
}

export function PendingMaintenances() {
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  // Mock data - en producción vendría de la API
  const [maintenances, setMaintenances] = useState<Maintenance[]>([
    {
      id: '1',
      vehicleId: 'V001',
      vehicleName: 'Moto Honda CB190',
      vehicleType: 'Moto',
      branch: 'Sucursal Centro',
      type: 'preventive',
      scheduledDate: '2025-11-08',
      status: 'pending',
      createdBy: 'Sistema',
    },
    {
      id: '2',
      vehicleId: 'V015',
      vehicleName: 'Patineta Xiaomi Pro 2',
      vehicleType: 'Patineta Eléctrica',
      branch: 'Sucursal Norte',
      type: 'corrective',
      scheduledDate: '2025-11-08',
      status: 'pending',
      createdBy: 'Admin Principal',
      description: 'Batería no carga correctamente'
    },
    {
      id: '3',
      vehicleId: 'V023',
      vehicleName: 'Bicicleta Trek FX 3',
      vehicleType: 'Bicicleta Eléctrica',
      branch: 'Sucursal Sur',
      type: 'preventive',
      scheduledDate: '2025-11-07',
      status: 'pending',
      createdBy: 'Sistema',
    },
  ]);

  const handleStartMaintenance = (maintenance: Maintenance) => {
    setMaintenances(prev =>
      prev.map(m =>
        m.id === maintenance.id
          ? { ...m, status: 'in-progress' }
          : m
      )
    );
    toast.success(`Mantenimiento iniciado para ${maintenance.vehicleName}`);
  };

  const handleCompleteMaintenance = (data: {
    notes: string;
    nextPreventiveDate?: string;
    parts: Array<{ id: string; name: string; quantity: number; unitCost: number }>;
    laborCost: number;
    workDuration: number;
  }) => {
    if (!selectedMaintenance) return;

    setMaintenances(prev =>
      prev.map(m =>
        m.id === selectedMaintenance.id
          ? { ...m, status: 'completed' }
          : m
      )
    );

    const totalCost = data.parts.reduce((sum, part) => sum + (part.quantity * part.unitCost), 0) + data.laborCost;

    toast.success(
      selectedMaintenance.type === 'preventive'
        ? `Mantenimiento preventivo completado. Costo total: $${totalCost.toLocaleString('es-CO')} COP. Próxima fecha: ${data.nextPreventiveDate}`
        : `Mantenimiento correctivo completado. Costo total: $${totalCost.toLocaleString('es-CO')} COP`
    );

    setSelectedMaintenance(null);
  };

  const openCompleteDialog = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowCompleteDialog(true);
  };

  const pendingMaintenances = maintenances.filter(m => m.status === 'pending');
  const inProgressMaintenances = maintenances.filter(m => m.status === 'in-progress');
  const completedMaintenances = maintenances.filter(m => m.status === 'completed');

  const stats = [
    {
      title: 'Pendientes',
      value: pendingMaintenances.length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'En Proceso',
      value: inProgressMaintenances.length,
      icon: Wrench,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completados Hoy',
      value: completedMaintenances.length,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Mantenimientos</h1>
        <p className="text-muted-foreground">
          Gestiona los mantenimientos preventivos y correctivos de los vehículos
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending and In Progress Maintenances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Mantenimientos Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[...pendingMaintenances, ...inProgressMaintenances].length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold">¡Todo al día!</p>
              <p className="text-muted-foreground">No hay mantenimientos pendientes en este momento</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Fecha Programada</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...pendingMaintenances, ...inProgressMaintenances].map((maintenance) => (
                  <TableRow key={maintenance.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{maintenance.vehicleName}</div>
                        <div className="text-sm text-muted-foreground">{maintenance.vehicleType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={maintenance.type === 'preventive' ? 'default' : 'destructive'}
                        className={
                          maintenance.type === 'preventive'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                        }
                      >
                        {maintenance.type === 'preventive' ? (
                          <>
                            <Calendar className="w-3 h-3 mr-1" />
                            Preventivo
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Correctivo
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{maintenance.vehicleType}</span>
                    </TableCell>
                    <TableCell>{maintenance.branch}</TableCell>
                    <TableCell>{new Date(maintenance.scheduledDate).toLocaleDateString('es-CO')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={maintenance.status === 'pending' ? 'secondary' : 'default'}
                        className={
                          maintenance.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                        }
                      >
                        {maintenance.status === 'pending' ? 'Pendiente' : 'En Proceso'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {maintenance.description || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {maintenance.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartMaintenance(maintenance)}
                          >
                            Iniciar
                          </Button>
                        )}
                        {maintenance.status === 'in-progress' && (
                          <Button
                            size="sm"
                            onClick={() => openCompleteDialog(maintenance)}
                          >
                            Completar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Completed Maintenances */}
      {completedMaintenances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              Mantenimientos Completados Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedMaintenances.map((maintenance) => (
                  <TableRow key={maintenance.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{maintenance.vehicleName}</div>
                        <div className="text-sm text-muted-foreground">{maintenance.vehicleType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={maintenance.type === 'preventive' ? 'default' : 'destructive'}
                        className={
                          maintenance.type === 'preventive'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                        }
                      >
                        {maintenance.type === 'preventive' ? 'Preventivo' : 'Correctivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>{maintenance.branch}</TableCell>
                    <TableCell>{new Date(maintenance.scheduledDate).toLocaleDateString('es-CO')}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Completado
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Complete Maintenance Dialog */}
      {selectedMaintenance && (
        <CompleteMaintenanceDialog
          open={showCompleteDialog}
          onOpenChange={setShowCompleteDialog}
          maintenance={selectedMaintenance}
          onComplete={handleCompleteMaintenance}
        />
      )}
    </div>
  );
}
