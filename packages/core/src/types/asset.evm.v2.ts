import { EVMTransactionControlOptions } from './nft';

export enum EVMContractType {
  erc721 = 'erc721',
  erc1155 = 'erc1155',
}

export interface EVMNFTListingV2 {
  from: string;
  to: string;
  contract_address: string;
  contract_type: EVMContractType;
  token_id: string;
  amount: number;
  transaction_hash: string;
}

export type EvmWalletRequest = any;

export interface EVMNFTListingTransactionV2 {
  type: string;
  tx?: any;
  order?: any;
  order_msg?: string;
  action_id?: number;
}

export interface CreateEVMCollectionV2Payload
  extends EVMTransactionControlOptions {
  /** The base url of nft json config files. Full url to individual NFT json configuration will be base_url + token_id  */
  url: string;
  /** The name of the collection */
  name: string;
  /** The symbol of the collection */
  symbol: string;
  /** The type of contract to be deployed. Default is erc1155. Allowed values are "erc1155" and "erc721"  */
  contract_type?: EVMContractType;
  /**
   * The starting token_id of the collection.
   * @default 0
   */
  mint_start_id?: number;
  /**
   * The ending token_id of the collection. Default is 0
   * @default 0
   */
  mint_end_id?: number;
  /**
   *  The amount of NFTs to be minted. Default is 1. For erc721 collections this value should be 1
   * @default 1
   */
  mint_amount?: number;
}

export interface BaseEVMCollectionV2 {
  id: number;
  seed: string;
  hash: string;
  signature: string;
  url: string;
  name: string;
  symbol: string;
  creator_address: string;
  contract_type: EVMContractType;
  track_mint: boolean;
  burn_mint: boolean;
  mint_enabled: boolean;
  mint_start_id: number;
  mint_end_id: number;
  mint_amount: number;
  status: string;
  client_id: string;
  mint_id: null | string;
  updatedAt: string;
  createdAt: string;
  contract_address: null | string;
  transaction_hash: null | string;
}

export type CreateEVMCollectionResultV2 = BaseEVMCollectionV2;

export interface EVMCollectionV2 extends BaseEVMCollectionV2 {
  contract_address: string;
  transaction_hash: string;
}

export interface MintEVMNFTToCollectionV2Payload
  extends EVMTransactionControlOptions {
  /** The 0x address of the collection  */
  collection_address: string;
  /** The token_id of the NFT to be minted */
  token_id: number;
  /**  The wallet address to which the NFT will be minted */
  to_wallet_address?: string;
  /**
   *  The amount of NFTs to be minted. Default is 1. For erc721 collections this value should be 1
   * @default 1
   */
  mint_amount?: number;
}

export interface MintEVMNFTToCollectionResultV2 {
  seed: string;
  hash: string;
  signature: string;
  creator_address: string;
  to_wallet_address: string;
  contract_address: string;
  contract_type: EVMContractType;
  token_id: string;
  mint_amount: number;
  status: 'started' | 'done';
  transaction_hash: string;
}

export interface VerifyEVMMintConfigPayloadV2 {
  url: string;
}

export interface VerifyEVMMintConfigErrorV2 {
  error?: string;
}

export interface VerifyEVMMintConfigResultV2 {
  url: string;
  valid: boolean;
  error: VerifyEVMMintConfigErrorV2;
}

export interface SearchEVMNFTsPaginationV2 {
  limit?: number;
  offset?: number;
}

export type SearchEVMNftsFilters = 'owner_address';
export type ComputeSearchEVMNFTRequestPayload<T extends SearchEVMNftsFilters> =
  SearchEVMNFTsPaginationV2 &
    {
      [K in T]: string[];
    };

export type SearchEVMNFTsByOwnerAddressesPayloadV2 = {
  limit?: number;
  offset?: number;
  owner_address: string;
};

export interface SearchEVMNFTsPayloadV2 {
  tokens: {
    contract_address: string;
    token_id: string;
  }[];
}
