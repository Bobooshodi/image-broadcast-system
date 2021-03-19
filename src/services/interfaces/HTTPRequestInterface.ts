import { AxiosResponse } from "axios";

export interface HTTPRequestInterface {
  putAsync<T>(
    model: any,
    url: string,
    options?
  ): Promise<void | AxiosResponse<T>>;
  postAsync<T>(
    model: any,
    url: string,
    options?
  ): Promise<void | AxiosResponse<T>>;
  getAsync<T>(url: string, options?): Promise<void | AxiosResponse<T>>;
  getAllAsync<T>(url: string, options?): Promise<void | AxiosResponse<T>>;
  deleteAsync<T>(url: string, options?): Promise<void | AxiosResponse<T>>;
  handleError(error: Response | any);
  getLoggedInUserToken(): string;
}
