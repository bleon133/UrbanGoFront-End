import React, { useCallback, useEffect, useState } from 'react';
import { VehiclesTable } from './VehiclesTable';
import { CreateVehicleForm } from './CreateVehicleForm';
import { VehicleDetail } from './VehicleDetail';
import { BranchOption, Vehicle, VehiclePayload, TransportTypeOption } from './types';
import { api } from '../../../services/api';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

const withPhoto = (path?: string | null) => (path ? `${API_BASE}/photos/${path}` : undefined);

interface Filters {
  search: string;
  type: string;
  status: string;
  branch: string;
}

const defaultFilters: Filters = {
  search: '',
  type: '',
  status: '',
  branch: '',
};

const mapSummaryToVehicle = (summary: any): Vehicle => ({
  id: String(summary.id),
  type: summary.tipoVehiculo || '',
  brand: summary.marca || '',
  model: summary.modelo || '',
  year: summary.anio || undefined,
  licensePlate: summary.placa || '',
  color: summary.color || '',
  status: summary.estado || '',
  branchId: summary.sucursalId ? String(summary.sucursalId) : '',
  branchName: summary.sucursalNombre || '',
  photo: withPhoto(summary.foto),
  tecnomecanicaExpiration: summary.vencimientoTecnomecanica || '',
  soatExpiration: summary.vencimientoSoat || '',
  preventiveMaintenanceDate: summary.fechaMantenimientoPreventivo || '',
});

const mapDetailToVehicle = (detail: any): Vehicle => ({
  id: String(detail.id),
  type: detail.tipoVehiculo || '',
  brand: detail.marca || '',
  model: detail.modelo || '',
  year: detail.anio || undefined,
  licensePlate: detail.placa || '',
  color: detail.color || '',
  weight: detail.peso ? Number(detail.peso) : undefined,
  maxSpeed: detail.velocidadMax ? Number(detail.velocidadMax) : undefined,
  status: detail.estado || '',
  branchId: detail.sucursalId ? String(detail.sucursalId) : '',
  branchName: detail.sucursalNombre || '',
  photo: withPhoto(detail.foto),
  tecnomecanicaExpiration: detail.vencimientoTecnomecanica || '',
  soatExpiration: detail.vencimientoSoat || '',
  preventiveMaintenanceDate: detail.fechaMantenimientoPreventivo || '',
});

const buildPayload = (vehicle: VehiclePayload) => ({
  sucursalId: Number(vehicle.branchId),
  tipoVehiculo: vehicle.type,
  marca: vehicle.brand || '',
  modelo: vehicle.model || '',
  anio: vehicle.year || null,
  placa: vehicle.licensePlate || null,
  color: vehicle.color || null,
  peso: vehicle.weight != null ? Number(vehicle.weight) : null,
  velocidadMax: vehicle.maxSpeed != null ? Number(vehicle.maxSpeed) : null,
  estado: vehicle.status || 'disponible',
  vencimientoTecnomecanica: vehicle.tecnomecanicaExpiration || null,
  vencimientoSoat: vehicle.soatExpiration || null,
  fechaMantenimientoPreventivo: vehicle.preventiveMaintenanceDate || null,
});

