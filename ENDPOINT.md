# API Mecanix Backend - Documentación de Endpoints

## Información General

- **Base URL**: `http://localhost:4000/api/v1`
- **Documentación Swagger**: `http://localhost:4000/api/docs`
- **Formato de respuesta**: JSON
- **Autenticación**: No implementada (en desarrollo)

## Índice

1. [Autenticación](#autenticación)
2. [Aplicación General](#aplicación-general)
3. [Clientes](#clientes)
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

## Autenticación

### Admin Login

- **Endpoint**: `POST /api/v1/auth/admin/signin`
- **Descripción**: Iniciar sesión como administrador
- **Body**:
```json
{
  "email": "admin@mecanix.com",
  "password": "adminpassword"
}
```
- **Respuestas**:
  - `201`: Login exitoso
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "email": "admin@mecanix.com",
      "role": "admin"
    }
  }
  ```
  - `401`: Credenciales inválidas

### Cliente Login

- **Endpoint**: `POST /api/v1/auth/client/signin`
- **Descripción**: Iniciar sesión como cliente
- **Body**:
```json
{
  "email": "cliente@email.com",
  "password": "password123"
}
```
- **Respuestas**:
  - `201`: Login exitoso
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "cliente@email.com",
      "name": "Juan",
      "lastname": "Pérez",
      "role": "client",
      ...
    }
  }
  ```
  - `401`: Credenciales inválidas

### Cliente Registro

- **Endpoint**: `POST /api/v1/auth/client/signup`
- **Descripción**: Registrar un nuevo cliente
- **Body**:
```json
{
  "code": 1001,
  "name": "Juan",
  "lastname": "Pérez",
  "phone": "70123456",
  "ci": 12345678,
  "gender": "male",
  "email": "juan@email.com",
  "password": "Password123!",
  "address": "Av. Principal 123",
  "preferredContactMethod": "phone"
}
```
- **Respuestas**:
  - `201`: Registro exitoso (retorna el cliente creado sin password)
  - `409`: Cliente ya existe (email duplicado)

### Mecánico Login

- **Endpoint**: `POST /api/v1/auth/mechanic/signin`
- **Descripción**: Iniciar sesión como mecánico (puede usar email o código de empleado)
- **Body**:
```json
{
  "email": "mechanic@mecanix.com", // O código de empleado: "MEC001"
  "password": "password123"
}
```
- **Respuestas**:
  - `201`: Login exitoso
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "employeeCode": "MEC001",
      "email": "mechanic@mecanix.com",
      "firstName": "Carlos",
      "lastName": "Gómez",
      "role": "mechanic",
      ...
    }
  }
  ```
  - `401`: Credenciales inválidas

### Mecánico Registro

- **Endpoint**: `POST /api/v1/auth/mechanic/signup`
- **Descripción**: Registrar un nuevo mecánico
- **Body**:
```json
{
  "employeeCode": "MEC001",
  "firstName": "Carlos",
  "lastName": "Gómez",
  "phone": "70123456",
  "email": "mechanic@mecanix.com",
  "password": "Password123!",
  "hireDate": "2024-01-15",
  "yearsExperience": 5,
  "experienceLevel": "senior",
  "status": "active",
  "specialties": ["engine", "transmission"],
  "hourlyRate": 25.50,
  "workScheduleStart": "08:00",
  "workScheduleEnd": "17:00",
  "workDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
}
```
- **Respuestas**:
  - `201`: Registro exitoso (retorna el mecánico creado sin password)
  - `409`: Mecánico ya existe (email o código duplicado)

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
- **Body**: 
```json
[
  {
    "id": 1,
    "code": 1001,
    "name": "Carlos",
    "lastname": "Rodriguez",
    "phone": "70123456",
    "ci": 12345678,
    "type": "client",
    "gender": "male",
    "email": "carlos.rodriguez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-10T14:00:00.000Z",
    "address": "Av. 6 de Agosto #1234, La Paz",
    "preferredContactMethod": "phone",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 2,
    "code": 1002,
    "name": "María",
    "lastname": "González",
    "phone": "70234567",
    "ci": 87654321,
    "type": "client",
    "gender": "female",
    "email": "maria.gonzalez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-09T18:30:00.000Z",
    "address": "Calle Comercio #567, El Alto",
    "preferredContactMethod": "email",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 3,
    "code": 1003,
    "name": "Pedro",
    "lastname": "Martínez",
    "phone": "70345678",
    "ci": 11223344,
    "type": "client",
    "gender": "male",
    "email": "pedro.martinez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": false,
    "phoneVerified": true,
    "lastLogin": "2025-11-08T13:15:00.000Z",
    "address": "Av. Arce #890, Sopocachi",
    "preferredContactMethod": "whatsapp",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 4,
    "code": 1004,
    "name": "Ana",
    "lastname": "López",
    "phone": "70456789",
    "ci": 55667788,
    "type": "client",
    "gender": "female",
    "email": "ana.lopez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": false,
    "lastLogin": "2025-11-07T20:45:00.000Z",
    "address": "Zona Sur, Calacoto #321",
    "preferredContactMethod": "phone",
    "isActive": false,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 5,
    "code": 1005,
    "name": "Luis",
    "lastname": "Fernández",
    "phone": "70567890",
    "ci": 33445566,
    "type": "client",
    "gender": "male",
    "email": "luis.fernandez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-06T15:20:00.000Z",
    "address": "Miraflores #654, Zona Centro",
    "preferredContactMethod": "email",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 6,
    "code": 1006,
    "name": "Sofía",
    "lastname": "Vargas",
    "phone": "70678901",
    "ci": 66778899,
    "type": "client",
    "gender": "female",
    "email": "sofia.vargas@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-05T17:10:00.000Z",
    "address": "Villa Fátima #777, Zona Norte",
    "preferredContactMethod": "whatsapp",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 7,
    "code": 1007,
    "name": "Ricardo",
    "lastname": "Moreno",
    "phone": "70789012",
    "ci": 77889900,
    "type": "client",
    "gender": "male",
    "email": "ricardo.moreno@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": false,
    "phoneVerified": true,
    "lastLogin": "2025-11-04T16:25:00.000Z",
    "address": "Obrajes #888, Zona Residencial",
    "preferredContactMethod": "phone",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 8,
    "code": 1008,
    "name": "Carmen",
    "lastname": "Silva",
    "phone": "70890123",
    "ci": 88990011,
    "type": "client",
    "gender": "female",
    "email": null,
    "password": null,
    "emailVerified": false,
    "phoneVerified": false,
    "lastLogin": null,
    "address": "Achumani #999, Zona Sur",
    "preferredContactMethod": "phone",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  }
]
```
- **Respuesta**: `200` - Array de clientes
- **Respuesta**: `404` - Array vacío si no hay clientes

### Listar Clientes Activos

- **Endpoint**: `GET /api/v1/client/active`
- **Descripción**: Obtener solo clientes activos
- **Body**: 
```json
[
  {
    "id": 1,
    "code": 1001,
    "name": "Carlos",
    "lastname": "Rodriguez",
    "phone": "70123456",
    "ci": 12345678,
    "type": "client",
    "gender": "male",
    "email": "carlos.rodriguez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-10T14:00:00.000Z",
    "address": "Av. 6 de Agosto #1234, La Paz",
    "preferredContactMethod": "phone",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 2,
    "code": 1002,
    "name": "María",
    "lastname": "González",
    "phone": "70234567",
    "ci": 87654321,
    "type": "client",
    "gender": "female",
    "email": "maria.gonzalez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-09T18:30:00.000Z",
    "address": "Calle Comercio #567, El Alto",
    "preferredContactMethod": "email",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 3,
    "code": 1003,
    "name": "Pedro",
    "lastname": "Martínez",
    "phone": "70345678",
    "ci": 11223344,
    "type": "client",
    "gender": "male",
    "email": "pedro.martinez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": false,
    "phoneVerified": true,
    "lastLogin": "2025-11-08T13:15:00.000Z",
    "address": "Av. Arce #890, Sopocachi",
    "preferredContactMethod": "whatsapp",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 5,
    "code": 1005,
    "name": "Luis",
    "lastname": "Fernández",
    "phone": "70567890",
    "ci": 33445566,
    "type": "client",
    "gender": "male",
    "email": "luis.fernandez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-06T15:20:00.000Z",
    "address": "Miraflores #654, Zona Centro",
    "preferredContactMethod": "email",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 6,
    "code": 1006,
    "name": "Sofía",
    "lastname": "Vargas",
    "phone": "70678901",
    "ci": 66778899,
    "type": "client",
    "gender": "female",
    "email": "sofia.vargas@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-05T17:10:00.000Z",
    "address": "Villa Fátima #777, Zona Norte",
    "preferredContactMethod": "whatsapp",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 7,
    "code": 1007,
    "name": "Ricardo",
    "lastname": "Moreno",
    "phone": "70789012",
    "ci": 77889900,
    "type": "client",
    "gender": "male",
    "email": "ricardo.moreno@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": false,
    "phoneVerified": true,
    "lastLogin": "2025-11-04T16:25:00.000Z",
    "address": "Obrajes #888, Zona Residencial",
    "preferredContactMethod": "phone",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 8,
    "code": 1008,
    "name": "Carmen",
    "lastname": "Silva",
    "phone": "70890123",
    "ci": 88990011,
    "type": "client",
    "gender": "female",
    "email": null,
    "password": null,
    "emailVerified": false,
    "phoneVerified": false,
    "lastLogin": null,
    "address": "Achumani #999, Zona Sur",
    "preferredContactMethod": "phone",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  }
]
```
- **Respuesta**: `200` - Array de clientes activos
- **Respuesta**: `404` - Array vacio sin no hay clientes activos

### Listar Clientes Inactivos

- **Endpoint**: `GET /api/v1/client/inactive`
- **Descripción**: Obtener solo clientes inactivos
- **Body**: 
```json
[
  {
    "id": 4,
    "code": 1004,
    "name": "Ana",
    "lastname": "López",
    "phone": "70456789",
    "ci": 55667788,
    "type": "client",
    "gender": "female",
    "email": "ana.lopez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": false,
    "lastLogin": "2025-11-07T20:45:00.000Z",
    "address": "Zona Sur, Calacoto #321",
    "preferredContactMethod": "phone",
    "isActive": false,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  }
]
```
- **Respuesta**: `200` - Array de clientes inactivos
- **Respuesta**: `404` - Array vacio sin noy hay clientes inactivos

### Buscar Clientes

- **Endpoint**: `GET /api/v1/client/search?term={término}`
- **Descripción**: Búsqueda general por nombre, apellido, email o teléfono
- **Parámetros**:
  - `term` (query): Término de búsqueda
- **Body**: 
```json
[
  {
    "id": 2,
    "code": 1002,
    "name": "María",
    "lastname": "González",
    "phone": "70234567",
    "ci": 87654321,
    "type": "client",
    "gender": "female",
    "email": "maria.gonzalez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-09T18:30:00.000Z",
    "address": "Calle Comercio #567, El Alto",
    "preferredContactMethod": "email",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  }
]
```
- **Respuesta**: `200` - Array de clientes coincidentes
- **Respuesta**: `404` - Array vacio sin coincidencias

### Buscar Cliente por Email

- **Endpoint**: `GET /api/v1/client/email/{email}`
- **Descripción**: Buscar cliente específico por email
- **Parámetros**:
  - `email` (path): Email del cliente
- **Body**: 
```json
{
  "id": 2,
  "code": 1002,
  "name": "María",
  "lastname": "González",
  "phone": "70234567",
  "ci": 87654321,
  "type": "client",
  "gender": "female",
  "email": "maria.gonzalez@mecanix.com",
  "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  "emailVerified": true,
  "phoneVerified": true,
  "lastLogin": "2025-11-09T18:30:00.000Z",
  "address": "Calle Comercio #567, El Alto",
  "preferredContactMethod": "email",
  "isActive": true,
  "createdAt": "2025-11-14T18:25:31.198Z",
  "updatedAt": "2025-11-14T18:25:31.198Z"
}
```
- **Respuestas**:
  - `200`: Cliente encontrado
  - `404`: Cliente no encontrado

### Buscar Cliente por Teléfono

- **Endpoint**: `GET /api/v1/client/phone/{phone}`
- **Descripción**: Buscar cliente específico por teléfono
- **Parámetros**:
  - `phone` (path): Teléfono del cliente
- **Body**: 
```json
{
  "id": 1,
  "code": 1001,
  "name": "Carlos",
  "lastname": "Rodriguez",
  "phone": "70123456",
  "ci": 12345678,
  "type": "client",
  "gender": "male",
  "email": "carlos.rodriguez@mecanix.com",
  "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  "emailVerified": true,
  "phoneVerified": true,
  "lastLogin": "2025-11-10T14:00:00.000Z",
  "address": "Av. 6 de Agosto #1234, La Paz",
  "preferredContactMethod": "phone",
  "isActive": true,
  "createdAt": "2025-11-14T18:25:31.198Z",
  "updatedAt": "2025-11-14T18:25:31.198Z"
}
```
- **Respuestas**:
  - `200`: Cliente encontrado
  - `404`: Cliente no encontrado 
  ```js
  null
  ```

### Buscar Cliente por CI

- **Endpoint**: `GET /api/v1/client/ci/{ci}`
- **Descripción**: Buscar cliente específico por cédula de identidad
- **Parámetros**:
  - `ci` (path): Cédula de identidad
- **Body**: 
```json
{
  "id": 1,
  "code": 1001,
  "name": "Carlos",
  "lastname": "Rodriguez",
  "phone": "70123456",
  "ci": 12345678,
  "type": "client",
  "gender": "male",
  "email": "carlos.rodriguez@mecanix.com",
  "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  "emailVerified": true,
  "phoneVerified": true,
  "lastLogin": "2025-11-10T14:00:00.000Z",
  "address": "Av. 6 de Agosto #1234, La Paz",
  "preferredContactMethod": "phone",
  "isActive": true,
  "createdAt": "2025-11-14T18:25:31.198Z",
  "updatedAt": "2025-11-14T18:25:31.198Z"
}
```
- **Respuestas**:
  - `200`: Cliente encontrado
  - `404`: Cliente no encontrado
  ```js
  null
  ```

### Obtener Cliente por Código

- **Endpoint**: `GET /api/v1/client/{code}`
- **Descripción**: Obtener cliente específico por código único
- **Parámetros**:
  - `code` (path): Código único del cliente
- **Body**: 
```json
{
  "id": 1,
  "code": 1001,
  "name": "Carlos",
  "lastname": "Rodriguez",
  "phone": "70123456",
  "ci": 12345678,
  "type": "client",
  "gender": "male",
  "email": "carlos.rodriguez@mecanix.com",
  "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  "emailVerified": true,
  "phoneVerified": true,
  "lastLogin": "2025-11-10T14:00:00.000Z",
  "address": "Av. 6 de Agosto #1234, La Paz",
  "preferredContactMethod": "phone",
  "isActive": true,
  "createdAt": "2025-11-14T18:25:31.198Z",
  "updatedAt": "2025-11-14T18:25:31.198Z"
}
```
- **Respuestas**:
  - `200`: Cliente encontrado
  - `404`: Cliente no encontrado
  ```js
  null
  ```

### Estadísticas Generales

- **Endpoint**: `GET /api/v1/client/statistics/general`
- **Descripción**: Obtener estadísticas generales de todos los clientes
- **Body**:
```json
{
  "totalClients": 8,
  "activeClients": 7,
  "inactiveClients": 1,
  "totalReservations": 9,
  "totalRevenue": 750,
  "averageReservationsPerClient": 1.13,
  "averageRevenuePerClient": 93.75,
  "genderDistribution": {
    "male": 4,
    "female": 4
  },
  "contactMethodDistribution": {
    "phone": 4,
    "email": 2,
    "whatsapp": 2
  }
}
```
- **Respuesta**: `200` - Objeto con estadísticas
- **Respuesta**: `404` - Valor nulo si no hay clientes
  ```js
  null
  ```

### Top Clientes

- **Endpoint**: `GET /api/v1/client/statistics/top?limit={límite}`
- **Descripción**: Obtener clientes que más gastan
- **Parámetros**:
  - `limit` (query, opcional): Cantidad de clientes (default: 10)
- **Body**: 
```json
[
  {
    "code": 1002,
    "fullName": "María González",
    "email": "maria.gonzalez@mecanix.com",
    "phone": "70234567",
    "totalReservations": 1,
    "totalSpent": 570,
    "lastVisit": "2025-11-12T14:30:00.000Z"
  },
  {
    "code": 1001,
    "fullName": "Carlos Rodriguez",
    "email": "carlos.rodriguez@mecanix.com",
    "phone": "70123456",
    "totalReservations": 2,
    "totalSpent": 180,
    "lastVisit": "2025-11-14T17:00:00.000Z"
  }
]
```
- **Respuesta**: `200` - Array de top clientes

### Reporte Clientes Inactivos

- **Endpoint**: `GET /api/v1/client/reports/inactive-clients?days={días}`
- **Descripción**: Obtener clientes sin actividad en X días
- **Parámetros**:
  - `days` (query, opcional): Días de inactividad (default: 90)
- **Body**: 
```json
[
  {
    "id": 2,
    "code": 1002,
    "name": "María",
    "lastname": "González",
    "phone": "70234567",
    "ci": 87654321,
    "type": "client",
    "gender": "female",
    "email": "maria.gonzalez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-09T18:30:00.000Z",
    "address": "Calle Comercio #567, El Alto",
    "preferredContactMethod": "email",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z",
    "reservations": [
      {
        "id": 2,
        "code": "202411002",
        "reservationDate": "2025-11-12T14:30:00.000Z",
        "totalPrice": 570,
        "state": "completed",
        "createdAt": "2025-11-14T18:26:02.078Z",
        "updatedAt": "2025-11-14T18:26:02.078Z"
      }
    ]
  },
  {
    "id": 3,
    "code": 1003,
    "name": "Pedro",
    "lastname": "Martínez",
    "phone": "70345678",
    "ci": 11223344,
    "type": "client",
    "gender": "male",
    "email": "pedro.martinez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": false,
    "phoneVerified": true,
    "lastLogin": "2025-11-08T13:15:00.000Z",
    "address": "Av. Arce #890, Sopocachi",
    "preferredContactMethod": "whatsapp",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z",
    "reservations": [
      {
        "id": 3,
        "code": "202411003",
        "reservationDate": "2025-11-12T18:00:00.000Z",
        "totalPrice": 220,
        "state": "in_progress",
        "createdAt": "2025-11-14T18:26:02.078Z",
        "updatedAt": "2025-11-14T18:26:02.078Z"
      }
    ]
  }
]
```
- **Respuesta**: `200` - Reporte de clientes inactivos

### Filtrar por Género

- **Endpoint**: `GET /api/v1/client/filter/gender/{gender}`
- **Descripción**: Obtener clientes por género
- **Parámetros**:
  - `gender` (path): Género (`male` o `female`)
- **Body**: 
```json
[
  {
    "id": 2,
    "code": 1002,
    "name": "María",
    "lastname": "González",
    "phone": "70234567",
    "ci": 87654321,
    "type": "client",
    "gender": "female",
    "email": "maria.gonzalez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-09T18:30:00.000Z",
    "address": "Calle Comercio #567, El Alto",
    "preferredContactMethod": "email",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 4,
    "code": 1004,
    "name": "Ana",
    "lastname": "López",
    "phone": "70456789",
    "ci": 55667788,
    "type": "client",
    "gender": "female",
    "email": "ana.lopez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": false,
    "lastLogin": "2025-11-07T20:45:00.000Z",
    "address": "Zona Sur, Calacoto #321",
    "preferredContactMethod": "phone",
    "isActive": false,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 6,
    "code": 1006,
    "name": "Sofía",
    "lastname": "Vargas",
    "phone": "70678901",
    "ci": 66778899,
    "type": "client",
    "gender": "female",
    "email": "sofia.vargas@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-05T17:10:00.000Z",
    "address": "Villa Fátima #777, Zona Norte",
    "preferredContactMethod": "whatsapp",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 8,
    "code": 1008,
    "name": "Carmen",
    "lastname": "Silva",
    "phone": "70890123",
    "ci": 88990011,
    "type": "client",
    "gender": "female",
    "email": null,
    "password": null,
    "emailVerified": false,
    "phoneVerified": false,
    "lastLogin": null,
    "address": "Achumani #999, Zona Sur",
    "preferredContactMethod": "phone",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  }
]
```
- **Respuesta**: `200` - Array de clientes filtrados

### Filtrar por Método de Contacto

- **Endpoint**: `GET /api/v1/client/filter/contact-method/{method}`
- **Descripción**: Obtener clientes por método de contacto preferido
- **Parámetros**:
  - `method` (path): Método (`phone`, `email`, `whatsapp`)
- **Body**: 
```json
[
  {
    "id": 2,
    "code": 1002,
    "name": "María",
    "lastname": "González",
    "phone": "70234567",
    "ci": 87654321,
    "type": "client",
    "gender": "female",
    "email": "maria.gonzalez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-09T18:30:00.000Z",
    "address": "Calle Comercio #567, El Alto",
    "preferredContactMethod": "email",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  {
    "id": 5,
    "code": 1005,
    "name": "Luis",
    "lastname": "Fernández",
    "phone": "70567890",
    "ci": 33445566,
    "type": "client",
    "gender": "male",
    "email": "luis.fernandez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-06T15:20:00.000Z",
    "address": "Miraflores #654, Zona Centro",
    "preferredContactMethod": "email",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  }
]
```
- **Respuesta**: `200` - Array de clientes filtrados

### Estadísticas de Cliente

- **Endpoint**: `GET /api/v1/client/{code}/statistics`
- **Descripción**: Estadísticas detalladas de un cliente específico
- **Parámetros**:
  - `code` (path): Código único del cliente
- **Body**: 
```json
{
  "clientCode": 1001,
  "fullName": "Carlos Rodriguez",
  "email": "carlos.rodriguez@mecanix.com",
  "totalReservations": 2,
  "completedReservations": 1,
  "pendingReservations": 1,
  "inProgressReservations": 0,
  "totalSpent": 180,
  "lastReservationDate": "2025-11-14T17:00:00.000Z",
  "firstReservationDate": "2025-11-12T13:00:00.000Z",
  "averageSpentPerReservation": 180,
  "topServices": [
    "Unknown"
  ],
  "registrationDate": "2025-11-14T18:25:31.198Z",
  "isActive": true
}
```
- **Respuestas**:
  - `200`: Estadísticas del cliente
  - `404`: Cliente no encontrado

### Historial de Cliente

- **Endpoint**: `GET /api/v1/client/{code}/history`
- **Descripción**: Historial completo del cliente (reservas y vehículos)
- **Parámetros**:
  - `code` (path): Código único del cliente
- **Body**: 
```json
{
  "client": {
    "code": 1001,
    "name": "Carlos",
    "lastname": "Rodriguez",
    "email": "carlos.rodriguez@mecanix.com",
    "phone": "70123456",
    "isActive": true
  },
  "reservations": [
    {
      "id": 10,
      "code": "202411010",
      "reservationDate": "2025-11-14T17:00:00.000Z",
      "state": "pending",
      "totalPrice": 450,
      "services": [
        {
          "id": 8,
          "title": "Cambio de batería",
          "price": 450
        },
        {
          "id": 7,
          "title": "Lavado completo",
          "price": 80
        }
      ],
      "mechanic": {
        "id": 6,
        "firstName": "Isabel",
        "lastName": "Cruz"
      }
    },
    {
      "id": 1,
      "code": "202411001",
      "reservationDate": "2025-11-12T13:00:00.000Z",
      "state": "completed",
      "totalPrice": 180,
      "services": [
        {
          "id": 1,
          "title": "Cambio de aceite",
          "price": 180
        }
      ],
      "mechanic": {
        "id": 1,
        "firstName": "Roberto",
        "lastName": "Pérez"
      }
    }
  ],
  "vehicles": [
    {
      "relationId": 6,
      "isPrimary": false,
      "isActive": true,
      "addedDate": "2024-10-15T20:30:00.000Z",
      "notes": "Volkswagen Golf 2020 - Segundo vehículo familiar",
      "vehicle": {
        "id": 6,
        "board": "MNO345",
        "model": "Golf",
        "brand": "Volkswagen",
        "year": 2020
      }
    },
    {
      "relationId": 1,
      "isPrimary": true,
      "isActive": true,
      "addedDate": "2024-10-01T12:00:00.000Z",
      "notes": "Toyota Corolla 2020 - Vehículo principal",
      "vehicle": {
        "id": 1,
        "board": "ABC123",
        "model": "Corolla",
        "brand": "Toyota",
        "year": 2020
      }
    }
  ],
  "statistics": {
    "totalReservations": 2,
    "activeVehicles": 2,
    "totalSpent": 630
  }
}
```
- **Respuestas**:
  - `200`: Historial del cliente
  - `404`: Cliente no encontrado

### Reservaciones de Cliente

- **Endpoint**: `GET /api/v1/client/{code}/reservations`
- **Descripción**: Obtener todas las reservaciones de un cliente
- **Parámetros**:
  - `code` (path): Código único del cliente
- **Body**: 
```json
{
  "client": {
    "code": 1001,
    "name": "Carlos",
    "lastname": "Rodriguez"
  },
  "reservations": [
    {
      "id": 10,
      "code": "202411010",
      "reservationDate": "2025-11-14T17:00:00.000Z",
      "state": "pending",
      "totalPrice": 450,
      "services": [
        {
          "id": 8,
          "title": "Cambio de batería",
          "description": "Reemplazo de batería del vehículo",
          "price": 450
        },
        {
          "id": 7,
          "title": "Lavado completo",
          "description": "Lavado exterior e interior del vehículo",
          "price": 80
        }
      ],
      "mechanic": {
        "id": 6,
        "firstName": "Isabel",
        "lastName": "Cruz"
      }
    },
    {
      "id": 1,
      "code": "202411001",
      "reservationDate": "2025-11-12T13:00:00.000Z",
      "state": "completed",
      "totalPrice": 180,
      "services": [
        {
          "id": 1,
          "title": "Cambio de aceite",
          "description": "Cambio de aceite del motor con filtro incluido",
          "price": 180
        }
      ],
      "mechanic": {
        "id": 1,
        "firstName": "Roberto",
        "lastName": "Pérez"
      }
    }
  ],
  "summary": {
    "total": 2,
    "completed": 1,
    "pending": 1,
    "inProgress": 0,
    "totalSpent": 180
  }
}
```
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
  ```js
  {
  "client": {
    "code": 1001,
    "name": "Carlos",
    "lastname": "Rodriguez"
  },
  "vehicles": [
    {
      "relationId": 1,
      "isPrimary": true,
      "isActive": true,
      "addedDate": "2024-10-01T12:00:00.000Z",
      "updatedAt": "2025-11-12T21:28:46.336Z",
      "notes": "Toyota Corolla 2020 - Vehículo principal",
      "vehicle": {
        "id": 1,
        "board": "ABC123",
        "model": "Corolla",
        "brand": "Toyota",
        "year": 2020
      }
    },
    {
      "relationId": 6,
      "isPrimary": false,
      "isActive": true,
      "addedDate": "2024-10-15T20:30:00.000Z",
      "updatedAt": "2025-11-12T21:28:46.336Z",
      "notes": "Volkswagen Golf 2020 - Segundo vehículo familiar",
      "vehicle": {
        "id": 6,
        "board": "MNO345",
        "model": "Golf",
        "brand": "Volkswagen",
        "year": 2020
      }
    }
  ],
  "summary": {
    "total": 2,
    "active": 2,
    "inactive": 0,
    "primaryVehicle": {
      "id": 1,
      "clientCode": 1001,
      "vehicleId": 1,
      "vehicle": {
        "id": 1,
        "board": "ABC123",
        "model": "Corolla",
        "brand": "Toyota",
        "year": 2020
      },
      "isPrimary": true,
      "notes": "Toyota Corolla 2020 - Vehículo principal",
      "isActive": true,
      "addedDate": "2024-10-01T12:00:00.000Z",
      "updatedAt": "2025-11-12T21:28:46.336Z"
    }
  }
  }
  ```

  - `404`: Cliente no encontrado 
  ```js
  null
  ```

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
- **Body**: 
```json
[
  {
    "id": 1,
    "board": "ABC123",
    "model": "Corolla",
    "brand": "Toyota",
    "year": 2020
  },
  {
    "id": 2,
    "board": "XYZ789",
    "model": "Civic",
    "brand": "Honda",
    "year": 2019
  },
  {
    "id": 3,
    "board": "DEF456",
    "model": "Aveo",
    "brand": "Chevrolet",
    "year": 2021
  },
  {
    "id": 4,
    "board": "GHI789",
    "model": "Focus",
    "brand": "Ford",
    "year": 2018
  },
  {
    "id": 5,
    "board": "JKL012",
    "model": "Sentra",
    "brand": "Nissan",
    "year": 2022
  },
  {
    "id": 6,
    "board": "MNO345",
    "model": "Golf",
    "brand": "Volkswagen",
    "year": 2020
  },
  {
    "id": 7,
    "board": "PQR678",
    "model": "Accent",
    "brand": "Hyundai",
    "year": 2019
  },
  {
    "id": 8,
    "board": "STU901",
    "model": "Camry",
    "brand": "Toyota",
    "year": 2023
  },
  {
    "id": 9,
    "board": "VWX234",
    "model": "Altima",
    "brand": "Nissan",
    "year": 2021
  },
  {
    "id": 10,
    "board": "YZA567",
    "model": "Mazda3",
    "brand": "Mazda",
    "year": 2020
  },
  {
    "id": 11,
    "board": "BCD890",
    "model": "Cruze",
    "brand": "Chevrolet",
    "year": 2019
  },
  {
    "id": 12,
    "board": "EFG123",
    "model": "Jetta",
    "brand": "Volkswagen",
    "year": 2022
  }
]
```
- **Respuesta**: `200` - Array de vehículos

### Obtener Vehículo por ID

- **Endpoint**: `GET /api/v1/vehicle/{id}`
- **Descripción**: Obtener vehículo específico por ID
- **Parámetros**:
  - `id` (path): ID del vehículo
- **Body**: 
```json
{
  "id": 1,
  "board": "ABC123",
  "model": "Corolla",
  "brand": "Toyota",
  "year": 2020
}
```
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
- **Body**: 
```json
[
  {
    "id": 1,
    "code": 101,
    "title": "Cambio de aceite",
    "description": "Cambio de aceite del motor con filtro incluido",
    "price": 180
  },
  {
    "id": 2,
    "code": 102,
    "title": "Revisión de frenos",
    "description": "Inspección completa del sistema de frenos",
    "price": 250
  },
  {
    "id": 3,
    "code": 103,
    "title": "Alineación y balanceado",
    "description": "Alineación de ruedas y balanceado de neumáticos",
    "price": 220
  },
  {
    "id": 4,
    "code": 104,
    "title": "Cambio de filtro de aire",
    "description": "Reemplazo del filtro de aire del motor",
    "price": 95
  },
  {
    "id": 5,
    "code": 105,
    "title": "Revisión eléctrica",
    "description": "Diagnóstico completo del sistema eléctrico",
    "price": 320
  },
  {
    "id": 6,
    "code": 106,
    "title": "Cambio de bujías",
    "description": "Reemplazo de bujías de encendido",
    "price": 150
  },
  {
    "id": 7,
    "code": 107,
    "title": "Lavado completo",
    "description": "Lavado exterior e interior del vehículo",
    "price": 80
  },
  {
    "id": 8,
    "code": 108,
    "title": "Cambio de batería",
    "description": "Reemplazo de batería del vehículo",
    "price": 450
  },
  {
    "id": 9,
    "code": 109,
    "title": "Revisión de suspensión",
    "description": "Diagnóstico y ajuste del sistema de suspensión",
    "price": 380
  },
  {
    "id": 10,
    "code": 110,
    "title": "Cambio de aceite de transmisión",
    "description": "Cambio de aceite de la caja de cambios",
    "price": 280
  },
  {
    "id": 11,
    "code": 111,
    "title": "Rectificación de frenos",
    "description": "Rectificado de discos y tambores de freno",
    "price": 320
  },
  {
    "id": 12,
    "code": 112,
    "title": "Diagnóstico computarizado",
    "description": "Escaneo completo con equipo de diagnóstico",
    "price": 200
  }
]
```
- **Respuesta**: `200` - Array de servicios

### Obtener Servicio por ID

- **Endpoint**: `GET /api/v1/service/{id}`
- **Descripción**: Obtener servicio específico por ID
- **Parámetros**:
  - `id` (path): ID del servicio
- **Body**: 
```json
{
  "id": 1,
  "code": 101,
  "title": "Cambio de aceite",
  "description": "Cambio de aceite del motor con filtro incluido",
  "price": 180
}
```
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
  "hourlyRate": 45.0,
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

- **Endpoint**: `GET /api/v1/mechanic`
- **Descripción**: Obtener lista completa de mecánicos
- **Body**: 
```json
[
  {
    "id": 1,
    "employeeCode": "MECH001",
    "firstName": "Roberto",
    "lastName": "Pérez",
    "phone": "71234567",
    "type": "mechanic",
    "hireDate": "2022-01-15",
    "yearsExperience": 3,
    "experienceLevel": "senior",
    "status": "active",
    "specialties": [
      "engine",
      "transmission",
      "general"
    ],
    "hourlyRate": "85.50",
    "workScheduleStart": "08:00:00",
    "workScheduleEnd": "17:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "reservations": [
      {
        "id": 5,
        "code": "202411005",
        "reservationDate": "2025-11-12T20:00:00.000Z",
        "totalPrice": 150,
        "state": "pending",
        "createdAt": "2025-11-14T18:26:02.078Z",
        "updatedAt": "2025-11-14T18:26:02.078Z"
      },
      {
        "id": 1,
        "code": "202411001",
        "reservationDate": "2025-11-12T13:00:00.000Z",
        "totalPrice": 180,
        "state": "completed",
        "createdAt": "2025-11-14T18:26:02.078Z",
        "updatedAt": "2025-11-14T18:26:02.078Z"
      }
    ],
    "orders": [
      {
        "id": 1,
        "code": "ORD-20251112-001",
        "status": "completed",
        "diagnosis": "Aceite viejo y filtro obstruido",
        "workDescription": "Se realizó cambio de aceite 5W-30 sintético y reemplazo de filtro de aceite marca OEM",
        "startDate": "2025-11-12T13:30:00.000Z",
        "completionDate": "2025-11-12T14:30:00.000Z",
        "clientNitCi": "12345678",
        "clientName": "Carlos Rodriguez",
        "clientEmail": "carlos.rodriguez@mecanix.com",
        "subtotal": "159.29",
        "taxAmount": "20.71",
        "totalCost": "180.00",
        "paymentMethod": "cash",
        "invoiceNumber": "FAC-001-2025",
        "createdAt": "2025-11-14T18:26:06.513Z",
        "updatedAt": "2025-11-14T18:26:06.513Z"
      },
      {
        "id": 5,
        "code": "ORD-20251112-005",
        "status": "pending",
        "diagnosis": null,
        "workDescription": null,
        "startDate": null,
        "completionDate": null,
        "clientNitCi": "33445566",
        "clientName": "Luis Fernández",
        "clientEmail": "luis.fernandez@mecanix.com",
        "subtotal": "132.74",
        "taxAmount": "17.26",
        "totalCost": "150.00",
        "paymentMethod": "cash",
        "invoiceNumber": null,
        "createdAt": "2025-11-14T18:26:06.513Z",
        "updatedAt": "2025-11-14T18:26:06.513Z"
      }
    ],
    "services": [
      {
        "id": 1,
        "code": 101,
        "title": "Cambio de aceite",
        "description": "Cambio de aceite del motor con filtro incluido",
        "price": 180
      },
      {
        "id": 4,
        "code": 104,
        "title": "Cambio de filtro de aire",
        "description": "Reemplazo del filtro de aire del motor",
        "price": 95
      },
      {
        "id": 6,
        "code": 106,
        "title": "Cambio de bujías",
        "description": "Reemplazo de bujías de encendido",
        "price": 150
      },
      {
        "id": 10,
        "code": 110,
        "title": "Cambio de aceite de transmisión",
        "description": "Cambio de aceite de la caja de cambios",
        "price": 280
      },
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ]
  },
  {
    "id": 2,
    "employeeCode": "MECH002",
    "firstName": "Sofía",
    "lastName": "Ramírez",
    "phone": "72345678",
    "type": "mechanic",
    "hireDate": "2023-03-20",
    "yearsExperience": 2,
    "experienceLevel": "junior",
    "status": "active",
    "specialties": [
      "electrical",
      "brakes",
      "diagnostics"
    ],
    "hourlyRate": "65.00",
    "workScheduleStart": "08:00:00",
    "workScheduleEnd": "17:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "reservations": [
      {
        "id": 6,
        "code": "202411006",
        "reservationDate": "2025-11-13T13:30:00.000Z",
        "totalPrice": 320,
        "state": "pending",
        "createdAt": "2025-11-14T18:26:02.078Z",
        "updatedAt": "2025-11-14T18:26:02.078Z"
      },
      {
        "id": 2,
        "code": "202411002",
        "reservationDate": "2025-11-12T14:30:00.000Z",
        "totalPrice": 570,
        "state": "completed",
        "createdAt": "2025-11-14T18:26:02.078Z",
        "updatedAt": "2025-11-14T18:26:02.078Z"
      }
    ],
    "orders": [
      {
        "id": 2,
        "code": "ORD-20251112-002",
        "status": "completed",
        "diagnosis": "Pastillas de freno desgastadas al 80% y líquido de frenos contaminado. Sistema eléctrico presenta falla en alternador",
        "workDescription": "Cambio completo de pastillas delanteras y traseras, purga de líquido de frenos, reemplazo de alternador y revisión integral del sistema eléctrico",
        "startDate": "2025-11-12T15:00:00.000Z",
        "completionDate": "2025-11-12T20:00:00.000Z",
        "clientNitCi": "87654321",
        "clientName": "María González",
        "clientEmail": "maria.gonzalez@mecanix.com",
        "subtotal": "504.42",
        "taxAmount": "65.58",
        "totalCost": "570.00",
        "paymentMethod": "card",
        "invoiceNumber": "FAC-002-2025",
        "createdAt": "2025-11-14T18:26:06.513Z",
        "updatedAt": "2025-11-14T18:26:06.513Z"
      },
      {
        "id": 6,
        "code": "ORD-20251113-001",
        "status": "pending",
        "diagnosis": "Revisión rutinaria programada",
        "workDescription": "Mantenimiento preventivo sin reserva previa",
        "startDate": null,
        "completionDate": null,
        "clientNitCi": "66778899",
        "clientName": "Sofía Vargas",
        "clientEmail": "sofia.vargas@mecanix.com",
        "subtotal": "283.19",
        "taxAmount": "36.81",
        "totalCost": "320.00",
        "paymentMethod": "card",
        "invoiceNumber": null,
        "createdAt": "2025-11-14T18:26:06.513Z",
        "updatedAt": "2025-11-14T18:26:06.513Z"
      }
    ],
    "services": [
      {
        "id": 2,
        "code": 102,
        "title": "Revisión de frenos",
        "description": "Inspección completa del sistema de frenos",
        "price": 250
      },
      {
        "id": 5,
        "code": 105,
        "title": "Revisión eléctrica",
        "description": "Diagnóstico completo del sistema eléctrico",
        "price": 320
      },
      {
        "id": 8,
        "code": 108,
        "title": "Cambio de batería",
        "description": "Reemplazo de batería del vehículo",
        "price": 450
      },
      {
        "id": 11,
        "code": 111,
        "title": "Rectificación de frenos",
        "description": "Rectificado de discos y tambores de freno",
        "price": 320
      },
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ]
  }
]
```
- **Respuesta**: `200` - Array de mecánicos

### Estadísticas de Mecánicos

- **Endpoint**: `GET /api/v1/mechanic/statistics`
- **Descripción**: Obtener estadísticas generales de mecánicos
- **Body**: 
```json
{
  "total": 6,
  "active": 5,
  "inactive": 1,
  "byExperienceLevel": {
    "senior": 1,
    "junior": 2,
    "expert": 1,
    "trainee": 1,
    "master": 1
  },
  "bySpecialty": {
    "engine": 2,
    "transmission": 1,
    "general": 4,
    "electrical": 2,
    "brakes": 1,
    "diagnostics": 2,
    "suspension": 1,
    "air_conditioning": 1,
    "bodywork": 1,
    "painting": 1
  },
  "averageExperience": 3.33
}
```
- **Respuesta**: `200` - Objeto con estadísticas

### Mecánicos Disponibles

- **Endpoint**: `GET /api/v1/mechanic/available?date={fecha}`
- **Descripción**: Obtener mecánicos disponibles
- **Parámetros**:
  - `date` (query, opcional): Fecha en formato YYYY-MM-DD
- **Body**: 
```json
[
  {
    "id": 1,
    "employeeCode": "MECH001",
    "firstName": "Roberto",
    "lastName": "Pérez",
    "phone": "71234567",
    "type": "mechanic",
    "hireDate": "2022-01-15",
    "yearsExperience": 3,
    "experienceLevel": "senior",
    "status": "active",
    "specialties": [
      "engine",
      "transmission",
      "general"
    ],
    "hourlyRate": "85.50",
    "workScheduleStart": "08:00:00",
    "workScheduleEnd": "17:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "services": [
      {
        "id": 1,
        "code": 101,
        "title": "Cambio de aceite",
        "description": "Cambio de aceite del motor con filtro incluido",
        "price": 180
      },
      {
        "id": 4,
        "code": 104,
        "title": "Cambio de filtro de aire",
        "description": "Reemplazo del filtro de aire del motor",
        "price": 95
      },
      {
        "id": 6,
        "code": 106,
        "title": "Cambio de bujías",
        "description": "Reemplazo de bujías de encendido",
        "price": 150
      },
      {
        "id": 10,
        "code": 110,
        "title": "Cambio de aceite de transmisión",
        "description": "Cambio de aceite de la caja de cambios",
        "price": 280
      },
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ]
  },
  {
    "id": 2,
    "employeeCode": "MECH002",
    "firstName": "Sofía",
    "lastName": "Ramírez",
    "phone": "72345678",
    "type": "mechanic",
    "hireDate": "2023-03-20",
    "yearsExperience": 2,
    "experienceLevel": "junior",
    "status": "active",
    "specialties": [
      "electrical",
      "brakes",
      "diagnostics"
    ],
    "hourlyRate": "65.00",
    "workScheduleStart": "08:00:00",
    "workScheduleEnd": "17:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "services": [
      {
        "id": 2,
        "code": 102,
        "title": "Revisión de frenos",
        "description": "Inspección completa del sistema de frenos",
        "price": 250
      },
      {
        "id": 5,
        "code": 105,
        "title": "Revisión eléctrica",
        "description": "Diagnóstico completo del sistema eléctrico",
        "price": 320
      },
      {
        "id": 8,
        "code": 108,
        "title": "Cambio de batería",
        "description": "Reemplazo de batería del vehículo",
        "price": 450
      },
      {
        "id": 11,
        "code": 111,
        "title": "Rectificación de frenos",
        "description": "Rectificado de discos y tambores de freno",
        "price": 320
      },
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ]
  },
  {
    "id": 3,
    "employeeCode": "MECH003",
    "firstName": "Diego",
    "lastName": "Morales",
    "phone": "73456789",
    "type": "mechanic",
    "hireDate": "2021-06-10",
    "yearsExperience": 5,
    "experienceLevel": "expert",
    "status": "active",
    "specialties": [
      "suspension",
      "air_conditioning",
      "general"
    ],
    "hourlyRate": "125.00",
    "workScheduleStart": "09:00:00",
    "workScheduleEnd": "18:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "services": [
      {
        "id": 3,
        "code": 103,
        "title": "Alineación y balanceado",
        "description": "Alineación de ruedas y balanceado de neumáticos",
        "price": 220
      },
      {
        "id": 9,
        "code": 109,
        "title": "Revisión de suspensión",
        "description": "Diagnóstico y ajuste del sistema de suspensión",
        "price": 380
      },
      {
        "id": 7,
        "code": 107,
        "title": "Lavado completo",
        "description": "Lavado exterior e interior del vehículo",
        "price": 80
      },
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ]
  },
  {
    "id": 5,
    "employeeCode": "MECH005",
    "firstName": "Miguel",
    "lastName": "Torres",
    "phone": "75678901",
    "type": "mechanic",
    "hireDate": "2020-11-25",
    "yearsExperience": 8,
    "experienceLevel": "master",
    "status": "active",
    "specialties": [
      "diagnostics",
      "bodywork",
      "painting",
      "engine"
    ],
    "hourlyRate": "180.00",
    "workScheduleStart": "07:00:00",
    "workScheduleEnd": "16:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "services": [
      {
        "id": 1,
        "code": 101,
        "title": "Cambio de aceite",
        "description": "Cambio de aceite del motor con filtro incluido",
        "price": 180
      },
      {
        "id": 2,
        "code": 102,
        "title": "Revisión de frenos",
        "description": "Inspección completa del sistema de frenos",
        "price": 250
      },
      {
        "id": 3,
        "code": 103,
        "title": "Alineación y balanceado",
        "description": "Alineación de ruedas y balanceado de neumáticos",
        "price": 220
      },
      {
        "id": 5,
        "code": 105,
        "title": "Revisión eléctrica",
        "description": "Diagnóstico completo del sistema eléctrico",
        "price": 320
      },
      {
        "id": 8,
        "code": 108,
        "title": "Cambio de batería",
        "description": "Reemplazo de batería del vehículo",
        "price": 450
      },
      {
        "id": 9,
        "code": 109,
        "title": "Revisión de suspensión",
        "description": "Diagnóstico y ajuste del sistema de suspensión",
        "price": 380
      },
      {
        "id": 10,
        "code": 110,
        "title": "Cambio de aceite de transmisión",
        "description": "Cambio de aceite de la caja de cambios",
        "price": 280
      },
      {
        "id": 11,
        "code": 111,
        "title": "Rectificación de frenos",
        "description": "Rectificado de discos y tambores de freno",
        "price": 320
      },
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ]
  },
  {
    "id": 6,
    "employeeCode": "MECH006",
    "firstName": "Isabel",
    "lastName": "Cruz",
    "phone": "76789012",
    "type": "mechanic",
    "hireDate": "2024-02-10",
    "yearsExperience": 1,
    "experienceLevel": "junior",
    "status": "active",
    "specialties": [
      "electrical",
      "general"
    ],
    "hourlyRate": "58.00",
    "workScheduleStart": "08:30:00",
    "workScheduleEnd": "17:30:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "services": [
      {
        "id": 5,
        "code": 105,
        "title": "Revisión eléctrica",
        "description": "Diagnóstico completo del sistema eléctrico",
        "price": 320
      },
      {
        "id": 8,
        "code": 108,
        "title": "Cambio de batería",
        "description": "Reemplazo de batería del vehículo",
        "price": 450
      },
      {
        "id": 7,
        "code": 107,
        "title": "Lavado completo",
        "description": "Lavado exterior e interior del vehículo",
        "price": 80
      },
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ]
  }
]
```
- **Respuesta**: `200` - Array de mecánicos disponibles

### Buscar por Especialidad

- **Endpoint**: `GET /api/v1/mechanic/specialty/{specialty}`
- **Descripción**: Buscar mecánicos por especialidad
- **Parámetros**:
  - `specialty` (path): Especialidad del mecánico
  - specialty: `engine`, `transmission`, `general`, `electrical`, `brakes`, `diagnostics`, `suspension`, `air_conditioning`, `bodywork`, `painting`
- **Body**: 
```json
[
  {
    "id": 1,
    "employeeCode": "MECH001",
    "firstName": "Roberto",
    "lastName": "Pérez",
    "phone": "71234567",
    "type": "mechanic",
    "hireDate": "2022-01-15",
    "yearsExperience": 3,
    "experienceLevel": "senior",
    "status": "active",
    "specialties": [
      "engine",
      "transmission",
      "general"
    ],
    "hourlyRate": "85.50",
    "workScheduleStart": "08:00:00",
    "workScheduleEnd": "17:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "services": [
      {
        "id": 1,
        "code": 101,
        "title": "Cambio de aceite",
        "description": "Cambio de aceite del motor con filtro incluido",
        "price": 180
      },
      {
        "id": 4,
        "code": 104,
        "title": "Cambio de filtro de aire",
        "description": "Reemplazo del filtro de aire del motor",
        "price": 95
      },
      {
        "id": 6,
        "code": 106,
        "title": "Cambio de bujías",
        "description": "Reemplazo de bujías de encendido",
        "price": 150
      },
      {
        "id": 10,
        "code": 110,
        "title": "Cambio de aceite de transmisión",
        "description": "Cambio de aceite de la caja de cambios",
        "price": 280
      },
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ]
  },
  {
    "id": 5,
    "employeeCode": "MECH005",
    "firstName": "Miguel",
    "lastName": "Torres",
    "phone": "75678901",
    "type": "mechanic",
    "hireDate": "2020-11-25",
    "yearsExperience": 8,
    "experienceLevel": "master",
    "status": "active",
    "specialties": [
      "diagnostics",
      "bodywork",
      "painting",
      "engine"
    ],
    "hourlyRate": "180.00",
    "workScheduleStart": "07:00:00",
    "workScheduleEnd": "16:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "services": [
      {
        "id": 1,
        "code": 101,
        "title": "Cambio de aceite",
        "description": "Cambio de aceite del motor con filtro incluido",
        "price": 180
      },
      {
        "id": 2,
        "code": 102,
        "title": "Revisión de frenos",
        "description": "Inspección completa del sistema de frenos",
        "price": 250
      },
      {
        "id": 3,
        "code": 103,
        "title": "Alineación y balanceado",
        "description": "Alineación de ruedas y balanceado de neumáticos",
        "price": 220
      },
      {
        "id": 5,
        "code": 105,
        "title": "Revisión eléctrica",
        "description": "Diagnóstico completo del sistema eléctrico",
        "price": 320
      },
      {
        "id": 8,
        "code": 108,
        "title": "Cambio de batería",
        "description": "Reemplazo de batería del vehículo",
        "price": 450
      },
      {
        "id": 9,
        "code": 109,
        "title": "Revisión de suspensión",
        "description": "Diagnóstico y ajuste del sistema de suspensión",
        "price": 380
      },
      {
        "id": 10,
        "code": 110,
        "title": "Cambio de aceite de transmisión",
        "description": "Cambio de aceite de la caja de cambios",
        "price": 280
      },
      {
        "id": 11,
        "code": 111,
        "title": "Rectificación de frenos",
        "description": "Rectificado de discos y tambores de freno",
        "price": 320
      },
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ]
  }
]
```
- **Respuesta**: `200` - Array de mecánicos con esa especialidad

### Buscar por Nivel de Experiencia

- **Endpoint**: `GET /api/v1/mechanic/experience/{level}`
- **Descripción**: Buscar mecánicos por nivel de experiencia
- **Parámetros**:
  - `level` (path): Nivel de experiencia (`trainee`, `junior`, `senior`, `expert`, `master`)
- **Body**: 
```json
[
  {
    "id": 4,
    "employeeCode": "MECH004",
    "firstName": "Carmen",
    "lastName": "Vargas",
    "phone": "74567890",
    "type": "mechanic",
    "hireDate": "2023-08-01",
    "yearsExperience": 1,
    "experienceLevel": "trainee",
    "status": "busy",
    "specialties": [
      "general"
    ],
    "hourlyRate": "45.00",
    "workScheduleStart": "08:00:00",
    "workScheduleEnd": "16:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "services": [
      {
        "id": 7,
        "code": 107,
        "title": "Lavado completo",
        "description": "Lavado exterior e interior del vehículo",
        "price": 80
      },
      {
        "id": 4,
        "code": 104,
        "title": "Cambio de filtro de aire",
        "description": "Reemplazo del filtro de aire del motor",
        "price": 95
      }
    ]
  }
]
```
- **Respuesta**: `200` - Array de mecánicos

### Buscar por Día de Trabajo

- **Endpoint**: `GET /api/v1/mechanic/workday/{day}`
- **Descripción**: Buscar mecánicos que trabajen un día específico
- **Parámetros**:
  - `day` (path): Día de la semana en inglés (Monday, Tuesday, etc.)
  - day: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`
