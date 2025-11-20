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
  Bell,
  CreditCard,
  CheckCircle,
  Eye,
  EyeOff,
  BarChart3,
  Clock,
  DollarSign,
  Star,
  Package,
  Truck
} from 'lucide-react';

interface ProfileData {
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
  address?: string;
  city?: string;
  postalCode?: string;
  // Delivery specific
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
  totalEarnings: number;
  averageRating: number;
  workingHours: number;
}

interface ClientStats {
  totalReservations: number;
  totalSpent: number;
  averageRating: number;
}

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    id: user?.id || '1',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    documentNumber: '1234567890',
    documentType: 'cedula',
    userType: user?.userType || 'client',
    profilePhoto: '',
    phone: '+57 300 123 4567',
    birthDate: '1990-05-15',
    gender: 'masculino',
    address: user?.userType === 'client' ? 'Carrera 7 #45-12, Chapinero' : undefined,
    city: user?.userType === 'client' ? 'Bogotá' : undefined,
    postalCode: user?.userType === 'client' ? '110231' : undefined,
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
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    promotionalEmails: false,
    reservationReminders: true,
    preferredPayment: 'card',
    language: 'es'
  });

  // Mock stats
  const [deliveryStats] = useState<DeliveryStats>({
    totalDeliveries: 1247,
    completedDeliveries: 1189,
    totalEarnings: 2850000,
    averageRating: 4.8,
    workingHours: 160
  });

  const [clientStats] = useState<ClientStats>({
    totalReservations: 24,
    totalSpent: 480000,
    averageRating: 4.8
  });

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferencesChange = (field: string, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
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
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
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

  const getUserTypeLabel = () => {
    switch (profileData.userType) {
      case 'admin':
        return 'Administrador';
      case 'delivery':
        return 'Domiciliario';
      case 'client':
        return 'Cliente';
      default:
        return 'Usuario';
    }
  };

  const getUserTypeBadgeColor = () => {
    switch (profileData.userType) {
      case 'admin':
        return 'bg-blue-100 text-blue-700';
      case 'delivery':
        return 'bg-green-100 text-green-700';
      case 'client':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const paymentMethods = [
    {
      id: '1',
      type: 'Nequi',
      number: '**** 4567',
      isDefault: true
    },
    {
      id: '2',
      type: 'Daviplata',
      number: '**** 8901',
      isDefault: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        
        {!isEditing ? (
          <Button size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
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
          </div>
        )}
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Los cambios se han guardado exitosamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Messages */}
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

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={photoPreview} alt={`${profileData.firstName} ${profileData.lastName}`} />
              <AvatarFallback className="text-xl">
                {getInitials(profileData.firstName, profileData.lastName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-bold">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-muted-foreground text-sm mb-3">{profileData.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge variant="outline" className={getUserTypeBadgeColor()}>
                  {getUserTypeLabel()}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Cuenta Activa
                </Badge>
                <Badge variant="secondary">
                  Miembro desde Enero 2024
                </Badge>
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-col space-y-2">
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
                
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards - Show based on user type */}
      {profileData.userType === 'delivery' && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">Total Entregas</p>
              </div>
              <p className="font-bold">{deliveryStats.totalDeliveries}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-xs text-muted-foreground">Completadas</p>
              </div>
              <p className="font-bold">{deliveryStats.completedDeliveries}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <p className="text-xs text-muted-foreground">Ingresos Totales</p>
              </div>
              <p className="font-bold text-sm">{formatCurrency(deliveryStats.totalEarnings)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <p className="text-xs text-muted-foreground">Calificación</p>
              </div>
              <p className="font-bold">{deliveryStats.averageRating}/5</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">Horas Trabajadas</p>
              </div>
              <p className="font-bold">{deliveryStats.workingHours}h</p>
            </CardContent>
          </Card>
        </div>
      )}

      {profileData.userType === 'client' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">Reservas Totales</p>
              </div>
              <p className="font-bold">{clientStats.totalReservations}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <p className="text-xs text-muted-foreground">Gasto Total</p>
              </div>
              <p className="font-bold text-sm">{formatCurrency(clientStats.totalSpent)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <p className="text-xs text-muted-foreground">Mi Calificación</p>
              </div>
              <p className="font-bold">{clientStats.averageRating}/5</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-border overflow-x-auto">
              <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="personal" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5"
                >
                  <User className="h-4 w-4 mr-2" />
                  Información Personal
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Seguridad
                </TabsTrigger>
                {profileData.userType === 'client' && (
                  <>
                    <TabsTrigger 
                      value="preferences" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Preferencias
                    </TabsTrigger>
                    <TabsTrigger 
                      value="payment" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Métodos de Pago
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
            </div>

            <div className="p-6">
              {/* Personal Information Tab */}
              <TabsContent value="personal" className="mt-0 space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Información Personal</h3>
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
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Documentos de Identidad</h3>
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
                </div>

                {/* Client Address */}
                {profileData.userType === 'client' && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-4">Dirección</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Dirección completa</Label>
                          <Input
                            id="address"
                            value={profileData.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Ciudad</Label>
                          <Input
                            id="city"
                            value={profileData.city || ''}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Código postal</Label>
                          <Input
                            id="postalCode"
                            value={profileData.postalCode || ''}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Delivery Specific Info */}
                {profileData.userType === 'delivery' && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-4">Información Laboral</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="licenseNumber">Número de licencia</Label>
                          <Input
                            id="licenseNumber"
                            value={profileData.licenseNumber || ''}
                            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
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
                          <Label htmlFor="emergencyContact">Contacto de emergencia</Label>
                          <Input
                            id="emergencyContact"
                            value={profileData.emergencyContact || ''}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="emergencyPhone">Teléfono de emergencia</Label>
                          <Input
                            id="emergencyPhone"
                            value={profileData.emergencyPhone || ''}
                            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="experience">Experiencia</Label>
                          <Textarea
                            id="experience"
                            value={profileData.experience || ''}
                            onChange={(e) => handleInputChange('experience', e.target.value)}
                            disabled={!isEditing}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-0 space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Cambiar Contraseña</h3>
                  <div className="max-w-md space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Contraseña actual</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nueva contraseña</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      />
                    </div>

                    <Button size="sm">
                      Actualizar Contraseña
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Configuración de Seguridad</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Autenticación de dos factores</p>
                        <p className="text-sm text-muted-foreground">
                          Añade una capa extra de seguridad a tu cuenta
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Activar
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Sesiones activas</p>
                        <p className="text-sm text-muted-foreground">
                          Gestiona los dispositivos donde has iniciado sesión
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver sesiones
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Preferences Tab - Only for clients */}
              {profileData.userType === 'client' && (
                <TabsContent value="preferences" className="mt-0 space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Notificaciones</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notificaciones por email</p>
                          <p className="text-sm text-muted-foreground">
                            Recibir confirmaciones de reserva por correo
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={(e) => handlePreferencesChange('emailNotifications', e.target.checked)}
                          className="rounded"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notificaciones SMS</p>
                          <p className="text-sm text-muted-foreground">
                            Recibir recordatorios por mensaje de texto
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.smsNotifications}
                          onChange={(e) => handlePreferencesChange('smsNotifications', e.target.checked)}
                          className="rounded"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Emails promocionales</p>
                          <p className="text-sm text-muted-foreground">
                            Recibir ofertas y promociones especiales
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.promotionalEmails}
                          onChange={(e) => handlePreferencesChange('promotionalEmails', e.target.checked)}
                          className="rounded"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Recordatorios de reserva</p>
                          <p className="text-sm text-muted-foreground">
                            Recibir recordatorios antes de tus reservas
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.reservationReminders}
                          onChange={(e) => handlePreferencesChange('reservationReminders', e.target.checked)}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-4">Preferencias Generales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                      <div className="space-y-2">
                        <Label>Método de pago preferido</Label>
                        <Select value={preferences.preferredPayment} onValueChange={(value) => handlePreferencesChange('preferredPayment', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="card">Tarjeta</SelectItem>
                            <SelectItem value="cash">Efectivo</SelectItem>
                            <SelectItem value="transfer">Transferencia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Idioma</Label>
                        <Select value={preferences.language} onValueChange={(value) => handlePreferencesChange('language', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}

              {/* Payment Methods Tab - Only for clients */}
              {profileData.userType === 'client' && (
                <TabsContent value="payment" className="mt-0 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Métodos de Pago</h3>
                    <Button size="sm">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Agregar Método
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {paymentMethods.map(method => (
                      <div key={method.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{method.type}</p>
                              <p className="text-sm text-muted-foreground">
                                {method.number}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {method.isDefault && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Principal
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm">
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
