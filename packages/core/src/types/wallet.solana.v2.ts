export interface GetSolanaTokensV2Data {
  sol: number;
  tokens: SolanaTokenV2[];
}

export interface SolanaTokenV2 {
  ata: string;
  mint: string;
  amount: number;
  decimals: number;
  metadata?: SolanaTokenMetadataV2;
}

export interface SolanaTokenMetadataV2 {
  name: string;
  symbol: string;
  decimals: number;
  chain: string;
  network: string;
  address: string;
  logoURI?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetSolanaTransactionV2Data {
  transactions: SolanaTransactionV2[];
  count: number;
  next_before: string;
}

export interface SolanaTransactionV2 {
  blockTime: number;
  meta: any;
  slot: number;
  transaction: any[];
}

export interface SolanaTransactionV2 {
  blockTime: number;
  meta: any;
  slot: number;
  transaction: any[];
}

export type SolanaBaseSignatureResultV2 = {
  tx_signature: string;
};

export type SolanaTransferSOLPayloadV2 = {
  to_publickey: string;
  amount: number;
};

export type SolanaTransferSPLTokenPayloadV2 = {
  to_publickey: string;
  amount: number;
  token_mint: string;
  decimals: number;
};
