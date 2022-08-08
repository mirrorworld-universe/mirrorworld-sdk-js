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

export class MirrorWorld {
  // System variables
  _clientId: MirrorWorldOptions['clientId'];
  _apiKey: MirrorWorldOptions['apiKey'];
  _env: MirrorWorldOptions['env'];
  _api: MirrorWorldAPIClient;

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
        this.refreshAccessToken(autoLoginCredentials);
      }
    });
    this.emit('ready', undefined);
    return this;
  }

  /* Get sdk's api client instance */
  private get api() {
    return this._api;
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
  get user() {
    return this._user;
  }

  /** Get current user */
  get isLoggedIn() {
    return !!this._user?.email && !!this.userRefreshToken;
  }

  emit<T extends MirrorWorldEventKey>(event: T, payload: MirrorWorldEvents[T]) {
    return emitter.emit(event, payload);
  }

  on<T extends MirrorWorldEventKey>(
    event: T,
    handler: (payload: MirrorWorldEvents[T]) => any
  ) {
    return emitter.on(event, handler);
  }

  private defineInternalListeners() {
    this.on('ready', () => {
      if (this) {
      }
    });
  }

  private useCredentials({ accessToken }: { accessToken: string }) {
    const createAccessTokenInterceptor =
      (accessToken: string) => (config: AxiosRequestConfig) => {
        return {
          ...config,
          headers: {
            ...config.headers,
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        };
      };

    const credentialsInterceptorId = this.api.auth.interceptors.request.use(
      createAccessTokenInterceptor(accessToken)
    );

    this.on('logout', () => {
      this.api.auth.interceptors.request.eject(credentialsInterceptorId);
    });
  }

  async loginWithEmail(credentials: LoginEmailCredentials) {
    const response = await this.api.auth.post<
      IResponse<{
        access_token: string;
        refresh_token: string;
        user: IUser;
      }>
    >('/v1/auth/login', credentials);
    const accessToken = response.data.data.access_token;
    this.userRefreshToken = response.data.data.refresh_token;
    this._user = response.data.data.user;
    this.useCredentials({
      accessToken,
    });
    this.emit('login:email', this._user);
    this.emit('login', this._user);
    return this;
  }

  private async refreshAccessToken(refreshToken: string) {
    const response = await this.api.auth.get<
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
    this._user = user;
    this.useCredentials({
      accessToken,
    });
    this.emit('auth:refreshToken', undefined);
    return user;
  }

  async fetchUser(): Promise<IUser> {
    const response = await this.api.auth
      .get<IResponse<IUser>>('/v1/auth/me')
      .then();
    const user = response.data.data;
    this._user = user;
    return user;
  }

  private get authView() {
    return this._env === ClusterEnvironment.testnet
      ? `https://auth-staging.mirrorworld.fun/login`
      : this._env === ClusterEnvironment.mainnet
      ? `https://auth.mirrorworld.fun/login`
      : `https://auth-staging.mirrorworld.fun/login`;
  }

  async login() {
    console.log('Login');
    if (!canUseDom) {
      console.warn(`Auth Window Login is only available in the Browser.`);
    }

    const w = 380;
    const h = 720;

    // Check if user has multiple screens first.
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX;
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
        left=${left}
      `
    );
    if (!!window.focus && !!authWindow?.focus) authWindow.focus();

    window.addEventListener('message', async (event) => {
      const { deserialize } = await import('bson');
      console.debug('Message posted', event);
      if (event.data?.name === 'mw:auth:login') {
        const payload = deserialize(event.data.payload);
        console.info('User has logged in', payload);
        if (payload.access_token && payload.refresh_token) {
          this.userRefreshToken = payload.refresh_token;
          this.useCredentials({
            accessToken: payload.access_token,
          });
          await this.fetchUser();
          authWindow && authWindow.close();
        }
      }
    });
  }
}