- **Body**: 
```json
[
  {
    "id": 1,
    "employeeCode": "MECH001",
    "firstName": "Roberto",
    "lastName": "Pérez",
    "phone": "71234567",
    "type": "mechanic",
    "hireDate": "2022-01-15",
    "yearsExperience": 3,
    "experienceLevel": "senior",
    "status": "active",
    "specialties": [
      "engine",
      "transmission",
      "general"
    ],
    "hourlyRate": "85.50",
    "workScheduleStart": "08:00:00",
    "workScheduleEnd": "17:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z"
  },
  {
    "id": 2,
    "employeeCode": "MECH002",
    "firstName": "Sofía",
    "lastName": "Ramírez",
    "phone": "72345678",
    "type": "mechanic",
    "hireDate": "2023-03-20",
    "yearsExperience": 2,
    "experienceLevel": "junior",
    "status": "active",
    "specialties": [
      "electrical",
      "brakes",
      "diagnostics"
    ],
    "hourlyRate": "65.00",
    "workScheduleStart": "08:00:00",
    "workScheduleEnd": "17:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z"
  },
  {
    "id": 3,
    "employeeCode": "MECH003",
    "firstName": "Diego",
    "lastName": "Morales",
    "phone": "73456789",
    "type": "mechanic",
    "hireDate": "2021-06-10",
    "yearsExperience": 5,
    "experienceLevel": "expert",
    "status": "active",
    "specialties": [
      "suspension",
      "air_conditioning",
      "general"
    ],
    "hourlyRate": "125.00",
    "workScheduleStart": "09:00:00",
    "workScheduleEnd": "18:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z"
  },
  {
    "id": 5,
    "employeeCode": "MECH005",
    "firstName": "Miguel",
    "lastName": "Torres",
    "phone": "75678901",
    "type": "mechanic",
    "hireDate": "2020-11-25",
    "yearsExperience": 8,
    "experienceLevel": "master",
    "status": "active",
    "specialties": [
      "diagnostics",
      "bodywork",
      "painting",
      "engine"
    ],
    "hourlyRate": "180.00",
    "workScheduleStart": "07:00:00",
    "workScheduleEnd": "16:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z"
  },
  {
    "id": 6,
    "employeeCode": "MECH006",
    "firstName": "Isabel",
    "lastName": "Cruz",
    "phone": "76789012",
    "type": "mechanic",
    "hireDate": "2024-02-10",
    "yearsExperience": 1,
    "experienceLevel": "junior",
    "status": "active",
    "specialties": [
      "electrical",
      "general"
    ],
    "hourlyRate": "58.00",
    "workScheduleStart": "08:30:00",
    "workScheduleEnd": "17:30:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z"
  }
]
```
- **Respuesta**: `200` - Array de mecánicos

