import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { throwError as throwAppError } from '../errors/errors.interface';
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

const isValidAPIKey = (key: string) => key.startsWith('mw_');
const isValidTestAPIKey = (key: string) => key.startsWith('mw_test');
export const mapServiceKeyToEnvironment = (
  apiKey: string,
  environment: ClusterEnvironment,
  sso = false
) => {
  if (!isValidAPIKey(apiKey)) throwAppError('INVALID_API_KEY');
  if (isValidTestAPIKey(apiKey)) {
    //  Staging API Key
    if (environment !== ClusterEnvironment.testnet)
      throwAppError('INVALID_API_ENVIRONMENT');
    else
      return {
        environment: 'devnet',
        baseURL: sso
          ? 'https://api-staging.mirrorworld.fun'
          : 'https://api-staging.mirrorworld.fun/v1/devnet',
      };
  } else {
    //  Production API Key
    return {
      environment: 'mainnet',
      baseURL: sso
        ? 'https://api.mirrorworld.fun'
        : 'https://api.mirrorworld.fun/v1/mainnet',
    };
  }
};

export const mapServiceKeyToAuthView = (
  apiKey: string,
  environment: ClusterEnvironment
) => {
  if (!isValidAPIKey(apiKey)) throwAppError('INVALID_API_KEY');
  if (isValidTestAPIKey(apiKey)) {
    //  Staging API Key
    if (environment !== ClusterEnvironment.testnet)
      throwAppError('INVALID_API_ENVIRONMENT');
    else
      return {
        baseURL: 'https://auth-staging.mirrorworld.fun',
      };
  } else {
    //  Production API Key
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
  }: MirrorWorldAPIClientOptions) {
    const serviceParams = mapServiceKeyToEnvironment(apiKey, env, false)!;
    this.client = axios.create({
      withCredentials: true,
      baseURL: serviceParams.baseURL,
    });

    const params = mapServiceKeyToEnvironment(apiKey, env, true)!;
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
}

export function createAPIClient(
  { apiKey }: ClientOptions,
  environment = ClusterEnvironment.mainnet
): MirrorWorldAPIClient {
  return new MirrorWorldAPIClient({
    env: environment,
    apiKey,
  });
}
