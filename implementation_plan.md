# Plan de Implementación: Tabla de Horarios de Mecánicos

## Objetivo

Implementar una vista que liste los horarios de trabajo de todos los mecánicos en formato de tabla, accesible desde la sección "Gestión de horarios".

## Cambios Propuestos

### 1. Nuevo Componente `MechanicSchedules.tsx`

- **Ubicación**: `src/components/mechanic/MechanicSchedules.tsx`
- **Funcionalidad**:
  - Obtener la lista de todos los mecánicos usando `mechanicService.getAllMechanics()`.
  - Renderizar una tabla con las siguientes columnas:
    - Mecánico (Nombre y Apellido)
    - Código de Empleado
    - Días de Trabajo (formateados como etiquetas)
    - Hora de Inicio
    - Hora de Fin
  - Incluir botón para volver al panel de mecánicos.
  - Manejar estados de carga y error.

### 2. Actualización de Rutas (`src/App.tsx`)

- Importar el nuevo componente `MechanicSchedules`.
- Agregar la ruta `/mechanics/schedules` dentro del bloque de rutas de mecánicos.

## Verificación

- Navegar a `/mechanics` y hacer clic en "Horarios".
- Verificar que se cargue la nueva página con la tabla.
- Confirmar que los datos de horarios (días y horas) se muestren correctamente para cada mecánico.
