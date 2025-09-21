// Database connection is handled by the backend NestJS service
// Frontend communicates with backend via REST API

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  baseURL: API_URL,
  
  // Helper function for authenticated requests (client-side)
  async authenticatedFetch(url: string, options: RequestInit = {}) {
    // Safe localStorage access for client-side only
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    
    return fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  },

  // Helper function for server-side requests (no auth for now, for demo purposes)
  async serverFetch(url: string, options: RequestInit = {}) {
    return fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  },

  // User endpoints
  users: {
    profile: () => api.authenticatedFetch('/api/users/profile'),
    updateProfile: (data: any) => 
      api.authenticatedFetch('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    deleteAccount: () => 
      api.authenticatedFetch('/api/users/account', {
        method: 'DELETE',
      }),
  },

  // CV endpoints
  cvs: {
    list: () => api.authenticatedFetch('/api/cvs'),
    get: (id: string) => api.authenticatedFetch(`/api/cvs/${id}`),
    create: (data: any) => 
      api.authenticatedFetch('/api/cvs', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) => 
      api.authenticatedFetch(`/api/cvs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) => 
      api.authenticatedFetch(`/api/cvs/${id}`, {
        method: 'DELETE',
      }),
    duplicate: (id: string) => 
      api.authenticatedFetch(`/api/cvs/${id}/duplicate`, {
        method: 'POST',
      }),
    toggleVisibility: (id: string, isPublic: boolean) => 
      api.authenticatedFetch(`/api/cvs/${id}/visibility`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublic }),
      }),
  },

  // Auth endpoints
  auth: {
    register: (data: any) => 
      fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    login: (data: any) => 
      fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    magicLink: (data: any) => 
      fetch(`${API_URL}/api/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    refresh: (refreshToken: string) => 
      fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }),
    logout: () => 
      api.authenticatedFetch('/api/auth/logout', {
        method: 'POST',
      }),
  },
};