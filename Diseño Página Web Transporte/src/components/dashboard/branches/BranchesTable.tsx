import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { Eye, Plus, Trash2, Loader2, MapPin } from 'lucide-react';
import { Branch } from './types';

interface BranchesTableProps {
  branches: Branch[];
  onViewBranch: (branch: Branch) => void;
  onCreateBranch: () => void;
  onDeleteBranch: (branch: Branch) => Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const BranchesTable: React.FC<BranchesTableProps> = ({
  branches,
  onViewBranch,
  onCreateBranch,
  onDeleteBranch,
  isLoading,
  errorMessage,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteBranch = (branch: Branch) => {
    setBranchToDelete(branch);
    setDeleteError(null);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!branchToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDeleteBranch(branchToDelete);
      setShowDeleteDialog(false);
      setBranchToDelete(null);
    } catch (error) {
      console.error('Error deleting branch', error);
      setDeleteError('No se pudo eliminar la sucursal. Inténtelo nuevamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Sucursales</CardTitle>
          <CardDescription>Lista completa de sucursales registradas en el sistema</CardDescription>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total de sucursales: <span className="font-semibold">{branches.length}</span>
            </p>
            <Button onClick={onCreateBranch}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Sucursal
            </Button>
          </div>
          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Cargando sucursales...
                  </TableCell>
                </TableRow>
              ) : branches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay sucursales registradas.
                  </TableCell>
                </TableRow>
              ) : (
                branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={branch.photo} alt={branch.name} />
                          <AvatarFallback>{getInitials(branch.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{branch.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {branch.contactPerson || 'Contacto no definido'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{branch.address || 'Sin dirección'}</p>
                          <p className="text-xs text-muted-foreground">
                            {branch.cityNeighborhood || branch.city || '—'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{branch.email || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={branch.isActive ? 'secondary' : 'destructive'}>
                        {branch.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onViewBranch(branch)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBranch(branch)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Sucursal</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar la sucursal {branchToDelete?.name}?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Esta acción no se puede deshacer. La sucursal será eliminada permanentemente del sistema.
              </AlertDescription>
            </Alert>

            {deleteError && (
              <Alert variant="destructive">
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}

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
