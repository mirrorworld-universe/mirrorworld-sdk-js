import { AxiosRequestConfig } from 'axios';
import qs from 'query-string';
import type * as CSS from 'csstype';
import {
  MirrorWorldEventKey,
  MirrorWorldEvents,
  MirrorWorldOptions,
  WalletUIEvents,
} from './types/instance';
import { createAPIClient, MirrorWorldAPIClient } from './services/api';
import { ClusterEnvironment } from './services/cluster';
import { emitter, windowEmitter } from './events/emitter';
import { clientOptionsSchema } from './validators';
import { LoginEmailCredentials } from './types/auth';
import { IPaginatedResponse, IResponse } from './types/response.type';
import { IUser, UserWithWallet, Wallet } from './types/user.type';
import { canUseDom, isSafari } from './utils';
import { animate } from 'motion';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { hideOthers } from 'aria-hidden';
import { SUIWrapper } from './chain-wrapper/sui-wrapper';

import {
  IBuySolanaNFTPayloadV2,
  ISolanaCancelNFTListingPayloadV2,
  IBuySolanaListNFTPayloadV2,
  ITransferSolanaNFTPayloadV2,
  SolanaNFTExtended,
  IBuyEVMNFTPayloadV2,
  IListEVMNFTPayloadV2,
  ICancelListingEVMPayloadV2,
  ITransferEVMNFTPayloadV2,
} from './types/nft';
import { ISolanaToken } from './types/token';
import { ISolanaTransaction } from './types/transaction';
import {
  BaseSolanaAuctionSchemaV2,
  BuyEVMNFTSchemaV2,
  CancelEVMNFTListingSchemaV2,
  CreateEVMCollectionSchemaV2,
  CreateEVMMarketplaceSchemaV2,
  CreateMarketplaceSchemaV2,
  CreateVerifiedCollectionSchemaV2,
  ListEVMNFTSchemaV2,
  MintEVMNFTToCollectionSchemaV2,
  MintSolanaNFTToCollectionSchemaV2,
  QueryAssetMintsStatusSchemaV2,
  QueryAssetTransactionStatusSchemaV2,
  SearchEVMNFTsByOwnerAddressesSchemaV2,
  SearchEVMNFTsSchemaV2,
  SearchSolanaNFTInfoSchemaV2,
  SearchSolanaNFTsByCreatorAddressesSchemaV2,
  SearchSolanaNFTsByMintAddressesSchemaV2,
  SearchSolanaNFTsByOwnerAddressesSchemaV2,
  SearchSolanaNFTsByUpdateAuthorityAddressesSchemaV2,
  TransferEVMNFTSchemaV2,
  TransferSolanaNFTSchemaV2,
  UpdateEVMMarketplaceSchemaV2,
  UpdateMarketplaceSchemaV2,
  VerifyEVMMintConfigSchemaV2,
  VerifySolanaMintConfigSchemaV2,
} from './validators/asset.v2.validators';
import {
  ICreateEVMMarketplacePayloadV2,
  ISolanaMarketplaceQueryResultV2,
  IUpdateMarketplacePayloadV2,
  MarketplaceQueryOptionsV2,
  IEVMMarketplaceV2,
  IUpdateEVMMarketplacePayloadV2,
  IQueryEVMMarketplaceOptionsV2,
  IQueryEVMMarketplacePaginationOptionsV2,
  IQueryEVMMarketplaceResultV2,
  ICreateSolanaMarketplacePayloadV2,
  SolanaMarketplaceV2,
} from './types/marketplace';
import { IAction, ICreateActionPayload } from './types/actions';
import { createActionSchema } from './validators/action.validator';
import { Emitter } from 'mitt';
import {
  BNBChain,
  ChainConfig,
  ChainTypes,
  Ethereum,
  EVMChains,
  isSolana,
  Polygon,
  Solana,
  SolanaChain,
} from './configuration';
import {
  cp,
  createAPIClientV2,
  MirrorWorldAPIClientV2,
  MirrorWorldAPIService,
} from './services/api.v2';
import {
  EVMNFTActivity,
  EVMNFTExtended,
  EVMNFTInfo,
  QueryEVMNFTActivityPayload,
  QueryEVMNFTActivityResult,
  QueryEVMNFTInfoPayload,
  QuerySolanaNFTActivityPayload,
  QuerySolanaNFTActivityResult,
  QuerySolanaNFTInfoPayload,
  SolanaNFTActivity,
  SolanaNFTInfo,
} from './types/nft.v2';
import { digest } from './utils/encrypt';
import {
  fetchEVMNFTInfoSchema,
  fetchEVMNFTsActivitySchema,
  fetchSolanaNFTsActivitySchema,
} from './validators/metadata.validators';
import { assertAvailableFor } from './utils/chain.invariance';
import {
  CreateVerifiedCollectionPayloadV2,
  MintSolanaNFTToCollectionPayloadV2,
  MintSolanaNFTToCollectionResultV2,
  QueryAssetMintsStatusPayload,
  QueryAssetTransactionStatusPayload,
  QueryAssetTransactionStatusResult,
  SearchSolanaNFTsByCreatorsPayloadV2,
  SearchSolanaNFTsByMintAddressesPayloadV2,
  SearchSolanaNFTsByOwnersPayloadV2,
  SearchSolanaNFTsByUpdateAuthoritiesPayloadV2,
  SearchSolanaNFTsResponseV2,
  SolanaNFT,
  SolanaNFTDevnet,
  SolanaNFTListingV2,
  UpdateSolanaNFTMetadataPayloadV2,
  VerifiedSolanaCollection,
  VerifySolanaMintConfigPayloadV2,
  VerifySolanaMintConfigResultV2,
} from './types/asset.solana.v2';
import {
  CreateEVMCollectionResultV2,
  CreateEVMCollectionV2Payload,
  EVMCollectionV2,
  EVMNFTListingTransactionV2,
  EVMNFTListingV2,
  EvmWalletRequest,
  MintEVMNFTToCollectionResultV2,
  MintEVMNFTToCollectionV2Payload,
  SearchEVMNFTsByOwnerAddressesPayloadV2,
  SearchEVMNFTsPayloadV2,
  VerifyEVMMintConfigPayloadV2,
  VerifyEVMMintConfigResultV2,
} from './types/asset.evm.v2';
import {
  EVMPersonalSignPayloadV2,
  EVMPersonalSignResultV2,
  EVMSignAndSendTransactionPayloadV2,
  EVMSignAndSendTransactionV2Result,
  EVMSignTypedDataPayloadV2,
  EVMSignTypedDataV2Result,
  EVMSignTypedDataWithVersionPayloadV2,
  EVMSignTypedDataWithVersionV2Result,
  EVMTransaction,
  EVMTransferERCTokenPayloadV2,
  EVMTransferTokensPayloadV2,
  EVMTransferTokensResponseV2,
  EVMUserTransactionsV2Data,
  GetEVMUserTokensV2Data,
} from './types/wallet.evm.v2';
import {
  GetSolanaTokensV2Data,
  GetSolanaTransactionV2Data,
  SolanaBaseSignatureResultV2,
  SolanaTransactionV2,
  SolanaTransferSOLPayloadV2,
  SolanaTransferSPLTokenPayloadV2,
} from './types/wallet.solana.v2';
import {
  EVMMarketplaceEventsResultV2,
  QueryEVMNFT,
  QueryEVMNFTsInfoResultV2,
  QueryEVMNFTsPayloadV2,
  SearchEVMMarketplaceEventsPayloadV2,
  SearchEVMNFTInCollectionPayloadV2,
  SearchEVMRecommendedNFTInCollectionPayloadV2,
} from './types/metadata.evm.v2';
import {
  QuerySolanaNFT,
  QuerySolanaNFTsInfoResultV2,
  QuerySolanaNFTsPayloadV2,
  SearchSolanaMarketplaceEventsPayloadV2,
  SearchSolanaNFTInCollectionPayloadV2,
  SearchSolanaRecommendedNFTInCollectionPayloadV2,
  SolanaMarketplaceEventsResultV2,
} from './types/metadata.solana.v2';
import {
  CollectionFilterMetadataV2,
  CollectionsResultV2,
  CollectionSummaryV2,
  SearchCollectionsInfoV2,
  QueryCollectionsSummaryV2,
  RegisterCollectionPayloadV2,
  RegisterCollectionResultV2,
} from './types/metadata.common.v2';
import { string } from 'joi';
import { SUIMintCollectionPayload, SUIMintNFTPayload, SUISearchNFTsByOwnerPayload, SUISearchNFTsPayload, SUITransferSUIPayloadV2, SUITransferTokenPayload } from './types/wallet.sui.v2';

export class MirrorWorld {
  // System variables
  _apiKey: MirrorWorldOptions['apiKey'];
  _env: MirrorWorldOptions['env'];
  _staging: MirrorWorldOptions['staging'];
  _api: MirrorWorldAPIClient;
  v2: MirrorWorldAPIClientV2;
  _tokens: ISolanaToken[] = [];
  _transactions: ISolanaTransaction[] = [];
  _nfts: SolanaNFTExtended[] | EVMNFTExtended[] = [];
  _chainConfig: ChainConfig<ChainTypes>;

  private __secretAccessKey?: string;

  private _storageKey?: string;
  // User variables
  _user?: UserWithWallet;
  _uxMode: 'embedded' | 'popup' = 'embedded';

  windowEmitter: Emitter<WalletUIEvents> = windowEmitter;

  // private values
  public userRefreshToken?: string;

