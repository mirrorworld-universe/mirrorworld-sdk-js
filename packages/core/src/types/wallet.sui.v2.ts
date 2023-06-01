
  interface SUIToken {
    coinType: string;
    coinObjectCount: number;
    totalBalance: string;
    lockedBalance: { [key: string]: any };
  }

  export type SUITransactionData = {
    digest: string;
    transaction: any;
    effects: { [key: string]: any };
    events: any[];
    objectChanges: any[];
    balanceChanges: any[];
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