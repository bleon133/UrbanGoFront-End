import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface RequestCorrectiveMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleName: string;
  vehicleId: string;
  branch: string;
}

export function RequestCorrectiveMaintenanceDialog({
  open,
  onOpenChange,
  vehicleName,
  vehicleId,
  branch
}: RequestCorrectiveMaintenanceDialogProps) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) {
      toast.error('Debes describir el problema del vehículo');
      return;
    }

    setIsSubmitting(true);

    // Simulación de envío al backend
    setTimeout(() => {
      // Aquí se enviaría al sistema de mantenimiento
      console.log({
        vehicleId,
        vehicleName,
        branch,
        type: 'corrective',
        description,
        scheduledDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        createdBy: 'Admin'
      });

      toast.success(`Mantenimiento correctivo solicitado para ${vehicleName}`);
      setDescription('');
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Solicitar Mantenimiento Correctivo
          </DialogTitle>
          <DialogDescription>
            Reporta un problema o falla en el vehículo para que el equipo de mantenimiento pueda atenderlo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Info */}
          <div className="bg-accent/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{vehicleName}</h3>
            <div className="text-sm text-muted-foreground">
              <p>Sucursal: {branch}</p>
              <p>ID: {vehicleId}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción del Problema *</Label>
            <Textarea
              id="description"
              placeholder="Describe el problema o falla detectada en el vehículo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              required
            />
            <p className="text-sm text-muted-foreground">
              Sé lo más específico posible para que el equipo de mantenimiento pueda atender el problema correctamente.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setDescription('');
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar Mantenimiento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
