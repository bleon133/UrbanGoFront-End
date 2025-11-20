# Sistema de Mantenimiento - Documentación

## Descripción General
Sistema completo de gestión de mantenimientos preventivos y correctivos para la flota de vehículos de movilidad urbana.

## Roles y Responsabilidades

### Administrador
- **Creación de Vehículos**: Al crear un vehículo, debe establecer la fecha del primer mantenimiento preventivo
- **Notificación de Mantenimientos Correctivos**: Puede solicitar mantenimiento correctivo desde el detalle de cualquier vehículo
- **Vista de Mantenimientos**: Puede ver el estado de todos los mantenimientos (solo lectura)
- **No gestiona mantenimientos**: Solo notifica y monitorea, no ejecuta ni completa mantenimientos

### Personal de Mantenimiento
- **Gestión Completa**: Gestiona tanto mantenimientos preventivos como correctivos
- **Dashboard Especializado**: Vista única con todas las tareas de mantenimiento
- **Proceso de Mantenimiento Detallado**:
  1. Ver mantenimientos pendientes en una tabla
  2. Iniciar la tarea de mantenimiento
  3. Completar el mantenimiento con información detallada:
     - Notas técnicas del trabajo realizado
     - Partes y repuestos utilizados (con cantidades y costos)
     - Costo de mano de obra
     - Duración del trabajo en horas
  4. Para preventivos: Establecer fecha del próximo mantenimiento

## Tipos de Mantenimiento

### Mantenimiento Preventivo
- **Origen**: Se crea automáticamente cuando la fecha programada llega
- **Primera Fecha**: Establecida por el administrador al crear el vehículo
- **Fechas Subsiguientes**: Establecidas por el personal de mantenimiento al completar cada tarea
- **Flujo**:
  1. Administrador crea vehículo con fecha de primer mantenimiento preventivo
  2. Cuando llega la fecha, aparece en el dashboard de mantenimiento
  3. Personal de mantenimiento inicia la tarea
  4. Al completar, debe establecer la fecha del siguiente mantenimiento preventivo
  5. El sistema programa automáticamente el próximo mantenimiento

### Mantenimiento Correctivo
- **Origen**: Notificado por el administrador desde el detalle del vehículo
- **Flujo**:
  1. Administrador detecta problema en un vehículo
  2. Desde el detalle del vehículo, hace clic en "Solicitar Mantenimiento"
  3. Describe el problema en un diálogo
  4. El sistema crea la tarea de mantenimiento correctivo
  5. Aparece en el dashboard de mantenimiento
  6. Personal de mantenimiento lo gestiona y completa

## Componentes del Sistema

### Autenticación
- **AuthContext.tsx**: Incluye el tipo de usuario 'maintenance'
- **LoginForm.tsx**: Muestra credenciales de prueba para mantenimiento
  - Email: mantenimiento@movilidad.com
  - Password: 123456

### Dashboard de Mantenimiento (Personal Técnico)
- **MaintenanceDashboard.tsx**: Dashboard principal del rol
- **MaintenanceSidebar.tsx**: Navegación con "Gestión de Tareas" y "Mi Perfil"
- **PendingMaintenances.tsx**: Vista principal con tabla de mantenimientos
- **CompleteMaintenanceDialog.tsx**: Diálogo avanzado para completar mantenimientos con:
  - Notas técnicas detalladas
  - Registro de partes y repuestos
  - Costos de materiales y mano de obra
  - Duración del trabajo
  - Fecha del próximo mantenimiento (preventivos)

### Vista de Mantenimientos (Admin)
- **MaintenancesManagement.tsx**: Vista de solo lectura de todos los mantenimientos
- **MaintenancesTable.tsx**: Tabla con filtros por estado (Todos, Pendientes, En Proceso, Completados)
- **MaintenanceDetail.tsx**: Detalle completo del mantenimiento (modo lectura para admin)

### Gestión de Vehículos (Admin)
- **CreateVehicleForm.tsx**: Campo obligatorio para fecha de mantenimiento preventivo
- **VehicleDetailComplete.tsx**: Botón "Solicitar Mantenimiento" para correctivos
- **RequestCorrectiveMaintenanceDialog.tsx**: Diálogo para solicitar mantenimiento correctivo

### Features del Dashboard de Mantenimiento (Personal Técnico)
1. **Estadísticas en tiempo real**:
   - Pendientes
   - En Proceso
   - Completados Hoy

2. **Tabla de Mantenimientos Activos**:
   - Vehículo (con foto)
   - Tipo (Preventivo/Correctivo)
   - Categoría del vehículo
   - Sucursal
   - Fecha Programada
   - Estado (Pendiente/En Proceso)
   - Descripción (para correctivos)
   - Acciones (Iniciar/Completar)

