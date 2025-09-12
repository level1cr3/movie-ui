import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7145/api",
  timeout: 10000, // 10s seconds default.
}); // this create method gives me axios Instance

// Example of overriding for a long-running request
// axiosInstance.get("/big-report", { timeout: 30000 });

// request interceptor (eg: to add auth token, audit logging)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // later get it from better place.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor (eg : error handling, refresh token etc)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // handle refresh token or redirect to login
      console.log("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error); //centerlize error logging
  }
);

export default api;
