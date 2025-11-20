import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Alert, AlertDescription } from '../../ui/alert';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { api } from '../../../services/api';

interface CreateUserFormProps {
  onBack: () => void;
  onSave: (userData: FormData) => void;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    userType: '',
    status: 'active',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    documentType: '',
    documentNumber: '',
    phone: '',
    birthDate: '',
    gender: '',
    motorcycleLicenseCategory: '',
    vehicleCategory: '',
    licenseNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    experience: '',
    rating: '',
    accountNumber: '',
    accountType: '',
    homeAddress: '',
    addressDetail: '',
    city: '',
    neighborhood: '',
    postalCode: ''
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [licenseFrontFile, setLicenseFrontFile] = useState<File | null>(null);
  const [licenseFrontPreview, setLicenseFrontPreview] = useState<string>('');
  const [licenseBackFile, setLicenseBackFile] = useState<File | null>(null);
  const [licenseBackPreview, setLicenseBackPreview] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  type Option = { id: string; nombre: string };
  const [cities, setCities] = useState<Option[]>([]);
  const [barrios, setBarrios] = useState<Option[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<Array<any>>('/geo/ciudades');
        const mapped = data.map((c: any) => {
          const id = c.id ?? c.id_ciudad ?? c.idCiudad;
          const nombre = c.nombre ?? c.nombre_ciudad ?? c.nombreCiudad;
          return id != null && nombre ? { id: String(id), nombre: String(nombre) } : null;
        }).filter(Boolean) as Option[];
        setCities(mapped);
      } catch (e) {
        console.error('Error cargando ciudades', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!formData.city) { setBarrios([]); return; }
      try {
        const data = await api.get<Array<any>>(`/geo/ciudades/${formData.city}/barrios`);
        const mapped = data.map((b: any) => {
          const id = b.id ?? b.id_barrio ?? b.idBarrio;
          const nombre = b.nombre ?? b.nombre_barrio ?? b.nombreBarrio;
          return id != null && nombre ? { id: String(id), nombre: String(nombre) } : null;
        }).filter(Boolean) as Option[];
        setBarrios(mapped);
      } catch (e) {
        console.error('Error cargando barrios', e);
      }
    })();
  }, [formData.city]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setErrors(['La imagen no debe superar los 5MB']); return; }
      if (!file.type.startsWith('image/')) { setErrors(['Seleccione un archivo de imagen']); return; }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setErrors([]);
    }
  };
  const removePhoto = () => { setPhotoFile(null); setPhotoPreview(''); };
  const handleLicenseFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return; if (file.size > 5*1024*1024 || !file.type.startsWith('image/')) return;
    setLicenseFrontFile(file); const r=new FileReader(); r.onload=(ev)=>setLicenseFrontPreview(ev.target?.result as string); r.readAsDataURL(file);
  };
  const removeLicenseFront = () => { setLicenseFrontFile(null); setLicenseFrontPreview(''); };
  const handleLicenseBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return; if (file.size > 5*1024*1024 || !file.type.startsWith('image/')) return;
    setLicenseBackFile(file); const r=new FileReader(); r.onload=(ev)=>setLicenseBackPreview(ev.target?.result as string); r.readAsDataURL(file);
  };
  const removeLicenseBack = () => { setLicenseBackFile(null); setLicenseBackPreview(''); };

  const validateForm = (): string[] => {
    const errs: string[] = [];
    if (!formData.userType) errs.push('El tipo de usuario es requerido');
    if (!formData.firstName.trim()) errs.push('Los nombres son requeridos');
    if (!formData.lastName.trim()) errs.push('Los apellidos son requeridos');
    if (!formData.email.trim()) errs.push('El correo es requerido');
    if (!formData.documentType) errs.push('El tipo de documento es requerido');
    if (!formData.documentNumber.trim()) errs.push('El numero de documento es requerido');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) errs.push('El correo no es valido');
    if (!formData.password || formData.password.length < 8) errs.push('La contraseña debe tener al menos 8 caracteres');
    if (formData.password !== formData.confirmPassword) errs.push('Las contraseñas no coinciden');
    if (formData.userType === 'delivery') {
      if (!formData.phone.trim()) errs.push('El telefono es requerido para domiciliarios');
      if (!formData.motorcycleLicenseCategory) errs.push('La categoria de moto es requerida');
      if (!formData.vehicleCategory) errs.push('La categoria de vehiculo es requerida');
      if (!formData.licenseNumber.trim()) errs.push('El numero de licencia es requerido');
      if (!licenseFrontPreview) errs.push('La foto frontal de licencia es requerida');
      if (!licenseBackPreview) errs.push('La foto posterior de licencia es requerida');
    }
    if (formData.userType === 'client') {
      if (!formData.homeAddress.trim()) errs.push('La direccion es requerida');
      if (!formData.city) errs.push('La ciudad es requerida');
    }
    return errs;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length) { setErrors(validationErrors); return; }
    setIsLoading(true); setErrors([]);
    try {
      const data: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        documentType: (formData.documentType || '').toUpperCase(),
        documentNumber: formData.documentNumber,
        birthDate: formData.birthDate || null,
        gender: formData.gender ? (formData.gender as string).toUpperCase() : null,
        phone: formData.phone || null,
        userType: formData.userType === 'admin' ? 'ADMINISTRADOR' : (formData.userType === 'delivery' ? 'DOMICILIARIO' : (formData.userType === 'maintenance' ? 'MANTENIMIENTO' : 'CLIENTE')),
        disponibilidadLaboral: null,
        contactoEmergencia: formData.emergencyContact || null,
        numeroEmergencia: formData.emergencyPhone || null,
        numeroLicencia: formData.licenseNumber || null,
        categoriaMoto: formData.motorcycleLicenseCategory || null,
        categoriaVehiculo: formData.vehicleCategory || null,
        experienciaPrevia: formData.experience || null,
      };
      const fd = new FormData();
      fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
      if (photoFile) fd.append('photo', photoFile);
      if (licenseFrontFile) fd.append('licenseFront', licenseFrontFile);
      if (licenseBackFile) fd.append('licenseBack', licenseBackFile);
      if (formData.homeAddress || formData.addressDetail || formData.neighborhood || formData.postalCode) {
        const direccionCompleta = [formData.homeAddress, formData.addressDetail].filter(Boolean).join(', ');
        const address = { direccionCompleta, barrioId: formData.neighborhood ? Number(formData.neighborhood) : null, codigoPostal: formData.postalCode || null, detalle: formData.addressDetail || null };
        fd.append('address', new Blob([JSON.stringify(address)], { type: 'application/json' }));
      }
      await onSave(fd);
    } catch (e) { setErrors(['Error al crear el usuario. Intentelo de nuevo.']); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack} disabled={isLoading}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Regresar
        </Button>
        <h1 className="text-2xl font-bold">Crear Nuevo Usuario</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos basicos</CardTitle>
          <CardDescription>Complete la informacion del usuario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive"><AlertDescription>{errors.map((e,i)=>(<div key={i}>{e}</div>))}</AlertDescription></Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de usuario *</Label>
              <Select value={formData.userType} onValueChange={(v)=>handleInputChange('userType', v)}>
                <SelectTrigger><SelectValue placeholder="Seleccione tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrativo</SelectItem>
                  <SelectItem value="delivery">Domiciliario</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="client">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={formData.status} onValueChange={(v)=>handleInputChange('status', v)}>
                <SelectTrigger><SelectValue placeholder="Seleccione estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombres *</Label>
              <Input id="firstName" value={formData.firstName} onChange={(e)=>handleInputChange('firstName', e.target.value)} placeholder="Nombres" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellidos *</Label>
              <Input id="lastName" value={formData.lastName} onChange={(e)=>handleInputChange('lastName', e.target.value)} placeholder="Apellidos" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo de documento *</Label>
              <Select value={formData.documentType} onValueChange={(v)=>handleInputChange('documentType', v)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">CC - Cedula de Ciudadania</SelectItem>
                  <SelectItem value="TI">TI - Tarjeta de Identidad</SelectItem>
                  <SelectItem value="CE">CE - Cedula de Extranjeria</SelectItem>
                  <SelectItem value="PA">PA - Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="documentNumber">Numero de documento *</Label>
              <Input id="documentNumber" value={formData.documentNumber} onChange={(e)=>handleInputChange('documentNumber', e.target.value)} placeholder="1234567890" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electronico *</Label>
              <Input id="email" value={formData.email} onChange={(e)=>handleInputChange('email', e.target.value)} placeholder="correo@dominio.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input id="phone" value={formData.phone} onChange={(e)=>handleInputChange('phone', e.target.value)} placeholder="3001234567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e)=>handleInputChange('birthDate', e.target.value)} />
            </div>
          </div>

          {/* Contraseña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e)=>handleInputChange('password', e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e)=>handleInputChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Requisitos: mínimo 8 caracteres, al menos una letra minúscula, una mayúscula y un número.
          </div>

          <div className="space-y-2">
            <Label>Genero</Label>
            <Select value={formData.gender} onValueChange={(v)=>handleInputChange('gender', v)}>
              <SelectTrigger><SelectValue placeholder="Seleccione genero" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="femenino">Femenino</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Foto de perfil</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                {photoPreview ? (<img src={photoPreview} alt="preview" className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sin foto</div>)}
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 border rounded px-3 py-2 text-sm">
                  <Upload className="w-4 h-4" /> Subir
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
                {photoPreview && (<button type="button" className="text-sm text-muted-foreground inline-flex items-center gap-1" onClick={removePhoto}><X className="w-4 h-4" /> Quitar</button>)}
              </div>
            </div>
          </div>

          {formData.userType === 'delivery' && (
            <>
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Informacion Domiciliario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria moto *</Label>
                    <Select value={formData.motorcycleLicenseCategory} onValueChange={(v)=>handleInputChange('motorcycleLicenseCategory', v)}>
                      <SelectTrigger><SelectValue placeholder="Seleccione categoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1 - Motos hasta 125 cc</SelectItem>
                        <SelectItem value="A2">A2 - Motos de cualquier cilindrada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria vehiculo *</Label>
                    <Select value={formData.vehicleCategory} onValueChange={(v)=>handleInputChange('vehicleCategory', v)}>
                      <SelectTrigger><SelectValue placeholder="Seleccione categoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B2">B2 - Camionetas y camperos</SelectItem>
                        <SelectItem value="B3">B3 - Vehiculos de servicio publico</SelectItem>
                        <SelectItem value="C1">C1 - Camiones rigidos</SelectItem>
                        <SelectItem value="C2">C2 - Camiones articulados</SelectItem>
                        <SelectItem value="C3">C3 - Vehiculos articulados pesados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Numero de licencia *</Label>
                    <Input id="licenseNumber" value={formData.licenseNumber} onChange={(e)=>handleInputChange('licenseNumber', e.target.value)} placeholder="ABC123456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Contacto de emergencia *</Label>
                    <Input id="emergencyContact" value={formData.emergencyContact} onChange={(e)=>handleInputChange('emergencyContact', e.target.value)} placeholder="Nombre completo" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Telefono de emergencia *</Label>
                    <Input id="emergencyPhone" value={formData.emergencyPhone} onChange={(e)=>handleInputChange('emergencyPhone', e.target.value)} placeholder="3001234567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiencia</Label>
                    <Textarea id="experience" rows={2} value={formData.experience} onChange={(e)=>handleInputChange('experience', e.target.value)} placeholder="Descripcion breve" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Foto licencia - frontal *</Label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 border rounded px-3 py-2 text-sm">
                        <Upload className="w-4 h-4" /> Subir frontal
                        <input type="file" accept="image/*" className="hidden" onChange={handleLicenseFrontChange} />
                      </label>
                      {licenseFrontPreview && (<button type="button" className="text-sm text-muted-foreground inline-flex items-center gap-1" onClick={removeLicenseFront}><X className="w-4 h-4" /> Quitar</button>)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Foto licencia - posterior *</Label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 border rounded px-3 py-2 text-sm">
                        <Upload className="w-4 h-4" /> Subir posterior
                        <input type="file" accept="image/*" className="hidden" onChange={handleLicenseBackChange} />
                      </label>
                      {licenseBackPreview && (<button type="button" className="text-sm text-muted-foreground inline-flex items-center gap-1" onClick={removeLicenseBack}><X className="w-4 h-4" /> Quitar</button>)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {formData.userType === 'client' && (
            <>
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Informacion de Domicilio - Cliente</h3>

                <div className="space-y-2">
                  <Label htmlFor="homeAddress">Direccion de domicilio *</Label>
                  <Input id="homeAddress" value={formData.homeAddress} onChange={(e)=>handleInputChange('homeAddress', e.target.value)} placeholder="Calle 123 # 45-67" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressDetail">Detalle del domicilio</Label>
                  <Textarea id="addressDetail" rows={2} value={formData.addressDetail} onChange={(e)=>handleInputChange('addressDetail', e.target.value)} placeholder="Apartamento 201, Torre B, etc." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ciudad *</Label>
                    <Select value={formData.city} onValueChange={(v)=>handleInputChange('city', v)}>
                      <SelectTrigger><SelectValue placeholder="Seleccione ciudad" /></SelectTrigger>
                      <SelectContent>
                        {cities.map(c => (<SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Barrio</Label>
                    <Select value={formData.neighborhood} onValueChange={(v)=>handleInputChange('neighborhood', v)}>
                      <SelectTrigger><SelectValue placeholder="Seleccione barrio" /></SelectTrigger>
                      <SelectContent>
                        {barrios.map(b => (<SelectItem key={b.id} value={b.id}>{b.nombre}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Codigo postal</Label>
                  <Input id="postalCode" value={formData.postalCode} onChange={(e)=>handleInputChange('postalCode', e.target.value)} placeholder="110111" />
                </div>
              </div>
            </>
          )}

          <div className="flex space-x-4 pt-6">
            <Button variant="outline" onClick={onBack} className="flex-1" disabled={isLoading}>Cancelar</Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
              {isLoading ? (<><Save className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>) : (<><Save className="mr-2 h-4 w-4" /> Guardar Usuario</>)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
