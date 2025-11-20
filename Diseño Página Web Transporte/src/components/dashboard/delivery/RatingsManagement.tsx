import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { 
  Star, 
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Award,
  Target,
  Filter,
  Calendar
} from 'lucide-react';

// Mock data para calificaciones
const ratingsData = {
  overall: {
    average: 4.8,
    total: 342,
    distribution: {
      5: 68,
      4: 22,
      3: 7,
      2: 2,
      1: 1
    }
  },
  recent: [
    {
      id: 'R001',
      date: '2025-01-24',
      time: '14:30',
      customer: 'Ana Rodríguez',
      orderId: 'DOM-001',
      rating: 5,
      comment: 'Excelente servicio, muy rápido y amable. El pedido llegó caliente y a tiempo.',
      tags: ['Rápido', 'Amable', 'Puntual']
    },
    {
      id: 'R002',
      date: '2025-01-24',
      time: '13:45',
      customer: 'Carlos M.',
      orderId: 'DOM-002',
      rating: 5,
      comment: 'Perfecto como siempre, gracias por el excelente servicio.',
      tags: ['Confiable', 'Profesional']
    },
    {
      id: 'R003',
      date: '2025-01-24',
      time: '12:15',
      customer: 'Laura Gómez',
      orderId: 'DOM-003',
      rating: 4,
      comment: 'Buen servicio, aunque tardó un poco más de lo esperado.',
      tags: ['Amable']
    },
    {
      id: 'R004',
      date: '2025-01-23',
      time: '18:20',
      customer: 'Miguel Torres',
      orderId: 'DOM-004',
      rating: 5,
      comment: 'Súper rápido y muy profesional. Excelente comunicación durante todo el proceso.',
      tags: ['Rápido', 'Profesional', 'Comunicativo']
    },
    {
      id: 'R005',
      date: '2025-01-23',
      time: '16:45',
      customer: 'Sofia R.',
      orderId: 'DOM-005',
      rating: 3,
      comment: 'El pedido llegó bien pero sin las servilletas que solicité.',
      tags: []
    }
  ],
  trends: {
    thisWeek: 4.9,
    lastWeek: 4.7,
    thisMonth: 4.8,
    lastMonth: 4.6
  },
  achievements: [
    {
      title: '100 Cinco Estrellas',
      description: 'Conseguiste 100 calificaciones de 5 estrellas',
      icon: '⭐',
      earned: true,
      date: '2025-01-20'
    },
    {
      title: 'Velocidad de Rayo',
      description: '50 entregas en menos de 20 minutos',
      icon: '⚡',
      earned: true,
      date: '2025-01-15'
    },
    {
      title: 'Cliente Feliz',
      description: 'Mantén 4.8+ estrellas por 30 días',
      icon: '😊',
      earned: false,
      progress: 87
    },
    {
      title: 'Comunicador Experto',
      description: '20 comentarios que mencionen comunicación',
      icon: '💬',
      earned: false,
      progress: 65
    }
  ]
};

const topTags = [
  { tag: 'Rápido', count: 89, percentage: 26 },
  { tag: 'Amable', count: 76, percentage: 22 },
  { tag: 'Profesional', count: 65, percentage: 19 },
  { tag: 'Puntual', count: 58, percentage: 17 },
  { tag: 'Confiable', count: 42, percentage: 12 },
  { tag: 'Comunicativo', count: 34, percentage: 10 }
];

