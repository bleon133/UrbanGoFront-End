import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  CreditCard, 
  Truck, 
  Home,
  AlertCircle,
  CheckCircle,
  Building2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { toast } from 'sonner@2.0.3';

interface CreateHomeDeliveryReservationProps {
  preselectedVehicle?: any;
  onBack?: () => void;
}

export const CreateHomeDeliveryReservation: React.FC<CreateHomeDeliveryReservationProps> = ({ 
  preselectedVehicle,
  onBack 
}) => {
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: preselectedVehicle?.id || '',
    vehicleType: preselectedVehicle?.type || '',
    branchId: preselectedVehicle?.branch || '',
    
    // Opciones de entrega/recogida
    pickupType: 'branch', // 'branch' o 'delivery'
    returnType: 'branch', // 'branch' o 'delivery'
    
    // Dirección de entrega inicial (si pickupType es 'delivery')
    pickupDeliveryAddress: '',
    pickupDeliveryDetail: '',
    pickupDeliveryCity: '',
    pickupDeliveryNeighborhood: '',
    pickupDeliveryDate: '',
    pickupDeliveryTime: '',
    
    // Dirección de recogida final (si returnType es 'delivery')
    returnPickupAddress: '',
    returnPickupDetail: '',
    returnPickupCity: '',
    returnPickupNeighborhood: '',
    returnPickupDate: '',
    returnPickupTime: '',
    
    // Pago y otros
    paymentMethod: '',
    selectedCard: '', // ID de la tarjeta seleccionada si paymentMethod es 'card'
    specialInstructions: '',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<string[]>([]);

  const vehicles = [
    { id: 'VH001', name: 'Honda XR 150', type: 'Moto', branch: '1', status: 'Disponible', price: '8.000', features: ['150cc', 'Automática', 'Económica'] },
    { id: 'VH002', name: 'Yamaha FZ 150', type: 'Moto', branch: '1', status: 'Disponible', price: '8.500', features: ['150cc', 'Manual', 'Deportiva'] },
    { id: 'VH003', name: 'Suzuki GN 125', type: 'Moto', branch: '2', status: 'Disponible', price: '7.000', features: ['125cc', 'Manual', 'Económica'] },
    { id: 'VH004', name: 'Xiaomi Mi Scooter Pro', type: 'Patineta Eléctrica', branch: '1', status: 'Disponible', price: '6.000', features: ['Hasta 25km', 'Plegable', 'Luces LED'] },
    { id: 'VH005', name: 'Segway Ninebot', type: 'Patineta Eléctrica', branch: '2', status: 'Disponible', price: '6.500', features: ['Hasta 30km', 'App control', 'Bluetooth'] },
    { id: 'VH006', name: 'Trek E-Bike', type: 'Bicicleta Eléctrica', branch: '1', status: 'Disponible', price: '7.000', features: ['50km autonomía', 'Pedaleo asistido', 'Display digital'] },
    { id: 'VH007', name: 'Giant E-Bike Pro', type: 'Bicicleta Eléctrica', branch: '3', status: 'Disponible', price: '7.500', features: ['60km autonomía', '5 niveles asistencia', 'Sistema eléctrico'] },
    { id: 'VH008', name: 'Specialized Rockhopper', type: 'Bicicleta', branch: '1', status: 'Disponible', price: '4.000', features: ['21 velocidades', 'Montañera', 'Suspensión delantera'] },
    { id: 'VH009', name: 'Trek FX', type: 'Bicicleta', branch: '2', status: 'Disponible', price: '4.500', features: ['Urbana', 'Liviana', 'Cómoda'] },
    { id: 'VH010', name: 'Rollerblade Zetrablade', type: 'Patines', branch: '1', status: 'Disponible', price: '3.500', features: ['Cómodos', 'Para principiantes', 'Ruedas resistentes'] },
    { id: 'VH011', name: 'K2 Alexis', type: 'Patines', branch: '2', status: 'Disponible', price: '4.000', features: ['Para intermedio', 'Ajustables', 'Diseño ergonómico'] }
  ];

  const branches = [
    { id: '1', name: 'Sucursal Centro', address: 'Carrera 7 #12-34, Centro' },
    { id: '2', name: 'Sucursal Norte', address: 'Calle 100 #15-25, Chapinero' },
    { id: '3', name: 'Sucursal Sur', address: 'Avenida Sur #45-67, Kennedy' },
  ];

  const paymentMethods = [
    { id: 'cash', name: 'Efectivo', description: 'Pago al recibir el vehículo' },
    { id: 'card', name: 'Tarjeta de Débito', description: 'Pago con tarjeta registrada' }
  ];

  // Tarjetas de débito registradas del usuario (simulado - en producción vendría del perfil)
  const userCards = [
    {
      id: '1',
      number: '**** **** **** 4567',
      brand: 'Visa',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2',
      number: '**** **** **** 8901',
      brand: 'Mastercard',
      expiry: '08/26',
      isDefault: false
    }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Variables computadas
  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
  const selectedBranch = branches.find(b => b.id === formData.branchId);
  const availableVehicles = formData.branchId 
    ? vehicles.filter(v => v.branch === formData.branchId && v.status === 'Disponible')
    : [];

  // Efecto para preseleccionar vehículo cuando viene de disponibilidad
  useEffect(() => {
    if (preselectedVehicle && !formData.vehicleId) {
      setFormData(prev => ({
        ...prev,
        vehicleId: preselectedVehicle.id,
        vehicleType: preselectedVehicle.type,
        branchId: preselectedVehicle.branch
      }));
    }
  }, [preselectedVehicle]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Si cambia la sucursal, limpiar el vehículo si ya no está disponible en esa sucursal
    if (field === 'branchId' && value) {
      const vehicleStillAvailable = vehicles.find(v => v.id === formData.vehicleId && v.branch === value);
      if (!vehicleStillAvailable) {
        setFormData(prev => ({ ...prev, vehicleId: '', vehicleType: '' }));
      }
    }
    
    // Si selecciona un vehículo, actualizar el tipo automáticamente
    if (field === 'vehicleId' && value) {
      const vehicle = vehicles.find(v => v.id === value);
      if (vehicle) {
        setFormData(prev => ({ ...prev, vehicleType: vehicle.type }));
      }
    }
  };

  const validateStep = (stepNumber: number): string[] => {
    const newErrors: string[] = [];

    if (stepNumber === 1) {
      if (!formData.branchId) newErrors.push('Selecciona una sucursal');
      if (!formData.vehicleId) newErrors.push('Selecciona un vehículo');
    }

    if (stepNumber === 2) {
      // Validar entrega inicial
      if (formData.pickupType === 'delivery') {
        if (!formData.pickupDeliveryAddress.trim()) newErrors.push('La dirección de entrega inicial es requerida');
        if (!formData.pickupDeliveryCity.trim()) newErrors.push('La ciudad de entrega es requerida');
        if (!formData.pickupDeliveryNeighborhood.trim()) newErrors.push('El barrio de entrega es requerido');
        if (!formData.pickupDeliveryDate) newErrors.push('La fecha de entrega es requerida');
        if (!formData.pickupDeliveryTime) newErrors.push('La hora de entrega es requerida');
        
        // Validar que la fecha no sea anterior a hoy
        if (formData.pickupDeliveryDate) {
          const selectedDate = new Date(formData.pickupDeliveryDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            newErrors.push('La fecha de entrega no puede ser anterior a hoy');
          }
        }
      }

      // Validar devolución
      if (formData.returnType === 'delivery') {
        if (!formData.returnPickupAddress.trim()) newErrors.push('La dirección de recogida final es requerida');
        if (!formData.returnPickupCity.trim()) newErrors.push('La ciudad de recogida es requerida');
        if (!formData.returnPickupNeighborhood.trim()) newErrors.push('El barrio de recogida es requerido');
        if (!formData.returnPickupDate) newErrors.push('La fecha de recogida es requerida');
        if (!formData.returnPickupTime) newErrors.push('La hora de recogida es requerida');

        // Validar que la fecha de devolución sea posterior a la de entrega
        if (formData.pickupType === 'delivery' && formData.pickupDeliveryDate && formData.returnPickupDate) {
          const deliveryDate = new Date(formData.pickupDeliveryDate + 'T' + formData.pickupDeliveryTime);
          const returnDate = new Date(formData.returnPickupDate + 'T' + formData.returnPickupTime);
          
          if (returnDate <= deliveryDate) {
            newErrors.push('La fecha de recogida debe ser posterior a la de entrega');
          }
        }
      }
    }

    if (stepNumber === 3) {
      if (!formData.paymentMethod) newErrors.push('Selecciona un método de pago');
      if (formData.paymentMethod === 'card' && !formData.selectedCard) {
        newErrors.push('Selecciona una tarjeta de débito');
      }
      if (!formData.agreedToTerms) newErrors.push('Debes aceptar los términos y condiciones');
    }

    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(step);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors([]);
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setErrors([]);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Mostrar modal de confirmación con tarifas
    setShowConfirmation(true);
  };

  const confirmReservation = () => {
    console.log('Datos de reserva:', formData);
    toast.success('¡Reserva confirmada!', {
      description: 'Tu reserva ha sido procesada exitosamente. Recibirás una confirmación por correo.'
    });
    // Aquí se cerraría el modal y se resetearía el formulario
  };

  const calculateDeliveryFees = () => {
    let fees = 0;
    if (formData.pickupType === 'delivery') fees += 15000;
    if (formData.returnType === 'delivery') fees += 15000;
    return fees;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress Steps */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    stepNum <= step 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {stepNum}
                  </div>
                  <div className="ml-2">
                    <p className={`text-sm ${
                      stepNum <= step ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {stepNum === 1 && 'Vehículo'}
                      {stepNum === 2 && 'Entrega/Devolución'}
                      {stepNum === 3 && 'Pago'}
                    </p>
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      stepNum < step ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Step 1: Selección de Sucursal y Vehículo */}
        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Selecciona Sucursal</span>
                </CardTitle>
                <CardDescription>
                  Primero elige la sucursal de referencia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label>Sucursal de Referencia *</Label>
                <Select value={formData.branchId} onValueChange={(value) => handleInputChange('branchId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name} - {branch.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Esta sucursal será usada si decides recoger o devolver en sucursal
                </p>
              </CardContent>
            </Card>

            {/* Mostrar vehículos disponibles solo después de seleccionar sucursal */}
            {formData.branchId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Vehículos Disponibles</span>
                  </CardTitle>
                  <CardDescription>
                    {availableVehicles.length} vehículos disponibles en {selectedBranch?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableVehicles.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No hay vehículos disponibles en esta sucursal. Por favor, selecciona otra sucursal.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {availableVehicles.map(vehicle => (
                        <div
                          key={vehicle.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.vehicleId === vehicle.id
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border hover:border-primary/50 hover:shadow-sm'
                          }`}
                          onClick={() => handleInputChange('vehicleId', vehicle.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{vehicle.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {vehicle.type}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {vehicle.features.map((feature, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground">ID: {vehicle.id}</p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-bold text-primary text-lg">${vehicle.price}</p>
                              <p className="text-xs text-muted-foreground">por hora</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {preselectedVehicle && (
              <Alert className="bg-blue-50 border-blue-200">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  Vehículo preseleccionado: <strong>{preselectedVehicle.name}</strong>
                  {!formData.vehicleId && " - Selecciona la sucursal para continuar"}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Step 2: Información de Entrega/Devolución */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Opciones de Recogida Inicial */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span>¿Cómo recibirás el vehículo?</span>
                </CardTitle>
                <CardDescription>
                  Selecciona si quieres recibirlo en la sucursal o a domicilio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={formData.pickupType} onValueChange={(value) => handleInputChange('pickupType', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="branch" id="pickup-branch" />
                    <Label htmlFor="pickup-branch" className="flex items-center gap-2 cursor-pointer">
                      <Building2 className="h-4 w-4" />
                      Recoger en sucursal (Sin costo adicional)
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
                    <h4 className="font-medium">Dirección de Entrega</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pickupDeliveryAddress">Dirección completa *</Label>
                      <Input
                        id="pickupDeliveryAddress"
                        placeholder="Ej: Calle 72 # 10-34"
                        value={formData.pickupDeliveryAddress}
                        onChange={(e) => handleInputChange('pickupDeliveryAddress', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pickupDeliveryDetail">Detalles adicionales</Label>
                      <Input
                        id="pickupDeliveryDetail"
                        placeholder="Ej: Apartamento 301, Torre B"
                        value={formData.pickupDeliveryDetail}
                        onChange={(e) => handleInputChange('pickupDeliveryDetail', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupDeliveryCity">Ciudad *</Label>
                        <Input
                          id="pickupDeliveryCity"
                          placeholder="Ej: Bogotá"
                          value={formData.pickupDeliveryCity}
                          onChange={(e) => handleInputChange('pickupDeliveryCity', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupDeliveryNeighborhood">Barrio *</Label>
                        <Input
                          id="pickupDeliveryNeighborhood"
                          placeholder="Ej: Chapinero"
                          value={formData.pickupDeliveryNeighborhood}
                          onChange={(e) => handleInputChange('pickupDeliveryNeighborhood', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupDeliveryDate">Fecha de entrega *</Label>
                        <Input
                          id="pickupDeliveryDate"
                          type="date"
                          value={formData.pickupDeliveryDate}
                          onChange={(e) => handleInputChange('pickupDeliveryDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hora de entrega *</Label>
                        <Select value={formData.pickupDeliveryTime} onValueChange={(value) => handleInputChange('pickupDeliveryTime', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona hora" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {formData.pickupType === 'branch' && selectedBranch && (
                  <Alert>
                    <Building2 className="h-4 w-4" />
                    <AlertDescription>
                      Podrás recoger tu vehículo en: <strong>{selectedBranch.name}</strong><br />
                      {selectedBranch.address}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Opciones de Devolución */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <span>¿Cómo devolverás el vehículo?</span>
                </CardTitle>
                <CardDescription>
                  Selecciona si lo devolverás en la sucursal o solicitas recogida a domicilio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={formData.returnType} onValueChange={(value) => handleInputChange('returnType', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="branch" id="return-branch" />
                    <Label htmlFor="return-branch" className="flex items-center gap-2 cursor-pointer">
                      <Building2 className="h-4 w-4" />
                      Devolver en sucursal (Sin costo adicional)
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
                    <h4 className="font-medium">Dirección de Recogida</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="returnPickupAddress">Dirección completa *</Label>
                      <Input
                        id="returnPickupAddress"
                        placeholder="Ej: Carrera 15 # 93-80"
                        value={formData.returnPickupAddress}
                        onChange={(e) => handleInputChange('returnPickupAddress', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="returnPickupDetail">Detalles adicionales</Label>
                      <Input
                        id="returnPickupDetail"
                        placeholder="Ej: Casa 5, Conjunto Residencial"
                        value={formData.returnPickupDetail}
                        onChange={(e) => handleInputChange('returnPickupDetail', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="returnPickupCity">Ciudad *</Label>
                        <Input
                          id="returnPickupCity"
                          placeholder="Ej: Bogotá"
                          value={formData.returnPickupCity}
                          onChange={(e) => handleInputChange('returnPickupCity', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="returnPickupNeighborhood">Barrio *</Label>
                        <Input
                          id="returnPickupNeighborhood"
                          placeholder="Ej: Usaquén"
                          value={formData.returnPickupNeighborhood}
                          onChange={(e) => handleInputChange('returnPickupNeighborhood', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="returnPickupDate">Fecha de recogida *</Label>
                        <Input
                          id="returnPickupDate"
                          type="date"
                          value={formData.returnPickupDate}
                          onChange={(e) => handleInputChange('returnPickupDate', e.target.value)}
                          min={formData.pickupDeliveryDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hora de recogida *</Label>
                        <Select value={formData.returnPickupTime} onValueChange={(value) => handleInputChange('returnPickupTime', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona hora" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {formData.returnType === 'branch' && selectedBranch && (
                  <Alert>
                    <Building2 className="h-4 w-4" />
                    <AlertDescription>
                      Deberás devolver tu vehículo en: <strong>{selectedBranch.name}</strong><br />
                      {selectedBranch.address}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Instrucciones especiales */}
            <Card>
              <CardHeader>
                <CardTitle>Instrucciones Especiales</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="specialInstructions"
                  placeholder="Indicaciones adicionales sobre la entrega o recogida..."
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Pago y Confirmación */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Método de Pago</span>
              </CardTitle>
              <CardDescription>
                Selecciona tu método de pago preferido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Método de pago *</Label>
                <div className="space-y-2">
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleInputChange('paymentMethod', method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selector de tarjetas de débito */}
              {formData.paymentMethod === 'card' && (
                <div className="space-y-2">
                  <Label>Selecciona tu tarjeta de débito *</Label>
                  <div className="space-y-2">
                    {userCards.map(card => (
                      <div
                        key={card.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.selectedCard === card.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleInputChange('selectedCard', card.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{card.brand}</p>
                              <p className="text-sm text-muted-foreground">
                                {card.number}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Exp. {card.expiry}</p>
                            {card.isDefault && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 text-xs mt-1">
                                Principal
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    💳 Puedes agregar más tarjetas desde tu perfil
                  </p>
                </div>
              )}

              {/* Resumen de la reserva */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h4 className="font-medium">Resumen de tu reserva</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Vehículo:</span>
                    <span>{selectedVehicle?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sucursal:</span>
                    <span>{selectedBranch?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recogida inicial:</span>
                    <span>{formData.pickupType === 'branch' ? 'En sucursal' : 'A domicilio'}</span>
                  </div>
                  {formData.pickupType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Tarifa entrega:</span>
                      <span>$15,000</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Devolución final:</span>
                    <span>{formData.returnType === 'branch' ? 'En sucursal' : 'Recogida a domicilio'}</span>
                  </div>
                  {formData.returnType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Tarifa recogida:</span>
                      <span>$15,000</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Costo de domicilios:</span>
                    <span className="text-primary">{formatCurrency(calculateDeliveryFees())}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreedToTerms}
                  onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                  className="rounded border-border"
                />
                <Label htmlFor="terms" className="text-sm">
                  Acepto los términos y condiciones del servicio
                </Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Anterior
          </Button>
          
          <Button onClick={handleNext}>
            {step === 3 ? 'Confirmar Reserva' : 'Siguiente'}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal with Pricing Breakdown */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              Confirmar Reserva
            </DialogTitle>
            <DialogDescription>
              Revisa el desglose de tarifas antes de confirmar tu reserva
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Información del Vehículo */}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-2">Vehículo Seleccionado</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehículo:</span>
                  <span>{selectedVehicle?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio por hora:</span>
                  <span>${selectedVehicle?.price}/hora</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sucursal:</span>
                  <span>{selectedBranch?.name}</span>
                </div>
              </div>
            </div>

            {/* Tarifas de Domicilios */}
            {(formData.pickupType === 'delivery' || formData.returnType === 'delivery') && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  Tarifas de Domicilio de Vehículos
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarifa por entrega/recogida:</span>
                    <span className="font-medium">$15,000</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    * El domiciliario será asignado automáticamente en la fecha y hora programada
                  </p>
                </div>
              </div>
            )}

            {/* Resumen de Costos */}
            <div className="bg-primary/10 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Resumen de Costos</h4>
              <div className="text-sm space-y-1">
                {formData.pickupType === 'delivery' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Entrega a domicilio:
                      {formData.pickupDeliveryDate && formData.pickupDeliveryTime && (
                        <span className="block text-xs">
                          {formData.pickupDeliveryDate} a las {formData.pickupDeliveryTime}
                        </span>
                      )}
                    </span>
                    <span>$15,000</span>
                  </div>
                )}
                {formData.returnType === 'delivery' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Recogida a domicilio:
                      {formData.returnPickupDate && formData.returnPickupTime && (
                        <span className="block text-xs">
                          {formData.returnPickupDate} a las {formData.returnPickupTime}
                        </span>
                      )}
                    </span>
                    <span>$15,000</span>
                  </div>
                )}
                {formData.pickupType === 'branch' && formData.returnType === 'branch' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sin cargos de domicilio</span>
                    <span>$0</span>
                  </div>
                )}
                <div className="border-t border-border my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cargos de Domicilios:</span>
                  <span className="text-2xl text-primary">{formatCurrency(calculateDeliveryFees())}</span>
                </div>
              </div>
            </div>

            {/* Detalles de Entrega/Recogida */}
            <div className="space-y-2 text-sm">
              {formData.pickupType === 'delivery' && (
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <p className="font-medium text-green-900 mb-1">📍 Entrega Inicial</p>
                  <p className="text-muted-foreground">
                    {formData.pickupDeliveryAddress}, {formData.pickupDeliveryNeighborhood}, {formData.pickupDeliveryCity}
                  </p>
                </div>
              )}
              {formData.returnType === 'delivery' && (
                <div className="p-3 bg-red-50 rounded border border-red-200">
                  <p className="font-medium text-red-900 mb-1">📍 Recogida Final</p>
                  <p className="text-muted-foreground">
                    {formData.returnPickupAddress}, {formData.returnPickupNeighborhood}, {formData.returnPickupCity}
                  </p>
                </div>
              )}
            </div>

            {/* Método de Pago */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-purple-600" />
                Método de Pago
              </h4>
              <div className="text-sm">
                {formData.paymentMethod === 'cash' && (
                  <p className="text-muted-foreground">💵 Pago en efectivo al recibir el vehículo</p>
                )}
                {formData.paymentMethod === 'card' && formData.selectedCard && (
                  <div>
                    <p className="text-muted-foreground">
                      💳 Tarjeta de Débito {userCards.find(c => c.id === formData.selectedCard)?.brand}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {userCards.find(c => c.id === formData.selectedCard)?.number}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              * El costo del alquiler del vehículo se calculará según las horas de uso y se cobrará al finalizar la reserva
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
              Revisar
            </Button>
            <Button onClick={confirmReservation} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
