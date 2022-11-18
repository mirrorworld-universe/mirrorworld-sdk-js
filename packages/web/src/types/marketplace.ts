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
  treasureMint?: string;
  /**
   * The marketplace trading commission
   */
  sellerFeeBasisPoints: number;
}
