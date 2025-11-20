import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

interface LoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onBackToHome: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onRegister, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Credenciales incorrectas. Inténtelo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToHome}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
              <CardDescription>
                Accede a tu cuenta para continuar
              </CardDescription>
            </div>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            <div className="flex flex-col space-y-2 text-sm text-center">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
              
              <div className="text-muted-foreground">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={onRegister}
                  className="text-primary hover:underline"
                >
                  Regístrate aquí
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p><strong>Cuentas de prueba:</strong></p>
              <p>Admin: admin@movilidad.com | 123456</p>
              <p>Domiciliario: domiciliario@movilidad.com | 123456</p>
              <p>Cliente: cliente@movilidad.com | 123456</p>
              <p>Mantenimiento: mantenimiento@movilidad.com | 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};