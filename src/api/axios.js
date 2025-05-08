import axios from "axios";
import { API_URL } from "../utils/config";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (res) => res, 
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh", {}, { 
          withCredentials: true,  
        });

        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error); 
  }
);

export default api;
