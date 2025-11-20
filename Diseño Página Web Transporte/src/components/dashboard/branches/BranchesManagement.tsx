import React, { useCallback, useEffect, useState } from 'react';
import { BranchesTable } from './BranchesTable';
import { BranchDetail } from './BranchDetail';
import { CreateBranchForm } from './CreateBranchForm';
import { Branch } from './types';
import { api } from '../../../services/api';
import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

const withBasePhoto = (photoPath?: string | null) =>
  photoPath ? `${API_BASE}/photos/${photoPath}` : undefined;

const normalizeNumber = (value: any) => {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const valueOrUndefined = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const prepareBranch = (branch: Branch): Branch => {
  const inferredCityFromCombo =
    branch.city || (branch.cityNeighborhood?.includes(',') ? branch.cityNeighborhood.split(',')[0].trim() : '');
  const inferredNeighborhoodFromCombo =
    branch.neighborhood ||
    (branch.cityNeighborhood?.includes(',') ? branch.cityNeighborhood.split(',')[1]?.trim() : branch.cityNeighborhood);
  return {
    ...branch,
    city: inferredCityFromCombo,
    neighborhood: inferredNeighborhoodFromCombo,
    addressDetail: branch.addressDetail || '',
    workDays: branch.workDays || [],
    accountNumber: branch.accountNumber || '',
    accountType: branch.accountType || '',
    bank: branch.bank || '',
    accountId: branch.accountId ?? null,
    openingHours: branch.openingHours || '',
    closingHours: branch.closingHours || '',
  };
};

const mapSummaryToBranch = (summary: any): Branch => ({
  id: String(summary.id),
  name: summary.nombre || 'Sucursal',
  legalReason: summary.razonSocial || '',
  nit: summary.nit || '',
  legalRepresentative: summary.representanteLegal || '',
  representativeDocument: summary.documentoRepresentante || '',
  phone: summary.telefonoContacto || '',
  email: summary.correoContacto || '',
  contactPerson: summary.personaContacto || '',
  address: '',
  addressDetail: '',
  city: '',
  neighborhood: '',
  cityNeighborhood: '',
  latitude: undefined,
  longitude: undefined,
  accountNumber: '',
  accountType: '',
  bank: '',
  accountId: null,
  openingHours: '',
  closingHours: '',
  workDays: [],
  photo: withBasePhoto(summary.foto),
  isActive: summary.activa ?? true,
  barrioId: summary.barrioId != null ? Number(summary.barrioId) : null,
  ciudadId: summary.ciudadId != null ? Number(summary.ciudadId) : null,
  postalCode: summary.codigoPostal ?? '',
  photoPath: summary.foto ?? null,
});

const mapDetailToBranch = (detail: any): Branch => {
  const cityNeighborhood = [detail.ciudadNombre, detail.barrioNombre].filter(Boolean).join(', ');
  return {
    id: String(detail.id),
    name: detail.nombre || 'Sucursal',
    legalReason: detail.razonSocial || '',
    nit: detail.nit || '',
    legalRepresentative: detail.representanteLegal || '',
    representativeDocument: detail.documentoRepresentante || '',
    phone: detail.telefonoContacto || '',
    email: detail.correoContacto || '',
    contactPerson: detail.personaContacto || '',
    address: detail.direccion || '',
    addressDetail: detail.detalleDireccion || '',
    city: detail.ciudadNombre || '',
    neighborhood: detail.barrioNombre || '',
    cityNeighborhood,
    latitude: normalizeNumber(detail.latitud),
    longitude: normalizeNumber(detail.longitud),
    postalCode: detail.codigoPostal || '',
    accountNumber: detail.numeroCuentaBancaria || '',
    accountType: detail.tipoCuentaBancaria || '',
    bank: detail.bancoId != null ? String(detail.bancoId) : '',
    accountId: detail.cuentaBancariaId != null ? Number(detail.cuentaBancariaId) : null,
    openingHours: detail.horarioApertura || '',
    closingHours: detail.horarioCierre || '',
    workDays: detail.diasAtencion || [],
    photo: withBasePhoto(detail.foto),
    isActive: true,
    barrioId: detail.barrioId != null ? Number(detail.barrioId) : null,
    ciudadId: detail.ciudadId != null ? Number(detail.ciudadId) : null,
    photoPath: detail.foto ?? null,
  };
};

const buildRequestPayload = (data: Branch) => ({
  nombre: data.name?.trim(),
  razonSocial: valueOrUndefined(data.legalReason),
  nit: valueOrUndefined(data.nit),
  representanteLegal: valueOrUndefined(data.legalRepresentative),
  documentoRepresentante: valueOrUndefined(data.representativeDocument),
  personaContacto: valueOrUndefined(data.contactPerson),
  telefonoContacto: valueOrUndefined(data.phone),
  correoContacto: valueOrUndefined(data.email),
  direccion: data.address?.trim(),
  barrioId: data.barrioId ?? undefined,
  codigoPostal: valueOrUndefined(data.postalCode),
  latitud: data.latitude ?? undefined,
  longitud: data.longitude ?? undefined,
  detalleDireccion: valueOrUndefined(data.addressDetail),
  horarioApertura: valueOrUndefined(data.openingHours),
  horarioCierre: valueOrUndefined(data.closingHours),
  diasAtencion: (data.workDays || []).filter(Boolean),
  numeroCuenta: valueOrUndefined(data.accountNumber),
  tipoCuenta: valueOrUndefined(data.accountType),
  bancoId: normalizeNumber(data.bank),
});

export const BranchesManagement: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const response = await api.get<Array<any>>('/admin/branches');
      setBranches(response.map(mapSummaryToBranch));
    } catch (error) {
      console.error('Error cargando sucursales', error);
      setListError('No se pudo cargar la lista de sucursales.');
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleViewBranch = async (branch: Branch) => {
    setIsFetchingDetail(true);
    setDetailError(null);
    try {
      const detail = await api.get(`/admin/branches/${branch.id}`);
      setSelectedBranch(prepareBranch(mapDetailToBranch(detail)));
    } catch (error) {
      console.error('Error obteniendo sucursal', error);
      setDetailError('No se pudo cargar la información de la sucursal seleccionada.');
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleBackToTable = () => {
    setSelectedBranch(null);
    setShowCreateForm(false);
    setDetailError(null);
    setIsFetchingDetail(false);
  };

  const handleCreateBranch = () => {
    setShowCreateForm(true);
  };

  const handleSaveBranch = async (branchData: Branch, photoFile: File | null) => {
    const payload = buildRequestPayload(branchData);
    try {
      let created;
      if (photoFile) {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        formData.append('photo', photoFile);
        created = await api.upload('/admin/branches', formData);
      } else {
        created = await api.post('/admin/branches', payload);
      }
      setShowCreateForm(false);
      await fetchBranches();
      setSelectedBranch(prepareBranch(mapDetailToBranch(created)));
    } catch (error) {
      console.error('Error creando sucursal', error);
      throw error;
    }
  };

  const handleUpdateBranch = async (branchData: Branch, photoFile: File | null) => {
    const payload = buildRequestPayload(branchData);
    try {
      let updated;
      if (photoFile) {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        formData.append('photo', photoFile);
        updated = await api.upload(`/admin/branches/${branchData.id}`, formData, 'PUT');
      } else {
        updated = await api.put(`/admin/branches/${branchData.id}`, payload);
      }
      const normalized = prepareBranch(mapDetailToBranch(updated));
      setBranches((prev) =>
        prev.map((branch) => (branch.id === normalized.id ? normalized : branch))
      );
      setSelectedBranch(normalized);
      return normalized;
    } catch (error) {
      console.error('Error actualizando sucursal', error);
      throw error;
    }
  };

  const handleDeleteBranch = async (branch: Branch) => {
    try {
      await api.del(`/admin/branches/${branch.id}`);
      setBranches((prev) => prev.filter((item) => item.id !== branch.id));
      if (selectedBranch?.id === branch.id) {
        setSelectedBranch(null);
      }
    } catch (error) {
      console.error('Error eliminando sucursal', error);
      throw error;
    }
  };

  if (isFetchingDetail) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        Cargando sucursal...
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{detailError}</AlertDescription>
        </Alert>
        <Button onClick={handleBackToTable}>Volver al listado</Button>
      </div>
    );
  }

  if (selectedBranch) {
    return (
      <BranchDetail
        branch={selectedBranch}
        onBack={handleBackToTable}
        onSave={handleUpdateBranch}
      />
    );
  }

  if (showCreateForm) {
    return <CreateBranchForm onBack={handleBackToTable} onSave={handleSaveBranch} />;
  }

  return (
    <BranchesTable
      branches={branches}
      errorMessage={listError}
      isLoading={isLoadingList}
      onViewBranch={handleViewBranch}
      onCreateBranch={handleCreateBranch}
      onDeleteBranch={handleDeleteBranch}
    />
  );
};
