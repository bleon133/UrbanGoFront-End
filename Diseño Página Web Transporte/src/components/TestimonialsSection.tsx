import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "María González",
    role: "Cliente",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b750?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "La plataforma es súper completa. Alquilé una patineta eléctrica con entrega a domicilio y el proceso fue muy fácil. Sin costos ocultos, todo transparente.",
    vehicle: "Patineta eléctrica"
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    role: "Cliente",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Excelente servicio. La moto llegó con SOAT y todo en regla. Pude elegir recibirla en mi casa y devolverla en sucursal. Muy flexible.",
    vehicle: "Moto"
  },
  {
    id: 3,
    name: "Ana Martínez",
    role: "Cliente",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "El servicio de domicilios de paquetes es rápido y confiable. Puedo hacer tracking en tiempo real. He usado varias veces para mis envíos urgentes.",
    vehicle: "Domicilios"
  },
  {
    id: 4,
    name: "Andrés Ramírez",
    role: "Domiciliario",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    comment: "Como domiciliario, la app es muy intuitiva. Puedo ver mis ganancias en tiempo real y gestionar mis rutas fácilmente. Recomendado 100%.",
    vehicle: "Plataforma"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Clientes y domiciliarios confían en nuestra plataforma para sus necesidades de movilidad
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-8 h-8 text-primary/20" />
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-primary font-medium">{testimonial.vehicle}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">4.9</div>
            <div className="text-sm text-muted-foreground">Calificación promedio</div>
            <div className="flex justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">3,200+</div>
            <div className="text-sm text-muted-foreground">Usuarios activos</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">18,000+</div>
            <div className="text-sm text-muted-foreground">Transacciones realizadas</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">99%</div>
            <div className="text-sm text-muted-foreground">Satisfacción</div>
          </div>
        </div>
      </div>
    </section>
  );
}
