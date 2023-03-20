export enum QueryNFTsFilterType {
  enum = 'enum',
  range = 'range',
}

export interface NFTSearchOrder {
  order_by: 'price';
  desc: boolean;
}

export type NFTsQueryFilter<
  T extends QueryNFTsFilterType = QueryNFTsFilterType.enum
> = {
  filter_name: string;
  filter_type: T extends QueryNFTsFilterType.enum
    ? QueryNFTsFilterType.enum
    : QueryNFTsFilterType.range;
  filter_value: T extends QueryNFTsFilterType.enum
    ? string[]
    : T extends QueryNFTsFilterType.range
    ? number[]
    : unknown[];
};

export type SearchCollectionsInfoV2 = {
  collections: string[];
};

export interface CollectionsResultV2 {
  collection: string;
  collection_name: string;
  collection_type: string;
  collection_orders: CollectionOrder[];
}

export interface CollectionOrder {
  order_field: string;
  order_desc: string;
  desc: boolean;
}

export interface CollectionFilterMetadataV2 {
  collection: string;
  filter_info: (
    | NFTsQueryFilter<QueryNFTsFilterType.enum>
    | NFTsQueryFilter<QueryNFTsFilterType.range>
  )[];
}

export type QueryCollectionsSummaryV2 = {
  collections: string[];
};

export interface CollectionSummaryV2 {
  collection: string;
  collection_name: string;
  collection_owner: string;
  nft_amount: number;
  listed_amount: number;
  floor_price: string;
}

export type RegisterCollectionPayloadV2 = {
  collection: string;
  collection_name: string;
  collection_type: string;
  collection_orders?: CollectionOrder[];
  collection_filters?: (
    | NFTsQueryFilter<QueryNFTsFilterType.enum>
    | NFTsQueryFilter<QueryNFTsFilterType.range>
  )[];
};

export type RegisterCollectionResultV2 = 'ok';
