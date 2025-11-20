import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Calendar, 
  History, 
  User, 
  LogOut, 
  Search,
  Home,
  Menu,
  Package,
  Navigation
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { VisuallyHidden } from '../ui/visually-hidden';
import type { LucideIcon } from 'lucide-react';

export type ClientSection =
  | 'overview'
  | 'availability'
  | 'new-reservation'
  | 'history'
  | 'request-delivery'
  | 'my-deliveries'
  | 'profile';

export const CLIENT_SECTION_MODULES: Record<ClientSection, string | null> = {
  overview: 'RESUMEN',
  availability: 'DISPONIBILIDAD',
  'new-reservation': 'NUEVA_RESERVA',
  history: 'MIS_RESERVAS',
  'request-delivery': 'SOLICITAR_DOMICILIO',
  'my-deliveries': 'MIS_DOMICILIOS',
  profile: 'MI_PERFIL',
};

interface ClientSidebarProps {
  activeSection: ClientSection;
  onSectionChange: (section: ClientSection) => void;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const { user, logout, permissions } = useAuth();

  const canViewSection = (section: ClientSection) => {
    const moduleKey = CLIENT_SECTION_MODULES[section];
    if (!moduleKey) return true;
    const modulePerm = permissions[moduleKey];
    return modulePerm ? modulePerm.puedeVer : true;
  };

  const menuItems = [
    {
      id: 'overview',
      icon: Home,
      label: 'Resumen',
      description: 'Panel principal'
    },
    {
      id: 'availability',
      icon: Search,
      label: 'Disponibilidad',
      description: 'Ver vehículos disponibles'
    },
    {
      id: 'new-reservation',
      icon: Calendar,
      label: 'Nueva Reserva',
      description: 'Reservar a domicilio'
    },
    {
      id: 'history',
      icon: History,
      label: 'Mis Reservas',
      description: 'Historial de reservas',
      badge: '3'
    },
    {
      id: 'request-delivery',
      icon: Package,
      label: 'Solicitar Domicilio',
      description: 'Enviar paquetes'
    },
    {
      id: 'my-deliveries',
      icon: Navigation,
      label: 'Mis Domicilios',
      description: 'Rastrear envíos',
      badge: '2'
    },
    {
      id: 'profile',
      icon: User,
      label: 'Mi Perfil',
      description: 'Configuración de cuenta'
    }
  ] as Array<{
    id: ClientSection;
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
            <p className="text-sm text-sidebar-foreground/60">Panel Cliente</p>
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
                onClick={() => onSectionChange(item.id)}
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
                  Menú principal para navegar por las diferentes secciones del dashboard de cliente
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
