import type { UseFetchOptions } from "nuxt/app";
import type { Data } from "@/types";
type Methods = "GET" | "POST" | "DELETE" | "PUT";

const BASE_URL = "http://127.0.0.1:3000";

class HttpRequest {
  request<T>(
    url: string,
    method: Methods,
    options?: UseFetchOptions<any>
  ): Promise<Data<T>> {
    return new Promise(async (resolve, reject) => {
      const reqOptions: UseFetchOptions<any> = {
        baseURL: BASE_URL,
        method,
        headers: {
          authorization: "afhuosifhsoiufh",
        },
        ...options,
      };
      try {
        const { data, refresh, status } = await useFetch(url, reqOptions);
        resolve({
          data: data.value,
          refresh,
          status: status.value,
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  get<T>(url: string, options?: UseFetchOptions<any>): Promise<Data<T>> {
    return this.request<T>(url, "GET", options);
  }
  delete<T>(url: string, options?: UseFetchOptions<any>): Promise<Data<T>> {
    return this.request<T>(url, "DELETE", options);
  }
  post<T>(url: string, options?: UseFetchOptions<any>): Promise<Data<T>> {
    return this.request<T>(url, "POST", options);
  }
  put<T>(url: string, options?: UseFetchOptions<any>): Promise<Data<T>> {
    return this.request<T>(url, "PUT", options);
  }
}

const server = new HttpRequest();

export default server;
