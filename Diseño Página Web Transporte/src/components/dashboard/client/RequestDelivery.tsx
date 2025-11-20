import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Alert, AlertDescription } from '../../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { MapPin, Package, CreditCard, Send, Info, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const RequestDelivery: React.FC = () => {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    pickupCity: '',
    pickupNeighborhood: '',
    pickupDetail: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryNeighborhood: '',
    deliveryDetail: '',
    recipientName: '',
    recipientPhone: '',
    packageDescription: '',
    packageSize: '',
    priority: 'normal',
    paymentMethod: '',
    specialInstructions: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

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
    // Tarifa base
    let baseFee = 8000;
    
    // Adicional por tamaño del paquete
    if (formData.packageSize === 'mediano') baseFee += 3000;
    if (formData.packageSize === 'grande') baseFee += 6000;
    
    // Adicional por prioridad
    if (formData.priority === 'urgent') baseFee += 5000;
    if (formData.priority === 'express') baseFee += 10000;

    return baseFee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    setIsSubmitting(true);
    setErrors([]);

    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('¡Domicilio solicitado exitosamente!', {
        description: 'Un domiciliario será asignado pronto. Puedes ver el estado en "Mis Domicilios".'
      });

      // Resetear formulario
      setFormData({
        pickupAddress: '',
        pickupCity: '',
        pickupNeighborhood: '',
        pickupDetail: '',
        deliveryAddress: '',
        deliveryCity: '',
        deliveryNeighborhood: '',
        deliveryDetail: '',
        recipientName: '',
        recipientPhone: '',
        packageDescription: '',
        packageSize: '',
        priority: 'normal',
        paymentMethod: '',
        specialInstructions: ''
      });
      setShowConfirmation(false);
    } catch (error) {
      setErrors(['Error al solicitar el domicilio. Inténtelo de nuevo.']);
    } finally {
      setIsSubmitting(false);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl">Solicitar Domicilio</h1>
        <p className="text-muted-foreground mt-2">
          Completa el formulario para solicitar un servicio de domicilio
        </p>
      </div>

      <form onSubmit={handleSubmit}>
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

        {/* Dirección de Recogida */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Dirección de Recogida
            </CardTitle>
            <CardDescription>
              Donde recogeremos el paquete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                placeholder="Ej: Apartamento 301, Torre B"
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
          </CardContent>
        </Card>

        {/* Dirección de Entrega */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Dirección de Entrega
            </CardTitle>
            <CardDescription>
              Donde entregaremos el paquete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                placeholder="Ej: Casa 5, Conjunto Residencial"
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
          </CardContent>
        </Card>

        {/* Información del Paquete */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Información del Paquete
            </CardTitle>
            <CardDescription>
              Detalles sobre lo que enviarás
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="packageDescription">Descripción del paquete *</Label>
              <Textarea
                id="packageDescription"
                value={formData.packageDescription}
                onChange={(e) => handleInputChange('packageDescription', e.target.value)}
                placeholder="Describe brevemente el contenido del paquete"
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
                  <SelectValue placeholder="Seleccione el tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequeño">Pequeño (hasta 1kg)</SelectItem>
                  <SelectItem value="mediano">Mediano (1-5kg)</SelectItem>
                  <SelectItem value="grande">Grande (5-20kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Instrucciones especiales</Label>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                placeholder="Indicaciones adicionales para el domiciliario"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Opciones de Servicio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Opciones de Servicio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridad del servicio *</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                    <SelectItem value="transfer">Transferencia bancaria (PSE)</SelectItem>
                    <SelectItem value="wallet">Billetera digital (Nequi, Daviplata)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de Envío */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="min-w-[200px]"
          >
            <Send className="mr-2 h-4 w-4" />
            Continuar
          </Button>
        </div>
      </form>

      {/* Modal de Confirmación */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Confirmar Solicitud de Domicilio
            </DialogTitle>
            <DialogDescription>
              Verifica la información y las tarifas antes de confirmar
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

            {/* Resumen de tu pedido */}
            <div className="bg-primary/10 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Resumen de tu pedido</h4>
              <div className="space-y-1 text-sm">
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmDelivery}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Send className="mr-2 h-4 w-4 animate-spin" />
                  Solicitando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmar Solicitud
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
