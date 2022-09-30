import {
  MirrorWorldEventKey,
  MirrorWorldEvents,
  MirrorWorldOptions,
} from './types/instance';
import {
  createAPIClient,
  mapServiceKeyToAuthView,
  MirrorWorldAPIClient,
} from './services/api';
import { ClusterEnvironment } from './services/cluster';
import { emitter } from './events/emitter';
import { clientOptionsSchema } from './validators';
import { LoginEmailCredentials } from './types/auth';
import { IResponse } from './types/response.type';
import { IUser, UserWithWallet, Wallet } from './types/user.type';
import { AxiosRequestConfig } from 'axios';
import { canUseDom } from './utils';
import {
  CancelListingPayload,
  CreateVerifiedCollectionPayload,
  CreateVerifiedSubCollectionPayload,
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
  createVerifiedSubCollectionSchema,
  fetchNFTsByCreatorAddressesSchema,
  fetchNFTsByMintAddressesSchema,
  fetchNFTsByOwnerAddressesSchema,
  fetchNFTsByUpdateAuthoritiesSchema,
  mintNFTSchema,
  transferNFTSchema,
} from './validators/nft.validators';
import {
  buyNFTSchema,
  cancelNFTListingSchema,
  listNFTSchema,
} from './validators/marketplace.validators';
import { INFTListing } from './types/marketplace';
import { throwError } from './errors/errors.interface';

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
    this.on('ready', async () => {
      if (autoLoginCredentials) {
        console.debug({
          autoLoginCredentials,
        });
        await this.refreshAccessToken(autoLoginCredentials);
        this.defineInternalListeners();
      }
    });
    this.emit('ready', undefined);
    return this;
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
    return `${result.baseURL}/${this.apiKey}`;
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
    const response = await this.api.post<IResponse<ITransferSPLTokenResponse>>(
      `/wallet/transfer-token`,
      result.value
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
    const response = await this.api.post<IResponse<ITransferSPLTokenResponse>>(
      `/wallet/transfer-sol`,
      result.value
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
    const response = await this.api.post<IResponse<IVerifiedCollection>>(
      `/solana/mint/collection`,
      result.value
    );
    return response.data.data;
  }

  /**
   * @service Marketplace
   * Create Verified SubCollection
   */
  async createVerifiedSubCollection(
    payload: CreateVerifiedSubCollectionPayload,
    commitment: SolanaCommitment = SolanaCommitment.confirmed
  ): Promise<IVerifiedCollection> {
    const result = createVerifiedSubCollectionSchema.validate({
      name: payload.name,
      symbol: payload.symbol,
      url: payload.metadataUri,
      collection_mint: payload.parentCollection,
      confirmation: commitment,
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<IResponse<IVerifiedCollection>>(
      `/solana/mint/sub-collection`,
      result.value
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
    const response = await this.api.post<IResponse<ISolanaNFTMintResult>>(
      `/solana/mint/nft`,
      result.value
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
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<IResponse<INFTListing>>(
      `/solana/marketplace/list`,
      result.value
    );
    return response.data.data;
  }

  /**
   * @service Marketplace
   * Purchase NFT on Mirror World Marketplace
   */
  async buyNFT(payload: ListNFTPayload): Promise<INFTListing> {
    const result = buyNFTSchema.validate({
      mint_address: payload.mintAddress,
      price: payload.price,
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<IResponse<INFTListing>>(
      `/solana/marketplace/buy`,
      result.value
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
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<IResponse<INFTListing>>(
      `/solana/marketplace/update`,
      result.value
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
    });
    if (result.error) {
      throw result.error;
    }
    const response = await this.api.post<IResponse<INFTListing>>(
      `/solana/marketplace/cancel`,
      result.value
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
    const response = await this.api.post<IResponse<INFTListing>>(
      `/solana/marketplace/transfer`,
      result.value
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
}
