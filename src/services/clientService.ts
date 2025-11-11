import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/client`;

export interface Client {
  id: number;
  clientCode: number;
  name: string;
  lastName: string;
  phone: string;
  ci: number;
  type: 'client';
  gender: 'male' | 'female';
  email: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  lastLogin?: string;
  address: string;
  preferredContactMethod: 'phone' | 'email' | 'whatsapp';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para la creación, ya que el ID es generado por el backend
export type ClientData = Omit<Client, 'id' | 'emailVerified' | 'phoneVerified' | 'lastLogin' | 'isActive' | 'createdAt' | 'updatedAt'> & {
  password: string; // Requerido para creación
};

export interface ClientStatistics {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  totalSpent: number;
  averageSpent: number;
}

export interface TopClient {
  clientCode: number;
  name: string;
  lastName: string;
  totalSpent: number;
  totalReservations: number;
}

export const clientService = {
  // CRUD básico
  getAllClients: async (): Promise<Client[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  getActiveClients: async (): Promise<Client[]> => {
    const response = await axios.get(`${API_BASE_URL}/active`);
    return response.data;
  },

  getInactiveClients: async (): Promise<Client[]> => {
    const response = await axios.get(`${API_BASE_URL}/inactive`);
    return response.data;
  },

  getClientByCode: async (code: number): Promise<Client> => {
    const response = await axios.get(`${API_BASE_URL}/${code}`);
    return response.data;
  },

  createClient: async (clientData: ClientData): Promise<Client> => {
    const response = await axios.post(`${API_BASE_URL}/create`, clientData);
    return response.data;
  },

  updateClient: async (code: number, clientData: Partial<Omit<ClientData, 'password'>>): Promise<Client> => {
    const response = await axios.patch(`${API_BASE_URL}/${code}/update`, clientData);
    return response.data;
  },

  deleteClient: async (code: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${code}/delete`);
  },

  // Búsquedas
  searchClients: async (term: string): Promise<Client[]> => {
    const response = await axios.get(`${API_BASE_URL}/search?term=${encodeURIComponent(term)}`);
    return response.data;
  },

  getClientByEmail: async (email: string): Promise<Client> => {
    const response = await axios.get(`${API_BASE_URL}/email/${encodeURIComponent(email)}`);
    return response.data;
  },

  getClientByPhone: async (phone: string): Promise<Client> => {
    const response = await axios.get(`${API_BASE_URL}/phone/${encodeURIComponent(phone)}`);
    return response.data;
  },

  getClientByCI: async (ci: number): Promise<Client> => {
    const response = await axios.get(`${API_BASE_URL}/ci/${ci}`);
    return response.data;
  },

  // Estadísticas
  getGeneralStatistics: async (): Promise<ClientStatistics> => {
    const response = await axios.get(`${API_BASE_URL}/statistics/general`);
    return response.data;
  },

  getTopClients: async (limit: number = 10): Promise<TopClient[]> => {
    const response = await axios.get(`${API_BASE_URL}/statistics/top?limit=${limit}`);
    return response.data;
  },

  getInactiveClientsReport: async (days: number = 90): Promise<Client[]> => {
    const response = await axios.get(`${API_BASE_URL}/reports/inactive-clients?days=${days}`);
    return response.data;
  },

  // Filtros
  getClientsByGender: async (gender: 'male' | 'female'): Promise<Client[]> => {
    const response = await axios.get(`${API_BASE_URL}/filter/gender/${gender}`);
    return response.data;
  },

  getClientsByContactMethod: async (method: 'phone' | 'email' | 'whatsapp'): Promise<Client[]> => {
    const response = await axios.get(`${API_BASE_URL}/filter/contact-method/${method}`);
    return response.data;
  },

  // Información específica del cliente
  getClientStatistics: async (code: number): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/${code}/statistics`);
    return response.data;
  },

  getClientHistory: async (code: number): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/${code}/history`);
    return response.data;
  },

  getClientReservations: async (code: number): Promise<any[]> => {
    const response = await axios.get(`${API_BASE_URL}/${code}/reservations`);
    return response.data;
  },

  getClientVehicles: async (code: number): Promise<any[]> => {
    const response = await axios.get(`${API_BASE_URL}/${code}/vehicles`);
    return response.data;
  },
};