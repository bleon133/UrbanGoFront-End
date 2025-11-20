import React, { useMemo } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { BranchOption, Vehicle } from './types';
import { Badge } from '../../ui/badge';
import { Trash2, Eye, Plus, FilterX, Search } from 'lucide-react';

const VEHICLE_TYPES = [
  { value: 'moto', label: 'Moto' },
  { value: 'patineta-electrica', label: 'Patineta Electrica' },
  { value: 'bicicleta', label: 'Bicicleta' },
];

const STATUS_OPTIONS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'arrendado', label: 'Arrendado' },
  { value: 'en-mantenimiento', label: 'En mantenimiento' },
  { value: 'en-bodega', label: 'En bodega' },
];

interface VehiclesTableProps {
  vehicles: Vehicle[];
  branches: BranchOption[];
  filters: { search: string; type: string; status: string; branch: string };
  onFilterChange: (key: 'search' | 'type' | 'status' | 'branch', value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onViewVehicle: (vehicle: Vehicle) => void;
  onCreateVehicle: () => void;
  onDeleteVehicle: (vehicle: Vehicle) => Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const VehiclesTable: React.FC<VehiclesTableProps> = ({
  vehicles,
  branches,
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  onViewVehicle,
  onCreateVehicle,
  onDeleteVehicle,
  isLoading,
  errorMessage,
}) => {
  const total = vehicles.length;
  const branchMap = useMemo(() => {
    const map = new Map<string, string>();
    branches.forEach((branch) => map.set(branch.id, branch.name));
    return map;
  }, [branches]);

  const typeValue = filters.type || 'all';
  const statusValue = filters.status || 'all';
  const branchValue = filters.branch || 'all';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Transportes</CardTitle>
            <CardDescription>Controla los vehículos disponibles en cada sucursal</CardDescription>
          </div>
          <Button onClick={onCreateVehicle}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar transporte
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Búsqueda</label>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por marca, modelo o placa"
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="ml-2"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select
              value={typeValue}
              onValueChange={(value) => onFilterChange('type', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {VEHICLE_TYPES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Select
              value={statusValue}
              onValueChange={(value) => onFilterChange('status', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sucursal</label>
            <Select
              value={branchValue}
              onValueChange={(value) => onFilterChange('branch', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            Total de transportes: <span className="font-semibold text-foreground">{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <FilterX className="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
            <Button size="sm" onClick={onApplyFilters}>
              Aplicar filtros
            </Button>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{errorMessage}</div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehículo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Sucursal</TableHead>
                <TableHead className="w-[160px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Cargando transportes...
                  </TableCell>
                </TableRow>
              ) : vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay transportes registrados con los filtros actuales.
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={vehicle.photo} alt={vehicle.model} />
                          <AvatarFallback>
                            {vehicle.brand?.charAt(0)}
                            {vehicle.model?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{vehicle.brand || 'Sin marca'}</p>
                          <p className="text-sm text-muted-foreground">{vehicle.model || 'Sin modelo'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{vehicle.type || 'N/A'}</TableCell>
                    <TableCell>{vehicle.licensePlate || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.status === 'disponible' ? 'secondary' : 'outline'}>
                        {vehicle.status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{vehicle.branchName || branchMap.get(vehicle.branchId) || 'No asignada'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => onViewVehicle(vehicle)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await onDeleteVehicle(vehicle);
                            } catch (error) {
                              console.error('Error eliminando vehículo', error);
                            }
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
