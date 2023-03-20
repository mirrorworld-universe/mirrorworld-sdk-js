import { SolanaTransactionControlOptions } from './nft';

export interface SolanaNFTListingV2 {
  id: number;
  type: string;
  wallet_address: string;
  mint_address: string;
  price: string;
  auction_house: string;
  signature: string;
  seller_address: string;
  to_wallet_address: string;
  status: string;
  updatedAt: string;
  createdAt: string;
  nft: Nft;
}

export interface Nft {
  id: number;
  url: string;
  mint_address: string;
  token_id: any;
  update_authority: string;
  creator_address: string;
  name: string;
  symbol: string;
  primary_sale_happened: boolean;
  is_mutable: boolean;
  collection: string;
  collection_verified: boolean;
  seller_fee_basis_points: number;
  metadata: Metadata;
  creators: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Metadata {
  name: string;
  image: string;
  symbol: string;
  attributes: Attribute[];
  collection: Collection;
  properties: Properties;
  description: string;
  external_url: string;
  seller_fee_basis_points: number;
}

export interface Attribute {
  value: any;
  trait_type: string;
}

export interface Collection {
  name: string;
  family: string;
}

export interface Properties {
  files: File[];
  category: string;
  creators: Creator[];
}

export interface File {
  uri: string;
  type: string;
}

export interface Creator {
  share: number;
  address: string;
}

export interface QueryAssetTransactionStatusPayload {
  signatures: string[];
}
export interface QueryAssetTransactionStatusResult {
  txs: SolanaTransactionData[];
}

export interface SolanaTransactionData {
  id: number;
  signature: string;
  wallet_address: string;
  client_id: string;
  status: string;
  type: string;
  mint_address: string;
  auction_house: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryAssetMintsStatusPayload {
  mint_addresses: string[];
}

export interface CreateVerifiedCollectionPayloadV2
  extends SolanaTransactionControlOptions {
  name: string;
  symbol: string;
  url: string;
  mint_id?: string;
  collection_mint?: string;
  seller_fee_basis_points?: number;
  to_wallet_address?: string;
}

export interface VerifiedSolanaCollection {
  mint_address: string;
  url: string;
  update_authority: string;
  creator_address: string;
  name: string;
  symbol: string;
  seller_fee_basis_points: number;
  signature: string;
  status: string;
}

export interface MintSolanaNFTWithPaymentOptionsV2 {
  receiver_wallet?: string;
  amount_sol?: number;
}

export interface MintSolanaNFTToCollectionPayloadV2
  extends SolanaTransactionControlOptions {
  name: string;
  symbol: string;
  url: string;
  mint_id?: string;
  collection_mint?: string;
  seller_fee_basis_points?: number;
  to_wallet_address?: string;
  payment?: MintSolanaNFTWithPaymentOptionsV2;
}

export interface MintSolanaNFTToCollectionResultV2 {
  mint_address: string;
  url: string;
  update_authority: string;
  creator_address: string;
  name: string;
  symbol: string;
  collection: string;
  seller_fee_basis_points: number;
  signature: string;
  status: string;
}

export interface UpdateSolanaNFTMetadataPayloadV2
  extends SolanaTransactionControlOptions {
  /**  The mint address of the NFT */
  mint_address: string;
  /**  The url of the NFT's json config */
  url: string;
  /**  The seller fee basis points of the NFT */
  seller_fee_basis_points: number;
  /**  The name of the NFT */
  name: string;
  /**  The symbol of the NFT */
  symbol: string;
  /**  The update authority of the NFT */
  update_authority: string;
}
export interface VerifySolanaMintConfigPayloadV2 {
  url: string;
}

export interface VerifySolanaMintConfigErrorV2 {
  error?: string;
}

export interface VerifySolanaMintConfigResultV2 {
  url: string;
  valid: boolean;
  error: VerifySolanaMintConfigErrorV2;
}

export interface SearchSolanaNFTsPaginationV2 {
  limit: number;
  offset: number;
}

export type SearchSolanaNftsFilters =
  | 'mint_addresses'
  | 'creators'
  | 'update_authorities'
  | 'owners';
export type ComputeSearchSolanaNFTRequestPayload<
  T extends SearchSolanaNftsFilters
> = SearchSolanaNFTsPaginationV2 &
  {
    [K in T]: string[];
  };

export interface SearchSolanaNFTsByMintAddressesPayloadV2
  extends ComputeSearchSolanaNFTRequestPayload<'mint_addresses'> {}

export interface SearchSolanaNFTsByCreatorsPayloadV2
  extends ComputeSearchSolanaNFTRequestPayload<'creators'> {}

export interface SearchSolanaNFTsByUpdateAuthoritiesPayloadV2
  extends ComputeSearchSolanaNFTRequestPayload<'update_authorities'> {}

export interface SearchSolanaNFTsByOwnersPayloadV2
  extends ComputeSearchSolanaNFTRequestPayload<'owners'> {}

export interface SearchSolanaNFTsResponseV2 {
  nfts: SolanaNFT[];
}

// TODO normalize this type to match the other types
export interface SolanaNFTDevnet {
  mint_address: string;
  url: string;
  update_authority: string;
  creator_address: string;
  name: string;
  symbol: string;
  collection: string;
  seller_fee_basis_points: number;
  signature: string;
  status: string;
}

export interface SolanaNFT {
  name: string;
  sellerFeeBasisPoints: number;
  mintAddress: string;
  updateAuthorityAddress: string;
  description: string;
  image: string;
  animationUrl: any;
  externalUrl: string;
  parser: string;
  creators: SolanaNFTCreator[];
  owner: SolanaNFTOwner;
  collection: SolanaNFTCollection;
  attributes: SolanaNFTAttribute[];
  listings: SolanaNFTListingV2[];
}

export interface SolanaNFTCreator {
  address: string;
  verified: boolean;
  share: number;
}

export interface SolanaNFTOwner {
  address: string;
  associatedTokenAccountAddress: string;
}

export interface SolanaNFTCollection {
  mintAddress: string;
}

export interface SolanaNFTAttribute {
  trait_type: string;
  value: string;
}
