export interface IUser {
  id: number;
  eth_address?: null;
  sol_address: string;
  email: string;
  email_verified: boolean;
  username: string;
  main_user_id?: null;
  allow_spend: boolean;
  is_subaccount: boolean;
  createdAt: string;
  updatedAt: string;
}
