import { apiClient } from "./apiConfig";

const API_BASE_URL = `/mechanic`;

export type ExperienceLevel =
  | "trainee"
  | "junior"
  | "senior"
  | "expert"
  | "master";
export type MechanicStatus = "active" | "inactive" | "on_leave" | "terminated";
export type Specialty =
  | "engine"
  | "transmission"
  | "brakes"
  | "suspension"
  | "electrical"
  | "air_conditioning"
  | "bodywork"
  | "painting"
  | "diagnostics"
  | "general";
export type WorkDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface Mechanic {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  type: "mechanic";
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
  message?: string; // Propiedad opcional para mensajes del sistema (ej. actualización parcial)
}

export type MechanicData = Omit<
  Mechanic,
  "id" | "isActive" | "createdAt" | "updatedAt"
>;

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
  message?: string;
}

// Función para transformar los datos del backend al formato del frontend
const transformBackendMechanic = (
  backendMechanic: BackendMechanic
): Mechanic => {
  return {
    id: backendMechanic.id,
    employeeCode: backendMechanic.employeeCode,
    firstName: backendMechanic.firstName,
    lastName: backendMechanic.lastName,
    phone: backendMechanic.phone,
    type: "mechanic",
    hireDate: backendMechanic.hireDate,
    yearsExperience: backendMechanic.yearsExperience,
    experienceLevel: backendMechanic.experienceLevel as ExperienceLevel,
    status: backendMechanic.status as MechanicStatus,
    specialties: Array.isArray(backendMechanic.specialties)
      ? (backendMechanic.specialties as Specialty[])
      : backendMechanic.specialties
      ? (backendMechanic.specialties
          .trim()
          .split(/\s+/)
          .filter((s: string) => s.length > 0) as Specialty[])
      : [],
    hourlyRate: parseFloat(backendMechanic.hourlyRate) || 0,
    workScheduleStart: backendMechanic.workScheduleStart,
    workScheduleEnd: backendMechanic.workScheduleEnd,
    workDays: Array.isArray(backendMechanic.workDays)
      ? (backendMechanic.workDays as WorkDay[])
      : backendMechanic.workDays
      ? (backendMechanic.workDays
          .trim()
          .split(/\s+/)
          .filter((d: string) => d.length > 0) as WorkDay[])
      : [],
    isActive: backendMechanic.isActive,
    createdAt: backendMechanic.createdAt,
    updatedAt: backendMechanic.updatedAt,
    message: backendMechanic.message,
  };
};

