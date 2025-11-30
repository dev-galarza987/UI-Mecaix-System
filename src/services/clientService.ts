import { apiClient } from "./apiConfig";
import { mockClients } from "./mockData";

const API_BASE_URL = "/client";

// Variable para controlar si usar mock data
const USE_MOCK_DATA = false; // Cambiado a false para usar la API real

export interface Client {
  id?: number;
  code: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  password?: string;
  genero: "masculino" | "femenino" | "otro";
  ci: string;
  direccion: string;
  estado: "activo" | "inactivo";
  fechaRegistro?: string;
  ultimaActualizacion?: string;
  metodoPrefContacto: "telefono" | "email" | "ambos";
}

// Interface para los datos que vienen del backend
interface BackendClient {
  id: number;
  code: number;
  name: string;
  lastname: string;
  phone: string;
  ci: number;
  type: string;
  gender: string;
  email: string;
  password?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin: string;
  address: string;
  preferredContactMethod: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Función para transformar datos del backend al formato del frontend
const transformBackendClient = (backendClient: BackendClient): Client => {
  // console.log('🔄 [TRANSFORM] Datos originales del backend:', backendClient);

  const transformed: Client = {
    id: backendClient.id,
    code: backendClient.code,
    nombre: backendClient.name,
    apellido: backendClient.lastname,
    telefono: backendClient.phone,
    email: backendClient.email,
    genero:
      backendClient.gender === "male"
        ? "masculino"
        : backendClient.gender === "female"
        ? "femenino"
        : "otro",
    ci: backendClient.ci.toString(),
    direccion: backendClient.address,
    estado: backendClient.isActive ? "activo" : "inactivo",
    fechaRegistro: backendClient.createdAt,
    ultimaActualizacion: backendClient.updatedAt,
    metodoPrefContacto:
      backendClient.preferredContactMethod === "phone"
        ? "telefono"
        : backendClient.preferredContactMethod === "email"
        ? "email"
        : "ambos",
  };

  // console.log('🔄 [TRANSFORM] Datos transformados:', transformed);
  return transformed;
};

// Función para transformar datos del frontend al formato del backend (para crear/actualizar)
const transformToBackendClient = (frontendClient: Partial<Client>): any => {
  const backendData: any = {};

  if (frontendClient.code) backendData.clientCode = Number(frontendClient.code);
  if (frontendClient.nombre) backendData.name = frontendClient.nombre;
  if (frontendClient.apellido) backendData.lastName = frontendClient.apellido;
  if (frontendClient.telefono) backendData.phone = frontendClient.telefono;
  if (frontendClient.email) backendData.email = frontendClient.email;
  if (frontendClient.password) backendData.password = frontendClient.password;
  if (frontendClient.direccion) backendData.address = frontendClient.direccion;
  if (frontendClient.ci) backendData.ci = parseInt(frontendClient.ci);

  // Transformar género
  if (frontendClient.genero) {
    backendData.gender =
      frontendClient.genero === "masculino"
        ? "male"
        : frontendClient.genero === "femenino"
        ? "female"
        : "other";
  }

  // Transformar método de contacto preferido
  if (frontendClient.metodoPrefContacto) {
    backendData.preferredContactMethod =
      frontendClient.metodoPrefContacto === "telefono"
        ? "phone"
        : frontendClient.metodoPrefContacto === "email"
        ? "email"
        : "whatsapp";
  }

  // Transformar estado
  if (frontendClient.estado) {
    backendData.isActive = frontendClient.estado === "activo";
  }

  return backendData;
};

export interface ClientFilters {
  estado?: "activo" | "inactivo";
  genero?: "masculino" | "femenino" | "otro";
  ciudad?: string;
  profesion?: string;
  metodoPrefContacto?: "telefono" | "email" | "ambos";
  frecuenciaContacto?: "alta" | "media" | "baja";
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
  /*if (USE_MOCK_DATA) {
    // Simular una petición asíncrona
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockClients;
  }*/

  console.log("🚀 [CLIENT SERVICE] Iniciando getAllClients...");
  console.log("🌐 [CLIENT SERVICE] URL base:", API_BASE_URL);
  console.log(
    "🌐 [CLIENT SERVICE] URL completa:",
    `http://localhost:4000/api/v1${API_BASE_URL}`
  );
  console.log("🔧 [CLIENT SERVICE] USE_MOCK_DATA:", USE_MOCK_DATA);

