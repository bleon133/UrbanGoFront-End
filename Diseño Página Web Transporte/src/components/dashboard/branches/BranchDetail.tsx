import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { Alert, AlertDescription } from '../../ui/alert';
import { ArrowLeft, Edit2, Save, X, Upload, MapPin, Clock, CreditCard, Truck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { DEFAULT_COORDS } from '../../../constants/cities';
import { Branch } from './types';
import { api } from '../../../services/api';

interface BranchDetailProps {
  branch: Branch;
  onBack: () => void;
  onSave: (branch: Branch, photoFile: File | null) => Promise<Branch>;
}

type Option = { id: string; nombre: string };

const mapBankOption = (item: any): Option | null => {
  if (!item || typeof item !== 'object') return null;
  const id =
    item.id ??
    item.id_banco ??
    item.idBanco ??
    item.codigo ??
    item.codigo_banco ??
    item.codigoBanco ??
    null;
  const nombre =
    item.nombre ??
    item.nombre_banco ??
    item.nombreBanco ??
    item.descripcion ??
    item.alias ??
    item.codigo ??
    null;
  if (id == null || !nombre) return null;
  return { id: String(id), nombre: String(nombre) };
};

const normalizeBranch = (incoming: Branch): Branch => {
  const parts = incoming.cityNeighborhood?.split(',') ?? [];
  const cityFromCombo = parts[0]?.trim();
  const neighborhoodFromCombo = parts[1]?.trim();
  return {
    ...incoming,
    city: incoming.city || cityFromCombo || '',
    neighborhood: incoming.neighborhood || neighborhoodFromCombo || incoming.cityNeighborhood || '',
    addressDetail: incoming.addressDetail || '',
    postalCode: incoming.postalCode || '',
    workDays: incoming.workDays || [],
    accountNumber: incoming.accountNumber || '',
    accountType: incoming.accountType || '',
    bank: incoming.bank || '',
    accountId: incoming.accountId ?? null,
    openingHours: incoming.openingHours || '',
    closingHours: incoming.closingHours || '',
    ciudadId: incoming.ciudadId ?? null,
    barrioId: incoming.barrioId ?? null,
  };
};

// Mock vehicles data para demostración
const mockVehicles = [
  {
    id: '1',
    branchId: '1',
    type: 'moto',
    brand: 'Honda',
    model: 'XR 150',
    status: 'disponible',
    condition: 'excelente',
    licensePlate: 'ABC123'
  },
  {
    id: '2',
    branchId: '1',
    type: 'bicicleta-electrica',
    brand: 'Trek',
    model: 'E-Bike 500',
    status: 'arrendado',
    condition: 'bueno',
    licensePlate: null
  },
  {
    id: '3',
    branchId: '2',
    type: 'patineta-electrica',
    brand: 'Xiaomi',
    model: 'Mi Scooter Pro',
    status: 'en-mantenimiento',
    condition: 'regular',
    licensePlate: null
  }
];

export const BranchDetail: React.FC<BranchDetailProps> = ({ branch, onBack, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalBranch, setOriginalBranch] = useState<Branch>(() => normalizeBranch(branch));
  const [formData, setFormData] = useState<Branch>(() => normalizeBranch(branch));
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(branch.photo || '');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [cities, setCities] = useState<Option[]>([]);
  const [barrios, setBarrios] = useState<Option[]>([]);
  const [banks, setBanks] = useState<Option[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [banksError, setBanksError] = useState<string | null>(null);

  const daysOfWeek = [
    { id: 'lunes', label: 'Lunes' },
    { id: 'martes', label: 'Martes' },
    { id: 'miercoles', label: 'Miércoles' },
    { id: 'jueves', label: 'Jueves' },
    { id: 'viernes', label: 'Viernes' },
    { id: 'sabado', label: 'Sábado' },
    { id: 'domingo', label: 'Domingo' }
  ];

  useEffect(() => {
    const normalized = normalizeBranch(branch);
    setOriginalBranch(normalized);
    setFormData(normalized);
    setPhotoPreview(normalized.photo || '');
  }, [branch]);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<Array<any>>('/geo/ciudades');
        const mapped = data
          .map((c: any) => {
            const id = c.id ?? c.id_ciudad ?? c.idCiudad;
            const nombre = c.nombre ?? c.nombre_ciudad ?? c.nombreCiudad;
            return id != null && nombre ? { id: String(id), nombre: String(nombre) } : null;
          })
          .filter(Boolean) as Option[];
        setCities(mapped);
      } catch (error) {
        console.error('Error cargando ciudades', error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!formData.ciudadId) {
        setBarrios([]);
        return;
      }
      try {
        const data = await api.get<Array<any>>(`/geo/ciudades/${formData.ciudadId}/barrios`);
        const mapped = data
          .map((b: any) => {
            const id = b.id ?? b.id_barrio ?? b.idBarrio;
            const nombre = b.nombre ?? b.nombre_barrio ?? b.nombreBarrio;
            return id != null && nombre ? { id: String(id), nombre: String(nombre) } : null;
          })
          .filter(Boolean) as Option[];
        setBarrios(mapped);
      } catch (error) {
        console.error('Error cargando barrios', error);
      }
    })();
  }, [formData.ciudadId]);

  useEffect(() => {
    let active = true;
    (async () => {
      setBanksLoading(true);
      setBanksError(null);
      try {
        const data = await api.get<Array<any>>('/catalogos/bancos');
        const mapped = data
          .map(mapBankOption)
          .filter(Boolean) as Option[];
        if (active) {
          setBanks(mapped);
        }
      } catch (error) {
        console.error('Error cargando bancos', error);
        if (active) {
          setBanksError('No se pudieron cargar los bancos.');
        }
      } finally {
        if (active) {
          setBanksLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Load Leaflet map
  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || map || !formData.latitude || !formData.longitude) return;

    const L = (window as any).L;
    if (!L) return;
    
    const lat = formData.latitude || DEFAULT_COORDS.lat;
    const lng = formData.longitude || DEFAULT_COORDS.lng;

    const newMap = L.map('branch-map-container').setView([lat, lng], DEFAULT_COORDS.zoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    const newMarker = L.marker([lat, lng], {
      draggable: isEditing
    }).addTo(newMap);

    newMarker.on('dragend', (e: any) => {
      const position = e.target.getLatLng();
      setFormData(prev => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lng
      }));
    });

    newMap.on('click', (e: any) => {
      if (isEditing) {
        const { lat, lng } = e.latlng;
        newMarker.setLatLng([lat, lng]);
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));
      }
    });

    setMap(newMap);
    setMarker(newMarker);
  }, [mapLoaded, map, formData.latitude, formData.longitude]);

  // Update marker draggable state when editing mode changes
  useEffect(() => {
    if (marker) {
      if (isEditing) {
        marker.dragging.enable();
      } else {
        marker.dragging.disable();
      }
    }
  }, [isEditing, marker]);

  // Update marker position when coordinates change manually
  useEffect(() => {
    if (!marker || !formData.latitude || !formData.longitude) return;
    
    const lat = formData.latitude;
    const lng = formData.longitude;
    
    if (!isNaN(lat) && !isNaN(lng)) {
      marker.setLatLng([lat, lng]);
      if (map) {
        map.setView([lat, lng], map.getZoom());
      }
    }
  }, [formData.latitude, formData.longitude, marker, map]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  const handleInputChange = (field: keyof Branch, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(['El archivo de imagen no debe superar los 5MB']);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(['Por favor seleccione un archivo de imagen válido']);
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setErrors([]);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const handleWorkDayChange = (dayId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      workDays: checked 
        ? [...prev.workDays, dayId]
        : prev.workDays.filter(day => day !== dayId)
    }));
  };

  const citySelectValue = formData.ciudadId ? String(formData.ciudadId) : '';
  const barrioSelectValue = formData.barrioId ? String(formData.barrioId) : '';

  const handleCitySelect = (value: string) => {
    const option = cities.find((city) => city.id === value);
    setBarrios([]);
    setFormData(prev => ({
      ...prev,
      ciudadId: value ? Number(value) : null,
      city: option?.nombre || '',
      cityNeighborhood: option?.nombre || prev.cityNeighborhood || '',
      neighborhood: '',
      barrioId: null,
    }));
  };

  const handleBarrioSelect = (value: string) => {
    const option = barrios.find((barrio) => barrio.id === value);
    setFormData(prev => ({
      ...prev,
      barrioId: value ? Number(value) : null,
      neighborhood: option?.nombre || '',
      cityNeighborhood:
        (prev.city || option?.nombre)
          ? [prev.city || '', option?.nombre || ''].filter(Boolean).join(', ')
          : prev.cityNeighborhood,
    }));
  };

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push('El nombre de la sucursal es requerido');
    if (!formData.legalReason.trim()) newErrors.push('La razón social es requerida');
    if (!formData.nit.trim()) newErrors.push('El NIT es requerido');
    if (!formData.legalRepresentative.trim()) newErrors.push('El representante legal es requerido');
    if (!formData.phone.trim()) newErrors.push('El teléfono es requerido');
    if (!formData.email.trim()) newErrors.push('El correo electrónico es requerido');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.push('El correo electrónico no es válido');
    }

    if (!formData.address.trim()) newErrors.push('La dirección es requerida');
    if (!formData.ciudadId) newErrors.push('La ciudad es requerida');
    if (!formData.barrioId) newErrors.push('El barrio es requerido');
    if (!formData.accountNumber?.trim()) newErrors.push('El número de cuenta bancaria es requerido');
    if (!formData.accountType) newErrors.push('El tipo de cuenta es requerido');
    if (!formData.bank) newErrors.push('Debe seleccionar un banco');

    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const payload: Branch = {
        ...formData,
        photo: photoPreview || formData.photo,
      };
      const updated = await onSave(payload, photoFile);
      const merged = {
        ...payload,
        ...updated,
        workDays: payload.workDays,
        accountNumber: payload.accountNumber,
        accountType: payload.accountType,
        bank: payload.bank,
        openingHours: payload.openingHours,
        closingHours: payload.closingHours,
        photo: updated.photo || payload.photo,
      };
      setFormData(merged);
      setOriginalBranch(merged);
      setPhotoPreview(updated.photo || payload.photo || '');
      setPhotoFile(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar sucursal', error);
      setErrors(['Error al actualizar la sucursal. Inténtelo de nuevo.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalBranch);
    setPhotoFile(null);
    setPhotoPreview(originalBranch.photo || '');
    setErrors([]);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const formatWorkDays = (days: string[]) => {
    const dayLabels = days.map(day => 
      daysOfWeek.find(d => d.id === day)?.label || day
    );
    return dayLabels.join(', ');
  };

  const getVehicleTypeLabel = (type: string) => {
    const labels = {
      'moto': 'Moto',
      'patineta-electrica': 'Patineta eléctrica',
      'bicicleta-manual': 'Bicicleta manual',
      'bicicleta-electrica': 'Bicicleta eléctrica',
      'patines-linea': 'Patines de línea'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-500';
      case 'arrendado':
        return 'bg-blue-500';
      case 'en-mantenimiento':
        return 'bg-red-500';
      case 'en-bodega':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excelente':
        return 'bg-green-500';
      case 'bueno':
        return 'bg-blue-500';
      case 'regular':
        return 'bg-yellow-500';
      case 'malo':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Filtrar vehículos por sucursal
  const branchVehicles = mockVehicles.filter(vehicle => vehicle.branchId === branch.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Regresar
          </Button>
          <h1 className="text-2xl font-bold">Detalle de Sucursal</h1>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
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

      {/* Branch Info */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={photoPreview} alt={formData.name} />
                <AvatarFallback className="text-lg">
                  {getInitials(formData.name)}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <div className="flex flex-col space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('branch-photo-upload')?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {photoPreview ? 'Cambiar foto' : 'Subir foto'}
                  </Button>
                  
                  {photoPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removePhoto}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Quitar
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <CardTitle className="text-xl">{formData.name}</CardTitle>
              <CardDescription>{formData.email}</CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                        {formData.city && formData.neighborhood
                          ? `${formData.city}, ${formData.neighborhood}`
                          : (formData.cityNeighborhood || 'Sin ubicación')}
                </span>
              </div>
              <div className="flex space-x-2 mt-2">
                <Badge variant={formData.isActive ? 'secondary' : 'destructive'}>
                  {formData.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>
          </div>
          
          {isEditing && (
            <input
              id="branch-photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          )}
        </CardHeader>
      </Card>

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la sucursal</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalReason">Razón social</Label>
              <Input
                id="legalReason"
                value={formData.legalReason}
                onChange={(e) => handleInputChange('legalReason', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nit">NIT</Label>
              <Input
                id="nit"
                value={formData.nit}
                onChange={(e) => handleInputChange('nit', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalRepresentative">Representante legal</Label>
              <Input
                id="legalRepresentative"
                value={formData.legalRepresentative}
                onChange={(e) => handleInputChange('legalRepresentative', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="representativeDocument">Documento del representante</Label>
              <Input
                id="representativeDocument"
                value={formData.representativeDocument}
                onChange={(e) => handleInputChange('representativeDocument', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select 
                value={formData.isActive.toString()} 
                onValueChange={(value) => handleInputChange('isActive', value === 'true')}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activa</SelectItem>
                  <SelectItem value="false">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Persona de contacto</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Ubicación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección exacta</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressDetail">Detalle de la dirección</Label>
            <Input
              id="addressDetail"
              value={formData.addressDetail || ''}
              onChange={(e) => handleInputChange('addressDetail', e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              {isEditing ? (
                <Select value={citySelectValue} onValueChange={handleCitySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input id="city" value={formData.city || 'No asignada'} disabled />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Barrio *</Label>
              {isEditing ? (
                <Select
                  value={barrioSelectValue}
                  onValueChange={handleBarrioSelect}
                  disabled={!citySelectValue}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={citySelectValue ? 'Seleccione un barrio' : 'Seleccione una ciudad primero'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {barrios.map((barrio) => (
                      <SelectItem key={barrio.id} value={barrio.id}>
                        {barrio.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input id="neighborhood" value={formData.neighborhood || 'No especificado'} disabled />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitud</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude?.toString() || ''}
                onChange={(e) => handleInputChange('latitude', Number(e.target.value))}
                disabled={!isEditing}
                placeholder="Coordenada de latitud"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitud</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude?.toString() || ''}
                onChange={(e) => handleInputChange('longitude', Number(e.target.value))}
                disabled={!isEditing}
                placeholder="Coordenada de longitud"
              />
            </div>
          </div>

          {/* Mapa Leaflet */}
          {formData.latitude && formData.longitude && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ubicación en el Mapa
              </Label>
              {isEditing && (
                <p className="text-sm text-muted-foreground mb-2">
                  Haz clic en el mapa o arrastra el marcador para actualizar la ubicación
                </p>
              )}
              <div 
                id="branch-map-container" 
                className="w-full h-[400px] rounded-lg border border-border"
                style={{ zIndex: 0 }}
              />
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ubicación: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Banking Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Información Bancaria</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Número de cuenta</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de cuenta</Label>
              <Select 
                value={formData.accountType} 
                onValueChange={(value) => handleInputChange('accountType', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ahorros">Ahorros</SelectItem>
                  <SelectItem value="corriente">Corriente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Banco</Label>
            <Select 
              value={formData.bank} 
              onValueChange={(value) => handleInputChange('bank', value)}
              disabled={!isEditing || (banksLoading && !banks.length)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Banco" />
              </SelectTrigger>
              <SelectContent>
                {banks.length > 0 ? (
                  banks.map((bankOption) => (
                    <SelectItem key={bankOption.id} value={bankOption.id}>
                      {bankOption.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__no_banks" disabled>
                    {banksLoading ? 'Cargando bancos...' : banksError || 'No hay bancos disponibles'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Horarios de Atención</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openingHours">Hora de apertura</Label>
              <Input
                id="openingHours"
                type="time"
                value={formData.openingHours}
                onChange={(e) => handleInputChange('openingHours', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closingHours">Hora de cierre</Label>
              <Input
                id="closingHours"
                type="time"
                value={formData.closingHours}
                onChange={(e) => handleInputChange('closingHours', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Días laborales</Label>
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${day.id}`}
                      checked={formData.workDays.includes(day.id)}
                      onCheckedChange={(checked) => handleWorkDayChange(day.id, checked as boolean)}
                    />
                    <Label htmlFor={`edit-${day.id}`} className="text-sm">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">{formatWorkDays(formData.workDays)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Vehículos de la Sucursal</span>
          </CardTitle>
          <CardDescription>
            Lista de vehículos asignados a esta sucursal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {branchVehicles.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay vehículos asignados a esta sucursal</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Marca/Modelo</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Condición</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branchVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <span className="font-medium">
                          {getVehicleTypeLabel(vehicle.type)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{vehicle.brand}</p>
                          <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {vehicle.licensePlate || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(vehicle.status)} text-white`}>
                          {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1).replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getConditionColor(vehicle.condition)} text-white`}>
                          {vehicle.condition.charAt(0).toUpperCase() + vehicle.condition.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Stats summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {branchVehicles.filter(v => v.status === 'disponible').length}
              </div>
              <div className="text-sm text-green-600">Disponibles</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {branchVehicles.filter(v => v.status === 'arrendado').length}
              </div>
              <div className="text-sm text-blue-600">Arrendados</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {branchVehicles.filter(v => v.status === 'en-mantenimiento').length}
              </div>
              <div className="text-sm text-red-600">En Mantenimiento</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {branchVehicles.filter(v => v.status === 'en-bodega').length}
              </div>
              <div className="text-sm text-gray-600">En Bodega</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
