import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Alert, AlertDescription } from '../../ui/alert';
import { CheckCircle2, Plus, X, Package, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MaintenancePart {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
}

interface CompleteMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: {
    id: string;
    vehicleName: string;
    vehicleType: string;
    type: 'preventive' | 'corrective';
    branch: string;
    description?: string;
  };
  onComplete: (data: {
    notes: string;
    nextPreventiveDate?: string;
    parts: MaintenancePart[];
    laborCost: number;
    workDuration: number;
  }) => void;
}

export const CompleteMaintenanceDialog: React.FC<CompleteMaintenanceDialogProps> = ({
  open,
  onOpenChange,
  maintenance,
  onComplete
}) => {
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [nextPreventiveDate, setNextPreventiveDate] = useState('');
  const [parts, setParts] = useState<MaintenancePart[]>([]);
  const [laborCost, setLaborCost] = useState('');
  const [workDuration, setWorkDuration] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const addPart = () => {
    const newPart: MaintenancePart = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unitCost: 0
    };
    setParts([...parts, newPart]);
  };

  const updatePart = (id: string, field: keyof MaintenancePart, value: string | number) => {
    setParts(parts.map(part => 
      part.id === id ? { ...part, [field]: value } : part
    ));
  };

  const removePart = (id: string) => {
    setParts(parts.filter(part => part.id !== id));
  };

  const totalPartsCost = parts.reduce((sum, part) => sum + (part.quantity * part.unitCost), 0);
  const totalCost = totalPartsCost + parseFloat(laborCost || '0');

  const handleComplete = () => {
    // Validaciones
    if (!technicalNotes.trim()) {
      toast.error('Debes agregar notas técnicas del mantenimiento realizado');
      return;
    }

    if (maintenance.type === 'preventive' && !nextPreventiveDate) {
      toast.error('Debes especificar la fecha del próximo mantenimiento preventivo');
      return;
    }

    if (!laborCost || parseFloat(laborCost) <= 0) {
      toast.error('Debes especificar el costo de mano de obra');
      return;
    }

    if (!workDuration || parseFloat(workDuration) <= 0) {
      toast.error('Debes especificar la duración del trabajo');
      return;
    }

    // Validar partes si hay alguna agregada
    const hasIncompleteParts = parts.some(part => !part.name.trim() || part.unitCost <= 0);
    if (hasIncompleteParts) {
      toast.error('Completa la información de todas las partes o elimínalas');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      onComplete({
        notes: technicalNotes,
        nextPreventiveDate: maintenance.type === 'preventive' ? nextPreventiveDate : undefined,
        parts,
        laborCost: parseFloat(laborCost),
        workDuration: parseFloat(workDuration)
      });

      // Limpiar formulario
      setTechnicalNotes('');
      setNextPreventiveDate('');
      setParts([]);
      setLaborCost('');
      setWorkDuration('');
      setIsProcessing(false);
      onOpenChange(false);
    }, 1000);
  };

  const handleCancel = () => {
    setTechnicalNotes('');
    setNextPreventiveDate('');
    setParts([]);
    setLaborCost('');
    setWorkDuration('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Completar Mantenimiento
          </DialogTitle>
          <DialogDescription>
            Registra la información detallada del mantenimiento realizado incluyendo partes, costos y notas técnicas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Info */}
          <div className="bg-accent/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{maintenance.vehicleName}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Tipo:</span>{' '}
                <Badge
                  variant={maintenance.type === 'preventive' ? 'default' : 'destructive'}
                  className={
                    maintenance.type === 'preventive'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }
                >
                  {maintenance.type === 'preventive' ? 'Preventivo' : 'Correctivo'}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Sucursal:</span>{' '}
                {maintenance.branch}
              </div>
              {maintenance.description && (
                <div className="col-span-2">
                  <Alert className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <span className="font-semibold">Problema reportado:</span> {maintenance.description}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </div>

          {/* Technical Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Técnicas del Mantenimiento *</Label>
            <Textarea
              id="notes"
              placeholder="Describe detalladamente las tareas realizadas, observaciones durante el mantenimiento, estado del vehículo y recomendaciones..."
              value={technicalNotes}
              onChange={(e) => setTechnicalNotes(e.target.value)}
              rows={5}
              required
            />
            <p className="text-xs text-muted-foreground">
              Incluye: trabajos realizados, problemas encontrados, soluciones aplicadas y recomendaciones
            </p>
          </div>

          <Separator />

          {/* Parts and Materials */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Partes y Repuestos Utilizados</Label>
                <p className="text-sm text-muted-foreground">
                  Registra todas las partes y materiales usados
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPart}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Parte
              </Button>
            </div>

            {parts.length > 0 && (
              <div className="space-y-3 border rounded-lg p-4">
                {parts.map((part, index) => (
                  <div key={part.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Label className="text-xs">Nombre de la parte</Label>
                      <Input
                        value={part.name}
                        onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                        placeholder="Ej: Aceite motor 20W-50"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Cantidad</Label>
                      <Input
                        type="number"
                        min="1"
                        value={part.quantity}
                        onChange={(e) => updatePart(part.id, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs">Costo Unitario (COP)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={part.unitCost}
                        onChange={(e) => updatePart(part.id, 'unitCost', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-between">
                      <div className="text-sm font-medium">
                        ${(part.quantity * part.unitCost).toLocaleString('es-CO')}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePart(part.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Subtotal Partes:</span>
                  <span className="font-semibold">${totalPartsCost.toLocaleString('es-CO')} COP</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Labor and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="laborCost">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Costo de Mano de Obra (COP) *
              </Label>
              <Input
                id="laborCost"
                type="number"
                min="0"
                value={laborCost}
                onChange={(e) => setLaborCost(e.target.value)}
                placeholder="50000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workDuration">
                <Clock className="inline h-4 w-4 mr-1" />
                Duración del Trabajo (horas) *
              </Label>
              <Input
                id="workDuration"
                type="number"
                min="0"
                step="0.5"
                value={workDuration}
                onChange={(e) => setWorkDuration(e.target.value)}
                placeholder="2.5"
                required
              />
            </div>
          </div>

          {/* Total Cost Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Partes y Repuestos:</span>
                <span className="font-medium">${totalPartsCost.toLocaleString('es-CO')} COP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mano de Obra:</span>
                <span className="font-medium">${parseFloat(laborCost || '0').toLocaleString('es-CO')} COP</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Costo Total:</span>
                <span className="text-xl font-bold text-primary">
                  ${totalCost.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>
          </div>

          {/* Next Preventive Date (only for preventive maintenance) */}
          {maintenance.type === 'preventive' && (
            <div className="space-y-2">
              <Label htmlFor="nextDate">Fecha del Próximo Mantenimiento Preventivo *</Label>
              <Input
                id="nextDate"
                type="date"
                value={nextPreventiveDate}
                onChange={(e) => setNextPreventiveDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                required
              />
              <p className="text-sm text-muted-foreground">
                Esta fecha se registrará en el sistema para programar el siguiente mantenimiento preventivo
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isProcessing ? 'Procesando...' : 'Completar Mantenimiento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
