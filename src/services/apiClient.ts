import axios, { AxiosInstance } from 'axios';
import { config } from '../config/config';
import { Logger } from '../utils/logger';
import { getErrorMessage } from '../utils/responseFormatter';

export class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: 5000, // 5 seconds (as per bonus)
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Simple retry logic (1 retry)
        if (error.config && !error.config.__isRetryRequest) {
          error.config.__isRetryRequest = true;
          Logger.info(`Retrying request: ${error.config.url}`);
          return this.client(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.client.get<T>(url, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Logger.error(`API Error: ${error.message} - ${url}`, error.response?.data);
        throw new Error(`API Error: ${error.message}`);
      }
      Logger.error(`Network Error: ${getErrorMessage(error)} - ${url}`);
      throw error;
    }
  }
}