### Búsqueda General

- **Endpoint**: `GET /api/v1/mechanic/search?term={término}`
- **Descripción**: Búsqueda general de mecánicos
- **Parámetros**:
  - `term` (query): Término de búsqueda (nombre, apellido, código de empleado)
- **Body**: 
```json
[
  {
    "id": 1,
    "employeeCode": "MECH001",
    "firstName": "Roberto",
    "lastName": "Pérez",
    "phone": "71234567",
    "type": "mechanic",
    "hireDate": "2022-01-15",
    "yearsExperience": 3,
    "experienceLevel": "senior",
    "status": "active",
    "specialties": [
      "engine",
      "transmission",
      "general"
    ],
    "hourlyRate": "85.50",
    "workScheduleStart": "08:00:00",
    "workScheduleEnd": "17:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "services": [
      {
        "id": 1,
        "code": 101,
        "title": "Cambio de aceite",
        "description": "Cambio de aceite del motor con filtro incluido",
        "price": 180
      },
      {
        "id": 4,
        "code": 104,
        "title": "Cambio de filtro de aire",
        "description": "Reemplazo del filtro de aire del motor",
        "price": 95
      },
      {
        "id": 6,
        "code": 106,
        "title": "Cambio de bujías",
        "description": "Reemplazo de bujías de encendido",
        "price": 150
      },
      {
        "id": 10,
        "code": 110,
        "title": "Cambio de aceite de transmisión",
        "description": "Cambio de aceite de la caja de cambios",
        "price": 280
      },
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ]
  }
]
```
- **Respuesta**: `200` - Array de mecánicos coincidentes

