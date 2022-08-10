import {
  MirrorWorldEventKey,
  MirrorWorldEvents,
  MirrorWorldOptions,
} from './types/instance';
import { createAPIClient, MirrorWorldAPIClient } from './services/api';
import { ClusterEnvironment } from './services/cluster';
import { emitter } from './events/emitter';
import { clientOptionsSchema } from './validators';
import { LoginEmailCredentials } from './types/auth';
import { IResponse } from './types/response.type';
import { IUser } from './types/user.type';
import { AxiosRequestConfig } from 'axios';
import { canUseDom } from './utils';
import { ICreateVerifiedCollectionPayload, ISolanaNFT } from './types/nft';
import {
  ISolanaToken,
  TransferSOLPayload,
  TransferSPLTokenPayload,
} from './types/token';
import {
  ISolanaTransaction,
  ISolanaTransactionsPayload,
  ITransferSPLTokenResponse,
} from './types/transaction';
import {
  transferSOLSchema,
  transferSPLTokenSchema,
} from './validators/token.validators';
import { createVerifiedCollectionSchema } from './validators/nft.validators';

export class MirrorWorld {
  // System variables
  _clientId: MirrorWorldOptions['clientId'];
  _apiKey: MirrorWorldOptions['apiKey'];
  _env: MirrorWorldOptions['env'];
  _api: MirrorWorldAPIClient;
  _tokens: ISolanaToken[] = [];
  _transactions: ISolanaTransaction[] = [];

  // User variables
  _user?: IUser;

  // private values
  public userRefreshToken?: string;

  constructor(options: MirrorWorldOptions) {
    const result = clientOptionsSchema.validate(options);
    if (result.error) {
      throw result.error;
    }
    const {
      apiKey,
      clientId,
      env = ClusterEnvironment.mainnet,
      autoLoginCredentials,
    } = result.value;
    this._clientId = clientId;
    this._apiKey = apiKey;
    this._env = env;
    this._api = createAPIClient(
      {
        apiKey,
        clientId,
      },
      env
    );
    this.on('ready', async () => {
      if (autoLoginCredentials) {
        await this.refreshAccessToken(autoLoginCredentials);
        await this.defineInternalListeners();
      }
    });
    this.emit('ready', undefined);
    return this;
  }

  /* Get sdk's api client instance */
  private get api() {
    return this._api.client;
  }

  /** Get application's clientId instance */
  private get clientId(): string {
    return this._clientId;
  }

  /** Get application's apiKey instance */
  private get apiKey(): string {
    return this._apiKey;
  }

  /** Get instance's environment */
  get clusterEnv(): ClusterEnvironment {
    return this._env;
  }

  /** Get current user */
  get user(): IUser {
    return this._user!;
  }

  private set user(value: IUser) {
    this.emit('update:user', undefined);
    this._user = value;
  }

  /** Get current user tokens */
  get tokens(): ISolanaToken[] {
    return this._tokens;
  }

  /** Set current user tokens */
  private set tokens(value: ISolanaToken[]) {
    this._tokens = value;
  }

  /** Get current user transactions */
  get transactions(): ISolanaTransaction[] {
    return this._transactions;
  }

  /** Set current user transactions */
  private set transactions(value: ISolanaTransaction[]) {
    this._transactions = value;
  }

  /** Get current user */
  get isLoggedIn(): boolean {
    return !!this.user?.email && !!this.userRefreshToken;
  }

  emit<T extends MirrorWorldEventKey>(
    event: T,
    payload: MirrorWorldEvents[T]
  ): void {
    return emitter.emit(event, payload);
  }

  on<T extends MirrorWorldEventKey>(
    event: T,
    handler: (payload: MirrorWorldEvents[T]) => void
  ): void {
    return emitter.on(event, handler);
  }

  private defineInternalListeners() {
    this.on('update:user', async () => {
      console.debug('user updated');
    });
  }

