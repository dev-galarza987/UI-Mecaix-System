# API Mecanix Backend - Documentación de Endpoints

## Información General

- **Base URL**: `http://localhost:4000/api/v1`
- **Documentación Swagger**: `http://localhost:4000/api/docs`
- **Formato de respuesta**: JSON
- **Autenticación**: No implementada (en desarrollo)

## Índice

1. [Aplicación General](#aplicación-general)
2. [Clientes](#clientes)
3. [Vehículos](#vehículos)
4. [Servicios](#servicios)
5. [Mecánicos](#mecánicos)
6. [Relación Cliente-Vehículo](#relación-cliente-vehículo)
7. [Reservaciones](#reservaciones)
8. [Órdenes de Trabajo](#órdenes-de-trabajo)
9. [Esquemas de Datos](#esquemas-de-datos)

---

## Aplicación General

### Página de Inicio
- **Endpoint**: `GET /api/v1`
- **Descripción**: Página de inicio con información general de la API
- **Respuesta**: HTML renderizado

### Health Check
- **Endpoint**: `GET /api/v1/health`
- **Descripción**: Verificación del estado del servidor
- **Respuesta**:
```json
{
  "status": "OK",
  "timestamp": "2024-11-11T04:55:03.000Z",
  "uptime": 1234.56,
  "version": "v1"
}
```

---

## Clientes

### Crear Cliente
- **Endpoint**: `POST /api/v1/client/create`
- **Descripción**: Crear un nuevo cliente
- **Body**:
```json
{
  "clientCode": 1001,
  "name": "Juan",
  "lastName": "Pérez",
  "phone": "70123456",
  "ci": 12345678,
  "type": "client",
  "gender": "male",
  "email": "juan@email.com",
  "password": "password123",
  "address": "Av. América 123",
  "preferredContactMethod": "phone"
}
```
- **Respuestas**:
  - `201`: Cliente creado exitosamente
  - `400`: Datos inválidos
  - `409`: Cliente ya existe

### Listar Todos los Clientes
- **Endpoint**: `GET /api/v1/client`
- **Descripción**: Obtener lista de todos los clientes
- **Respuesta**: `200` - Array de clientes

### Listar Clientes Activos
- **Endpoint**: `GET /api/v1/client/active`
- **Descripción**: Obtener solo clientes activos
- **Respuesta**: `200` - Array de clientes activos

### Listar Clientes Inactivos
- **Endpoint**: `GET /api/v1/client/inactive`
- **Descripción**: Obtener solo clientes inactivos
- **Respuesta**: `200` - Array de clientes inactivos

### Buscar Clientes
- **Endpoint**: `GET /api/v1/client/search?term={término}`
- **Descripción**: Búsqueda general por nombre, apellido, email o teléfono
- **Parámetros**:
  - `term` (query): Término de búsqueda
- **Respuesta**: `200` - Array de clientes coincidentes

### Buscar Cliente por Email
- **Endpoint**: `GET /api/v1/client/email/{email}`
- **Descripción**: Buscar cliente específico por email
- **Parámetros**:
  - `email` (path): Email del cliente
- **Respuestas**:
  - `200`: Cliente encontrado
  - `404`: Cliente no encontrado

### Buscar Cliente por Teléfono
- **Endpoint**: `GET /api/v1/client/phone/{phone}`
- **Descripción**: Buscar cliente específico por teléfono
- **Parámetros**:
  - `phone` (path): Teléfono del cliente
- **Respuestas**:
  - `200`: Cliente encontrado
  - `404`: Cliente no encontrado

### Buscar Cliente por CI
- **Endpoint**: `GET /api/v1/client/ci/{ci}`
- **Descripción**: Buscar cliente específico por cédula de identidad
- **Parámetros**:
  - `ci` (path): Cédula de identidad
- **Respuestas**:
  - `200`: Cliente encontrado
  - `404`: Cliente no encontrado

### Obtener Cliente por Código
- **Endpoint**: `GET /api/v1/client/{code}`
- **Descripción**: Obtener cliente específico por código único
- **Parámetros**:
  - `code` (path): Código único del cliente
- **Respuestas**:
  - `200`: Cliente encontrado
  - `404`: Cliente no encontrado

### Estadísticas Generales
- **Endpoint**: `GET /api/v1/client/statistics/general`
- **Descripción**: Obtener estadísticas generales de todos los clientes
- **Respuesta**: `200` - Objeto con estadísticas

### Top Clientes
- **Endpoint**: `GET /api/v1/client/statistics/top?limit={límite}`
- **Descripción**: Obtener clientes que más gastan
- **Parámetros**:
  - `limit` (query, opcional): Cantidad de clientes (default: 10)
- **Respuesta**: `200` - Array de top clientes

### Reporte Clientes Inactivos
- **Endpoint**: `GET /api/v1/client/reports/inactive-clients?days={días}`
- **Descripción**: Obtener clientes sin actividad en X días
- **Parámetros**:
  - `days` (query, opcional): Días de inactividad (default: 90)
- **Respuesta**: `200` - Reporte de clientes inactivos

### Filtrar por Género
- **Endpoint**: `GET /api/v1/client/filter/gender/{gender}`
- **Descripción**: Obtener clientes por género
- **Parámetros**:
  - `gender` (path): Género (`male` o `female`)
- **Respuesta**: `200` - Array de clientes filtrados

### Filtrar por Método de Contacto
- **Endpoint**: `GET /api/v1/client/filter/contact-method/{method}`
- **Descripción**: Obtener clientes por método de contacto preferido
- **Parámetros**:
  - `method` (path): Método (`phone`, `email`, `whatsapp`)
- **Respuesta**: `200` - Array de clientes filtrados

### Estadísticas de Cliente
- **Endpoint**: `GET /api/v1/client/{code}/statistics`
- **Descripción**: Estadísticas detalladas de un cliente específico
- **Parámetros**:
  - `code` (path): Código único del cliente
- **Respuestas**:
  - `200`: Estadísticas del cliente
  - `404`: Cliente no encontrado

### Historial de Cliente
- **Endpoint**: `GET /api/v1/client/{code}/history`
- **Descripción**: Historial completo del cliente (reservas y vehículos)
- **Parámetros**:
  - `code` (path): Código único del cliente
- **Respuestas**:
  - `200`: Historial del cliente
  - `404`: Cliente no encontrado

### Reservaciones de Cliente
- **Endpoint**: `GET /api/v1/client/{code}/reservations`
- **Descripción**: Obtener todas las reservaciones de un cliente
- **Parámetros**:
  - `code` (path): Código único del cliente
- **Respuestas**:
  - `200`: Array de reservaciones
  - `404`: Cliente no encontrado

### Vehículos de Cliente
- **Endpoint**: `GET /api/v1/client/{code}/vehicles`
- **Descripción**: Obtener todos los vehículos de un cliente
- **Parámetros**:
  - `code` (path): Código único del cliente
- **Respuestas**:
  - `200`: Array de vehículos
  - `404`: Cliente no encontrado

### Actualizar Cliente
- **Endpoint**: `PATCH /api/v1/client/{code}/update`
- **Descripción**: Actualizar datos de un cliente
- **Parámetros**:
  - `code` (path): Código único del cliente
- **Body**: Objeto con campos a actualizar
- **Respuestas**:
  - `200`: Cliente actualizado
  - `404`: Cliente no encontrado
  - `400`: Datos inválidos

### Eliminar Cliente
- **Endpoint**: `DELETE /api/v1/client/{code}/delete`
- **Descripción**: Eliminar un cliente (soft delete)
- **Parámetros**:
  - `code` (path): Código único del cliente
- **Respuestas**:
  - `200`: Cliente eliminado
  - `404`: Cliente no encontrado

---

## Vehículos

### Crear Vehículo
- **Endpoint**: `POST /api/v1/vehicle/create`
- **Descripción**: Registrar un nuevo vehículo
- **Body**:
```json
{
  "board": "ABC123",
  "model": "Corolla",
  "brand": "Toyota",
  "year": 2020
}
```
- **Respuestas**:
  - `201`: Vehículo creado exitosamente
  - `400`: Datos inválidos
  - `409`: Placa ya existe

### Listar Vehículos
- **Endpoint**: `GET /api/v1/vehicle`
- **Descripción**: Obtener lista de todos los vehículos
- **Respuesta**: `200` - Array de vehículos

### Obtener Vehículo por ID
- **Endpoint**: `GET /api/v1/vehicle/{id}`
- **Descripción**: Obtener vehículo específico por ID
- **Parámetros**:
  - `id` (path): ID del vehículo
- **Respuestas**:
  - `200`: Vehículo encontrado
  - `404`: Vehículo no encontrado

### Actualizar Vehículo
- **Endpoint**: `PATCH /api/v1/vehicle/{id}/update`
- **Descripción**: Actualizar datos de un vehículo
- **Parámetros**:
  - `id` (path): ID del vehículo
- **Body**: Objeto con campos a actualizar
- **Respuestas**:
  - `200`: Vehículo actualizado
  - `404`: Vehículo no encontrado
  - `400`: Datos inválidos

### Eliminar Vehículo
- **Endpoint**: `DELETE /api/v1/vehicle/{id}/delete`
- **Descripción**: Eliminar un vehículo
- **Parámetros**:
  - `id` (path): ID del vehículo
- **Respuestas**:
  - `200`: Vehículo eliminado
  - `404`: Vehículo no encontrado

---

## Servicios

### Crear Servicio
- **Endpoint**: `POST /api/v1/service/create`
- **Descripción**: Crear un nuevo servicio
- **Body**:
```json
{
  "code": 101,
  "title": "Cambio de Aceite",
  "description": "Cambio de aceite del motor con filtro incluido",
  "price": 150
}
```
- **Respuestas**:
  - `201`: Servicio creado exitosamente
  - `400`: Datos inválidos
  - `409`: Código ya existe

### Listar Servicios
- **Endpoint**: `GET /api/v1/service`
- **Descripción**: Obtener lista de todos los servicios
- **Respuesta**: `200` - Array de servicios

### Obtener Servicio por ID
- **Endpoint**: `GET /api/v1/service/{id}`
- **Descripción**: Obtener servicio específico por ID
- **Parámetros**:
  - `id` (path): ID del servicio
- **Respuestas**:
  - `200`: Servicio encontrado
  - `404`: Servicio no encontrado

### Actualizar Servicio
- **Endpoint**: `PATCH /api/v1/service/{id}/update`
- **Descripción**: Actualizar datos de un servicio
- **Parámetros**:
  - `id` (path): ID del servicio
- **Body**: Objeto con campos a actualizar
- **Respuestas**:
  - `200`: Servicio actualizado
  - `404`: Servicio no encontrado
  - `400`: Datos inválidos

### Eliminar Servicio
- **Endpoint**: `DELETE /api/v1/service/{id}/delete`
- **Descripción**: Eliminar un servicio
- **Parámetros**:
  - `id` (path): ID del servicio
- **Respuestas**:
  - `200`: Servicio eliminado
  - `404`: Servicio no encontrado

---

## Mecánicos

### Crear Mecánico
- **Endpoint**: `POST /api/v1/mechanic`
- **Descripción**: Crear un nuevo mecánico
- **Body**:
```json
{
  "employeeCode": "MEC001",
  "firstName": "Juan Carlos",
  "lastName": "Pérez",
  "phone": "70123456",
  "type": "mechanic",
  "hireDate": "2023-01-15",
  "yearsExperience": 5,
  "experienceLevel": "senior",
  "status": "active",
  "specialties": ["engine", "transmission"],
  "hourlyRate": 45.00,
  "workScheduleStart": "08:00:00",
  "workScheduleEnd": "17:00:00",
  "workDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
}
```
- **Respuestas**:
  - `201`: Mecánico creado exitosamente
  - `400`: Datos inválidos
  - `409`: Código de empleado ya existe

### Listar Mecánicos
- **Endpoint**: `GET /api/v1/mechanic?page={página}&limit={límite}`
- **Descripción**: Obtener lista paginada de mecánicos
- **Parámetros**:
  - `page` (query, opcional): Número de página (default: 1)
  - `limit` (query, opcional): Límite por página (default: 10)
- **Respuesta**: `200` - Objeto con mecánicos paginados

### Estadísticas de Mecánicos
- **Endpoint**: `GET /api/v1/mechanic/statistics`
- **Descripción**: Obtener estadísticas generales de mecánicos
- **Respuesta**: `200` - Objeto con estadísticas

### Mecánicos Disponibles
- **Endpoint**: `GET /api/v1/mechanic/available?date={fecha}`
- **Descripción**: Obtener mecánicos disponibles
- **Parámetros**:
  - `date` (query, opcional): Fecha en formato YYYY-MM-DD
- **Respuesta**: `200` - Array de mecánicos disponibles

### Buscar por Especialidad
- **Endpoint**: `GET /api/v1/mechanic/specialty/{specialty}`
- **Descripción**: Buscar mecánicos por especialidad
- **Parámetros**:
  - `specialty` (path): Especialidad del mecánico
- **Respuesta**: `200` - Array de mecánicos con esa especialidad

### Buscar por Nivel de Experiencia
- **Endpoint**: `GET /api/v1/mechanic/experience/{level}`
- **Descripción**: Buscar mecánicos por nivel de experiencia
- **Parámetros**:
  - `level` (path): Nivel de experiencia (`trainee`, `junior`, `senior`, `expert`, `master`)
- **Respuesta**: `200` - Array de mecánicos

### Buscar por Día de Trabajo
- **Endpoint**: `GET /api/v1/mechanic/workday/{day}`
- **Descripción**: Buscar mecánicos que trabajen un día específico
- **Parámetros**:
  - `day` (path): Día de la semana en inglés (Monday, Tuesday, etc.)
- **Respuesta**: `200` - Array de mecánicos

### Búsqueda General
- **Endpoint**: `GET /api/v1/mechanic/search?term={término}`
- **Descripción**: Búsqueda general de mecánicos
- **Parámetros**:
  - `term` (query): Término de búsqueda
- **Respuesta**: `200` - Array de mecánicos coincidentes

### Buscar por Código de Empleado
- **Endpoint**: `GET /api/v1/mechanic/employee/{code}`
- **Descripción**: Buscar mecánico por código de empleado
- **Parámetros**:
  - `code` (path): Código de empleado
- **Respuestas**:
  - `200`: Mecánico encontrado
  - `404`: Mecánico no encontrado

### Horario de Mecánico
- **Endpoint**: `GET /api/v1/mechanic/{code}/schedule`
- **Descripción**: Obtener horario de trabajo de un mecánico
- **Parámetros**:
  - `code` (path): Código de empleado
- **Respuestas**:
  - `200`: Horario del mecánico
  - `404`: Mecánico no encontrado

### Obtener Mecánico por Código
- **Endpoint**: `GET /api/v1/mechanic/{code}`
- **Descripción**: Obtener mecánico específico por código
- **Parámetros**:
  - `code` (path): Código de empleado
- **Respuestas**:
  - `200`: Mecánico encontrado
  - `404`: Mecánico no encontrado

### Actualizar Mecánico
- **Endpoint**: `PATCH /api/v1/mechanic/{code}/update`
- **Descripción**: Actualizar datos de un mecánico
- **Parámetros**:
  - `code` (path): Código de empleado
- **Body**: Objeto con campos a actualizar
- **Respuestas**:
  - `200`: Mecánico actualizado
  - `404`: Mecánico no encontrado
  - `400`: Datos inválidos

### Actualizar Estado de Mecánico
- **Endpoint**: `PATCH /api/v1/mechanic/{code}/status`
- **Descripción**: Actualizar estado de un mecánico
- **Parámetros**:
  - `code` (path): Código de empleado
- **Body**:
```json
{
  "status": "active" | "inactive" | "on_leave" | "terminated"
}
```
- **Respuestas**:
  - `200`: Estado actualizado
  - `404`: Mecánico no encontrado
  - `400`: Estado inválido

### Eliminar Mecánico
- **Endpoint**: `DELETE /api/v1/mechanic/{code}/delete`
- **Descripción**: Eliminar un mecánico (soft delete)
- **Parámetros**:
  - `code` (path): Código de empleado
- **Respuestas**:
  - `200`: Mecánico eliminado
  - `404`: Mecánico no encontrado

---

## Relación Cliente-Vehículo

### Asociar Cliente con Vehículo
- **Endpoint**: `POST /api/v1/client-vehicle`
- **Descripción**: Crear asociación entre cliente y vehículo
- **Body**:
```json
{
  "clientCode": 1001,
  "vehicleId": 1,
  "isPrimary": true,
  "notes": "Vehículo principal del cliente"
}
```
- **Respuestas**:
  - `201`: Asociación creada exitosamente
  - `400`: Datos inválidos
  - `409`: Asociación ya existe

### Listar Todas las Asociaciones
- **Endpoint**: `GET /api/v1/client-vehicle`
- **Descripción**: Obtener todas las asociaciones cliente-vehículo
- **Respuesta**: `200` - Array de asociaciones

### Vehículos de un Cliente
- **Endpoint**: `GET /api/v1/client-vehicle/client/{clientCode}`
- **Descripción**: Obtener vehículos de un cliente específico
- **Parámetros**:
  - `clientCode` (path): Código del cliente
- **Respuesta**: `200` - Array de vehículos del cliente

### Clientes de un Vehículo
- **Endpoint**: `GET /api/v1/client-vehicle/vehicle/{vehicleId}`
- **Descripción**: Obtener clientes asociados a un vehículo
- **Parámetros**:
  - `vehicleId` (path): ID del vehículo
- **Respuesta**: `200` - Array de clientes del vehículo

### Obtener Asociación por ID
- **Endpoint**: `GET /api/v1/client-vehicle/{id}`
- **Descripción**: Obtener asociación específica por ID
- **Parámetros**:
  - `id` (path): ID de la asociación
- **Respuestas**:
  - `200`: Asociación encontrada
  - `404`: Asociación no encontrada

### Actualizar Asociación
- **Endpoint**: `PATCH /api/v1/client-vehicle/{id}`
- **Descripción**: Actualizar datos de una asociación
- **Parámetros**:
  - `id` (path): ID de la asociación
- **Body**: Objeto con campos a actualizar
- **Respuestas**:
  - `200`: Asociación actualizada
  - `404`: Asociación no encontrada
  - `400`: Datos inválidos

### Establecer Vehículo Primario
- **Endpoint**: `PATCH /api/v1/client-vehicle/{id}/set-primary`
- **Descripción**: Establecer un vehículo como primario para el cliente
- **Parámetros**:
  - `id` (path): ID de la asociación
- **Respuestas**:
  - `200`: Vehículo establecido como primario
  - `404`: Asociación no encontrada

### Eliminar Asociación
- **Endpoint**: `DELETE /api/v1/client-vehicle/{id}`
- **Descripción**: Eliminar asociación cliente-vehículo
- **Parámetros**:
  - `id` (path): ID de la asociación
- **Respuestas**:
  - `200`: Asociación eliminada
  - `404`: Asociación no encontrada

---

## Reservaciones

### Crear Reservación
- **Endpoint**: `POST /api/v1/reservate/create`
- **Descripción**: Crear una nueva reservación
- **Body**:
```json
{
  "codeReservate": 2024110013,
  "reservationDate": "2024-11-15T10:00:00.000Z",
  "totalPrice": 300,
  "state": "pending",
  "clientId": 1,
  "mechanicId": 2,
  "serviceIds": [1, 2, 3]
}
```
- **Respuestas**:
  - `201`: Reservación creada exitosamente
  - `400`: Datos inválidos
  - `409`: Código de reservación ya existe

### Listar Reservaciones
- **Endpoint**: `GET /api/v1/reservate`
- **Descripción**: Obtener lista de todas las reservaciones
- **Respuesta**: `200` - Array de reservaciones

### Obtener Reservación por Código
- **Endpoint**: `GET /api/v1/reservate/{code}`
- **Descripción**: Obtener reservación específica por código
- **Parámetros**:
  - `code` (path): Código de la reservación
- **Respuestas**:
  - `200`: Reservación encontrada
  - `404`: Reservación no encontrada

### Actualizar Reservación
- **Endpoint**: `PATCH /api/v1/reservate/{code}/update`
- **Descripción**: Actualizar datos de una reservación
- **Parámetros**:
  - `code` (path): Código de la reservación
- **Body**: Objeto con campos a actualizar
- **Respuestas**:
  - `200`: Reservación actualizada
  - `404`: Reservación no encontrada
  - `400`: Datos inválidos

### Eliminar Reservación
- **Endpoint**: `DELETE /api/v1/reservate/{code}/delete`
- **Descripción**: Eliminar una reservación
- **Parámetros**:
  - `code` (path): Código de la reservación
- **Respuestas**:
  - `200`: Reservación eliminada
  - `404`: Reservación no encontrada

---

## Órdenes de Trabajo

### Crear Orden
- **Endpoint**: `POST /api/v1/order/create`
- **Descripción**: Crear una nueva orden de trabajo
- **Body**:
```json
{
  "orderCode": "ORD-2024-013",
  "reservateId": 1,
  "vehicleId": 1,
  "mechanicId": 1,
  "status": "pending",
  "diagnosis": "Descripción del problema",
  "workDescription": "Descripción del trabajo a realizar",
  "clientNitCi": 12345678,
  "clientName": "Juan Pérez",
  "clientEmail": "juan@email.com",
  "subtotal": 265.49,
  "taxAmount": 34.51,
  "totalCost": 300.00,
  "paymentMethod": "cash"
}
```
- **Respuestas**:
  - `201`: Orden creada exitosamente
  - `400`: Datos inválidos
  - `409`: Código de orden ya existe

### Listar Órdenes
- **Endpoint**: `GET /api/v1/order`
- **Descripción**: Obtener lista de todas las órdenes
- **Respuesta**: `200` - Array de órdenes

### Generar Factura
- **Endpoint**: `GET /api/v1/order/{code}/factus`
- **Descripción**: Generar factura para una orden
- **Parámetros**:
  - `code` (path): Código de la orden
- **Respuestas**:
  - `200`: Datos de factura generados
  - `404`: Orden no encontrada

### Obtener Orden por Código
- **Endpoint**: `GET /api/v1/order/{code}`
- **Descripción**: Obtener orden específica por código
- **Parámetros**:
  - `code` (path): Código de la orden
- **Respuestas**:
  - `200`: Orden encontrada
  - `404`: Orden no encontrada

### Actualizar Orden
- **Endpoint**: `PATCH /api/v1/order/{code}/update`
- **Descripción**: Actualizar datos de una orden
- **Parámetros**:
  - `code` (path): Código de la orden
- **Body**: Objeto con campos a actualizar
- **Respuestas**:
  - `200`: Orden actualizada
  - `404`: Orden no encontrada
  - `400`: Datos inválidos

### Eliminar Orden
- **Endpoint**: `DELETE /api/v1/order/{code}/delete`
- **Descripción**: Eliminar una orden de trabajo
- **Parámetros**:
  - `code` (path): Código de la orden
- **Respuestas**:
  - `200`: Orden eliminada
  - `404`: Orden no encontrada

---

## Esquemas de Datos

### Cliente (Client)
```json
{
  "id": 1,
  "clientCode": 1001,
  "name": "Juan",
  "lastName": "Pérez",
  "phone": "70123456",
  "ci": 12345678,
  "type": "client",
  "gender": "male",
  "email": "juan@email.com",
  "emailVerified": true,
  "phoneVerified": true,
  "lastLogin": "2024-11-10T15:30:00.000Z",
  "address": "Av. América 123",
  "preferredContactMethod": "phone",
  "isActive": true,
  "createdAt": "2024-05-10T15:30:00.000Z",
  "updatedAt": "2024-11-10T15:30:00.000Z"
}
```

### Vehículo (Vehicle)
```json
{
  "id": 1,
  "board": "ABC123",
  "model": "Corolla",
  "brand": "Toyota",
  "year": 2020
}
```

### Servicio (Service)
```json
{
  "id": 1,
  "code": 101,
  "title": "Cambio de Aceite",
  "description": "Cambio de aceite del motor con filtro incluido",
  "price": 150
}
```

### Mecánico (Mechanic)
```json
{
  "id": 1,
  "employeeCode": "MEC001",
  "firstName": "Juan Carlos",
  "lastName": "Pérez",
  "phone": "70123456",
  "type": "mechanic",
  "hireDate": "2023-01-15",
  "yearsExperience": 5,
  "experienceLevel": "senior",
  "status": "active",
  "specialties": ["engine", "transmission"],
  "hourlyRate": 45.00,
  "workScheduleStart": "08:00:00",
  "workScheduleEnd": "17:00:00",
  "workDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "isActive": true,
  "createdAt": "2023-01-15T08:00:00.000Z",
  "updatedAt": "2024-11-10T15:30:00.000Z"
}
```

### Asociación Cliente-Vehículo (ClientVehicle)
```json
{
  "id": 1,
  "clientCode": 1001,
  "vehicleId": 1,
  "isPrimary": true,
  "notes": "Vehículo principal del cliente",
  "isActive": true,
  "addedDate": "2024-05-10T15:30:00.000Z",
  "updatedAt": "2024-11-10T15:30:00.000Z"
}
```

### Reservación (Reservate)
```json
{
  "id": 1,
  "codeReservate": 2024110001,
  "reservationDate": "2024-11-15T10:00:00.000Z",
  "totalPrice": 300,
  "state": "pending",
  "clientId": 1,
  "mechanicId": 2,
  "createdAt": "2024-11-10T15:30:00.000Z",
  "updatedAt": "2024-11-10T15:30:00.000Z",
  "services": [
    {
      "id": 1,
      "code": 101,
      "title": "Cambio de Aceite",
      "price": 150
    }
  ]
}
```

### Orden de Trabajo (Order)
```json
{
  "id": 1,
  "orderCode": "ORD-2024-001",
  "reservateId": 1,
  "vehicleId": 1,
  "mechanicId": 1,
  "status": "pending",
  "diagnosis": "Aceite de motor en mal estado",
  "workDescription": "Cambio de aceite 5W-30 sintético",
  "startDate": "2024-11-15T09:00:00.000Z",
  "completionDate": null,
  "clientNitCi": 12345678,
  "clientName": "Juan Pérez",
  "clientEmail": "juan@email.com",
  "subtotal": 265.49,
  "taxAmount": 34.51,
  "totalCost": 300.00,
  "paymentMethod": "cash",
  "invoiceNumber": null,
  "createdAt": "2024-11-10T15:30:00.000Z",
  "updatedAt": "2024-11-10T15:30:00.000Z"
}
```

## Enumeraciones (Enums)

### Género del Cliente
- `male`: Masculino
- `female`: Femenino

### Método de Contacto Preferido
- `phone`: Teléfono
- `email`: Email
- `whatsapp`: WhatsApp

### Nivel de Experiencia del Mecánico
- `trainee`: Aprendiz
- `junior`: Junior
- `senior`: Senior
- `expert`: Experto
- `master`: Maestro

### Estado del Mecánico
- `active`: Activo
- `inactive`: Inactivo
- `on_leave`: De licencia
- `terminated`: Dado de baja

### Especialidades del Mecánico
- `engine`: Motor
- `transmission`: Transmisión
- `brakes`: Frenos
- `suspension`: Suspensión
- `electrical`: Eléctrico
- `air_conditioning`: Aire acondicionado
- `bodywork`: Carrocería
- `painting`: Pintura
- `diagnostics`: Diagnósticos
- `general`: General

### Estado de la Reservación
- `pending`: Pendiente
- `confirmed`: Confirmada
- `in_progress`: En progreso
- `completed`: Completada
- `cancelled`: Cancelada

### Estado de la Orden
- `pending`: Pendiente
- `in_progress`: En progreso
- `completed`: Completada
- `cancelled`: Cancelada

### Método de Pago
- `cash`: Efectivo
- `card`: Tarjeta
- `transfer`: Transferencia
- `qr`: Código QR

---

## Códigos de Estado HTTP

### Códigos de Éxito
- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente

### Códigos de Error del Cliente
- `400 Bad Request`: Datos de entrada inválidos
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto con el estado actual del recurso

### Códigos de Error del Servidor
- `500 Internal Server Error`: Error interno del servidor

---

## Notas Adicionales

1. **Paginación**: Los endpoints que retornan listas pueden implementar paginación usando parámetros `page` y `limit`.

2. **Filtros**: Muchos endpoints soportan filtros adicionales a través de query parameters.

3. **Validaciones**: Todos los endpoints validan los datos de entrada y retornan errores descriptivos.

4. **Relaciones**: Las entidades incluyen sus relaciones cuando es apropiado para reducir la cantidad de requests necesarios.

5. **Soft Delete**: Las eliminaciones son soft deletes (marcar como inactivo) para mantener integridad referencial.

6. **Timestamps**: Todas las entidades incluyen `createdAt` y `updatedAt` automáticamente.

7. **Swagger**: La documentación completa e interactiva está disponible en `/api/docs`.
