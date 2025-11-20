import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Users, UserCircle, Shield, Bike, Package, BarChart3, Settings, Calendar, Wrench } from "lucide-react";

interface RolesSectionProps {
  onLoginClick?: () => void;
}

const roles = [
  {
    icon: UserCircle,
    title: "Clientes",
    description: "Acceso completo a servicios de movilidad",
    color: "primary",
    features: [
      { icon: Bike, text: "Alquiler de vehículos" },
      { icon: Package, text: "Solicitud de domicilios" },
      { icon: Calendar, text: "Historial de reservas" },
      { icon: Settings, text: "Gestión de perfil" }
    ]
  },
  {
    icon: Package,
    title: "Domiciliarios",
    description: "Gestiona entregas y genera ingresos",
    color: "secondary",
    features: [
      { icon: Package, text: "Domicilios disponibles" },
      { icon: BarChart3, text: "Estadísticas de ganancias" },
      { icon: Calendar, text: "Gestión de rutas" },
      { icon: Settings, text: "Perfil profesional" }
    ]
  },
  {
    icon: Shield,
    title: "Administradores",
    description: "Control total de la plataforma",
    color: "primary",
    features: [
      { icon: Users, text: "Gestión de usuarios" },
      { icon: Settings, text: "Sucursales y vehículos" },
      { icon: Calendar, text: "Reservas presenciales" },
      { icon: BarChart3, text: "Monitoreo de domicilios" }
    ]
  },
  {
    icon: Wrench,
    title: "Mantenimiento",
    description: "Gestión técnica de la flota",
    color: "secondary",
    features: [
      { icon: Wrench, text: "Mantenimientos preventivos" },
      { icon: Settings, text: "Reparaciones correctivas" },
      { icon: Calendar, text: "Programación de tareas" },
      { icon: BarChart3, text: "Control de vehículos" }
    ]
  }
];

export function RolesSection({ onLoginClick }: RolesSectionProps) {
  return (
    <section id="roles" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sistema Multi-Rol
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Plataforma diseñada para cuatro tipos de usuarios, cada uno con funcionalidades específicas y dashboards diferenciados
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {roles.map((role, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className={`w-16 h-16 bg-${role.color}/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-${role.color} transition-colors`}>
                  <role.icon className={`w-8 h-8 text-${role.color} group-hover:text-white`} />
                </div>
                
                <h3 className="text-2xl font-semibold mb-3">{role.title}</h3>
                <p className="text-muted-foreground mb-6">{role.description}</p>
                
                <div className="space-y-3">
                  {role.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <feature.icon className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Features Highlight */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-10 h-10 text-primary" />
              <div>
                <h3 className="text-2xl font-semibold">Panel Administrativo Avanzado</h3>
                <p className="text-muted-foreground">Control completo del ecosistema de movilidad</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6">
                <h4 className="font-semibold mb-3">Gestión de Vehículos</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                    <span>Sistema completo de transportes con motos, patinetas, bicicletas y patines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                    <span>Documentos legales colombianos (SOAT y tecnomecánica) para motocicletas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                    <span>Disponibilidad en tiempo real por sucursal</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h4 className="font-semibold mb-3">Sistema de Reservas</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                    <span>Reservas presenciales con selección de usuario y vehículo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                    <span>Configuración flexible de recogida/devolución (sucursal o domicilio)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                    <span>Sistema limpio sin servicios adicionales</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h4 className="font-semibold mb-3">Domicilios Duales</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5"></div>
                    <span>Domicilios normales de paquetes con tracking en tiempo real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5"></div>
                    <span>Domicilios de vehículos programados en furgoneta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5"></div>
                    <span>Monitoreo completo de todos los domicilios en curso</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h4 className="font-semibold mb-3">Gestión Operativa</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5"></div>
                    <span>Administración de usuarios (clientes y domiciliarios)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5"></div>
                    <span>Control de múltiples sucursales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5"></div>
                    <span>Notificación de mantenimientos correctivos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            onClick={onLoginClick}
            className="bg-primary hover:bg-primary/90"
          >
            <Users className="mr-2 w-5 h-5" />
            Accede a la Plataforma
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Regístrate como cliente o domiciliario, o inicia sesión si ya tienes cuenta
          </p>
        </div>
      </div>
    </section>
  );
}