3. **Proceso de Completado Detallado**:
   - Diálogo modal con información del vehículo y problema reportado
   - **Notas Técnicas** (obligatorio): Descripción detallada del trabajo realizado
   - **Partes y Repuestos**:
     - Nombre de cada parte
     - Cantidad utilizada
     - Costo unitario en COP
     - Cálculo automático de subtotal
     - Opción para agregar múltiples partes
   - **Costos**:
     - Costo de mano de obra en COP (obligatorio)
     - Duración del trabajo en horas (obligatorio)
     - Cálculo automático del costo total
   - **Para preventivos**: Fecha del siguiente mantenimiento (obligatorio)
   - Validación completa de campos requeridos
   - Toast de confirmación con resumen de costos

4. **Historial de Completados**:
   - Sección separada con mantenimientos completados del día
   - Vista de solo lectura

### Features de Vista de Mantenimientos (Administrador)
1. **Estadísticas Globales**:
   - Pendientes
   - En Proceso
   - Completados Hoy

2. **Tabs por Estado**:
   - Todos
   - Pendientes
   - En Proceso
   - Completados

3. **Tabla de Mantenimientos**:
   - Vista completa de todos los mantenimientos
   - Información del vehículo, tipo, estado, prioridad
   - Acción: Ver detalle (solo lectura)

4. **Detalle de Mantenimiento**:
   - Información completa del vehículo
   - Tipo de mantenimiento
   - Fechas y técnico asignado
   - Problema reportado (correctivos)
   - Notas técnicas (completados)
   - Sin opciones de edición o gestión

## Flujo de Datos

### Mantenimiento Preventivo
```
Admin crea vehículo → Establece fecha preventiva → Sistema espera fecha
↓
Fecha llega → Aparece en dashboard de mantenimiento como "Pendiente"
↓
Personal inicia tarea → Estado cambia a "En Proceso"
↓
Personal completa → Ingresa notas + Nueva fecha preventiva → Estado "Completado"
↓
Sistema programa siguiente mantenimiento preventivo
```

### Mantenimiento Correctivo
```
Admin detecta problema → Abre detalle del vehículo
↓
Click "Solicitar Mantenimiento" → Describe problema en diálogo
↓
Sistema crea tarea correctiva → Aparece en dashboard de mantenimiento
↓
Personal inicia tarea → Estado "En Proceso"
↓
Personal completa → Ingresa notas → Estado "Completado"
```

## Estados de Mantenimiento
- **pending**: Tarea pendiente de iniciar
- **in-progress**: Tarea en ejecución
- **completed**: Tarea finalizada

## Validaciones
1. **Creación de Vehículo**: Fecha de mantenimiento preventivo es obligatoria
2. **Solicitud de Mantenimiento Correctivo**: Descripción del problema es obligatoria
3. **Completar Mantenimiento - Campos Obligatorios**:
   - Notas técnicas del trabajo realizado
   - Costo de mano de obra (debe ser mayor a 0)
   - Duración del trabajo en horas (debe ser mayor a 0)
   - Para preventivos: Nueva fecha de mantenimiento
4. **Partes y Repuestos**: Si se agregan partes, nombre y costo son obligatorios

## Notificaciones
- Toast de éxito al iniciar mantenimiento
- Toast de éxito al completar mantenimiento con resumen de costos y próxima fecha (preventivos)
- Toast de error si faltan campos obligatorios o tienen valores inválidos
- Toast de éxito al solicitar mantenimiento correctivo

## Integración con Home
La sección RolesSection del home incluye el rol de Mantenimiento mostrando:
- Icono de herramienta (Wrench)
- Descripción: "Gestión técnica de la flota"
- Features:
  - Mantenimientos preventivos
  - Reparaciones correctivas
  - Programación de tareas
  - Control de vehículos

## Diferencias Clave entre Roles

### Administrador en Mantenimientos
✅ **Puede hacer:**
- Ver listado completo de mantenimientos (solo lectura)
- Solicitar mantenimientos correctivos desde el detalle de vehículos
- Ver estadísticas generales
- Ver detalles de cada mantenimiento
- Establecer fecha de primer mantenimiento preventivo al crear vehículos

❌ **NO puede hacer:**
- Iniciar mantenimientos
- Completar mantenimientos
- Gestionar partes y repuestos
- Asignar técnicos
- Modificar estados

### Personal de Mantenimiento
✅ **Puede hacer:**
- Ver mantenimientos pendientes y en proceso
- Iniciar mantenimientos
- Completar mantenimientos con información detallada:
  - Notas técnicas completas
  - Registro de partes usadas con costos
  - Costos de mano de obra
  - Duración del trabajo
- Programar siguiente mantenimiento preventivo
- Ver historial de completados

❌ **NO puede hacer:**
- Crear vehículos
- Solicitar mantenimientos (los recibe del sistema)
- Modificar información de vehículos
- Acceder a módulos administrativos