### Horario de Mecánico

- **Endpoint**: `GET /api/v1/mechanic/{code}/schedule`
- **Descripción**: Obtener horario de trabajo de un mecánico
- **Parámetros**:
  - `code` (path): Código de empleado
- **Body**: 
```json
{
  "mechanic": {
    "id": 1,
    "employeeCode": "MECH001",
    "firstName": "Roberto",
    "lastName": "Pérez",
    "phone": "71234567",
    "type": "mechanic",
    "hireDate": "2022-01-15",
    "yearsExperience": 3,
    "experienceLevel": "senior",
    "status": "active",
    "specialties": [
      "engine",
      "transmission",
      "general"
    ],
    "hourlyRate": "85.50",
    "workScheduleStart": "08:00:00",
    "workScheduleEnd": "17:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z",
    "reservations": [
      {
        "id": 1,
        "code": "202411001",
        "reservationDate": "2025-11-12T13:00:00.000Z",
        "totalPrice": 180,
        "state": "completed",
        "createdAt": "2025-11-14T18:26:02.078Z",
        "updatedAt": "2025-11-14T18:26:02.078Z"
      },
      {
        "id": 5,
        "code": "202411005",
        "reservationDate": "2025-11-12T20:00:00.000Z",
        "totalPrice": 150,
        "state": "pending",
        "createdAt": "2025-11-14T18:26:02.078Z",
        "updatedAt": "2025-11-14T18:26:02.078Z"
      }
    ],
    "orders": [
      {
        "id": 1,
        "code": "ORD-20251112-001",
        "status": "completed",
        "diagnosis": "Aceite viejo y filtro obstruido",
        "workDescription": "Se realizó cambio de aceite 5W-30 sintético y reemplazo de filtro de aceite marca OEM",
        "startDate": "2025-11-12T13:30:00.000Z",
        "completionDate": "2025-11-12T14:30:00.000Z",
        "clientNitCi": "12345678",
        "clientName": "Carlos Rodriguez",
        "clientEmail": "carlos.rodriguez@mecanix.com",
        "subtotal": "159.29",
        "taxAmount": "20.71",
        "totalCost": "180.00",
        "paymentMethod": "cash",
        "invoiceNumber": "FAC-001-2025",
        "createdAt": "2025-11-14T18:26:06.513Z",
        "updatedAt": "2025-11-14T18:26:06.513Z"
      },
      {
        "id": 5,
        "code": "ORD-20251112-005",
        "status": "pending",
        "diagnosis": null,
        "workDescription": null,
        "startDate": null,
        "completionDate": null,
        "clientNitCi": "33445566",
        "clientName": "Luis Fernández",
        "clientEmail": "luis.fernandez@mecanix.com",
        "subtotal": "132.74",
        "taxAmount": "17.26",
        "totalCost": "150.00",
        "paymentMethod": "cash",
        "invoiceNumber": null,
        "createdAt": "2025-11-14T18:26:06.513Z",
        "updatedAt": "2025-11-14T18:26:06.513Z"
      }
    ],
    "services": [
      {
        "id": 1,
        "code": 101,
        "title": "Cambio de aceite",
        "description": "Cambio de aceite del motor con filtro incluido",
        "price": 180
      },
      {
        "id": 4,
        "code": 104,
        "title": "Cambio de filtro de aire",
        "description": "Reemplazo del filtro de aire del motor",
        "price": 95
      },
      {
        "id": 6,
        "code": 106,
        "title": "Cambio de bujías",
        "description": "Reemplazo de bujías de encendido",
        "price": 150
      },
      {
        "id": 10,
        "code": 110,
        "title": "Cambio de aceite de transmisión",
        "description": "Cambio de aceite de la caja de cambios",
        "price": 280
      },
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ]
  },
  "schedule": {
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "startTime": "08:00:00",
    "endTime": "17:00:00",
    "totalHours": 9
  }
}
```
- **Respuestas**:
  - `200`: Horario del mecánico
  - `404`: Mecánico no encontrado

