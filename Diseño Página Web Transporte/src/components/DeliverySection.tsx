import { Card, CardContent } from "./ui/card";
import { Package, Truck, Clock, MapPin, Users, Calendar } from "lucide-react";

const deliveryTypes = [
  {
    icon: Package,
    title: "Domicilios de Paquetes",
    description: "Servicio de mensajería en moto para envíos urgentes y paquetes",
    color: "primary",
    features: [
      "Entregas en moto uno a la vez",
      "Tracking en tiempo real",
      "Asignación automática a domiciliarios",
      "Cobertura en toda la ciudad"
    ]
  },
  {
    icon: Truck,
    title: "Domicilios de Vehículos",
    description: "Entrega y recogida de tus reservas directamente en tu domicilio",
    color: "secondary",
    features: [
      "Entregas/recogidas en furgoneta",
      "Múltiples vehículos simultáneos",
      "Programación de fecha y hora",
      "Flexibilidad total en recogida/devolución"
    ]
  }
];

const deliveryOptions = [
  {
    icon: MapPin,
    title: "Recogida en Sucursal",
    description: "Retira tu vehículo en cualquiera de nuestras sucursales"
  },
  {
    icon: Truck,
    title: "Entrega a Domicilio",
    description: "Llevamos el vehículo hasta tu puerta sin costo adicional"
  },
  {
    icon: Calendar,
    title: "Devolución Flexible",
    description: "Devuelve en sucursal o solicita recogida a domicilio"
  },
  {
    icon: Clock,
    title: "Horarios Programados",
    description: "Elige fecha y hora exacta para entregas y recogidas"
  }
];

export function DeliverySection() {
  return (
    <section id="domicilios" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sistema Dual de Domicilios
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dos servicios complementarios: envíos de paquetes con tracking en tiempo real y entregas programadas de vehículos de alquiler
          </p>
        </div>

        {/* Delivery Types */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {deliveryTypes.map((type, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className={`bg-${type.color}/10 p-4 rounded-2xl group-hover:bg-${type.color} group-hover:text-white transition-colors`}>
                    <type.icon className={`w-8 h-8 text-${type.color} group-hover:text-white`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                    <p className="text-muted-foreground mb-6">{type.description}</p>
                    
                    <ul className="space-y-3">
                      {type.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reservation Delivery Options */}
        <div className="bg-white rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Flexibilidad en tus Reservas
          </h3>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Cuando alquilas un vehículo, tú decides cómo recibirlo y devolverlo. Combina opciones según tu conveniencia.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryOptions.map((option, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className="bg-primary/10 p-4 rounded-xl mb-4">
                  <option.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{option.title}</h4>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works for Delivery Workers */}
        <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-semibold">¿Quieres ser Domiciliario?</h3>
          </div>
          
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Únete a nuestra red de domiciliarios y empieza a generar ingresos. Gestiona tus entregas, 
            consulta tus ganancias y mantén tu perfil profesional actualizado.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h4 className="font-semibold mb-2">Regístrate</h4>
              <p className="text-sm text-muted-foreground">
                Completa el formulario de registro con tu información y documentación
              </p>
            </div>
            
            <div className="bg-white/80 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h4 className="font-semibold mb-2">Recibe asignaciones</h4>
              <p className="text-sm text-muted-foreground">
                Acepta solicitudes de domicilios disponibles en tu zona
              </p>
            </div>
            
            <div className="bg-white/80 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h4 className="font-semibold mb-2">Gana dinero</h4>
              <p className="text-sm text-muted-foreground">
                Completa entregas y consulta tus estadísticas en tiempo real
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