  constructor(options: MirrorWorldOptions) {
    const result = clientOptionsSchema.validate(options);
    if (result.error) {
      throw result.error;
    }
    const {
      apiKey,
      env = ClusterEnvironment.mainnet,
      autoLoginCredentials,
      staging = false,
      chainConfig,
      auth,
    } = result.value;
    this._staging = staging;
    this._apiKey = apiKey;
    this._env = env;
    this._chainConfig = chainConfig;
    this._api = createAPIClient(
      {
        apiKey,
        staging,
      },
      env
    );
    this.v2 = createAPIClientV2(
      {
        apiKey,
      },
      staging
    );

    if (isSafari()) {
      // Safari enforces a strict
      // iframe communication policy.
      // To bypass this we override the
      // user's settings to use popup mode.
      this._uxMode = 'popup';
      console.warn(
        "[MirrorWorld:SDK]: Overriding UX mode to 'popup' due to Safari's strict iframe communication policy."
      );
    } else {
      this._uxMode = options.walletUIConfig?.uxMode || 'embedded';
    }

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

    if (auth?.secretAccessKey) {
      // User authorized with secret access key
      // Override the authToken with the secret access key
      this.__secretAccessKey = auth.secretAccessKey;
      this.useCredentials({
        accessToken: this.__secretAccessKey,
      });
    }

    this.on('auth:refreshToken', (refreshToken) => {
      if (this._storageKey && canUseDom && refreshToken) {
        const internalRefreshTokenKey = `${this._storageKey}:refresh`;
        localStorage.setItem(internalRefreshTokenKey, refreshToken);
      }
    });
    this.emit('ready', undefined);

    if (canUseDom) {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          // Create local cache key for secure data
          const salt = `${this._apiKey}:key`;
          digest(salt).then(async (storageKey) => {
            this._storageKey = storageKey;
            // Try to check if the browser
            // has stored the tokens
            if (this._storageKey) {
              const internalRefreshTokenKey = `${this._storageKey}:refresh`;
              const storedRefreshTokens = localStorage.getItem(
                internalRefreshTokenKey
              );
              if (storedRefreshTokens) {
                await this.refreshAccessToken(storedRefreshTokens);
                this.defineInternalListeners();
              }
            }
          });
        }, 1000);
      });
    }
    return this;
  }

  async openEmbeddedWallet(
    path = '/',
    shouldAutoClose = false,
    useWholePath = false
  ): Promise<Window | undefined> {
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
      position: 'fixed',
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
    if(useWholePath){
      iframe.src = path;
    }else{
      iframe.src = `${this.authView}${path}`;
    }
    
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

    console.debug('found wallet ui iframe. adding event listener...');

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
      if (document.body.contains(portal)) {
        document.body.removeChild?.(portal);
      }
    }

    if (shouldAutoClose) {
      windowEmitter.on('close', unmountIframes);
    }

    windowEmitter.on('message', (event) => {
      if (event.data.name === 'mw:auth:close') {
        unmountIframes();
      }
    });

    await Promise.all(mountAnimationPromises);

    portalContent.addEventListener('click', unmountIframes);
    portalBackdrop.addEventListener('click', unmountIframes);

    window.addEventListener('beforeunload', () => {
      portalContent.removeEventListener('click', unmountIframes);
      portalBackdrop.removeEventListener('click', unmountIframes);
    });

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

  /* Auth Service  */
  private get auth() {
    return this.v2.api.get('auth')!;
  }
  /* Asset Service  */
  private get asset() {
    return this.v2.api.get('asset')!;
  }
  /* Wallet Service  */
  private get _wallet() {
    return this.v2.api.get('wallet')!;
  }
  /* Metadata Service  */
  private get metadata() {
    return this.v2.api.get('metadata')!;
  }

  /** Get application's apiKey instance */
  private get apiKey(): string {
    return this._apiKey;
  }

  get chainConfig(): ChainConfig<ChainTypes> {
    return this._chainConfig;
  }

  set chainConfig(value: ChainConfig<ChainTypes>) {
    this._chainConfig = value;
    if (this._chainConfig.network === 'mainnet') {
      this._env = ClusterEnvironment.mainnet;
    } else if (this._chainConfig.network.includes('devnet')) {
      this._env = ClusterEnvironment.testnet;
    } else if (this._chainConfig.network.includes('testnet')) {
      this._env = ClusterEnvironment.testnet;
    }
  }

  /** Get current user */
  get user(): UserWithWallet {
    return this._user!;
  }

  private set user(value: UserWithWallet) {
    this.emit('update:user', value);
    this._user = value;
  }

  /** Get current user's wallet */
  get wallet(): Wallet {
    return this._user!.wallet!;
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
    emitter.emit(event, payload);
  }

  private defineInternalListeners() {
    this.on('update:user', async (user) => {
      console.debug('user updated', user);
    });
  }

  public useCredentials({ accessToken }: { accessToken: string }) {
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

    // const preferredCredential = this.__secretAccessKey || accessToken;
    const preferredCredential = accessToken;
    const serviceCredentialsInterceptorId = this.api.interceptors.request.use(
      createAccessTokenInterceptor(preferredCredential)
    );
    const ssoCredentialsInterceptorId = this.sso.interceptors.request.use(
      createAccessTokenInterceptor(preferredCredential)
    );

    const authServiceV2CredentialsInterceptorId =
      this.auth.interceptors.request.use(
        createAccessTokenInterceptor(preferredCredential)
      );

    const assetServiceV2CredentialsInterceptorId =
      this.asset.interceptors.request.use(
        createAccessTokenInterceptor(preferredCredential)
      );

    const walletServiceV2CredentialsInterceptorId =
      this._wallet.interceptors.request.use(
        createAccessTokenInterceptor(preferredCredential)
      );

    const metadataServiceV2CredentialsInterceptorId =
      this.metadata.interceptors.request.use(
        createAccessTokenInterceptor(preferredCredential)
      );

    this.on('logout', () => {
      this.api.interceptors.request.eject(serviceCredentialsInterceptorId);
      this.sso.interceptors.request.eject(ssoCredentialsInterceptorId);
      this.auth.interceptors.request.eject(
        authServiceV2CredentialsInterceptorId
      );
      this.asset.interceptors.request.eject(
        assetServiceV2CredentialsInterceptorId
      );
      this._wallet.interceptors.request.eject(
        walletServiceV2CredentialsInterceptorId
      );
      this.metadata.interceptors.request.eject(
        metadataServiceV2CredentialsInterceptorId
      );
    });
  }

  private base(service: MirrorWorldAPIService) {
    return cp(this.chainConfig, service);
  }

  async loginWithEmail(
    credentials: LoginEmailCredentials
  ): Promise<MirrorWorld> {
    const response = await this.auth.post<
      IResponse<{
        access_token: string;
        refresh_token: string;
        user: UserWithWallet;
      }>
    >(`/login`, credentials);
    const accessToken = response.data.data.access_token;
    this.userRefreshToken = response.data.data.refresh_token;
    this.user = response.data.data.user;
    this.useCredentials({
      accessToken,
    });
    if (this._storageKey && canUseDom && this.userRefreshToken) {
      const internalRefreshTokenKey = `${this._storageKey}:refresh`;
      localStorage.setItem(internalRefreshTokenKey, this.userRefreshToken);
    }
    this.emit('login:email', this.user);
    this.emit('login', this.user);
    return this;
  }

  async logout(): Promise<void> {
    try {
      await this.auth.post('/logout');
      this._user = undefined;
      const refreshTokenStorageKey = `${this._storageKey}:refresh`;
      if (canUseDom) {
        localStorage.removeItem(refreshTokenStorageKey);
      }
      this.emit('logout', undefined);
    } catch (e) {}
  }

  private async refreshAccessToken(refreshToken: string) {
    const response = await this.auth.get<
      IResponse<{
        access_token: string;
        refresh_token: string;
        user: UserWithWallet;
      }>
    >('/refresh-token', {
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
    this.emit('login', this.user);
    return user;
  }

  async fetchUser(): Promise<IUser> {
    const response = await this.auth
      .get<IResponse<UserWithWallet>>('/me')
      .then();
    const user = response.data.data;
    this.user = user;
    return user;
  }

  private get authView() {
    return `https://auth${this._staging ? '-staging' : ''}.mirrorworld.fun`;
  }

  private get walletUrl(){
    return `https://auth-next${this._staging ? '-staging' : ''}.mirrorworld.fun/v1/assets/tokens`;
  }

  private get loginUrl(){
    return `https://auth-next${this._staging ? '-staging' : ''}.mirrorworld.fun/v1/auth/login`;
  }

  /**
   * Opens wallet window
   * @param path
   * @private
   */
  private async openPopupWallet(path?: string,isWholePath?:boolean): Promise<Window | undefined> {
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
    let realPath = `${this.authView}${path}`
    if(isWholePath){
      realPath = `${path}`;
    }
    const authWindow =
      (await window.open(
        realPath,
        '_blank',
        `
        popup=true
        width=${w},
        height=${h},
        top=${top},
        left=${left}`
      )) || undefined;
    if (!!window.focus && !!authWindow?.focus) authWindow.focus();

    if (authWindow) {
      window.addEventListener('message', (event) => {
        if (event.data.name === 'mw:auth:close') {
          authWindow.close();
        }
      });
    }

    return authWindow;
  }

  /** Solana SDK Methods */
  get Solana() {
    /** Asset Service Methods for Solana */
    const Asset = Object.freeze({
      /** Purchase NFT on Solana AuctionHouse Instance */
      buyNFT: this.buySolanaNFT.bind(this),
      /** List NFT on Solana AuctionHouse Instance */
      listNFT: this.listSolanaNFT.bind(this),
      /** Cancel NFT Listing on Solana AuctionHouse Instance  */
      cancelListing: this.cancelSolanaNFTListing.bind(this),
      /** Transfer an NFT on Solana  */
      transferNFT: this.transferSolanaNFT.bind(this),
      /** Create a new NFT Marketplace on Solana */
      createMarketplace: this.createSolanaMarketplace.bind(this),
      /** Updates an existing NFT Marketplace on Solana  */
      updateMarketplace: this.updateSolanaMarketplace.bind(this),
      /**
       * Queries marketplaces by the following properties for an authenticated user
       * @param {MarketplaceQueryOptionsV2} query
       * @param query.client_id
       * @param query.name
       * @param query.authority
       * @param query.treasury_mint
       * @param query.auction_house_fee_account
       * @param query.auction_house_treasury
       * @param query.treasury_withdrawal_destination
       * @param query.fee_withdrawal_destination
       * @param query.seller_fee_basis_points
       * @param query.requires_sign_off
       * @param query.can_change_sale_price
       * @param pagination
       */
      queryMarketplaces: this.querySolanaMarketplaces.bind(this),
      /** Queries the transaction status of a Solana asset by the transaction signature */
      queryAssetTransactionStatus:
        this.querySolanaAssetTransactionStatus.bind(this),
      /** Queries the mint status of a set of mint addresses. This is useful when performing batch minting for a large array of mint addresses */
      queryAssetMintsStatus: this.querySolanaAssetMintsStatus.bind(this),
      /** Creates a new verified collection on Solana  */
      createVerifiedCollection: this.createSolanaVerifiedCollection.bind(this),
      /** Gets the collection's created by an authenticated user.  */
      getCollections: this.getSolanaCollections.bind(this),
      /** Queries the Solana NFTs minted on a collection  */
      getCollectionNFTs: this.getSolanaCollectionNFTs.bind(this),
      /** Mints a new NFT to Solana collection */
      mintNFT: this.mintSolanaNFT.bind(this),
      /** Updates the metadata account of an NFT on Solana */
      updateNFTMetadata: this.updateSolanaNFTMetadata.bind(this),
      /** Verifies the mint configuration of a Solana NFT */
      verifyMintConfig: this.verifySolanaMintConfig.bind(this),
      /** Searches Solana NFTs by Mint Addresses */
      searchNFTsByMintAddresses:
        this.searchSolanaNFTsByMintAddresses.bind(this),
      /** Searches Solana NFTs by Creator Addresses */
      searchNFTsByCreatorAddresses:
        this.searchSolanaNFTsByCreatorAddresses.bind(this),
      /** Searches Solana NFTs by Creator Addresses */
      searchNFTsByUpdateAuthorityAddresses:
        this.searchSolanaNFTsByUpdateAuthorityAddresses.bind(this),
      /** Searches Solana NFTs by Owner Addresses */
      searchNFTsByOwnerAddresses:
        this.searchSolanaNFTsByOwnerAddresses.bind(this),
      /** Searches Solana NFTs by Mint Addresses */
      searchNFTByMintAddress: this.searchSolanaNFTByMintAddress.bind(this),
    });
    /** Wallet Service Methods for Solana */
    const Wallet = Object.freeze({
      /**  Get Users tokens on Solana. Requires authentication */
      fetchTokens: this.fetchSolanaUserTokens.bind(this),
      /** Get Users transactions on Solana. Requires authentication */
      fetchTransactions: this.fetchSolanaUserTransactions.bind(this),
      /** Get Solana tokens in wallet by wallet address */
      fetchTokensInWallet: this.fetchSolanaTokensFromWalletAddress.bind(this),
      /** Get transactions performed by an arbitrary wallet  */
      fetchTransactionsByWallet: this.fetchSolanaWalletTransactions.bind(this),
      /**  Get raw transaction data from signature  */
      fetchTransactionBySignature:
        this.fetchSolanaWalletTransactionFromSignature.bind(this),
      /** Transfers SOL from user's wallet address to another wallet address */
      transferSol: this.transferSOLV2.bind(this),
      /** Transfers SPL Tokens from user's wallet address to another wallet address */
      transferSPLToken: this.transferSPLTokenV2.bind(this),
    });
    /** Metadata Service Methods for Solana */
    const Metadata = Object.freeze({
      /** Fetch Solana NFT Info */
      fetchNFTInfo: this.fetchSolanaNFTInfo.bind(this),
      /** Fetch Solana NFT Activity */
      fetchNFTEvents: this.fetchSolanaNFTEvents.bind(this),
      /** Fetch Solana NFTs Info. Accepts Filtering Metadata */
      fetchNFTsInfo: this.fetchSolanaNFTsInfo.bind(this),
      /** Search Solana Collection NFT */
      searchCollectionNFT: this.searchSolanaCollectionNFT.bind(this),
      /** Search Recommended NFT in Solana Collection */
      searchRecommendedNFTsInCollection:
        this.searchSolanaRecommendedNFTInCollection.bind(this),
      /** Search Solana Marketplace Events */
      searchMarketplaceEvents: this.searchSolanaMarketplaceEvents.bind(this),
      /** Search NFT Collections Info */
      queryCollectionsInfo: this.queryCollectionsInfo.bind(this),
      /** Search NFT Collection Filter Parameters */
      queryCollectionFilterMetadata:
        this.queryCollectionFilterMetadata.bind(this),
      /** Search NFT Collection Filter Parameters */
      queryCollectionSummary: this.queryCollectionSummary.bind(this),
      /**
       * Register an NFT collection info to Metadata service.
       * After successful registration, the Metadata Service will index the collection data.
       * */
      registerCollection: this.registerCollection.bind(this),
    });
    return {
      Asset,
      Wallet,
      Metadata,
    };
  }

  /** Ethereum SDK Methods */
  get Ethereum() {
    /** Asset Service Methods for Ethereum */
    const Asset = Object.freeze({
      /** Purchase NFT on Ethereum Marketplace Address */
      buyNFT: this.buyEVMNFT.bind(this),
      /** List NFT on Ethereum Marketplace Address */
      listNFT: this.listEVMNFT.bind(this),
      /** Cancel NFT Listing on Ethereum Marketplace Address */
      cancelListing: this.cancelEVMNFTListing.bind(this),
      /**  Transfer Ethereum NFT to another address */
      transferNFT: this.transferEVMNFT.bind(this),
      /** Create Purchase NFT transaction on Ethereum Marketplace Address */
      buyNFTTransaction: this.buyEVMNFTTransaction.bind(this),
      /** Create List NFT transaction on Ethereum Marketplace Address */
      listNFTTransaction: this.listEVMNFTTransaction.bind(this),
      /** Create Cancel NFT Listing transaction on Ethereum Marketplace Address */
      cancelListingTransaction: this.cancelEVMNFTListingTransaction.bind(this),
      /** Create Transfer Ethereum NFT to another address transaction */
      transferNFTTransaction: this.transferNFTTransaction.bind(this),
      /** Create a new NFT Marketplace on Ethereum */
      createMarketplace: this.createEVMMarketplace.bind(this),
      /** Updates a sn existing NFT Marketplace on Ethereum */
      updateMarketplace: this.updateEVMMarketplace.bind(this),
      /** Search NFT Marketplace on Ethereum */
      queryMarketplaces: this.queryEVMMarketplaces.bind(this),
      /** Creates a new verified collection on Ethereum */
      createCollection: this.createEVMCollection.bind(this),
      /** Mints a new NFT to a collection on Ethereum */
      mintNFT: this.mintEVMNFT.bind(this),
      /** Verifies the mint configuration of a Ethereum NFT */
      verifyMintConfig: this.verifyEVMMintConfig.bind(this),
      /** Queries the Ethereum collections for an authenticated user */
      getCollections: this.getEVMCollections.bind(this),
      /** Queries the Ethereum NFTs minted to a collection  */
      getCollectionNFTs: this.getEVMCollectionNFTs.bind(this),
      /** Searches Ethereum NFTs by Owner Addresses */
      searchNFTsByOwnerAddresses: this.searchEVMNFTsByOwnerAddresses.bind(this),
      /** Fetch Ethereum NFT Info */
      searchNFT: this.searchEVMNFTInfo.bind(this),
      /** Search EVM NFTs by their contract_addresses and token_ids */
      searchNFTs: this.searchEVMNFTs.bind(this),
    });
    /** Wallet Service Methods for Ethereum */
    const Wallet = Object.freeze({
      /** Fetch authenticated user's Ethereum tokens */
      fetchTokens: this.fetchEVMUserTokens.bind(this),
      /** Fetch authenticated user's Ethereum transactions */
      fetchTransactions: this.fetchEVMUserTransactions.bind(this),
      /** Fetch Ethereum Transactions in wallet address */
      fetchWalletTransactions: this.fetchEVMTransactionsFromWallet.bind(this),
      /** Fetch Ethereum Transaction Data by transaction hash */
      fetchTransactionByHash: this.fetchEVMTransactionsFromWallet.bind(this),
      /** Transfer ETH from EVM wallet to another EVM wallet */
      transferETH: this.transferETH.bind(this),
      /** Transfer ERC20 token form your address to another address */
      transferERC20Token: this.transferERC20Token.bind(this),
      /** Get the ERC tokens inside an Ethereum wallet address */
      fetchTokensInWallet: this.fetchEVMWalletTokens.bind(this),
      /** Get the Transactions authored by an Ethereum wallet address */
      fetchTransactionsByWallet: this.fetchEVMWalletTransactions.bind(this),
      /** Performs personal signing of a string message */
      personalSign: this.EVMPersonalSign.bind(this),
      /**
       * Performs off-chain signing of a an arbitrary typed message
       * @example Message
       * ```json
       * {
       *   "data": [
       *     {
       *       "name": "data",
       *       "type": "string",
       *       "value": "hello world"
       *     }
       *   ]
       * }
       * ```
       * */
      signTypedData: this.EVMSignTypedData.bind(this),
      /**
       * Performs off-chain versioned signing of an arbitrary typed message
       * @example Versioned Signing message
       * ```json
       * {
       *   "messageType": [
       *       {
       *           "name": "data",
       *           "type": "string"
       *       }
       *   ],
       *   "domain": {
       *       "name": "example.metamask.com",
       *       "version": "1",
       *       "chainId": 1,
       *       "verifyingContract": "0x0000000000000000000000000000000000000000",
       *       "salt": [
       *           1,
       *           2,
       *           3
       *       ],
       *       "extraField": "stuff"
       *   },
       *   "primaryType": "Message",
       *   "message": {
       *       "data": "hello"
       *   }
       * }
       * ```
       * */
      signTypedDataVersioned: this.EVMSignTypedDataVersioned.bind(this),
      /**
       * Signs a transaction and sends it to the network
       * @param payload
       * @returns
       */
      signAndSendTransaction: this.EVMSignAndSendTransaction.bind(this),
    });
    /** Metadata Service Methods for Ethereum */
    const Metadata = Object.freeze({
      /** Fetch Ethereum NFT Info */
      fetchNFTInfo: this.fetchEVMNFTInfo.bind(this),
      /** Fetch Ethereum NFT Activity */
      fetchNFTEvents: this.fetchEVMNFTEvents.bind(this),
      /** Fetch Ethereum NFTs Info. Accepts Filtering Metadata */
      fetchNFTsInfo: this.fetchEVMNFTsInfo.bind(this),
      /** Search Ethereum Collection NFT */
      searchCollectionNFT: this.searchEVMCollectionNFT.bind(this),
      /** Search Recommended NFT in Ethereum Collection */
      searchRecommendedNFTsInCollection:
        this.searchEVMRecommendedNFTInCollection.bind(this),
      /** Search Ethereum Marketplace Events */
      searchMarketplaceEvents: this.searchEVMMarketplaceEvents.bind(this),
      /** Search NFT Collections Info */
      queryCollectionsInfo: this.queryCollectionsInfo.bind(this),
      /** Search NFT Collection Filter Parameters */
      queryCollectionFilterMetadata:
        this.queryCollectionFilterMetadata.bind(this),
      /** Search NFT Collection Filter Parameters */
      queryCollectionSummary: this.queryCollectionSummary.bind(this),
      /**
       * Register an NFT collection info to Metadata service.
       * After successful registration, the Metadata Service will index the collection data.
       * */
      registerCollection: this.registerCollection,
    });
    return {
      Asset,
      Wallet,
      Metadata,
    };
  }

  /** BNB Chain SDK Methods */
  get BNBChain() {
    /** Asset Service Methods for BNB Chain */
    const Asset = Object.freeze({
      /** Purchase NFT on BNB Chain Marketplace Address */
      buyNFT: this.buyEVMNFT.bind(this),
      /** List NFT on BNB Chain Marketplace Address */
      listNFT: this.listEVMNFT.bind(this),
      /** Cancel NFT Listing on BNB Chain Marketplace Address */
      cancelListing: this.cancelEVMNFTListing.bind(this),
      /**  Transfer BNB Chain NFT to another address */
      transferNFT: this.transferEVMNFT.bind(this),
      /** Create Purchase NFT transaction on Ethereum Marketplace Address */
      buyNFTTransaction: this.buyEVMNFTTransaction.bind(this),
      /** Create List NFT transaction on Ethereum Marketplace Address */
      listNFTTransaction: this.listEVMNFTTransaction.bind(this),
      /** Create Cancel NFT Listing transaction on Ethereum Marketplace Address */
      cancelListingTransaction: this.cancelEVMNFTListingTransaction.bind(this),
      /** Create Transfer Ethereum NFT to another address transaction */
      transferNFTTransaction: this.transferNFTTransaction.bind(this),
      /** Create a new NFT Marketplace on BNB Chain */
      createMarketplace: this.createEVMMarketplace.bind(this),
      /** Updates a sn existing NFT Marketplace on BNB Chain */
      updateMarketplace: this.updateEVMMarketplace.bind(this),
      /** Search NFT Marketplace on BNB Chain */
      queryMarketplaces: this.queryEVMMarketplaces.bind(this),
      /** Creates a new verified collection on BNB Chain */
      createCollection: this.createEVMCollection.bind(this),
      /** Mints a new NFT to a collection on BNB Chain */
      mintNFT: this.mintEVMNFT.bind(this),
      /** Verifies the mint configuration of a BNB Chain NFT */
      verifyMintConfig: this.verifyEVMMintConfig.bind(this),
      /** Queries the BNB Chain collections for an authenticated user */
      getCollections: this.getEVMCollections.bind(this),
      /** Queries the BNB Chain NFTs minted to a collection  */
      getCollectionNFTs: this.getEVMCollectionNFTs.bind(this),
      /** Searches BNB Chain NFTs by Owner Addresses */
      searchNFTsByOwnerAddresses: this.searchEVMNFTsByOwnerAddresses.bind(this),
      /** Fetch BNB Chain NFT Info */
      searchNFT: this.searchEVMNFTInfo.bind(this),
      /** Search EVM NFTs by their contract_addresses and token_ids */
      searchNFTs: this.searchEVMNFTs.bind(this),
    });
    /** Wallet Service Methods for BNB Chain */
    const Wallet = Object.freeze({
      /** Fetch authenticated user's BNB Chain tokens */
      fetchTokens: this.fetchEVMUserTokens.bind(this),
      /** Fetch authenticated user's BNB Chain transactions */
      fetchTransactions: this.fetchEVMUserTransactions.bind(this),
      /** Fetch BNB Chain Transactions in wallet address */
      fetchWalletTransactions: this.fetchEVMTransactionsFromWallet.bind(this),
      /** Fetch BNB Chain Transaction Data by transaction hash */
      fetchTransactionByHash: this.fetchEVMTransactionsFromWallet.bind(this),
      /** Transfers BNB from BNB Chain wallet to another BNB Chain wallet */
      transferBNB: this.transferBNB.bind(this),
      /** Transfers BEP20 token form your address to another addres on BNB Chain */
      transferBEP20Token: this.transferERC20Token.bind(this),
      /** Get the ERC tokens inside an BNB Chain wallet address */
      fetchTokensInWallet: this.fetchEVMWalletTokens.bind(this),
      /** Get the Transactions authored by an BNB Chain wallet address */
      fetchTransactionsByWallet: this.fetchEVMWalletTransactions.bind(this),
      /** Performs personal signing of a string message */
      personalSign: this.EVMPersonalSign.bind(this),
      /**
       * Performs off-chain signing of a an arbitrary typed message
       * @example Message
       * ```json
       * {
       *   "data": [
       *     {
       *       "name": "data",
       *       "type": "string",
       *       "value": "hello world"
       *     }
       *   ]
       * }
       * ```
       * */
      signTypedData: this.EVMSignTypedData.bind(this),
      /**
       * Performs off-chain versioned signing of an arbitrary typed message
       * @example Versioned Signing message
       * ```json
       * {
       *   "messageType": [
       *       {
       *           "name": "data",
       *           "type": "string"
       *       }
       *   ],
       *   "domain": {
       *       "name": "example.metamask.com",
       *       "version": "1",
       *       "chainId": 1,
       *       "verifyingContract": "0x0000000000000000000000000000000000000000",
       *       "salt": [
       *           1,
       *           2,
       *           3
       *       ],
       *       "extraField": "stuff"
       *   },
       *   "primaryType": "Message",
       *   "message": {
       *       "data": "hello"
       *   }
       * }
       * ```
       * */
      signTypedDataVersioned: this.EVMSignTypedDataVersioned.bind(this),
      /**
       * Signs a transaction and sends it to the network
       * @param payload
       * @returns
       */
      signAndSendTransaction: this.EVMSignAndSendTransaction.bind(this),
    });
    /** Metadata Service Methods for BNB Chain */
    const Metadata = Object.freeze({
      /** Fetch BNB Chain NFT Info */
      fetchNFTInfo: this.fetchEVMNFTInfo.bind(this),
      /** Fetch BNB Chain NFT Activity */
      fetchNFTEvents: this.fetchEVMNFTEvents.bind(this),
      /** Fetch BNB Chain NFTs Info. Accepts Filtering Metadata */
      fetchNFTsInfo: this.fetchEVMNFTsInfo.bind(this),
      /** Search BNB Chain Collection NFT */
      searchCollectionNFT: this.searchEVMCollectionNFT.bind(this),
      /** Search Recommended NFT in BNB Chain Collection */
      searchRecommendedNFTsInCollection:
        this.searchEVMRecommendedNFTInCollection.bind(this),
      /** Search BNB Chain Marketplace Events */
      searchMarketplaceEvents: this.searchEVMMarketplaceEvents.bind(this),
      /** Search NFT Collections Info */
      queryCollectionsInfo: this.queryCollectionsInfo.bind(this),
      /** Search NFT Collection Filter Parameters */
      queryCollectionFilterMetadata:
        this.queryCollectionFilterMetadata.bind(this),
      /** Search NFT Collection Filter Parameters */
      queryCollectionSummary: this.queryCollectionSummary.bind(this),
      /**
       * Register an NFT collection info to Metadata service.
       * After successful registration, the Metadata Service will index the collection data.
       * */
      registerCollection: this.registerCollection.bind(this),
    });
    return {
      Asset,
      Wallet,
      Metadata,
    };
  }

  /** Polygon SDK Methods */
  get Polygon() {
    /** Asset Service Methods for Polygon */
    const Asset = Object.freeze({
      /** Purchase NFT on Polygon Marketplace Address */
      buyNFT: this.buyEVMNFT.bind(this),
      /** List NFT on Polygon Marketplace Address */
      listNFT: this.listEVMNFT.bind(this),
      /** Cancel NFT Listing on Polygon Marketplace Address */
      cancelListing: this.cancelEVMNFTListing.bind(this),
      /**  Transfer Polygon NFT to another address */
      transferNFT: this.transferEVMNFT.bind(this),
      /** Create Purchase NFT transaction on Ethereum Marketplace Address */
      buyNFTTransaction: this.buyEVMNFTTransaction.bind(this),
      /** Create List NFT transaction on Ethereum Marketplace Address */
      listNFTTransaction: this.listEVMNFTTransaction.bind(this),
      /** Create Cancel NFT Listing transaction on Ethereum Marketplace Address */
      cancelListingTransaction: this.cancelEVMNFTListingTransaction.bind(this),
      /** Create Transfer Ethereum NFT to another address transaction */
      transferNFTTransaction: this.transferNFTTransaction.bind(this),
      /** Create a new NFT Marketplace on Polygon */
      createMarketplace: this.createEVMMarketplace.bind(this),
      /** Updates a sn existing NFT Marketplace on Polygon */
      updateMarketplace: this.updateEVMMarketplace.bind(this),
      /** Search NFT Marketplace on Polygon */
      queryMarketplaces: this.queryEVMMarketplaces.bind(this),
      /** Creates a new verified collection on Polygon */
      createCollection: this.createEVMCollection.bind(this),
      /** Mints a new NFT to a collection on Polygon */
      mintNFT: this.mintEVMNFT.bind(this),
      /** Verifies the mint configuration of a Polygon NFT */
      verifyMintConfig: this.verifyEVMMintConfig.bind(this),
      /** Queries the Polygon collections for an authenticated user */
      getCollections: this.getEVMCollections.bind(this),
      /** Queries the Polygon NFTs minted to a collection  */
      getCollectionNFTs: this.getEVMCollectionNFTs.bind(this),
      /** Searches Polygon NFTs by Owner Addresses */
      searchNFTsByOwnerAddresses: this.searchEVMNFTsByOwnerAddresses.bind(this),
      /** Fetch Polygon NFT Info */
      searchNFT: this.searchEVMNFTInfo.bind(this),
      /** Search EVM NFTs by their contract_addresses and token_ids */
      searchNFTs: this.searchEVMNFTs.bind(this),
    });
    /** Wallet Service Methods for Polygon */
    const Wallet = Object.freeze({
      /** Fetch authenticated user's Polygon tokens */
      fetchTokens: this.fetchEVMUserTokens.bind(this),
      /** Fetch authenticated user's Polygon transactions */
      fetchTransactions: this.fetchEVMUserTransactions.bind(this),
      /** Fetch Polygon Transactions in wallet address */
      fetchWalletTransactions: this.fetchEVMTransactionsFromWallet.bind(this),
      /** Fetch Polygon Transaction Data by transaction hash */
      fetchTransactionByHash: this.fetchEVMTransactionsFromWallet.bind(this),
      /** Transfer MATIC from Polygon wallet to another Polygon wallet */
      transferMATIC: this.transferMATIC.bind(this),
      /** Transfer ERC20 token form your address to another address */
      transferERC20Token: this.transferERC20Token.bind(this),
      /** Get the ERC tokens inside an Polygon wallet address */
      fetchTokensInWallet: this.fetchEVMWalletTokens.bind(this),
      /** Get the Transactions authored by an Polygon wallet address */
      fetchTransactionsByWallet: this.fetchEVMWalletTransactions.bind(this),
      /** Performs personal signing of a string message */
      personalSign: this.EVMPersonalSign.bind(this),
      /**
       * Performs off-chain signing of a an arbitrary typed message
       * @example Message
       * ```json
       * {
       *   "data": [
       *     {
       *       "name": "data",
       *       "type": "string",
       *       "value": "hello world"
       *     }
       *   ]
       * }
       * ```
       * */
      signTypedData: this.EVMSignTypedData.bind(this),
      /**
       * Performs off-chain versioned signing of an arbitrary typed message
       * @example Versioned Signing message
       * ```json
       * {
       *   "messageType": [
       *       {
       *           "name": "data",
       *           "type": "string"
       *       }
       *   ],
       *   "domain": {
       *       "name": "example.metamask.com",
       *       "version": "1",
       *       "chainId": 1,
       *       "verifyingContract": "0x0000000000000000000000000000000000000000",
       *       "salt": [
       *           1,
       *           2,
       *           3
       *       ],
       *       "extraField": "stuff"
       *   },
       *   "primaryType": "Message",
       *   "message": {
       *       "data": "hello"
       *   }
       * }
       * ```
       * */
      signTypedDataVersioned: this.EVMSignTypedDataVersioned.bind(this),
      /**
       * Signs a transaction and sends it to the network
       * @param payload
       * @returns
       */
      signAndSendTransaction: this.EVMSignAndSendTransaction.bind(this),
    });
    /** Metadata Service Methods for Polygon */
    const Metadata = Object.freeze({
      /** Fetch Polygon NFT Info */
      fetchNFTInfo: this.fetchEVMNFTInfo.bind(this),
      /** Fetch Polygon NFT Activity */
      fetchNFTEvents: this.fetchEVMNFTEvents.bind(this),
      /** Fetch Polygon NFTs Info. Accepts Filtering Metadata */
      fetchNFTsInfo: this.fetchEVMNFTsInfo.bind(this),
      /** Search Polygon Collection NFT */
      searchCollectionNFT: this.searchEVMCollectionNFT.bind(this),
      /** Search Recommended NFT in Polygon Collection */
      searchRecommendedNFTsInCollection:
        this.searchEVMRecommendedNFTInCollection.bind(this),
      /** Search Polygon Marketplace Events */
      searchMarketplaceEvents: this.searchEVMMarketplaceEvents.bind(this),
      /** Search NFT Collections Info */
      queryCollectionsInfo: this.queryCollectionsInfo.bind(this),
      /** Search NFT Collection Filter Parameters */
      queryCollectionFilterMetadata:
        this.queryCollectionFilterMetadata.bind(this),
      /** Search NFT Collection Filter Parameters */
      queryCollectionSummary: this.queryCollectionSummary.bind(this),
      /**
       * Register an NFT collection info to Metadata service.
       * After successful registration, the Metadata Service will index the collection data.
       * */
      registerCollection: this.registerCollection.bind(this),
    });

    return {
      Asset,
      Wallet,
      Metadata,
    };
  }

  /** SUI SDK Methods */
  get SUI() {
    /** Asset Service Methods for SUI */
    const Asset = Object.freeze({
      getMintedCollections:this.suiGetMintedCollections.bind(this),
      getMintedNFTOnCollection:this.suiGetMintedNFTOnCollection.bind(this),
      mintCollection:this.suiMintCollection.bind(this),
      mintNFT:this.suiMintNFT.bind(this),
      queryNFT:this.suiQueryNFT.bind(this),
      searchNFTsByOwner:this.suiSearchNFTsByOwner.bind(this),
      searchNFTs:this.suiSearchNFTs.bind(this)
    });
    /** Wallet Service Methods for SUI */
    const Wallet = Object.freeze({
      getTransactionByDigest: this.suiGetTransactionByDigest.bind(this),
      transferSUI: this.suiTransferSUI.bind(this),
      transferToken: this.suiTransferToken.bind(this),
      getTokens: this.suiGetTokens.bind(this),
    });
    /** Metadata Service Methods for Polygon */
    const Metadata = Object.freeze({});

    return {
      Asset,
      Wallet,
      Metadata,
    };
  }
  /**
   * Opens wallet UI
   * @param path
   * @param shouldAutoClose
   * @returns
   */
  public async openWalletPage(
    path = '',
    shouldAutoClose = false,
    isWholePath = false
  ): Promise<Window | undefined> {
    console.log("open wallet method:"+this._uxMode)
    if (this._uxMode === 'popup') {
      return this.openPopupWallet(path,isWholePath);
    } else if (this._uxMode === 'embedded') {
      return this.openEmbeddedWallet(path, shouldAutoClose,isWholePath);
    }
  }

  public async openWallet() : Promise<Window| undefined>{
    let walletUrl = `${this.walletUrl}`
    return this.openWalletPage(walletUrl,false,true);
  }

  /***
   * Logs in a user. Opens a popup window for the login operation
   */
  login(): Promise<{ user: any; refreshToken: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        // 定义 authWindow 变量并初始化为 undefined
        let authWindow: Window | undefined = undefined;

        // 定义处理钱包授权弹窗消息的回调函数
        const handleWalletUIMessage = async (event: MessageEvent) => {
          const { deserialize } = await import('bson');

          console.log('raw result:', event);
          if (event.data?.name === 'mw:auth:login') {
            const payload = deserialize(event.data.payload);
            console.log('12121212', deserialize(event.data.payload));
            console.debug('auth:payload ===>', payload);
            if (payload.access_token && payload.refresh_token) {
              // 更新用户刷新令牌
              this.userRefreshToken = payload.refresh_token;
              // 使用新的访问令牌更新凭据
              this.useCredentials({
                accessToken: payload.access_token,
              });
              // 发送请求获取用户信息
              await this.fetchUser();
              console.log('user:', this.user);
              // 如果可以使用浏览器本地存储，则将刷新令牌保存在本地
              if (this._storageKey && canUseDom && this.userRefreshToken) {
                const internalRefreshTokenKey = `${this._storageKey}:refresh`;
                localStorage.setItem(
                  internalRefreshTokenKey,
                  this.userRefreshToken
                );
              }
              // 返回用户信息和刷新令牌
              console.log('access:' + payload.access_token);
              console.log('refresh:' + payload.refresh_token);
              resolve({
                user: this.user,
                refreshToken: this.userRefreshToken!,
              });
              // 关闭钱包授权弹窗
              if (this._uxMode === 'popup') {
                authWindow && authWindow.close();
              } else {
                windowEmitter.emit('close');
              }
            }
          }
          if (event.data.name === 'mw:auth:close') {
            windowEmitter.emit('close');
          }
        };

        // 注册钱包授权弹窗消息的监听器
        if (this._uxMode === 'embedded') {
          windowEmitter.on('message', handleWalletUIMessage);
        } else {
          window.addEventListener('message', handleWalletUIMessage);
        }

        // 打开钱包授权弹窗，并返回此窗口对象
        const shouldAutoCloseAfterLogin = true;
        authWindow = await this.openWalletPage(`${this.loginUrl}`, shouldAutoCloseAfterLogin,true);
      } catch (e: any) {
        reject(e.message);
      }
    });
  }
  
  private getApprovalToken = (payload: ICreateActionPayload) =>
    new Promise<{ action: IAction; authorization_token: string | undefined }>(
      async (resolve, reject) => {
        if (this.__secretAccessKey) {
          resolve({
            action: {} as any,
            authorization_token: undefined,
          });
          return;
        }

        try {
          const result = createActionSchema.validate(payload);
          if (result.error) {
            throw result.error;
          }

          const response = await this.auth.post<IResponse<IAction>>(
            `/actions/request`,
            payload
          );

          const action = response.data.data;

          console.debug('action_created', action);
          console.debug('action:requesting_approval for', action.uuid);
          const approvalPath = `/approve/${action.uuid}`;
          let approvalWindow: Window | undefined = undefined;
          const { deserialize } = await import('bson');
          const handleApprovalEvent = (event: MessageEvent) => {
            if (event.data?.name === 'mw:action:approve') {
              const payload = deserialize(event.data.payload);
              if (payload.action && payload.action.uuid === action.uuid) {
                console.debug('auth:approved_action', payload);
                if (this._uxMode === 'popup') {
                  approvalWindow && approvalWindow.close();
                } else {
                  windowEmitter.emit('close');
                }
                resolve({
                  authorization_token: payload.authorization_token,
                  action: payload.action,
                });
              } else if (event.data?.name === 'mw:action:cancel') {
                reject(`User denied approval for action:${action.uuid}.`);
              }
            }

            if (event.data.name === 'mw:auth:close') {
              windowEmitter.emit('close');
            }
          };

          if (this._uxMode === 'embedded') {
            windowEmitter.on('message', handleApprovalEvent);
          } else {
            window.addEventListener('message', handleApprovalEvent);
          }

          approvalWindow = await this.openWalletPage(approvalPath);
        } catch (e: any) {
          reject(e.message);
        }
      }
    );

  // ==========================================================================================================
  //   V2 SDK METHODS
  // ==========================================================================================================

  /**
   * @service Asset Service
   * Asset Services - Handles multi-chain collection and NFT asset minting as well as
   * well tracking ownership of assets. It handles NFT marketplace procedures and
   * auction processes. For advanced use cases, it can produce raw headless marketplace
   * and asset transactions that can be can used with external wallets.
   * @see https://documenter.getpostman.com/view/22264663/2s93Jru4Bx#api-service-infrastructure
   */

  /**
   * Purchase NFT on Solana AuctionHouse Instance
   */
  private async buySolanaNFT(
    payload: IBuySolanaNFTPayloadV2
  ): Promise<SolanaNFTListingV2> {
    assertSolanaOnly('buySolanaNFT', this.chainConfig);
    const result = BaseSolanaAuctionSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'buy_nft',
      value: payload.price,
      params: payload,
    });

    const response = await this.asset.post<IResponse<SolanaNFTListingV2>>(
      `/${this.base('asset')}/auction/buy`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  /**
   * List NFT on Solana AuctionHouse Instance
   */
  private async listSolanaNFT(
    payload: IBuySolanaListNFTPayloadV2
  ): Promise<SolanaNFTListingV2> {
    assertSolanaOnly('listSolanaNFT', this.chainConfig);
    const result = BaseSolanaAuctionSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'list_nft',
      value: payload.price,
      params: payload,
    });

    const response = await this.asset.post<IResponse<SolanaNFTListingV2>>(
      `/${this.base('asset')}/auction/list`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  /**
   * Cancel NFT Listing on Solana AuctionHouse Instance
   */
  private async cancelSolanaNFTListing(
    payload: ISolanaCancelNFTListingPayloadV2
  ): Promise<SolanaNFTListingV2> {
    assertSolanaOnly('cancelSolanaNFTListing', this.chainConfig);
    const result = BaseSolanaAuctionSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'cancel_listing',
      value: payload.price,
      params: payload,
    });

    const response = await this.asset.post<IResponse<SolanaNFTListingV2>>(
      `/${this.base('asset')}/auction/cancel`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  /**
   * Transfer an NFT on Solana
   */
  private async transferSolanaNFT(
    payload: ITransferSolanaNFTPayloadV2
  ): Promise<SolanaNFTListingV2> {
    assertSolanaOnly('transferSolanaNFT', this.chainConfig);
    const result = TransferSolanaNFTSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'transfer_nft',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<IResponse<SolanaNFTListingV2>>(
      `/${this.base('asset')}/auction/transfer`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  /**
   * Create a new NFT Marketplace on Solana
   */
  private async createSolanaMarketplace(
    payload: ICreateSolanaMarketplacePayloadV2
  ): Promise<SolanaMarketplaceV2> {
    assertSolanaOnly('createSolanaMarketplace', this.chainConfig);
    const result = CreateMarketplaceSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'create_marketplace',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<IResponse<SolanaMarketplaceV2>>(
      `/${this.base('asset')}/marketplaces/create`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  /**
   * Updates an existing NFT Marketplace on Solana
   */
  private async updateSolanaMarketplace(
    payload: IUpdateMarketplacePayloadV2
  ): Promise<SolanaNFTListingV2> {
    assertSolanaOnly('updateSolanaMarketplace', this.chainConfig);
    const result = UpdateMarketplaceSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'update_marketplace',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<IResponse<SolanaNFTListingV2>>(
      `/${this.base('asset')}/marketplaces/update`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  /**
   * Queries marketplaces by the following properties for an authenticated user
   * @param {MarketplaceQueryOptionsV2} query
   * @param query.client_id
   * @param query.name
   * @param query.authority
   * @param query.treasury_mint
   * @param query.auction_house_fee_account
   * @param query.auction_house_treasury
   * @param query.treasury_withdrawal_destination
   * @param query.fee_withdrawal_destination
   * @param query.seller_fee_basis_points
   * @param query.requires_sign_off
   * @param query.can_change_sale_price
   * @param pagination
   */
  private async querySolanaMarketplaces(
    query: MarketplaceQueryOptionsV2,
    pagination: {
      page?: number;
      count?: number;
    } = {
      page: 1,
      count: 24,
    }
  ): Promise<IPaginatedResponse<ISolanaMarketplaceQueryResultV2[]>['data']> {
    assertSolanaOnly('querySolanaMarketplaces', this.chainConfig);
    const params = qs.stringify({ ...query, ...pagination });

    const response = await this.asset.get<
      IPaginatedResponse<ISolanaMarketplaceQueryResultV2[]>
    >(`/${this.base('asset')}/marketplaces?${params}`);

    return response.data.data;
  }

  /**
   * Queries the transaction status of a Solana asset by the transaction signature
   */
  private async querySolanaAssetTransactionStatus(
    payload: QueryAssetTransactionStatusPayload
  ): Promise<QueryAssetTransactionStatusResult> {
    assertSolanaOnly('querySolanaAssetTransactionStatus', this.chainConfig);
    const result = QueryAssetTransactionStatusSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }

    const response = await this.asset.post<
      IResponse<QueryAssetTransactionStatusResult>
    >(`/${this.base('asset')}/confirmation/transactions-status`, result.value);
    return response.data.data;
  }

  /**
   * Queries the mint status of a set of mint addresses. This is useful when performing batch minting for a large array of
   * mint addresses
   */
  private async querySolanaAssetMintsStatus(
    payload: QueryAssetMintsStatusPayload
  ): Promise<any> {
    assertSolanaOnly('querySolanaAssetMintsStatus', this.chainConfig);
    const result = QueryAssetMintsStatusSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }

    const response = await this.asset.post<
      IResponse<QueryAssetTransactionStatusResult>
    >(`/${this.base('asset')}/confirmation/mints-status`, result.value);
    return response.data.data;
  }

  /**
   * Creates a new verified collection on Solana
   */
  private async createSolanaVerifiedCollection(
    payload: CreateVerifiedCollectionPayloadV2
  ): Promise<VerifiedSolanaCollection> {
    assertSolanaOnly('createSolanaVerifiedCollection', this.chainConfig);
    const result = CreateVerifiedCollectionSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'create_collection',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<IResponse<VerifiedSolanaCollection>>(
      `/${this.base('asset')}/mint/collection`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  /**
   * Mints a new NFT to Solana collection
   */
  private async mintSolanaNFT(
    payload: MintSolanaNFTToCollectionPayloadV2
  ): Promise<MintSolanaNFTToCollectionResultV2> {
    assertSolanaOnly('mintSolanaNFT', this.chainConfig);
    const result = MintSolanaNFTToCollectionSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'mint_nft',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<
      IResponse<MintSolanaNFTToCollectionResultV2>
    >(`/${this.base('asset')}/mint/nft`, result.value, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });
    return response.data.data;
  }

  /**
   * Updates the metadata account of an NFT on Solana
   */
  private async updateSolanaNFTMetadata(
    payload: UpdateSolanaNFTMetadataPayloadV2
  ): Promise<MintSolanaNFTToCollectionResultV2> {
    assertSolanaOnly('updateSolanaNFTMetadata', this.chainConfig);
    this.warnAuthenticated();

    const { authorization_token } = await this.getApprovalToken({
      type: 'mint_nft',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<
      IResponse<MintSolanaNFTToCollectionResultV2>
    >(`/${this.base('asset')}/mint/update`, payload, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });
    return response.data.data;
  }

  /**
   * Verifies the mint configuration of a Solana NFT
   */
  private async verifySolanaMintConfig(
    payload: VerifySolanaMintConfigPayloadV2
  ): Promise<VerifySolanaMintConfigResultV2> {
    const result = VerifySolanaMintConfigSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const response = await this.asset.post<
      IResponse<VerifySolanaMintConfigResultV2>
    >(`/${this.base('asset')}/mint/verify-config`, result.value);
    return response.data.data;
  }

  /**
   * Queries the Solana collections for an authenticated user
   * @requires Authenticated
   */
  private async getSolanaCollections(): Promise<VerifiedSolanaCollection[]> {
    this.warnAuthenticated();
    assertSolanaOnly('getSolanaCollections', this.chainConfig);
    const response = await this.asset.get<
      IResponse<VerifiedSolanaCollection[]>
    >(`/${this.base('asset')}/mint/get-collections`);
    return response.data.data;
  }

  /**
   * Queries the Solana NFTs minted on a collection
   * @requires Authenticated
   */
  private async getSolanaCollectionNFTs(
    collection_mint_address: string
  ): Promise<SolanaNFT[]> {
    this.warnAuthenticated();
    assertSolanaOnly('getSolanaCollections', this.chainConfig);
    const response = await this.asset.get<IResponse<SolanaNFT[]>>(
      `/${this.base(
        'asset'
      )}/mint/get-collection-nfts/${collection_mint_address}`
    );
    return response.data.data;
  }

  // ANCHOR
  /**
   * Searches Solana NFTs by Mint Addresses
   */
  private async searchSolanaNFTsByMintAddresses<
    T extends ChainConfig<SolanaChain>['network']
  >(
    payload: SearchSolanaNFTsByMintAddressesPayloadV2
  ): Promise<T extends 'devnet' ? SolanaNFTDevnet : SolanaNFT> {
    assertSolanaOnly('searchSolanaNFTsByMintAddresses', this.chainConfig);
    const result = SearchSolanaNFTsByMintAddressesSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const response = await this.asset.post<IResponse<any>>(
      `/${this.base('asset')}/nft/mints`,
      result.value
    );
    return response.data.data;
  }

  // ANCHOR
  /**
   * Searches Solana NFTs by Creator Addresses
   */
  private async searchSolanaNFTsByCreatorAddresses<
    T extends ChainConfig<SolanaChain>['network']
  >(
    payload: SearchSolanaNFTsByCreatorsPayloadV2
  ): Promise<T extends 'devnet' ? SolanaNFTDevnet : SolanaNFT> {
    assertSolanaOnly('searchSolanaNFTsByCreatorAddresses', this.chainConfig);
    const result = SearchSolanaNFTsByCreatorAddressesSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    if (isSolana(this.chainConfig) && this.chainConfig.network === 'devnet') {
      console.warn(
        `[MirrorWorld:searchSolanaNFTsByCreatorAddresses]: "searchSolanaNFTsByCreatorAddresses" is a long-running task on Solana devnet and may time. We're currently working to improve its performance.`
      );
    }
    const response = await this.asset.post<IResponse<any>>(
      `/${this.base('asset')}/nft/creators`,
      result.value
    );
    return response.data.data;
  }

  /**
   * Searches Solana NFTs by Update authorities Addresses
   */
  private async searchSolanaNFTsByUpdateAuthorityAddresses<
    T extends ChainConfig<SolanaChain>['network']
  >(
    payload: SearchSolanaNFTsByUpdateAuthoritiesPayloadV2
  ): Promise<T extends 'devnet' ? SolanaNFTDevnet : SolanaNFT> {
    assertSolanaOnly(
      'searchSolanaNFTsByUpdateAuthorityAddresses',
      this.chainConfig
    );
    const result =
      SearchSolanaNFTsByUpdateAuthorityAddressesSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    if (isSolana(this.chainConfig) && this.chainConfig.network === 'devnet') {
      console.warn(
        `[MirrorWorld:searchSolanaNFTsByUpdateAuthorityAddresses]: "searchSolanaNFTsByUpdateAuthorityAddresses" is a long-running task on Solana devnet and may time. We're currently working to improve its performance.`
      );
    }
    const response = await this.asset.post<IResponse<any>>(
      `/${this.base('asset')}/nft/update-authorities`,
      result.value
    );
    return response.data.data;
  }

  /**
   * Searches Solana NFTs by Owner Addresses
   */
  private async searchSolanaNFTsByOwnerAddresses(
    payload: SearchSolanaNFTsByOwnersPayloadV2
  ): Promise<SearchSolanaNFTsResponseV2> {
    assertSolanaOnly('searchSolanaNFTsByOwnerAddresses', this.chainConfig);
    const result = SearchSolanaNFTsByOwnerAddressesSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    if (isSolana(this.chainConfig) && this.chainConfig.network === 'devnet') {
      console.warn(
        `[MirrorWorld:searchSolanaNFTsByOwnerAddresses]: "searchSolanaNFTsByOwnerAddresses" is a long-running task on Solana devnet and may time. We're currently working to improve its performance.`
      );
    }
    const response = await this.asset.post<
      IResponse<SearchSolanaNFTsResponseV2>
    >(`/${this.base('asset')}/nft/owners`, result.value);
    return response.data.data;
  }

  /**
   * @service Metadata
   * Fetch Solana NFT Info
   */
  private async searchSolanaNFTByMintAddress(
    payload: QuerySolanaNFTInfoPayload
  ): Promise<SolanaNFT> {
    assertSolanaOnly('searchSolanaNFTByMintAddress', this.chainConfig);
    const result = SearchSolanaNFTInfoSchemaV2.validate({
      mint_address: payload.mint_address,
    });
    if (result.error) {
      throw result.error;
    }

    const response = await this.asset.get<IResponse<SolanaNFT>>(
      `/${this.base('asset')}/nft/${result.value.mint_address}`
    );

    return response.data.data;
  }

  /**
   * Purchase NFT on EVM Marketplace Address
   */
  private async buyEVMNFT(
    payload: IBuyEVMNFTPayloadV2
  ): Promise<EVMNFTListingV2> {
    assertEVMOnly('buyEVMNFT', this.chainConfig);
    const result = BuyEVMNFTSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'buy_nft',
      value: payload.price,
      params: payload,
    });

    const response = await this.asset.post<IResponse<EVMNFTListingV2>>(
      `/${this.base('asset')}/auction/buy`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  private async buyEVMNFTTransaction(
    payload: IBuyEVMNFTPayloadV2
  ): Promise<EvmWalletRequest> {
    assertEVMOnly('buyEVMNFT', this.chainConfig);
    const result = BuyEVMNFTSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    if (!(window as Window & { ethereum?: any })?.ethereum) {
      throw new Error('Ethereum provider is not defined');
    }
    if (!result.value.from_wallet_address) {
      throw new Error('from_wallet_address is required');
    }

    const { data } = await this.asset.post<
      IResponse<EVMNFTListingTransactionV2>
    >(`/${this.base('asset')}/auction/buy/transaction`, result.value);

    return (window as Window & { ethereum?: any }).ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: data.data.tx?.from, // The user's active address.
          to: data.data.tx?.to,
          data: data.data.tx?.data,
          value: data.data.tx?.value?.hex,
          gas: '100000',
        },
      ],
    });
  }

  /**
   * List NFT on EVM Marketplace Address
   */
  private async listEVMNFT(
    payload: IListEVMNFTPayloadV2
  ): Promise<EVMNFTListingV2> {
    assertEVMOnly('listEVMNFT', this.chainConfig);
    const result = ListEVMNFTSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'list_nft',
      value: payload.price,
      params: payload,
    });

    const response = await this.asset.post<IResponse<EVMNFTListingV2>>(
      `/${this.base('asset')}/auction/list`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  private async listEVMNFTTransaction(
    payload: IListEVMNFTPayloadV2
  ): Promise<EVMNFTListingV2 | EvmWalletRequest> {
    assertEVMOnly('listEVMNFT', this.chainConfig);
    const result = ListEVMNFTSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    if (!(window as Window & { ethereum?: any })?.ethereum) {
      throw new Error('Ethereum provider is not defined');
    }
    if (!result.value.from_wallet_address) {
      throw new Error('from_wallet_address is required');
    }
    const { data } = await this.asset.post<
      IResponse<EVMNFTListingTransactionV2>
    >(`/${this.base('asset')}/auction/list/transaction`, result.value);
    if (data.data.type === 'approval') {
      return (window as Window & { ethereum?: any }).ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: data.data.tx?.from, // The user's active address.
            to: data.data.tx?.to, // Required except during contract publications.
            data: data.data.tx?.data,
            gas: '100000',
          },
        ],
      });
    }

    const signature = await this.signMessage(
      result.value.from_wallet_address,
      data.data.order_msg as string
    );

    const { data: submitData } = await this.asset.post<
      IResponse<EVMNFTListingV2>
    >(`/${this.base('asset')}/auction/list/submit`, {
      action_id: data.data.action_id,
      signature,
    });

    return submitData.data;
  }

  private async signMessage(account: string, message: string) {
    const params = [account, message];
    const method = 'eth_signTypedData_v4';
    return (window as Window & { ethereum?: any }).ethereum.request({
      method: method,
      params: params,
    });
  }

  /**
   * Cancel NFT Listing on EVM Marketplace Address
   */
  private async cancelEVMNFTListing(
    payload: ICancelListingEVMPayloadV2
  ): Promise<EVMNFTListingV2> {
    assertEVMOnly('cancelEVMNFTListing', this.chainConfig);
    const result = CancelEVMNFTListingSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'cancel_listing',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<IResponse<EVMNFTListingV2>>(
      `/${this.base('asset')}/auction/cancel`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  private async cancelEVMNFTListingTransaction(
    payload: ICancelListingEVMPayloadV2
  ): Promise<EVMNFTListingV2> {
    assertEVMOnly('cancelEVMNFTListing', this.chainConfig);
    const result = CancelEVMNFTListingSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    if (!(window as Window & { ethereum?: any })?.ethereum) {
      throw new Error('Ethereum provider is not defined');
    }
    if (!result.value.from_wallet_address) {
      throw new Error('from_wallet_address is required');
    }
    const { data } = await this.asset.post<
      IResponse<EVMNFTListingTransactionV2>
    >(`/${this.base('asset')}/auction/cancel/transaction`, result.value);

    if (data.data.type === 'cancel') {
      await (window as Window & { ethereum?: any }).ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: data.data.tx?.from, // The user's active address.
            to: data.data.tx?.to, // Required except during contract publications.
            data: data.data.tx?.data,
            gas: '100000',
          },
        ],
      });
    }

    const { data: submitData } = await this.asset.post<
      IResponse<EVMNFTListingV2>
    >(`/${this.base('asset')}/auction/cancel/submit`, result.value);

    return submitData.data;
  }

  /**
   * Transfer EVM NFT to another address
   */
  private async transferEVMNFT(
    payload: ITransferEVMNFTPayloadV2
  ): Promise<EVMNFTListingV2> {
    assertEVMOnly('transferEVMNFT', this.chainConfig);
    const result = TransferEVMNFTSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'transfer_nft',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<IResponse<EVMNFTListingV2>>(
      `/${this.base('asset')}/auction/transfer`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  private async transferNFTTransaction(
    payload: ITransferEVMNFTPayloadV2
  ): Promise<EvmWalletRequest> {
    assertEVMOnly('buyEVMNFT', this.chainConfig);
    const result = BuyEVMNFTSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    if (!(window as Window & { ethereum?: any })?.ethereum) {
      throw new Error('Ethereum provider is not defined');
    }
    if (!result.value.from_wallet_address) {
      throw new Error('from_wallet_address is required');
    }

    const { data } = await this.asset.post<
      IResponse<EVMNFTListingTransactionV2>
    >(`/${this.base('asset')}/auction/transfer/transaction`, result.value);

    return (window as Window & { ethereum?: any }).ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: data.data.tx?.from, // The user's active address.
          to: data.data.tx?.to,
          data: data.data.tx?.data,
          value: data.data.tx?.value?.hex,
          gas: '100000',
        },
      ],
    });
  }

  /**
   * Create a new NFT Marketplace on EVM
   */
  private async createEVMMarketplace(
    payload: ICreateEVMMarketplacePayloadV2
  ): Promise<IEVMMarketplaceV2> {
    assertEVMOnly('createEVMMarketplace', this.chainConfig);
    const result = CreateEVMMarketplaceSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'create_marketplace',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<IResponse<IEVMMarketplaceV2>>(
      `/${this.base('asset')}/marketplaces/create`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  /**
   * Update NFT Marketplace on EVM
   */
  private async updateEVMMarketplace(
    payload: IUpdateEVMMarketplacePayloadV2
  ): Promise<IEVMMarketplaceV2> {
    assertEVMOnly('updateEVMMarketplace', this.chainConfig);
    const result = UpdateEVMMarketplaceSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const { authorization_token } = await this.getApprovalToken({
      type: 'update_marketplace',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<IResponse<IEVMMarketplaceV2>>(
      `/${this.base('asset')}/marketplaces/update`,
      result.value,
      {
        headers: {
          ...(authorization_token && {
            'x-authorization-token': authorization_token,
          }),
        },
      }
    );
    return response.data.data;
  }

  /**
   * Search NFT Marketplace on EVM
   */
  private async queryEVMMarketplaces(
    query: IQueryEVMMarketplaceOptionsV2,
    pagination: IQueryEVMMarketplacePaginationOptionsV2 = {
      page: 1,
      size: 24,
    }
  ): Promise<IPaginatedResponse<IQueryEVMMarketplaceResultV2[]>['data']> {
    assertEVMOnly('queryEVMMarketplaces', this.chainConfig);
    const params = qs.stringify({ ...query, ...pagination });

    const response = await this.asset.get<
      IPaginatedResponse<IQueryEVMMarketplaceResultV2[]>
    >(`/${this.base('asset')}/marketplaces?${params}`);

    return response.data.data;
  }

  // ANCHOR
  /**
   * Creates a new verified collection on EVM
   */
  private async createEVMCollection(
    payload: CreateEVMCollectionV2Payload
  ): Promise<CreateEVMCollectionResultV2> {
    assertEVMOnly('createEVMCollection', this.chainConfig);
    const result = CreateEVMCollectionSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'create_collection',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<
      IResponse<CreateEVMCollectionResultV2>
    >(`/${this.base('asset')}/mint/collection`, result.value, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });
    return response.data.data;
  }

  /**
   * Mints a new NFT to a collection on EVM
   */
  private async mintEVMNFT(
    payload: MintEVMNFTToCollectionV2Payload
  ): Promise<MintEVMNFTToCollectionResultV2> {
    assertEVMOnly('mintEVMNFT', this.chainConfig);
    const result = MintEVMNFTToCollectionSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }

    const { authorization_token } = await this.getApprovalToken({
      type: 'mint_nft',
      value: 0,
      params: payload,
    });

    const response = await this.asset.post<
      IResponse<MintEVMNFTToCollectionResultV2>
    >(`/${this.base('asset')}/mint/nft`, result.value, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });
    return response.data.data;
  }

  /**
   * Verifies the mint config for an NFT on EVM
   */
  private async verifyEVMMintConfig(
    payload: VerifyEVMMintConfigPayloadV2
  ): Promise<VerifyEVMMintConfigResultV2> {
    assertEVMOnly('verifyEVMMintConfig', this.chainConfig);
    const result = VerifyEVMMintConfigSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const response = await this.asset.post<
      IResponse<VerifySolanaMintConfigResultV2>
    >(`/${this.base('asset')}/mint/verify-config`, result.value);
    return response.data.data;
  }

  /**
   * Queries the EVM collections for an authenticated user
   * @requires Authenticated
   */
  private async getEVMCollections(): Promise<EVMCollectionV2[]> {
    assertEVMOnly('getEVMCollections', this.chainConfig);
    const response = await this.asset.get<IResponse<EVMCollectionV2[]>>(
      `/${this.base('asset')}/mint/get-collections`
    );
    return response.data.data;
  }

  /**
   * Queries the EVM NFTs minted to a collection
   * @requires Authentication
   */
  private async getEVMCollectionNFTs(collection_address: string): Promise<any> {
    assertEVMOnly('getEVMCollectionNFTs', this.chainConfig);
    const response = await this.asset.get<IResponse<any>>(
      `/${this.base('asset')}/mint/get-collection-nfts/${collection_address}`
    );
    return response.data.data;
  }

  /**
   * Searches EVM NFTs by Owner Addresses
   */
  private async searchEVMNFTsByOwnerAddresses<
    T extends ChainConfig<EVMChains>['network']
  >(payload: SearchEVMNFTsByOwnerAddressesPayloadV2): Promise<any> {
    this.assertEVMOnly('searchEVMNFTsByOwnerAddresses');
    const result = SearchEVMNFTsByOwnerAddressesSchemaV2.validate(payload);
    if (result.error) {
      throw result.error;
    }
    const response = await this.asset.post<IResponse<any>>(
      `/${this.base('asset')}/nft/owner`,
      result.value
    );
    return response.data.data;
  }

  /**
   * @service Asset
   * Fetch EVM NFT Info
   */
  private async searchEVMNFTInfo(
    contract_address: string,
    token_id: number
  ): Promise<EVMNFTInfo> {
    assertEVMOnly('searchEVMNFTInfo', this.chainConfig);

    const response = await this.asset.get<IResponse<EVMNFTInfo>>(
      `/${this.base('asset')}/nft/${contract_address}/${token_id}`
    );

    return response.data.data;
  }

  /**
   * Search EVM NFTs by their contract_addresses and token_ids
   * @param payload
   * @returns
   */
  private async searchEVMNFTs(payload: SearchEVMNFTsPayloadV2) {
    assertEVMOnly('searchEVMNFTs', this.chainConfig);
    const result = SearchEVMNFTsSchemaV2.validate(
      payload.tokens.map((t) => ({
        token_address: t.contract_address,
        token_id: t.token_id,
      }))
    );
    if (result.error) {
      throw result.error;
    }
    const response = await this.asset.post<IResponse<any>>(
      `/${this.base('asset')}/nft/mints`,
      result.value
    );
    return response.data.data;
  }

  // ANCHOR Wallet Service V2
  // TODO
  //
  private warnAuthenticated() {
    if (!this.user) {
      console.warn(`User is null, maybe not logged in. Could potentially fail`);
    }
    if (!this.isLoggedIn) {
      console.warn(
        `isLoggedIn is false, maybe is not logged in. Could potentially fail`
      );
    }
    if (!this.__secretAccessKey) {
      console.warn(
        `__secretAccessKey is null, maybe User is not logged in. Could potentially fail`
      );
    }
  }
  /**
   * Fetch authenticated user's EVM tokens
   */
  private async fetchEVMUserTokens(): Promise<GetEVMUserTokensV2Data> {
    assertEVMOnly('fetchEVMUserTokens', this.chainConfig);
    this.warnAuthenticated();
    const response = await this._wallet.get<IResponse<GetEVMUserTokensV2Data>>(
      `/${this.base('wallet')}/tokens`
    );
    return response.data.data;
  }
  /**
   * Get EVM User Transactions
   */
  private async fetchEVMUserTransactions(): Promise<EVMUserTransactionsV2Data> {
    assertEVMOnly('fetchEVMUserTransactions', this.chainConfig);
    this.warnAuthenticated();
    const response = await this._wallet.get<
      IResponse<EVMUserTransactionsV2Data>
    >(`/${this.base('wallet')}/transactions`);
    return response.data.data;
  }

  /**
   * Get EVM User Transactions
   */
  private async fetchEVMTransactionsFromWallet(
    wallet_address: string
  ): Promise<EVMUserTransactionsV2Data> {
    assertEVMOnly('fetchEVMUserTransactions', this.chainConfig);
    this.warnAuthenticated();
    const response = await this._wallet.get<
      IResponse<EVMUserTransactionsV2Data>
    >(`/${this.base('wallet')}/${wallet_address}/transactions`);
    return response.data.data;
  }

  /**
   * Fetch EVM transaction data by signature hash
   */
  private async fetchEVMTransactionFromSignature(
    transaction_signature: string
  ): Promise<EVMTransaction> {
    const response = await this._wallet.get<IResponse<EVMTransaction>>(
      `/${this.base('wallet')}/transactions/${transaction_signature}`
    );
    return response.data.data;
  }

  /**
   * Transfer ETH from EVM wallet to another EVM wallet
   */
  private async transferETH(
    payload: EVMTransferTokensPayloadV2
  ): Promise<EVMTransferTokensResponseV2> {
    assertAvailableFor('transferETH', this.chainConfig, [
      Ethereum('goerli'),
      Ethereum('mainnet'),
    ]);
    this.warnAuthenticated();

    const { authorization_token } = await this.getApprovalToken({
      type: 'transfer_eth',
      value: 0,
      params: payload,
    });

    const response = await this._wallet.post<
      IResponse<EVMTransferTokensResponseV2>
    >(`/${this.base('wallet')}/transfer-eth`, payload, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });
    return response.data.data;
  }

  /**
   * Fetch EVM transaction data by signature hash
   */
  private async transferBNB(
    payload: EVMTransferTokensPayloadV2
  ): Promise<EVMTransferTokensResponseV2> {
    assertAvailableFor('transferBNB', this.chainConfig, [
      BNBChain('bnb-mainnet'),
      BNBChain('bnb-testnet'),
    ]);
    this.warnAuthenticated();

    const { authorization_token } = await this.getApprovalToken({
      type: 'transfer_bnb',
      value: 0,
      params: payload,
    });

    const response = await this._wallet.post<
      IResponse<EVMTransferTokensResponseV2>
    >(`/${this.base('wallet')}/transfer-bnb`, payload, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });
    return response.data.data;
  }
  /**
   * Fetch EVM transaction data by signature hash
   */
  private async transferMATIC(
    payload: EVMTransferTokensPayloadV2
  ): Promise<EVMTransferTokensResponseV2> {
    assertAvailableFor('transferMATIC', this.chainConfig, [
      Polygon('mumbai-mainnet'),
      Polygon('mumbai-testnet'),
    ]);

    this.warnAuthenticated();

    const { authorization_token } = await this.getApprovalToken({
      type: 'transfer_bnb',
      value: 0,
      params: payload,
    });

    const response = await this._wallet.post<
      IResponse<EVMTransferTokensResponseV2>
    >(`/${this.base('wallet')}/transfer-matic`, payload, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });
    return response.data.data;
  }

  /** Transfer ERC20 token form your address to another address */
  private async transferERC20Token(
    payload: EVMTransferERCTokenPayloadV2
  ): Promise<EVMTransferTokensResponseV2> {
    this.warnAuthenticated();

    const { authorization_token } = await this.getApprovalToken({
      type: 'transfer_erc20_token',
      value: 0,
      params: payload,
    });

    const response = await this._wallet.post<
      IResponse<EVMTransferTokensResponseV2>
    >(`/${this.base('wallet')}/transfer-token`, payload, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });
    return response.data.data;
  }
  /**
   * Get the ERC tokens inside an EVM wallet address
   */
  private async fetchEVMWalletTokens(wallet_address: string): Promise<any> {
    const response = await this._wallet.get<IResponse<GetEVMUserTokensV2Data>>(
      `/${this.base('wallet')}/tokens/${wallet_address}`
    );
    return response.data.data;
  }
  /**
   * Get the Transactions inside an EVM wallet address
   */
  private async fetchEVMWalletTransactions(
    wallet_address: string
  ): Promise<EVMUserTransactionsV2Data> {
    const response = await this._wallet.get<
      IResponse<EVMUserTransactionsV2Data>
    >(`/${this.base('wallet')}/${wallet_address}/transactions`);
    return response.data.data;
  }

  /** Performs personal signing of a string message */
  private async EVMPersonalSign(
    payload: EVMPersonalSignPayloadV2
  ): Promise<EVMPersonalSignResultV2> {
    assertEVMOnly('EVMPersonalSign', this.chainConfig);
    this.warnAuthenticated();
    const { authorization_token } = await this.getApprovalToken({
      type: 'personal_sign',
      value: 0,
      params: payload,
    });

    const response = await this._wallet.post<
      IResponse<EVMPersonalSignResultV2>
    >(`/${this.base('wallet')}/personal-sign`, payload, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });

    return response.data.data;
  }

  /**
   * Performs off-chain signing of a an arbitrary typed message
   * @example Message
   * ```json
   * {
   *   "data": [
   *     {
   *       "name": "data",
   *       "type": "string",
   *       "value": "hello world"
   *     }
   *   ]
   * }
   * ```
   * */
  private async EVMSignTypedData(
    payload: EVMSignTypedDataPayloadV2
  ): Promise<EVMSignTypedDataV2Result> {
    assertEVMOnly('EVMPersonalSign', this.chainConfig);
    this.warnAuthenticated();
    const { authorization_token } = await this.getApprovalToken({
      type: 'sign_typed_data',
      value: 0,
      params: payload,
    });

    const response = await this._wallet.post<
      IResponse<EVMSignTypedDataV2Result>
    >(`/${this.base('wallet')}/sign-type-data`, payload, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });

    return response.data.data;
  }

  /**
   * Performs off-chain versioned signing of an arbitrary typed message
   * @example Versioned Signing message
   * ```json
   * {
   *   "messageType": [
   *       {
   *           "name": "data",
   *           "type": "string"
   *       }
   *   ],
   *   "domain": {
   *       "name": "example.metamask.com",
   *       "version": "1",
   *       "chainId": 1,
   *       "verifyingContract": "0x0000000000000000000000000000000000000000",
   *       "salt": [
   *           1,
   *           2,
   *           3
   *       ],
   *       "extraField": "stuff"
   *   },
   *   "primaryType": "Message",
   *   "message": {
   *       "data": "hello"
   *   }
   * }
   * ```
   * */
  private async EVMSignTypedDataVersioned(
    payload: EVMSignTypedDataWithVersionPayloadV2
  ): Promise<EVMSignTypedDataWithVersionV2Result> {
    assertEVMOnly('EVMPersonalSign', this.chainConfig);
    this.warnAuthenticated();
    const { authorization_token } = await this.getApprovalToken({
      type: 'sign_typed_data_with_version',
      value: 0,
      params: payload,
    });

    const response = await this._wallet.post<
      IResponse<EVMSignTypedDataWithVersionV2Result>
    >(`/${this.base('wallet')}/sign-type-data-version`, payload, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });

    return response.data.data;
  }

  /**
   * Signs a transaction and sends it to the network
   * @param payload
   * @returns
   */
  private async EVMSignAndSendTransaction(
    payload: EVMSignAndSendTransactionPayloadV2
  ): Promise<EVMSignAndSendTransactionV2Result> {
    assertEVMOnly('EVMSignAndSendTransaction', this.chainConfig);
    this.warnAuthenticated();
    const { authorization_token } = await this.getApprovalToken({
      type: 'sign_transaction',
      value: 0,
      params: payload,
    });

    const response = await this._wallet.post<
      IResponse<EVMSignAndSendTransactionV2Result>
    >(`/${this.base('wallet')}/send-tx`, payload, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });

    return response.data.data;
  }

  // ANCHOR Solana Service V2

  /**
   * Get Users tokens on solana. Requires authentication
   * @returns
   */
  private async fetchSolanaUserTokens(): Promise<GetSolanaTokensV2Data> {
    assertSolanaOnly('fetchSolanaUserTokens', this.chainConfig);
    this.warnAuthenticated();
    const response = await this._wallet.get<IResponse<GetSolanaTokensV2Data>>(
      `/${this.base('wallet')}/tokens`
    );
    return response.data.data;
  }

  /**
   * Get Users transactions on solana. Requires authentication
   * @returns
   */
  private async fetchSolanaUserTransactions(): Promise<GetSolanaTransactionV2Data> {
    assertSolanaOnly('fetchSolanaUserTokens', this.chainConfig);
    this.warnAuthenticated();
    const response = await this._wallet.get<
      IResponse<GetSolanaTransactionV2Data>
    >(`/${this.base('wallet')}/transactions`);
    return response.data.data;
  }

  /**
   * Get transactions performed by an arbitrary wallet
   */
  private async fetchSolanaWalletTransactions(
    wallet_address: string
  ): Promise<GetSolanaTransactionV2Data> {
    assertSolanaOnly('fetchSolanaUserTokens', this.chainConfig);
    const response = await this._wallet.get<
      IResponse<GetSolanaTransactionV2Data>
    >(`/${this.base('wallet')}/${wallet_address}/transactions`);
    return response.data.data;
  }

  /**
   * Get raw transaction data from signature
   */
  private async fetchSolanaWalletTransactionFromSignature(
    signature: string
  ): Promise<SolanaTransactionV2> {
    assertSolanaOnly(
      'fetchSolanaWalletTransactionFromSignature',
      this.chainConfig
    );
    const response = await this._wallet.get<IResponse<SolanaTransactionV2>>(
      `/${this.base('wallet')}/transaction/${signature}`
    );
    return response.data.data;
  }

  /**
   * Get Solana tokens in wallet by wallet address
   */
  private async fetchSolanaTokensFromWalletAddress(
    wallet_address: string
  ): Promise<GetSolanaTokensV2Data> {
    assertSolanaOnly('fetchSolanaTokensFromWalletAddress', this.chainConfig);
    const response = await this._wallet.get<IResponse<GetSolanaTokensV2Data>>(
      `/${this.base('wallet')}/${wallet_address}/tokens`
    );
    return response.data.data;
  }

  /** Transfers SOL from user's wallet address to another wallet address */
  private async transferSOLV2(
    payload: SolanaTransferSOLPayloadV2
  ): Promise<SolanaBaseSignatureResultV2> {
    assertSolanaOnly('transferSOLV2', this.chainConfig);
    this.warnAuthenticated();

    const { authorization_token } = await this.getApprovalToken({
      type: 'sign_transaction',
      value: 0,
      params: payload,
    });

    const response = await this._wallet.get<
      IResponse<SolanaBaseSignatureResultV2>
    >(`/${this.base('wallet')}/transfer-sol`, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });
    return response.data.data;
  }

  /** Transfers SPL Tokens from user's wallet address to another wallet address */
  private async transferSPLTokenV2(
    payload: SolanaTransferSPLTokenPayloadV2
  ): Promise<SolanaBaseSignatureResultV2> {
    assertSolanaOnly('transferSPLTokenV2', this.chainConfig);
    this.warnAuthenticated();

    const { authorization_token } = await this.getApprovalToken({
      type: 'sign_transaction',
      value: 0,
      params: payload,
    });

    const response = await this._wallet.get<
      IResponse<SolanaBaseSignatureResultV2>
    >(`/${this.base('wallet')}/transfer-sol`, {
      headers: {
        ...(authorization_token && {
          'x-authorization-token': authorization_token,
        }),
      },
    });
    return response.data.data;
  }

  // ANCHOR Metadata Service V2
  // TODO
  //

  /**
   * @service Metadata service
   * Fetch EVM NFT Activity
   */
  private async fetchEVMNFTEvents(
    payload: QueryEVMNFTActivityPayload
  ): Promise<EVMNFTActivity[]> {
    assertEVMOnly('fetchEVMNFTEvents', this.chainConfig);
    const result = fetchEVMNFTsActivitySchema.validate({
      contract: payload.contract,
      token_id: payload.token_id,
      page: payload.page,
      page_size: payload.page_size,
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.metadata.post<
      IResponse<QueryEVMNFTActivityResult>
    >(`/${this.base('metadata')}/nft/events`, result.value);

    return response.data.data.events;
  }

  /**
   * @service Metadata
   * Fetch EVM NFT Info
   */
  private async fetchEVMNFTInfo(
    payload: QueryEVMNFTInfoPayload
  ): Promise<EVMNFTInfo> {
    assertEVMOnly('fetchEVMNFTInfo', this.chainConfig);

    const result = fetchEVMNFTInfoSchema.validate({
      contract: payload.contract,
      token_id: payload.token_id,
    });
    if (result.error) {
      throw result.error;
    }

    const response = await this.metadata.get<IResponse<EVMNFTInfo>>(
      `/${this.base('metadata')}/nft/${result.value.contract}/${
        result.value.token_id
      }`
    );

    return response.data.data;
  }

  /**
   * @service Metadata
   * Fetch EVM NFTs Info
   */
  private async fetchEVMNFTsInfo<T extends QueryEVMNFTsPayloadV2>(
    payload: T
  ): Promise<QueryEVMNFTsInfoResultV2> {
    assertEVMOnly('fetchEVMNFTsInfo', this.chainConfig);

    const response = await this.metadata.post<
      IResponse<QueryEVMNFTsInfoResultV2>
    >(`/${this.base('metadata')}/nfts`, payload);

    return response.data.data;
  }

  /**
   * @service Metadata
   * Search EVM Collection NFT
   */
  private async searchEVMCollectionNFT(
    payload: SearchEVMNFTInCollectionPayloadV2
  ): Promise<QueryEVMNFT[]> {
    assertEVMOnly('searchEVMCollectionNFT', this.chainConfig);

    const response = await this.metadata.post<IResponse<QueryEVMNFT[]>>(
      `/${this.base('metadata')}/nft/search`,
      payload
    );

    return response.data.data;
  }

  /**
   * @service Metadata
   * Search Recommended EVM Collection NFT
   */
  private async searchEVMRecommendedNFTInCollection(
    payload: SearchEVMRecommendedNFTInCollectionPayloadV2
  ): Promise<QueryEVMNFT[]> {
    assertEVMOnly('searchEVMRecommendedNFTInCollection', this.chainConfig);

    const response = await this.metadata.post<IResponse<QueryEVMNFT[]>>(
      `/${this.base('metadata')}/nft/search/recommend`,
      payload
    );

    return response.data.data;
  }
  /**
   * @service Metadata
   * Search EVM Marketplace Ebents
   */
  private async searchEVMMarketplaceEvents(
    payload: SearchEVMMarketplaceEventsPayloadV2
  ): Promise<EVMMarketplaceEventsResultV2> {
    assertEVMOnly('searchEVMMarketplaceEvents', this.chainConfig);

    const response = await this.metadata.post<
      IResponse<EVMMarketplaceEventsResultV2>
    >(`/${this.base('metadata')}/marketplace/events`, payload);

    return response.data.data;
  }

  /**
   * @service Metadata
   * Fetch Solana NFT Info
   */
  private async fetchSolanaNFTInfo(
    mint_address: string
  ): Promise<SolanaNFTInfo> {
    assertSolanaOnly('fetchSolanaNFTInfo', this.chainConfig);

    const response = await this.metadata.get<IResponse<SolanaNFTInfo>>(
      `/${this.base('metadata')}/nft/${mint_address}`
    );

    return response.data.data;
  }

  /**
   * @service Metadata
   * Fetch Solana NFTs Info
   */
  private async fetchSolanaNFTsInfo(
    payload: QuerySolanaNFTsPayloadV2
  ): Promise<QuerySolanaNFTsInfoResultV2> {
    assertSolanaOnly('fetchSolanaNFTsInfo', this.chainConfig);

    const response = await this.metadata.post<
      IResponse<QuerySolanaNFTsInfoResultV2>
    >(`/${this.base('metadata')}/nfts`, payload);

    return response.data.data;
  }

  /**
   * @service Metadata service
   * Fetch Solana NFT Events Activity
   */
  private async fetchSolanaNFTEvents(
    payload: QuerySolanaNFTActivityPayload
  ): Promise<SolanaNFTActivity[]> {
    assertSolanaOnly('fetchSolanaNFTEvents', this.chainConfig);
    const result = fetchSolanaNFTsActivitySchema.validate({
      mint_address: payload.mint_address,
      page: payload.page,
      page_size: payload.page_size,
    });
    if (result.error) {
      throw result.error;
    }

    const response = await this.metadata.post<
      IResponse<QuerySolanaNFTActivityResult>
    >(`/${this.base('metadata')}/nft/events`, result.value);

    return response.data.data.events;
  }

  /**
   * @service Metadata
   * Search Solana Collection NFT
   */
  private async searchSolanaCollectionNFT(
    payload: SearchSolanaNFTInCollectionPayloadV2
  ): Promise<QuerySolanaNFT[]> {
    assertEVMOnly('searchSolanaCollectionNFT', this.chainConfig);

    const response = await this.metadata.post<IResponse<QuerySolanaNFT[]>>(
      `/${this.base('metadata')}/nft/search`,
      payload
    );

    return response.data.data;
  }

  /**
   * @service Metadata
   * Search Recommended NFT in Solana Collection
   */
  private async searchSolanaRecommendedNFTInCollection(
    payload: SearchSolanaRecommendedNFTInCollectionPayloadV2
  ): Promise<QuerySolanaNFT[]> {
    assertEVMOnly('searchSolanaRecommendedNFTInCollection', this.chainConfig);

    const response = await this.metadata.post<IResponse<QuerySolanaNFT[]>>(
      `/${this.base('metadata')}/nft/search/recommend`,
      payload
    );

    return response.data.data;
  }

  /**
   * @service Metadata
   * Search Solana Marketplace Events
   */
  private async searchSolanaMarketplaceEvents(
    payload: SearchSolanaMarketplaceEventsPayloadV2
  ): Promise<SolanaMarketplaceEventsResultV2> {
    assertSolanaOnly('searchSolanaMarketplaceEvents', this.chainConfig);

    const response = await this.metadata.post<
      IResponse<SolanaMarketplaceEventsResultV2>
    >(`/${this.base('metadata')}/marketplace/events`, payload);

    return response.data.data;
  }

  /** Search NFT Collections Info */
  private async queryCollectionsInfo(
    payload: SearchCollectionsInfoV2
  ): Promise<CollectionsResultV2> {
    const response = await this.metadata.post<IResponse<CollectionsResultV2>>(
      `/${this.base('metadata')}/collections`,
      payload
    );
    return response.data.data;
  }

  /** Search NFT Collection Filter Parameters */
  private async queryCollectionFilterMetadata(
    collection: string
  ): Promise<CollectionFilterMetadataV2> {
    const response = await this.metadata.get<
      IResponse<CollectionFilterMetadataV2>
    >(
      `/${this.base(
        'metadata'
      )}/collection/filter_info?collection=${collection}`
    );
    return response.data.data;
  }

  /** Search NFT Collection Filter Parameters */
  private async queryCollectionSummary(
    payload: QueryCollectionsSummaryV2
  ): Promise<CollectionSummaryV2[]> {
    const response = await this.metadata.post<IResponse<CollectionSummaryV2[]>>(
      `/${this.base('metadata')}/collection/summary`,
      payload
    );
    return response.data.data;
  }

  /**
   * Register an NFT collection info to Metadata service.
   * After successful registration, the Metadata Service will index the collection data.
   * */
  private async registerCollection(
    payload: RegisterCollectionPayloadV2
  ): Promise<RegisterCollectionResultV2> {
    const response = await this.metadata.post<
      IResponse<RegisterCollectionResultV2>
    >(`/${this.base('metadata')}/collection/register`, payload);
    return response.data.data;
  }

  private async suiGetTransactionByDigest(digest: string) {
    this.warnAuthenticated();
    const url = `/${this.base('wallet')}/transactions/${digest}`;
    return await SUIWrapper.getTransactionByDigest(
      this.chainConfig,
      this.v2,
      url
    );
  }

  private async suiTransferSUI(payload: SUITransferSUIPayloadV2) {
    this.warnAuthenticated();
    const url = `/${this.base('wallet')}/transfer-sui`;
    return await SUIWrapper.transferSUI(
      payload,
      url,
      this.chainConfig,
      this.v2
    );
  }

  private async suiTransferToken(payload: SUITransferTokenPayload) {
    this.warnAuthenticated();
    const url = `/${this.base('wallet')}/transfer-token`;
    return await SUIWrapper.transferToken(
      payload,
      url,
      this.chainConfig,
      this.v2
    );
  }

  private async suiGetTokens() {
    this.warnAuthenticated();
    const url = `/${this.base('wallet')}/tokens`;
    return await SUIWrapper.getTokens(url, this.chainConfig, this.v2);
  }

  private async suiGetMintedCollections() {
    this.warnAuthenticated();
    const url = `/${this.base('asset')}/mint/get-collections`;
    return await SUIWrapper.getMintedCollections(
      url,
      this.chainConfig,
      this.v2
    );
  }

  private async suiGetMintedNFTOnCollection(collection_address: string) {
    this.warnAuthenticated();
    const url =
      `/${this.base('asset')}/mint/get-collection-nfts/` + collection_address;
    return await SUIWrapper.getMintedNFTOnCollection(
      url,
      this.chainConfig,
      this.v2
    );
  }

  private async suiMintCollection(payload: SUIMintCollectionPayload) {
    this.warnAuthenticated();
    const url = `/${this.base('asset')}/mint/collection`;
    return await SUIWrapper.mintCollection(
      payload,
      url,
      this.chainConfig,
      this.v2
    );
  }

  private async suiMintNFT(payload: SUIMintNFTPayload) {
    this.warnAuthenticated();
    const url = `/${this.base('asset')}/mint/nft`;
    return await SUIWrapper.mintNFT(payload, url, this.chainConfig, this.v2);
  }

  private async suiQueryNFT(nft_object_id:string){
    this.warnAuthenticated()
    let url = `/${this.base('asset')}/nft/` + nft_object_id
    return await SUIWrapper.getTokens(url,this.chainConfig,this.v2)
  }

  private async suiSearchNFTsByOwner(payload:SUISearchNFTsByOwnerPayload){
    this.warnAuthenticated()
    let url = `/${this.base('asset')}/nft/owner`
    return await SUIWrapper.searchNFTsByOwner(payload,url,this.chainConfig,this.v2)
  }

  private async suiSearchNFTs(payload:SUISearchNFTsPayload){
    this.warnAuthenticated()
    let url = `/${this.base('asset')}/nft/mints`
    return await SUIWrapper.searchNFTs(payload,url,this.chainConfig,this.v2)
  }

  private assertEVMOnly(methodName: string) {
    return assertAvailableFor(methodName, this.chainConfig, [
      Ethereum('mainnet'),
      Ethereum('goerli'),
      Polygon('mumbai-mainnet'),
      Polygon('mumbai-testnet'),
      BNBChain('bnb-mainnet'),
      BNBChain('bnb-testnet'),
    ]);
  }

  private assertSolanaOnly(methodName: string) {
    return assertAvailableFor(methodName, this.chainConfig, [
      Solana('mainnet-beta'),
      Solana('devnet'),
    ]);
  }
}

function assertSolanaOnly(
  methodName: string,
  chainConfig: ChainConfig<ChainTypes>
) {
  return assertAvailableFor(methodName, chainConfig, [
    Solana('mainnet-beta'),
    Solana('devnet'),
  ]);
}

function assertEVMOnly(
  methodName: string,
  chainConfig: ChainConfig<ChainTypes>
) {
  return assertAvailableFor(methodName, chainConfig, [
    Ethereum('mainnet'),
    Ethereum('goerli'),
    Polygon('mumbai-mainnet'),
    Polygon('mumbai-testnet'),
    BNBChain('bnb-mainnet'),
    BNBChain('bnb-testnet'),
  ]);
}
