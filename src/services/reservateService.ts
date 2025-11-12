import { apiClient } from './apiConfig';

const API_BASE_URL = `/reservate`;

export interface Client {
  id: number;
  clientCode: number;
  name: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface Service {
  id: number;
  code: number;
  title: string;
  description: string;
  price: number;
}

export interface Mechanic {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  experienceLevel: string;
}

export interface Reservate {
  id: number;
  code: string;
  reservationDate: string;
  totalPrice: number;
  state: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  clientId?: number;
  mechanicId?: number;
  createdAt?: string;
  updatedAt?: string;
  client?: Client;
  mechanic?: Mechanic;
  services?: Service[];
}

// Type for creation
export interface ReservateData {
  code?: string;
  reservationDate: string;
  totalPrice: number;
  state: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  clientId: number;
  mechanicId: number;
  serviceIds: number[];
}

export const reservateService = {
  getAllReservates: async (): Promise<Reservate[]> => {
    console.log('🚀 [RESERVATE SERVICE] Iniciando getAllReservates...');
    console.log('🌐 [RESERVATE SERVICE] URL completa:', `http://localhost:4000/api/v1${API_BASE_URL}`);
    
    try {
      const response = await apiClient.get(API_BASE_URL);
      console.log('✅ [RESERVATE SERVICE] Respuesta exitosa:', response.status);
      console.log('📊 [RESERVATE SERVICE] Datos recibidos:', response.data);
      console.log('🔢 [RESERVATE SERVICE] Cantidad de reservas:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ [RESERVATE SERVICE] Error en getAllReservates:', error);
      throw error;
    }
  },

  getReservateByCode: async (code: string): Promise<Reservate> => {
    const response = await apiClient.get(`${API_BASE_URL}/${code}`);
    return response.data;
  },

  // Alias para mantener compatibilidad
  getReservate: async (code: string): Promise<Reservate> => {
    const response = await apiClient.get(`${API_BASE_URL}/${code}`);
    return response.data;
  },

  createReservate: async (reservateData: ReservateData): Promise<Reservate> => {
    const response = await apiClient.post(`${API_BASE_URL}/create`, reservateData);
    return response.data;
  },

  updateReservate: async (code: string, reservateData: Partial<ReservateData>): Promise<Reservate> => {
    console.log('🔄 [RESERVATE SERVICE] updateReservate INICIADO');
    console.log('🔑 [RESERVATE SERVICE] Código de reserva:', code);
    console.log('📝 [RESERVATE SERVICE] Datos a actualizar:', reservateData);
    console.log('🌐 [RESERVATE SERVICE] URL completa:', `http://localhost:4000/api/v1${API_BASE_URL}/${code}/update`);
    
    try {
      const response = await apiClient.patch(`${API_BASE_URL}/${code}/update`, reservateData);
      console.log('✅ [RESERVATE SERVICE] Actualización exitosa:', response.status);
      console.log('📊 [RESERVATE SERVICE] Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [RESERVATE SERVICE] Error en updateReservate:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        console.error('❌ [RESERVATE SERVICE] Error response:', axiosError.response?.data);
        console.error('❌ [RESERVATE SERVICE] Error status:', axiosError.response?.status);
      }
      throw error;
    }
  },

  deleteReservate: async (code: string): Promise<void> => {
    console.log('🗑️ [RESERVATE SERVICE] Eliminando reserva con código:', code);
    console.log('🌐 [RESERVATE SERVICE] URL:', `${API_BASE_URL}/${code}/delete`);
    try {
      const response = await apiClient.delete(`${API_BASE_URL}/${code}/delete`);
      console.log('✅ [RESERVATE SERVICE] Reserva eliminada exitosamente:', response.status);
    } catch (error) {
      console.error('❌ [RESERVATE SERVICE] Error al eliminar reserva:', error);
      throw error;
    }
  },
};
