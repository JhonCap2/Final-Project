import axios from 'axios';

// Determina la URL base de la API según el entorno.
// En producción (import.meta.env.PROD es true), usamos una ruta relativa ('/api')
// porque el frontend y el backend se sirven desde el mismo dominio.
// En desarrollo, usamos la URL completa del servidor local.
const baseURL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const API = axios.create({
  baseURL: baseURL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;