export const VehiclesManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [transportTypes, setTransportTypes] = useState<TransportTypeOption[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const fetchBranches = useCallback(async () => {
    try {
      const data = await api.get<Array<any>>('/admin/branches');
      const mapped = data.map((branch: any) => ({
        id: String(branch.id),
        name: branch.nombre || 'Sucursal',
      }));
      setBranches(mapped);
    } catch (error) {
      console.error('Error cargando sucursales', error);
    }
  }, []);

  const fetchTransportTypes = useCallback(async () => {
    try {
      const data = await api.get<Array<any>>('/transport-types');
      setTransportTypes(
        data.map((t: any) => ({
          id: String(t.id),
          name: t.nombre || '',
        })),
      );
    } catch (error) {
      console.error('Error cargando tipos de transporte', error);
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.branch) params.append('branchId', filters.branch);
      if (filters.search) params.append('search', filters.search);
      const query = params.toString();
      const response = await api.get<Array<any>>(`/admin/vehicles${query ? `?${query}` : ''}`);
      setVehicles(response.map(mapSummaryToVehicle));
    } catch (error) {
      console.error('Error cargando vehículos', error);
      setError('No se pudo cargar la lista de transportes.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBranches();
    fetchTransportTypes();
  }, [fetchBranches, fetchTransportTypes]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchVehicles();
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  const handleViewVehicle = async (vehicle: Vehicle) => {
    setIsFetchingDetail(true);
    setDetailError(null);
    try {
      const detail = await api.get(`/admin/vehicles/${vehicle.id}`);
      setSelectedVehicle(mapDetailToVehicle(detail));
    } catch (error) {
      console.error('Error obteniendo vehículo', error);
      setDetailError('No se pudo cargar el vehículo seleccionado.');
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleCreateVehicle = () => {
    setShowCreateForm(true);
  };

  const handleBackToTable = () => {
    setSelectedVehicle(null);
    setShowCreateForm(false);
    setDetailError(null);
    setIsFetchingDetail(false);
  };

  const handleSaveVehicle = async (payload: VehiclePayload, photoFile: File | null) => {
    const request = buildPayload(payload);
    try {
      if (photoFile) {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(request)], { type: 'application/json' }));
        formData.append('photo', photoFile);
        await api.upload('/admin/vehicles', formData);
      } else {
        await api.post('/admin/vehicles', request);
      }
      setShowCreateForm(false);
      await fetchVehicles();
    } catch (error) {
      console.error('Error creando vehículo', error);
      throw error;
    }
  };

  const handleUpdateVehicle = async (payload: VehiclePayload, photoFile: File | null) => {
    if (!payload.id) return null;
    const request = buildPayload(payload);
    try {
      let updated;
      if (photoFile) {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(request)], { type: 'application/json' }));
        formData.append('photo', photoFile);
        updated = await api.upload(`/admin/vehicles/${payload.id}`, formData, 'PUT');
      } else {
        updated = await api.put(`/admin/vehicles/${payload.id}`, request);
      }
      const normalized = mapDetailToVehicle(updated);
      setVehicles(prev => prev.map(v => (v.id === normalized.id ? normalized : v)));
      setSelectedVehicle(normalized);
      return normalized;
    } catch (error) {
      console.error('Error actualizando vehículo', error);
      throw error;
    }
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    try {
      await api.del(`/admin/vehicles/${vehicle.id}`);
      setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
      if (selectedVehicle?.id === vehicle.id) {
        setSelectedVehicle(null);
      }
    } catch (error) {
      console.error('Error eliminando vehículo', error);
      throw error;
    }
  };

  if (isFetchingDetail) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        Cargando transporte...
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-destructive">{detailError}</div>
        <button className="text-primary underline" onClick={handleBackToTable}>
          Volver a la lista
        </button>
      </div>
    );
  }

  if (selectedVehicle) {
    return (
      <VehicleDetail
        vehicle={selectedVehicle}
        branches={branches}
        transportTypes={transportTypes}
        onBack={handleBackToTable}
        onSave={handleUpdateVehicle}
        onDelete={handleDeleteVehicle}
      />
    );
  }

  if (showCreateForm) {
    return (
      <CreateVehicleForm
        branches={branches}
        transportTypes={transportTypes}
        onBack={handleBackToTable}
        onSave={handleSaveVehicle}
      />
    );
  }

  return (
    <VehiclesTable
      branches={branches}
      transportTypes={transportTypes}
      vehicles={vehicles}
      filters={filters}
      onFilterChange={handleFilterChange}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      onViewVehicle={handleViewVehicle}
      onCreateVehicle={handleCreateVehicle}
      onDeleteVehicle={handleDeleteVehicle}
      isLoading={isLoading}
      errorMessage={error}
    />
  );
};
