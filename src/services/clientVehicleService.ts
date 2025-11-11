import axios from 'axios';
import type { Client } from './clientService';
import type { Vehicle } from './vehicleService';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/client-vehicle`;

export interface ClientVehicleAssociation {
  id: number;
  clientCode: number;
  vehicleId: number;
  isPrimary: boolean;
  notes?: string;
  isActive?: boolean;
  addedDate?: string;
  updatedAt?: string;
  client?: Client;
  vehicle?: Vehicle;
}

export interface ClientVehicleData {
  clientCode: number;
  vehicleId: number;
  isPrimary: boolean;
  notes?: string;
}

export const clientVehicleService = {
  // CRUD básico
  getAllAssociations: async (): Promise<ClientVehicleAssociation[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  getAssociationById: async (id: number): Promise<ClientVehicleAssociation> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  createAssociation: async (associationData: ClientVehicleData): Promise<ClientVehicleAssociation> => {
    const response = await axios.post(API_BASE_URL, associationData);
    return response.data;
  },

  updateAssociation: async (id: number, associationData: Partial<ClientVehicleData>): Promise<ClientVehicleAssociation> => {
    const response = await axios.patch(`${API_BASE_URL}/${id}`, associationData);
    return response.data;
  },

  deleteAssociation: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  // Consultas específicas
  getVehiclesByClient: async (clientCode: number): Promise<Vehicle[]> => {
    const response = await axios.get(`${API_BASE_URL}/client/${clientCode}`);
    return response.data;
  },

  getClientsByVehicle: async (vehicleId: number): Promise<Client[]> => {
    const response = await axios.get(`${API_BASE_URL}/vehicle/${vehicleId}`);
    return response.data;
  },

  // Operaciones especiales
  setPrimaryVehicle: async (id: number): Promise<ClientVehicleAssociation> => {
    const response = await axios.patch(`${API_BASE_URL}/${id}/set-primary`);
    return response.data;
  },
};