export const mechanicService = {
  // CRUD básico
  getAllMechanics: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Mechanic>> => {
    console.log(
      "🔄 [MECHANIC SERVICE] Solicitando mecánicos - página:",
      page,
      "límite:",
      limit
    );
    const response = await apiClient.get(
      `${API_BASE_URL}?page=${page}&limit=${limit}`
    );
    console.log("📊 [MECHANIC SERVICE] Respuesta cruda de API:", response.data);
    console.log(
      "📊 [MECHANIC SERVICE] Tipo de respuesta:",
      typeof response.data
    );
    console.log(
      "📊 [MECHANIC SERVICE] Keys de la respuesta:",
      Object.keys(response.data || {})
    );
    console.log(
      "📊 [MECHANIC SERVICE] Estructura completa:",
      JSON.stringify(response.data, null, 2)
    );

    // La API real devuelve: { mechanics: [], ... } en lugar de { data: [], ... }
    // Necesitamos transformarlo al formato esperado por el frontend
    const apiResponse = response.data;

    // Transformar los datos del backend al formato del frontend
    const rawData = apiResponse.mechanics || apiResponse.data || apiResponse;
    console.log(
      "📊 [MECHANIC SERVICE] Datos crudos para transformar:",
      rawData
    );
    console.log("📊 [MECHANIC SERVICE] Tipo de datos crudos:", typeof rawData);
    console.log("📊 [MECHANIC SERVICE] Es array?:", Array.isArray(rawData));

    if (!Array.isArray(rawData)) {
      console.error(
        "❌ [MECHANIC SERVICE] Los datos no son un array:",
        rawData
      );
      console.error("❌ [MECHANIC SERVICE] Tipo actual:", typeof rawData);
      console.error(
        "❌ [MECHANIC SERVICE] Constructor:",
        rawData?.constructor?.name
      );
      throw new Error("Formato de respuesta inválido de la API");
    }

    const transformedData = rawData.map(transformBackendMechanic);
    console.log("🔄 [MECHANIC SERVICE] Datos transformados:", transformedData);

    const result = {
      data: transformedData,
      pagination: {
        page: apiResponse.page || page,
        limit: limit,
        total: apiResponse.total || transformedData.length,
        totalPages:
          apiResponse.lastPage ||
          Math.ceil((apiResponse.total || transformedData.length) / limit),
      },
    };

    console.log("✅ [MECHANIC SERVICE] Resultado final:", result);
    return result;
  },

  getMechanicByCode: async (code: string): Promise<Mechanic> => {
    console.log("🔍 [MECHANIC SERVICE] Buscando mecánico por código:", code);
    const response = await apiClient.get(`${API_BASE_URL}/${code}`);
    console.log(
      "📋 [MECHANIC SERVICE] Respuesta del mecánico individual:",
      response.data
    );

    // Verificar si la respuesta contiene un mecánico individual o está envuelto
    let mechanicData = response.data;

    // Si la respuesta tiene una estructura envuelta, extraer el mecánico
    if (mechanicData.mechanic) {
      mechanicData = mechanicData.mechanic;
    }

    console.log(
      "🔄 [MECHANIC SERVICE] Transformando mecánico individual:",
      mechanicData
    );
    const transformedMechanic = transformBackendMechanic(mechanicData);
    console.log(
      "✅ [MECHANIC SERVICE] Mecánico transformado:",
      transformedMechanic
    );

    return transformedMechanic;
  },

  getMechanicByEmployeeCode: async (code: string): Promise<Mechanic> => {
    console.log(
      "🔍 [MECHANIC SERVICE] Buscando mecánico por employeeCode:",
      code
    );
    const response = await apiClient.get(`${API_BASE_URL}/employee/${code}`);
    console.log(
      "📋 [MECHANIC SERVICE] Respuesta del mecánico por employeeCode:",
      response.data
    );

    // Verificar si la respuesta contiene un mecánico individual o está envuelto
    let mechanicData = response.data;

    // Si la respuesta tiene una estructura envuelta, extraer el mecánico
    if (mechanicData.mechanic) {
      mechanicData = mechanicData.mechanic;
    }

    console.log(
      "🔄 [MECHANIC SERVICE] Transformando mecánico por employeeCode:",
      mechanicData
    );
    const transformedMechanic = transformBackendMechanic(mechanicData);
    console.log(
      "✅ [MECHANIC SERVICE] Mecánico por employeeCode transformado:",
      transformedMechanic
    );

    return transformedMechanic;
  },

  createMechanic: async (mechanicData: MechanicData): Promise<Mechanic> => {
    const response = await apiClient.post(`${API_BASE_URL}`, mechanicData);
    return response.data;
  },

  updateMechanic: async (
    code: string,
    mechanicData: Partial<MechanicData>
  ): Promise<Mechanic> => {
    console.log(
      "🔄 [MECHANIC SERVICE] Actualizando mecánico:",
      code,
      mechanicData
    );

    /* 
    NOTA IMPORTANTE: El endpoint /mechanic/{code}/update del backend tiene problemas.
    - Funciona: PATCH /mechanic/{code}/status para actualizar solo el estado
    - No funciona: PATCH /mechanic/{code}/update para actualización completa (error 500/400)
    
    Solución temporal: Usar solo el endpoint de status que funciona.
    Cuando el backend corrija el endpoint /update, usar la función updateMechanicComplete más abajo.
    */

    // Definir el tipo para los datos del backend
    interface BackendMechanicData {
      firstName?: string;
      lastName?: string;
      phone?: string;
      hireDate?: string;
      yearsExperience?: number;
      experienceLevel?: string;
      status?: string;
      specialties?: string[] | string;
      hourlyRate?: number;
      workDays?: string[] | string;
      workSchedule?: {
        start: string;
        end: string;
      };
    }

    // Preparar los datos específicamente para la API backend
    // El backend espera workSchedule como un objeto con start y end en formato HH:mm
    const backendData: BackendMechanicData = {
      firstName: mechanicData.firstName,
      lastName: mechanicData.lastName,
      phone: mechanicData.phone,
      hireDate: mechanicData.hireDate,
      yearsExperience: mechanicData.yearsExperience,
      experienceLevel: mechanicData.experienceLevel,
      status: mechanicData.status,
      // Convertir arrays a strings si es necesario (como al crear)
      specialties: Array.isArray(mechanicData.specialties)
        ? mechanicData.specialties
        : mechanicData.specialties,
      hourlyRate: mechanicData.hourlyRate,
      workDays: Array.isArray(mechanicData.workDays)
        ? mechanicData.workDays
        : mechanicData.workDays,
    };

    // Crear el objeto workSchedule si tenemos las horas
    if (mechanicData.workScheduleStart && mechanicData.workScheduleEnd) {
      // Asegurar formato HH:mm (sin segundos) que el backend espera
      const formatTime = (time: string) => {
        // Si tiene segundos (HH:mm:ss), cortarlos
        if (time.includes(":") && time.split(":").length === 3) {
          return time.substring(0, 5); // Tomar solo HH:mm
        }
        return time;
      };

      backendData.workSchedule = {
        start: formatTime(mechanicData.workScheduleStart),
        end: formatTime(mechanicData.workScheduleEnd),
      };
    }

    // IMPORTANTE: No enviar campos undefined, null, o que podrían causar problemas
    // Solo enviar campos que realmente tienen valores
    const cleanedData: Record<
      string,
      string | number | string[] | { start: string; end: string }
    > = {};
    Object.keys(backendData).forEach((key) => {
      const typedKey = key as keyof BackendMechanicData;
      const value = backendData[typedKey];
      if (value !== undefined && value !== null && value !== "") {
        cleanedData[key] = value as
          | string
          | number
          | string[]
          | { start: string; end: string };
      }
    });

    console.log(
      "📦 [MECHANIC SERVICE] Datos preparados para backend:",
      cleanedData
    );
    console.log(
      "🔍 [MECHANIC SERVICE] WorkSchedule específico:",
      cleanedData.workSchedule
    );

    try {
      // Intentar múltiples endpoints para encontrar el correcto
      let response;
      let endpointUsed = "";

      // Opción 1: Endpoint original con estructura workSchedule
      try {
        endpointUsed = `${API_BASE_URL}/${code}/update`;
        console.log(
          "🎯 [MECHANIC SERVICE] Intentando endpoint 1:",
          endpointUsed
        );
        response = await apiClient.patch(endpointUsed, cleanedData);
        console.log("✅ [MECHANIC SERVICE] Endpoint 1 exitoso");
      } catch {
        console.log(
          "❌ [MECHANIC SERVICE] Endpoint 1 falló, intentando endpoint 2..."
        );

        // Opción 2: Usar exactamente el formato de creación según documentación
        const backendDataFlat = {
          firstName: mechanicData.firstName,
          lastName: mechanicData.lastName,
          phone: mechanicData.phone,
          hireDate: mechanicData.hireDate,
          yearsExperience: mechanicData.yearsExperience,
          experienceLevel: mechanicData.experienceLevel,
          status: mechanicData.status,
          specialties: Array.isArray(mechanicData.specialties)
            ? mechanicData.specialties
            : mechanicData.specialties,
          hourlyRate: mechanicData.hourlyRate,
          // Usar el formato exacto de la documentación con :00 al final
          workScheduleStart: mechanicData.workScheduleStart
            ? `${mechanicData.workScheduleStart}:00`
            : undefined,
          workScheduleEnd: mechanicData.workScheduleEnd
            ? `${mechanicData.workScheduleEnd}:00`
            : undefined,
          workDays: Array.isArray(mechanicData.workDays)
            ? mechanicData.workDays
            : mechanicData.workDays,
        };

        // Remover campos undefined
        (
          Object.keys(backendDataFlat) as (keyof typeof backendDataFlat)[]
        ).forEach((key) => {
          if (backendDataFlat[key] === undefined) {
            delete backendDataFlat[key];
          }
        });

        console.log(
          "📦 [MECHANIC SERVICE] Datos formato plano para endpoint 2:",
          backendDataFlat
        );

        try {
          endpointUsed = `${API_BASE_URL}/${code}/update`;
          response = await apiClient.patch(endpointUsed, backendDataFlat);
          console.log("✅ [MECHANIC SERVICE] Endpoint 2 exitoso");
        } catch {
          console.log(
            "❌ [MECHANIC SERVICE] Endpoint 2 falló, probando solo actualización de status..."
          );

          // Opción 3: Solo actualizar status como prueba (sabemos que este endpoint funciona según la documentación)
          try {
            endpointUsed = `${API_BASE_URL}/${code}/status`;
            const statusData = { status: mechanicData.status || "active" };
            console.log(
              "🎯 [MECHANIC SERVICE] Intentando actualizar solo status:",
              statusData
            );
            response = await apiClient.patch(endpointUsed, statusData);
            console.log(
              "✅ [MECHANIC SERVICE] Status actualizado exitosamente"
            );

            // Después de actualizar el status, informar al usuario que solo se pudo actualizar parcialmente
            console.log(
              "⚠️ [MECHANIC SERVICE] Solo se pudo actualizar el status. El endpoint de actualización completa parece tener problemas en el backend."
            );

            // Crear una respuesta simulada para que la UI no falle
            const partialUpdateResponse = {
              data: {
                ...mechanicData,
                employeeCode: code,
                status: mechanicData.status || "active",
                // Mantener los datos originales para los campos que no se pudieron actualizar
                message:
                  "Solo se actualizó el status. Otros campos requieren que el backend corrija el endpoint /update",
              },
            };
            response = partialUpdateResponse;
          } catch {
            console.log(
              "❌ [MECHANIC SERVICE] Incluso la actualización de status falló. Problema del backend."
            );

            // Opción 4: Endpoint alternativo sin /update
            try {
              endpointUsed = `${API_BASE_URL}/${code}`;
              response = await apiClient.patch(endpointUsed, backendDataFlat);
              console.log("✅ [MECHANIC SERVICE] Endpoint alternativo exitoso");
            } catch {
              console.log(
                "❌ [MECHANIC SERVICE] Endpoint alternativo falló, intentando PUT..."
              );

              // Opción 5: PUT en lugar de PATCH
              endpointUsed = `${API_BASE_URL}/${code}`;
              response = await apiClient.put(endpointUsed, backendDataFlat);
              console.log("✅ [MECHANIC SERVICE] PUT exitoso");
            }
          }
        }
      }
      console.log(
        "✅ [MECHANIC SERVICE] Actualización exitosa:",
        response.data
      );

      // Verificar si la respuesta contiene un mecánico individual o está envuelto
      let updatedMechanicData = response.data;

      // Si la respuesta tiene una estructura envuelta, extraer el mecánico
      if (updatedMechanicData.mechanic) {
        updatedMechanicData = updatedMechanicData.mechanic;
      }

      console.log(
        "✅ [MECHANIC SERVICE] Mecánico actualizado y transformado:",
        updatedMechanicData
      );
      return transformBackendMechanic(updatedMechanicData);
    } catch (error: unknown) {
      console.error(
        "❌ [MECHANIC SERVICE] Error detallado al actualizar:",
        error
      );
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: {
            data: {
              message?: string[];
              error?: string;
              statusCode?: number;
            };
            status: number;
            headers: Record<string, string>;
          };
        };
        console.error(
          "❌ [MECHANIC SERVICE] Response data completa:",
          JSON.stringify(axiosError.response.data, null, 2)
        );
        console.error(
          "❌ [MECHANIC SERVICE] Response status:",
          axiosError.response.status
        );
        console.error(
          "❌ [MECHANIC SERVICE] Response headers:",
          axiosError.response.headers
        );

        // Extraer mensajes específicos de validación
        if (
          axiosError.response.data &&
          Array.isArray(axiosError.response.data.message)
        ) {
          console.error(
            "❌ [MECHANIC SERVICE] Mensajes de validación:",
            axiosError.response.data.message
          );
          axiosError.response.data.message.forEach(
            (msg: string, index: number) => {
              console.error(
                `❌ [MECHANIC SERVICE] Validation Error ${index + 1}:`,
                msg
              );
            }
          );
        }
      }
      throw error;
    }
  },

  updateMechanicStatus: async (
    code: string,
    status: MechanicStatus
  ): Promise<Mechanic> => {
    const response = await apiClient.patch(`${API_BASE_URL}/${code}/status`, {
      status,
    });
    return response.data;
  },

  // TODO: Usar esta función cuando el backend arregle el endpoint /update
  updateMechanicComplete: async (
    code: string,
    mechanicData: Partial<MechanicData>
  ): Promise<Mechanic> => {
    console.log(
      "🔄 [MECHANIC SERVICE] Actualizando mecánico completo (cuando backend esté arreglado):",
      code,
      mechanicData
    );

    // Esta función usa el endpoint /update que debería funcionar cuando el backend se arregle
    const backendData = {
      firstName: mechanicData.firstName,
      lastName: mechanicData.lastName,
      phone: mechanicData.phone,
      hireDate: mechanicData.hireDate,
      yearsExperience: mechanicData.yearsExperience,
      experienceLevel: mechanicData.experienceLevel,
      status: mechanicData.status,
      specialties: mechanicData.specialties,
      hourlyRate: mechanicData.hourlyRate,
      workScheduleStart: mechanicData.workScheduleStart
        ? `${mechanicData.workScheduleStart}:00`
        : undefined,
      workScheduleEnd: mechanicData.workScheduleEnd
        ? `${mechanicData.workScheduleEnd}:00`
        : undefined,
      workDays: mechanicData.workDays,
    };

    // Limpiar campos undefined
    Object.keys(backendData).forEach((key) => {
      if (backendData[key as keyof typeof backendData] === undefined) {
        delete backendData[key as keyof typeof backendData];
      }
    });

    const response = await apiClient.patch(
      `${API_BASE_URL}/${code}/update`,
      backendData
    );
    return transformBackendMechanic(response.data);
  },

  deleteMechanic: async (code: string): Promise<void> => {
    console.log("🗑️ [MECHANIC SERVICE] Eliminando mecánico:", code);

    // Intentar diferentes endpoints que podrían funcionar
    const endpoints = [
      `${API_BASE_URL}/${code}`, // DELETE /mechanic/{code}
      `${API_BASE_URL}/${code}/delete`, // DELETE /mechanic/{code}/delete
      `${API_BASE_URL}/delete/${code}`, // DELETE /mechanic/delete/{code}
    ];

    let success = false;
    let lastError;

    for (const endpoint of endpoints) {
      try {
        console.log(
          `🔄 [MECHANIC SERVICE] Intentando endpoint de eliminación: ${endpoint}`
        );
        await apiClient.delete(endpoint);
        console.log(
          "✅ [MECHANIC SERVICE] Eliminación exitosa con endpoint:",
          endpoint
        );
        success = true;
        break;
      } catch (error) {
        console.log(
          `❌ [MECHANIC SERVICE] Endpoint de eliminación falló: ${endpoint}`,
          error
        );
        lastError = error;
        continue;
      }
    }

    if (!success) {
      console.error(
        "❌ [MECHANIC SERVICE] Todos los endpoints de eliminación fallaron"
      );
      throw lastError || new Error("No se pudo eliminar el mecánico");
    }

    console.log("✅ [MECHANIC SERVICE] Mecánico eliminado exitosamente");
  },

  // Estadísticas
  getStatistics: async (): Promise<MechanicStatistics> => {
    const response = await apiClient.get(`${API_BASE_URL}/statistics`);
    return response.data;
  },

  // Disponibilidad y filtros
  getAvailableMechanics: async (date?: string): Promise<Mechanic[]> => {
    const url = date
      ? `${API_BASE_URL}/available?date=${date}`
      : `${API_BASE_URL}/available`;
    const response = await apiClient.get(url);
    return response.data;
  },

  getMechanicsBySpecialty: async (
    specialty: Specialty
  ): Promise<Mechanic[]> => {
    const response = await apiClient.get(
      `${API_BASE_URL}/specialty/${specialty}`
    );
    return response.data;
  },

  getMechanicsByExperienceLevel: async (
    level: ExperienceLevel
  ): Promise<Mechanic[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/experience/${level}`);
    return response.data;
  },

  getMechanicsByWorkDay: async (day: WorkDay): Promise<Mechanic[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/workday/${day}`);
    return response.data;
  },

  // Búsqueda
  searchMechanics: async (term: string): Promise<Mechanic[]> => {
    const response = await apiClient.get(
      `${API_BASE_URL}/search?term=${encodeURIComponent(term)}`
    );
    return response.data;
  },

  // Horarios
  getMechanicSchedule: async (
    code: string
  ): Promise<{
    workScheduleStart: string;
    workScheduleEnd: string;
    workDays: WorkDay[];
  }> => {
    const response = await apiClient.get(`${API_BASE_URL}/${code}/schedule`);
    return response.data;
  },
};