export const RatingsManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingBars = () => {
    const total = Object.values(ratingsData.overall.distribution).reduce((a, b) => a + b, 0);
    return [5, 4, 3, 2, 1].map(stars => {
      const count = ratingsData.overall.distribution[stars as keyof typeof ratingsData.overall.distribution];
      const percentage = (count / total) * 100;
      
      return (
        <div key={stars} className="flex items-center space-x-3">
          <span className="text-sm w-8">{stars}</span>
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <div className="flex-1">
            <Progress value={percentage} className="h-2" />
          </div>
          <span className="text-sm text-muted-foreground w-12">{count}%</span>
        </div>
      );
    });
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold">Mis Calificaciones</h1>
          <p className="text-muted-foreground">
            Seguimiento de tu reputación y comentarios de clientes
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo el tiempo</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              {getRatingStars(5)}
            </div>
            <div className="space-y-1">
              <p className="font-bold text-primary">{ratingsData.overall.average}</p>
              <p className="text-sm text-muted-foreground">Calificación promedio</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-1">
              <p className="font-bold">{ratingsData.overall.total}</p>
              <p className="text-sm text-muted-foreground">Total de calificaciones</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <span className="font-bold text-green-600">{ratingsData.trends.thisWeek}</span>
              {getTrendIcon(ratingsData.trends.thisWeek, ratingsData.trends.lastWeek)}
            </div>
            <p className="text-sm text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-1">
              <p className="font-bold text-yellow-600">{ratingsData.overall.distribution[5]}%</p>
              <p className="text-sm text-muted-foreground">Cinco estrellas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="comments">Comentarios</TabsTrigger>
          <TabsTrigger value="achievements">Logros</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribución de calificaciones */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Calificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRatingBars()}
                </div>
              </CardContent>
            </Card>

            {/* Tags más frecuentes */}
            <Card>
              <CardHeader>
                <CardTitle>Aspectos Más Valorados</CardTitle>
                <CardDescription>
                  Palabras clave que los clientes usan para describir tu servicio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topTags.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className="text-xs">
                          {item.tag}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {item.count} menciones
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground w-8">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Comentarios Recientes</CardTitle>
                  <CardDescription>
                    Últimas reseñas y comentarios de tus clientes
                  </CardDescription>
                </div>
                
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrar por estrellas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las calificaciones</SelectItem>
                    <SelectItem value="5">5 estrellas</SelectItem>
                    <SelectItem value="4">4 estrellas</SelectItem>
                    <SelectItem value="3">3 estrellas</SelectItem>
                    <SelectItem value="2">2 estrellas</SelectItem>
                    <SelectItem value="1">1 estrella</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ratingsData.recent.map((review) => (
                  <div key={review.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {review.customer.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{review.customer}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(review.date)} • {review.time}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {getRatingStars(review.rating)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {review.orderId}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3">{review.comment}</p>
                    
                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {review.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Logros y Reconocimientos</span>
              </CardTitle>
              <CardDescription>
                Recompensas por tu excelente servicio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ratingsData.achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 ${
                      achievement.earned 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-border bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Conseguido
                        </Badge>
                      )}
                    </div>
                    
                    {achievement.earned ? (
                      <p className="text-xs text-muted-foreground">
                        Conseguido el {formatDate(achievement.date!)}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Progreso</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Tendencias de Calificación</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Comparativo por Períodos</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Esta Semana</p>
                        <p className="text-sm text-muted-foreground">vs. semana anterior</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${getTrendColor(ratingsData.trends.thisWeek, ratingsData.trends.lastWeek)}`}>
                          {ratingsData.trends.thisWeek}
                        </span>
                        {getTrendIcon(ratingsData.trends.thisWeek, ratingsData.trends.lastWeek)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Este Mes</p>
                        <p className="text-sm text-muted-foreground">vs. mes anterior</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${getTrendColor(ratingsData.trends.thisMonth, ratingsData.trends.lastMonth)}`}>
                          {ratingsData.trends.thisMonth}
                        </span>
                        {getTrendIcon(ratingsData.trends.thisMonth, ratingsData.trends.lastMonth)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Objetivos de Calificación</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Mantener 4.8+ estrellas</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          ✓ Conseguido
                        </Badge>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">90% calificaciones 4+ estrellas</span>
                        <span className="text-sm text-muted-foreground">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">500 calificaciones totales</span>
                        <span className="text-sm text-muted-foreground">342/500</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};