  try {
    const response = await apiClient.get<BackendClient[]>(API_BASE_URL);
    console.log("✅ [CLIENT SERVICE] Respuesta exitosa:", response.status);
    console.log("📊 [CLIENT SERVICE] Headers de respuesta:", response.headers);
    console.log(
      "📊 [CLIENT SERVICE] Datos recibidos del backend:",
      response.data
    );
    console.log("🔢 [CLIENT SERVICE] Tipo de respuesta:", typeof response.data);
    console.log("🔢 [CLIENT SERVICE] Es array?:", Array.isArray(response.data));
    if (Array.isArray(response.data)) {
      console.log(
        "🔢 [CLIENT SERVICE] Cantidad de clientes:",
        response.data.length
      );
    }

    // Transformar los datos del backend al formato del frontend
    const transformedData = response.data.map(transformBackendClient);
    console.log("🔄 [CLIENT SERVICE] Datos transformados:", transformedData);

    return transformedData;
  } catch (error: any) {
    console.error("❌ [CLIENT SERVICE] Error en getAllClients:");
    console.error("❌ [CLIENT SERVICE] Error completo:", error);
    console.error("❌ [CLIENT SERVICE] Error message:", error.message);
    console.error("❌ [CLIENT SERVICE] Error code:", error.code);
    if (error.response) {
      console.error(
        "❌ [CLIENT SERVICE] Error response status:",
        error.response.status
      );
      console.error(
        "❌ [CLIENT SERVICE] Error response data:",
        error.response.data
      );
      console.error(
        "❌ [CLIENT SERVICE] Error response headers:",
        error.response.headers
      );
    } else if (error.request) {
      console.error("❌ [CLIENT SERVICE] Error request:", error.request);
    }
    throw error;
  }
};

export const getClientById = async (code: number): Promise<Client> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const client = mockClients.find((c) => c.id === code);
    if (!client) {
      throw new Error("Cliente no encontrado");
    }
    return client;
  }

  console.log("🔍 [CLIENT SERVICE] Obteniendo cliente por code:", code);
  console.log("🌐 [CLIENT SERVICE] URL:", `${API_BASE_URL}/${code}`);

  try {
    const response = await apiClient.get<BackendClient>(
      `${API_BASE_URL}/${code}`
    );
    console.log("✅ [CLIENT SERVICE] Cliente encontrado:", response.data);

    // Transformar los datos del backend al formato del frontend
    const transformedClient = transformBackendClient(response.data);
    console.log("🔄 [CLIENT SERVICE] Cliente transformado:", transformedClient);

    return transformedClient;
  } catch (error: any) {
    console.error("❌ [CLIENT SERVICE] Error obteniendo cliente:", error);
    if (error.response?.status === 404) {
      throw new Error("Cliente no encontrado");
    }
    throw error;
  }
};

export const createClient = async (
  client: Omit<Client, "id" | "fechaRegistro" | "ultimaActualizacion">
): Promise<Client> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newClient: Client = {
      ...client,
      id: Math.max(...mockClients.map((c) => c.id || 0)) + 1,
      fechaRegistro: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString(),
    };
    mockClients.push(newClient);
    return newClient;
  }

  const response = await apiClient.post(API_BASE_URL, client);
  return response.data;
};

