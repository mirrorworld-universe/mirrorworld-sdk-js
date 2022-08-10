export interface ISolanaToken {
  ata: string;
  mint: string;
  amount: string;
}

export interface TransferSPLTokenPayload {
  /**
   * Recipient public key
   */
  to_publickey: string;
  /**
   * Amount to transfer
   */
  amount: number;
  /**
   * Mint Address of the token to transfer
   */
  token_mint: string;
  /**
   * Decimals of the token to transfer
   */
  decimals: number;
}

export interface TransferSOLPayload {
  /**
   * Recipient public key
   */
  to_publickey: string;
  /**
   * Amount to transfer
   */
  amount: number;
}
