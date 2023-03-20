import { NFTSearchOrder, NFTsQueryFilter } from './metadata.common.v2';

export interface QuerySolanaNFTsPayloadV2 {
  contract: string;
  page: number;
  page_size: number;
  order: NFTSearchOrder;
  sale: boolean;
  auction_house?: string;
  filter?: NFTsQueryFilter[];
}

export type QuerySolanaNFT = {
  name: string;
  image: string;
  price: string;
  mint_address: string;
  owner_address: string;
  listed: boolean;
};

export interface QuerySolanaNFTsInfoResultV2 {
  total_page: number;
  page_size: number;
  nfts: QuerySolanaNFT[];
}

export type SearchSolanaNFTInCollectionPayloadV2 = {
  collections: string[];
  search: string;
};

export type SearchSolanaRecommendedNFTInCollectionPayloadV2 = {
  collections: string[];
};

export type SearchSolanaMarketplaceEventsPayloadV2 = {
  marketplace_address: string;
  page: number;
  page_size: number;
};

export interface SolanaMarketplaceEventsResultV2 {
  total_page: number;
  page_size: number;
  events: SolanaMarketplaceEvent[];
}

export interface SolanaMarketplaceEvent {
  contract: string;
  token_id: number;
  payment_token: string;
  marketplace_address: string;
  event_type: string;
  price: string;
  from_address: string;
  to_address: string;
  event_date: string;
  signature: string;
  date_tag: string;
}
