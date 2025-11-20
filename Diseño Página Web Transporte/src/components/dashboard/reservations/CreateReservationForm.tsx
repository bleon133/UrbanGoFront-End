import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { cn } from "../../ui/utils";
import { ArrowLeft, Calendar as CalendarIcon, User, MapPin, Truck, CreditCard, Clock, Building2, Home, CheckCircle, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { toast } from 'sonner@2.0.3';

// Función helper para formatear fechas sin librerías externas
const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

interface CreateReservationFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

// Mock data - en producción vendrían de APIs
const mockClients = [
  { id: '1', name: 'Ana García Pérez', email: 'ana.garcia@email.com', phone: '+57 300 123 4567' },
  { id: '2', name: 'Carlos Mendoza López', email: 'carlos.mendoza@email.com', phone: '+57 310 234 5678' },
  { id: '3', name: 'María José Rodríguez', email: 'maria.rodriguez@email.com', phone: '+57 320 345 6789' },
];

const mockBranches = [
  { id: '1', name: 'Sucursal Centro', address: 'Carrera 7 #12-34, Centro' },
  { id: '2', name: 'Sucursal Norte', address: 'Calle 100 #15-25, Chapinero' },
  { id: '3', name: 'Sucursal Sur', address: 'Avenida Sur #45-67, Kennedy' },
];

const mockVehicles = [
  {
    id: '1',
    branchId: '1',
    type: 'moto',
    brand: 'Honda',
    model: 'XR 150',
    pricePerHour: 8000,
    status: 'disponible'
  },
  {
    id: '2',
    branchId: '1',
    type: 'bicicleta-electrica',
    brand: 'Trek',
    model: 'E-Bike 500',
    pricePerHour: 5000,
    status: 'disponible'
  },
  {
    id: '3',
    branchId: '2',
    type: 'patineta-electrica',
    brand: 'Xiaomi',
    model: 'Mi Scooter Pro',
    pricePerHour: 4000,
    status: 'disponible'
  },
  {
    id: '4',
    branchId: '2',
    type: 'bicicleta-manual',
    brand: 'Specialized',
    model: 'Rockhopper',
    pricePerHour: 3000,
    status: 'disponible'
  },
  {
    id: '5',
    branchId: '3',
    type: 'patines-linea',
    brand: 'Rollerblade',
    model: 'Spark 84',
    pricePerHour: 2500,
    status: 'disponible'
  },
];

export const CreateReservationForm: React.FC<CreateReservationFormProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    branchId: '',
    vehicleId: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    startTime: '08:00',
    endTime: '18:00',
    paymentMethod: '',
    
    // Opciones de entrega/recogida
    pickupType: 'branch', // 'branch' o 'delivery'
    returnType: 'branch', // 'branch' o 'delivery'
    
    // Dirección de entrega inicial (si pickupType es 'delivery')
    pickupDeliveryAddress: '',
    pickupDeliveryDetail: '',
    pickupDeliveryCity: '',
    pickupDeliveryNeighborhood: '',
    pickupDeliveryTime: '09:00',
    
    // Dirección de recogida final (si returnType es 'delivery')
    returnPickupAddress: '',
    returnPickupDetail: '',
    returnPickupCity: '',
    returnPickupNeighborhood: '',
    returnPickupTime: '18:00',
    
    notes: '',
  });

  const [availableVehicles, setAvailableVehicles] = useState(mockVehicles);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Filtrar vehículos por sucursal
  useEffect(() => {
    if (formData.branchId) {
      const filtered = mockVehicles.filter(v => v.branchId === formData.branchId && v.status === 'disponible');
      setAvailableVehicles(filtered);
      setFormData(prev => ({ ...prev, vehicleId: '' }));
      setSelectedVehicle(null);
    }
  }, [formData.branchId]);

  // Calcular total de horas y monto
  useEffect(() => {
    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime && selectedVehicle) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      const [startHour, startMin] = formData.startTime.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);
      
      start.setHours(startHour, startMin);
      end.setHours(endHour, endMin);
      
      const diffMs = end.getTime() - start.getTime();
      const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
      
      setTotalHours(hours);
      setTotalAmount(hours * selectedVehicle.pricePerHour);
    }
  }, [formData.startDate, formData.endDate, formData.startTime, formData.endTime, selectedVehicle]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Actualizar datos relacionados
    if (field === 'clientId') {
      const client = mockClients.find(c => c.id === value);
      setSelectedClient(client);
    }
    
    if (field === 'branchId') {
      const branch = mockBranches.find(b => b.id === value);
      setSelectedBranch(branch);
    }
    
    if (field === 'vehicleId') {
      const vehicle = availableVehicles.find(v => v.id === value);
      setSelectedVehicle(vehicle);
    }
  };

  const calculateDeliveryFees = () => {
    let fees = 0;
    if (formData.pickupType === 'delivery') fees += 15000;
    if (formData.returnType === 'delivery') fees += 15000;
    return fees;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmReservation = () => {
    const deliveryFees = calculateDeliveryFees();
    
    const reservationData = {
      ...formData,
      clientName: selectedClient?.name,
      clientEmail: selectedClient?.email,
      clientPhone: selectedClient?.phone,
      branchName: selectedBranch?.name,
      vehicleType: selectedVehicle?.type,
      vehicleBrand: selectedVehicle?.brand,
      vehicleModel: selectedVehicle?.model,
      totalHours,
      pricePerHour: selectedVehicle?.pricePerHour,
      totalAmount,
      deposit: Math.round(totalAmount * 0.3), // 30% de depósito
      deliveryFees,
      totalWithDelivery: totalAmount + deliveryFees,
      paymentStatus: 'pendiente',
      reservationStatus: 'confirmada',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin', // En producción sería el usuario actual
    };
    
    toast.success('Reserva creada exitosamente', {
      description: `Reserva para ${selectedClient?.name} creada correctamente.`
    });
    
    onSave(reservationData);
    setShowConfirmation(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isFormValid = formData.clientId && formData.branchId && formData.vehicleId && 
                     formData.startDate && formData.endDate && formData.paymentMethod;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl">Nueva Reserva</h1>
          <p className="text-muted-foreground">Crear una nueva reserva de vehículo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Cliente</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="client">Seleccionar Cliente</Label>
                <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Buscar cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">{client.email}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedClient && (
                <div className="p-3 bg-muted rounded-lg space-y-1">
                  <p className="font-medium">{selectedClient.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
                </div>
              )}
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
                <Label htmlFor="branch">Seleccionar Sucursal</Label>
                <Select value={formData.branchId} onValueChange={(value) => handleInputChange('branchId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sucursal..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBranches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        <div>
                          <div className="font-medium">{branch.name}</div>
                          <div className="text-sm text-muted-foreground">{branch.address}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedBranch && (
                <div className="p-3 bg-muted rounded-lg space-y-1">
                  <p className="font-medium">{selectedBranch.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedBranch.address}</p>
                </div>
              )}
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
                <Label htmlFor="vehicle">Seleccionar Vehículo</Label>
                <Select 
                  value={formData.vehicleId} 
                  onValueChange={(value) => handleInputChange('vehicleId', value)}
                  disabled={!formData.branchId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.branchId ? "Seleccionar vehículo..." : "Primero selecciona una sucursal"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        <div>
                          <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.type} - {formatCurrency(vehicle.pricePerHour)}/hora
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedVehicle && (
                <div className="p-3 bg-muted rounded-lg space-y-1">
                  <p className="font-medium">{selectedVehicle.brand} {selectedVehicle.model}</p>
                  <p className="text-sm text-muted-foreground">Tipo: {selectedVehicle.type}</p>
                  <p className="text-sm font-medium text-primary">{formatCurrency(selectedVehicle.pricePerHour)}/hora</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Fechas y Horarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Fechas y Horarios</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Fecha de Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? formatDate(formData.startDate) : 'Seleccionar fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleInputChange('startDate', date)}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Hora de Inicio</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>
              
              <div>
                <Label>Fecha de Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn("w-full justify-start text-left font-normal", !formData.endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? formatDate(formData.endDate) : 'Seleccionar fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleInputChange('endDate', date)}
                      disabled={(date) => {
                        if (!formData.startDate) {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }
                        const startDate = new Date(formData.startDate);
                        startDate.setHours(0, 0, 0, 0);
                        return date < startDate;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Hora de Fin</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>
            </div>
            
            {totalHours > 0 && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                <p className="font-medium">Duración total: {totalHours} horas</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Opciones de Entrega/Recogida */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Entrega Inicial */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span>Entrega Inicial del Vehículo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={formData.pickupType} onValueChange={(value) => handleInputChange('pickupType', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="branch" id="pickup-branch" />
                  <Label htmlFor="pickup-branch" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="h-4 w-4" />
                    Cliente recoge en sucursal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="pickup-delivery" />
                  <Label htmlFor="pickup-delivery" className="flex items-center gap-2 cursor-pointer">
                    <Home className="h-4 w-4" />
                    Entrega a domicilio (+$15,000)
                  </Label>
                </div>
              </RadioGroup>

              {formData.pickupType === 'delivery' && (
                <div className="mt-4 p-4 bg-muted rounded-lg space-y-4">
                  <div className="space-y-2">
                    <Label>Dirección de entrega *</Label>
                    <Input
                      placeholder="Calle 72 # 10-34"
                      value={formData.pickupDeliveryAddress}
                      onChange={(e) => handleInputChange('pickupDeliveryAddress', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Detalles adicionales</Label>
                    <Input
                      placeholder="Apartamento, torre, etc."
                      value={formData.pickupDeliveryDetail}
                      onChange={(e) => handleInputChange('pickupDeliveryDetail', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ciudad *</Label>
                      <Input
                        placeholder="Bogotá"
                        value={formData.pickupDeliveryCity}
                        onChange={(e) => handleInputChange('pickupDeliveryCity', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Barrio *</Label>
                      <Input
                        placeholder="Chapinero"
                        value={formData.pickupDeliveryNeighborhood}
                        onChange={(e) => handleInputChange('pickupDeliveryNeighborhood', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Hora de entrega</Label>
                    <Input
                      type="time"
                      value={formData.pickupDeliveryTime}
                      onChange={(e) => handleInputChange('pickupDeliveryTime', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Devolución Final */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <span>Devolución del Vehículo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={formData.returnType} onValueChange={(value) => handleInputChange('returnType', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="branch" id="return-branch" />
                  <Label htmlFor="return-branch" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="h-4 w-4" />
                    Cliente devuelve en sucursal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="return-delivery" />
                  <Label htmlFor="return-delivery" className="flex items-center gap-2 cursor-pointer">
                    <Home className="h-4 w-4" />
                    Recogida a domicilio (+$15,000)
                  </Label>
                </div>
              </RadioGroup>

              {formData.returnType === 'delivery' && (
                <div className="mt-4 p-4 bg-muted rounded-lg space-y-4">
                  <div className="space-y-2">
                    <Label>Dirección de recogida *</Label>
                    <Input
                      placeholder="Carrera 15 # 93-80"
                      value={formData.returnPickupAddress}
                      onChange={(e) => handleInputChange('returnPickupAddress', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Detalles adicionales</Label>
                    <Input
                      placeholder="Casa, conjunto, etc."
                      value={formData.returnPickupDetail}
                      onChange={(e) => handleInputChange('returnPickupDetail', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ciudad *</Label>
                      <Input
                        placeholder="Bogotá"
                        value={formData.returnPickupCity}
                        onChange={(e) => handleInputChange('returnPickupCity', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Barrio *</Label>
                      <Input
                        placeholder="Usaquén"
                        value={formData.returnPickupNeighborhood}
                        onChange={(e) => handleInputChange('returnPickupNeighborhood', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Hora de recogida</Label>
                    <Input
                      type="time"
                      value={formData.returnPickupTime}
                      onChange={(e) => handleInputChange('returnPickupTime', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pago */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Información de Pago</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentMethod">Método de Pago</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método de pago..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                  <SelectItem value="billetera-digital">Billetera Digital (Nequi, Daviplata)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {totalAmount > 0 && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({totalHours} horas):</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                {formData.pickupType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Entrega a domicilio:</span>
                    <span>{formatCurrency(15000)}</span>
                  </div>
                )}
                {formData.returnType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Recogida a domicilio:</span>
                    <span>{formatCurrency(15000)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(totalAmount + calculateDeliveryFees())}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Depósito requerido (30%):</span>
                  <span>{formatCurrency(Math.round(totalAmount * 0.3))}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notas */}
        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Cualquier información adicional sobre la reserva..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!isFormValid}>
            Crear Reserva
          </Button>
        </div>
      </form>

      {/* Modal de Confirmación con Desglose de Tarifas */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              Confirmar Nueva Reserva
            </DialogTitle>
            <DialogDescription>
              Revisa el desglose de tarifas antes de crear la reserva
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Información del Cliente y Vehículo */}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-2">Información de la Reserva</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span>{selectedClient?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehículo:</span>
                  <span>{selectedVehicle?.brand} {selectedVehicle?.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sucursal:</span>
                  <span>{selectedBranch?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duración:</span>
                  <span>{totalHours} horas</span>
                </div>
              </div>
            </div>

            {/* Tarifas del Vehículo */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                Tarifa del Vehículo
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio por hora:</span>
                  <span>{formatCurrency(selectedVehicle?.pricePerHour || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total horas ({totalHours}h):</span>
                  <span className="font-medium">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Tarifas de Domicilios */}
            {(formData.pickupType === 'delivery' || formData.returnType === 'delivery') && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Home className="h-4 w-4 text-green-600" />
                  Tarifas de Domicilio de Vehículos
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Tarifa por entrega/recogida:</span>
                    <span className="font-medium">$15,000 c/u</span>
                  </div>
                  {formData.pickupType === 'delivery' && (
                    <div className="flex justify-between mt-2">
                      <span className="text-muted-foreground">
                        Entrega inicial a cliente
                        {formData.startDate && formData.pickupDeliveryTime && (
                          <span className="block text-xs">
                            {formatDate(formData.startDate)} - {formData.pickupDeliveryTime}
                          </span>
                        )}
                      </span>
                      <span>$15,000</span>
                    </div>
                  )}
                  {formData.returnType === 'delivery' && (
                    <div className="flex justify-between mt-2">
                      <span className="text-muted-foreground">
                        Recogida final del cliente
                        {formData.endDate && formData.returnPickupTime && (
                          <span className="block text-xs">
                            {formatDate(formData.endDate)} - {formData.returnPickupTime}
                          </span>
                        )}
                      </span>
                      <span>$15,000</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    * Un domiciliario será asignado automáticamente en la fecha y hora programada
                  </p>
                </div>
              </div>
            )}

            {/* Resumen Total */}
            <div className="bg-primary/10 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Resumen Total</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal vehículo:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domicilios:</span>
                  <span>{formatCurrency(calculateDeliveryFees())}</span>
                </div>
                <div className="border-t border-border my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Reserva:</span>
                  <span className="text-2xl text-primary">{formatCurrency(totalAmount + calculateDeliveryFees())}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Depósito requerido (30%):</span>
                  <span className="text-muted-foreground">{formatCurrency(Math.round(totalAmount * 0.3))}</span>
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <p className="text-xs text-yellow-900 flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  El domiciliario tomará fotos al recoger y entregar el vehículo para trazabilidad. 
                  El cliente será notificado en cada etapa del proceso.
                </span>
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
              Revisar
            </Button>
            <Button onClick={confirmReservation} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar y Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
