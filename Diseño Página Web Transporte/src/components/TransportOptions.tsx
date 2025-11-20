import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Star, Shield } from "lucide-react";

interface TransportOptionsProps {
  onReservationClick?: () => void;
}

const transportOptions = [
  {
    id: 1,
    name: "Motos",
    description: "Perfectas para distancias largas y transporte rápido por la ciudad",
    image: "https://images.unsplash.com/photo-1547689893-5ed031a9e085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwdHJhbnNwb3J0JTIwdXJiYW58ZW58MXx8fHwxNzU4NDczMTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "Desde $25.000/día",
    rating: 4.8,
    features: ["SOAT incluido", "Revisión tecnomecánica", "Varios modelos"],
    badge: "Más popular"
  },
  {
    id: 2,
    name: "Patinetas Eléctricas",
    description: "Ideales para trayectos cortos y medios con cero emisiones",
    image: "https://images.unsplash.com/photo-1627009607638-9f891bfd0912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjB1cmJhbiUyMGNpdHl8ZW58MXx8fHwxNzU4NDczMTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "Desde $18.000/día",
    rating: 4.6,
    features: ["Hasta 25km autonomía", "Cargador incluido", "Portátil"],
    badge: "Eco-friendly"
  },
  {
    id: 3,
    name: "Bicicletas Eléctricas",
    description: "Combina ejercicio con asistencia eléctrica para mayor comodidad",
    image: "https://images.unsplash.com/photo-1692668696811-90976b749459?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGJpY3ljbGUlMjBjaXR5fGVufDF8fHx8MTc1ODQ3MzEzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "Desde $20.000/día",
    rating: 4.7,
    features: ["Asistencia eléctrica", "Canasta incluida", "Luces LED"],
    badge: "Saludable"
  },
  {
    id: 4,
    name: "Patines en Línea",
    description: "Para los amantes del deporte y la diversión sobre ruedas",
    image: "https://images.unsplash.com/photo-1707126776012-43c753771f4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmxpbmUlMjBza2F0ZXMlMjByb2xsZXJibGFkZXxlbnwxfHx8fDE3NTg0NzMxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "Desde $12.000/día",
    rating: 4.4,
    features: ["Varios tamaños", "Ajustables", "Deportivo"],
    badge: "Diversión"
  }
];

export function TransportOptions({ onReservationClick }: TransportOptionsProps) {
  return (
    <section id="transporte" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Opciones de Transporte
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Vehículos completos sin costos adicionales. Solo pagas el alquiler, sin extras.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {transportOptions.map((option) => (
            <Card key={option.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={option.image}
                    alt={option.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {option.badge && (
                    <Badge className="absolute top-3 left-3 bg-secondary text-white">
                      {option.badge}
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{option.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="mb-2">{option.name}</CardTitle>
                <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                  {option.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  {option.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-primary font-semibold">{option.price}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Disponible 24/7</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={onReservationClick}
                >
                  Reservar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-accent/30 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Sistema sin extras ni costos ocultos</h3>
          </div>
          <p className="text-muted-foreground">
            Todos nuestros vehículos incluyen lo necesario para tu movilidad. El precio que ves es el precio final. 
            Las motos incluyen SOAT y tecnomecánica al día según normativa colombiana.
          </p>
        </div>
      </div>
    </section>
  );
}
