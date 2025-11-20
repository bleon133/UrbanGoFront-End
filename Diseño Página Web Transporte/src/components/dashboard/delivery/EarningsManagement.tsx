import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { 
  DollarSign, 
  TrendingUp,
  Calendar,
  Clock,
  Package,
  Star,
  Target,
  Award,
  BarChart3,
  Download
} from 'lucide-react';

// Mock data para ganancias
const earningsData = {
  today: {
    gross: 124500,
    net: 105825,
    deliveries: 8,
    hours: 6.5,
    avgPerDelivery: 15562,
    tips: 18700,
    bonuses: 0
  },
  week: {
    gross: 680000,
    net: 578000,
    deliveries: 47,
    hours: 42,
    avgPerDelivery: 14468,
    tips: 95000,
    bonuses: 25000
  },
  month: {
    gross: 2450000,
    net: 2082500,
    deliveries: 186,
    hours: 168,
    avgPerDelivery: 13172,
    tips: 340000,
    bonuses: 80000
  },
  goals: {
    daily: { target: 150000, current: 124500 },
    weekly: { target: 800000, current: 680000 },
    monthly: { target: 3000000, current: 2450000 }
  }
};

const recentEarnings = [
  {
    id: 'DOM-001',
    date: '2025-01-24',
    time: '14:30',
    customer: 'Ana Rodríguez',
    base: 5000,
    tip: 2000,
    bonus: 0,
    total: 7000,
    rating: 5
  },
  {
    id: 'DOM-002',
    date: '2025-01-24',
    time: '13:45',
    customer: 'Carlos Méndez',
    base: 4000,
    tip: 3000,
    bonus: 0,
    total: 7000,
    rating: 5
  },
  {
    id: 'DOM-003',
    date: '2025-01-24',
    time: '13:15',
    customer: 'Laura Gómez',
    base: 6000,
    tip: 1500,
    bonus: 0,
    total: 7500,
    rating: 4
  },
  {
    id: 'DOM-004',
    date: '2025-01-24',
    time: '12:30',
    customer: 'Miguel Torres',
    base: 4500,
    tip: 2500,
    bonus: 1000,
    total: 8000,
    rating: 5
  },
  {
    id: 'DOM-005',
    date: '2025-01-24',
    time: '11:45',
    customer: 'Sofia Ramírez',
    base: 5500,
    tip: 0,
    bonus: 0,
    total: 5500,
    rating: 3
  }
];

const weeklyEarnings = [
  { day: 'Lun', amount: 98000, deliveries: 7 },
  { day: 'Mar', amount: 112000, deliveries: 8 },
  { day: 'Mié', amount: 95000, deliveries: 6 },
  { day: 'Jue', amount: 124500, deliveries: 8 },
  { day: 'Vie', amount: 89000, deliveries: 6 },
  { day: 'Sáb', amount: 136000, deliveries: 9 },
  { day: 'Dom', amount: 125500, deliveries: 8 }
];

export const EarningsManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCurrentData = () => {
    return earningsData[selectedPeriod as keyof typeof earningsData] || earningsData.today;
  };

  const getGoalData = () => {
    return earningsData.goals[selectedPeriod as keyof typeof earningsData.goals] || earningsData.goals.daily;
  };

  const currentData = getCurrentData();
  const goalData = getGoalData();
  const progressPercentage = calculateProgress(goalData.current, goalData.target);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="font-bold">Mis Ganancias</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Seguimiento detallado de tus ingresos y metas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32 sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Descargar reporte</span>
          </Button>
        </div>
      </div>

      {/* Resumen de ganancias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <DollarSign className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Ganancia Neta</p>
                <p className="font-bold text-green-600 text-sm lg:text-base truncate">{formatCurrency(currentData.net)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Package className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Domicilios</p>
                <p className="font-bold text-sm lg:text-base">{currentData.deliveries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Horas Trabajadas</p>
                <p className="font-bold text-sm lg:text-base">{currentData.hours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground">Promedio/Domicilio</p>
                <p className="font-bold text-sm lg:text-base truncate">{formatCurrency(currentData.avgPerDelivery)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meta del período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Meta del {selectedPeriod === 'today' ? 'Día' : selectedPeriod === 'week' ? 'Semana' : 'Mes'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Progreso de la meta</span>
              <span className="font-medium">
                {formatCurrency(goalData.current)} / {formatCurrency(goalData.target)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{progressPercentage.toFixed(1)}% completado</span>
              <span>Faltan {formatCurrency(goalData.target - goalData.current)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desglose de ganancias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Desglose de Ingresos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Tarifas Base</span>
                </div>
                <span className="font-medium">{formatCurrency(currentData.net - currentData.tips - currentData.bonuses)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Propinas</span>
                </div>
                <span className="font-medium">{formatCurrency(currentData.tips)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Bonificaciones</span>
                </div>
                <span className="font-medium">{formatCurrency(currentData.bonuses)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedPeriod === 'week' && (
          <Card>
            <CardHeader>
              <CardTitle>Ganancias por Día</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyEarnings.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium w-8">{day.day}</span>
                      <div className="flex-1">
                        <div className="bg-primary/20 rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2" 
                            style={{ width: `${(day.amount / Math.max(...weeklyEarnings.map(d => d.amount))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(day.amount)}</p>
                      <p className="text-xs text-muted-foreground">{day.deliveries} domicilios</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Historial detallado */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="bonuses">Bonificaciones</TabsTrigger>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Ganancias Recientes</CardTitle>
              <CardDescription>
                Detalle de tus últimos domicilios completados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEarnings.map((earning, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                        <Badge variant="outline" className="w-fit">{earning.id}</Badge>
                        <span className="font-medium truncate">{earning.customer}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < earning.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {earning.date} a las {earning.time}
                      </p>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-green-600">{formatCurrency(earning.total)}</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Base: {formatCurrency(earning.base)}</p>
                        {earning.tip > 0 && <p>Propina: {formatCurrency(earning.tip)}</p>}
                        {earning.bonus > 0 && <p>Bonus: {formatCurrency(earning.bonus)}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bonuses">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Sistema de Bonificaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <h3 className="font-medium text-green-800 mb-2">Bonus por Velocidad</h3>
                    <p className="text-sm text-green-600">
                      +$1,000 por entrega en menos de 20 minutos
                    </p>
                  </div>
                  
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h3 className="font-medium text-blue-800 mb-2">Bonus por Calificación</h3>
                    <p className="text-sm text-blue-600">
                      +$500 por mantener 4.5+ estrellas
                    </p>
                  </div>
                  
                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <h3 className="font-medium text-purple-800 mb-2">Bonus Horario Pico</h3>
                    <p className="text-sm text-purple-600">
                      +$2,000 por domicilio en hora pico
                    </p>
                  </div>
                  
                  <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <h3 className="font-medium text-orange-800 mb-2">Meta Semanal</h3>
                    <p className="text-sm text-orange-600">
                      +$25,000 por completar 50+ domicilios
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(earningsData.month.net)}</div>
                  <p className="text-sm text-muted-foreground">Ganancia este mes</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{earningsData.month.deliveries}</div>
                  <p className="text-sm text-muted-foreground">Domicilios completados</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">4.8</div>
                  <p className="text-sm text-muted-foreground">Calificación promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};