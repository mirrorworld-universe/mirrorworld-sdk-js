import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ChainConfig, ChainTypes } from '../configuration';
import { match } from '../utils';

export interface ClientOptionsV2 {
  apiKey: string;
}

export interface ErrorAPIResponse {
  code: number;
  data?: null;
  error: string;
  message: string;
}

export interface MirrorWorldAPIClientV2Options {
  apiKey: string;
  staging?: boolean;
}

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

/**
 * Create a new MirrorWorld API V2 client.
 */
export function createAPIClientV2(
  { apiKey }: ClientOptionsV2,
  staging = false
): MirrorWorldAPIClientV2 {
  return new MirrorWorldAPIClientV2({
    apiKey,
    staging,
  });
}

export const MIRROR_WORLD_API_SERVICES = [
  'auth',
  'asset',
  'wallet',
  'metadata',
] as const;
export type MirrorWorldAPIService = typeof MIRROR_WORLD_API_SERVICES[number];
export interface ServiceBaseURLConfig {
  baseURL: string;
  name: MirrorWorldAPIService;
}
export interface CreateAPIBaseURLOptions {
  staging: boolean;
}
/**
 * Create the base URL for each service.
 * @param options
 * @returns
 */
function createBaseURL(
  options: CreateAPIBaseURLOptions
): ServiceBaseURLConfig[] {
  const { staging } = options;
  const authServiceBaseURL = `https://api${
    staging ? '-staging' : ''
  }.mirrorworld.fun/v2/auth`;
  const chainServiceBaseURL = (service: Omit<MirrorWorldAPIService, 'auth'>) =>
    `https://api${staging ? '-staging' : ''}.mirrorworld.fun/v2`;
  return MIRROR_WORLD_API_SERVICES.map((service) => {
    return match<MirrorWorldAPIService, ServiceBaseURLConfig>(service, {
      auth: {
        name: 'auth',
        baseURL: authServiceBaseURL,
      },
      asset: {
        name: 'asset',
        baseURL: chainServiceBaseURL('asset'),
      },
      wallet: {
        name: 'wallet',
        baseURL: chainServiceBaseURL('wallet'),
      },
      metadata: {
        name: 'metadata',
        baseURL: chainServiceBaseURL('metadata'),
      },
    });
  });
}
export function cp<T extends ChainConfig<ChainTypes>>(
  chainConfig: T,
  service: MirrorWorldAPIService
): ChainConfigString<T> {
  return `${chainConfig.chain}/${chainConfig.network}/${service}` as ChainConfigString<T>;
}

type ChainConfigString<T extends ChainConfig<ChainTypes>> =
  `${T['chain']}/${T['network']}`;

export interface APIServiceConfig extends ServiceBaseURLConfig {
  apiKey: string;
}

export class MirrorWorldAPIClientV2 {
  api: Map<MirrorWorldAPIService, AxiosInstance> = new Map();
  constructor({ apiKey, staging = false }: MirrorWorldAPIClientV2Options) {
    const apiServices = createBaseURL({ staging });

    const clients = apiServices.reduce((acc, current) => {
      const client = axios.create({
        withCredentials: true,
        baseURL: current.baseURL,
        headers: {
          'x-api-key': apiKey,
        },
      });
      acc.set(current.name, client);
      return acc;
    }, new Map<MirrorWorldAPIService, AxiosInstance>());

    clients.forEach((client) => {
      MirrorWorldAPIClientV2.defineRequestHandlers(client, apiKey);
      MirrorWorldAPIClientV2.defineErrorResponseHandlers(client);
    });

    this.api = clients;
  }

  get client(): Map<MirrorWorldAPIService, ReturnType<typeof this.api.get>> {
    return this.api!;
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
