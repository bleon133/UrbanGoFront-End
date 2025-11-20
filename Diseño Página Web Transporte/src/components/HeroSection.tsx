import { Button } from "./ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroSectionProps {
  onReservationClick?: () => void;
}

export function HeroSection({ onReservationClick }: HeroSectionProps) {
  return (
    <section id="inicio" className="pt-24 pb-16 bg-gradient-to-br from-accent to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Movilidad urbana completa
                <span className="text-primary block">todo en una plataforma</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Alquila vehículos, solicita envíos o trabaja como domiciliario. Sistema profesional de gestión con entregas a domicilio incluidas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 group"
                onClick={() => {
                  const transportSection = document.getElementById('transporte');
                  transportSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver opciones de transporte
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="group"
                onClick={onReservationClick}
              >
                <Calendar className="mr-2 w-4 h-4" />
                Reserva ahora
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 flex-wrap">
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Vehículos activos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Tipos de vehículos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Atención continua</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">2</div>
                <div className="text-sm text-muted-foreground">Servicios de envío</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1622148976812-8eaeb365cf55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMG1vYmlsaXR5JTIwcGVvcGxlJTIwYmlrZXMlMjBzY29vdGVyc3xlbnwxfHx8fDE3NTg0NzMxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Urban mobility with bikes and scooters"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg z-20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="text-sm font-medium">Disponible ahora</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg z-20">
              <div className="text-sm font-medium text-primary">Desde $12.000/día</div>
              <div className="text-xs text-muted-foreground">Precios competitivos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
