import { ChainConfig, ChainTypes } from '../configuration';
import { ClusterEnvironment } from '../services/cluster';
import { IUser } from './user.type';

export interface MirrorWorldOptions {
  /**
   * API Key used to authenticate your API requests to Mirror World.
   */
  apiKey: string;
  /**
   * Environment wherein Mirror World APIs are executed.
   * @deprecated
   */
  env?: ClusterEnvironment;
  /**
   * When passed, the Mirror World SDK will automatically log in
   * the user using their `refresh_token`. This expects the
   * refresh token returned with the user when logging in.
   *
   * It is important to note that this `refresh_token`
   * can be used to authorize the user in your application's
   * `clientId` on Mirror World. You should therefore keep
   * this token securely and not accessible publicly.
   *
   * This refresh token is scoped to your application's
   * clientId. Therefore, it cannot be used to refresh authorization
   * in a different application. This is so that the user is
   * protected against
   * any potential malicious applications.
   */
  autoLoginCredentials?: string;
  /**
   * Is staging environment
   */
  staging?: boolean;
  /**
   * Wallet UI configuration options
   */
  walletUIConfig?: {
    uxMode: 'popup' | 'embedded';
  };
  /**
   * Authentication options
   */
  auth?: {
    // Authentication token
    authToken?: string;
    // Developer Secret Access Key
    secretAccessKey?: string;
  };

  /**
   * Chain configuration for Mirror World SDK
   */
  chainConfig: ChainConfig<ChainTypes>;
}

export type MirrorWorldEvents = {
  'login:email': IUser;
  login: unknown;
  logout?: never;
  ready?: never;
  'auth:refreshToken'?: string;
  'update:user': IUser;
  'chain:change': ChainConfig<ChainTypes>;
};

export type MirrorWorldEventKey = keyof MirrorWorldEvents;

export type WalletUIEvents = {
  close?: never;
  message: MessageEvent;
};
export type WalletUIEventKey = keyof WalletUIEvents;
