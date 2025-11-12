import { apiClient } from './apiConfig';

const API_BASE_URL = `/mechanic`;

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

// Interface para los datos que vienen del backend
interface BackendMechanic {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  type: string;
  hireDate: string;
  yearsExperience: number;
  experienceLevel: string;
  status: string;
  specialties: string[] | string; // Puede venir como array o string separado por espacios
  hourlyRate: string; // Viene como string
  workScheduleStart: string;
  workScheduleEnd: string;
  workDays: string[] | string; // Puede venir como array o string separado por espacios
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Función para transformar los datos del backend al formato del frontend
const transformBackendMechanic = (backendMechanic: BackendMechanic): Mechanic => {
  return {
    id: backendMechanic.id,
    employeeCode: backendMechanic.employeeCode,
    firstName: backendMechanic.firstName,
    lastName: backendMechanic.lastName,
    phone: backendMechanic.phone,
    type: 'mechanic',
    hireDate: backendMechanic.hireDate,
    yearsExperience: backendMechanic.yearsExperience,
    experienceLevel: backendMechanic.experienceLevel as ExperienceLevel,
    status: backendMechanic.status as MechanicStatus,
    specialties: Array.isArray(backendMechanic.specialties) 
      ? backendMechanic.specialties as Specialty[] 
      : backendMechanic.specialties 
        ? backendMechanic.specialties.trim().split(/\s+/).filter((s: string) => s.length > 0) as Specialty[] 
        : [],
    hourlyRate: parseFloat(backendMechanic.hourlyRate) || 0,
    workScheduleStart: backendMechanic.workScheduleStart,
    workScheduleEnd: backendMechanic.workScheduleEnd,
    workDays: Array.isArray(backendMechanic.workDays) 
      ? backendMechanic.workDays as WorkDay[] 
      : backendMechanic.workDays 
        ? backendMechanic.workDays.trim().split(/\s+/).filter((d: string) => d.length > 0) as WorkDay[] 
        : [],
    isActive: backendMechanic.isActive,
    createdAt: backendMechanic.createdAt,
    updatedAt: backendMechanic.updatedAt
  };
};

export const mechanicService = {
  // CRUD básico
  getAllMechanics: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Mechanic>> => {
    console.log('🔄 [MECHANIC SERVICE] Solicitando mecánicos - página:', page, 'límite:', limit);
    const response = await apiClient.get(`${API_BASE_URL}?page=${page}&limit=${limit}`);
    console.log('📊 [MECHANIC SERVICE] Respuesta cruda de API:', response.data);
    console.log('📊 [MECHANIC SERVICE] Tipo de respuesta:', typeof response.data);
    console.log('📊 [MECHANIC SERVICE] Keys de la respuesta:', Object.keys(response.data || {}));
    console.log('📊 [MECHANIC SERVICE] Estructura completa:', JSON.stringify(response.data, null, 2));
    
    // La API real devuelve: { mechanics: [], ... } en lugar de { data: [], ... }
    // Necesitamos transformarlo al formato esperado por el frontend
    const apiResponse = response.data;
    
    // Transformar los datos del backend al formato del frontend
    const rawData = apiResponse.mechanics || apiResponse.data || apiResponse;
    console.log('📊 [MECHANIC SERVICE] Datos crudos para transformar:', rawData);
    console.log('📊 [MECHANIC SERVICE] Tipo de datos crudos:', typeof rawData);
    console.log('📊 [MECHANIC SERVICE] Es array?:', Array.isArray(rawData));
    
    if (!Array.isArray(rawData)) {
      console.error('❌ [MECHANIC SERVICE] Los datos no son un array:', rawData);
      console.error('❌ [MECHANIC SERVICE] Tipo actual:', typeof rawData);
      console.error('❌ [MECHANIC SERVICE] Constructor:', rawData?.constructor?.name);
      throw new Error('Formato de respuesta inválido de la API');
    }
    
    const transformedData = rawData.map(transformBackendMechanic);
    console.log('🔄 [MECHANIC SERVICE] Datos transformados:', transformedData);
    
    const result = {
      data: transformedData,
      pagination: {
        page: apiResponse.page || page,
        limit: limit,
        total: apiResponse.total || transformedData.length,
        totalPages: apiResponse.lastPage || Math.ceil((apiResponse.total || transformedData.length) / limit)
      }
    };
    
    console.log('✅ [MECHANIC SERVICE] Resultado final:', result);
    return result;
  },

  getMechanicByCode: async (code: string): Promise<Mechanic> => {
    const response = await apiClient.get(`${API_BASE_URL}/${code}`);
    return response.data;
  },

  getMechanicByEmployeeCode: async (code: string): Promise<Mechanic> => {
    const response = await apiClient.get(`${API_BASE_URL}/employee/${code}`);
    return response.data;
  },

  createMechanic: async (mechanicData: MechanicData): Promise<Mechanic> => {
    const response = await apiClient.post(`${API_BASE_URL}`, mechanicData);
    return response.data;
  },

  updateMechanic: async (code: string, mechanicData: Partial<MechanicData>): Promise<Mechanic> => {
    const response = await apiClient.patch(`${API_BASE_URL}/${code}/update`, mechanicData);
    return response.data;
  },

  updateMechanicStatus: async (code: string, status: MechanicStatus): Promise<Mechanic> => {
    const response = await apiClient.patch(`${API_BASE_URL}/${code}/status`, { status });
    return response.data;
  },

  deleteMechanic: async (code: string): Promise<void> => {
    await apiClient.delete(`${API_BASE_URL}/${code}/delete`);
  },

  // Estadísticas
  getStatistics: async (): Promise<MechanicStatistics> => {
    const response = await apiClient.get(`${API_BASE_URL}/statistics`);
    return response.data;
  },

  // Disponibilidad y filtros
  getAvailableMechanics: async (date?: string): Promise<Mechanic[]> => {
    const url = date ? `${API_BASE_URL}/available?date=${date}` : `${API_BASE_URL}/available`;
    const response = await apiClient.get(url);
    return response.data;
  },

  getMechanicsBySpecialty: async (specialty: Specialty): Promise<Mechanic[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/specialty/${specialty}`);
    return response.data;
  },

  getMechanicsByExperienceLevel: async (level: ExperienceLevel): Promise<Mechanic[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/experience/${level}`);
    return response.data;
  },

  getMechanicsByWorkDay: async (day: WorkDay): Promise<Mechanic[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/workday/${day}`);
    return response.data;
  },

  // Búsqueda
  searchMechanics: async (term: string): Promise<Mechanic[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/search?term=${encodeURIComponent(term)}`);
    return response.data;
  },

  // Horarios
  getMechanicSchedule: async (code: string): Promise<{
    workScheduleStart: string;
    workScheduleEnd: string;
    workDays: WorkDay[];
  }> => {
    const response = await apiClient.get(`${API_BASE_URL}/${code}/schedule`);
    return response.data;
  },
};