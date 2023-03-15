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
  confirmation: TransactionCommitment;
}

export interface CreateVerifiedSubCollectionPayload
  extends CreateVerifiedCollectionPayload {
  parentCollection: string;
}
export interface ICreateVerifiedSubCollectionPayload
  extends ICreateVerifiedCollectionPayload {
  collection_mint: string;
  confirmation: TransactionCommitment;
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
  confirmation: TransactionCommitment;
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
  auction_house?: string;
}

export interface SolanaTransactionControlOptions {
  /**
   * The commitment metric gives clients a standard measure of the network
   * confirmation for the block. It describes how finalized a block is at that
   * point in time and clients can then use this information to derive their
   * own measures of commitment.
   *
   * @default `confirmed` - This commitment level is usually used for transactions that have been included in a block, but have not yet been confirmed by the network. The node will query the most recent block that has been voted on by the supermajority of the cluster (optimistic confirmation)
   * @option `finalized` - This is the highest level of commitment and transactions are irreversible. The RPC node will query the most recent block confirmed by the supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized. Transactions at this level also tend to have a higher transaction fee.
   */
  confirmation?: TransactionCommitment;
  /**
   * Skip preflight check is used to skip the preflight check when sending a transaction to the network.
   * Useful for debugging
   */
  skip_preflight?: boolean;
}

export interface ListNFTPayload
  extends Omit<IListNFTPayload, 'mint_address' | 'auction_house'> {
  mintAddress: string;
  /**
   * Auction House address of the marketplace
   * you are canceling the listing for. Be default, it falls back to the
   * Official Mirror World Marketplace Instance
   */
  auctionHouse?: string;
}

export interface IUpdateListingPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
  auction_house?: string;
}

export interface UpdateListingPayload
  extends Omit<IUpdateListingPayload, 'mint_address' | 'auction_house'> {
  /**
   * Mint Address of the NFT listing being updated
   */
  mintAddress: string;
  /**
   * Auction House address of the marketplace
   * you are canceling the listing for. Be default, it falls back to the
   * Official Mirror World Marketplace Instance
   */
  auctionHouse?: string;
}

export interface IBuySolanaNFTPayload {
  /**
   * Mint Address of the NFT being purchased
   */
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
  /**
   * Auction House address of the marketplace
   * you are canceling the listing for. Be default, it falls back to the
   * Official Mirror World Marketplace Instance
   */
  auction_house?: string;
}

export interface IBaseSolanaAuctionPayloadV2
  extends SolanaTransactionControlOptions {
  /**
   * Mint Address of the NFT being purchased
   */
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
  /**
   * Auction House address of the marketplace
   * you are canceling the listing for. Be default, it falls back to the
   * Official Mirror World Marketplace Instance
   */
  auction_house?: string;
}

export type IBuySolanaNFTPayloadV2 = IBaseSolanaAuctionPayloadV2;
export type IBuySolanaListNFTPayloadV2 = IBaseSolanaAuctionPayloadV2;
export type ISolanaCancelNFTListingPayloadV2 = IBaseSolanaAuctionPayloadV2;

export interface EVMTransactionControlOptions {
  /**
   * The commitment metric gives clients a standard measure of the network
   * confirmation for the block. It describes how finalized a block is at that
   * point in time and clients can then use this information to derive their
   * own measures of commitment.
   *
   * @default `confirmed` - This commitment level is usually used for transactions that have been included in a block, but have not yet been confirmed by the network. The node will query the most recent block that has been voted on by the supermajority of the cluster (optimistic confirmation)
   * @option `finalized` - This is the highest level of commitment and transactions are irreversible. The RPC node will query the most recent block confirmed by the supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized. Transactions at this level also tend to have a higher transaction fee.
   */
  confirmation?: TransactionCommitment;
}

export interface IBaseEVMAuctionPayloadV2 extends EVMTransactionControlOptions {
  /**
   * Contract Address of the NFT being auctioned
   */
  collection_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
  /**
   * Token ID of the NFT
   */
  token_id: number;
  /**
   * Marketplace Address address of the marketplace
   * you are buying, lsiting or cancelling a listing for
   */
  marketplace_address: string;
}

export type IBuyEVMNFTPayloadV2 = IBaseEVMAuctionPayloadV2;
export type IListEVMNFTPayloadV2 = IBaseEVMAuctionPayloadV2;
export type ICancelListingEVMPayloadV2 = Omit<
  IBaseEVMAuctionPayloadV2,
  'price'
>;

export interface BuyNFTPayload
  extends Omit<IBuySolanaNFTPayload, 'mint_address' | 'auction_house'> {
  /**
   * Mint Address of the NFT being purchased
   */
  mintAddress: string;
  /**
   * Auction House address of the marketplace
   * you are canceling the listing for. Be default, it falls back to the
   * Official Mirror World Marketplace Instance
   */
  auctionHouse?: string;
}

export interface ICancelNFTPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
  auction_house?: string;
}

export interface CancelListingPayload
  extends Omit<ICancelNFTPayload, 'mint_address' | 'auction_house'> {
  /**
   * Mint Address of the NFT listing being cancelled
   */
  mintAddress: string;
  /**
   * Auction House address of the marketplace
   * you are canceling the listing for. Be default, it falls back to the
   * Official Mirror World Marketplace Instance
   */
  auctionHouse?: string;
}

export interface ITransferNFTPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  to_wallet_address: number;
}

export interface ITransferSolanaNFTPayloadV2
  extends SolanaTransactionControlOptions {
  /**
   * Mint address of the NFT to transfer
   */
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  to_wallet_address: string;
}

export interface ITransferEVMNFTPayloadV2 extends EVMTransactionControlOptions {
  /**
   * Contract Address of the NFT being transferred
   */
  collection_address: string;
  /**
   * Token ID of the NFT
   */
  token_id: number;
  /**
   * To wallet address
   */
  to_wallet_address: string;
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
/** @deprecated Please use ^2.0.0 types */
export type QueryNftsFilters =
  | 'mint_addresses'
  | 'creators'
  | 'update_authorities'
  | 'owners';
/** @deprecated Please use ^2.0.0 types */
export type ComputeNFTQueryRequestPayload<T extends QueryNftsFilters> =
  QueryNFTsBase &
    {
      [K in T]: string[];
    };

/** @deprecated Please use ^2.0.0 types */
export interface QueryNFTsByMintAddressesPayload
  extends Omit<
    ComputeNFTQueryRequestPayload<'mint_addresses'>,
    'mint_addresses'
  > {
  mintAddresses: string[];
}
/** @deprecated Please use ^2.0.0 types */
export interface QueryNFTsByCreatorsPayload
  extends Omit<ComputeNFTQueryRequestPayload<'creators'>, 'creators'> {
  creatorAddresses: string[];
}
/** @deprecated Please use ^2.0.0 types */
export interface QueryNFTsByUpdateAuthoritiesPayload
  extends Omit<
    ComputeNFTQueryRequestPayload<'update_authorities'>,
    'update_authorities'
  > {
  updateAuthorities: string[];
}
/** @deprecated Please use ^2.0.0 types */
export interface QueryNFTsByOwnersPayload
  extends Omit<ComputeNFTQueryRequestPayload<'owners'>, 'owners'> {
  owners: string[];
  cursor?: string;
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

export enum TransactionCommitment {
  confirmed = 'confirmed',
  finalized = 'finalized',
}
