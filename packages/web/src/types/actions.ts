import DeviceDetector from 'device-detector-js';

export interface IAction {
  id: number;
  uuid: string;
  client_id: string;
  user_id: number;
  type: ActionType;
  message: string;
  value: number;
  params: Record<string, unknown>;
  signature: string;
  status: ActionStatus;
  origin: string;
  device: Device;
  started_at: Date;
  cancelled_at: Date;
  verified_at: Date;
  completed_at: Date;
}

export type ActionStatus = 'pending' | 'cancelled' | 'verified' | 'completed';

export interface ICreateActionPayload {
  type: ActionType;
  value?: number;
  params?: Record<any, any>;
}
export type ActionType =
  | 'mint_nft'
  | 'update_nft'
  | 'transfer_sol'
  | 'transfer_spl_token'
  | 'create_collection'
  | 'create_sub_collection'
  | 'list_nft'
  | 'buy_nft'
  | 'cancel_listing'
  | 'update_listing'
  | 'transfer_nft'
  | 'interaction'
  | 'create_marketplace'
  | 'update_marketplace';

export type Device = DeviceDetector.DeviceDetectorResult;

export const validActions = [
  'mint_nft',
  'update_nft',
  'transfer_spl_token',
  'transfer_sol',
  'create_collection',
  'create_sub_collection',
  'list_nft',
  'buy_nft',
  'cancel_listing',
  'update_listing',
  'transfer_nft',
  'interaction',
  'create_marketplace',
  'update_marketplace',
] as const;

export type Action = keyof typeof validActions;
