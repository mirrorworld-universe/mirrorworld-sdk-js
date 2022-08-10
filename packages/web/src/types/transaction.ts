export interface ISolanaTransactionsPayload {
  transactions: ISolanaTransaction[];
  count: number;
  nextBefore?: null;
}
export interface ISolanaTransaction {
  blockTime: number;
  confirmationStatus: string;
  err?: null;
  memo?: null;
  signature: string;
  slot: number;
}

export interface ITransferSPLTokenResponse {
  status: string;
  txSignature: string;
}
