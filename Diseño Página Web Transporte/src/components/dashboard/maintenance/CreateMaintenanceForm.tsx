import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Alert, AlertDescription } from '../../ui/alert';
import { ArrowLeft, Save, Wrench, Plus, X } from 'lucide-react';

interface CreateMaintenanceFormProps {
  onBack: () => void;
}

// Mock de vehículos disponibles
const mockVehicles = [
  { id: 'v1', name: 'Honda XR 150', type: 'Moto', plate: 'ABC123' },
  { id: 'v2', name: 'Trek E-Bike 500', type: 'Bicicleta eléctrica', plate: null },
  { id: 'v3', name: 'Xiaomi Mi Scooter Pro', type: 'Patineta eléctrica', plate: null },
  { id: 'v4', name: 'Yamaha FZ 16', type: 'Moto', plate: 'XYZ789' }
];

// Mock de técnicos
const mockTechnicians = [
  'Carlos Méndez',
  'María González',
  'Pedro Ramírez',
  'Ana López',
  'Juan Martínez'
];

export const CreateMaintenanceForm: React.FC<CreateMaintenanceFormProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [parts, setParts] = useState<string[]>(['']);

  const [formData, setFormData] = useState({
    vehicleId: '',
    maintenanceType: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    status: 'pendiente',
    priority: 'media',
    technician: '',
    estimatedCompletionDate: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleAddPart = () => {
    setParts([...parts, '']);
  };

  const handleRemovePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handlePartChange = (index: number, value: string) => {
    const newParts = [...parts];
    newParts[index] = value;
    setParts(newParts);
  };

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    if (!formData.vehicleId) newErrors.push('Debe seleccionar un vehículo');
    if (!formData.maintenanceType) newErrors.push('Debe seleccionar el tipo de mantenimiento');
    if (!formData.description.trim()) newErrors.push('La descripción es requerida');
    if (!formData.date) newErrors.push('La fecha es requerida');

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      // Simulación de guardado
      await new Promise(resolve => setTimeout(resolve, 1500));

      const filteredParts = parts.filter(part => part.trim() !== '');
      const maintenanceData = {
        ...formData,
        parts: filteredParts.length > 0 ? filteredParts : undefined,
        cost: formData.cost ? Number(formData.cost) : 0
      };

      console.log('Mantenimiento creado:', maintenanceData);
      onBack();
    } catch (error) {
      setErrors(['Error al crear el mantenimiento. Inténtelo de nuevo.']);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVehicle = mockVehicles.find(v => v.id === formData.vehicleId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Regresar
          </Button>
          <h1 className="text-2xl font-bold">Nuevo Mantenimiento</h1>
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Guardando...' : 'Guardar Mantenimiento'}
        </Button>
      </div>

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

      {/* Información del Vehículo */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Vehículo</CardTitle>
          <CardDescription>
            Seleccione el vehículo que requiere mantenimiento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleId">Vehículo *</Label>
            <Select value={formData.vehicleId} onValueChange={(value) => handleInputChange('vehicleId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un vehículo" />
              </SelectTrigger>
              <SelectContent>
                {mockVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} - {vehicle.type}
                    {vehicle.plate && ` (${vehicle.plate})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedVehicle && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vehículo</p>
                  <p className="font-medium">{selectedVehicle.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium">{selectedVehicle.type}</p>
                </div>
                {selectedVehicle.plate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Placa</p>
                    <p className="font-medium">{selectedVehicle.plate}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalles del Mantenimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wrench className="h-5 w-5" />
            <span>Detalles del Mantenimiento</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceType">Tipo de mantenimiento *</Label>
              <Select value={formData.maintenanceType} onValueChange={(value) => handleInputChange('maintenanceType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventivo">Preventivo</SelectItem>
                  <SelectItem value="correctivo">Correctivo</SelectItem>
                  <SelectItem value="revision">Revisión</SelectItem>
                  <SelectItem value="emergencia">Emergencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Describa el mantenimiento a realizar..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha de inicio *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCompletionDate">Fecha estimada de finalización</Label>
              <Input
                id="estimatedCompletionDate"
                type="date"
                value={formData.estimatedCompletionDate}
                onChange={(e) => handleInputChange('estimatedCompletionDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Costo estimado (COP)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="0"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en-proceso">En Proceso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technician">Técnico asignado</Label>
              <Select value={formData.technician} onValueChange={(value) => handleInputChange('technician', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un técnico" />
                </SelectTrigger>
                <SelectContent>
                  {mockTechnicians.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              placeholder="Información adicional relevante..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Repuestos y Partes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Repuestos y Partes</CardTitle>
              <CardDescription>
                Agregue los repuestos necesarios para el mantenimiento
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddPart}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Repuesto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {parts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No hay repuestos agregados
            </div>
          ) : (
            parts.map((part, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Nombre del repuesto..."
                  value={part}
                  onChange={(e) => handlePartChange(index, e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePart(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
