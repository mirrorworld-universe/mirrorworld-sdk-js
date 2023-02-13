import { AxiosRequestConfig } from 'axios';
import qs from 'query-string';
import type * as CSS from 'csstype';
import {
  MirrorWorldEventKey,
  MirrorWorldEvents,
  MirrorWorldOptions,
  WalletUIEvents,
} from './types/instance';
import {
  createAPIClient,
  mapServiceKeyToAuthView,
  MirrorWorldAPIClient,
} from './services/api';
import { ClusterEnvironment } from './services/cluster';
import { emitter, windowEmitter } from './events/emitter';
import { clientOptionsSchema } from './validators';
import { LoginEmailCredentials } from './types/auth';
import { IPaginatedResponse, IResponse } from './types/response.type';
import { IUser, UserWithWallet, Wallet } from './types/user.type';
import { canUseDom } from './utils';
import { animate } from 'motion';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { hideOthers } from 'aria-hidden';

import {
  BuyNFTPayload,
  CancelListingPayload,
  CreateVerifiedCollectionPayload,
  ISolanaNFT,
  ISolanaNFTMintResult,
  IVerifiedCollection,
  ListNFTPayload,
  MintNFTPayload,
  QueryNFTsByCreatorsPayload,
  QueryNFTsByMintAddressesPayload,
  QueryNFTsByOwnersPayload,
  QueryNFTsByUpdateAuthoritiesPayload,
  SolanaCommitment,
  SolanaNFTAuctionActivitiesPayload,
  SolanaNFTExtended,
  TransferNFTPayload,
  UpdateListingPayload,
  UpdateNFTPayload,
} from './types/nft';
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
import {
  createVerifiedCollectionSchema,
  fetchNFTsByCreatorAddressesSchema,
  fetchNFTsByMintAddressesSchema,
  fetchNFTsByOwnerAddressesSchema,
  fetchNFTsByUpdateAuthoritiesSchema,
  mintNFTSchema,
  transferNFTSchema,
  updateNFTSchema,
} from './validators/nft.validators';
import {
  buyNFTSchema,
  cancelNFTListingSchema,
  createMarketplaceSchema,
  listNFTSchema,
  updateMarketplaceSchema,
} from './validators/marketplace.validators';
import {
  CreateMarketplacePayload,
  IMarketplaceQueryResult,
  IMarketplaceResponse,
  INFTListing,
  Marketplace,
  MarketplaceQueryOptions,
  UpdateMarketplacePayload,
} from './types/marketplace';
import { throwError } from './errors/errors.interface';
import { IAction, ICreateActionPayload } from './types/actions';
import { createActionSchema } from './validators/action.validator';
import { Emitter } from 'mitt';

export class MirrorWorld {
  // System variables
  _apiKey: MirrorWorldOptions['apiKey'];
  _env: MirrorWorldOptions['env'];
  _staging: MirrorWorldOptions['staging'];
  _api: MirrorWorldAPIClient;
  _tokens: ISolanaToken[] = [];
  _transactions: ISolanaTransaction[] = [];
  _nfts: SolanaNFTExtended[] = [];

  // User variables
  _user?: UserWithWallet;
  _uxMode: 'embedded' | 'popup' = 'embedded';

  windowEmitter: Emitter<WalletUIEvents> = windowEmitter;

  // private values
  public userRefreshToken?: string;

  constructor(options: MirrorWorldOptions) {
    const result = clientOptionsSchema.validate(options);
    console.debug('config options', result.value);
    if (result.error) {
      throw result.error;
    }
    const {
      apiKey,
      env = ClusterEnvironment.mainnet,
      autoLoginCredentials,
      staging = false,
    } = result.value;
    this._staging = staging;
    this._apiKey = apiKey;
    this._env = env;
    this._api = createAPIClient(
      {
        apiKey,
        staging,
      },
      env
    );
    this._uxMode = options.walletUIConfig?.uxMode || 'embedded';
    this.on('ready', async () => {
      if (autoLoginCredentials) {
        console.debug({
          autoLoginCredentials,
        });
        await this.refreshAccessToken(autoLoginCredentials);
        this.defineInternalListeners();
      }
    });
    if (options.auth?.authToken) {
      this.useCredentials({
        accessToken: options.auth.authToken,
      });
    }
    this.emit('ready', undefined);
    return this;
  }

