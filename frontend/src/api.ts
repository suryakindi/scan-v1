import axios, { type AxiosInstance } from "axios";

const client: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