  private useCredentials({ accessToken }: { accessToken: string }) {
    const createAccessTokenInterceptor =
      (accessToken: string) => (config: AxiosRequestConfig) => {
        return {
          ...config,
          headers: {
            ...config.headers,
            ['x-api-key']: this.apiKey,
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        };
      };

    const credentialsInterceptorId = this.api.interceptors.request.use(
      createAccessTokenInterceptor(accessToken)
    );

    this.on('logout', () => {
      this.api.interceptors.request.eject(credentialsInterceptorId);
    });
  }

  async loginWithEmail(
    credentials: LoginEmailCredentials
  ): Promise<MirrorWorld> {
    const response = await this.api.post<
      IResponse<{
        access_token: string;
        refresh_token: string;
        user: IUser;
      }>
    >('/v1/auth/login', credentials);
    const accessToken = response.data.data.access_token;
    this.userRefreshToken = response.data.data.refresh_token;
    this.user = response.data.data.user;
    this.useCredentials({
      accessToken,
    });
    this.emit('login:email', this.user);
    this.emit('login', this.user);
    return this;
  }

  private async refreshAccessToken(refreshToken: string) {
    const response = await this.api.get<
      IResponse<{
        access_token: string;
        refresh_token: string;
        user: IUser;
      }>
    >('/v1/auth/refresh-token', {
      headers: {
        'x-refresh-token': refreshToken,
      },
    });

    const accessToken = response.data.data.access_token;
    this.userRefreshToken = response.data.data.refresh_token;
    const user = response.data.data.user;
    this.user = user;
    this.useCredentials({
      accessToken,
    });
    this.emit('auth:refreshToken', this.userRefreshToken);
    return user;
  }

  async fetchUser(): Promise<IUser> {
    const response = await this.api.get<IResponse<IUser>>('/v1/auth/me').then();
    const user = response.data.data;
    this.user = user;
    return user;
  }

  private get authView() {
    return this._env === ClusterEnvironment.testnet
      ? `https://auth-staging.mirrorworld.fun/${this.apiKey}`
      : this._env === ClusterEnvironment.mainnet
      ? `https://auth.mirrorworld.fun/${this.apiKey}`
      : `https://auth-staging.mirrorworld.fun/${this.apiKey}`;
  }

  login() {
    return new Promise<{ user: IUser; refreshToken: string }>(
      async (resolve, reject) => {
        try {
          console.log('Login');
          if (!canUseDom) {
            console.warn(`Auth Window Login is only available in the Browser.`);
          }

          const w = 380;
          const h = 720;

          // Check if user has multiple screens first.
          const dualScreenLeft =
            window.screenLeft !== undefined
              ? window.screenLeft
              : window.screenX;
          const dualScreenTop =
            window.screenTop !== undefined ? window.screenTop : window.screenY;

          const width = window.innerWidth
            ? window.innerWidth
            : document.documentElement.clientWidth
            ? document.documentElement.clientWidth
            : screen.width;
          const height = window.innerHeight
            ? window.innerHeight
            : document.documentElement.clientHeight
            ? document.documentElement.clientHeight
            : screen.height;

          const systemZoom = width / window.screen.availWidth;
          const left = (width - w) / 2 / systemZoom + dualScreenLeft;
          const top = (height - h) / 2 / systemZoom + dualScreenTop;
          const authWindow = window.open(
            this.authView,
            '_blank',
            `
            popup=true
            width=${w},
            height=${h},
            top=${top},
            left=${left}`
          );
          if (!!window.focus && !!authWindow?.focus) authWindow.focus();

          window.addEventListener('message', async (event) => {
            const { deserialize } = await import('bson');
            if (event.data?.name === 'mw:auth:login') {
              const payload = deserialize(event.data.payload);
              console.debug('auth:payload', payload);
              if (payload.access_token && payload.refresh_token) {
                this.userRefreshToken = payload.refresh_token;
                this.useCredentials({
                  accessToken: payload.access_token,
                });
                await this.fetchUser();
                authWindow && authWindow.close();
                resolve({
                  user: this.user,
                  refreshToken: this.userRefreshToken!,
                });
              }
            }
          });
        } catch (e) {
          reject(e.message);
        }
      }
    );
  }

  /**
   * Fetches an NFT's mint address on Solana
   * @param mintAddress
   */
  async getNftDetails(mintAddress: string): Promise<ISolanaNFT> {
    const response = await this.api.get<IResponse<ISolanaNFT>>(
      `/v1/solana/nft/${mintAddress}`
    );
    return response.data.data;
  }

  /**
   * Fetches the current user's tokens
   */
  async getTokens(): Promise<ISolanaToken[]> {
    const response = await this.api.get<IResponse<ISolanaToken[]>>(
      `/v1/wallet/tokens`
    );
    const tokens = response.data.data;
    this.tokens = tokens;
    return tokens;
  }

  /**
   * Fetches the wallet transactions for a user
   */
  async getTransactions(): Promise<ISolanaTransaction[]> {
    const response = await this.api.get<IResponse<ISolanaTransactionsPayload>>(
      `/v1/wallet/transactions`
    );
    const transactions = response.data.data.transactions;
    this.transactions = transactions;
    return transactions;
  }

  /**
   * Transfer SPL token to a recipient
   */
  async transferSPLToken(payload: {
    recipientAddress: TransferSPLTokenPayload['to_publickey'];
    amount: TransferSPLTokenPayload['amount'];
    tokenMint: TransferSPLTokenPayload['token_mint'];
    tokenDecimals: TransferSPLTokenPayload['decimals'];
  }): Promise<ITransferSPLTokenResponse> {
    const result = transferSPLTokenSchema.validate({
      to_publickey: payload.recipientAddress,
      amount: payload.amount,
      token_mint: payload.tokenMint,
      decimals: payload.tokenDecimals,
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<ITransferSPLTokenResponse>(
      `/v1/wallet/transfer-token`,
      result.value
    );
    return response.data;
  }

  /**
   * Transfer SOL to wallet address
   */
  async transferSOL(payload: {
    recipientAddress: TransferSOLPayload['to_publickey'];
    amount: TransferSOLPayload['amount'];
  }): Promise<ITransferSPLTokenResponse> {
    const result = transferSOLSchema.validate({
      to_publickey: payload.recipientAddress,
      amount: payload.amount,
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<ITransferSPLTokenResponse>(
      `/v1/wallet/transfer-sol`,
      result.value
    );
    return response.data;
  }

  /**
   * @service Marketplace
   * Create Verified Collection
   */
  async createVerifiedCollection(payload: {
    name: ICreateVerifiedCollectionPayload['name'];
    symbol: ICreateVerifiedCollectionPayload['symbol'];
    metadataUri: ICreateVerifiedCollectionPayload['url'];
  }): Promise<ITransferSPLTokenResponse> {
    const result = createVerifiedCollectionSchema.validate({
      name: payload.name,
      symbol: payload.symbol,
      url: payload.metadataUri,
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<ITransferSPLTokenResponse>(
      `/v1/solana/mint/collection`,
      result.value
    );
    return response.data;
  }
}