  async openEmbeddedWallet(path = '/'): Promise<Window | undefined> {
    const isMobile = window.innerWidth < 768;
    const iframeMobileStyles: CSS.Properties = {
      width: '100vw',
      height: '95vh',
    };

    const iframeStyles: CSS.Properties = {
      border: 'none',
      width: '375px',
      height: '80vh',
      ...(isMobile && iframeMobileStyles),
    };

    const portalStyles: CSS.Properties = {
      width: '0px',
      height: '0px',
      position: 'absolute',
      zIndex: 999999999,
      top: 0,
      left: 0,
    };

    // Iframe portal
    if (document.getElementById('mirrorworld-wallet-ui-portal')) return;
    const portal = document.createElement('div');
    portal.id = 'mirrorworld-wallet-ui-portal';
    portal.dataset.mirrorworld = 'wallet-ui-portal';
    Object.assign(portal.style, portalStyles);

    // Create window backdrop
    const portalBackdropStyles: CSS.Properties = {
      width: '100vw',
      height: '100vh',
      inset: '0px',
      position: 'absolute',
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      opacity: 0,
    };

    const portalBackdrop = document.createElement('div');
    portalBackdrop.dataset.mirrorworld = 'wallet-ui-backdrop';
    Object.assign(portalBackdrop.style, portalBackdropStyles);
    portal.appendChild(portalBackdrop);

    // Create portal content
    const portalContentStyles: CSS.Properties = {
      width: '100vw',
      height: '100vh',
      inset: '0px',
      position: 'fixed',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
      transform: `scale(0.9)`,
    };

    const portalContent = document.createElement('div');
    portalContent.dataset.mirrorworld = 'wallet-ui-content';
    Object.assign(portalContent.style, portalContentStyles);
    portal.appendChild(portalContent);

    // Create portal body
    const portalBodyStyles: CSS.Properties = {
      // borderRadius: '20px',
      overflow: 'hidden',
    };
    const portalBody = document.createElement('div');
    portalBody.dataset.mirrorworld = 'wallet-ui-body';
    Object.assign(portalBody.style, portalBodyStyles);
    portalContent.appendChild(portalBody);

    // Check if iframe is already mounted. If not bail
    if (document.getElementById('mirrorworld-wallet-ui')) return;

    console.debug('mounting iframe');
    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, iframeStyles);
    iframe.src = `${this.authView}${path}`;
    iframe.id = 'mirrorworld-wallet-ui';
    portalBody.appendChild(iframe);

    // Append portal to body
    document.body.appendChild(portal);

    const childWindow = (
      document.getElementById('mirrorworld-wallet-ui') as HTMLIFrameElement
    )?.contentWindow;

    if (!childWindow) {
      console.debug('could not find iframe. bailing');
      return;
    }

    function iframeLoaded() {
      return new Promise((resolve) => {
        iframe.addEventListener('load', () => {
          resolve(true);
        });
      });
    }

    console.debug(
      'found wallet ui iframe. adding event listener...',
      childWindow
    );

    window.addEventListener('message', (message) => {
      // Ignore messages not from iframe
      if (message.source !== childWindow) {
        return;
      }
      windowEmitter.emit('message', message);
    });

    await iframeLoaded();

