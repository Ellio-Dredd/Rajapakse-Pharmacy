import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-18234cd5`;

// Helper function to make API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
}

// ==================== PRODUCTS API ====================

export const productsAPI = {
  getAll: async () => {
    return apiCall('/products');
  },
  
  getById: async (id: string) => {
    return apiCall(`/products/${id}`);
  },
  
  create: async (product: any) => {
    return apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },
  
  update: async (id: string, product: any) => {
    return apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== ORDERS API ====================

export const ordersAPI = {
  getAll: async () => {
    return apiCall('/orders');
  },
  
  getById: async (id: string) => {
    return apiCall(`/orders/${id}`);
  },
  
  create: async (order: any) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },
  
  updateStatus: async (id: string, status: string) => {
    return apiCall(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// ==================== DOCTORS API ====================

export const doctorsAPI = {
  getAll: async () => {
    return apiCall('/doctors');
  },
  
  getById: async (id: string) => {
    return apiCall(`/doctors/${id}`);
  },
  
  create: async (doctor: any) => {
    return apiCall('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctor),
    });
  },
  
  update: async (id: string, doctor: any) => {
    return apiCall(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctor),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/doctors/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== APPOINTMENTS API ====================

export const appointmentsAPI = {
  getAll: async () => {
    return apiCall('/appointments');
  },
  
  getById: async (id: string) => {
    return apiCall(`/appointments/${id}`);
  },
  
  create: async (appointment: any) => {
    return apiCall('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  },
  
  updateStatus: async (id: string, status: string) => {
    return apiCall(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  
  cancel: async (id: string) => {
    return apiCall(`/appointments/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== PRESCRIPTIONS API ====================

export const prescriptionsAPI = {
  getAll: async () => {
    return apiCall('/prescriptions');
  },
  
  submit: async (prescription: any) => {
    return apiCall('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescription),
    });
  },
  
  updateStatus: async (id: string, status: string) => {
    return apiCall(`/prescriptions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// ==================== USERS API ====================

export const usersAPI = {
  getAll: async () => {
    return apiCall('/users');
  },
  
  getById: async (id: string) => {
    return apiCall(`/users/${id}`);
  },
  
  update: async (id: string, user: any) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },
  
  updateRole: async (id: string, role: string) => {
    return apiCall(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
};

// ==================== ANALYTICS API ====================

export const analyticsAPI = {
  getDashboard: async () => {
    return apiCall('/analytics/dashboard');
  },
};

// ==================== CATEGORIES API ====================

export const categoriesAPI = {
  getAll: async () => {
    return apiCall('/categories');
  },
  
  getById: async (id: string) => {
    return apiCall(`/categories/${id}`);
  },
  
  getWithProducts: async (id: string) => {
    return apiCall(`/categories/${id}/products`);
  },
  
  create: async (category: any) => {
    return apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },
  
  update: async (id: string, category: any) => {
    return apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
  
  seed: async () => {
    return apiCall('/categories/seed', {
      method: 'POST',
    });
  },
};