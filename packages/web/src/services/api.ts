import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { ClusterEnvironment } from './cluster';

export interface MirrorWorldAPIClientOptions {
  env?: ClusterEnvironment;
  apiKey: string;
  clientId?: string;
}

export interface ErrorAPIResponse {
  code: number;
  data?: null;
  error: string;
  message: string;
}

// Will set cookies when cookies are responded with by browser.
axios.defaults.withCredentials = true;

export function throwError(response: ErrorAPIResponse): void {
  const error = new Error(
    `E:${response.code}: ${response.error}: ${response.message}`
  );
  for (const prop in response) {
    error[prop] = response[prop];
  }
  console.error(error, response);
  throw error;
}

export function handleAPIError(response: ErrorAPIResponse): void {
  if ('code' in response) {
    throwError(response);
  }
}

export class MirrorWorldAPIClient {
  client: AxiosInstance;
  constructor({
    env = ClusterEnvironment.mainnet,
    apiKey,
    clientId,
  }: MirrorWorldAPIClientOptions) {
    this.client = axios.create({
      withCredentials: true,
      baseURL:
        env === ClusterEnvironment.testnet
          ? 'https://api-staging.mirrorworld.fun'
          : env === ClusterEnvironment.mainnet
          ? 'https://api.mirrorworld.fun'
          : env === ClusterEnvironment.local
          ? 'http://localhost:4000'
          : 'http://localhost:4000',
    });

    MirrorWorldAPIClient.defineRequestHandlers(this.client, apiKey);
    MirrorWorldAPIClient.defineErrorResponseHandlers(this.client);
  }

  static defineErrorResponseHandlers(client: AxiosInstance): void {
    client.interceptors.response.use((response) => {
      if (response.data.error && response.data.code && response.data.message) {
        handleAPIError(response.data);
      }
      return response;
    });
  }

  static defineRequestHandlers(
    client: AxiosInstance,
    apiKey: string,
    authToken?: string
  ): void {
    client.interceptors.request.use((config) => {
      const _config: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config.headers,
          ['x-api-key']: apiKey,
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        withCredentials: true,
      };
      return _config;
    });
  }
}

export interface ClientOptions {
  apiKey: string;
  clientId?: string;
}

export function createAPIClient(
  { apiKey, clientId }: ClientOptions,
  environment = ClusterEnvironment.mainnet
): MirrorWorldAPIClient {
  return new MirrorWorldAPIClient({
    env: environment,
    apiKey,
    clientId,
  });
}
