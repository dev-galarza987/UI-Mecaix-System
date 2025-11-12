import axios from 'axios';
import type { AxiosResponse } from 'axios';

// Configuración base de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_URL_PUBLIC_API || 'http://localhost:4000/api/v1',
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
} as const;

// Endpoints principales
export const ENDPOINTS = {
  AUTH: '/auth',
  CLIENTS: '/clients',
  VEHICLES: '/vehicles',
  SERVICES: '/services',
  RESERVATIONS: '/reservations',
  MECHANICS: '/mechanics',
  CLIENT_VEHICLE: '/client-vehicle',
  ORDERS: '/order',
} as const;

// Configuración de Axios por defecto
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Log inicial para debugging
console.log('🔧 [API CONFIG] Configuración inicial:', {
  baseURL: API_CONFIG.BASE_URL,
  env: import.meta.env.VITE_URL_PUBLIC_API,
  fallback: 'http://localhost:4000/api/v1'
});

// Interceptor de request - agregar token de autorización
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log de requests en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response - manejo de errores y respuestas
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de responses en desarrollo
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Manejo de error 401 - Token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Limpiar token y redirigir al login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      
      return Promise.reject(error);
    }
    
    // Retry automático para errores de red (solo GET requests)
    if (
      !error.response &&
      originalRequest.method === 'get' &&
      originalRequest._retryCount < API_CONFIG.RETRY_ATTEMPTS
    ) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      originalRequest._retryCount++;
      
      console.log(`🔄 Retry attempt ${originalRequest._retryCount} for ${originalRequest.url}`);
      
      // Esperar antes de reintentar
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      
      return apiClient(originalRequest);
    }
    
    // Log de errores
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    });
    
    return Promise.reject(error);
  }
);

// Funciones utilitarias para manejo de respuestas
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

export const handleApiError = (error: unknown): never => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
    // Error del servidor
    const message = axiosError.response?.data?.message || 'Error del servidor';
    throw new Error(`${axiosError.response?.status}: ${message}`);
  } else if (error && typeof error === 'object' && 'request' in error) {
    // Error de red
    throw new Error('Error de conexión. Verifica tu conexión a internet.');
  } else {
    // Otro tipo de error
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(errorMessage);
  }
};

// Función para construir URLs de endpoints
export const buildEndpoint = (endpoint: string, ...segments: (string | number)[]): string => {
  const baseEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const pathSegments = segments.filter(segment => segment !== undefined && segment !== null);
  
  if (pathSegments.length === 0) {
    return baseEndpoint;
  }
  
  return `${baseEndpoint}/${pathSegments.join('/')}`;
};

// Función para construir query strings
export const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
};

// Función para manejar upload de archivos
export const uploadFile = async (
  endpoint: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<unknown> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  
  if (onProgress) {
    Object.assign(config, {
      onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
        const progress = progressEvent.total
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        onProgress(progress);
      }
    });
  }
  
  const response = await apiClient.post(endpoint, formData, config);
  return handleApiResponse(response);
};

// Función para descargar archivos
export const downloadFile = async (
  endpoint: string,
  filename?: string
): Promise<void> => {
  const response = await apiClient.get(endpoint, {
    responseType: 'blob',
  });
  
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  window.URL.revokeObjectURL(url);
};

// Tipos para facilitar el uso
export type ApiResponse<T> = Promise<T>;
export type ApiError = {
  status?: number;
  message: string;
  code?: string;
};

export default apiClient;