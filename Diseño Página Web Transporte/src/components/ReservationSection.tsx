import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, Clock, MapPin, Lock, User, Building, Truck, CheckCircle2 } from "lucide-react";

interface ReservationSectionProps {
  onLoginClick?: () => void;
}

export function ReservationSection({ onLoginClick }: ReservationSectionProps) {

  return (
    <section id="reservas" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sistema de Reservas Completo
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma profesional para gestión de alquileres con múltiples opciones de entrega
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 mb-16">
          {/* Login Required Card */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Inicia Sesión para Reservar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">¡Únete a nuestra plataforma!</h3>
                  <p className="text-muted-foreground mb-6">
                    Para hacer una reserva necesitas tener una cuenta. Accede a:
                  </p>
                  
                  <div className="space-y-3 text-left max-w-sm mx-auto mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      <span className="text-sm">Reservas con entrega a domicilio</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      <span className="text-sm">Solicitud de domicilios de paquetes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      <span className="text-sm">Historial completo de reservas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      <span className="text-sm">Gestión de perfil y documentos</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={onLoginClick}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <User className="mr-2 w-4 h-4" />
                  Iniciar Sesión / Registrarse
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    ¿Quieres ser domiciliario? Regístrate y selecciona tu rol
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card>
            <CardHeader>
              <CardTitle>Características del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-accent/30 rounded-lg">
                  <Building className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Múltiples Sucursales</h4>
                    <p className="text-sm text-muted-foreground">
                      Selecciona la sucursal más cercana y consulta disponibilidad en tiempo real
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-accent/30 rounded-lg">
                  <Truck className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Entrega Flexible</h4>
                    <p className="text-sm text-muted-foreground">
                      Elige recibir en sucursal o a domicilio. Devuelve como prefieras
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-accent/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Programación Avanzada</h4>
                    <p className="text-sm text-muted-foreground">
                      Programa fecha y hora exacta para entregas y recogidas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-accent/30 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Sin Extras</h4>
                    <p className="text-sm text-muted-foreground">
                      Todo incluido en el precio. Sin servicios adicionales ni sorpresas
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Info */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Tarifas Simples y Transparentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <div>
                      <span className="font-medium">Moto</span>
                      <p className="text-sm text-muted-foreground">Con SOAT y tecnomecánica</p>
                    </div>
                    <span className="text-primary font-semibold">$25.000/día</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <div>
                      <span className="font-medium">Bicicleta Eléctrica</span>
                      <p className="text-sm text-muted-foreground">Ecológica y eficiente</p>
                    </div>
                    <span className="text-primary font-semibold">$20.000/día</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <div>
                      <span className="font-medium">Patineta Eléctrica</span>
                      <p className="text-sm text-muted-foreground">Ideal para trayectos cortos</p>
                    </div>
                    <span className="text-primary font-semibold">$18.000/día</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <div>
                      <span className="font-medium">Patines en Línea</span>
                      <p className="text-sm text-muted-foreground">Diversión y ejercicio</p>
                    </div>
                    <span className="text-primary font-semibold">$12.000/día</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-secondary/10 rounded-xl">
                <h4 className="font-semibold mb-4 text-center">Beneficios Incluidos</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-sm">Sin costos ocultos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-sm">Vehículos revisados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-sm">Soporte 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-sm">Cancelación flexible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-sm">Entrega a domicilio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-sm">Múltiples métodos de pago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
