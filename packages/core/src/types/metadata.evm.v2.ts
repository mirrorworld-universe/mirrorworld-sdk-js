import {
  NFTSearchOrder,
  NFTsQueryFilter,
  QueryNFTsFilterType,
} from './metadata.common.v2';

export interface QueryEVMNFTsPayloadV2 {
  contract: string;
  page: number;
  page_size: number;
  order: NFTSearchOrder;
  sale: boolean;
  marketplace_address?: string;
  filter?: (
    | NFTsQueryFilter<QueryNFTsFilterType.enum>
    | NFTsQueryFilter<QueryNFTsFilterType.range>
  )[];
}

export interface QueryEVMNFTsInfoResultV2 {
  total_page: number;
  page_size: number;
  nfts: QueryEVMNFT[];
}

export interface QueryEVMNFT {
  contract: string;
  token_id: number;
  name: string;
  owner_address: string;
  image: string;
  price: string;
  listed: boolean;
}

export type SearchEVMNFTInCollectionPayloadV2 = {
  collections: string[];
  search: string;
};

export type SearchEVMRecommendedNFTInCollectionPayloadV2 = {
  collections: string[];
};

export type SearchEVMMarketplaceEventsPayloadV2 = {
  marketplace_address: string;
  page: number;
  page_size: number;
};

export interface EVMMarketplaceEventsResultV2 {
  total_page: number;
  page_size: number;
  events: EVMMarketplaceEvent[];
}

export interface EVMMarketplaceEvent {
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
