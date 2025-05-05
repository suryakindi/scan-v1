import axios from "axios";

const baseURL = "http://127.0.0.1:1337/api";
const token = localStorage.getItem("token");

interface ResponseT<T = unknown> {
  status: string;
  message: string;
  detailError: string | null;
  data: T;
}

export type { ResponseT };

/**
 * Cliet global API
 */
export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});
