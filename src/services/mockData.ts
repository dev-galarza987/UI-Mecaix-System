import type { Client } from './clientService';

export const mockClients: Client[] = [
  {
    id: 1,
    code: 1001,
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "555-0001",
    email: "juan.perez@email.com",
    genero: "masculino",
    ci: "12345678",
    direccion: "Calle 123 # 45-67",
    estado: "activo",
    metodoPrefContacto: "telefono"
  },
  {
    id: 2,
    code: 1002,
    nombre: "María",
    apellido: "García",
    telefono: "555-0002",
    email: "maria.garcia@email.com",
    genero: "femenino",
    ci: "87654321",
    direccion: "Avenida 456 # 78-90",
    estado: "activo",
    metodoPrefContacto: "email"
  },
  {
    id: 3,
    code: 1003,
    nombre: "Carlos",
    apellido: "Rodríguez",
    telefono: "555-0003",
    email: "carlos.rodriguez@email.com",
    genero: "masculino",
    ci: "11223344",
    direccion: "Carrera 789 # 12-34",
    estado: "activo",
    metodoPrefContacto: "telefono"
  }
];