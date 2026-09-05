import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://fixitnow-backend-assignment4.vercel.app/";

export const axioInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request befor go to the backend
axioInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Request before get to the backend data

axioInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global API Error Handeling
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  },
);
