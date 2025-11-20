import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { 
  Edit2, 
  Save, 
  X, 
  Upload,
  User,
  Shield,
  BarChart3,
  Calendar,
  Clock,
  MapPin,
  Truck,
  DollarSign
} from 'lucide-react';

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  documentType: string;
  userType: 'admin' | 'delivery';
  profilePhoto?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  licenseNumber?: string;
  accountNumber?: string;
  accountType?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  experience?: string;
  isActive: boolean;
}

interface DeliveryStats {
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  totalEarnings: number;
  averageRating: number;
  workingHours: number;
  activeVehicles: number;
}

export const ProfileManagement: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: user?.id || '1',
    firstName: user?.firstName || 'Admin',
    lastName: user?.lastName || 'Principal',
    email: user?.email || 'admin@movilidad.com',
    documentNumber: '1234567890',
    documentType: 'cedula',
    userType: user?.userType || 'admin',
    profilePhoto: '',
    phone: '+57 300 123 4567',
    birthDate: '1990-05-15',
    gender: 'masculino',
    licenseNumber: user?.userType === 'delivery' ? 'C2-123456789' : undefined,
    accountNumber: user?.userType === 'delivery' ? '1234567890' : undefined,
    accountType: user?.userType === 'delivery' ? 'ahorros' : undefined,
    emergencyContact: user?.userType === 'delivery' ? 'María Pérez' : undefined,
    emergencyPhone: user?.userType === 'delivery' ? '+57 300 987 6543' : undefined,
    experience: user?.userType === 'delivery' ? '3 años como domiciliario en empresas de comida rápida y mensajería.' : undefined,
    isActive: user?.isActive || true
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(profileData.profilePhoto || '');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data para estadísticas de domiciliario
  const [deliveryStats] = useState<DeliveryStats>({
    totalDeliveries: 1247,
    completedDeliveries: 1189,
    cancelledDeliveries: 58,
    totalEarnings: 2850000,
    averageRating: 4.8,
    workingHours: 160,
    activeVehicles: 2
  });

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
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

    if (!profileData.firstName.trim()) newErrors.push('Los nombres son requeridos');
    if (!profileData.lastName.trim()) newErrors.push('Los apellidos son requeridos');
    if (!profileData.email.trim()) newErrors.push('El correo electrónico es requerido');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (profileData.email && !emailRegex.test(profileData.email)) {
      newErrors.push('El correo electrónico no es válido');
    }

    if (!profileData.documentNumber.trim()) newErrors.push('El número de documento es requerido');

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedProfile = {
        ...profileData,
        profilePhoto: photoPreview || undefined
      };
      console.log('Perfil actualizado:', updatedProfile);
      setIsEditing(false);
    } catch (error) {
      setErrors(['Error al actualizar el perfil. Inténtelo de nuevo.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPhotoFile(null);
    setPhotoPreview(profileData.profilePhoto || '');
    setErrors([]);
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const renderAdminProfile = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y configuración de cuenta</p>
        </div>
        
        <div className="flex items-center space-x-2">
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
              Editar Perfil
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Información Personal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombres</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
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
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de documento</Label>
                  <Select 
                    value={profileData.documentType} 
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
                    value={profileData.documentNumber}
                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={profileData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={profileData.birthDate || ''}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Género</Label>
                <Select 
                  value={profileData.gender || undefined} 
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
            </CardContent>
          </Card>

          {/* Configuración de Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Configuración de Cuenta</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tipo de usuario</p>
                  <p className="text-sm text-muted-foreground">Administrador del sistema</p>
                </div>
                <Badge variant="default">Administrador</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Estado de la cuenta</p>
                  <p className="text-sm text-muted-foreground">Tu cuenta está activa y operativa</p>
                </div>
                <Badge variant="secondary">Activa</Badge>
              </div>
              <Separator />
              <div>
                <p className="font-medium mb-2">Cambiar contraseña</p>
                <Button variant="outline" size="sm">
                  Actualizar contraseña
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Foto de Perfil */}
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={photoPreview} alt={`${profileData.firstName} ${profileData.lastName}`} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(profileData.firstName, profileData.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing && (
                  <div className="flex flex-col space-y-2 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('profile-photo-upload')?.click()}
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
              
              {isEditing && (
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              )}
            </CardContent>
          </Card>

          {/* Información del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Último acceso</p>
                <p className="font-medium">Hoy, 10:30 AM</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Sesiones activas</p>
                <p className="font-medium">2 dispositivos</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Miembro desde</p>
                <p className="font-medium">Enero 2024</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderDeliveryProfile = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">Información personal y estadísticas de trabajo</p>
        </div>
        
        <div className="flex items-center space-x-2">
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
              Editar Perfil
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

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información Personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Información Personal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombres</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
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
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de documento</Label>
                      <Select 
                        value={profileData.documentType} 
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
                        value={profileData.documentNumber}
                        onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={profileData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={profileData.birthDate || ''}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Género</Label>
                    <Select 
                      value={profileData.gender || undefined} 
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
                </CardContent>
              </Card>

              {/* Información Laboral */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Laboral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Número de licencia</Label>
                    <Input
                      id="licenseNumber"
                      value={profileData.licenseNumber || ''}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Número de cuenta</Label>
                      <Input
                        id="accountNumber"
                        value={profileData.accountNumber || ''}
                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de cuenta</Label>
                      <Select 
                        value={profileData.accountType || undefined} 
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Contacto de emergencia</Label>
                      <Input
                        id="emergencyContact"
                        value={profileData.emergencyContact || ''}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Teléfono de emergencia</Label>
                      <Input
                        id="emergencyPhone"
                        value={profileData.emergencyPhone || ''}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiencia previa</Label>
                    <Textarea
                      id="experience"
                      value={profileData.experience || ''}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Foto de Perfil */}
              <Card>
                <CardHeader>
                  <CardTitle>Foto de Perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={photoPreview} alt={`${profileData.firstName} ${profileData.lastName}`} />
                      <AvatarFallback className="text-2xl">
                        {getInitials(profileData.firstName, profileData.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <div className="flex flex-col space-y-2 w-full">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('profile-photo-upload')?.click()}
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
                  
                  {isEditing && (
                    <input
                      id="profile-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Estado del Domiciliario */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estado</span>
                    <Badge variant="secondary">Activo</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Calificación</span>
                    <span className="font-medium">{deliveryStats.averageRating}/5 ⭐</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Vehículos asignados</span>
                    <span className="font-medium">{deliveryStats.activeVehicles}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Estadísticas del Domiciliario */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Domicilios</p>
                    <p className="text-2xl font-bold">{deliveryStats.totalDeliveries}</p>
                  </div>
                  <Truck className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completados</p>
                    <p className="text-2xl font-bold">{deliveryStats.completedDeliveries}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ganancias Totales</p>
                    <p className="text-2xl font-bold">{formatCurrency(deliveryStats.totalEarnings)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Horas Trabajadas</p>
                    <p className="text-2xl font-bold">{deliveryStats.workingHours}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos y detalles adicionales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Actividad Reciente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: 'Hoy, 14:30', action: 'Domicilio completado', location: 'Zona Norte' },
                    { time: 'Hoy, 12:15', action: 'Domicilio completado', location: 'Centro' },
                    { time: 'Hoy, 10:45', action: 'Turno iniciado', location: 'Sucursal Centro' },
                    { time: 'Ayer, 18:00', action: 'Turno finalizado', location: '8 domicilios completados' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.location}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Zonas más Frecuentes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { zone: 'Zona Norte', deliveries: 342, percentage: 65 },
                    { zone: 'Centro', deliveries: 198, percentage: 35 },
                    { zone: 'Zona Sur', deliveries: 145, percentage: 25 },
                    { zone: 'Zona Oeste', deliveries: 98, percentage: 15 }
                  ].map((zone, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{zone.zone}</span>
                        <span className="text-sm text-muted-foreground">{zone.deliveries} domicilios</span>
                      </div>
                      <div className="w-full bg-secondary/20 rounded-full h-2">
                        <div 
                          className="bg-secondary h-2 rounded-full" 
                          style={{ width: `${zone.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return profileData.userType === 'admin' ? renderAdminProfile() : renderDeliveryProfile();
};