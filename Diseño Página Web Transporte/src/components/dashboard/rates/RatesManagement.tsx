import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Alert, AlertDescription } from '../../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { DollarSign, Bike, Package, Truck, Save, Edit, Clock, Info, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../../services/api';

type VehicleRate = {
  id?: string;
  tipoVehiculo: string;
  tarifaHora: number;
  tarifaDia?: number | null;
  tarifaSemana?: number | null;
  depositoGarantia?: number | null;
};

export const RatesManagement: React.FC = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [vehicleError, setVehicleError] = useState<string | null>(null);
  const [vehicleRates, setVehicleRates] = useState<VehicleRate[]>([]);
  const [transportTypes, setTransportTypes] = useState<Array<{ id: string; name: string }>>([]);

  const formatCurrency = (amount: number | null | undefined) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(
      amount ?? 0,
    );

  const fetchVehicleRates = useCallback(async () => {
    setIsLoadingVehicles(true);
    setVehicleError(null);
    try {
      const data = await api.get<Array<any>>('/admin/rates/vehicles');
      setVehicleRates(
        data.map((item) => ({
          id: String(item.id),
          tipoVehiculo: item.tipoVehiculo || '',
          tarifaHora: Number(item.tarifaHora || 0),
          tarifaDia: item.tarifaDia != null ? Number(item.tarifaDia) : null,
          tarifaSemana: item.tarifaSemana != null ? Number(item.tarifaSemana) : null,
          depositoGarantia: item.depositoGarantia != null ? Number(item.depositoGarantia) : null,
        })),
      );
    } catch (error: any) {
      setVehicleError('No se pudieron cargar las tarifas de vehiculos.');
    } finally {
      setIsLoadingVehicles(false);
    }
  }, []);

  const fetchTransportTypes = useCallback(async () => {
    try {
      const data = await api.get<Array<any>>('/transport-types');
      setTransportTypes(
        data.map((t: any) => ({
          id: String(t.id),
          name: t.nombre || '',
        })),
      );
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchVehicleRates();
    fetchTransportTypes();
  }, [fetchVehicleRates, fetchTransportTypes]);

  const handleVehicleRateChange = (index: number, field: keyof VehicleRate, value: string) => {
    const next = [...vehicleRates];
    next[index] = {
      ...next[index],
      [field]: field === 'tipoVehiculo' ? value : value === '' ? null : parseFloat(value),
    };
    setVehicleRates(next);
  };

  const handleAddVehicleRate = () => {
    setVehicleRates((prev) => [
      ...prev,
      { tipoVehiculo: '', tarifaHora: 0, tarifaDia: null, tarifaSemana: null, depositoGarantia: null },
    ]);
    setIsEditing('vehicles');
  };

  const handleDeleteVehicleRate = async (rate: VehicleRate, index: number) => {
    if (!rate.id) {
      setVehicleRates((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    try {
      await api.del(`/admin/rates/vehicles/${rate.id}`);
      setVehicleRates((prev) => prev.filter((_, i) => i !== index));
      toast.success('Tarifa eliminada');
    } catch (error: any) {
      toast.error(error?.message || 'No se pudo eliminar la tarifa');
    }
  };

  const saveVehicleRates = async () => {
    setIsSaving(true);
    try {
      for (const rate of vehicleRates) {
        if (!rate.tipoVehiculo.trim()) throw new Error('El tipo de vehiculo es obligatorio');
        if (rate.tarifaHora == null || Number.isNaN(rate.tarifaHora)) throw new Error('La tarifa por hora es obligatoria');
      }
      await Promise.all(
        vehicleRates.map((rate) => {
          const payload = {
            tipoVehiculo: rate.tipoVehiculo.trim(),
            tarifaHora: rate.tarifaHora,
            tarifaDia: rate.tarifaDia,
            tarifaSemana: rate.tarifaSemana,
            depositoGarantia: rate.depositoGarantia,
          };
          return rate.id
            ? api.put(`/admin/rates/vehicles/${rate.id}`, payload)
            : api.post(`/admin/rates/vehicles`, payload);
        }),
      );
      toast.success('Tarifas de vehiculos guardadas');
      setIsEditing(null);
      await fetchVehicleRates();
    } catch (error: any) {
      toast.error(error?.message || 'No se pudieron guardar las tarifas');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (section: string) => {
    if (section === 'vehiculos') {
      await saveVehicleRates();
    } else {
      toast.info('Seccion en construccion');
    }
  };

  const getVehicleIcon = (type: string) => {
    const value = type.toLowerCase();
    if (value.includes('moto')) return 'M';
    if (value.includes('patineta')) return 'P';
    if (value.includes('bici')) return 'B';
    if (value.includes('patin')) return 'R';
    return 'V';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-primary" />
          Gestion de Tarifas
        </h1>
        <p className="text-muted-foreground mt-2">
          Administra las tarifas de vehiculos. Las secciones de domicilio se mostraran pronto.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Los cambios aplican a nuevas reservas. Las reservas existentes mantienen su tarifa original.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="vehicles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vehicles" className="gap-2">
            <Bike className="h-4 w-4" />
            Vehiculos
          </TabsTrigger>
          <TabsTrigger value="delivery" className="gap-2">
            <Package className="h-4 w-4" />
            Domicilios
          </TabsTrigger>
          <TabsTrigger value="vehicle-delivery" className="gap-2">
            <Truck className="h-4 w-4" />
            Domicilio de Vehiculo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tarifas de vehículos
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleAddVehicleRate}>
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                  {isEditing === 'vehicles' ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(null)} disabled={isSaving}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={() => handleSave('vehiculos')} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing('vehicles')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </CardTitle>
              <CardDescription>Tarifas para la tabla tarifas_vehiculo.</CardDescription>
            </CardHeader>
            <CardContent>
              {vehicleError && (
                <div className="mb-4 text-sm text-destructive">
                  {vehicleError}
                  <Button variant="link" size="sm" className="ml-2" onClick={fetchVehicleRates}>
                    Reintentar
                  </Button>
                </div>
              )}
              {isLoadingVehicles ? (
                <div className="flex min-h-[10rem] items-center justify-center text-muted-foreground">
                  Cargando tarifas...
                </div>
              ) : (
                <div className="space-y-4">
                  {vehicleRates.length === 0 && (
                    <div className="text-sm text-muted-foreground">No hay tarifas registradas.</div>
                  )}
                  {vehicleRates.map((rate, index) => (
                    <div key={rate.id ?? `nuevo-${index}`} className="border rounded-lg p-4 bg-slate-50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getVehicleIcon(rate.tipoVehiculo || '')}</div>
                          <div className="space-y-1">
                            {isEditing === 'vehicles' ? (
                              <>
                                <Label htmlFor={`tipo-${index}`}>Tipo de vehiculo</Label>
                                <Select
                                  value={rate.tipoVehiculo}
                                  onValueChange={(value) => handleVehicleRateChange(index, 'tipoVehiculo', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione el tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {transportTypes.map((option) => (
                                      <SelectItem key={option.id} value={option.name}>
                                        {option.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </>
                            ) : (
                              <h3 className="font-semibold text-lg">{rate.tipoVehiculo || 'Nuevo vehiculo'}</h3>
                            )}
                          </div>
                        </div>
                        {isEditing === 'vehicles' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteVehicleRate(rate, index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                        <div className="space-y-1">
                          <Label htmlFor={`hora-${index}`}>Tarifa por hora</Label>
                          {isEditing === 'vehicles' ? (
                            <Input
                              id={`hora-${index}`}
                              type="number"
                              value={rate.tarifaHora ?? 0}
                              onChange={(e) => handleVehicleRateChange(index, 'tarifaHora', e.target.value)}
                              placeholder="8000"
                            />
                          ) : (
                            <div className="p-2 bg-white rounded border font-medium">
                              {formatCurrency(rate.tarifaHora)}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`dia-${index}`}>Tarifa por día (opcional)</Label>
                          {isEditing === 'vehicles' ? (
                            <Input
                              id={`dia-${index}`}
                              type="number"
                              value={rate.tarifaDia ?? ''}
                              onChange={(e) => handleVehicleRateChange(index, 'tarifaDia', e.target.value)}
                              placeholder="30000"
                            />
                          ) : (
                            <div className="p-2 bg-white rounded border font-medium">
                              {rate.tarifaDia != null ? formatCurrency(rate.tarifaDia) : 'No definida'}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`semana-${index}`}>Tarifa por semana (opcional)</Label>
                          {isEditing === 'vehicles' ? (
                            <Input
                              id={`semana-${index}`}
                              type="number"
                              value={rate.tarifaSemana ?? ''}
                              onChange={(e) => handleVehicleRateChange(index, 'tarifaSemana', e.target.value)}
                              placeholder="200000"
                            />
                          ) : (
                            <div className="p-2 bg-white rounded border font-medium">
                              {rate.tarifaSemana != null ? formatCurrency(rate.tarifaSemana) : 'No definida'}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`deposito-${index}`}>Deposito de garantia (opcional)</Label>
                          {isEditing === 'vehicles' ? (
                            <Input
                              id={`deposito-${index}`}
                              type="number"
                              value={rate.depositoGarantia ?? ''}
                              onChange={(e) =>
                                handleVehicleRateChange(index, 'depositoGarantia', e.target.value)
                              }
                              placeholder="100000"
                            />
                          ) : (
                            <div className="p-2 bg-white rounded border font-medium">
                              {rate.depositoGarantia != null ? formatCurrency(rate.depositoGarantia) : 'No aplica'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Domicilios (proximo)
              </CardTitle>
              <CardDescription>Esta seccion se habilitara mas adelante.</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle-delivery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Domicilio de vehiculo (proximo)
              </CardTitle>
              <CardDescription>Se mostrara cuando se definan las tarifas.</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
