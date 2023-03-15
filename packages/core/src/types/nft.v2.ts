export interface QueryEVMNFTRequestPayload {
  owner_address: string;
  limit: number;
  cursor?: string;
}

export interface QueryEVMNFTResultRaw {
  total: any;
  page: number;
  page_size: number;
  cursor: string;
  result: EVMNFTRaw[];
  status: string;
}

export interface QueryEVMNFTResultBody
  extends Omit<QueryEVMNFTResultRaw, 'result'> {
  result: EVMNFTExtended[];
}

export interface EVMNFTRaw {
  token_address: string;
  token_id: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_hash: string;
  amount: string;
  contract_type: string;
  name?: string;
  symbol?: string;
  token_uri: string;
  metadata: string;
  last_token_uri_sync: string;
  last_metadata_sync: string;
  minter_address?: string;
}

export interface EVMNFTExtended extends Omit<EVMNFTRaw, 'metadata'> {
  metadata: NftJsonMetadata;
}

export type NftJsonMetadata = {
  description: string;
  image: string;
  name: string;
  rawData: Record<string, unknown> | null;
};

export interface QueryEVMNFTActivityPayload {
  contract: string;
  token_id: number;
  page: number;
  page_size: number;
}

export interface QueryEVMNFTActivityResult {
  total_page: number;
  page_size: number;
  events: EVMNFTActivity[];
}

export interface EVMNFTActivity {
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

export interface QuerySolanaNFTActivityPayload {
  mint_address: string;
  page: number;
  page_size: number;
}

export interface QuerySolanaNFTActivityResult {
  total_page: number;
  page_size: number;
  events: SolanaNFTActivity[];
}

export interface SolanaNFTActivity {
  mint_address: string;
  event_type: string;
  price: string;
  from_address: string;
  to_address: string;
  event_date: string;
  date_tag: string;
  signature: string;
}

export interface QuerySolanaNFTInfoPayload {
  mint_address: string;
}

export interface SolanaNFTInfo {
  collection: string;
  name: string;
  mint_address: string;
  owner_address: string;
  image: string;
  price: string;
  listed: boolean;
  attributes: Attribute[];
  off_chain_attributes: OffChainAttribute[];
  skill_attributes: SkillAttribute[];
  mint_authority: string;
  update_authority: string;
}

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface OffChainAttribute {
  trait_type: string;
  value: string;
}

export interface SkillAttribute {
  trait_type: string;
  value: string;
  image: string;
}

export interface QueryEVMNFTInfoPayload {
  contract: string;
  token_id: number;
}

export interface QueryEVMNFTInfoPayloadV2 {
  contract_address: string;
  token_id: number;
}

export interface EVMNFTInfo {
  contract: string;
  token_id: number;
  name: string;
  owner_address: string;
  image: string;
  price: string;
  listed: boolean;
  attributes: Attribute[];
  off_chain_attribute: OffChainAttribute[];
  skill_attributes: SkillAttribute[];
}
