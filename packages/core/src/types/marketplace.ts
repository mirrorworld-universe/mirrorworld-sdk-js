import { TransactionControlOptions } from './nft';

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

export interface ICreateMarketplacePayloadV2
  extends Pick<TransactionControlOptions, 'skip_preflight'> {
  treasury_mint?: string;
  collections?: string[];
  seller_fee_basis_points: number;
  storefront?: IStorefrontConfig;
}

export interface IUpdateMarketplacePayload {
  new_authority?: string;
  treasury_mint?: string;
  collections?: string[];
  seller_fee_basis_points: number;
  storefront?: IStorefrontConfig;
}

export interface UpdateMarketplacePayload
  extends Omit<
    IUpdateMarketplacePayload,
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
  extends Pick<TransactionControlOptions, 'skip_preflight'> {
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

export interface IMarketplaceResponseV2 {
  marketplace: MarketplaceV2;
  transactionStatus: string;
  signature: string;
}

export interface MarketplaceV2 {
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
    MarketplaceV2,
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

export interface IMarketplaceQueryResultV2 {
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
