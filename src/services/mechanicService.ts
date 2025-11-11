import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/mechanic`;

export type ExperienceLevel = 'trainee' | 'junior' | 'senior' | 'expert' | 'master';
export type MechanicStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';
export type Specialty = 'engine' | 'transmission' | 'brakes' | 'suspension' | 'electrical' | 'air_conditioning' | 'bodywork' | 'painting' | 'diagnostics' | 'general';
export type WorkDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Mechanic {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  type: 'mechanic';
  hireDate: string;
  yearsExperience: number;
  experienceLevel: ExperienceLevel;
  status: MechanicStatus;
  specialties: Specialty[];
  hourlyRate: number;
  workScheduleStart: string;
  workScheduleEnd: string;
  workDays: WorkDay[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type MechanicData = Omit<Mechanic, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>;

export interface MechanicStatistics {
  totalMechanics: number;
  activeMechanics: number;
  inactiveMechanics: number;
  averageExperience: number;
  experienceLevelDistribution: Record<ExperienceLevel, number>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const mechanicService = {
  // CRUD básico
  getAllMechanics: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Mechanic>> => {
    const response = await axios.get(`${API_BASE_URL}?page=${page}&limit=${limit}`);
    return response.data;
  },

  getMechanicByCode: async (code: string): Promise<Mechanic> => {
    const response = await axios.get(`${API_BASE_URL}/${code}`);
    return response.data;
  },

  getMechanicByEmployeeCode: async (code: string): Promise<Mechanic> => {
    const response = await axios.get(`${API_BASE_URL}/employee/${code}`);
    return response.data;
  },

  createMechanic: async (mechanicData: MechanicData): Promise<Mechanic> => {
    const response = await axios.post(`${API_BASE_URL}`, mechanicData);
    return response.data;
  },

  updateMechanic: async (code: string, mechanicData: Partial<MechanicData>): Promise<Mechanic> => {
    const response = await axios.patch(`${API_BASE_URL}/${code}/update`, mechanicData);
    return response.data;
  },

  updateMechanicStatus: async (code: string, status: MechanicStatus): Promise<Mechanic> => {
    const response = await axios.patch(`${API_BASE_URL}/${code}/status`, { status });
    return response.data;
  },

  deleteMechanic: async (code: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${code}/delete`);
  },

  // Estadísticas
  getStatistics: async (): Promise<MechanicStatistics> => {
    const response = await axios.get(`${API_BASE_URL}/statistics`);
    return response.data;
  },

  // Disponibilidad y filtros
  getAvailableMechanics: async (date?: string): Promise<Mechanic[]> => {
    const url = date ? `${API_BASE_URL}/available?date=${date}` : `${API_BASE_URL}/available`;
    const response = await axios.get(url);
    return response.data;
  },

  getMechanicsBySpecialty: async (specialty: Specialty): Promise<Mechanic[]> => {
    const response = await axios.get(`${API_BASE_URL}/specialty/${specialty}`);
    return response.data;
  },

  getMechanicsByExperienceLevel: async (level: ExperienceLevel): Promise<Mechanic[]> => {
    const response = await axios.get(`${API_BASE_URL}/experience/${level}`);
    return response.data;
  },

  getMechanicsByWorkDay: async (day: WorkDay): Promise<Mechanic[]> => {
    const response = await axios.get(`${API_BASE_URL}/workday/${day}`);
    return response.data;
  },

  // Búsqueda
  searchMechanics: async (term: string): Promise<Mechanic[]> => {
    const response = await axios.get(`${API_BASE_URL}/search?term=${encodeURIComponent(term)}`);
    return response.data;
  },

  // Horarios
  getMechanicSchedule: async (code: string): Promise<{
    workScheduleStart: string;
    workScheduleEnd: string;
    workDays: WorkDay[];
  }> => {
    const response = await axios.get(`${API_BASE_URL}/${code}/schedule`);
    return response.data;
  },
};