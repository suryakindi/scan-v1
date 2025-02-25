import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig } from "axios";

const baseURL = "http://127.0.0.1:1337/api";

type XState = Record<string, unknown>;

type XStatus = "idle" | "loading" | "success" | "error";

type UseXStateReturn<T extends XState, R = unknown> = [
  T,
  (values: Partial<T>) => void,
  {
    submit: () => Promise<R>;
    reset: () => void;
    status: XStatus;
  }
];

/**
 * Custom hook to manage form state and handle API requests.
 *
 * @template T - The shape of the state.
 * @template R - The expected response type from the API request.
 *
 * @param {T} init - The initial state object.
 * @param {AxiosRequestConfig} config - Axios request configuration.
 * @returns {UseXStateReturn<T, R>} An array containing the state, update function, and API controls.
 *
 * @example
 * const [data, setData, { submit, reset, status }] = useXState(
 *   { username: "", password: "" },
 *   { method: "POST", url: "/login" }
 * );
 *
 * const handleSubmit = async () => {
 *   try {
 *     console.log("Status:", status); // idle or loading
 *     const response = await submit();
 *     console.log("Login successful:", response);
 *   } catch (error) {
 *     console.error("Login failed:", error);
 *   }
 * };
 */
export const useXState = <T extends XState, R = unknown>(
  init: T,
  config: AxiosRequestConfig
): UseXStateReturn<T, R> => {
  const [data, setDataState] = useState<T>(init);
  const [status, setStatus] = useState<XStatus>("idle");

  /**
   * Updates the state with new values.
   * @param {Partial<T>} values - Partial state to merge with the current state.
   */
  const setData = useCallback((values: Partial<T>) => {
    setDataState((prev) => ({ ...prev, ...values }));
  }, []);

  /**
   * Resets the state to its initial values.
   */
  const reset = useCallback(() => {
    setDataState(init);
    setStatus("idle");
  }, [init]);

  /**
   * Submits the data to the API and updates the status.
   * @returns {Promise<R>} The API response data.
   * @throws Will throw an error if the request fails.
   */
  const submit = useCallback(async (): Promise<R> => {
    setStatus("loading");
    try {
      const response = await axios({
        baseURL: config.baseURL ?? baseURL,
        ...config,
        ...(config.method?.toUpperCase() !== "GET" && { data }),
      });
      setStatus("success");
      return response.data as R;
    } catch (error) {
      setStatus("error");
      throw error;
    }
  }, [data, config]);

  return [data, setData, { submit, reset, status }];
};

export type { XStatus };
