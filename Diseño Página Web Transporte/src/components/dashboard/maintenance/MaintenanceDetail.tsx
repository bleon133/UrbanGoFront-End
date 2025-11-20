import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Wrench, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  DollarSign,
  FileText,
  X
} from 'lucide-react';
import { Maintenance } from './MaintenancesTable';
import { Alert, AlertDescription } from '../../ui/alert';

interface MaintenanceDetailProps {
  maintenance: Maintenance;
  onBack: () => void;
  readOnly?: boolean;
}

interface MaintenancePart {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
}

export const MaintenanceDetail: React.FC<MaintenanceDetailProps> = ({ 
  maintenance, 
  onBack,
  readOnly = false 
}) => {
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [partsUsed, setPartsUsed] = useState<MaintenancePart[]>([
    { id: '1', name: 'Aceite motor 20W-50', quantity: 1, unitCost: 25000 },
    { id: '2', name: 'Filtro de aceite', quantity: 1, unitCost: 15000 },
  ]);
  const [laborCost, setLaborCost] = useState('50000');
  const [workDuration, setWorkDuration] = useState('2.5');

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

  const totalPartsCost = partsUsed.reduce((sum, part) => sum + (part.quantity * part.unitCost), 0);
  const totalCost = totalPartsCost + parseFloat(laborCost || '0');

  const addPart = () => {
    const newPart: MaintenancePart = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unitCost: 0
    };
    setPartsUsed([...partsUsed, newPart]);
  };

  const updatePart = (id: string, field: keyof MaintenancePart, value: string | number) => {
    setPartsUsed(partsUsed.map(part => 
      part.id === id ? { ...part, [field]: value } : part
    ));
  };

  const removePart = (id: string) => {
    setPartsUsed(partsUsed.filter(part => part.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detalle de Mantenimiento</h1>
            <p className="text-muted-foreground">ID: {maintenance.id}</p>
          </div>
        </div>
        {getStatusBadge(maintenance.status)}
      </div>

      {readOnly && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vista de solo lectura. Este mantenimiento es gestionado por el personal técnico.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Información del vehículo y mantenimiento */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehículo */}
          <Card>
            <CardHeader>
              <CardTitle>Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={maintenance.vehiclePhoto} />
                  <AvatarFallback>
                    <Wrench className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{maintenance.vehicleName}</h3>
                  <p className="text-sm text-muted-foreground">ID: {maintenance.vehicleId}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">{maintenance.category}</Badge>
                    {getTypeBadge(maintenance.type)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del mantenimiento */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Mantenimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Fecha Programada</span>
                  </div>
                  <p className="font-medium">
                    {new Date(maintenance.scheduledDate).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Sucursal</span>
                  </div>
                  <p className="font-medium">{maintenance.branch}</p>
                </div>

                {maintenance.assignedTo && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Técnico Asignado</span>
                    </div>
                    <p className="font-medium">{maintenance.assignedTo}</p>
                  </div>
                )}

                {maintenance.startedAt && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Iniciado</span>
                    </div>
                    <p className="font-medium">{maintenance.startedAt}</p>
                  </div>
                )}
              </div>

              {maintenance.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Descripción del Problema</Label>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{maintenance.description}</AlertDescription>
                    </Alert>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Detalles técnicos - Solo para personal de mantenimiento */}
          {!readOnly && (
            <>
              {/* Partes y repuestos */}
              <Card>
                <CardHeader>
                  <CardTitle>Partes y Repuestos Utilizados</CardTitle>
                  <CardDescription>
                    Registra todas las partes y materiales usados en el mantenimiento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {partsUsed.map((part, index) => (
                    <div key={part.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Label className="text-xs">Nombre de la parte</Label>
                        <Input
                          value={part.name}
                          onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                          placeholder="Ej: Aceite motor 20W-50"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Cantidad</Label>
                        <Input
                          type="number"
                          min="1"
                          value={part.quantity}
                          onChange={(e) => updatePart(part.id, 'quantity', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Costo Unitario</Label>
                        <Input
                          type="number"
                          min="0"
                          value={part.unitCost}
                          onChange={(e) => updatePart(part.id, 'unitCost', parseFloat(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-2 flex items-center space-x-2">
                        <div className="text-sm font-medium">
                          ${(part.quantity * part.unitCost).toLocaleString('es-CO')}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePart(part.id)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addPart}
                    className="w-full"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Agregar Parte
                  </Button>
                </CardContent>
              </Card>

              {/* Notas técnicas */}
              <Card>
                <CardHeader>
                  <CardTitle>Notas Técnicas del Mantenimiento</CardTitle>
                  <CardDescription>
                    Describe el trabajo realizado, observaciones y recomendaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={technicalNotes}
                    onChange={(e) => setTechnicalNotes(e.target.value)}
                    placeholder="Ej: Se realizó cambio de aceite motor y filtro. Se verificó el estado de frenos y cadena. Vehículo en óptimas condiciones. Recomendación: Revisar tensión de cadena en próximo mantenimiento."
                    rows={6}
                  />
                </CardContent>
              </Card>
            </>
          )}

          {/* Notas técnicas completadas - Vista de lectura */}
          {readOnly && maintenance.status === 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle>Notas Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    {maintenance.description || 'No hay notas técnicas disponibles'}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Resumen de costos - Solo para personal de mantenimiento */}
          {!readOnly && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Costos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mano de Obra</Label>
                  <Input
                    type="number"
                    min="0"
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duración (horas)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={workDuration}
                    onChange={(e) => setWorkDuration(e.target.value)}
                    placeholder="0"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Partes y Repuestos:</span>
                    <span className="font-medium">${totalPartsCost.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mano de Obra:</span>
                    <span className="font-medium">${parseFloat(laborCost || '0').toLocaleString('es-CO')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-primary">
                      ${totalCost.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estado y acciones */}
          {!readOnly && maintenance.status !== 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {maintenance.status === 'pending' && (
                  <Button className="w-full">
                    <Wrench className="h-4 w-4 mr-2" />
                    Iniciar Mantenimiento
                  </Button>
                )}
                {maintenance.status === 'in-progress' && (
                  <Button className="w-full">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Completar Mantenimiento
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
