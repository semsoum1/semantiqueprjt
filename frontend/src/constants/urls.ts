export const API_BASE_URL = 'http://192.168.11.104:8080';

export const AUTH_URLS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
};

export const BOOK_URLS = {
  GET_ALL: `${API_BASE_URL}/api/livres`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/api/livres/${id}`,
  CREATE: `${API_BASE_URL}/api/livres`,
  UPDATE: (id: number) => `${API_BASE_URL}/api/livres/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/api/livres/${id}`,
  BORROW: (id: number) => `${API_BASE_URL}/api/livres/${id}/emprunt`,
  RETURN: (id: number) => `${API_BASE_URL}/api/livres/${id}/retour`,
  GET_BORROWED: `${API_BASE_URL}/api/livres/emprunts`,
};