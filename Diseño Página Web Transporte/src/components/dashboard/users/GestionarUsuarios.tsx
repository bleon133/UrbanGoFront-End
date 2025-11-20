import React, { useEffect, useState } from 'react';
import { UsersTable } from './UsersTable';
import { UserDetail } from './UserDetail';
import { CreateUserForm } from './CreateUserForm.integrated';
import { api } from '../../../services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  documentType: string;
  userType: 'admin' | 'delivery' | 'maintenance' | 'client';
  profilePhoto?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  motorcycleLicenseCategory?: string;
  vehicleCategory?: string;
  licenseNumber?: string;
  licenseFrontPhoto?: string;
  licenseBackPhoto?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  experience?: string;
  isActive: boolean;
}

export const GestionarUsuarios: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const list = await api.get<Array<any>>('/admin/users');
        const base = (import.meta as any).env?.VITE_API_BASE_URL || '';
        const mapped: User[] = list.map((u: any) => ({
          id: String(u.id),
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          documentNumber: u.documentNumber,
          documentType: u.documentType,
          userType: (u.userType === 'admin' || u.userType === 'ADMINISTRADOR') ? 'admin' : (u.userType === 'delivery' || u.userType === 'DOMICILIARIO' ? 'delivery' : (u.userType === 'MANTENIMIENTO' ? 'maintenance' : 'client')),
          profilePhoto: u.profilePhoto ? `${base}/photos/${u.profilePhoto}` : undefined,
          isActive: Boolean(u.isActive),
        }));
        setUsers(mapped);
      } catch (e) {
        console.error('Error cargando usuarios', e);
      }
    })();
  }, [refreshKey]);

  const handleViewUser = async (user: User) => {
    try {
      const detail = await api.get<any>(`/admin/users/${user.id}`);
      const base = (import.meta as any).env?.VITE_API_BASE_URL || '';
      const mapped: User = {
        id: String(detail.id),
        firstName: detail.firstName,
        lastName: detail.lastName,
        email: detail.email,
        documentNumber: detail.documentNumber,
        documentType: detail.documentType,
        userType: (detail.userType === 'ADMINISTRADOR' || detail.userType === 'ADMIN') ? 'admin' : (detail.userType === 'DOMICILIARIO' ? 'delivery' : (detail.userType === 'MANTENIMIENTO' ? 'maintenance' : 'client')),
        profilePhoto: (detail.profilePhoto || detail.fotografia) ? `${base}/photos/${detail.profilePhoto || detail.fotografia}` : undefined,
        phone: detail.phone || '',
        birthDate: detail.birthDate || '',
        gender: detail.gender || '',
        motorcycleLicenseCategory: detail.categoriaMoto || detail.categoria_moto,
        vehicleCategory: detail.categoriaVehiculo || detail.categoria_vehiculo || detail.categoriaMoto || detail.categoria_moto,
        licenseNumber: detail.numeroLicencia || detail.numero_licencia,
        licenseFrontPhoto: (detail.fotoLicenciaFrontal || detail.foto_licencia_frontal) ? `${base}/photos/${detail.fotoLicenciaFrontal || detail.foto_licencia_frontal}` : undefined,
        licenseBackPhoto: (detail.fotoLicenciaPosterior || detail.foto_licencia_posterior) ? `${base}/photos/${detail.fotoLicenciaPosterior || detail.foto_licencia_posterior}` : undefined,
        emergencyContact: detail.contactoEmergencia || detail.contacto_emergencia,
        emergencyPhone: detail.numeroEmergencia || detail.numero_emergencia,
        experience: detail.experienciaPrevia || detail.experiencia_previa,
        isActive: detail.estado === 'ACTIVO'
      } as any;
      setSelectedUser(mapped);
    } catch (e) {
      console.error('Error obteniendo usuario', e);
    }
  };

  const handleBackToTable = () => {
    setSelectedUser(null);
    setShowCreateForm(false);
  };

  const handleCreateUser = () => {
    setShowCreateForm(true);
  };

  const handleSaveUser = async (formData: FormData) => {
    try {
      await api.upload('/admin/users', formData);
      setShowCreateForm(false);
      setRefreshKey(prev => prev + 1);
    } catch (e) {
      console.error('Error creando usuario', e);
    }
  };

  if (selectedUser) {
    return (
      <UserDetail 
        user={selectedUser} 
        onBack={handleBackToTable} 
      />
    );
  }

  if (showCreateForm) {
    return (
      <CreateUserForm
        onBack={handleBackToTable}
        onSave={handleSaveUser}
      />
    );
  }

  return <UsersTable users={users} onRefresh={() => setRefreshKey(k=>k+1)} onViewUser={handleViewUser} onCreateUser={handleCreateUser} />;
};
