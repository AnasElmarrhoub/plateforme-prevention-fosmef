// Client API centralisé — connecté au backend Spring Boot sur le port 8081
const API_BASE = 'http://localhost:8081/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fosmef_token');
  }
  return null;
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `Erreur ${res.status}`;
    try {
      const body = await res.json();
      errorMsg = body.message || body.error || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, role: 'ADHERENT' }),
    }),

  getMe: () => request('/auth/me'),
};

// ─── Campagnes ───────────────────────────────────────────────────────────────

export const campagnesApi = {
  getAll: () => request('/campagnes'),

  getById: (id) => request(`/campagnes/${id}`),

  create: (data) =>
    request('/campagnes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/campagnes/${id}`, {
      method: 'DELETE',
    }),
};

// ─── Réservations ────────────────────────────────────────────────────────────

export const reservationsApi = {
  reserver: (campagneId) =>
    request('/reservations', {
      method: 'POST',
      body: JSON.stringify({ campagneId }),
    }),

  getMesReservations: () => request('/reservations/mes-reservations'),

  getAllReservations: () => request('/reservations'),

  getReservationsByCampagne: (campagneId) => request(`/reservations/campagne/${campagneId}`),

  annuler: (id) =>
    request(`/reservations/${id}`, {
      method: 'DELETE',
    }),
};
