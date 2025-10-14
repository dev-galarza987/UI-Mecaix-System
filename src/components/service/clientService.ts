import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/client`;

export interface Client {
  id: number;
  code: number;
  name: string;
  lastname: string;
  phone: number;
}

// Tipo para la creación, ya que el ID es generado por el backend
export type ClientData = Omit<Client, 'id'>;

export const clientService = {
  getAllClients: async (): Promise<Client[]> => {
    const response = await axios.get(API_BASE_URL);
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

  updateClient: async (code: number, clientData: Partial<ClientData>): Promise<Client> => {
    const response = await axios.patch(`${API_BASE_URL}/${code}/update`, clientData);
    return response.data;
  },

  deleteClient: async (code: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${code}/delete`);
  },
};