import axios from "axios";
import { secureStorage } from "../auth/secureStorage";

/** Cliente HTTP hacia el BFF Mobile, adjunta el Bearer Access Token. */
const client = axios.create({ baseURL: process.env.EXPO_PUBLIC_BFF_MOBILE_URL ?? "" });

client.interceptors.request.use(async (config) => {
  const token = await secureStorage.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const httpClient = client;
