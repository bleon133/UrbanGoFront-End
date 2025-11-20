import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../ui/sheet';
import { Separator } from '../../ui/separator';
import { 
  MapPin, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Phone, 
  Navigation,
  Zap,
  Activity,
  Clock,
  Battery,
  Fuel,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Tipos de transporte disponibles
type VehicleType = 'moto' | 'scooter' | 'bicycle_manual' | 'bicycle_electric' | 'skates';

// Estados de los transportes
type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'offline';

interface Transport {
  id: string;
  name: string;
  type: VehicleType;
  status: VehicleStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
  };
  battery?: number; // Para vehículos eléctricos
  fuel?: number; // Para motos
  lastUpdate: string;
  branch: string;
  currentDelivery?: {
    id: string;
    customer: string;
    destination: string;
  };
}

// Datos de ejemplo - En una aplicación real esto vendría de una API
const mockTransports: Transport[] = [
  {
    id: 'T001',
    name: 'Moto Yamaha 001',
    type: 'moto',
    status: 'in_use',
    location: {
      lat: 7.1193,
      lng: -73.1227,
      address: 'Carrera 27 #34-12, Cabecera'
    },
    driver: {
      id: 'D001',
      name: 'Carlos Mendoza',
      phone: '+57 300 123 4567'
    },
    fuel: 85,
    lastUpdate: '2 min',
    branch: 'Cabecera',
    currentDelivery: {
      id: 'DOM-001',
      customer: 'Ana Rodríguez',
      destination: 'Calle 45 #23-67'
    }
  },
  {
    id: 'T002',
    name: 'Patineta Eléctrica 002',
    type: 'scooter',
    status: 'available',
    location: {
      lat: 7.1235,
      lng: -73.1198,
      address: 'Carrera 33 #45-23, Cabecera'
    },
    battery: 92,
    lastUpdate: '1 min',
    branch: 'Cabecera'
  },
  {
    id: 'T003',
    name: 'Bicicleta Eléctrica 003',
    type: 'bicycle_electric',
    status: 'in_use',
    location: {
      lat: 7.1156,
      lng: -73.1278,
      address: 'Calle 56 #23-45, Cañaveral'
    },
    driver: {
      id: 'D003',
      name: 'María García',
      phone: '+57 310 987 6543'
    },
    battery: 67,
    lastUpdate: '3 min',
    branch: 'Cañaveral'
  },
  {
    id: 'T004',
    name: 'Moto Honda 004',
    type: 'moto',
    status: 'maintenance',
    location: {
      lat: 7.1089,
      lng: -73.1134,
      address: 'Carrera 15 #78-90, Centro'
    },
    fuel: 45,
    lastUpdate: '15 min',
    branch: 'Centro'
  },
  {
    id: 'T005',
    name: 'Patines 005',
    type: 'skates',
    status: 'available',
    location: {
      lat: 7.1267,
      lng: -73.1289,
      address: 'Calle 42 #67-12, Cabecera'
    },
    lastUpdate: '5 min',
    branch: 'Cabecera'
  }
];

