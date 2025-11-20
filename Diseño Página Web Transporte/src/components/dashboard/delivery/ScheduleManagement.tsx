import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Clock, 
  Calendar,
  CheckCircle,
  XCircle,
  Settings,
  Bell,
  MapPin,
  TrendingUp
} from 'lucide-react';

// Mock data para horarios
const weekSchedule = [
  {
    day: 'Lunes',
    isActive: true,
    startTime: '07:00',
    endTime: '15:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    hoursWorked: 7,
    earnings: 98000
  },
  {
    day: 'Martes',
    isActive: true,
    startTime: '07:00',
    endTime: '15:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    hoursWorked: 7,
    earnings: 112000
  },
  {
    day: 'Miércoles',
    isActive: true,
    startTime: '08:00',
    endTime: '16:00',
    breakStart: '12:30',
    breakEnd: '13:30',
    hoursWorked: 7,
    earnings: 95000
  },
  {
    day: 'Jueves',
    isActive: true,
    startTime: '07:00',
    endTime: '15:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    hoursWorked: 7,
    earnings: 124500
  },
  {
    day: 'Viernes',
    isActive: true,
    startTime: '07:00',
    endTime: '15:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    hoursWorked: 7,
    earnings: 89000
  },
  {
    day: 'Sábado',
    isActive: true,
    startTime: '08:00',
    endTime: '17:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    hoursWorked: 8,
    earnings: 136000
  },
  {
    day: 'Domingo',
    isActive: false,
    startTime: '09:00',
    endTime: '17:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    hoursWorked: 0,
    earnings: 0
  }
];

const preferences = {
  autoAcceptOrders: false,
  maxOrdersPerHour: 4,
  preferredZones: ['Cabecera', 'Centro', 'Cañaveral'],
  notifications: {
    newOrders: true,
    peakHours: true,
    earnings: true,
    ratings: false
  },
  workingRadius: 5, // km
  vehicleType: 'moto'
};

export const ScheduleManagement: React.FC = () => {
  const [schedule, setSchedule] = useState(weekSchedule);
  const [settings, setSettings] = useState(preferences);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotalHours = () => {
    return schedule.reduce((total, day) => total + day.hoursWorked, 0);
  };

  const calculateTotalEarnings = () => {
    return schedule.reduce((total, day) => total + day.earnings, 0);
  };

  const handleScheduleChange = (dayIndex: number, field: string, value: any) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      [field]: value
    };
    setSchedule(updatedSchedule);
  };

  const handleSettingChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold">Gestión de Horarios</h1>
        <p className="text-muted-foreground">
          Configura tu horario de trabajo y preferencias de domicilios
        </p>
      </div>

      {/* Resumen de la semana */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horas Programadas</p>
                <p className="font-bold">{calculateTotalHours()}h esta semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proyección Semanal</p>
                <p className="font-bold">{formatCurrency(calculateTotalEarnings())}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Días Activos</p>
                <p className="font-bold">{schedule.filter(day => day.isActive).length} de 7 días</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Horario Semanal</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Horario de Trabajo Semanal</CardTitle>
              <CardDescription>
                Configura tu disponibilidad para cada día de la semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedule.map((day, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 border border-border rounded-lg">
                    <div className="md:col-span-2 flex items-center space-x-3">
                      <Switch
                        checked={day.isActive}
                        onCheckedChange={(checked) => handleScheduleChange(index, 'isActive', checked)}
                      />
                      <div>
                        <p className="font-medium">{day.day}</p>
                        {day.isActive ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Inactivo
                          </Badge>
                        )}
                      </div>
                    </div>

                    {day.isActive && (
                      <>
                        <div>
                          <Label htmlFor={`start-${index}`} className="text-xs">Inicio</Label>
                          <Input
                            id={`start-${index}`}
                            type="time"
                            value={day.startTime}
                            onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                            className="text-sm"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`end-${index}`} className="text-xs">Fin</Label>
                          <Input
                            id={`end-${index}`}
                            type="time"
                            value={day.endTime}
                            onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                            className="text-sm"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`break-start-${index}`} className="text-xs">Descanso</Label>
                          <Input
                            id={`break-start-${index}`}
                            type="time"
                            value={day.breakStart}
                            onChange={(e) => handleScheduleChange(index, 'breakStart', e.target.value)}
                            className="text-sm"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`break-end-${index}`} className="text-xs">Fin Descanso</Label>
                          <Input
                            id={`break-end-${index}`}
                            type="time"
                            value={day.breakEnd}
                            onChange={(e) => handleScheduleChange(index, 'breakEnd', e.target.value)}
                            className="text-sm"
                          />
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Horas</p>
                          <p className="font-medium">{day.hoursWorked}h</p>
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Proyección</p>
                          <p className="font-medium text-green-600">{formatCurrency(day.earnings)}</p>
                        </div>
                      </>
                    )}

                    {!day.isActive && (
                      <div className="md:col-span-6 flex items-center justify-center text-muted-foreground">
                        <p className="text-sm">Día no laborable</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline">Cancelar Cambios</Button>
                <Button>Guardar Horario</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Preferencias de Trabajo</span>
              </CardTitle>
              <CardDescription>
                Personaliza tu experiencia de domicilios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Aceptar pedidos automáticamente</Label>
                    <p className="text-sm text-muted-foreground">
                      Los pedidos se aceptarán automáticamente sin confirmación
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoAcceptOrders}
                    onCheckedChange={(checked) => handleSettingChange('autoAcceptOrders', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxOrders">Máximo de pedidos por hora</Label>
                  <Input
                    id="maxOrders"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.maxOrdersPerHour}
                    onChange={(e) => handleSettingChange('maxOrdersPerHour', parseInt(e.target.value))}
                    className="w-24"
                  />
                  <p className="text-sm text-muted-foreground">
                    Límite para evitar sobrecarga de trabajo
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="radius">Radio de trabajo (km)</Label>
                  <Input
                    id="radius"
                    type="number"
                    min="1"
                    max="15"
                    value={settings.workingRadius}
                    onChange={(e) => handleSettingChange('workingRadius', parseInt(e.target.value))}
                    className="w-24"
                  />
                  <p className="text-sm text-muted-foreground">
                    Distancia máxima que estás dispuesto a viajar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Zonas Preferidas</Label>
                  <div className="flex flex-wrap gap-2">
                    {settings.preferredZones.map((zone, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{zone}</span>
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">
                    Editar Zonas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Configuración de Notificaciones</span>
              </CardTitle>
              <CardDescription>
                Elige qué notificaciones quieres recibir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Nuevos pedidos</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificación cuando recibas un nuevo pedido
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.newOrders}
                    onCheckedChange={(checked) => handleNotificationChange('newOrders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Horas pico</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas cuando inicie una hora de alta demanda
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.peakHours}
                    onCheckedChange={(checked) => handleNotificationChange('peakHours', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Resumen de ganancias</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificación diaria con el resumen de ingresos
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.earnings}
                    onCheckedChange={(checked) => handleNotificationChange('earnings', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Nuevas calificaciones</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificación cuando recibas una nueva calificación
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.ratings}
                    onCheckedChange={(checked) => handleNotificationChange('ratings', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};