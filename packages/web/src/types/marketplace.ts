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
  treasureMint?: string;
  /**
   * The marketplace trading commission
   */
  sellerFeeBasisPoints: number;
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
  treasureMint?: string;
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
