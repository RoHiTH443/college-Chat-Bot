// Centralized API client with configurable backend endpoint via Vite env.
const BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

const getToken = () => localStorage.getItem('token');

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data;
}

async function upload(path, formData) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: authHeader(),
    credentials: 'include',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  login: (email, password) => request('POST', '/auth/login', { email, password }),
  logout: () => request('POST', '/auth/logout'),
  me: () => request('GET', '/auth/me'),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboard = {
  adminStats: () => request('GET', '/dashboard/admin'),
  studentStats: () => request('GET', '/dashboard/student'),
};

// ── Queries ───────────────────────────────────────────────────────────────────
export const queries = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/queries${qs ? '?' + qs : ''}`);
  },
  create: (data) => request('POST', '/queries', data),
  update: (id, data) => request('PATCH', `/queries/${id}`, data),
  remove: (id) => request('DELETE', `/queries/${id}`),
};

// ── Documents ─────────────────────────────────────────────────────────────────
export const documents = {
  upload: (formData) => upload('/documents', formData),
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/documents${qs ? '?' + qs : ''}`);
  },
  remove: (id) => request('DELETE', `/documents/${id}`),
};

// ── Chat ──────────────────────────────────────────────────────────────────────
export const chat = {
  getSessions: () => request('GET', '/chat/sessions'),
  createSession: (title) => request('POST', '/chat/sessions', { title }),
  getSession: (id) => request('GET', `/chat/sessions/${id}`),
  sendMessage: (sessionId, text) =>
    request('POST', `/chat/sessions/${sessionId}/messages`, { text }),
  deleteSession: (id) => request('DELETE', `/chat/sessions/${id}`),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
export function saveSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}
