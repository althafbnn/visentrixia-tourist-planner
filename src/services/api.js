const TOKEN_KEY = 'visentrixia_jwt_token';

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.error(e);
  }
}

async function apiFetch(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include'
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  async getPlaces(params) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    return apiFetch(`/api/places?${query.toString()}`);
  },

  async getPlaceById(id) {
    return apiFetch(`/api/places/${id}`);
  },

  async getPlaceStats() {
    return apiFetch('/api/places/stats');
  },

  async createPlace(placeData) {
    return apiFetch('/api/places', {
      method: 'POST',
      body: JSON.stringify(placeData)
    });
  },

  async updatePlace(id, placeData) {
    return apiFetch(`/api/places/${id}`, {
      method: 'PUT',
      body: JSON.stringify(placeData)
    });
  },

  async deletePlace(id) {
    return apiFetch(`/api/places/${id}`, {
      method: 'DELETE'
    });
  },

  async register(payload) {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.token) setStoredToken(res.token);
    return res;
  },

  async login(credentials) {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (res.token) setStoredToken(res.token);
    return res;
  },

  async logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setStoredToken(null);
    }
  },

  async getMe() {
    return apiFetch('/api/auth/me');
  },

  async getSavedItineraries() {
    return apiFetch('/api/itineraries');
  },

  async saveItinerary(payload) {
    return apiFetch('/api/itineraries', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async deleteItinerary(id) {
    return apiFetch(`/api/itineraries/${id}`, {
      method: 'DELETE'
    });
  },

  async getAuditLogs() {
    return apiFetch('/api/admin/audit-logs');
  },

  async getEmergencyContacts() {
    return apiFetch('/api/emergency-contacts');
  }
};
