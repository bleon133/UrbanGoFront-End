import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Eye, Wrench, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';

export interface Maintenance {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePhoto?: string;
  type: 'preventivo' | 'correctivo';
  category: string;
  branch: string;
  scheduledDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  description?: string;
  priority?: 'baja' | 'media' | 'alta';
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
}

interface MaintenancesTableProps {
  maintenances: Maintenance[];
  onViewDetails?: (maintenance: Maintenance) => void;
}

export const MaintenancesTable: React.FC<MaintenancesTableProps> = ({ 
  maintenances,
  onViewDetails 
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En Proceso</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'preventivo' ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <Calendar className="h-3 w-3 mr-1" />
        Preventivo
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Correctivo
      </Badge>
    );
  };



  if (maintenances.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No hay mantenimientos registrados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Mantenimientos</CardTitle>
        <CardDescription>
          Vista de solo lectura de todos los mantenimientos del sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehículo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Sucursal</TableHead>
                <TableHead>Fecha Prog.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenances.map((maintenance) => (
                <TableRow key={maintenance.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={maintenance.vehiclePhoto} />
                        <AvatarFallback>
                          <Wrench className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{maintenance.vehicleName}</p>
                        <p className="text-xs text-muted-foreground">ID: {maintenance.vehicleId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(maintenance.type)}</TableCell>
                  <TableCell>{maintenance.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{maintenance.branch}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{new Date(maintenance.scheduledDate).toLocaleDateString('es-CO')}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
                  <TableCell className="text-right">
                    {onViewDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(maintenance)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
