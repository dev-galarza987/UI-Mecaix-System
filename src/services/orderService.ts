import { apiClient } from './apiConfig';
import type { Client } from './clientService';
import type { Mechanic } from './mechanicService';
import type { Service } from './serviceService';
import type { Vehicle } from './vehicleService';

const API_BASE_URL = `/order`;

// Estados de orden
export type OrderStatus = 'pending' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled' | 'invoiced';

// Prioridad de orden
export type OrderPriority = 'low' | 'medium' | 'high' | 'urgent';

// Tipos de pago
export type PaymentType = 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'financing';

// Estados de pago
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';

export interface Order {
  id: number;
  orderCode: string;
  clientCode: number;
  vehicleId: number;
  mechanicId?: number;
  description: string;
  status: OrderStatus;
  priority: OrderPriority;
  estimatedCost?: number;
  finalCost?: number;
  estimatedHours?: number;
  actualHours?: number;
  startDate?: string;
  estimatedCompletionDate?: string;
  completionDate?: string;
  notes?: string;
  diagnosticNotes?: string;
  isWarranty?: boolean;
  warrantyExpiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  // Relaciones
  client?: Client;
  vehicle?: Vehicle;
  mechanic?: Mechanic;
  services?: OrderService[];
  invoice?: Invoice;
}

export interface OrderService {
  id: number;
  orderId: number;
  serviceId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  service?: Service;
}

export interface Invoice {
  id: number;
  orderId: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount?: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentType?: PaymentType;
  paymentDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderData {
  clientCode: number;
  vehicleId: number;
  mechanicId?: number;
  description: string;
  priority?: OrderPriority;
  estimatedCost?: number;
  estimatedHours?: number;
  estimatedCompletionDate?: string;
  notes?: string;
  diagnosticNotes?: string;
  isWarranty?: boolean;
  warrantyExpiryDate?: string;
  services?: Array<{
    serviceId: number;
    quantity: number;
    unitPrice?: number;
  }>;
}

export interface UpdateOrderData {
  mechanicId?: number;
  description?: string;
  status?: OrderStatus;
  priority?: OrderPriority;
  estimatedCost?: number;
  finalCost?: number;
  estimatedHours?: number;
  actualHours?: number;
  estimatedCompletionDate?: string;
  notes?: string;
  diagnosticNotes?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  priority?: OrderPriority;
  clientCode?: number;
  mechanicId?: number;
  vehicleId?: number;
  startDate?: string;
  endDate?: string;
  isWarranty?: boolean;
  minCost?: number;
  maxCost?: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  averageCompletionTime: number;
}

export interface InvoiceData {
  orderId: number;
  dueDate: string;
  tax: number;
  discount?: number;
  paymentType?: PaymentType;
  notes?: string;
}

export const orderService = {
  // CRUD básico de órdenes
  getAllOrders: async (filters?: OrderFilters): Promise<Order[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get(`${API_BASE_URL}?${params}`);
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  getOrderByCode: async (orderCode: string): Promise<Order> => {
    const response = await apiClient.get(`${API_BASE_URL}/code/${orderCode}`);
    return response.data;
  },

  createOrder: async (orderData: OrderData): Promise<Order> => {
    const response = await apiClient.post(API_BASE_URL, orderData);
    return response.data;
  },

  updateOrder: async (id: number, updateData: UpdateOrderData): Promise<Order> => {
    const response = await apiClient.patch(`${API_BASE_URL}/${id}`, updateData);
    return response.data;
  },

  deleteOrder: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_BASE_URL}/${id}`);
  },

  // Gestión de estado
  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const response = await apiClient.patch(`${API_BASE_URL}/${id}/status`, { status });
    return response.data;
  },

  startOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.patch(`${API_BASE_URL}/${id}/start`);
    return response.data;
  },

  completeOrder: async (id: number, finalCost?: number, actualHours?: number): Promise<Order> => {
    const response = await apiClient.patch(`${API_BASE_URL}/${id}/complete`, {
      finalCost,
      actualHours
    });
    return response.data;
  },

  cancelOrder: async (id: number, reason?: string): Promise<Order> => {
    const response = await apiClient.patch(`${API_BASE_URL}/${id}/cancel`, { reason });
    return response.data;
  },

  // Gestión de servicios en órdenes
  addServiceToOrder: async (orderId: number, serviceData: { serviceId: number; quantity: number; unitPrice?: number }): Promise<OrderService> => {
    const response = await apiClient.post(`${API_BASE_URL}/${orderId}/services`, serviceData);
    return response.data;
  },

  updateOrderService: async (orderId: number, orderServiceId: number, updateData: { quantity?: number; unitPrice?: number }): Promise<OrderService> => {
    const response = await apiClient.patch(`${API_BASE_URL}/${orderId}/services/${orderServiceId}`, updateData);
    return response.data;
  },

  removeServiceFromOrder: async (orderId: number, orderServiceId: number): Promise<void> => {
    await apiClient.delete(`${API_BASE_URL}/${orderId}/services/${orderServiceId}`);
  },

  // Consultas específicas
  getOrdersByClient: async (clientCode: number): Promise<Order[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/client/${clientCode}`);
    return response.data;
  },

  getOrdersByMechanic: async (mechanicId: number): Promise<Order[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/mechanic/${mechanicId}`);
    return response.data;
  },

  getOrdersByVehicle: async (vehicleId: number): Promise<Order[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/vehicle/${vehicleId}`);
    return response.data;
  },

  getOrdersByStatus: async (status: OrderStatus): Promise<Order[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/status/${status}`);
    return response.data;
  },

  getOrdersByDateRange: async (startDate: string, endDate: string): Promise<Order[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/date-range`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Estadísticas y reportes
  getOrderStats: async (startDate?: string, endDate?: string): Promise<OrderStats> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get(`${API_BASE_URL}/stats?${params}`);
    return response.data;
  },

  // Facturación
  createInvoice: async (invoiceData: InvoiceData): Promise<Invoice> => {
    const response = await apiClient.post(`${API_BASE_URL}/invoice`, invoiceData);
    return response.data;
  },

  getInvoiceByOrderId: async (orderId: number): Promise<Invoice> => {
    const response = await apiClient.get(`${API_BASE_URL}/${orderId}/invoice`);
    return response.data;
  },

  updateInvoicePayment: async (invoiceId: number, paymentData: { paymentStatus: PaymentStatus; paymentType?: PaymentType; paymentDate?: string }): Promise<Invoice> => {
    const response = await apiClient.patch(`${API_BASE_URL}/invoice/${invoiceId}/payment`, paymentData);
    return response.data;
  },

  // Búsqueda avanzada
  searchOrders: async (query: string): Promise<Order[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  },

  // Asignación de mecánico
  assignMechanic: async (orderId: number, mechanicId: number): Promise<Order> => {
    const response = await apiClient.patch(`${API_BASE_URL}/${orderId}/assign-mechanic`, {
      mechanicId
    });
    return response.data;
  },

  // Calcular costos
  calculateEstimatedCost: async (orderId: number): Promise<{ estimatedCost: number }> => {
    const response = await apiClient.get(`${API_BASE_URL}/${orderId}/calculate-cost`);
    return response.data;
  },
};