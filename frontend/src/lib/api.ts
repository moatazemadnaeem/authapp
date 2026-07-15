import axios from "axios";
import { getAuthToken } from "@/app/actions/auth";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
