// import { api } from "./client";

// export async function loginRequest(body) {
//   const { data } = await api.post("/api/auth/login", body);
//   return data;
import axios from "./client";


export const loginRequest = async (credentials) => {
  const res = await axios.post("/api/auth/login", credentials);
  return res.data;
};


export const signupRequest = async (credentials) => {
  const res = await axios.post("/api/auth/signup", credentials);
  return res.data;
};


export const getProfile = async () => {
  const res = await axios.get("/api/auth/me");
  return res.data;
};
