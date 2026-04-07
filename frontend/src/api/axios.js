import axios from "axios";

// axios instance with base URL from Vite env or local fallback.
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://mern-taskmanager-63fr.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
