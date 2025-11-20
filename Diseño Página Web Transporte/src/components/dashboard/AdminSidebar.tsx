import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { VisuallyHidden } from '../ui/visually-hidden';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Truck, 
  User,
  Menu,
  Calendar,
  LogOut,
  Map,
  Package,
  DollarSign,
  Wrench
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeSection, 
  onSectionChange
}) => {
  const { user, logout, permissions } = useAuth();
  const idToModulo: Record<string, string> = {
    users: 'USUARIOS',
    branches: 'SUCURSALES',
    vehicles: 'TRANSPORTES',
    maintenance: 'MANTENIMIENTOS',
    'transport-map': 'MAPA_DE_TRANSPORTES',
    reservations: 'RESERVAS',
    deliveries: 'DOMICILIOS',
    rates: 'TARIFAS',
    profile: 'MI_PERFIL',
  };
  const menuItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'Resumen',
      description: 'Panel principal'
    },
    {
      id: 'users',
      icon: Users,
      label: 'Usuarios',
      description: 'Gestionar usuarios'
    },
    {
      id: 'branches',
      icon: MapPin,
      label: 'Sucursales',
      description: 'Administrar ubicaciones'
    },
    {
      id: 'vehicles',
      icon: Truck,
      label: 'Transportes',
      description: 'Vehículos disponibles'
    },
    {
      id: 'maintenance',
      icon: Wrench,
      label: 'Mantenimientos',
      description: 'Seguimiento de mantenimientos'
    },
    {
      id: 'transport-map',
      icon: Map,
      label: 'Mapa de Transportes',
      description: 'Ubicación GPS en tiempo real'
    },
    {
      id: 'reservations',
      icon: Calendar,
      label: 'Reservas',
      description: 'Gestionar alquileres'
    },
    {
      id: 'deliveries',
      icon: Package,
      label: 'Domicilios',
      description: 'Gestionar envíos'
    },
    {
      id: 'rates',
      icon: DollarSign,
      label: 'Tarifas',
      description: 'Configurar precios'
    },
    {
      id: 'profile',
      icon: User,
      label: 'Mi Perfil',
      description: 'Configuración de cuenta'
    }
  ];

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
            <h2 className="font-semibold">MobiAdmin</h2>
            <p className="text-sm text-sidebar-foreground/60">Panel Admin</p>
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
          {menuItems.filter(item => {
            const modulo = idToModulo[item.id as string];
            if (!modulo) return true;
            return permissions[modulo]?.puedeVer ?? true;
          }).map((item) => {
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
                    <span className="text-sm font-medium">{item.label}</span>
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
                  Menú principal para navegar por las diferentes secciones del dashboard administrativo
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
