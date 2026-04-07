import axios from "axios";
//axios instance with base url and interceptor to add token to headers if it exists in local storage
const API = axios.create({
  baseURL: "https://mern-taskmanager-1-5ccb.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
