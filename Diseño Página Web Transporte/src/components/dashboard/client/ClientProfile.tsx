import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Shield, 
  Bell, 
  Eye, 
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export const ClientProfile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [personalData, setPersonalData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '300-123-4567',
    birthDate: '1992-05-15',
    gender: 'masculino',
    documentType: 'cedula',
    documentNumber: '12345678',
    address: 'Carrera 7 #45-12, Chapinero',
    city: 'Bogotá',
    postalCode: '110231'
  });

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

  const tabs = [
    { id: 'personal', label: 'Información Personal', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'preferences', label: 'Preferencias', icon: Bell },
    { id: 'payment', label: 'Métodos de Pago', icon: CreditCard }
  ];

  const handlePersonalDataChange = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferencesChange = (field: string, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulación de guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const paymentMethods = [
    {
      id: '1',
      type: 'Tarjeta de Débito',
      number: '**** **** **** 4567',
      brand: 'Visa',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'Tarjeta de Débito',
      number: '**** **** **** 8901',
      brand: 'Mastercard',
      expiry: '08/26',
      isDefault: false
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-xl">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div>
              <CardTitle>{user?.firstName} {user?.lastName}</CardTitle>
              <CardDescription>Cliente de MobiDelivery</CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Cuenta Activa
                </Badge>
                <Badge variant="secondary">
                  Cliente desde Enero 2024
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Success Message */}
      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Los cambios se han guardado exitosamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b border-border overflow-x-auto">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Información Personal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombres</Label>
                      <Input
                        id="firstName"
                        value={personalData.firstName}
                        onChange={(e) => handlePersonalDataChange('firstName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos</Label>
                      <Input
                        id="lastName"
                        value={personalData.lastName}
                        onChange={(e) => handlePersonalDataChange('lastName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalData.email}
                        onChange={(e) => handlePersonalDataChange('email', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={personalData.phone}
                        onChange={(e) => handlePersonalDataChange('phone', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={personalData.birthDate}
                        onChange={(e) => handlePersonalDataChange('birthDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Género</Label>
                      <Select value={personalData.gender} onValueChange={(value) => handlePersonalDataChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue />
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
                      <Select value={personalData.documentType} onValueChange={(value) => handlePersonalDataChange('documentType', value)}>
                        <SelectTrigger>
                          <SelectValue />
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
                        value={personalData.documentNumber}
                        onChange={(e) => handlePersonalDataChange('documentNumber', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Dirección</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Dirección completa</Label>
                      <Input
                        id="address"
                        value={personalData.address}
                        onChange={(e) => handlePersonalDataChange('address', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={personalData.city}
                        onChange={(e) => handlePersonalDataChange('city', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Código postal</Label>
                      <Input
                        id="postalCode"
                        value={personalData.postalCode}
                        onChange={(e) => handlePersonalDataChange('postalCode', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
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
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
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
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
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
                              {method.number} • {method.brand} • Exp. {method.expiry}
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

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Información de Seguridad</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Todos los pagos son procesados de forma segura. Nunca almacenamos 
                        los datos completos de tu tarjeta en nuestros servidores.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </div>
  );
};