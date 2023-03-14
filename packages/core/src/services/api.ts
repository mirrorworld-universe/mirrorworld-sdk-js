import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ClusterEnvironment } from './cluster';

export interface MirrorWorldAPIClientOptions {
  env?: ClusterEnvironment;
  apiKey: string;
  clientId?: string;
  staging?: boolean;
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

const isValidAPIKey = (key: string) => key.startsWith('mw_');
export const mapServiceKeyToEnvironment = (
  apiKey: string,
  environment: ClusterEnvironment,
  sso = false,
  staging = false
) => {
  if (isValidAPIKey(apiKey)) {
    if (environment === ClusterEnvironment.testnet)
      return {
        environment: 'devnet',
        baseURL: sso
          ? `https://api${staging ? '-staging' : ''}.mirrorworld.fun`
          : `https://api${staging ? '-staging' : ''}.mirrorworld.fun/v1/devnet`,
      };
    else if (environment === ClusterEnvironment.mainnet)
      return {
        environment: 'mainnet',
        baseURL: sso
          ? `https://api${staging ? '-staging' : ''}.mirrorworld.fun`
          : `https://api${
              staging ? '-staging' : ''
            }.mirrorworld.fun/v1/mainnet`,
      };
    else if (environment === ClusterEnvironment.local)
      return {
        environment: 'devnet',
        baseURL: sso
          ? 'http://localhost:4000'
          : 'http://localhost:4000/v1/devnet',
      };
    else
      return {
        environment: 'mainnet',
        baseURL: sso
          ? `https://api${staging ? '-staging' : ''}.mirrorworld.fun`
          : `https://api${
              staging ? '-staging' : ''
            }.mirrorworld.fun/v1/mainnet`,
      };
  }
};

export const mapServiceKeyToAuthView = (
  apiKey: string,
  environment: ClusterEnvironment,
  staging = false
) => {
  if (staging) {
    return {
      baseURL: 'https://auth-staging.mirrorworld.fun',
    };
  } else {
    return {
      baseURL: 'https://auth.mirrorworld.fun',
    };
  }
};

export class MirrorWorldAPIClient {
  client: AxiosInstance;
  sso: AxiosInstance;
  constructor({
    env = ClusterEnvironment.mainnet,
    apiKey,
    staging = false,
  }: MirrorWorldAPIClientOptions) {
    const serviceParams = mapServiceKeyToEnvironment(
      apiKey,
      env,
      false,
      staging
    )!;
    this.client = axios.create({
      withCredentials: true,
      baseURL: serviceParams.baseURL,
    });

    const params = mapServiceKeyToEnvironment(apiKey, env, true, staging)!;
    this.sso = axios.create({
      withCredentials: true,
      baseURL: params.baseURL,
    });

    MirrorWorldAPIClient.defineRequestHandlers(this.client, apiKey);
    MirrorWorldAPIClient.defineRequestHandlers(this.sso, apiKey);
    MirrorWorldAPIClient.defineErrorResponseHandlers(this.client);
    MirrorWorldAPIClient.defineErrorResponseHandlers(this.sso);
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
  staging?: boolean;
}

export function createAPIClient(
  { apiKey, staging }: ClientOptions,
  environment = ClusterEnvironment.mainnet
): MirrorWorldAPIClient {
  return new MirrorWorldAPIClient({
    env: environment,
    apiKey,
    staging,
  });
}
