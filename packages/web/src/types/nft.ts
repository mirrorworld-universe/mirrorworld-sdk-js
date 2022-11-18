export interface ISolanaNFT {
  name: string;
  sellerFeeBasisPoints: number;
  updateAuthorityAddress: string;
  description: string;
  image: string;
  externalUrl: string;
  creators?: Creator[] | null;
  owner: Owner;
  attributes?: MetadataAttribute[] | null;
  listings?: null[] | null;
}
export interface Creator {
  address: string;
  verified: boolean;
  share: number;
}
export interface Owner {
  address: string;
}
export interface MetadataAttribute {
  trait_type: string;
  value: string;
}

export interface CreateVerifiedCollectionPayload {
  name: string;
  symbol: string;
  metadataUri: string;
}

export interface ICreateVerifiedCollectionPayload
  extends Omit<CreateVerifiedCollectionPayload, 'metadataUri'> {
  url: string;
  confirmation: SolanaCommitment;
}

export interface CreateVerifiedSubCollectionPayload
  extends CreateVerifiedCollectionPayload {
  parentCollection: string;
}
export interface ICreateVerifiedSubCollectionPayload
  extends ICreateVerifiedCollectionPayload {
  collection_mint: string;
  confirmation: SolanaCommitment;
}

export interface IMintNFTPayload {
  collection_mint: string;
  name: string;
  symbol: string;
  url: string;
}

export interface MintNFTPayload
  extends Omit<IMintNFTPayload, 'url' | 'collection_mint'> {
  metadataUri: string;
  collection: string;
}

export interface IUpdateNFTPayload {
  name?: string;
  symbol?: string;
  url?: string;
  mint_address: string;
  update_authority?: string;
  seller_fee_basis_points?: number;
  confirmation: SolanaCommitment;
}

export interface UpdateNFTPayload
  extends Omit<
    IUpdateNFTPayload,
    | 'url'
    | 'seller_fee_basis_points'
    | 'confirmation'
    | 'mint_address'
    | 'update_authority'
  > {
  metadataUri: string;
  sellerFeeBasisPoints?: number;
  mintAddress: string;
  updateAuthority?: string;
}

export interface IListNFTPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
}

export interface ListNFTPayload extends Omit<IListNFTPayload, 'mint_address'> {
  mintAddress: string;
}

export interface IUpdateListingPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
}

export interface UpdateListingPayload
  extends Omit<IUpdateListingPayload, 'mint_address'> {
  /**
   * Mint Address of the NFT listing being updated
   */
  mintAddress: string;
}

export interface IBuyNFTPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
}

export interface BuyNFTPayload extends Omit<IBuyNFTPayload, 'mint_address'> {
  /**
   * Mint Address of the NFT being purchased
   */
  mintAddress: string;
}

export interface ICancelNFTPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
}

export interface CancelListingPayload
  extends Omit<ICancelNFTPayload, 'mint_address'> {
  /**
   * Mint Address of the NFT listing being cancelled
   */
  mintAddress: string;
}

export interface ITransferNFTPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  to_wallet_address: number;
}

export interface TransferNFTPayload {
  /**
   * Mint Address of the NFT listing being cancelled
   */
  mintAddress: string;
  /**
   * Recipient wallet address
   */
  recipientAddress: string;
}

export interface IVerifiedCollection {
  mint_address: string;
  url: string;
  update_authority: string;
  creator_address: string;
  name: string;
  symbol: string;
  collection?: null;
  signature: string;
  status: string;
}

export interface QueryNFTsBase {
  limit: number;
  offset: number;
}

export type QueryNftsFilters =
  | 'mint_addresses'
  | 'creators'
  | 'update_authorities'
  | 'owners';
export type ComputeNFTQueryRequestPayload<T extends QueryNftsFilters> =
  QueryNFTsBase &
    {
      [K in T]: string[];
    };

export interface QueryNFTsByMintAddressesPayload
  extends Omit<
    ComputeNFTQueryRequestPayload<'mint_addresses'>,
    'mint_addresses'
  > {
  mintAddresses: string[];
}

export interface QueryNFTsByCreatorsPayload
  extends Omit<ComputeNFTQueryRequestPayload<'creators'>, 'creators'> {
  creatorAddresses: string[];
}

export interface QueryNFTsByUpdateAuthoritiesPayload
  extends Omit<
    ComputeNFTQueryRequestPayload<'update_authorities'>,
    'update_authorities'
  > {
  updateAuthorities: string[];
}

export interface QueryNFTsByOwnersPayload
  extends Omit<ComputeNFTQueryRequestPayload<'owners'>, 'owners'> {
  owners: string[];
}

export type QueryUsersNFTsPayload = QueryNFTsByOwnersPayload;

export interface SolanaNFTExtended {
  name: string;
  sellerFeeBasisPoints: number;
  updateAuthorityAddress: string;
  description: string;
  image: string;
  externalUrl: string;
  creators: Creator[];
  owner: Owner;
  attributes: MetadataAttributes[];
  listings: SolanaNFTListing[];
}

export interface Owner {
  address: string;
}
export interface MetadataAttributes {
  trait_type: string;
  value: string;
}

export interface SolanaNFTListing {
  id: number;
  tradeState: string;
  seller: string;
  metadata: string;
  purchaseId: null | string;
  price: number;
  tokenSize: number;
  createdAt: string;
  canceledAt: null | string;
}

export interface SolanaNFTAuctionActivitiesPayload {
  mintAddress: string;
  auctionActivities: SolanaNFTAuctionActivity[];
  tokenTransfers: SolanaNFTTransfersEntity[];
}

export interface SolanaNFTAuctionActivity {
  id: number;
  mintAddress: string;
  txSignature: string;
  amount: number;
  receiptType: string;
  tokenPrice: string;
  blockTimeCreated: string;
  blockTimeCanceled?: null;
  tradeState: string;
  auctionHouseAddress: string;
  sellerAddress: string;
  buyerAddress?: null;
  metadata: string;
  blockTime: string;
}

export interface SolanaNFTTransfersEntity {
  id: number;
  mintAddress: string;
  txSignature: string;
  fromWalletAddress?: null;
  toWalletAddress: string;
  amount: number;
  blockTime: string;
  slot: number;
}

export interface ISolanaNFTMintResult {
  mint_address: string;
  url: string;
  update_authority: string;
  creator_address: string;
  name: string;
  symbol: string;
  collection: string;
  signature: string;
  status: string;
}

export enum SolanaCommitment {
  confirmed = 'confirmed',
  finalized = 'finalized',
}
