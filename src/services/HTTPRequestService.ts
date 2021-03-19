import { injectable } from "inversify";
import axios from "axios";

import { HTTPRequestInterface } from "./interfaces/HTTPRequestInterface";

@injectable()
export class HttpRequestService implements HTTPRequestInterface {
  private httpClient = axios;

  putAsync<T>(model: any, url: string, options = {}) {
    const token = this.getLoggedInUserToken();
    if (token) {
      return this.httpClient
        .put<T>(url, model, {
          headers: { Authorization: `bearer: ${token}`, ...options },
        })
        .catch(this.handleError);
    } else {
      return this.httpClient
        .put<T>(url, model, options)
        .catch(this.handleError);
    }
  }

  postAsync<T>(model: any, url: string, options = {}) {
    const token = this.getLoggedInUserToken();
    if (token) {
      return this.httpClient
        .post<T>(url, model, {
          headers: { Authorization: `bearer: ${token}` },
          ...options,
        })
        .catch(this.handleError);
    } else {
      return this.httpClient
        .post<T>(url, model, options)
        .catch(this.handleError);
    }
  }

  getAsync<T>(url: string, options = {}) {
    const token = this.getLoggedInUserToken();
    if (token) {
      return this.httpClient
        .get<T>(url, {
          headers: { Authorization: `bearer: ${token}` },
          ...options,
        })
        .catch(this.handleError);
    } else {
      return this.httpClient.get<T>(url, options).catch(this.handleError);
    }
  }

  getAllAsync<T>(url: string, options = {}) {
    const token = this.getLoggedInUserToken();
    if (token) {
      return this.httpClient
        .get<T>(url, {
          headers: { Authorization: `bearer: ${token}` },
          ...options,
        })
        .catch(this.handleError);
    } else {
      return this.httpClient.get<T>(url, options).catch(this.handleError);
    }
  }

  deleteAsync<T>(url: string, options = {}) {
    const token = this.getLoggedInUserToken();
    if (token) {
      return this.httpClient
        .delete<T>(url, {
          headers: { Authorization: `bearer: ${token}` },
          ...options,
        })
        .catch(this.handleError);
    } else {
      return this.httpClient.delete<T>(url, options).catch(this.handleError);
    }
  }

  handleError(error: Response | any) {
    console.error("ApiService::handleError", error);

    Promise.reject(error);
  }

  getLoggedInUserToken() {
    return undefined;
  }
}
