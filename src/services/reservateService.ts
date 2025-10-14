import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/reservate`;

export interface Client {
  id: number;
  code: number;
  name: string;
  lastname: string;
  phone: number;
}

export interface Service {
  id: number;
  code: number;
  title: string;
  description: string;
  price: number;
}

export interface Reservate {
  id: number;
  code: number;
  reservationDate: string;
  totalPrice: number;
  state: string;
  client: Client;
  services: Service[];
}

export type ReservateData = Omit<Reservate, 'id'>;

export const reservateService = {
  getAllReservates: async (): Promise<Reservate[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  getReservateByCode: async (code: number): Promise<Reservate> => {
    const response = await axios.get(`${API_BASE_URL}/${code}`);
    return response.data;
  },

  createReservate: async (reservateData: ReservateData): Promise<Reservate> => {
    const response = await axios.post(`${API_BASE_URL}/create`, reservateData);
    return response.data;
  },

  updateReservate: async (code: number, reservateData: Partial<ReservateData>): Promise<Reservate> => {
    const response = await axios.patch(`${API_BASE_URL}/${code}/update`, reservateData);
    return response.data;
  },

  deleteReservate: async (code: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${code}/delete`);
  },
};
