export interface INFTListing {
  id: number;
  type: string;
  wallet_address: string;
  mint_address: string;
  price: string;
  seller_address: string;
  signature: string;
  status: string;
  updatedAt: string;
  createdAt: string;
  to_wallet_address?: null;
}
