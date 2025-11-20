import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Loader2, CheckCircle, Upload, User, Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface RegisterFormProps {
  onBack: () => void;
}

type UserType = 'client' | 'delivery' | null;

export const RegisterForm: React.FC<RegisterFormProps> = ({ onBack }) => {
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
    documentType: '',
    documentNumber: '',
    profilePhoto: null as File | null,
    phone: '',
    // Campos específicos para domiciliarios
    licenseNumber: '',
    accountNumber: '',
    accountType: '',
    emergencyContact: '',
    emergencyPhone: '',
    experience: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { register, isLoading } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));
    }
  };

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    // Validaciones comunes
    if (!formData.firstName.trim()) newErrors.push('El nombre es requerido');
    if (!formData.lastName.trim()) newErrors.push('El apellido es requerido');
    if (!formData.email.trim()) newErrors.push('El correo es requerido');
    if (!formData.password) newErrors.push('La contraseña es requerida');
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Las contraseñas no coinciden');
    }
    if (formData.password.length < 6) {
      newErrors.push('La contraseña debe tener al menos 6 caracteres');
    }

    // Validar mayoría de edad
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        newErrors.push('Debes ser mayor de edad para registrarte');
      }
    } else {
      newErrors.push('La fecha de nacimiento es requerida');
    }

    if (!formData.gender) newErrors.push('El género es requerido');
    if (!formData.documentType) newErrors.push('El tipo de documento es requerido');
    if (!formData.documentNumber.trim()) newErrors.push('El número de documento es requerido');
    if (!formData.phone.trim()) newErrors.push('El teléfono es requerido');

    // Validaciones específicas para domiciliarios
    if (selectedUserType === 'delivery') {
      if (!formData.licenseNumber.trim()) newErrors.push('El número de licencia es requerido');
      if (!formData.accountNumber.trim()) newErrors.push('El número de cuenta es requerido');
      if (!formData.accountType) newErrors.push('El tipo de cuenta es requerido');
      if (!formData.emergencyContact.trim()) newErrors.push('El contacto de emergencia es requerido');
      if (!formData.emergencyPhone.trim()) newErrors.push('El teléfono de emergencia es requerido');
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    
    const registrationData = {
      ...formData,
      userType: selectedUserType
    };
    
    const success = await register(registrationData);
    if (success) {
      setShowSuccessModal(true);
    } else {
      setErrors(['Error al procesar el registro. Inténtelo de nuevo.']);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onBack();
  };

  // Selector de tipo de usuario
  if (!selectedUserType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="p-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-2xl">Registro</CardTitle>
                  <CardDescription>
                    Selecciona el tipo de cuenta que deseas crear
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button
                onClick={() => setSelectedUserType('client')}
                className="w-full h-20 flex-col space-y-2"
                variant="outline"
              >
                <User className="h-8 w-8" />
                <div>
                  <p className="font-medium">Cliente</p>
                  <p className="text-sm text-muted-foreground">
                    Alquila vehículos de transporte
                  </p>
                </div>
              </Button>
              
              <Button
                onClick={() => setSelectedUserType('delivery')}
                className="w-full h-20 flex-col space-y-2"
                variant="outline"
              >
                <Truck className="h-8 w-8" />
                <div>
                  <p className="font-medium">Domiciliario</p>
                  <p className="text-sm text-muted-foreground">
                    Trabaja haciendo entregas
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUserType(null)}
                  className="p-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-2xl">
                    Registro de {selectedUserType === 'client' ? 'Cliente' : 'Domiciliario'}
                  </CardTitle>
                  <CardDescription>
                    {selectedUserType === 'client' 
                      ? 'Completa los datos para crear tu cuenta de cliente'
                      : 'Completa todos los campos para crear tu cuenta de domiciliario'
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Información Personal</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombres *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Ingresa tus nombres"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Ingresa tus apellidos"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="ejemplo@correo.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Repetir contraseña *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirma tu contraseña"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Fecha de nacimiento *</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Género *</Label>
                      <Select value={formData.gender || undefined} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu género" />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de documento *</Label>
                      <Select value={formData.documentType || undefined} onValueChange={(value) => handleInputChange('documentType', value)}>
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
                      <Label htmlFor="documentNumber">Número de documento *</Label>
                      <Input
                        id="documentNumber"
                        value={formData.documentNumber}
                        onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                        placeholder="Número de documento"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profilePhoto">Foto de perfil</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="profilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('profilePhoto')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {formData.profilePhoto ? formData.profilePhoto.name : 'Seleccionar foto'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono móvil *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Número de teléfono"
                    />
                  </div>
                </div>

                {/* Información Laboral - Solo para domiciliarios */}
                {selectedUserType === 'delivery' && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Información Laboral</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Número de licencia de conducción de moto *</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        placeholder="Número de licencia vigente"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Número de cuenta bancaria *</Label>
                        <Input
                          id="accountNumber"
                          value={formData.accountNumber}
                          onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                          placeholder="Número de cuenta o billetera digital"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tipo de cuenta *</Label>
                        <Select value={formData.accountType || undefined} onValueChange={(value) => handleInputChange('accountType', value)}>
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
                        <Label htmlFor="emergencyContact">Contacto de emergencia *</Label>
                        <Input
                          id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                          placeholder="Nombre completo"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Teléfono de emergencia *</Label>
                        <Input
                          id="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                          placeholder="Teléfono de contacto"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experiencia previa en domicilios</Label>
                      <Textarea
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="Describe tu experiencia previa (opcional)"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando registro...
                    </>
                  ) : (
                    'Registrarse'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">¡Registro Exitoso!</DialogTitle>
            <DialogDescription className="text-center">
              {selectedUserType === 'client' ? (
                <>
                  ¡Tu cuenta de cliente ha sido creada exitosamente! 
                  Ya puedes iniciar sesión y comenzar a usar nuestros servicios.
                </>
              ) : (
                <>
                  Tu solicitud de registro como domiciliario ha sido enviada correctamente. 
                  Próximamente será activado tu usuario al ser aprobado por el área administrativa.
                  Te notificaremos por correo electrónico cuando tu cuenta esté lista.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={handleSuccessClose}>
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};