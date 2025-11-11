import { apiClient } from "./apiConfig";
import { mockClients } from "./mockData";

const API_BASE_URL = "/client";

// Variable para controlar si usar mock data
const USE_MOCK_DATA = true; // Cambiar a false cuando el backend esté funcionando

export interface Client {
  id?: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  genero: 'masculino' | 'femenino' | 'otro';
  fechaNacimiento: string;
  tipoDocumento: string;
  numeroDocumento: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  profesion: string;
  estado: 'activo' | 'inactivo';
  fechaRegistro?: string;
  ultimaActualizacion?: string;
  notas?: string;
  metodoPrefContacto: 'telefono' | 'email' | 'ambos';
  frecuenciaContacto: 'alta' | 'media' | 'baja';
}

export interface ClientFilters {
  estado?: 'activo' | 'inactivo';
  genero?: 'masculino' | 'femenino' | 'otro';
  ciudad?: string;
  profesion?: string;
  metodoPrefContacto?: 'telefono' | 'email' | 'ambos';
  frecuenciaContacto?: 'alta' | 'media' | 'baja';
  fechaRegistroDesde?: string;
  fechaRegistroHasta?: string;
  edadMinima?: number;
  edadMaxima?: number;
}

export interface ClientStats {
  total: number;
  activos: number;
  inactivos: number;
  porGenero: {
    masculino: number;
    femenino: number;
    otro: number;
  };
  porMetodoContacto: {
    telefono: number;
    email: number;
    ambos: number;
  };
  porFrecuenciaContacto: {
    alta: number;
    media: number;
    baja: number;
  };
  ciudadesMasComunes: Array<{ ciudad: string; count: number }>;
  edadPromedio: number;
  clientesRecientes: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// CRUD básico
export const getAllClients = async (): Promise<Client[]> => {
  if (USE_MOCK_DATA) {
    // Simular una petición asíncrona
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockClients;
  }
  
  const response = await apiClient.get(API_BASE_URL);
  return response.data;
};

export const getClientById = async (id: number): Promise<Client> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const client = mockClients.find(c => c.id === id);
    if (!client) {
      throw new Error('Cliente no encontrado');
    }
    return client;
  }
  
  const response = await apiClient.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createClient = async (client: Omit<Client, 'id' | 'fechaRegistro' | 'ultimaActualizacion'>): Promise<Client> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newClient: Client = {
      ...client,
      id: Math.max(...mockClients.map(c => c.id || 0)) + 1,
      fechaRegistro: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString()
    };
    mockClients.push(newClient);
    return newClient;
  }
  
  const response = await apiClient.post(API_BASE_URL, client);
  return response.data;
};

export const updateClient = async (id: number, client: Partial<Client>): Promise<Client> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    const updatedClient = {
      ...mockClients[index],
      ...client,
      ultimaActualizacion: new Date().toISOString()
    };
    mockClients[index] = updatedClient;
    return updatedClient;
  }
  
  const response = await apiClient.put(`${API_BASE_URL}/${id}`, client);
  return response.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    mockClients.splice(index, 1);
    return;
  }
  
  await apiClient.delete(`${API_BASE_URL}/${id}`);
};

export const searchClients = async (query: string): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/search`, {
    params: { q: query }
  });
  return response.data;
};

export const getClientStats = async (): Promise<ClientStats> => {
  const response = await apiClient.get(`${API_BASE_URL}/stats`);
  return response.data;
};

// Funcionalidades adicionales
export const getClientsByFilters = async (filters: ClientFilters): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/filter`, { params: filters });
  return response.data;
};

export const getClientsByGender = async (genero: 'masculino' | 'femenino' | 'otro'): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/genero/${genero}`);
  return response.data;
};

export const getClientsByContactMethod = async (metodo: 'telefono' | 'email' | 'ambos'): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/contacto/${metodo}`);
  return response.data;
};

export const getClientsByStatus = async (estado: 'activo' | 'inactivo'): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/estado/${estado}`);
  return response.data;
};

export const toggleClientStatus = async (id: number): Promise<Client> => {
  const response = await apiClient.patch(`${API_BASE_URL}/${id}/toggle-status`);
  return response.data;
};

export const activateClient = async (id: number): Promise<Client> => {
  const response = await apiClient.patch(`${API_BASE_URL}/${id}/activate`);
  return response.data;
};

export const deactivateClient = async (id: number): Promise<Client> => {
  const response = await apiClient.patch(`${API_BASE_URL}/${id}/deactivate`);
  return response.data;
};

// Más funcionalidades avanzadas
export const getClientsByCity = async (ciudad: string): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/ciudad/${encodeURIComponent(ciudad)}`);
  return response.data;
};

export const getClientsByProfession = async (profesion: string): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/profesion/${encodeURIComponent(profesion)}`);
  return response.data;
};

export const getClientsByAgeRange = async (edadMin: number, edadMax: number): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/edad`, {
    params: { min: edadMin, max: edadMax }
  });
  return response.data;
};

export const getClientsByDateRange = async (fechaInicio: string, fechaFin: string): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/fecha-registro`, {
    params: { inicio: fechaInicio, fin: fechaFin }
  });
  return response.data;
};

export const getClientsBirthdaysSoon = async (dias: number = 30): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/cumpleanos`, {
    params: { dias }
  });
  return response.data;
};

export const updateClientNotes = async (id: number, notas: string): Promise<Client> => {
  const response = await apiClient.patch(`${API_BASE_URL}/${id}/notas`, { notas });
  return response.data;
};

export const checkEmailExists = async (email: string, excludeId?: number): Promise<boolean> => {
  const response = await apiClient.get(`${API_BASE_URL}/check-email`, {
    params: { email, excludeId }
  });
  return response.data.exists;
};

export const checkDocumentExists = async (
  tipoDocumento: string, 
  numeroDocumento: string, 
  excludeId?: number
): Promise<boolean> => {
  const response = await apiClient.get(`${API_BASE_URL}/check-document`, {
    params: { tipoDocumento, numeroDocumento, excludeId }
  });
  return response.data.exists;
};

export const getUniqueCities = async (): Promise<string[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/ciudades`);
  return response.data;
};

export const getUniqueProfessions = async (): Promise<string[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/profesiones`);
  return response.data;
};