import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Bike, 
  Car, 
  Truck, 
  Zap, 
  Filter,
  Search
} from 'lucide-react';

interface VehicleAvailabilityProps {
  onReserveVehicle?: (vehicle: any) => void;
}

export const VehicleAvailability: React.FC<VehicleAvailabilityProps> = ({ onReserveVehicle }) => {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const branches = [
    { id: '1', name: 'Sucursal Centro', address: 'Carrera 7 #12-34, Centro' },
    { id: '2', name: 'Sucursal Norte', address: 'Calle 100 #15-25, Chapinero' },
    { id: '3', name: 'Sucursal Sur', address: 'Avenida Sur #45-67, Kennedy' },
  ];

  const vehicles = [
    { id: 'VH001', name: 'Honda XR 150', type: 'Moto', branch: '1', status: 'Disponible', pricePerHour: '8.000', features: ['150cc', 'Automática', 'Económica'] },
    { id: 'VH002', name: 'Yamaha FZ 150', type: 'Moto', branch: '1', status: 'Disponible', pricePerHour: '8.500', features: ['150cc', 'Manual', 'Deportiva'] },
    { id: 'VH003', name: 'Suzuki GN 125', type: 'Moto', branch: '2', status: 'Disponible', pricePerHour: '7.000', features: ['125cc', 'Manual', 'Económica'] },
    { id: 'VH004', name: 'Xiaomi Mi Scooter Pro', type: 'Patineta Eléctrica', branch: '1', status: 'Disponible', pricePerHour: '6.000', features: ['Hasta 25km', 'Plegable', 'Luces LED'] },
    { id: 'VH005', name: 'Segway Ninebot', type: 'Patineta Eléctrica', branch: '2', status: 'Disponible', pricePerHour: '6.500', features: ['Hasta 30km', 'App control', 'Bluetooth'] },
    { id: 'VH006', name: 'Trek E-Bike', type: 'Bicicleta Eléctrica', branch: '1', status: 'Disponible', pricePerHour: '7.000', features: ['50km autonomía', 'Pedaleo asistido', 'Display digital'] },
    { id: 'VH007', name: 'Giant E-Bike Pro', type: 'Bicicleta Eléctrica', branch: '3', status: 'Disponible', pricePerHour: '7.500', features: ['60km autonomía', '5 niveles asistencia', 'Sistema eléctrico'] },
    { id: 'VH008', name: 'Specialized Rockhopper', type: 'Bicicleta', branch: '1', status: 'Disponible', pricePerHour: '4.000', features: ['21 velocidades', 'Montañera', 'Suspensión delantera'] },
    { id: 'VH009', name: 'Trek FX', type: 'Bicicleta', branch: '2', status: 'Disponible', pricePerHour: '4.500', features: ['Urbana', 'Liviana', 'Cómoda'] },
    { id: 'VH010', name: 'Rollerblade Zetrablade', type: 'Patines', branch: '1', status: 'Disponible', pricePerHour: '3.500', features: ['Cómodos', 'Para principiantes', 'Ruedas resistentes'] },
    { id: 'VH011', name: 'K2 Alexis', type: 'Patines', branch: '2', status: 'Disponible', pricePerHour: '4.000', features: ['Para intermedio', 'Ajustables', 'Diseño ergonómico'] },
    { id: 'VH012', name: 'Honda CB 125', type: 'Moto', branch: '2', status: 'Arrendado', pricePerHour: '7.500', features: ['125cc', 'Automática', 'Económica'] },
    { id: 'VH013', name: 'Trek Powerfly', type: 'Bicicleta Eléctrica', branch: '1', status: 'Mantenimiento', pricePerHour: '8.000', features: ['80km autonomía', 'Montañera', 'Suspensión'] }
  ];

  const vehicleTypes = [
    'Moto',
    'Patineta Eléctrica', 
    'Bicicleta Eléctrica',
    'Bicicleta',
    'Patines'
  ];

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'Moto':
        return <Car className="h-5 w-5" />;
      case 'Patineta Eléctrica':
        return <Zap className="h-5 w-5" />;
      case 'Bicicleta Eléctrica':
        return <Bike className="h-5 w-5" />;
      case 'Bicicleta':
        return <Bike className="h-5 w-5" />;
      case 'Patines':
        return <Truck className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Arrendado':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Mantenimiento':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesBranch = selectedBranch === 'all' || vehicle.branch === selectedBranch;
    const matchesType = selectedType === 'all' || vehicle.type === selectedType;
    const matchesSearch = !searchTerm || 
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesBranch && matchesType && matchesSearch;
  });

  const availableVehicles = filteredVehicles.filter(v => v.status === 'Disponible');

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros de Búsqueda</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Sucursal</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las sucursales" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las sucursales</SelectItem>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Vehículo</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {vehicleTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>Hora</Label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Buscar Vehículo</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de resultados */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Vehículos Disponibles</h3>
          <p className="text-sm text-muted-foreground">
            {availableVehicles.length} de {filteredVehicles.length} vehículos disponibles
            {selectedBranch !== 'all' && (
              <span> en {branches.find(b => b.id === selectedBranch)?.name}</span>
            )}
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          {availableVehicles.length} disponibles
        </Badge>
      </div>

      {/* Lista de vehículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map(vehicle => (
          <Card key={vehicle.id} className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              {getVehicleIcon(vehicle.type)}
              <span className="ml-2 text-sm text-muted-foreground">{vehicle.name}</span>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{vehicle.name}</h4>
                <Badge 
                  variant="outline"
                  className={`text-xs ${getStatusColor(vehicle.status)}`}
                >
                  {vehicle.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-2">{vehicle.type}</p>

              <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4" />
                <span>{branches.find(b => b.id === vehicle.branch)?.name}</span>
              </div>

              <div className="space-y-2 mb-4">
                {vehicle.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs mr-1">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">${vehicle.pricePerHour}/hora</p>
                </div>
                <Button 
                  size="sm" 
                  disabled={vehicle.status !== 'Disponible'}
                  className="min-w-[80px]"
                  onClick={() => vehicle.status === 'Disponible' && onReserveVehicle && onReserveVehicle(vehicle)}
                >
                  {vehicle.status === 'Disponible' ? 'Reservar' : vehicle.status}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No se encontraron vehículos con los filtros seleccionados.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSelectedBranch('all');
                setSelectedType('all');
                setSearchTerm('');
              }}
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};