import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { 
  DollarSign, 
  Bike, 
  Package, 
  Truck, 
  Save,
  Edit,
  Clock,
  MapPin,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VehicleRate {
  type: string;
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  securityDeposit: number;
}

interface DeliveryRate {
  baseRate: number;
  perKmRate: number;
  urgentSurcharge: number;
  expressSurcharge: number;
  smallPackage: number;
  mediumPackage: number;
  largePackage: number;
}

interface VehicleDeliveryRate {
  baseRate: number;
  perKmRate: number;
  moto: number;
  bicicletaElectrica: number;
  bicicletaManual: number;
  patinetaElectrica: number;
  patinesLinea: number;
}

export const RatesManagement: React.FC = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para tarifas de vehículos
  const [vehicleRates, setVehicleRates] = useState<VehicleRate[]>([
    {
      type: 'Moto',
      hourlyRate: 8000,
      dailyRate: 35000,
      weeklyRate: 200000,
      securityDeposit: 100000
    },
    {
      type: 'Patineta eléctrica',
      hourlyRate: 5000,
      dailyRate: 25000,
      weeklyRate: 150000,
      securityDeposit: 50000
    },
    {
      type: 'Bicicleta manual',
      hourlyRate: 3000,
      dailyRate: 15000,
      weeklyRate: 90000,
      securityDeposit: 30000
    },
    {
      type: 'Bicicleta eléctrica',
      hourlyRate: 6000,
      dailyRate: 30000,
      weeklyRate: 180000,
      securityDeposit: 80000
    },
    {
      type: 'Patines de línea',
      hourlyRate: 4000,
      dailyRate: 20000,
      weeklyRate: 120000,
      securityDeposit: 40000
    }
  ]);

  // Estado para tarifas de domicilio normal
  const [deliveryRates, setDeliveryRates] = useState<DeliveryRate>({
    baseRate: 10000,
    perKmRate: 1500,
    urgentSurcharge: 5000,
    expressSurcharge: 10000,
    smallPackage: 0,
    mediumPackage: 3000,
    largePackage: 6000
  });

  // Estado para tarifas de domicilio de vehículo
  const [vehicleDeliveryRates, setVehicleDeliveryRates] = useState<VehicleDeliveryRate>({
    baseRate: 15000,
    perKmRate: 2000,
    moto: 15000,
    bicicletaElectrica: 10000,
    bicicletaManual: 8000,
    patinetaElectrica: 8000,
    patinesLinea: 8000
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleVehicleRateChange = (index: number, field: keyof VehicleRate, value: string) => {
    const newRates = [...vehicleRates];
    newRates[index] = {
      ...newRates[index],
      [field]: parseFloat(value) || 0
    };
    setVehicleRates(newRates);
  };

  const handleDeliveryRateChange = (field: keyof DeliveryRate, value: string) => {
    setDeliveryRates({
      ...deliveryRates,
      [field]: parseFloat(value) || 0
    });
  };

  const handleVehicleDeliveryRateChange = (field: keyof VehicleDeliveryRate, value: string) => {
    setVehicleDeliveryRates({
      ...vehicleDeliveryRates,
      [field]: parseFloat(value) || 0
    });
  };

  const handleSave = async (section: string) => {
    setIsSaving(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Tarifas actualizadas exitosamente', {
        description: `Las tarifas de ${section} han sido guardadas correctamente.`
      });
      
      setIsEditing(null);
    } catch (error) {
      toast.error('Error al guardar', {
        description: 'No se pudieron guardar las tarifas. Inténtelo de nuevo.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getVehicleIcon = (type: string) => {
    if (type.includes('Moto')) return '🏍️';
    if (type.includes('Patineta')) return '🛴';
    if (type.includes('Bicicleta')) return '🚲';
    if (type.includes('Patines')) return '⛸️';
    return '🚗';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-primary" />
          Gestión de Tarifas
        </h1>
        <p className="text-muted-foreground mt-2">
          Administra todas las tarifas del sistema: vehículos, domicilios normales y domicilios de vehículos
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Los cambios en las tarifas se aplicarán inmediatamente a las nuevas reservas y solicitudes.
          Las reservas existentes mantendrán las tarifas con las que fueron creadas.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs defaultValue="vehicles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vehicles" className="gap-2">
            <Bike className="h-4 w-4" />
            Tarifas de Vehículos
          </TabsTrigger>
          <TabsTrigger value="delivery" className="gap-2">
            <Package className="h-4 w-4" />
            Domicilios Normales
          </TabsTrigger>
          <TabsTrigger value="vehicle-delivery" className="gap-2">
            <Truck className="h-4 w-4" />
            Domicilios de Vehículos
          </TabsTrigger>
        </TabsList>

        {/* Tarifas de Vehículos por Hora */}
        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tarifas de Alquiler de Vehículos
                </span>
                {isEditing === 'vehicles' ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleSave('vehículos')}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing('vehicles')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Define las tarifas por hora, día y semana para cada tipo de vehículo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vehicleRates.map((rate, index) => (
                  <div key={rate.type} className="border rounded-lg p-6 bg-slate-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">{getVehicleIcon(rate.type)}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{rate.type}</h3>
                        <p className="text-sm text-muted-foreground">Tarifas de alquiler</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`hourly-${index}`}>Tarifa por Hora</Label>
                        {isEditing === 'vehicles' ? (
                          <Input
                            id={`hourly-${index}`}
                            type="number"
                            value={rate.hourlyRate}
                            onChange={(e) => handleVehicleRateChange(index, 'hourlyRate', e.target.value)}
                            placeholder="8000"
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border font-medium">
                            {formatCurrency(rate.hourlyRate)}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`daily-${index}`}>Tarifa por Día</Label>
                        {isEditing === 'vehicles' ? (
                          <Input
                            id={`daily-${index}`}
                            type="number"
                            value={rate.dailyRate}
                            onChange={(e) => handleVehicleRateChange(index, 'dailyRate', e.target.value)}
                            placeholder="35000"
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border font-medium">
                            {formatCurrency(rate.dailyRate)}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`weekly-${index}`}>Tarifa por Semana</Label>
                        {isEditing === 'vehicles' ? (
                          <Input
                            id={`weekly-${index}`}
                            type="number"
                            value={rate.weeklyRate}
                            onChange={(e) => handleVehicleRateChange(index, 'weeklyRate', e.target.value)}
                            placeholder="200000"
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border font-medium">
                            {formatCurrency(rate.weeklyRate)}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`deposit-${index}`}>Depósito de Garantía</Label>
                        {isEditing === 'vehicles' ? (
                          <Input
                            id={`deposit-${index}`}
                            type="number"
                            value={rate.securityDeposit}
                            onChange={(e) => handleVehicleRateChange(index, 'securityDeposit', e.target.value)}
                            placeholder="100000"
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border font-medium">
                            {formatCurrency(rate.securityDeposit)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tarifas de Domicilio Normal */}
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Tarifas de Domicilio Normal
                </span>
                {isEditing === 'delivery' ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleSave('domicilios normales')}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing('delivery')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Configura las tarifas para el servicio de envío de paquetes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Tarifas Base */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Tarifas Base y Distancia
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="base-rate">Tarifa Base</Label>
                      {isEditing === 'delivery' ? (
                        <Input
                          id="base-rate"
                          type="number"
                          value={deliveryRates.baseRate}
                          onChange={(e) => handleDeliveryRateChange('baseRate', e.target.value)}
                          placeholder="10000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(deliveryRates.baseRate)}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Precio mínimo por domicilio
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="per-km">Tarifa por Kilómetro</Label>
                      {isEditing === 'delivery' ? (
                        <Input
                          id="per-km"
                          type="number"
                          value={deliveryRates.perKmRate}
                          onChange={(e) => handleDeliveryRateChange('perKmRate', e.target.value)}
                          placeholder="1500"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(deliveryRates.perKmRate)}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Costo adicional por km recorrido
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recargos por Prioridad */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recargos por Prioridad
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="urgent">Recargo Urgente</Label>
                      {isEditing === 'delivery' ? (
                        <Input
                          id="urgent"
                          type="number"
                          value={deliveryRates.urgentSurcharge}
                          onChange={(e) => handleDeliveryRateChange('urgentSurcharge', e.target.value)}
                          placeholder="5000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(deliveryRates.urgentSurcharge)}
                        </div>
                      )}
                      <Badge variant="secondary">+{formatCurrency(deliveryRates.urgentSurcharge)}</Badge>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="express">Recargo Express</Label>
                      {isEditing === 'delivery' ? (
                        <Input
                          id="express"
                          type="number"
                          value={deliveryRates.expressSurcharge}
                          onChange={(e) => handleDeliveryRateChange('expressSurcharge', e.target.value)}
                          placeholder="10000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(deliveryRates.expressSurcharge)}
                        </div>
                      )}
                      <Badge variant="destructive">+{formatCurrency(deliveryRates.expressSurcharge)}</Badge>
                    </div>
                  </div>
                </div>

                {/* Tarifas por Tamaño */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Recargos por Tamaño de Paquete
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="small">Paquete Pequeño (hasta 1kg)</Label>
                      {isEditing === 'delivery' ? (
                        <Input
                          id="small"
                          type="number"
                          value={deliveryRates.smallPackage}
                          onChange={(e) => handleDeliveryRateChange('smallPackage', e.target.value)}
                          placeholder="0"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(deliveryRates.smallPackage)}
                        </div>
                      )}
                      <Badge variant="outline">Sin recargo</Badge>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medium">Paquete Mediano (1-5kg)</Label>
                      {isEditing === 'delivery' ? (
                        <Input
                          id="medium"
                          type="number"
                          value={deliveryRates.mediumPackage}
                          onChange={(e) => handleDeliveryRateChange('mediumPackage', e.target.value)}
                          placeholder="3000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(deliveryRates.mediumPackage)}
                        </div>
                      )}
                      <Badge variant="secondary">+{formatCurrency(deliveryRates.mediumPackage)}</Badge>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="large">Paquete Grande (5-20kg)</Label>
                      {isEditing === 'delivery' ? (
                        <Input
                          id="large"
                          type="number"
                          value={deliveryRates.largePackage}
                          onChange={(e) => handleDeliveryRateChange('largePackage', e.target.value)}
                          placeholder="6000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(deliveryRates.largePackage)}
                        </div>
                      )}
                      <Badge variant="default">+{formatCurrency(deliveryRates.largePackage)}</Badge>
                    </div>
                  </div>
                </div>

                {/* Calculadora de Ejemplo */}
                <div className="border-t pt-6 bg-primary/5 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Ejemplo de Cálculo</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tarifa base:</span>
                      <span className="font-medium">{formatCurrency(deliveryRates.baseRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distancia (5 km × {formatCurrency(deliveryRates.perKmRate)}):</span>
                      <span className="font-medium">{formatCurrency(deliveryRates.perKmRate * 5)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paquete mediano:</span>
                      <span className="font-medium">+{formatCurrency(deliveryRates.mediumPackage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prioridad urgente:</span>
                      <span className="font-medium">+{formatCurrency(deliveryRates.urgentSurcharge)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold text-base">
                      <span>Total:</span>
                      <span className="text-primary">
                        {formatCurrency(
                          deliveryRates.baseRate + 
                          (deliveryRates.perKmRate * 5) + 
                          deliveryRates.mediumPackage + 
                          deliveryRates.urgentSurcharge
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tarifas de Domicilio de Vehículo */}
        <TabsContent value="vehicle-delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Tarifas de Domicilio de Vehículos
                </span>
                {isEditing === 'vehicle-delivery' ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleSave('domicilios de vehículos')}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing('vehicle-delivery')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Define las tarifas para entregar vehículos a domicilio del cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Tarifas Base */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Tarifas Base y Distancia
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vd-base-rate">Tarifa Base</Label>
                      {isEditing === 'vehicle-delivery' ? (
                        <Input
                          id="vd-base-rate"
                          type="number"
                          value={vehicleDeliveryRates.baseRate}
                          onChange={(e) => handleVehicleDeliveryRateChange('baseRate', e.target.value)}
                          placeholder="15000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(vehicleDeliveryRates.baseRate)}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Precio mínimo por entrega de vehículo
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vd-per-km">Tarifa por Kilómetro</Label>
                      {isEditing === 'vehicle-delivery' ? (
                        <Input
                          id="vd-per-km"
                          type="number"
                          value={vehicleDeliveryRates.perKmRate}
                          onChange={(e) => handleVehicleDeliveryRateChange('perKmRate', e.target.value)}
                          placeholder="2000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(vehicleDeliveryRates.perKmRate)}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Costo adicional por km recorrido
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tarifas por Tipo de Vehículo */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Bike className="h-4 w-4" />
                    Recargos por Tipo de Vehículo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vd-moto" className="flex items-center gap-2">
                        🏍️ Moto
                      </Label>
                      {isEditing === 'vehicle-delivery' ? (
                        <Input
                          id="vd-moto"
                          type="number"
                          value={vehicleDeliveryRates.moto}
                          onChange={(e) => handleVehicleDeliveryRateChange('moto', e.target.value)}
                          placeholder="15000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(vehicleDeliveryRates.moto)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vd-bici-electrica" className="flex items-center gap-2">
                        🚲 Bicicleta Eléctrica
                      </Label>
                      {isEditing === 'vehicle-delivery' ? (
                        <Input
                          id="vd-bici-electrica"
                          type="number"
                          value={vehicleDeliveryRates.bicicletaElectrica}
                          onChange={(e) => handleVehicleDeliveryRateChange('bicicletaElectrica', e.target.value)}
                          placeholder="10000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(vehicleDeliveryRates.bicicletaElectrica)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vd-bici-manual" className="flex items-center gap-2">
                        🚲 Bicicleta Manual
                      </Label>
                      {isEditing === 'vehicle-delivery' ? (
                        <Input
                          id="vd-bici-manual"
                          type="number"
                          value={vehicleDeliveryRates.bicicletaManual}
                          onChange={(e) => handleVehicleDeliveryRateChange('bicicletaManual', e.target.value)}
                          placeholder="8000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(vehicleDeliveryRates.bicicletaManual)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vd-patineta" className="flex items-center gap-2">
                        🛴 Patineta Eléctrica
                      </Label>
                      {isEditing === 'vehicle-delivery' ? (
                        <Input
                          id="vd-patineta"
                          type="number"
                          value={vehicleDeliveryRates.patinetaElectrica}
                          onChange={(e) => handleVehicleDeliveryRateChange('patinetaElectrica', e.target.value)}
                          placeholder="8000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(vehicleDeliveryRates.patinetaElectrica)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vd-patines" className="flex items-center gap-2">
                        ⛸️ Patines de Línea
                      </Label>
                      {isEditing === 'vehicle-delivery' ? (
                        <Input
                          id="vd-patines"
                          type="number"
                          value={vehicleDeliveryRates.patinesLinea}
                          onChange={(e) => handleVehicleDeliveryRateChange('patinesLinea', e.target.value)}
                          placeholder="8000"
                        />
                      ) : (
                        <div className="p-2 bg-slate-50 rounded border font-medium">
                          {formatCurrency(vehicleDeliveryRates.patinesLinea)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Calculadora de Ejemplo */}
                <div className="border-t pt-6 bg-primary/5 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Ejemplo de Cálculo</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tarifa base:</span>
                      <span className="font-medium">{formatCurrency(vehicleDeliveryRates.baseRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distancia (8 km × {formatCurrency(vehicleDeliveryRates.perKmRate)}):</span>
                      <span className="font-medium">{formatCurrency(vehicleDeliveryRates.perKmRate * 8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tipo de vehículo (Moto):</span>
                      <span className="font-medium">+{formatCurrency(vehicleDeliveryRates.moto)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold text-base">
                      <span>Total:</span>
                      <span className="text-primary">
                        {formatCurrency(
                          vehicleDeliveryRates.baseRate + 
                          (vehicleDeliveryRates.perKmRate * 8) + 
                          vehicleDeliveryRates.moto
                        )}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    * El cliente reserva un vehículo y solicita entrega a domicilio a 8 km de distancia
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
