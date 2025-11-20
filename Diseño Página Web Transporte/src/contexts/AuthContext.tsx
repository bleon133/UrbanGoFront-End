import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAccessToken, ensureAccessToken } from '../services/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'admin' | 'delivery' | 'client' | 'maintenance';
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
  isHydrating: boolean;
  permissions: Record<string, { puedeVer: boolean; puedeCrear: boolean; puedeEditar: boolean; puedeEliminar: boolean }>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const [permissions, setPermissions] = useState<AuthContextType['permissions']>({});
  const getStored = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
  const setStored = (k: string, v: string | null) => { try { if (v==null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch {} };

  // Try to restore session from persisted token
  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      setIsHydrating(true);
      const access = getStored('accessToken');
      const refresh = getStored('refreshToken');
      try {
        if (!access && refresh) {
          await ensureAccessToken();
        } else if (access) {
          setAccessToken(access);
        }
        if (getStored('accessToken')) {
          const me = await api.get<{ email: string; scope?: string; tokenId?: string }>(`/auth/me`);
          const scope = me?.scope || '';
          let userType: User['userType'] = 'client';
          if (scope.includes('ADMINISTRADOR') || scope.includes('ADMIN')) userType = 'admin';
          else if (scope.includes('DOMICILIARIO')) userType = 'delivery';
          else if (scope.includes('MANTENIMIENTO')) userType = 'maintenance';
          const nameFromEmail = (me.email || '').split('@')[0];
          setUser({
            id: me?.tokenId || me.email,
            email: me.email,
            firstName: nameFromEmail,
            lastName: '',
            userType,
            isActive: true,
          });
          // Fetch permissions for current role
          try {
            const perms = await api.get<Array<{ modulo: string; puedeVer: boolean; puedeCrear: boolean; puedeEditar: boolean; puedeEliminar: boolean }>>(`/auth/permissions`);
            const map: AuthContextType['permissions'] = {};
            for (const p of perms) map[p.modulo] = { puedeVer: p.puedeVer, puedeCrear: p.puedeCrear, puedeEditar: p.puedeEditar, puedeEliminar: p.puedeEliminar };
            setPermissions(map);
          } catch {}
        }
      } catch (e) {
        // No limpiar agresivamente si hubo carrera de refresh; el interceptor manejará 401
        // Si realmente no hay tokens válidos, el primer call a ruta protegida redirigirá a /login
      } finally {
        if (mounted) setIsHydrating(false);
      }
    };
    hydrate();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await api.post<{
        accessToken: string;
        expiresInSeconds: number;
        tokenType: string;
        email: string;
        role: string;
        refreshToken: string;
      }>(`/auth/login`, { email, password });

      // Persist token for subsequent requests
      setAccessToken(res.accessToken);

      // Persist refresh token
      setStored('refreshToken', res.refreshToken);

      // Map backend role to UI userType
      let userType: User['userType'] = 'client';
      if (res.role === 'ADMIN' || res.role === 'ADMINISTRADOR') userType = 'admin';
      else if (res.role === 'DOMICILIARIO') userType = 'delivery';
      else if (res.role === 'MANTENIMIENTO') userType = 'maintenance';
      const nameFromEmail = (res.email || '').split('@')[0];

      setUser({
        id: res.email,
        email: res.email,
        firstName: nameFromEmail,
        lastName: '',
        userType,
        isActive: true,
      });
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    (async () => {
      try {
        const rt = getStored('refreshToken');
        if (rt) await api.post(`/auth/logout`, { refreshToken: rt });
      } catch {}
      finally {
        setAccessToken(null);
        setStored('accessToken', null);
        setStored('refreshToken', null);
        setUser(null);
        setPermissions({});
        setIsHydrating(false);
        navigate('/login', { replace: true });
      }
    })();
  };

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const fullName: string = userData.fullName || [userData.firstName, userData.lastName].filter(Boolean).join(' ').trim();
      await api.post(`/auth/register`, {
        email: userData.email,
        password: userData.password,
        fullName,
      });

      // Optional: auto-login if password provided
      if (userData?.email && userData?.password) {
        return await login(userData.email, userData.password);
      }
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulación de reset de contraseña
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una implementación real, aquí se enviaría el email de recuperación
      console.log('Solicitud de reset para:', email);
      
      return true;
    } catch (error) {
      console.error('Error en reset de contraseña:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    resetPassword,
    isLoading,
    isHydrating,
    permissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