### Obtener Mecánico por Código

- **Endpoint**: `GET /api/v1/mechanic/{code}`
- **Descripción**: Obtener mecánico específico por código
- **Parámetros**:
  - `code` (path): Código de empleado
- **Body**: 
```json
{
  "id": 1,
  "employeeCode": "MECH001",
  "firstName": "Roberto",
  "lastName": "Pérez",
  "phone": "71234567",
  "type": "mechanic",
  "hireDate": "2022-01-15",
  "yearsExperience": 3,
  "experienceLevel": "senior",
  "status": "active",
  "specialties": [
    "engine",
    "transmission",
    "general"
  ],
  "hourlyRate": "85.50",
  "workScheduleStart": "08:00:00",
  "workScheduleEnd": "17:00:00",
  "workDays": [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
  ],
  "isActive": true,
  "createdAt": "2025-11-14T18:25:52.645Z",
  "updatedAt": "2025-11-14T18:25:52.645Z",
  "reservations": [
    {
      "id": 1,
      "code": "202411001",
      "reservationDate": "2025-11-12T13:00:00.000Z",
      "totalPrice": 180,
      "state": "completed",
      "createdAt": "2025-11-14T18:26:02.078Z",
      "updatedAt": "2025-11-14T18:26:02.078Z"
    },
    {
      "id": 5,
      "code": "202411005",
      "reservationDate": "2025-11-12T20:00:00.000Z",
      "totalPrice": 150,
      "state": "pending",
      "createdAt": "2025-11-14T18:26:02.078Z",
      "updatedAt": "2025-11-14T18:26:02.078Z"
    }
  ],
  "orders": [
    {
      "id": 1,
      "code": "ORD-20251112-001",
      "status": "completed",
      "diagnosis": "Aceite viejo y filtro obstruido",
      "workDescription": "Se realizó cambio de aceite 5W-30 sintético y reemplazo de filtro de aceite marca OEM",
      "startDate": "2025-11-12T13:30:00.000Z",
      "completionDate": "2025-11-12T14:30:00.000Z",
      "clientNitCi": "12345678",
      "clientName": "Carlos Rodriguez",
      "clientEmail": "carlos.rodriguez@mecanix.com",
      "subtotal": "159.29",
      "taxAmount": "20.71",
      "totalCost": "180.00",
      "paymentMethod": "cash",
      "invoiceNumber": "FAC-001-2025",
      "createdAt": "2025-11-14T18:26:06.513Z",
      "updatedAt": "2025-11-14T18:26:06.513Z"
    },
    {
      "id": 5,
      "code": "ORD-20251112-005",
      "status": "pending",
      "diagnosis": null,
      "workDescription": null,
      "startDate": null,
      "completionDate": null,
      "clientNitCi": "33445566",
      "clientName": "Luis Fernández",
      "clientEmail": "luis.fernandez@mecanix.com",
      "subtotal": "132.74",
      "taxAmount": "17.26",
      "totalCost": "150.00",
      "paymentMethod": "cash",
      "invoiceNumber": null,
      "createdAt": "2025-11-14T18:26:06.513Z",
      "updatedAt": "2025-11-14T18:26:06.513Z"
    }
  ],
  "services": [
    {
      "id": 1,
      "code": 101,
      "title": "Cambio de aceite",
      "description": "Cambio de aceite del motor con filtro incluido",
      "price": 180
    },
    {
      "id": 4,
      "code": 104,
      "title": "Cambio de filtro de aire",
      "description": "Reemplazo del filtro de aire del motor",
      "price": 95
    },
    {
      "id": 6,
      "code": 106,
      "title": "Cambio de bujías",
      "description": "Reemplazo de bujías de encendido",
      "price": 150
    },
    {
      "id": 10,
      "code": 110,
      "title": "Cambio de aceite de transmisión",
      "description": "Cambio de aceite de la caja de cambios",
      "price": 280
    },
    {
      "id": 12,
      "code": 112,
      "title": "Diagnóstico computarizado",
      "description": "Escaneo completo con equipo de diagnóstico",
      "price": 200
    }
  ]
}
```
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
- **Descripción**: Eliminar un mecánico
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
- **Body**: 
```json
[
  {
    "id": 10,
    "clientCode": 1002,
    "vehicleId": 10,
    "client": {
      "id": 2,
      "code": 1002,
      "name": "María",
      "lastname": "González",
      "phone": "70234567",
      "ci": 87654321,
      "type": "client",
      "gender": "female",
      "email": "maria.gonzalez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-09T18:30:00.000Z",
      "address": "Calle Comercio #567, El Alto",
      "preferredContactMethod": "email",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "vehicle": {
      "id": 10,
      "board": "YZA567",
      "model": "Mazda3",
      "brand": "Mazda",
      "year": 2020
    },
    "isPrimary": false,
    "notes": "Mazda3 2020 - Vehículo deportivo",
    "isActive": true,
    "addedDate": "2024-11-01T18:15:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  },
  {
    "id": 9,
    "clientCode": 1008,
    "vehicleId": 9,
    "client": {
      "id": 8,
      "code": 1008,
      "name": "Carmen",
      "lastname": "Silva",
      "phone": "70890123",
      "ci": 88990011,
      "type": "client",
      "gender": "female",
      "email": null,
      "password": null,
      "emailVerified": false,
      "phoneVerified": false,
      "lastLogin": null,
      "address": "Achumani #999, Zona Sur",
      "preferredContactMethod": "phone",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "vehicle": {
      "id": 9,
      "board": "VWX234",
      "model": "Altima",
      "brand": "Nissan",
      "year": 2021
    },
    "isPrimary": true,
    "notes": "Nissan Altima 2021 - Para viajes largos",
    "isActive": true,
    "addedDate": "2024-10-28T16:00:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  },
  {
    "id": 8,
    "clientCode": 1007,
    "vehicleId": 8,
    "client": {
      "id": 7,
      "code": 1007,
      "name": "Ricardo",
      "lastname": "Moreno",
      "phone": "70789012",
      "ci": 77889900,
      "type": "client",
      "gender": "male",
      "email": "ricardo.moreno@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": false,
      "phoneVerified": true,
      "lastLogin": "2025-11-04T16:25:00.000Z",
      "address": "Obrajes #888, Zona Residencial",
      "preferredContactMethod": "phone",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "vehicle": {
      "id": 8,
      "board": "STU901",
      "model": "Camry",
      "brand": "Toyota",
      "year": 2023
    },
    "isPrimary": true,
    "notes": "Toyota Camry 2023 - Vehículo de lujo",
    "isActive": true,
    "addedDate": "2024-10-25T14:30:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  },
  {
    "id": 7,
    "clientCode": 1006,
    "vehicleId": 7,
    "client": {
      "id": 6,
      "code": 1006,
      "name": "Sofía",
      "lastname": "Vargas",
      "phone": "70678901",
      "ci": 66778899,
      "type": "client",
      "gender": "female",
      "email": "sofia.vargas@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-05T17:10:00.000Z",
      "address": "Villa Fátima #777, Zona Norte",
      "preferredContactMethod": "whatsapp",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "vehicle": {
      "id": 7,
      "board": "PQR678",
      "model": "Accent",
      "brand": "Hyundai",
      "year": 2019
    },
    "isPrimary": true,
    "notes": "Hyundai Accent 2019 - Económico y confiable",
    "isActive": true,
    "addedDate": "2024-10-20T13:00:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  },
  {
    "id": 6,
    "clientCode": 1001,
    "vehicleId": 6,
    "client": {
      "id": 1,
      "code": 1001,
      "name": "Carlos",
      "lastname": "Rodriguez",
      "phone": "70123456",
      "ci": 12345678,
      "type": "client",
      "gender": "male",
      "email": "carlos.rodriguez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-10T14:00:00.000Z",
      "address": "Av. 6 de Agosto #1234, La Paz",
      "preferredContactMethod": "phone",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "vehicle": {
      "id": 6,
      "board": "MNO345",
      "model": "Golf",
      "brand": "Volkswagen",
      "year": 2020
    },
    "isPrimary": false,
    "notes": "Volkswagen Golf 2020 - Segundo vehículo familiar",
    "isActive": true,
    "addedDate": "2024-10-15T20:30:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  },
  {
    "id": 5,
    "clientCode": 1005,
    "vehicleId": 5,
    "client": {
      "id": 5,
      "code": 1005,
      "name": "Luis",
      "lastname": "Fernández",
      "phone": "70567890",
      "ci": 33445566,
      "type": "client",
      "gender": "male",
      "email": "luis.fernandez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-06T15:20:00.000Z",
      "address": "Miraflores #654, Zona Centro",
      "preferredContactMethod": "email",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "vehicle": {
      "id": 5,
      "board": "JKL012",
      "model": "Sentra",
      "brand": "Nissan",
      "year": 2022
    },
    "isPrimary": true,
    "notes": "Nissan Sentra 2022 - Vehículo nuevo",
    "isActive": true,
    "addedDate": "2024-10-05T18:20:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  },
  {
    "id": 4,
    "clientCode": 1004,
    "vehicleId": 4,
    "client": {
      "id": 4,
      "code": 1004,
      "name": "Ana",
      "lastname": "López",
      "phone": "70456789",
      "ci": 55667788,
      "type": "client",
      "gender": "female",
      "email": "ana.lopez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": false,
      "lastLogin": "2025-11-07T20:45:00.000Z",
      "address": "Zona Sur, Calacoto #321",
      "preferredContactMethod": "phone",
      "isActive": false,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "vehicle": {
      "id": 4,
      "board": "GHI789",
      "model": "Focus",
      "brand": "Ford",
      "year": 2018
    },
    "isPrimary": true,
    "notes": "Ford Focus 2018 - Necesita mantenimiento",
    "isActive": true,
    "addedDate": "2024-10-04T15:45:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  },
  {
    "id": 3,
    "clientCode": 1003,
    "vehicleId": 3,
    "client": {
      "id": 3,
      "code": 1003,
      "name": "Pedro",
      "lastname": "Martínez",
      "phone": "70345678",
      "ci": 11223344,
      "type": "client",
      "gender": "male",
      "email": "pedro.martinez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": false,
      "phoneVerified": true,
      "lastLogin": "2025-11-08T13:15:00.000Z",
      "address": "Av. Arce #890, Sopocachi",
      "preferredContactMethod": "whatsapp",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "vehicle": {
      "id": 3,
      "board": "DEF456",
      "model": "Aveo",
      "brand": "Chevrolet",
      "year": 2021
    },
    "isPrimary": true,
    "notes": "Chevrolet Aveo 2021 - Para trabajo",
    "isActive": true,
    "addedDate": "2024-10-03T14:15:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  },
  {
    "id": 2,
    "clientCode": 1002,
    "vehicleId": 2,
    "client": {
      "id": 2,
      "code": 1002,
      "name": "María",
      "lastname": "González",
      "phone": "70234567",
      "ci": 87654321,
      "type": "client",
      "gender": "female",
      "email": "maria.gonzalez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-09T18:30:00.000Z",
      "address": "Calle Comercio #567, El Alto",
      "preferredContactMethod": "email",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "vehicle": {
      "id": 2,
      "board": "XYZ789",
      "model": "Civic",
      "brand": "Honda",
      "year": 2019
    },
    "isPrimary": true,
    "notes": "Honda Civic 2019 - Muy bien cuidado",
    "isActive": true,
    "addedDate": "2024-10-02T13:30:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  },
  {
    "id": 1,
    "clientCode": 1001,
    "vehicleId": 1,
    "client": {
      "id": 1,
      "code": 1001,
      "name": "Carlos",
      "lastname": "Rodriguez",
      "phone": "70123456",
      "ci": 12345678,
      "type": "client",
      "gender": "male",
      "email": "carlos.rodriguez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-10T14:00:00.000Z",
      "address": "Av. 6 de Agosto #1234, La Paz",
      "preferredContactMethod": "phone",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "vehicle": {
      "id": 1,
      "board": "ABC123",
      "model": "Corolla",
      "brand": "Toyota",
      "year": 2020
    },
    "isPrimary": true,
    "notes": "Toyota Corolla 2020 - Vehículo principal",
    "isActive": true,
    "addedDate": "2024-10-01T12:00:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  }
]
```
- **Respuesta**: `200` - Array de asociaciones

