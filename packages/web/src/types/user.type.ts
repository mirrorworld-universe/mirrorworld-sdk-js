export interface IUser {
  id: number;
  eth_address: string;
  sol_address: string;
  email: string;
  email_verified: boolean;
  username: string;
  createdAt: string;
  updatedAt: string;
  wallet: Wallet;
}

export interface Wallet {
  eth_address: string;
  sol_address: string;
}

export interface UserWithWallet extends IUser {
  wallet: Wallet;
}
