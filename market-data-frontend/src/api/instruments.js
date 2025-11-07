import axios from "./client";


export const subscribeInstrument = (symbol) =>
  axios
    .post("/api/instruments/subscribe", { instrument: symbol })
    .then((res) => res.data);


export const unsubscribeInstrument = (symbol) =>
  axios
    .post("/api/instruments/unsubscribe", { instrument: symbol })
    .then((res) => res.data);


export const getUserSubscriptions = () =>
  axios.get("/api/instruments/subscriptions").then((res) => res.data);