export const TransportMapManagement: React.FC = () => {
  const [transports, setTransports] = useState<Transport[]>(mockTransports);
  const [filteredTransports, setFilteredTransports] = useState<Transport[]>(mockTransports);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const branches = ['Cabecera', 'Cañaveral', 'Centro', 'Girón'];

  // Simular actualización en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setTransports(prevTransports => 
        prevTransports.map(transport => ({
          ...transport,
          lastUpdate: Math.random() > 0.7 ? `${Math.floor(Math.random() * 5) + 1} min` : transport.lastUpdate,
          location: {
            ...transport.location,
            lat: transport.location.lat + (Math.random() - 0.5) * 0.001,
            lng: transport.location.lng + (Math.random() - 0.5) * 0.001
          }
        }))
      );
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Filtrar transportes
  useEffect(() => {
    let filtered = transports;

    if (searchTerm) {
      filtered = filtered.filter(transport => 
        transport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transport.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transport.driver?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(transport => transport.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(transport => transport.type === typeFilter);
    }

    if (branchFilter !== 'all') {
      filtered = filtered.filter(transport => transport.branch === branchFilter);
    }

    setFilteredTransports(filtered);
  }, [transports, searchTerm, statusFilter, typeFilter, branchFilter]);

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'in_use': return 'bg-blue-100 text-blue-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'offline': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: VehicleStatus) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'in_use': return <Activity className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      case 'offline': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getVehicleTypeLabel = (type: VehicleType) => {
    switch (type) {
      case 'moto': return 'Moto';
      case 'scooter': return 'Patineta Eléctrica';
      case 'bicycle_manual': return 'Bicicleta Manual';
      case 'bicycle_electric': return 'Bicicleta Eléctrica';
      case 'skates': return 'Patines en Línea';
      default: return type;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular llamada a API
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const statusCounts = {
    total: transports.length,
    available: transports.filter(t => t.status === 'available').length,
    in_use: transports.filter(t => t.status === 'in_use').length,
    maintenance: transports.filter(t => t.status === 'maintenance').length,
    offline: transports.filter(t => t.status === 'offline').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="font-bold">Mapa de Transportes</h1>
          <p className="text-muted-foreground">
            Ubicación en tiempo real de todos los vehículos de la flota
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold">{statusCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disponibles</p>
                <p className="font-bold text-green-600">{statusCounts.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Uso</p>
                <p className="font-bold text-blue-600">{statusCounts.in_use}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mantenimiento</p>
                <p className="font-bold text-yellow-600">{statusCounts.maintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuera de Línea</p>
                <p className="font-bold text-red-600">{statusCounts.offline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Control y Filtros */}
        <div className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Buscar</label>
                <Input
                  placeholder="ID, nombre o conductor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">Estado</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="in_use">En uso</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="offline">Fuera de línea</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block">Tipo de Vehículo</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                    <SelectItem value="scooter">Patineta Eléctrica</SelectItem>
                    <SelectItem value="bicycle_manual">Bicicleta Manual</SelectItem>
                    <SelectItem value="bicycle_electric">Bicicleta Eléctrica</SelectItem>
                    <SelectItem value="skates">Patines en Línea</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block">Sucursal</label>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las sucursales</SelectItem>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setBranchFilter('all');
                }}
              >
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Transportes */}
          <Card>
            <CardHeader>
              <CardTitle>
                Transportes ({filteredTransports.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTransports.map((transport) => (
                  <div
                    key={transport.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTransport?.id === transport.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-accent'
                    }`}
                    onClick={() => setSelectedTransport(transport)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transport.status)}
                        <span className="font-medium text-sm">{transport.name}</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(transport.status)}`}
                      >
                        {transport.status === 'available' && 'Disponible'}
                        {transport.status === 'in_use' && 'En uso'}
                        {transport.status === 'maintenance' && 'Mantenimiento'}
                        {transport.status === 'offline' && 'Fuera de línea'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{transport.location.address}</span>
                      </div>
                      
                      {transport.driver && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Activity className="h-3 w-3 mr-1" />
                          <span>{transport.driver.name}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{getVehicleTypeLabel(transport.type)}</span>
                        <span>Actualizado hace {transport.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mapa */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Mapa en Tiempo Real</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  En vivo
                </Badge>
              </CardTitle>
              <CardDescription>
                Ubicación GPS actualizada automáticamente cada 30 segundos
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div 
                ref={mapRef}
                className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-b-lg flex items-center justify-center relative overflow-hidden"
              >
                {/* Simulación de mapa interactivo */}
                <div className="absolute inset-0 p-4">
                  <div className="grid grid-cols-4 gap-4 h-full">
                    {filteredTransports.map((transport, index) => (
                      <div
                        key={transport.id}
                        className={`
                          absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer
                          transform transition-all duration-300 hover:scale-110
                          ${transport.status === 'available' ? 'bg-green-500' : ''}
                          ${transport.status === 'in_use' ? 'bg-blue-500' : ''}
                          ${transport.status === 'maintenance' ? 'bg-yellow-500' : ''}
                          ${transport.status === 'offline' ? 'bg-red-500' : ''}
                          ${selectedTransport?.id === transport.id ? 'ring-4 ring-primary/50 scale-125' : ''}
                        `}
                        style={{
                          left: `${20 + (index * 15) % 60}%`,
                          top: `${15 + (index * 20) % 50}%`
                        }}
                        title={`${transport.name} - ${transport.location.address}`}
                        onClick={() => setSelectedTransport(transport)}
                      >
                        {transport.status === 'in_use' && (
                          <div className="absolute -inset-2 border-2 border-blue-300 rounded-full animate-ping"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Indicador de mapa interactivo */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <p className="font-medium mb-2">Mapa Interactivo GPS</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Disponible</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>En uso</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Mantenimiento</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Fuera de línea</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Panel de Detalles del Transporte Seleccionado */}
      {selectedTransport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Detalles de {selectedTransport.name}</span>
              </div>
              <Badge 
                variant="secondary" 
                className={getStatusColor(selectedTransport.status)}
              >
                {getStatusIcon(selectedTransport.status)}
                <span className="ml-1">
                  {selectedTransport.status === 'available' && 'Disponible'}
                  {selectedTransport.status === 'in_use' && 'En uso'}
                  {selectedTransport.status === 'maintenance' && 'Mantenimiento'}
                  {selectedTransport.status === 'offline' && 'Fuera de línea'}
                </span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Información Básica */}
              <div className="space-y-3">
                <h4 className="font-medium">Información Básica</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-medium">{selectedTransport.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">{getVehicleTypeLabel(selectedTransport.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sucursal:</span>
                    <span className="font-medium">{selectedTransport.branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última actualización:</span>
                    <span className="font-medium">Hace {selectedTransport.lastUpdate}</span>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-3">
                <h4 className="font-medium">Ubicación GPS</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>{selectedTransport.location.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Latitud:</span>
                    <span className="font-medium">{selectedTransport.location.lat.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Longitud:</span>
                    <span className="font-medium">{selectedTransport.location.lng.toFixed(6)}</span>
                  </div>
                </div>
              </div>

              {/* Conductor */}
              <div className="space-y-3">
                <h4 className="font-medium">Conductor</h4>
                {selectedTransport.driver ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre:</span>
                      <span className="font-medium">{selectedTransport.driver.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teléfono:</span>
                      <span className="font-medium">{selectedTransport.driver.phone}</span>
                    </div>
                    {selectedTransport.currentDelivery && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700 font-medium mb-1">Domicilio Actual:</p>
                        <p className="text-xs text-blue-600">{selectedTransport.currentDelivery.customer}</p>
                        <p className="text-xs text-blue-500">{selectedTransport.currentDelivery.destination}</p>
                      </div>
                    )}
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin conductor asignado</p>
                )}
              </div>

              {/* Estado del Vehículo */}
              <div className="space-y-3">
                <h4 className="font-medium">Estado del Vehículo</h4>
                <div className="space-y-2 text-sm">
                  {selectedTransport.battery !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center">
                        <Battery className="h-4 w-4 mr-1" />
                        Batería:
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{selectedTransport.battery}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              selectedTransport.battery > 50 ? 'bg-green-500' : 
                              selectedTransport.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${selectedTransport.battery}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedTransport.fuel !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center">
                        <Fuel className="h-4 w-4 mr-1" />
                        Combustible:
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{selectedTransport.fuel}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              selectedTransport.fuel > 50 ? 'bg-green-500' : 
                              selectedTransport.fuel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${selectedTransport.fuel}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Navigation className="h-4 w-4 mr-2" />
                    Ver en Mapa
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};