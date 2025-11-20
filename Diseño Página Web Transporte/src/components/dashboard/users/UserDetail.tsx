import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Alert, AlertDescription } from '../../ui/alert';
import { ArrowLeft, Edit2, Save, X, Upload } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  documentType: string;
  userType: 'admin' | 'delivery' | 'client';
  profilePhoto?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  // Campos específicos para domiciliarios
  motorcycleLicenseCategory?: string;
  vehicleCategory?: string;
  licenseNumber?: string;
  licenseFrontPhoto?: string;
  licenseBackPhoto?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  experience?: string;
  rating?: string;
  accountNumber?: string;
  accountType?: string;
  // Campos específicos para clientes
  homeAddress?: string;
  addressDetail?: string;
  city?: string;
  neighborhood?: string;
  postalCode?: string;
  isActive: boolean;
}

interface UserDetailProps {
  user: User;
  onBack: () => void;
}

export const UserDetail: React.FC<UserDetailProps> = ({ user, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(user.profilePhoto || '');
  const [licenseFrontPreview, setLicenseFrontPreview] = useState<string>(user.licenseFrontPhoto || '');
  const [licenseBackPreview, setLicenseBackPreview] = useState<string>(user.licenseBackPhoto || '');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof User, value: string | boolean) => {
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

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    if (!formData.firstName.trim()) newErrors.push('Los nombres son requeridos');
    if (!formData.lastName.trim()) newErrors.push('Los apellidos son requeridos');
    if (!formData.email.trim()) newErrors.push('El correo electrónico es requerido');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.push('El correo electrónico no es válido');
    }

    if (!formData.documentNumber.trim()) newErrors.push('El número de documento es requerido');

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
      // Simulación de guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedUser = {
        ...formData,
        profilePhoto: photoPreview || undefined
      };
      console.log('Usuario actualizado:', updatedUser);
      setIsEditing(false);
    } catch (error) {
      setErrors(['Error al actualizar el usuario. Inténtelo de nuevo.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setPhotoFile(null);
    setPhotoPreview(user.profilePhoto || '');
    setErrors([]);
    setIsEditing(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

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
          <h1 className="text-2xl font-bold">Detalle de Usuario</h1>
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

      {/* User Info */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={photoPreview} alt={`${formData.firstName} ${formData.lastName}`} />
                <AvatarFallback className="text-lg">
                  {getInitials(formData.firstName, formData.lastName)}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <div className="flex flex-col space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('user-photo-upload')?.click()}
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
              <CardTitle className="text-xl">
                {formData.firstName} {formData.lastName}
              </CardTitle>
              <CardDescription>{formData.email}</CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant={formData.userType === 'admin' ? 'default' : formData.userType === 'delivery' ? 'secondary' : 'outline'}>
                  {formData.userType === 'admin' ? 'Administrativo' : formData.userType === 'delivery' ? 'Domiciliario' : 'Cliente'}
                </Badge>
                <Badge variant={formData.isActive ? 'secondary' : 'destructive'}>
                  {formData.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>
          
          {isEditing && (
            <input
              id="user-photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          )}
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombres</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellidos</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de documento</Label>
              <Select 
                value={formData.documentType} 
                onValueChange={(value) => handleInputChange('documentType', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cedula">Cédula de ciudadanía</SelectItem>
                  <SelectItem value="cedula-extranjeria">Cédula de extranjería</SelectItem>
                  <SelectItem value="pasaporte">Pasaporte</SelectItem>
                  <SelectItem value="dni">DNI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentNumber">Número de documento</Label>
              <Input
                id="documentNumber"
                value={formData.documentNumber}
                onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {formData.phone && (
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          )}

          {formData.birthDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              {formData.gender && (
                <div className="space-y-2">
                  <Label>Género</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => handleInputChange('gender', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                      <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de usuario</Label>
              <Select 
                value={formData.userType} 
                onValueChange={(value: 'admin' | 'delivery' | 'client') => handleInputChange('userType', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrativo</SelectItem>
                  <SelectItem value="delivery">Domiciliario</SelectItem>
                  <SelectItem value="client">Cliente</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery-specific information */}
      {formData.userType === 'delivery' && (
        <Card>
          <CardHeader>
            <CardTitle>Información Laboral - Domiciliario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(formData.motorcycleLicenseCategory || formData.vehicleCategory) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.motorcycleLicenseCategory && (
                  <div className="space-y-2">
                    <Label>Categoría de moto</Label>
                    <Select 
                      value={formData.motorcycleLicenseCategory} 
                      onValueChange={(value) => handleInputChange('motorcycleLicenseCategory', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Categoría de moto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1 - Motocicletas hasta 125 cc</SelectItem>
                        <SelectItem value="A2">A2 - Motocicletas de cualquier cilindrada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {formData.vehicleCategory && (
                  <div className="space-y-2">
                    <Label>Categoría de vehículo</Label>
                    <Select 
                      value={formData.vehicleCategory} 
                      onValueChange={(value) => handleInputChange('vehicleCategory', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Categoría de vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B2">B2 - Camionetas y camperos</SelectItem>
                        <SelectItem value="B3">B3 - Vehículos de servicio público</SelectItem>
                        <SelectItem value="C1">C1 - Camiones rígidos</SelectItem>
                        <SelectItem value="C2">C2 - Camiones articulados</SelectItem>
                        <SelectItem value="C3">C3 - Vehículos articulados pesados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {formData.licenseNumber && (
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Número de licencia</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            )}

            {(formData.licenseFrontPhoto || formData.licenseBackPhoto) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.licenseFrontPhoto && (
                  <div className="space-y-2">
                    <Label>Foto de licencia frontal</Label>
                    <div className="border rounded-lg p-2">
                      <img 
                        src={licenseFrontPreview} 
                        alt="Licencia frontal" 
                        className="w-full h-40 object-cover rounded"
                      />
                    </div>
                  </div>
                )}
                {formData.licenseBackPhoto && (
                  <div className="space-y-2">
                    <Label>Foto de licencia posterior</Label>
                    <div className="border rounded-lg p-2">
                      <img 
                        src={licenseBackPreview} 
                        alt="Licencia posterior" 
                        className="w-full h-40 object-cover rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {formData.emergencyContact && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Contacto de emergencia</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                {formData.emergencyPhone && (
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Teléfono de emergencia</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                )}
              </div>
            )}

            {formData.experience && (
              <div className="space-y-2">
                <Label htmlFor="experience">Experiencia previa</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            )}

            {(formData.rating || formData.accountNumber) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.rating && (
                  <div className="space-y-2">
                    <Label htmlFor="rating">Calificación</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                )}
                {formData.accountNumber && (
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Número de cuenta</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                )}
              </div>
            )}

            {formData.accountType && (
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
                    <SelectItem value="nequi">Nequi</SelectItem>
                    <SelectItem value="daviplata">Daviplata</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Client-specific information */}
      {formData.userType === 'client' && (
        <Card>
          <CardHeader>
            <CardTitle>Información de Domicilio - Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.homeAddress && (
              <div className="space-y-2">
                <Label htmlFor="homeAddress">Dirección de domicilio</Label>
                <Input
                  id="homeAddress"
                  value={formData.homeAddress}
                  onChange={(e) => handleInputChange('homeAddress', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            )}

            {formData.addressDetail && (
              <div className="space-y-2">
                <Label htmlFor="addressDetail">Detalle del domicilio</Label>
                <Textarea
                  id="addressDetail"
                  value={formData.addressDetail}
                  onChange={(e) => handleInputChange('addressDetail', e.target.value)}
                  disabled={!isEditing}
                  rows={2}
                />
              </div>
            )}

            {(formData.city || formData.neighborhood) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.city && (
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                )}
                {formData.neighborhood && (
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Barrio</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                )}
              </div>
            )}

            {formData.postalCode && (
              <div className="space-y-2">
                <Label htmlFor="postalCode">Código postal</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