### Vehículos de un Cliente

- **Endpoint**: `GET /api/v1/client-vehicle/client/{clientCode}`
- **Descripción**: Obtener vehículos de un cliente específico
- **Parámetros**:
  - `clientCode` (path): Código del cliente
- **Body**: 
```json
[
  {
    "id": 1,
    "clientCode": 1001,
    "vehicleId": 1,
    "vehicle": {
      "id": 1,
      "board": "ABC123",
      "model": "Corolla",
      "brand": "Toyota",
      "year": 2020
    },
    "isPrimary": true,
    "notes": "Toyota Corolla 2020 - Vehículo principal",
    "isActive": true,
    "addedDate": "2024-10-01T12:00:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  },
  {
    "id": 6,
    "clientCode": 1001,
    "vehicleId": 6,
    "vehicle": {
      "id": 6,
      "board": "MNO345",
      "model": "Golf",
      "brand": "Volkswagen",
      "year": 2020
    },
    "isPrimary": false,
    "notes": "Volkswagen Golf 2020 - Segundo vehículo familiar",
    "isActive": true,
    "addedDate": "2024-10-15T20:30:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  }
]
```
- **Respuesta**: `200` - Array de vehículos del cliente

### Clientes de un Vehículo

- **Endpoint**: `GET /api/v1/client-vehicle/vehicle/{vehicleId}`
- **Descripción**: Obtener clientes asociados a un vehículo
- **Parámetros**:
  - `vehicleId` (path): ID del vehículo
- **Body**: 
```json
[
  {
    "id": 1,
    "clientCode": 1001,
    "vehicleId": 1,
    "client": {
      "id": 1,
      "code": 1001,
      "name": "Carlos",
      "lastname": "Rodriguez",
      "phone": "70123456",
      "ci": 12345678,
      "type": "client",
      "gender": "male",
      "email": "carlos.rodriguez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-10T14:00:00.000Z",
      "address": "Av. 6 de Agosto #1234, La Paz",
      "preferredContactMethod": "phone",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "isPrimary": true,
    "notes": "Toyota Corolla 2020 - Vehículo principal",
    "isActive": true,
    "addedDate": "2024-10-01T12:00:00.000Z",
    "updatedAt": "2025-11-14T18:25:59.968Z"
  }
]
```
- **Respuesta**: `200` - Array de clientes del vehículo

### Obtener Asociación por ID

- **Endpoint**: `GET /api/v1/client-vehicle/{id}`
- **Descripción**: Obtener asociación específica por ID
- **Parámetros**:
  - `id` (path): ID de la asociación
