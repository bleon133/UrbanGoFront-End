import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Alert, AlertDescription } from '../../ui/alert';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';
import { BranchOption, VehiclePayload } from './types';

const VEHICLE_TYPES = [
  { value: 'moto', label: 'Moto' },
  { value: 'patineta-electrica', label: 'Patineta Electrica' },
  { value: 'bicicleta', label: 'Bicicleta' },
];

const STATUS_OPTIONS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'arrendado', label: 'Arrendado' },
  { value: 'en-mantenimiento', label: 'En mantenimiento' },
  { value: 'en-bodega', label: 'En bodega' },
];

interface CreateVehicleFormProps {
  branches: BranchOption[];
  onBack: () => void;
  onSave: (vehicle: VehiclePayload, photoFile: File | null) => Promise<void>;
}

export const CreateVehicleForm: React.FC<CreateVehicleFormProps> = ({ branches, onBack, onSave }) => {
  const [formData, setFormData] = useState<VehiclePayload>({
    type: '',
    brand: '',
    model: '',
    year: undefined,
    licensePlate: '',
    color: '',
    weight: undefined,
    maxSpeed: undefined,
    status: 'disponible',
    branchId: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof VehiclePayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleNumericChange = (field: keyof VehiclePayload, value: string) => {
    const num = value ? Number(value) : undefined;
    setFormData((prev) => ({ ...prev, [field]: Number.isNaN(num) ? undefined : num }));
    setErrors([]);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors(['Seleccione un archivo de imagen válido.']);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(['La imagen no debe superar los 5MB.']);
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const validate = () => {
    const newErrors: string[] = [];
    if (!formData.type) newErrors.push('El tipo de vehículo es obligatorio.');
    if (!formData.brand.trim()) newErrors.push('La marca es obligatoria.');
    if (!formData.model.trim()) newErrors.push('El modelo es obligatorio.');
    if (!formData.branchId) newErrors.push('Debe seleccionar una sucursal.');
    if (!formData.status) newErrors.push('Debe seleccionar el estado del vehículo.');
    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validate();
    if (validation.length > 0) {
      setErrors(validation);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(formData, photoFile);
    } catch (error) {
      setErrors(['No se pudo guardar el transporte. Intente nuevamente.']);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack} type="button">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Regresar
        </Button>
        <h1 className="text-2xl font-bold">Agregar transporte</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos generales</CardTitle>
          <CardDescription>Completa la información básica del transporte.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de transporte *</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado *</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Marca *</Label>
              <Input value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Modelo *</Label>
              <Input value={formData.model} onChange={(e) => handleChange('model', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Año</Label>
              <Input
                type="number"
                value={formData.year?.toString() || ''}
                onChange={(e) => handleNumericChange('year', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Placa</Label>
              <Input value={formData.licensePlate} onChange={(e) => handleChange('licensePlate', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Input value={formData.color} onChange={(e) => handleChange('color', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Peso (kg)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.weight?.toString() || ''}
                onChange={(e) => handleNumericChange('weight', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Velocidad máxima (km/h)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.maxSpeed?.toString() || ''}
                onChange={(e) => handleNumericChange('maxSpeed', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sucursal *</Label>
              <Select value={formData.branchId} onValueChange={(value) => handleChange('branchId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Foto del transporte</Label>
            <div className="flex items-center gap-4">
              <Button type="button" variant="outline" onClick={() => document.getElementById('vehicle-photo')?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Subir imagen
              </Button>
              <input id="vehicle-photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              {photoPreview && (
                <div className="relative">
                  <img src={photoPreview} alt="Previsualización" className="h-20 w-20 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar transporte'}
        </Button>
      </div>
    </form>
  );
};
