import type { Client } from './clientService';

export const mockClients: Client[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "555-0001",
    email: "juan.perez@email.com",
    genero: "masculino",
    fechaNacimiento: "1985-03-15",
    tipoDocumento: "cedula",
    numeroDocumento: "12345678",
    direccion: "Calle 123 # 45-67",
    ciudad: "Bogotá",
    codigoPostal: "110111",
    profesion: "Ingeniero",
    estado: "activo",
    metodoPrefContacto: "telefono",
    frecuenciaContacto: "alta"
  },
  {
    id: 2,
    nombre: "María",
    apellido: "García",
    telefono: "555-0002",
    email: "maria.garcia@email.com",
    genero: "femenino",
    fechaNacimiento: "1990-07-22",
    tipoDocumento: "cedula",
    numeroDocumento: "87654321",
    direccion: "Avenida 456 # 78-90",
    ciudad: "Medellín",
    codigoPostal: "050001",
    profesion: "Doctora",
    estado: "activo",
    metodoPrefContacto: "email",
    frecuenciaContacto: "media"
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez",
    telefono: "555-0003",
    email: "carlos.rodriguez@email.com",
    genero: "masculino",
    fechaNacimiento: "1978-12-10",
    tipoDocumento: "cedula",
    numeroDocumento: "11223344",
    direccion: "Carrera 789 # 12-34",
    ciudad: "Cali",
    codigoPostal: "760001",
    profesion: "Abogado",
    estado: "activo",
    metodoPrefContacto: "telefono",
    frecuenciaContacto: "baja"
  }
];