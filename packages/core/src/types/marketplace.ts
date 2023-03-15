import {
  EVMTransactionControlOptions,
  SolanaTransactionControlOptions,
} from './nft';

export interface INFTListing {
  id: number;
  type: string;
  wallet_address: string;
  mint_address: string;
  price: string;
  seller_address: string;
  signature: string;
  status: string;
  updatedAt: string;
  createdAt: string;
  to_wallet_address?: null;
}

/**
 * Storefront configuration object
 */
export interface IStorefrontConfig {
  subdomain: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
}

export interface ICreateMarketplacePayload {
  treasury_mint?: string;
  collections?: string[];
  seller_fee_basis_points: number;
  storefront?: IStorefrontConfig;
}

export interface CreateMarketplacePayload
  extends Omit<
    ICreateMarketplacePayload,
    'treasury_mint' | 'seller_fee_basis_points'
  > {
  /**
   * The token in which transactions on the marketplace will occur
   */
  treasuryMint?: string;
  /**
   * The marketplace trading commission
   */
  sellerFeeBasisPoints: number;
}

/**
 * Storefront configuration object V2
 */
export interface IStorefrontConfigV2 {
  subdomain: string;
  name: string;
  description: string;
}

export interface ICreateSolanaMarketplacePayloadV2
  extends Pick<SolanaTransactionControlOptions, 'skip_preflight'> {
  treasury_mint?: string;
  collections?: string[];
  seller_fee_basis_points: number;
  storefront?: IStorefrontConfig;
}

export interface IUpdateSolanaMarketplacePayload {
  new_authority?: string;
  treasury_mint?: string;
  collections?: string[];
  seller_fee_basis_points: number;
  storefront?: IStorefrontConfig;
}

export interface UpdateMarketplacePayload
  extends Omit<
    IUpdateSolanaMarketplacePayload,
    'treasury_mint' | 'seller_fee_basis_points' | 'new_authority'
  > {
  /**
   * The token in which transactions on the marketplace will occur
   */
  treasuryMint?: string;
  /**
   * The marketplace trading commission
   */
  sellerFeeBasisPoints: number;
  /**
   * Use this field if you wish to transfer the authority if your marketplace to another wallet address.
   * This is a dangerous procedure and is irreversible. Once this is action is performed, the current
   * authority will be revoked from the user wallet, and they will no longer have the privilege to update this
   * marketplace instance
   */
  newAuthority?: string;
}

export interface IUpdateMarketplacePayloadV2
  extends Pick<SolanaTransactionControlOptions, 'skip_preflight'> {
  new_authority?: string;
  treasury_mint?: string;
  collections?: string[];
  seller_fee_basis_points: number;
  storefront?: IStorefrontConfigV2;
}
/**
 * @deprecated
 */
export interface IMarketplaceResponse {
  marketplace: Marketplace;
  transactionStatus: string;
  signature: string;
}
/**
 * @deprecated
 */
export interface Marketplace {
  id: number;
  name: string;
  client_id: string;
  user_id: number;
  auction_house: string;
  authority: string;
  auction_house_treasury: string;
  auction_house_fee_account: string;
  fee_withdrawal_destination: string;
  requires_sign_off: boolean;
  can_change_sale_price: boolean;
  treasury_mint: string;
  treasury_withdrawal_destination: string;
  seller_fee_basis_points: number;
  storefront_url?: null;
  signature: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * @deprecated
 */
export type MarketplaceQueryOptions = Partial<
  Pick<
    Marketplace,
    | 'name'
    | 'client_id'
    | 'authority'
    | 'treasury_mint'
    | 'auction_house_fee_account'
    | 'auction_house_treasury'
    | 'treasury_withdrawal_destination'
    | 'fee_withdrawal_destination'
    | 'seller_fee_basis_points'
    | 'requires_sign_off'
    | 'can_change_sale_price'
  >
>;
/**
 * @deprecated
 */
export interface IMarketplaceQueryResult {
  id: number;
  name: string;
  client_id: string;
  authority: string;
  auction_house_fee_account: string;
  auction_house_treasury: string;
  treasury_withdrawal_destination: string;
  fee_withdrawal_destination: string;
  treasury_mint: string;
  seller_fee_basis_points: number;
  requires_sign_off: boolean;
  can_change_sale_price: boolean;
}

// ========================================================================
// V2 Marketplace Types
// ========================================================================

export interface ISolanaMarketplaceResponseV2 {
  marketplace: SolanaMarketplaceV2;
  transactionStatus: string;
  signature: string;
}

export interface SolanaMarketplaceV2 {
  id: number;
  name: string;
  client_id: string;
  user_id: number;
  auction_house: string;
  authority: string;
  auction_house_treasury: string;
  auction_house_fee_account: string;
  fee_withdrawal_destination: string;
  requires_sign_off: boolean;
  can_change_sale_price: boolean;
  treasury_mint: string;
  treasury_withdrawal_destination: string;
  seller_fee_basis_points: number;
  storefront_url?: null;
  signature: string;
  updatedAt: string;
  createdAt: string;
}

export type MarketplaceQueryOptionsV2 = Partial<
  Pick<
    SolanaMarketplaceV2,
    | 'name'
    | 'client_id'
    | 'authority'
    | 'treasury_mint'
    | 'auction_house_fee_account'
    | 'auction_house_treasury'
    | 'treasury_withdrawal_destination'
    | 'fee_withdrawal_destination'
    | 'seller_fee_basis_points'
    | 'requires_sign_off'
    | 'can_change_sale_price'
  >
>;

export interface ISolanaMarketplaceQueryResultV2 {
  id: number;
  name: string;
  client_id: string;
  authority: string;
  auction_house_fee_account: string;
  auction_house_treasury: string;
  treasury_withdrawal_destination: string;
  fee_withdrawal_destination: string;
  treasury_mint: string;
  seller_fee_basis_points: number;
  requires_sign_off: boolean;
  can_change_sale_price: boolean;
}

// =======================
// EVM Marketplace Types
// =======================

export interface ICreateEVMMarketplacePayloadV2
  extends EVMTransactionControlOptions {
  payment_token?: string;
  collections?: string[];
  seller_fee_basis_points: number;
  storefront?: IStorefrontConfig;
}

export interface IUpdateEVMMarketplacePayloadV2
  extends EVMTransactionControlOptions {
  payment_token?: string;
  collections?: string[];
  seller_fee_basis_points: number;
  storefront?: IStorefrontConfig;
}

export interface IEVMMarketplaceV2 {
  id: number;
  name: string;
  user_id: number;
  client_id: string;
  authority: string;
  conduit_signature: string;
  conduit_address: string;
  sea_port_signature: string;
  marketplace_address: string;
  seller_fee_basis_points: number;
  payment_token: string;
  storefront_url: any;
  collections: any[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEVMMarketplaceStorefrontConfigV2 {
  id: number;
  client_id: number;
  name: string;
  subdomain: string;
  description: string;
  logo?: string;
  banner?: string;
  config: string;
}

export interface IQueryEVMMarketplaceResultV2 extends IEVMMarketplaceV2 {
  storefront: IEVMMarketplaceStorefrontConfigV2 | null;
  trade_volume: number;
}

export type IQueryEVMMarketplaceOptionsV2 = Partial<
  Pick<
    IEVMMarketplaceV2,
    'name' | 'authority' | 'payment_token' | 'seller_fee_basis_points'
  >
>;

export interface IQueryEVMMarketplacePaginationOptionsV2 {
  /* The page number. Default is 1 */
  page: number;
  /* The number of results per page. Default is 10 */
  size: number;
}
