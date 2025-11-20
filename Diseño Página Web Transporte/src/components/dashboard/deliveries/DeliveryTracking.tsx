import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { MapPin, Navigation, Package, Clock } from 'lucide-react';
import { Delivery } from './DeliveriesManagement';

interface DeliveryTrackingProps {
  delivery: Delivery;
  pickupCoords: { lat: number; lng: number };
  deliveryCoords: { lat: number; lng: number };
}

export const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({ 
  delivery, 
  pickupCoords, 
  deliveryCoords 
}) => {
  const initialPosition = delivery.currentLocation || pickupCoords || { lat: 4.6782, lng: -74.0532 };
  const [currentPosition, setCurrentPosition] = useState(initialPosition);
  const [progress, setProgress] = useState(0);

  // Simular movimiento en tiempo real
  useEffect(() => {
    if (!['in_transit', 'picked_up'].includes(delivery.status)) return;
    if (!pickupCoords || !deliveryCoords) return;

    const interval = setInterval(() => {
      setCurrentPosition(prev => {
        if (!prev) return initialPosition;
        
        // Simular movimiento hacia el destino
        const latDiff = (deliveryCoords.lat - pickupCoords.lat) * 0.01;
        const lngDiff = (deliveryCoords.lng - pickupCoords.lng) * 0.01;
        
        const newLat = prev.lat + latDiff;
        const newLng = prev.lng + lngDiff;
        
        // Calcular progreso
        const totalDistance = Math.sqrt(
          Math.pow(deliveryCoords.lat - pickupCoords.lat, 2) + 
          Math.pow(deliveryCoords.lng - pickupCoords.lng, 2)
        );
        const currentDistance = Math.sqrt(
          Math.pow(newLat - pickupCoords.lat, 2) + 
          Math.pow(newLng - pickupCoords.lng, 2)
        );
        const newProgress = Math.min((currentDistance / totalDistance) * 100, 100);
        setProgress(newProgress);
        
        return { lat: newLat, lng: newLng };
      });
    }, 3000); // Actualizar cada 3 segundos

    return () => clearInterval(interval);
  }, [delivery.status, deliveryCoords, pickupCoords]);

  const estimatedTime = () => {
    if (delivery.estimatedDeliveryTime) {
      const now = new Date();
      const eta = new Date(delivery.estimatedDeliveryTime);
      const diffMinutes = Math.round((eta.getTime() - now.getTime()) / (1000 * 60));
      
      if (diffMinutes < 0) return 'Llegada estimada pasada';
      if (diffMinutes < 60) return `${diffMinutes} min`;
      
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}min`;
    }
    return 'N/A';
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary animate-pulse" />
            Seguimiento en Tiempo Real
          </CardTitle>
          <Badge variant="default" className="gap-1 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-white" />
            En vivo
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mapa Simulado */}
        <div className="relative h-64 bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200">
          {/* Fondo del mapa */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300">
            {/* Líneas de cuadrícula simuladas */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(10)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-t border-slate-400"
                  style={{ top: `${i * 10}%` }}
                />
              ))}
              {[...Array(10)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-slate-400"
                  style={{ left: `${i * 10}%` }}
                />
              ))}
            </div>
          </div>

          {/* Ruta */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <line
              x1="20%"
              y1="30%"
              x2="80%"
              y2="70%"
              stroke="url(#routeGradient)"
              strokeWidth="4"
              strokeDasharray="10,5"
            />
          </svg>

          {/* Punto de Recogida */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: '20%', top: '30%' }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" style={{ width: '24px', height: '24px' }} />
              <div className="relative bg-green-500 rounded-full p-2 shadow-lg border-2 border-white">
                <Package className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-medium">
                Recogida
              </div>
            </div>
          </div>

          {/* Posición Actual del Domiciliario */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
            style={{ 
              left: `${20 + progress * 0.6}%`, 
              top: `${30 + progress * 0.4}%` 
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping" style={{ width: '32px', height: '32px' }} />
              <div className="relative bg-blue-500 rounded-full p-3 shadow-xl border-3 border-white">
                <Navigation className="h-5 w-5 text-white" style={{ transform: 'rotate(45deg)' }} />
              </div>
            </div>
            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-blue-500 text-white px-2 py-1 rounded shadow-md text-xs font-medium">
                {delivery.deliveryPersonName}
              </div>
            </div>
          </div>

          {/* Punto de Entrega */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: '80%', top: '70%' }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75" style={{ width: '24px', height: '24px' }} />
              <div className="relative bg-red-500 rounded-full p-2 shadow-lg border-2 border-white">
                <MapPin className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-medium">
                Entrega
              </div>
            </div>
          </div>
        </div>

        {/* Información de Progreso */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso de entrega</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-1000 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Clock className="h-4 w-4" />
                Tiempo estimado
              </div>
              <div className="font-bold text-lg">{estimatedTime()}</div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Navigation className="h-4 w-4" />
                Distancia
              </div>
              <div className="font-bold text-lg">
                {(5.2 * (1 - progress / 100)).toFixed(1)} km
              </div>
            </div>
          </div>

          {/* Estado Actual */}
          <div className="bg-white rounded-lg p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <Navigation className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {delivery.status === 'in_transit' && 'El domiciliario está en camino a la dirección de entrega'}
                  {delivery.status === 'picked_up' && 'El paquete fue recogido exitosamente'}
                  {delivery.status === 'in_pickup' && 'El domiciliario está recogiendo el paquete'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Última actualización: Hace {Math.floor(Math.random() * 5) + 1} minutos
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
