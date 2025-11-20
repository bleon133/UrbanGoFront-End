import React, { useState } from 'react';
import { ReservationsTable } from './ReservationsTable';
import { ReservationDetail } from './ReservationDetail';

export interface Reservation {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  branchId: string;
  branchName: string;
  vehicleId: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  pricePerHour: number;
  totalAmount: number;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia' | 'billetera-digital';
  paymentStatus: 'pendiente' | 'pagado' | 'reembolsado';
  reservationStatus: 'confirmada' | 'en-curso' | 'completada' | 'cancelada';
  requiresDelivery: boolean;
  deliveryAddress?: string;
  deliveryFee?: number;
  deposit: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const ReservationsManagement: React.FC = () => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  };

  const handleBackToTable = () => {
    setSelectedReservation(null);
  };

  if (selectedReservation) {
    return (
      <ReservationDetail 
        reservation={selectedReservation} 
        onBack={handleBackToTable} 
      />
    );
  }

  return <ReservationsTable onViewReservation={handleViewReservation} />;
};