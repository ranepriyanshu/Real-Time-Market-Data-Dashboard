import { api } from "./client";

export async function subscribeInstrument(instrument) {
  const { data } = await api.post("/api/instruments/subscribe", { instrument });
  return data;
}
