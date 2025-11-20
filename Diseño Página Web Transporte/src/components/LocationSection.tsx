import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";

interface LocationSectionProps {
  onReservationClick?: () => void;
}

const locations = [
  {
    id: 1,
    name: "Cabecera",
    address: "Calle 42 #27-45, Cabecera del Llano",
    phone: "(607) 123-4567",
    hours: "Lunes a Domingo: 6:00 AM - 10:00 PM",
    status: "Abierto",
    vehicles: 125,
    coordinates: { lat: 7.119, lng: -73.122 }
  },
  {
    id: 2,
    name: "Cañaveral",
    address: "Carrera 25 #51-30, Cañaveral",
    phone: "(607) 123-4568",
    hours: "Lunes a Domingo: 6:00 AM - 10:00 PM",
    status: "Abierto",
    vehicles: 98,
    coordinates: { lat: 7.135, lng: -73.118 }
  },
  {
    id: 3,
    name: "Piedecuesta",
    address: "Calle 5 #8-25, Centro Piedecuesta",
    phone: "(607) 123-4569",
    hours: "Lunes a Domingo: 7:00 AM - 9:00 PM",
    status: "Abierto",
    vehicles: 87,
    coordinates: { lat: 6.988, lng: -73.050 }
  },
  {
    id: 4,
    name: "Floridablanca",
    address: "Carrera 18 #26-15, Floridablanca",
    phone: "(607) 123-4570",
    hours: "Lunes a Domingo: 6:30 AM - 9:30 PM",
    status: "Abierto",
    vehicles: 76,
    coordinates: { lat: 7.062, lng: -73.087 }
  }
];

export function LocationSection({ onReservationClick }: LocationSectionProps) {
  return (
    <section id="ubicacion" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestras Sucursales
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encuentra la sucursal más cercana a ti y verifica la disponibilidad en tiempo real
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Interactive Map Placeholder */}
          <div className="order-2 lg:order-1">
            <Card className="h-full min-h-[500px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary" />
                  Mapa Interactivo
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="bg-muted/30 rounded-lg h-full min-h-[400px] flex items-center justify-center relative overflow-hidden">
                  {/* Mock Map */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                  
                  {/* Location Markers */}
                  {locations.map((location, index) => (
                    <div
                      key={location.id}
                      className="absolute bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        left: `${20 + (index * 15)}%`,
                        top: `${30 + (index * 12)}%`
                      }}
                    >
                      <MapPin className="w-4 h-4" />
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-primary text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        {location.name}
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center z-10">
                    <MapPin className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Mapa interactivo con ubicación de sucursales
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Locations List */}
          <div className="order-1 lg:order-2 space-y-6">
            {locations.map((location) => (
              <Card key={location.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {location.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-2 bg-secondary/10 text-secondary">
                        {location.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Vehículos disponibles</div>
                      <div className="text-2xl font-bold text-primary">{location.vehicles}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <span className="text-sm">{location.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{location.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{location.hours}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Ver en mapa
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={onReservationClick}
                    >
                      Reservar aquí
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Coverage Area */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">Área de Cobertura</h3>
              <p className="text-muted-foreground mb-6">
                Ofrecemos servicios de entrega a domicilio en toda el área metropolitana de Bucaramanga
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Bucaramanga</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Floridablanca</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Piedecuesta</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Girón</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}