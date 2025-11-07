


import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000",
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete client.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

export default client;


