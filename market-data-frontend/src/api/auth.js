import { api } from "./client";

export async function loginRequest(body) {
  const { data } = await api.post("/api/auth/login", body);
  return data;
}
