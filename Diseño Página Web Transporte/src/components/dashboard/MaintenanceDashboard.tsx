import { useState } from "react";
import { MaintenanceSidebar } from "./MaintenanceSidebar";
import { UserProfile } from "./UserProfile";
import { PendingMaintenances } from "./maintenance/PendingMaintenances";

export function MaintenanceDashboard() {
  const [activeView, setActiveView] = useState('pending');

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
        onViewChange={setActiveView} 
      />
      <div className="flex-1 overflow-auto">
        {renderView()}
      </div>
    </div>
  );
}
