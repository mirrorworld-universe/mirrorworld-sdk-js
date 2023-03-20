export enum QueryEVMFilterType {
  enum = 'enum',
  range = 'range',
}
export interface QueryEVMNFTsPayloadV2 {
  contract: string;
  page: number;
  page_size: number;
  order: NFTSearchOrder;
  sale: boolean;
  filter: NFTsQueryFilter[];
}

export interface NFTSearchOrder {
  order_by: 'price';
  desc: boolean;
}

export type NFTsQueryFilter<
  T extends QueryEVMFilterType = QueryEVMFilterType.enum
> = {
  filter_name: string;
  filter_type: T extends QueryEVMFilterType.enum
    ? QueryEVMFilterType.enum
    : QueryEVMFilterType.range;
  filter_value: T extends QueryEVMFilterType.enum
    ? string[]
    : T extends QueryEVMFilterType.range
    ? number[]
    : unknown[];
};

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
