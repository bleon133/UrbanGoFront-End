import React, { useState } from 'react';
import { DeliveriesTable } from './DeliveriesTable';
import { DeliveryDetail } from './DeliveryDetail';

export interface Delivery {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  deliveryPersonId?: string;
  deliveryPersonName?: string;
  pickupAddress: string;
  pickupDetail?: string;
  deliveryAddress: string;
  deliveryDetail?: string;
  packageDescription: string;
  packageWeight?: string;
  packageSize?: string;
  estimatedValue?: string;
  paymentMethod: 'cash' | 'card' | 'transfer';
  deliveryFee: number;
  status: 'pending' | 'assigned' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  priority: 'normal' | 'urgent' | 'express';
  specialInstructions?: string;
  createdAt: string;
  assignedAt?: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  estimatedDeliveryTime?: string;
  pickupPhotoUrl?: string;
  deliveryPhotoUrl?: string;
  rating?: number;
  clientNotes?: string;
  deliveryNotes?: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export const DeliveriesManagement: React.FC = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const handleViewDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
  };

  const handleBackToTable = () => {
    setSelectedDelivery(null);
  };

  if (selectedDelivery) {
    return (
      <DeliveryDetail 
        delivery={selectedDelivery} 
        onBack={handleBackToTable} 
      />
    );
  }

  return (
    <DeliveriesTable 
      onViewDelivery={handleViewDelivery} 
    />
  );
};