export const updateClient = async (
  code: number,
  client: Partial<Client>
): Promise<Client> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockClients.findIndex((c) => c.id === code);
    if (index === -1) {
      throw new Error("Cliente no encontrado");
    }
    const updatedClient = {
      ...mockClients[index],
      ...client,
      ultimaActualizacion: new Date().toISOString(),
    };
    mockClients[index] = updatedClient;
    return updatedClient;
  }

  console.log("🔄 [CLIENT SERVICE] Actualizando cliente code:", code);
  console.log("📊 [CLIENT SERVICE] Datos frontend:", client);

  try {
    // Transformar datos del frontend al formato del backend
    const backendData = transformToBackendClient(client);
    console.log(
      "🔄 [CLIENT SERVICE] Datos transformados para backend:",
      backendData
    );

    // Usar PATCH en lugar de PUT y el endpoint correcto /update
    const response = await apiClient.patch<BackendClient>(
      `${API_BASE_URL}/${code}/update`,
      backendData
    );
    console.log(
      "✅ [CLIENT SERVICE] Respuesta del servidor - Status:",
      response.status
    );
    console.log(
      "✅ [CLIENT SERVICE] Respuesta del servidor - Data:",
      response.data
    );

    // Verificar que la respuesta sea exitosa
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    // Si no hay data en la respuesta, considerar como éxito
    if (!response.data) {
      console.log(
        "✅ [CLIENT SERVICE] Actualización exitosa sin datos de respuesta"
      );
      return { ...client, code: Number(code) } as Client; // Retornar los datos actualizados
    }

    // Transformar la respuesta del backend al formato del frontend
    const transformedResponse = transformBackendClient(response.data);
    console.log(
      "🔄 [CLIENT SERVICE] Respuesta transformada:",
      transformedResponse
    );

    return transformedResponse;
  } catch (error: any) {
    console.error("❌ [CLIENT SERVICE] Error completo:", error);
    console.error("❌ [CLIENT SERVICE] Error response:", error.response);
    console.error("❌ [CLIENT SERVICE] Error status:", error.response?.status);
    console.error("❌ [CLIENT SERVICE] Error data:", error.response?.data);

    if (error.response?.status === 404) {
      throw new Error("Cliente no encontrado");
    } else if (error.response?.status === 400) {
      throw new Error("Datos inválidos para actualizar el cliente");
    } else if (error.response?.status >= 500) {
      throw new Error("Error interno del servidor");
    } else if (error.response) {
      throw new Error(`Error del servidor: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error("Error inesperado al actualizar el cliente");
    }
  }
};

export const deleteClient = async (code: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockClients.findIndex((c) => c.code?.toString() === code);
    if (index === -1) {
      throw new Error("Cliente no encontrado");
    }
    mockClients.splice(index, 1);
    return;
  }

  await apiClient.delete(`${API_BASE_URL}/${code}/delete`);
};

export const searchClients = async (query: string): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/search`, {
    params: { q: query },
  });
  return response.data;
};

export const getClientStats = async (): Promise<ClientStats> => {
  const response = await apiClient.get(`${API_BASE_URL}/statistics/general`);
  return response.data;
};

// Funcionalidades adicionales
export const getClientsByFilters = async (
  filters: ClientFilters
): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/filter`, {
    params: filters,
  });
  return response.data;
};

export const getClientsByGender = async (
  genero: "masculino" | "femenino" | "otro"
): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/genero/${genero}`);
  return response.data;
};

export const getClientsByContactMethod = async (
  metodo: "telefono" | "email" | "ambos"
): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/contacto/${metodo}`);
  return response.data;
};

export const getClientsByStatus = async (
  estado: "activo" | "inactivo"
): Promise<Client[]> => {
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
  const response = await apiClient.get(
    `${API_BASE_URL}/ciudad/${encodeURIComponent(ciudad)}`
  );
  return response.data;
};

export const getClientsByProfession = async (
  profesion: string
): Promise<Client[]> => {
  const response = await apiClient.get(
    `${API_BASE_URL}/profesion/${encodeURIComponent(profesion)}`
  );
  return response.data;
};

export const getClientsByAgeRange = async (
  edadMin: number,
  edadMax: number
): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/edad`, {
    params: { min: edadMin, max: edadMax },
  });
  return response.data;
};

export const getClientsByDateRange = async (
  fechaInicio: string,
  fechaFin: string
): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/fecha-registro`, {
    params: { inicio: fechaInicio, fin: fechaFin },
  });
  return response.data;
};

export const getClientsBirthdaysSoon = async (
  dias: number = 30
): Promise<Client[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/cumpleanos`, {
    params: { dias },
  });
  return response.data;
};

export const updateClientNotes = async (
  id: number,
  notas: string
): Promise<Client> => {
  const response = await apiClient.patch(`${API_BASE_URL}/${id}/notas`, {
    notas,
  });
  return response.data;
};

export const checkEmailExists = async (
  email: string,
  excludeId?: number
): Promise<boolean> => {
  const response = await apiClient.get(`${API_BASE_URL}/check-email`, {
    params: { email, excludeId },
  });
  return response.data.exists;
};

export const checkDocumentExists = async (
  tipoDocumento: string,
  numeroDocumento: string,
  excludeId?: number
): Promise<boolean> => {
  const response = await apiClient.get(`${API_BASE_URL}/check-document`, {
    params: { tipoDocumento, numeroDocumento, excludeId },
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
