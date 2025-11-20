import { useCallback, useEffect, useState } from "react";
import { MaintenanceSidebar, MAINTENANCE_SECTION_MODULES, MaintenanceView } from "./MaintenanceSidebar";
import { UserProfile } from "./UserProfile";
import { PendingMaintenances } from "./maintenance/PendingMaintenances";
import { useAuth } from "../../contexts/AuthContext";

const MAINTENANCE_VIEW_ORDER: MaintenanceView[] = ['pending', 'profile'];

export function MaintenanceDashboard() {
  const { permissions } = useAuth();

  const canAccessView = useCallback(
    (view: MaintenanceView) => {
      const moduleKey = MAINTENANCE_SECTION_MODULES[view];
      if (!moduleKey) return true;
      const modulePerm = permissions[moduleKey];
      return modulePerm ? modulePerm.puedeVer : true;
    },
    [permissions]
  );

  const getFirstAllowedView = useCallback((): MaintenanceView => {
    return MAINTENANCE_VIEW_ORDER.find(view => canAccessView(view)) ?? 'pending';
  }, [canAccessView]);

  const [activeView, setActiveView] = useState<MaintenanceView>(() => getFirstAllowedView());

  useEffect(() => {
    if (!canAccessView(activeView)) {
      setActiveView(getFirstAllowedView());
    }
  }, [activeView, canAccessView, getFirstAllowedView]);

  const handleViewChange = (view: MaintenanceView) => {
    if (!canAccessView(view)) return;
    setActiveView(view);
  };

  const renderView = () => {
    switch (activeView) {
      case 'pending':
        return <PendingMaintenances />;
      case 'profile':
        return <UserProfile />;
      default:
        return <PendingMaintenances />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <MaintenanceSidebar 
        activeView={activeView} 
        onViewChange={handleViewChange} 
      />
      <div className="flex-1 overflow-auto">
        {renderView()}
      </div>
    </div>
  );
}
