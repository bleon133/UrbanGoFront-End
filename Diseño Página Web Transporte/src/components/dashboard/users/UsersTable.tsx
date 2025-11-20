import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Alert, AlertDescription } from '../../ui/alert';
import { 
  Eye, 
  KeyRound, 
  Loader2, 
  CheckCircle,
  EyeIcon,
  EyeOff,
  Plus,
  Trash2
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  userType: 'admin' | 'delivery' | 'client';
  profilePhoto?: string;
  isActive: boolean;
}

interface UsersTableProps {
  onViewUser: (user: User) => void;
  onCreateUser: () => void;
}

export const UsersTable: React.FC<UsersTableProps & { users?: User[]; onRefresh?: () => void; }> = ({ onViewUser, onCreateUser, users: usersProp, onRefresh }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const users: User[] = usersProp || [];

  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setErrors([]);
    setSuccess(false);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
  if (!userToDelete) return;
  setIsDeleting(true);
  try {
    const res = await fetch(((import.meta as any).env?.VITE_API_BASE_URL || '') + '/admin/users/' + userToDelete.id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('accessToken')||'') }
    });
    if (!res.ok) throw new Error('delete failed');
    setShowDeleteDialog(false);
    setUserToDelete(null);
    setSuccess(true);
    setErrors([]);
    if (onRefresh) onRefresh();
  } catch (error) {
    setErrors(['Error al eliminar usuario. Int�ntelo de nuevo.']);
  } finally {
    setIsDeleting(false);
  }
};

  const validatePassword = (): string[] => {
    const newErrors: string[] = [];
    
    if (!passwordData.newPassword) {
      newErrors.push('La nueva contraseña es requerida');
    } else {
      if (passwordData.newPassword.length < 8) {
        newErrors.push('La contraseña debe tener al menos 8 caracteres');
      }
      if (!/(?=.*[a-z])/.test(passwordData.newPassword)) {
        newErrors.push('La contraseña debe contener al menos una letra minúscula');
      }
      if (!/(?=.*[A-Z])/.test(passwordData.newPassword)) {
        newErrors.push('La contraseña debe contener al menos una letra mayúscula');
      }
      if (!/(?=.*\d)/.test(passwordData.newPassword)) {
        newErrors.push('La contraseña debe contener al menos un número');
      }
      if (!/(?=.*[@$!%*?&])/.test(passwordData.newPassword)) {
        newErrors.push('La contraseña debe contener al menos un carácter especial (@$!%*?&)');
      }
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.push('Las contraseñas no coinciden');
    }
    
    return newErrors;
  };

  const handleSubmitPassword = async () => {
    const validationErrors = validatePassword();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
      // Simulación de cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      
      setTimeout(() => {
        setShowPasswordModal(false);
        setSuccess(false);
        setSelectedUser(null);
      }, 2000);
    } catch (error) {
      setErrors(['Error al cambiar la contraseña. Inténtelo de nuevo.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setShowPasswordModal(false);
      setSelectedUser(null);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setErrors([]);
      setSuccess(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>
            Lista completa de usuarios registrados en el sistema
          </CardDescription>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total de usuarios: <span className="font-semibold">{users.length}</span>
            </p>
            <Button onClick={onCreateUser}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Número de Documento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.documentNumber}</TableCell>
                  <TableCell>
                    <Badge variant={
                      user.userType === 'admin' ? 'default' : 
                      user.userType === 'delivery' ? 'secondary' : 'outline'
                    }>
                      {user.userType === 'admin' ? 'Administrativo' : (user.userType === 'delivery' ? 'Domiciliario' : (user.userType === 'client' ? 'Cliente' : 'Mantenimiento'))}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'secondary' : 'destructive'}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangePassword(user)}
                      >
                        <KeyRound className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
              Cambiar contraseña para {selectedUser?.firstName} {selectedUser?.lastName}
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-center text-green-600 font-medium">
                Contraseña cambiada exitosamente
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Ingresa la nueva contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Repetir contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirma la nueva contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>La contraseña debe cumplir con los siguientes requisitos:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Mínimo 8 caracteres</li>
                  <li>Al menos una letra minúscula</li>
                  <li>Al menos una letra mayúscula</li>
                  <li>Al menos un número</li>
                  <li>Al menos un carácter especial (@$!%*?&)</li>
                </ul>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCloseModal}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmitPassword}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    'Cambiar Contraseña'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar al usuario {userToDelete?.firstName} {userToDelete?.lastName}?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1"
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmDelete}
                className="flex-1"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};