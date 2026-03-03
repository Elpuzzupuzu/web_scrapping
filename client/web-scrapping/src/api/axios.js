import axios from "axios";

const api = axios.create({
  // Ajusta la URL según el puerto donde corra tu backend (Node/Express)
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para peticiones (Útil si añades autenticación después)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas (Captura errores globales)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí podrías manejar errores 401 para cerrar sesión automáticamente
    if (error.response?.status === 401) {
      console.error("No autorizado, redirigiendo al login...");
    }
    return Promise.reject(error);
  }
);

export default api;