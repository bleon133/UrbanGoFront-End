import { Wrench, ClipboardList, User, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";

export type MaintenanceView = 'pending' | 'profile';

export const MAINTENANCE_SECTION_MODULES: Record<MaintenanceView, string | null> = {
  pending: 'GESTION_TAREAS',
  profile: 'MI_PERFIL',
};

interface MaintenanceSidebarProps {
  activeView: MaintenanceView;
  onViewChange: (view: MaintenanceView) => void;
}

export function MaintenanceSidebar({ activeView, onViewChange }: MaintenanceSidebarProps) {
  const { user, logout, permissions } = useAuth();

  const canViewSection = (view: MaintenanceView) => {
    const moduleKey = MAINTENANCE_SECTION_MODULES[view];
    if (!moduleKey) return true;
    const modulePerm = permissions[moduleKey];
    return modulePerm ? modulePerm.puedeVer : true;
  };

  const menuItems: Array<{ id: MaintenanceView; label: string; icon: LucideIcon }> = [
    { id: 'pending', label: 'Gestión de Tareas', icon: ClipboardList },
    { id: 'profile', label: 'Mi Perfil', icon: User },
  ];

  return (
    <div className="w-64 bg-white border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Wrench className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Panel Mantenimiento</h2>
            <p className="text-sm text-muted-foreground">{user?.firstName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.filter(item => canViewSection(item.id)).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive 
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'hover:bg-accent'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