    const unhideOthers = hideOthers(portalContent);
    disableBodyScroll(portalContent);
    // Animate
    const mountAnimationPromises = [
      animate(portalBackdrop, {
        opacity: [0, 1],
      }).finished,

      animate(portalContent, {
        opacity: [0, 1],
        scale: [0.9, 1],
      }).finished,
    ];
    async function unmountIframes() {
      unhideOthers();
      enableBodyScroll(portalContent);

      const unmountAnimationPromises = [
        animate(portalBackdrop, {
          opacity: [1, 0],
        }).finished,
        animate(portalContent, {
          opacity: [1, 0],
          scale: [1, 0.9],
        }).finished,
      ];

      await Promise.all(unmountAnimationPromises);
      document.body.removeChild?.(portal);
    }

    windowEmitter.on('close', unmountIframes);
    await Promise.all(mountAnimationPromises);

    portalContent.addEventListener('click', unmountIframes);
    portalBackdrop.addEventListener('click', unmountIframes);

    window.addEventListener('beforeunload', () => {
      portalContent.removeEventListener('click', unmountIframes);
      portalBackdrop.removeEventListener('click', unmountIframes);
    });

    async function close() {
      unmountIframes();
    }
    childWindow.close = close;
    return childWindow;
  }

  /* Get sdk's api client instance */
  private get api() {
    return this._api.client;
  }

  /* Get sdk's api client instance */
  private get sso() {
    return this._api.sso;
  }

  /** Get application's apiKey instance */
  private get apiKey(): string {
    return this._apiKey;
  }

  /** Get instance's environment */
  get clusterEnv(): ClusterEnvironment {
    return this._env;
  }

  /** Get instance's environment */
  get network(): 'mainnet' | 'devnet' {
    return this._env === ClusterEnvironment.mainnet
      ? 'mainnet'
      : this._env === ClusterEnvironment.testnet
      ? 'devnet'
      : 'devnet';
  }

  /** Get current user */
  get user(): UserWithWallet {
    return this._user!;
  }

  private set user(value: UserWithWallet) {
    this.emit('update:user', undefined);
    this._user = value;
  }

  /** Get current user's wallet */
  get wallet(): Wallet {
    return this._user!.wallet!;
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

  get nfts(): SolanaNFTExtended[] {
    return this._nfts;
  }

  set nfts(value: SolanaNFTExtended[]) {
    this._nfts = value;
  }

  /** Get current user */
  get isLoggedIn(): boolean {
    return !!this.user && !!this.userRefreshToken;
  }

  private static emit<T extends MirrorWorldEventKey>(
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

  emit<T extends MirrorWorldEventKey>(
    event: T,
    payload: MirrorWorldEvents[T]
  ): void {
    return emitter.emit(event, payload);
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

    const serviceCredentialsInterceptorId = this.api.interceptors.request.use(
      createAccessTokenInterceptor(accessToken)
    );
    const ssoCredentialsInterceptorId = this.sso.interceptors.request.use(
      createAccessTokenInterceptor(accessToken)
    );

    this.on('logout', () => {
      this.api.interceptors.request.eject(serviceCredentialsInterceptorId);
      this.api.interceptors.request.eject(ssoCredentialsInterceptorId);
    });
  }

  async loginWithEmail(
    credentials: LoginEmailCredentials
  ): Promise<MirrorWorld> {
    const response = await this.sso.post<
      IResponse<{
        access_token: string;
        refresh_token: string;
        user: UserWithWallet;
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

  async logout(): Promise<void> {
    try {
      await this.sso.post('/v1/auth/logout');
      this._user = undefined;
      this.emit('logout', null);
    } catch (e) {}
  }

  private async refreshAccessToken(refreshToken: string) {
    const response = await this.sso.get<
      IResponse<{
        access_token: string;
        refresh_token: string;
        user: UserWithWallet;
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
    const response = await this.sso
      .get<IResponse<UserWithWallet>>('/v1/auth/me')
      .then();
    const user = response.data.data;
    this.user = user;
    return user;
  }

  private get authView() {
    const result = mapServiceKeyToAuthView(
      this.apiKey,
      this._env,
      this._staging
    )!;
    return `${result.baseURL}`;
  }

  /**
   * Opens wallet window
   * @param path
   * @private
   */
  private async openPopupWallet(path?: string): Promise<Window | undefined> {
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
    const authWindow =
      (await window.open(
        `${this.authView}${path}`,
        '_blank',
        `
        popup=true
        width=${w},
        height=${h},
        top=${top},
        left=${left}`
      )) || undefined;
    if (!!window.focus && !!authWindow?.focus) authWindow.focus();

    return authWindow;
  }

  public async openWallet(path?: string): Promise<Window | undefined> {
    if (this._uxMode === 'popup') {
      return this.openPopupWallet(path);
    } else if (this._uxMode === 'embedded') {
      return this.openEmbeddedWallet(path);
    }
  }

  /***
   * Logs in a user. Opens a popup window for the login operation
   */
  login() {
    return new Promise<{ user: IUser; refreshToken: string }>(
      async (resolve, reject) => {
        try {
          let authWindow: Window | undefined = undefined;
          const handleWalletUIMessage = async (event: MessageEvent) => {
            const { deserialize } = await import('bson');
            if (event.data?.name === 'mw:auth:login') {
              const payload = deserialize(event.data.payload);
              console.debug('auth:payload ===>', payload);
              if (payload.access_token && payload.refresh_token) {
                this.userRefreshToken = payload.refresh_token;
                this.useCredentials({
                  accessToken: payload.access_token,
                });
                await this.fetchUser();
                console.debug('authWindow', authWindow);
                if (authWindow) {
                  authWindow && authWindow.close();
                } else {
                  windowEmitter.emit('close');
                }
                resolve({
                  user: this.user,
                  refreshToken: this.userRefreshToken!,
                });
              }
            }
            if (event.data.name === 'mw:auth:close') {
              windowEmitter.emit('close');
            }
          };
          if (this._uxMode === 'embedded') {
            windowEmitter.on('message', handleWalletUIMessage);
          } else {
            window.addEventListener('message', handleWalletUIMessage);
          }
          authWindow = await this.openWallet('');
        } catch (e: any) {
          reject(e.message);
        }
      }
    );
  }

  private getApprovalToken = (payload: ICreateActionPayload) =>
    new Promise<{ action: IAction; authorization_token: string }>(
      async (resolve, reject) => {
        try {
          const result = createActionSchema.validate(payload);
          if (result.error) {
            throw result.error;
          }

          const response = await this.sso.post<IResponse<IAction>>(
            `/v1/auth/actions/request`,
            payload
          );

          const action = response.data.data;

          console.debug('action_created', action);
          console.debug('action:requesting_approval for', action.uuid);
          const approvalPath = `/approve/${action.uuid}`;
          const authWindow = await this.openPopupWallet(approvalPath);
          window.addEventListener('message', async (event) => {
            const { deserialize } = await import('bson');

            if (event.data?.name === 'mw:action:approve') {
              const payload = deserialize(event.data.payload);
              console.debug('auth:approved_action', payload);
              if (payload.action && payload.action.uuid === action.uuid) {
                authWindow && authWindow.close();
                resolve({
                  authorization_token: payload.authorization_token,
                  action: payload.action,
                });
              } else if (event.data?.name === 'mw:action:cancel') {
                reject(`User denied approval for action:${action.uuid}.`);
              }
            }
          });
        } catch (e: any) {
          reject(e.message);
        }
      }
    );
  /**
   * Fetches an NFT's mint address on Solana
   * @param mintAddress
   */
  async getNftDetails(mintAddress: string): Promise<ISolanaNFT> {
    const response = await this.api.get<IResponse<ISolanaNFT>>(
      `/solana/nft/${mintAddress}`
    );
    return response.data.data;
  }

  /**
   * Fetches the current user's tokens
   */
  async getTokens(): Promise<ISolanaToken[]> {
    const response = await this.api.get<IResponse<ISolanaToken[]>>(
      `/wallet/tokens`
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
      `/wallet/transactions`
    );
    const transactions = response.data.data.transactions;
    this.transactions = transactions;
    return transactions;
  }

  /**
   * Fetches the current user's NFTs.
   */
  async getNFTs(payload: {
    limit: number;
    offset: number;
  }): Promise<SolanaNFTExtended[]> {
    if (!this.user && !this.isLoggedIn) {
      throwError('ERROR_USER_NOT_AUTHENTICATED');
    }
    const nfts = await this.fetchNFTsByOwnerAddresses({
      owners: [this.user.wallet.sol_address],
      ...payload,
    });
    this.nfts = nfts;
    return nfts;
  }

  /**
   * Fetches the NFTs owned by a specific address.
   */
  async getNFTsOwnedByAddress(
    address: string,
    payload: {
      limit: number;
      offset: number;
    }
  ): Promise<SolanaNFTExtended[]> {
    if (!this.user && !this.isLoggedIn) {
      throwError('ERROR_USER_NOT_AUTHENTICATED');
    }
    return await this.fetchNFTsByOwnerAddresses({
      owners: [address],
      ...payload,
    });
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
    const { authorization_token } = await this.getApprovalToken({
      type: 'transfer_spl_token',
      value: payload.amount,
      params: payload,
    });
    const response = await this.api.post<IResponse<ITransferSPLTokenResponse>>(
      `/wallet/transfer-token`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );
    return response.data.data;
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

    const { authorization_token } = await this.getApprovalToken({
      type: 'transfer_sol',
      value: payload.amount,
      params: payload,
    });

    const response = await this.api.post<IResponse<ITransferSPLTokenResponse>>(
      `/wallet/transfer-sol`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );
    return response.data.data;
  }

  /**
   * @service Marketplace
   * Create Verified Collection
   */
  async createVerifiedCollection(
    payload: CreateVerifiedCollectionPayload,
    commitment: SolanaCommitment = SolanaCommitment.confirmed
  ): Promise<IVerifiedCollection> {
    const result = createVerifiedCollectionSchema.validate({
      name: payload.name,
      symbol: payload.symbol,
      url: payload.metadataUri,
      confirmation: commitment,
    });
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'create_collection',
      value: 0,
      params: payload,
    });

    const response = await this.api.post<IResponse<IVerifiedCollection>>(
      `/solana/mint/collection`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );
    return response.data.data;
  }

  /**
   * @service Marketplace
   * Mint NFT into collection
   */
  async mintNFT(payload: MintNFTPayload): Promise<ISolanaNFTMintResult> {
    const result = mintNFTSchema.validate({
      name: payload.name,
      symbol: payload.symbol,
      url: payload.metadataUri,
      collection_mint: payload.collection,
    });
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'mint_nft',
      value: 0,
      params: payload,
    });

    const response = await this.api.post<IResponse<ISolanaNFTMintResult>>(
      `/solana/mint/nft`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );
    return response.data.data;
  }

  /**
   * @service Marketplace
   * Update NFT metadata
   */
  async updateNFT(
    payload: UpdateNFTPayload,
    commitment: SolanaCommitment = SolanaCommitment.confirmed
  ): Promise<ISolanaNFTMintResult> {
    const result = updateNFTSchema.validate({
      mint_address: payload.mintAddress,
      name: payload.name,
      symbol: payload.symbol,
      url: payload.metadataUri,
      update_authority: payload.updateAuthority,
      seller_fee_basis_points: payload.sellerFeeBasisPoints,
      confirmation: commitment,
    });
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'update_nft',
      value: 0,
      params: payload,
    });

    const response = await this.api.post<IResponse<ISolanaNFTMintResult>>(
      `/solana/mint/update`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );
    return response.data.data;
  }

  /**
   * @service Marketplace
   * List NFT ion Mirror World Marketplace
   */
  async listNFT(payload: ListNFTPayload): Promise<INFTListing> {
    const result = listNFTSchema.validate({
      mint_address: payload.mintAddress,
      price: payload.price,
      auction_house: payload.auctionHouse,
    });
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'list_nft',
      value: payload.price,
      params: payload,
    });

    const response = await this.api.post<IResponse<INFTListing>>(
      `/solana/marketplace/list`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );
    return response.data.data;
  }

  /**
   * @service Marketplace
   * Purchase NFT on Mirror World Marketplace
   */
  async buyNFT(payload: BuyNFTPayload): Promise<INFTListing> {
    const result = buyNFTSchema.validate({
      mint_address: payload.mintAddress,
      price: payload.price,
      auction_house: payload.auctionHouse,
    });
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'buy_nft',
      value: payload.price,
      params: payload,
    });
    const response = await this.api.post<IResponse<INFTListing>>(
      `/solana/marketplace/buy`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );
    return response.data.data;
  }

  /**
   * @service Marketplace
   * Update NFT Listing on Mirror World Marketplace
   */
  async updateNFTListing(payload: UpdateListingPayload): Promise<INFTListing> {
    const result = buyNFTSchema.validate({
      mint_address: payload.mintAddress,
      price: payload.price,
      auction_house: payload.auctionHouse,
    });
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'update_listing',
      value: payload.price,
      params: payload,
    });
    const response = await this.api.post<IResponse<INFTListing>>(
      `/solana/marketplace/update`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );
    return response.data.data;
  }

  /**
   * @service Marketplace
   * Cancel listing NFT on Mirror World Marketplace
   */
  async cancelNFTListing(payload: CancelListingPayload): Promise<INFTListing> {
    const result = cancelNFTListingSchema.validate({
      mint_address: payload.mintAddress,
      price: payload.price,
      auction_house: payload.auctionHouse,
    });
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'cancel_listing',
      value: payload.price,
      params: payload,
    });
    const response = await this.api.post<IResponse<INFTListing>>(
      `/solana/marketplace/cancel`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );
    return response.data.data;
  }

  /**
   * @service Marketplace
   * Transfer NFT from holder's wallet to another address
   */
  async transferNFT(payload: TransferNFTPayload): Promise<INFTListing> {
    const result = transferNFTSchema.validate({
      mint_address: payload.mintAddress,
      to_wallet_address: payload.recipientAddress,
    });
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'transfer_nft',
      value: 0,
      params: payload,
    });
    const response = await this.api.post<IResponse<INFTListing>>(
      `/solana/marketplace/transfer`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );
    return response.data.data;
  }

  /**
   * @service Marketplace
   * Fetch NFTs By Mint Addresses. Returns a detailed payload of all NFTs whose `mintAddresses`
   * are provided
   */
  async fetchNFTsByMintAddresses(
    payload: QueryNFTsByMintAddressesPayload
  ): Promise<SolanaNFTExtended[]> {
    const result = fetchNFTsByMintAddressesSchema.validate({
      mint_addresses: payload.mintAddresses,
      limit: payload.limit,
      offset: payload.offset,
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<
      IResponse<{
        nfts: SolanaNFTExtended[];
      }>
    >(`/solana/nft/mints`, result.value);
    return response.data?.data?.nfts;
  }

  /**
   * @service Marketplace
   * Fetch NFTs By Creator Addresses. Returns a detailed payload of all NFTs whose `creatorAddresses`
   * are provided
   */
  async fetchNFTsByCreatorAddresses(
    payload: QueryNFTsByCreatorsPayload
  ): Promise<SolanaNFTExtended[]> {
    const result = fetchNFTsByCreatorAddressesSchema.validate({
      creators: payload.creatorAddresses,
      limit: payload.limit,
      offset: payload.offset,
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<
      IResponse<{
        nfts: SolanaNFTExtended[];
      }>
    >(`/solana/nft/creators`, result.value);
    return response.data?.data?.nfts;
  }

  /**
   * @service Marketplace
   * Fetch NFTs By Update Authorities Addresses. Returns a detailed payload of all NFTs whose `updateAuthorities`
   * are provided
   */
  async fetchNFTsByUpdateAuthorities(
    payload: QueryNFTsByUpdateAuthoritiesPayload
  ): Promise<SolanaNFTExtended[]> {
    const result = fetchNFTsByUpdateAuthoritiesSchema.validate({
      update_authorities: payload.updateAuthorities,
      limit: payload.limit,
      offset: payload.offset,
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<
      IResponse<{
        nfts: SolanaNFTExtended[];
      }>
    >(`/solana/nft/udpate-authorities`, result.value);
    return response.data?.data?.nfts;
  }

  /**
   * @service Marketplace
   * Fetch NFTs By Owners Addresses. Returns a detailed payload of all NFTs whose `owners`
   * are provided
   */
  async fetchNFTsByOwnerAddresses(
    payload: QueryNFTsByOwnersPayload
  ): Promise<SolanaNFTExtended[]> {
    const result = fetchNFTsByOwnerAddressesSchema.validate({
      owners: payload.owners,
      limit: payload.limit,
      offset: payload.offset,
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<
      IResponse<{
        nfts: SolanaNFTExtended[];
      }>
    >(`/solana/nft/owners`, result.value);
    return response.data?.data?.nfts;
  }

  /**
   * @service Marketplace
   * Fetch Solana NFT Marketplace Activity
   */
  async fetchNFTMarketplaceActivity(
    mintAddress: string
  ): Promise<SolanaNFTAuctionActivitiesPayload> {
    const response = await this.api.get<
      IResponse<SolanaNFTAuctionActivitiesPayload>
    >(`/solana/activity/${mintAddress}`);
    return response.data?.data;
  }

  /**
   * Creates a new marketplace instance.
   * @param payload
   */
  async createMarketplace(
    payload: CreateMarketplacePayload
  ): Promise<Marketplace> {
    const result = createMarketplaceSchema.validate({
      treasury_mint: payload.treasuryMint,
      collections: payload.collections,
      seller_fee_basis_points: payload.sellerFeeBasisPoints,
      storefront: payload.storefront,
    });
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'create_marketplace',
      value: 0,
      params: payload,
    });

    const response = await this.api.post<IResponse<IMarketplaceResponse>>(
      `/solana/marketplaces/create`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );

    return response.data?.data?.marketplace;
  }

  /**
   * Updates a marketplace instance.
   * @param payload
   */
  async updateMarketplace(payload: UpdateMarketplacePayload) {
    const result = updateMarketplaceSchema.validate({
      treasury_mint: payload.treasuryMint,
      collections: payload.collections,
      seller_fee_basis_points: payload.sellerFeeBasisPoints,
      storefront: payload.storefront,
      new_authority: payload.newAuthority,
    });
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'update_marketplace',
      value: 0,
      params: payload,
    });

    const response = await this.api.post<IResponse<IMarketplaceResponse>>(
      `/solana/marketplaces/update`,
      result.value,
      {
        headers: {
          'x-authorization-token': authorization_token,
        },
      }
    );

    return response.data?.data?.marketplace;
  }

  /**
   * Queries marketplaces by the following properties
   * | 'name'
   * | 'client_id'
   * | 'authority'
   * | 'treasury_mint'
   * | 'auction_house_fee_account'
   * | 'auction_house_treasury'
   * | 'treasury_withdrawal_destination'
   * | 'fee_withdrawal_destination'
   * | 'seller_fee_basis_points'
   * | 'requires_sign_off'
   * | 'can_change_sale_price'
   * @param query
   * @param pagination
   */
  async queryMarketplaces(
    query: MarketplaceQueryOptions,
    pagination: {
      page?: number;
      count?: number;
    } = {
      page: 1,
      count: 24,
    }
  ): Promise<IMarketplaceQueryResult[]> {
    const params = qs.stringify({ ...query, ...pagination });

    const response = await this.api.get<
      IPaginatedResponse<IMarketplaceQueryResult[]>
    >(`/solana/marketplaces?${params}`);

    return response.data.data.data;
  }
}
