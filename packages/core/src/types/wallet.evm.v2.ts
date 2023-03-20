import { EVMTransactionControlOptions } from './nft';

export interface GetEVMUserTokensV2Data {
  eth: string;
  tokens: EVMToken[];
}

export interface EVMToken {
  token_address: string;
  name: string;
  symbol: string;
  logo: string;
  thumbnail: string;
  decimals: number;
  balance: string;
}

export interface EVMUserTransactionsV2Data {
  transactions: EVMTransaction[];
  count: number;
}

export interface EVMTransaction {
  from: string;
  to: string;
  nonce: string;
  data: string;
}

export interface EVMTransferTokensPayloadV2 {
  nonce: string | number;
  gasPrice: string | number;
  gasLimit: string | number;
  to: string;
  amount: string | number;
}

export interface EVMTransferTokensResponseV2 {
  tx_signature: string;
}

export interface EVMTransferERCTokenPayloadV2 {
  nonce: string | number;
  gasPrice: string | number;
  gasLimit: string | number;
  /**
   * Recipient address
   */
  to: string;
  /**
   * Amount of the ERC20 token to transfer
   */
  amount: string | number;
  /**
   * Contract address of the token / Token Address
   */
  contract: string;
}

/**
 * Payload for performing an off-chain personal signing
 */
export type EVMPersonalSignPayloadV2 = {
  data: string;
};
export type EVMPersonalSignResultV2 = {
  tx_signature: string;
};

export type EVMSignTypedDataPayloadV2 = any;
export type EVMSignTypedDataV2Result = {
  tx_signature: string;
};

export type EVMSignTypedDataWithVersionPayloadV2 = any;
export type EVMSignTypedDataWithVersionV2Result = {
  tx_signature: string;
};

export type EVMSignAndSendTransactionPayloadV2 = {
  nonce: number;
  gasPrice: string | number;
  gasLimit: string | number;
  to: string;
  value: string | number;
  data: string;
};

export type EVMSignAndSendTransactionV2Result = {
  tx_hash: string;
};
