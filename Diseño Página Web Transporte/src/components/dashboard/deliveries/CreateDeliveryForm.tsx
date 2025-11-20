import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Alert, AlertDescription } from '../../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { ArrowLeft, Save, MapPin, Package, User, Info, CheckCircle } from 'lucide-react';

interface CreateDeliveryFormProps {
  onBack: () => void;
  onSave: (deliveryData: any) => void;
}

export const CreateDeliveryForm: React.FC<CreateDeliveryFormProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    pickupAddress: '',
    pickupDetail: '',
    pickupCity: '',
    pickupNeighborhood: '',
    deliveryAddress: '',
    deliveryDetail: '',
    deliveryCity: '',
    deliveryNeighborhood: '',
    recipientName: '',
    recipientPhone: '',
    packageDescription: '',
    packageSize: '',
    paymentMethod: '',
    priority: 'normal',
    specialInstructions: '',
    deliveryPersonId: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  // Mock data de clientes
  const clients = [
    { id: '1', name: 'Ana García', phone: '+57 300 123 4567', email: 'ana.garcia@email.com' },
    { id: '2', name: 'Carlos Mendoza', phone: '+57 301 987 6543', email: 'carlos.mendoza@email.com' },
    { id: '3', name: 'Laura Martínez', phone: '+57 302 555 8888', email: 'laura.martinez@email.com' }
  ];

  // Mock data de domiciliarios
  const deliveryPersons = [
    { id: '2', name: 'María González', available: true, rating: 4.8 },
    { id: '3', name: 'Juan Pérez', available: true, rating: 4.5 },
    { id: '4', name: 'Diego López', available: false, rating: 4.9 }
  ];

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setFormData(prev => ({
        ...prev,
        clientId: client.id,
        clientName: client.name,
        clientPhone: client.phone,
        clientEmail: client.email
      }));
    }
  };

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    if (!formData.clientId) newErrors.push('Debe seleccionar un cliente');
    
    if (!formData.pickupAddress.trim()) newErrors.push('La dirección de recogida es requerida');
    if (!formData.pickupCity.trim()) newErrors.push('La ciudad de recogida es requerida');
    if (!formData.pickupNeighborhood.trim()) newErrors.push('El barrio de recogida es requerido');
    
    if (!formData.deliveryAddress.trim()) newErrors.push('La dirección de entrega es requerida');
    if (!formData.deliveryCity.trim()) newErrors.push('La ciudad de entrega es requerida');
    if (!formData.deliveryNeighborhood.trim()) newErrors.push('El barrio de entrega es requerido');
    if (!formData.recipientName.trim()) newErrors.push('El nombre del destinatario es requerido');
    if (!formData.recipientPhone.trim()) newErrors.push('El teléfono del destinatario es requerido');
    
    if (!formData.packageDescription.trim()) newErrors.push('La descripción del paquete es requerida');
    if (!formData.packageSize) newErrors.push('El tamaño del paquete es requerido');
    if (!formData.paymentMethod) newErrors.push('El método de pago es requerido');

    return newErrors;
  };

  const calculateDeliveryFee = (): number => {
    let baseFee = 8000;
    
    // Ajustar por tamaño
    if (formData.packageSize === 'mediano') baseFee += 3000;
    if (formData.packageSize === 'grande') baseFee += 6000;
    
    // Ajustar por prioridad
    if (formData.priority === 'urgent') baseFee += 5000;
    if (formData.priority === 'express') baseFee += 10000;

    return baseFee;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Calcular costo y mostrar modal de confirmación
    const cost = calculateDeliveryFee();
    setEstimatedCost(cost);
    setShowConfirmation(true);
  };

  const confirmDelivery = async () => {
    setIsLoading(true);
    setErrors([]);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const deliveryData = {
        ...formData,
        deliveryPersonId: formData.deliveryPersonId === 'unassigned' ? '' : formData.deliveryPersonId,
        orderNumber: `DOM-2024-${String(Date.now()).slice(-4)}`,
        deliveryFee: estimatedCost,
        status: (formData.deliveryPersonId && formData.deliveryPersonId !== 'unassigned') ? 'assigned' : 'pending',
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: new Date(Date.now() + 90 * 60000).toISOString()
      };

      onSave(deliveryData);
      setShowConfirmation(false);
    } catch (error) {
      setErrors(['Error al crear el domicilio. Inténtelo de nuevo.']);
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Regresar
        </Button>
        <h1 className="text-2xl">Crear Nuevo Domicilio</h1>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Domicilio</CardTitle>
          <CardDescription>
            Complete todos los campos para crear una nueva solicitud de domicilio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Cliente */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg">Información del Cliente</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Seleccionar Cliente *</Label>
                <Select 
                  value={formData.clientId} 
                  onValueChange={handleClientSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Teléfono del Cliente</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  placeholder="Teléfono"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Dirección de Recogida */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <h3 className="text-lg">Dirección de Recogida</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Dirección completa *</Label>
              <Input
                id="pickupAddress"
                value={formData.pickupAddress}
                onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                placeholder="Ej: Calle 72 # 10-34"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupDetail">Detalles adicionales</Label>
              <Input
                id="pickupDetail"
                value={formData.pickupDetail}
                onChange={(e) => handleInputChange('pickupDetail', e.target.value)}
                placeholder="Ej: Apartamento, oficina, torre, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupCity">Ciudad *</Label>
                <Input
                  id="pickupCity"
                  value={formData.pickupCity}
                  onChange={(e) => handleInputChange('pickupCity', e.target.value)}
                  placeholder="Ej: Bogotá"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupNeighborhood">Barrio *</Label>
                <Input
                  id="pickupNeighborhood"
                  value={formData.pickupNeighborhood}
                  onChange={(e) => handleInputChange('pickupNeighborhood', e.target.value)}
                  placeholder="Ej: Chapinero"
                />
              </div>
            </div>
          </div>

          {/* Dirección de Entrega */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              <h3 className="text-lg">Dirección de Entrega</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Dirección completa *</Label>
              <Input
                id="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                placeholder="Ej: Carrera 15 # 93-80"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDetail">Detalles adicionales</Label>
              <Input
                id="deliveryDetail"
                value={formData.deliveryDetail}
                onChange={(e) => handleInputChange('deliveryDetail', e.target.value)}
                placeholder="Ej: Apartamento, oficina, torre, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryCity">Ciudad *</Label>
                <Input
                  id="deliveryCity"
                  value={formData.deliveryCity}
                  onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                  placeholder="Ej: Bogotá"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryNeighborhood">Barrio *</Label>
                <Input
                  id="deliveryNeighborhood"
                  value={formData.deliveryNeighborhood}
                  onChange={(e) => handleInputChange('deliveryNeighborhood', e.target.value)}
                  placeholder="Ej: Usaquén"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Nombre del destinatario *</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientPhone">Teléfono del destinatario *</Label>
                <Input
                  id="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                  placeholder="+57 300 123 4567"
                />
              </div>
            </div>
          </div>

          {/* Información del Paquete */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="text-lg">Información del Paquete</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="packageDescription">Descripción del paquete *</Label>
              <Textarea
                id="packageDescription"
                value={formData.packageDescription}
                onChange={(e) => handleInputChange('packageDescription', e.target.value)}
                placeholder="Ej: Documentos, ropa, electrónicos, etc."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Tamaño del paquete *</Label>
              <Select 
                value={formData.packageSize} 
                onValueChange={(value) => handleInputChange('packageSize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequeño">Pequeño (hasta 1kg)</SelectItem>
                  <SelectItem value="mediano">Mediano (1-5kg)</SelectItem>
                  <SelectItem value="grande">Grande (5-20kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Detalles del Servicio */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg">Detalles del Servicio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Prioridad *</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Método de pago *</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="card">Tarjeta</SelectItem>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Asignar domiciliario</Label>
                <Select 
                  value={formData.deliveryPersonId || undefined} 
                  onValueChange={(value) => handleInputChange('deliveryPersonId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Asignar después" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Sin asignar</SelectItem>
                    {deliveryPersons.map(person => (
                      <SelectItem 
                        key={person.id} 
                        value={person.id}
                        disabled={!person.available}
                      >
                        {person.name} - ⭐ {person.rating} {!person.available && '(No disponible)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Instrucciones especiales</Label>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                placeholder="Indicaciones adicionales para el domiciliario..."
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1"
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Confirmación */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Confirmar Creación de Domicilio
            </DialogTitle>
            <DialogDescription>
              Verifica la información y las tarifas antes de crear el domicilio
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Tarifas del Sistema */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Info className="h-4 w-4" />
                Estructura de Tarifas
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa base:</span>
                  <span>{formatCurrency(8000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tamaño pequeño:</span>
                  <span>Sin costo adicional</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tamaño mediano:</span>
                  <span>+ {formatCurrency(3000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tamaño grande:</span>
                  <span>+ {formatCurrency(6000)}</span>
                </div>
                <div className="border-t border-border my-2"></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prioridad normal:</span>
                  <span>Sin costo adicional</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prioridad urgente:</span>
                  <span>+ {formatCurrency(5000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prioridad express:</span>
                  <span>+ {formatCurrency(10000)}</span>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="bg-primary/10 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Resumen del Domicilio</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span>{formData.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tamaño del paquete:</span>
                  <span className="capitalize">{formData.packageSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prioridad:</span>
                  <span className="capitalize">{formData.priority}</span>
                </div>
                <div className="border-t border-border my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Valor del domicilio:</span>
                  <span className="text-2xl text-primary">{formatCurrency(estimatedCost)}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              * El precio final puede variar según la distancia exacta calculada por GPS
            </p>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmDelivery}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmar y Crear
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