- **Body**: 
```json
{
  "id": 1,
  "clientCode": 1001,
  "vehicleId": 1,
  "client": {
    "id": 1,
    "code": 1001,
    "name": "Carlos",
    "lastname": "Rodriguez",
    "phone": "70123456",
    "ci": 12345678,
    "type": "client",
    "gender": "male",
    "email": "carlos.rodriguez@mecanix.com",
    "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "emailVerified": true,
    "phoneVerified": true,
    "lastLogin": "2025-11-10T14:00:00.000Z",
    "address": "Av. 6 de Agosto #1234, La Paz",
    "preferredContactMethod": "phone",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  "vehicle": {
    "id": 1,
    "board": "ABC123",
    "model": "Corolla",
    "brand": "Toyota",
    "year": 2020
  },
  "isPrimary": true,
  "notes": "Toyota Corolla 2020 - Vehículo principal",
  "isActive": true,
  "addedDate": "2024-10-01T12:00:00.000Z",
  "updatedAt": "2025-11-14T18:25:59.968Z"
}
```
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
- **Body**: 
```json
[
  {
    "id": 1,
    "code": "202411001",
    "reservationDate": "2025-11-12T13:00:00.000Z",
    "totalPrice": 180,
    "state": "completed",
    "client": {
      "id": 1,
      "code": 1001,
      "name": "Carlos",
      "lastname": "Rodriguez",
      "phone": "70123456",
      "ci": 12345678,
      "type": "client",
      "gender": "male",
      "email": "carlos.rodriguez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-10T14:00:00.000Z",
      "address": "Av. 6 de Agosto #1234, La Paz",
      "preferredContactMethod": "phone",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "mechanic": null,
    "services": [
      {
        "id": 1,
        "code": 101,
        "title": "Cambio de aceite",
        "description": "Cambio de aceite del motor con filtro incluido",
        "price": 180
      }
    ],
    "createdAt": "2025-11-14T18:26:02.078Z",
    "updatedAt": "2025-11-14T18:26:02.078Z"
  },
  {
    "id": 2,
    "code": "202411002",
    "reservationDate": "2025-11-12T14:30:00.000Z",
    "totalPrice": 570,
    "state": "completed",
    "client": {
      "id": 2,
      "code": 1002,
      "name": "María",
      "lastname": "González",
      "phone": "70234567",
      "ci": 87654321,
      "type": "client",
      "gender": "female",
      "email": "maria.gonzalez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-09T18:30:00.000Z",
      "address": "Calle Comercio #567, El Alto",
      "preferredContactMethod": "email",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "mechanic": {
      "id": 2,
      "employeeCode": "MECH002",
      "firstName": "Sofía",
      "lastName": "Ramírez",
      "phone": "72345678",
      "type": "mechanic",
      "hireDate": "2023-03-20",
      "yearsExperience": 2,
      "experienceLevel": "junior",
      "status": "active",
      "specialties": [
        "electrical",
        "brakes",
        "diagnostics"
      ],
      "hourlyRate": "65.00",
      "workScheduleStart": "08:00:00",
      "workScheduleEnd": "17:00:00",
      "workDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "isActive": true,
      "createdAt": "2025-11-14T18:25:52.645Z",
      "updatedAt": "2025-11-14T18:25:52.645Z"
    },
    "services": [
      {
        "id": 2,
        "code": 102,
        "title": "Revisión de frenos",
        "description": "Inspección completa del sistema de frenos",
        "price": 250
      },
      {
        "id": 5,
        "code": 105,
        "title": "Revisión eléctrica",
        "description": "Diagnóstico completo del sistema eléctrico",
        "price": 320
      }
    ],
    "createdAt": "2025-11-14T18:26:02.078Z",
    "updatedAt": "2025-11-14T18:26:02.078Z"
  },
  {
    "id": 3,
    "code": "202411003",
    "reservationDate": "2025-11-12T18:00:00.000Z",
    "totalPrice": 220,
    "state": "in_progress",
    "client": {
      "id": 3,
      "code": 1003,
      "name": "Pedro",
      "lastname": "Martínez",
      "phone": "70345678",
      "ci": 11223344,
      "type": "client",
      "gender": "male",
      "email": "pedro.martinez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": false,
      "phoneVerified": true,
      "lastLogin": "2025-11-08T13:15:00.000Z",
      "address": "Av. Arce #890, Sopocachi",
      "preferredContactMethod": "whatsapp",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "mechanic": {
      "id": 3,
      "employeeCode": "MECH003",
      "firstName": "Diego",
      "lastName": "Morales",
      "phone": "73456789",
      "type": "mechanic",
      "hireDate": "2021-06-10",
      "yearsExperience": 5,
      "experienceLevel": "expert",
      "status": "active",
      "specialties": [
        "suspension",
        "air_conditioning",
        "general"
      ],
      "hourlyRate": "125.00",
      "workScheduleStart": "09:00:00",
      "workScheduleEnd": "18:00:00",
      "workDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "isActive": true,
      "createdAt": "2025-11-14T18:25:52.645Z",
      "updatedAt": "2025-11-14T18:25:52.645Z"
    },
    "services": [
      {
        "id": 3,
        "code": 103,
        "title": "Alineación y balanceado",
        "description": "Alineación de ruedas y balanceado de neumáticos",
        "price": 220
      }
    ],
    "createdAt": "2025-11-14T18:26:02.078Z",
    "updatedAt": "2025-11-14T18:26:02.078Z"
  },
  {
    "id": 4,
    "code": "202411004",
    "reservationDate": "2025-11-12T12:30:00.000Z",
    "totalPrice": 575,
    "state": "pending",
    "client": {
      "id": 4,
      "code": 1004,
      "name": "Ana",
      "lastname": "López",
      "phone": "70456789",
      "ci": 55667788,
      "type": "client",
      "gender": "female",
      "email": "ana.lopez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": false,
      "lastLogin": "2025-11-07T20:45:00.000Z",
      "address": "Zona Sur, Calacoto #321",
      "preferredContactMethod": "phone",
      "isActive": false,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "mechanic": {
      "id": 5,
      "employeeCode": "MECH005",
      "firstName": "Miguel",
      "lastName": "Torres",
      "phone": "75678901",
      "type": "mechanic",
      "hireDate": "2020-11-25",
      "yearsExperience": 8,
      "experienceLevel": "master",
      "status": "active",
      "specialties": [
        "diagnostics",
        "bodywork",
        "painting",
        "engine"
      ],
      "hourlyRate": "180.00",
      "workScheduleStart": "07:00:00",
      "workScheduleEnd": "16:00:00",
      "workDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "isActive": true,
      "createdAt": "2025-11-14T18:25:52.645Z",
      "updatedAt": "2025-11-14T18:25:52.645Z"
    },
    "services": [
      {
        "id": 1,
        "code": 101,
        "title": "Cambio de aceite",
        "description": "Cambio de aceite del motor con filtro incluido",
        "price": 180
      },
      {
        "id": 4,
        "code": 104,
        "title": "Cambio de filtro de aire",
        "description": "Reemplazo del filtro de aire del motor",
        "price": 95
      },
      {
        "id": 6,
        "code": 106,
        "title": "Cambio de bujías",
        "description": "Reemplazo de bujías de encendido",
        "price": 150
      },
      {
        "id": 7,
        "code": 107,
        "title": "Lavado completo",
        "description": "Lavado exterior e interior del vehículo",
        "price": 80
      }
    ],
    "createdAt": "2025-11-14T18:26:02.078Z",
    "updatedAt": "2025-11-14T18:26:02.078Z"
  },
  {
    "id": 5,
    "code": "202411005",
    "reservationDate": "2025-11-12T20:00:00.000Z",
    "totalPrice": 150,
    "state": "pending",
    "client": {
      "id": 5,
      "code": 1005,
      "name": "Luis",
      "lastname": "Fernández",
      "phone": "70567890",
      "ci": 33445566,
      "type": "client",
      "gender": "male",
      "email": "luis.fernandez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-06T15:20:00.000Z",
      "address": "Miraflores #654, Zona Centro",
      "preferredContactMethod": "email",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "mechanic": null,
    "services": [
      {
        "id": 6,
        "code": 106,
        "title": "Cambio de bujías",
        "description": "Reemplazo de bujías de encendido",
        "price": 150
      }
    ],
    "createdAt": "2025-11-14T18:26:02.078Z",
    "updatedAt": "2025-11-14T18:26:02.078Z"
  },
  {
    "id": 6,
    "code": "202411006",
    "reservationDate": "2025-11-13T13:30:00.000Z",
    "totalPrice": 320,
    "state": "pending",
    "client": {
      "id": 6,
      "code": 1006,
      "name": "Sofía",
      "lastname": "Vargas",
      "phone": "70678901",
      "ci": 66778899,
      "type": "client",
      "gender": "female",
      "email": "sofia.vargas@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-05T17:10:00.000Z",
      "address": "Villa Fátima #777, Zona Norte",
      "preferredContactMethod": "whatsapp",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "mechanic": {
      "id": 2,
      "employeeCode": "MECH002",
      "firstName": "Sofía",
      "lastName": "Ramírez",
      "phone": "72345678",
      "type": "mechanic",
      "hireDate": "2023-03-20",
      "yearsExperience": 2,
      "experienceLevel": "junior",
      "status": "active",
      "specialties": [
        "electrical",
        "brakes",
        "diagnostics"
      ],
      "hourlyRate": "65.00",
      "workScheduleStart": "08:00:00",
      "workScheduleEnd": "17:00:00",
      "workDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "isActive": true,
      "createdAt": "2025-11-14T18:25:52.645Z",
      "updatedAt": "2025-11-14T18:25:52.645Z"
    },
    "services": [
      {
        "id": 5,
        "code": 105,
        "title": "Revisión eléctrica",
        "description": "Diagnóstico completo del sistema eléctrico",
        "price": 320
      },
      {
        "id": 8,
        "code": 108,
        "title": "Cambio de batería",
        "description": "Reemplazo de batería del vehículo",
        "price": 450
      }
    ],
    "createdAt": "2025-11-14T18:26:02.078Z",
    "updatedAt": "2025-11-14T18:26:02.078Z"
  },
  {
    "id": 7,
    "code": "202411007",
    "reservationDate": "2025-11-13T15:00:00.000Z",
    "totalPrice": 380,
    "state": "pending",
    "client": {
      "id": 7,
      "code": 1007,
      "name": "Ricardo",
      "lastname": "Moreno",
      "phone": "70789012",
      "ci": 77889900,
      "type": "client",
      "gender": "male",
      "email": "ricardo.moreno@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": false,
      "phoneVerified": true,
      "lastLogin": "2025-11-04T16:25:00.000Z",
      "address": "Obrajes #888, Zona Residencial",
      "preferredContactMethod": "phone",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "mechanic": {
      "id": 3,
      "employeeCode": "MECH003",
      "firstName": "Diego",
      "lastName": "Morales",
      "phone": "73456789",
      "type": "mechanic",
      "hireDate": "2021-06-10",
      "yearsExperience": 5,
      "experienceLevel": "expert",
      "status": "active",
      "specialties": [
        "suspension",
        "air_conditioning",
        "general"
      ],
      "hourlyRate": "125.00",
      "workScheduleStart": "09:00:00",
      "workScheduleEnd": "18:00:00",
      "workDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "isActive": true,
      "createdAt": "2025-11-14T18:25:52.645Z",
      "updatedAt": "2025-11-14T18:25:52.645Z"
    },
    "services": [
      {
        "id": 9,
        "code": 109,
        "title": "Revisión de suspensión",
        "description": "Diagnóstico y ajuste del sistema de suspensión",
        "price": 380
      }
    ],
    "createdAt": "2025-11-14T18:26:02.078Z",
    "updatedAt": "2025-11-14T18:26:02.078Z"
  },
  {
    "id": 8,
    "code": "202411008",
    "reservationDate": "2025-11-13T19:30:00.000Z",
    "totalPrice": 200,
    "state": "pending",
    "client": null,
    "mechanic": {
      "id": 5,
      "employeeCode": "MECH005",
      "firstName": "Miguel",
      "lastName": "Torres",
      "phone": "75678901",
      "type": "mechanic",
      "hireDate": "2020-11-25",
      "yearsExperience": 8,
      "experienceLevel": "master",
      "status": "active",
      "specialties": [
        "diagnostics",
        "bodywork",
        "painting",
        "engine"
      ],
      "hourlyRate": "180.00",
      "workScheduleStart": "07:00:00",
      "workScheduleEnd": "16:00:00",
      "workDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "isActive": true,
      "createdAt": "2025-11-14T18:25:52.645Z",
      "updatedAt": "2025-11-14T18:25:52.645Z"
    },
    "services": [
      {
        "id": 12,
        "code": 112,
        "title": "Diagnóstico computarizado",
        "description": "Escaneo completo con equipo de diagnóstico",
        "price": 200
      }
    ],
    "createdAt": "2025-11-14T18:26:02.078Z",
    "updatedAt": "2025-11-14T18:26:02.078Z"
  },
  {
    "id": 9,
    "code": "202411009",
    "reservationDate": "2025-11-14T14:00:00.000Z",
    "totalPrice": 280,
    "state": "pending",
    "client": {
      "id": 8,
      "code": 1008,
      "name": "Carmen",
      "lastname": "Silva",
      "phone": "70890123",
      "ci": 88990011,
      "type": "client",
      "gender": "female",
      "email": null,
      "password": null,
      "emailVerified": false,
      "phoneVerified": false,
      "lastLogin": null,
      "address": "Achumani #999, Zona Sur",
      "preferredContactMethod": "phone",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "mechanic": null,
    "services": [
      {
        "id": 10,
        "code": 110,
        "title": "Cambio de aceite de transmisión",
        "description": "Cambio de aceite de la caja de cambios",
        "price": 280
      }
    ],
    "createdAt": "2025-11-14T18:26:02.078Z",
    "updatedAt": "2025-11-14T18:26:02.078Z"
  },
  {
    "id": 10,
    "code": "202411010",
    "reservationDate": "2025-11-14T17:00:00.000Z",
    "totalPrice": 450,
    "state": "pending",
    "client": {
      "id": 1,
      "code": 1001,
      "name": "Carlos",
      "lastname": "Rodriguez",
      "phone": "70123456",
      "ci": 12345678,
      "type": "client",
      "gender": "male",
      "email": "carlos.rodriguez@mecanix.com",
      "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      "emailVerified": true,
      "phoneVerified": true,
      "lastLogin": "2025-11-10T14:00:00.000Z",
      "address": "Av. 6 de Agosto #1234, La Paz",
      "preferredContactMethod": "phone",
      "isActive": true,
      "createdAt": "2025-11-14T18:25:31.198Z",
      "updatedAt": "2025-11-14T18:25:31.198Z"
    },
    "mechanic": {
      "id": 6,
      "employeeCode": "MECH006",
      "firstName": "Isabel",
      "lastName": "Cruz",
      "phone": "76789012",
      "type": "mechanic",
      "hireDate": "2024-02-10",
      "yearsExperience": 1,
      "experienceLevel": "junior",
      "status": "inactive",
      "specialties": [
        "electrical",
        "general"
      ],
      "hourlyRate": "58.00",
      "workScheduleStart": "08:30:00",
      "workScheduleEnd": "17:30:00",
      "workDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "isActive": false,
      "createdAt": "2025-11-14T18:25:52.645Z",
      "updatedAt": "2025-11-14T22:16:18.469Z"
    },
    "services": [
      {
        "id": 8,
        "code": 108,
        "title": "Cambio de batería",
        "description": "Reemplazo de batería del vehículo",
        "price": 450
      },
      {
        "id": 7,
        "code": 107,
        "title": "Lavado completo",
        "description": "Lavado exterior e interior del vehículo",
        "price": 80
      }
    ],
    "createdAt": "2025-11-14T18:26:02.078Z",
    "updatedAt": "2025-11-14T18:26:02.078Z"
  }
]
```
- **Respuesta**: `200` - Array de reservaciones

### Obtener Reservación por Código

- **Endpoint**: `GET /api/v1/reservate/{code}`
- **Descripción**: Obtener reservación específica por código
- **Parámetros**:
  - `code` (path): Código de la reservación
