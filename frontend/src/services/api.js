import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";

const API = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

// attach Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (email, password) =>
  API.post("/auth/register", { email, password }).then(r => r.data);

export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.access_token);
  return res.data;
};

// Clients
export const createClient = (name, rnc) =>
  API.post("/clients/", { name, rnc }).then(r => r.data);

export const getClients = () =>
  API.get("/clients/").then(r => r.data);
