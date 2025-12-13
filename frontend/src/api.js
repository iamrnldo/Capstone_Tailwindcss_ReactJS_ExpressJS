import axios from "axios";

const api = axios.create({
  // Vite menggunakan import.meta.env untuk variabel lingkungan
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export default api;