- **Body**: 
```json
{
  "id": 11,
  "code": "1763168606340",
  "reservationDate": "2002-04-25T10:00:00.000Z",
  "totalPrice": 650,
  "state": "pending",
  "client": {
    "id": 8,
    "code": 1008,
    "name": "Carmen",
    "lastname": "Silva",
    "phone": "70890123",
    "ci": 88990011,
    "type": "client",
    "gender": "female",
    "email": null,
    "password": null,
    "emailVerified": false,
    "phoneVerified": false,
    "lastLogin": null,
    "address": "Achumani #999, Zona Sur",
    "preferredContactMethod": "phone",
    "isActive": true,
    "createdAt": "2025-11-14T18:25:31.198Z",
    "updatedAt": "2025-11-14T18:25:31.198Z"
  },
  "mechanic": {
    "id": 2,
    "employeeCode": "MECH002",
    "firstName": "Sofía",
    "lastName": "Ramírez",
    "phone": "72345678",
    "type": "mechanic",
    "hireDate": "2023-03-20",
    "yearsExperience": 2,
    "experienceLevel": "junior",
    "status": "active",
    "specialties": [
      "electrical",
      "brakes",
      "diagnostics"
    ],
    "hourlyRate": "65.00",
    "workScheduleStart": "08:00:00",
    "workScheduleEnd": "17:00:00",
    "workDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "isActive": true,
    "createdAt": "2025-11-14T18:25:52.645Z",
    "updatedAt": "2025-11-14T18:25:52.645Z"
  },
  "services": [
    {
      "id": 1,
      "code": 101,
      "title": "Cambio de aceite",
      "description": "Cambio de aceite del motor con filtro incluido",
      "price": 180
    },
    {
      "id": 2,
      "code": 102,
      "title": "Revisión de frenos",
      "description": "Inspección completa del sistema de frenos",
      "price": 250
    },
    {
      "id": 3,
      "code": 103,
      "title": "Alineación y balanceado",
      "description": "Alineación de ruedas y balanceado de neumáticos",
      "price": 220
    }
  ],
  "createdAt": "2025-11-15T01:03:26.350Z",
  "updatedAt": "2025-11-15T01:03:26.350Z"
}
```
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
  "totalCost": 300.0,
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
- **Body**: 
```json
[
  {
    "id": 2,
    "code": "ORD-20251112-002",
    "reservate": {
      "id": 2,
      "code": "202411002",
      "reservationDate": "2025-11-12T14:30:00.000Z",
      "totalPrice": 570,
      "state": "completed",
      "createdAt": "2025-11-14T18:26:02.078Z",
      "updatedAt": "2025-11-14T18:26:02.078Z"
    },
    "vehicle": {
      "id": 2,
      "board": "XYZ789",
      "model": "Civic",
      "brand": "Honda",
      "year": 2019
    },
    "mechanic": {
      "id": 2,
      "employeeCode": "MECH002",
      "firstName": "Sofía",
      "lastName": "Ramírez",
      "phone": "72345678",
      "type": "mechanic",
      "hireDate": "2023-03-20",
      "yearsExperience": 2,
      "experienceLevel": "junior",
      "status": "active",
      "specialties": [
        "electrical",
        "brakes",
        "diagnostics"
      ],
      "hourlyRate": "65.00",
      "workScheduleStart": "08:00:00",
      "workScheduleEnd": "17:00:00",
      "workDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "isActive": true,
      "createdAt": "2025-11-14T18:25:52.645Z",
      "updatedAt": "2025-11-14T18:25:52.645Z"
    },
    "status": "completed",
    "diagnosis": "Pastillas de freno desgastadas al 80% y líquido de frenos contaminado. Sistema eléctrico presenta falla en alternador",
    "workDescription": "Cambio completo de pastillas delanteras y traseras, purga de líquido de frenos, reemplazo de alternador y revisión integral del sistema eléctrico",
    "startDate": "2025-11-12T15:00:00.000Z",
    "completionDate": "2025-11-12T20:00:00.000Z",
    "clientNitCi": "87654321",
    "clientName": "María González",
    "clientEmail": "maria.gonzalez@mecanix.com",
    "subtotal": "504.42",
    "taxAmount": "65.58",
    "totalCost": "570.00",
    "paymentMethod": "card",
    "invoiceNumber": "FAC-002-2025",
    "createdAt": "2025-11-14T18:26:06.513Z",
    "updatedAt": "2025-11-14T18:26:06.513Z"
  },
  {
    "id": 3,
    "code": "ORD-20251112-003",
    "reservate": {
      "id": 3,
      "code": "202411003",
      "reservationDate": "2025-11-12T18:00:00.000Z",
      "totalPrice": 220,
      "state": "in_progress",
      "createdAt": "2025-11-14T18:26:02.078Z",
      "updatedAt": "2025-11-14T18:26:02.078Z"
    },
    "vehicle": {
      "id": 3,
      "board": "DEF456",
      "model": "Aveo",
      "brand": "Chevrolet",
      "year": 2021
    },
    "mechanic": {
      "id": 3,
      "employeeCode": "MECH003",
      "firstName": "Diego",
      "lastName": "Morales",
      "phone": "73456789",
      "type": "mechanic",
      "hireDate": "2021-06-10",
      "yearsExperience": 5,
      "experienceLevel": "expert",
      "status": "active",
      "specialties": [
        "suspension",
        "air_conditioning",
        "general"
      ],
      "hourlyRate": "125.00",
      "workScheduleStart": "09:00:00",
      "workScheduleEnd": "18:00:00",
      "workDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "isActive": true,
      "createdAt": "2025-11-14T18:25:52.645Z",
      "updatedAt": "2025-11-14T18:25:52.645Z"
    },
    "status": "in_progress",
    "diagnosis": "Vehículo presenta vibración al frenar y jalón hacia la derecha",
    "workDescription": "Alineación de ruedas y balanceado en proceso, rectificación de discos si es necesaria",
    "startDate": "2025-11-12T18:30:00.000Z",
    "completionDate": null,
    "clientNitCi": "11223344",
    "clientName": "Pedro Martínez",
    "clientEmail": "pedro.martinez@mecanix.com",
    "subtotal": "194.69",
    "taxAmount": "25.31",
    "totalCost": "220.00",
    "paymentMethod": "transfer",
    "invoiceNumber": null,
    "createdAt": "2025-11-14T18:26:06.513Z",
    "updatedAt": "2025-11-14T18:26:06.513Z"
  },
  {
    "id": 4,
    "code": "ORD-20251112-004",
    "reservate": {
      "id": 4,
      "code": "202411004",
      "reservationDate": "2025-11-12T12:30:00.000Z",
      "totalPrice": 575,
      "state": "pending",
      "createdAt": "2025-11-14T18:26:02.078Z",
      "updatedAt": "2025-11-14T18:26:02.078Z"
    },
    "vehicle": {
      "id": 4,
      "board": "GHI789",
      "model": "Focus",
      "brand": "Ford",
      "year": 2018
    },
    "mechanic": {
      "id": 5,
      "employeeCode": "MECH005",
      "firstName": "Miguel",
      "lastName": "Torres",
      "phone": "75678901",
      "type": "mechanic",
      "hireDate": "2020-11-25",
      "yearsExperience": 8,
      "experienceLevel": "master",
      "status": "active",
      "specialties": [
        "diagnostics",
        "bodywork",
        "painting",
        "engine"
      ],
      "hourlyRate": "180.00",
      "workScheduleStart": "07:00:00",
      "workScheduleEnd": "16:00:00",
      "workDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "isActive": true,
      "createdAt": "2025-11-14T18:25:52.645Z",
      "updatedAt": "2025-11-14T18:25:52.645Z"
    },
    "status": "pending",
    "diagnosis": null,
    "workDescription": null,
    "startDate": null,
    "completionDate": null,
    "clientNitCi": "55667788",
    "clientName": "Ana López",
    "clientEmail": "ana.lopez@mecanix.com",
    "subtotal": "508.85",
    "taxAmount": "66.15",
    "totalCost": "575.00",
    "paymentMethod": "qr",
    "invoiceNumber": null,
    "createdAt": "2025-11-14T18:26:06.513Z",
    "updatedAt": "2025-11-14T18:26:06.513Z"
  },
  {
    "id": 7,
    "code": "ORD-20251113-002",
    "reservate": {
      "id": 7,
      "code": "202411007",
      "reservationDate": "2025-11-13T15:00:00.000Z",
      "totalPrice": 380,
      "state": "pending",
      "createdAt": "2025-11-14T18:26:02.078Z",
      "updatedAt": "2025-11-14T18:26:02.078Z"
    },
    "vehicle": {
      "id": 8,
      "board": "STU901",
      "model": "Camry",
      "brand": "Toyota",
      "year": 2023
    },
    "mechanic": null,
    "status": "pending",
    "diagnosis": null,
    "workDescription": null,
    "startDate": null,
    "completionDate": null,
    "clientNitCi": "77889900",
    "clientName": "Ricardo Moreno",
    "clientEmail": "ricardo.moreno@mecanix.com",
    "subtotal": "336.28",
    "taxAmount": "43.72",
    "totalCost": "380.00",
    "paymentMethod": "transfer",
    "invoiceNumber": null,
    "createdAt": "2025-11-14T18:26:06.513Z",
    "updatedAt": "2025-11-14T18:26:06.513Z"
  },
  {
    "id": 1,
    "code": "ORD-20251112-001",
    "reservate": {
      "id": 1,
      "code": "202411001",
      "reservationDate": "2025-11-12T13:00:00.000Z",
      "totalPrice": 180,
      "state": "completed",
      "createdAt": "2025-11-14T18:26:02.078Z",
      "updatedAt": "2025-11-14T18:26:02.078Z"
    },
    "vehicle": {
      "id": 1,
      "board": "ABC123",
      "model": "Corolla",
      "brand": "Toyota",
      "year": 2020
    },
    "mechanic": null,
    "status": "completed",
    "diagnosis": "Aceite viejo y filtro obstruido",
    "workDescription": "Se realizó cambio de aceite 5W-30 sintético y reemplazo de filtro de aceite marca OEM",
    "startDate": "2025-11-12T13:30:00.000Z",
    "completionDate": "2025-11-12T14:30:00.000Z",
    "clientNitCi": "12345678",
    "clientName": "Carlos Rodriguez",
    "clientEmail": "carlos.rodriguez@mecanix.com",
    "subtotal": "159.29",
    "taxAmount": "20.71",
    "totalCost": "180.00",
    "paymentMethod": "cash",
    "invoiceNumber": "FAC-001-2025",
    "createdAt": "2025-11-14T18:26:06.513Z",
    "updatedAt": "2025-11-14T18:26:06.513Z"
  },
  {
    "id": 5,
    "code": "ORD-20251112-005",
    "reservate": {
      "id": 5,
      "code": "202411005",
      "reservationDate": "2025-11-12T20:00:00.000Z",
      "totalPrice": 150,
      "state": "pending",
      "createdAt": "2025-11-14T18:26:02.078Z",
      "updatedAt": "2025-11-14T18:26:02.078Z"
    },
    "vehicle": null,
    "mechanic": null,
    "status": "pending",
    "diagnosis": null,
    "workDescription": null,
    "startDate": null,
    "completionDate": null,
    "clientNitCi": "33445566",
    "clientName": "Luis Fernández",
    "clientEmail": "luis.fernandez@mecanix.com",
    "subtotal": "132.74",
    "taxAmount": "17.26",
    "totalCost": "150.00",
    "paymentMethod": "cash",
    "invoiceNumber": null,
    "createdAt": "2025-11-14T18:26:06.513Z",
    "updatedAt": "2025-11-14T18:26:06.513Z"
  },
  {
    "id": 8,
    "code": "ORD-20251114-001",
    "reservate": null,
    "vehicle": null,
    "mechanic": null,
    "status": "pending",
    "diagnosis": "Orden sin referencias debido a eliminación de datos relacionados",
    "workDescription": "Orden que quedó huérfana por eliminación de registros relacionados",
    "startDate": null,
    "completionDate": null,
    "clientNitCi": "88990011",
    "clientName": "Carmen Silva",
    "clientEmail": null,
    "subtotal": "176.99",
    "taxAmount": "23.01",
    "totalCost": "200.00",
    "paymentMethod": "cash",
    "invoiceNumber": null,
    "createdAt": "2025-11-14T18:26:06.513Z",
    "updatedAt": "2025-11-14T18:26:06.513Z"
  },
  {
    "id": 6,
    "code": "ORD-20251113-001",
    "reservate": null,
    "vehicle": {
      "id": 7,
      "board": "PQR678",
      "model": "Accent",
      "brand": "Hyundai",
      "year": 2019
    },
    "mechanic": {
      "id": 2,
      "employeeCode": "MECH002",
      "firstName": "Sofía",
      "lastName": "Ramírez",
      "phone": "72345678",
      "type": "mechanic",
      "hireDate": "2023-03-20",
      "yearsExperience": 2,
      "experienceLevel": "junior",
      "status": "active",
      "specialties": [
        "electrical",
        "brakes",
        "diagnostics"
      ],
      "hourlyRate": "65.00",
      "workScheduleStart": "08:00:00",
      "workScheduleEnd": "17:00:00",
      "workDays": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "isActive": true,
      "createdAt": "2025-11-14T18:25:52.645Z",
      "updatedAt": "2025-11-14T18:25:52.645Z"
    },
    "status": "pending",
    "diagnosis": "Revisión rutinaria programada",
    "workDescription": "Mantenimiento preventivo sin reserva previa",
    "startDate": null,
    "completionDate": null,
    "clientNitCi": "66778899",
    "clientName": "Sofía Vargas",
    "clientEmail": "sofia.vargas@mecanix.com",
    "subtotal": "283.19",
    "taxAmount": "36.81",
    "totalCost": "320.00",
    "paymentMethod": "card",
    "invoiceNumber": null,
    "createdAt": "2025-11-14T18:26:06.513Z",
    "updatedAt": "2025-11-14T18:26:06.513Z"
  }
]
```
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
- **Body**: 
```json
{
  "id": 1,
  "code": "ORD-20251112-001",
  "reservate": {
    "id": 1,
    "code": "202411001",
    "reservationDate": "2025-11-12T13:00:00.000Z",
    "totalPrice": 180,
    "state": "completed",
    "createdAt": "2025-11-14T18:26:02.078Z",
    "updatedAt": "2025-11-14T18:26:02.078Z"
  },
  "vehicle": {
    "id": 1,
    "board": "ABC123",
    "model": "Corolla",
    "brand": "Toyota",
    "year": 2020
  },
  "mechanic": null,
  "status": "completed",
  "diagnosis": "Aceite viejo y filtro obstruido",
  "workDescription": "Se realizó cambio de aceite 5W-30 sintético y reemplazo de filtro de aceite marca OEM",
  "startDate": "2025-11-12T13:30:00.000Z",
  "completionDate": "2025-11-12T14:30:00.000Z",
  "clientNitCi": "12345678",
  "clientName": "Carlos Rodriguez",
  "clientEmail": "carlos.rodriguez@mecanix.com",
  "subtotal": "159.29",
  "taxAmount": "20.71",
  "totalCost": "180.00",
  "paymentMethod": "cash",
  "invoiceNumber": "FAC-001-2025",
  "createdAt": "2025-11-14T18:26:06.513Z",
  "updatedAt": "2025-11-14T18:26:06.513Z"
}
```
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
  "hourlyRate": 45.0,
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
  "totalCost": 300.0,
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
