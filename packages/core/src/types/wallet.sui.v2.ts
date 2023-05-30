interface SUITransactionEffectData {
    // 略
  }
  
  interface SUITransactionEventData {
    // 略
  }
  
  interface SUIObjectChangeData {
    // 略
  }
  
  interface SUIBalanceChangeData {
    // 略
  }

  interface SUIToken {
    coinType: string;
    coinObjectCount: number;
    totalBalance: string;
    lockedBalance: { [key: string]: any };
  }

  export type SUITransactionData = {
    digest: string;
    transaction: any;
    effects: { [key: string]: SUITransactionEffectData };
    events: SUITransactionEventData[];
    objectChanges: SUIObjectChangeData[];
    balanceChanges: SUIBalanceChangeData[];
    timestampMs: string;
    checkpoint: string;
  }
  
export type SUITransferSUIPayloadV2 = {
    to_publickey: string;
    amount: number;
  };

export type SUITransferTokenPayload = {
    to_publickey: string;
    amount: number;
    token:string;
  };
export type SUITransferSUIData = {
    digest: string
  };

export type SUIGetTokensData = {
  sui: string;
  tokens: SUIToken[];
};