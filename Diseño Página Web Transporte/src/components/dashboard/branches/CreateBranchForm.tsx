import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { Alert, AlertDescription } from '../../ui/alert';
import { ArrowLeft, Save, Upload, X, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { DEFAULT_COORDS } from '../../../constants/cities';
import { Branch } from './types';
import { api } from '../../../services/api';

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

interface CreateBranchFormProps {
  onBack: () => void;
  onSave: (branchData: Branch, photoFile: File | null) => Promise<void>;
}

export const CreateBranchForm: React.FC<CreateBranchFormProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    legalReason: '',
    nit: '',
    legalRepresentative: '',
    representativeDocument: '',
    phone: '',
    email: '',
    contactPerson: '',
    address: '',
    addressDetail: '',
    city: '',
    neighborhood: '',
    postalCode: '',
    latitude: DEFAULT_COORDS.lat.toString(),
    longitude: DEFAULT_COORDS.lng.toString(),
    accountNumber: '',
    accountType: '',
    bank: '',
    openingHours: '',
    closingHours: '',
    workDays: [] as string[]
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
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
      if (!formData.city) {
        setBarrios([]);
        return;
      }
      try {
        const data = await api.get<Array<any>>(`/geo/ciudades/${formData.city}/barrios`);
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
  }, [formData.city]);

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
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || map) return;

    const L = (window as any).L;
    
    const newMap = L.map('map-container').setView([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], DEFAULT_COORDS.zoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    const newMarker = L.marker([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], {
      draggable: true
    }).addTo(newMap);

    newMarker.on('dragend', (e: any) => {
      const position = e.target.getLatLng();
      setFormData(prev => ({
        ...prev,
        latitude: position.lat.toFixed(6),
        longitude: position.lng.toFixed(6)
      }));
    });

    newMap.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      newMarker.setLatLng([lat, lng]);
      setFormData(prev => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6)
      }));
    });

    setMap(newMap);
    setMarker(newMarker);
  }, [mapLoaded, map]);

  // Update marker position when coordinates change manually
  useEffect(() => {
    if (!marker || !formData.latitude || !formData.longitude) return;
    
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      marker.setLatLng([lat, lng]);
      if (map) {
        map.setView([lat, lng], map.getZoom());
      }
    }
  }, [formData.latitude, formData.longitude, marker, map]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleWorkDayChange = (dayId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      workDays: checked 
        ? [...prev.workDays, dayId]
        : prev.workDays.filter(day => day !== dayId)
    }));
    setErrors([]);
  };

  const handleCitySelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      city: value,
      neighborhood: '',
    }));
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

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    // Validaciones básicas
    if (!formData.name.trim()) newErrors.push('El nombre de la sucursal es requerido');
    if (!formData.legalReason.trim()) newErrors.push('La razón social es requerida');
    if (!formData.nit.trim()) newErrors.push('El NIT es requerido');
    if (!formData.legalRepresentative.trim()) newErrors.push('El representante legal es requerido');
    if (!formData.representativeDocument.trim()) newErrors.push('El documento del representante legal es requerido');
    if (!formData.phone.trim()) newErrors.push('El teléfono es requerido');
    if (!formData.email.trim()) newErrors.push('El correo electrónico es requerido');
    if (!formData.contactPerson.trim()) newErrors.push('La persona de contacto es requerida');
    if (!formData.address.trim()) newErrors.push('La dirección es requerida');
    if (!formData.city) newErrors.push('La ciudad es requerida');
    if (!formData.neighborhood) newErrors.push('El barrio es requerido');
    if (!formData.latitude.trim()) newErrors.push('La latitud es requerida');
    if (!formData.longitude.trim()) newErrors.push('La longitud es requerida');
    if (!formData.openingHours.trim()) newErrors.push('El horario de apertura es requerido');
    if (!formData.closingHours.trim()) newErrors.push('El horario de cierre es requerido');

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.push('El formato del correo electrónico es inválido');
    }

    // Validación de días laborales
    if (formData.workDays.length === 0) {
      newErrors.push('Debe seleccionar al menos un día laboral');
    }

    // Validación de coordenadas (obligatorias)
    if (formData.latitude && (isNaN(Number(formData.latitude)) || Number(formData.latitude) < -90 || Number(formData.latitude) > 90)) {
      newErrors.push('La latitud debe ser un número válido entre -90 y 90');
    }
    if (formData.longitude && (isNaN(Number(formData.longitude)) || Number(formData.longitude) < -180 || Number(formData.longitude) > 180)) {
      newErrors.push('La longitud debe ser un número válido entre -180 y 180');
    }

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
      const cityOption = cities.find((city) => city.id === formData.city);
      const barrioOption = barrios.find((barrio) => barrio.id === formData.neighborhood);

      const branchData: Branch = {
        id: '',
        name: formData.name,
        legalReason: formData.legalReason,
        nit: formData.nit,
        legalRepresentative: formData.legalRepresentative,
        representativeDocument: formData.representativeDocument,
        phone: formData.phone,
        email: formData.email,
        contactPerson: formData.contactPerson,
        address: formData.address,
        addressDetail: formData.addressDetail,
        city: cityOption?.nombre || '',
        neighborhood: barrioOption?.nombre || '',
        cityNeighborhood:
          cityOption?.nombre && barrioOption?.nombre ? `${cityOption.nombre}, ${barrioOption.nombre}` : '',
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        accountNumber: formData.accountNumber,
        accountType: formData.accountType,
        bank: formData.bank,
        openingHours: formData.openingHours,
        closingHours: formData.closingHours,
        workDays: formData.workDays,
        photo: photoPreview || undefined,
        isActive: true,
        barrioId: barrioOption ? Number(barrioOption.id) : null,
        ciudadId: cityOption ? Number(cityOption.id) : null,
        postalCode: formData.postalCode,
        photoPath: null,
      };

      await onSave(branchData, photoFile);
    } catch (error) {
      setErrors(['Error al crear la sucursal. Inténtelo de nuevo.']);
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="text-2xl font-bold">Crear Nueva Sucursal</h1>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Sucursal</CardTitle>
          <CardDescription>
            Complete todos los campos requeridos para crear una nueva sucursal
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

          {/* Foto de la Sucursal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Foto de la Sucursal</h3>
            
            <div className="flex items-start space-x-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={photoPreview} alt="Vista previa" />
                  <AvatarFallback className="text-4xl">
                    {formData.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('photo-upload')?.click()}
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
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Sube una foto de la sucursal. Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB.
                </p>
              </div>
            </div>
            
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {/* Información General */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información General</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la sucursal *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: MoviLab Centro"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="legalReason">Razón social *</Label>
                <Input
                  id="legalReason"
                  value={formData.legalReason}
                  onChange={(e) => handleInputChange('legalReason', e.target.value)}
                  placeholder="Ej: MoviLab S.A.S"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nit">NIT *</Label>
                <Input
                  id="nit"
                  value={formData.nit}
                  onChange={(e) => handleInputChange('nit', e.target.value)}
                  placeholder="Ej: 900123456-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="legalRepresentative">Representante legal *</Label>
                <Input
                  id="legalRepresentative"
                  value={formData.legalRepresentative}
                  onChange={(e) => handleInputChange('legalRepresentative', e.target.value)}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="representativeDocument">Documento del representante (CC) *</Label>
                <Input
                  id="representativeDocument"
                  value={formData.representativeDocument}
                  onChange={(e) => handleInputChange('representativeDocument', e.target.value)}
                  placeholder="Número de cédula"
                />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Información de Contacto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono fijo o celular *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Ej: 3001234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="sucursal@movilab.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Persona de contacto / administrador *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="Nombre del administrador"
              />
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Ubicación</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Dirección exacta *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Ej: Carrera 7 # 32-45"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressDetail">Detalle de la dirección</Label>
              <Input
                id="addressDetail"
                value={formData.addressDetail}
                onChange={(e) => handleInputChange('addressDetail', e.target.value)}
                placeholder="Apartamento, torre, referencia, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Código postal</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="Código postal"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Select value={formData.city} onValueChange={handleCitySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Barrio *</Label>
                <Select
                  value={formData.neighborhood}
                  onValueChange={(value) => handleInputChange('neighborhood', value)}
                  disabled={!formData.city}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={formData.city ? 'Seleccione el barrio' : 'Seleccione una ciudad primero'}
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
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ubicación en el Mapa *
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Haz clic en el mapa o arrastra el marcador para establecer la ubicación exacta de la sucursal
              </p>
              <div 
                id="map-container" 
                className="w-full h-[400px] rounded-lg border border-border"
                style={{ zIndex: 0 }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitud *</Label>
                <Input
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="Ej: 7.1193"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitud *</Label>
                <Input
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="Ej: -73.1227"
                />
              </div>
            </div>
          </div>

          {/* Información Bancaria */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Información Bancaria</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Número de cuenta bancaria</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="Número de cuenta"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de cuenta</Label>
                <Select 
                  value={formData.accountType} 
                  onValueChange={(value) => handleInputChange('accountType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de cuenta" />
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
                disabled={isLoading || (banksLoading && !banks.length)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el banco" />
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
          </div>

          {/* Horarios de Atención */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Horarios de Atención</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openingHours">Hora de apertura *</Label>
                <Input
                  id="openingHours"
                  type="time"
                  value={formData.openingHours}
                  onChange={(e) => handleInputChange('openingHours', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closingHours">Hora de cierre *</Label>
                <Input
                  id="closingHours"
                  type="time"
                  value={formData.closingHours}
                  onChange={(e) => handleInputChange('closingHours', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Días de la semana *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.id}
                      checked={formData.workDays.includes(day.id)}
                      onCheckedChange={(checked) => handleWorkDayChange(day.id, checked as boolean)}
                    />
                    <Label htmlFor={day.id} className="text-sm">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
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
              {isLoading ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Sucursal
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
