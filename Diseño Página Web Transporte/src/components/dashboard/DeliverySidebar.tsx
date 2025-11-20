import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { VisuallyHidden } from '../ui/visually-hidden';
import {
  Package,
  User,
  LogOut,
  Home,
  Star,
  Navigation,
  Menu,
  Bike
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type DeliverySection =
  | 'dashboard'
  | 'available'
  | 'active'
  | 'vehicle-deliveries'
  | 'ratings'
  | 'profile';

export const DELIVERY_SECTION_MODULES: Record<DeliverySection, string | null> = {
  dashboard: 'RESUMEN',
  available: 'PAQUETES',
  active: 'ACTIVO',
  'vehicle-deliveries': 'VEHICULOS',
  ratings: 'CALIFICACIONES',
  profile: 'MI_PERFIL',
};

interface DeliverySidebarProps {
  activeSection: DeliverySection;
  setActiveSection: (section: DeliverySection) => void;
  isMobile?: boolean;
}

export const DeliverySidebar: React.FC<DeliverySidebarProps> = ({ 
  activeSection, 
  setActiveSection,
  isMobile = false
}) => {
  const { user, logout, permissions } = useAuth();

  const canViewSection = (section: DeliverySection) => {
    const moduleKey = DELIVERY_SECTION_MODULES[section];
    if (!moduleKey) return true;
    const modulePerm = permissions[moduleKey];
    return modulePerm ? modulePerm.puedeVer : true;
  };

  const menuItems = [
    {
      id: 'dashboard',
      icon: Home,
      label: 'Resumen',
      description: 'Panel principal',
      badge: null
    },
    {
      id: 'available',
      icon: Package,
      label: 'Paquetes',
      description: 'Domicilios de paquetes',
      badge: '3'
    },
    {
      id: 'active',
      icon: Navigation,
      label: 'Activo',
      description: 'Mi domicilio en curso',
      badge: null
    },
    {
      id: 'vehicle-deliveries',
      icon: Bike,
      label: 'Vehículos',
      description: 'Entregas de vehículos',
      badge: null
    },
    {
      id: 'ratings',
      icon: Star,
      label: 'Calificaciones',
      description: 'Reseñas recibidas',
      badge: null
    },
    {
      id: 'profile',
      icon: User,
      label: 'Mi Perfil',
      description: 'Configuración de cuenta',
      badge: null
    }
  ] as Array<{
    id: DeliverySection;
    icon: LucideIcon;
    label: string;
    description: string;
    badge?: string | null;
  }>;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <h2 className="font-semibold">MobiDelivery</h2>
            <p className="text-sm text-sidebar-foreground/60">Panel Domiciliario</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-sidebar-foreground/60">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.filter(item => canViewSection(item.id)).map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3 ${
                  isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="destructive" 
                          className="text-xs h-5 px-2"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs opacity-70 mt-0.5">{item.description}</p>
                  </div>
                </div>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 bg-sidebar border-r border-sidebar-border flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-sidebar">
            <SheetHeader className="sr-only">
              <VisuallyHidden>
                <SheetTitle>Menú de navegación</SheetTitle>
              </VisuallyHidden>
              <VisuallyHidden>
                <SheetDescription>
                  Menú principal para navegar por las diferentes secciones del dashboard de domiciliario
                </SheetDescription>
              </VisuallyHidden>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
