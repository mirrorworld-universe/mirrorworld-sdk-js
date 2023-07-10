
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

export type SUIMintCollectionPayload = {
  name:string,
  symbol:string,
  description:string,
  creators:string[]
}

export type SUIMintCollectionData = {
  user_id: number;
  name: string;
  description: string;
  creators: string[];
  digest: string;
  contract_config_address: string;
  contract_object_id: string;
  authority_address: string;
  collection_cap_id: string;
  collection_cap_owner: string;
  client_id: string;
  mint_cap_id: string;
  mint_cap_owner: string;
}

export type SUIMintNFTPayload = {
  collection_address:string,
  name:string,
  description:string,
  image_url:string,
  attributes:any[],
  to_wallet_address:string
}

export type SUIMintNFTData = {
  name: string;
  description: string;
  image_url: string;
  attributes: any[];
  digest: string;
  contract_config_address: string;
  to_wallet_address: string;
  fee_payer: string;
  nft_object_id: string;
  nft_object_owner: string;
  user_id: number;
  client_id: string;
}

export type SUIQueryNFTData = {
  id: string;
  url: string;
  name: string;
  description: string;
  attributes: SUIQueryNFTValue[];
  owner_address: string;
  package_module: string;
  package_module_class_name: string;
  collection_package_id: string;
}

export type SUIQueryNFTValue = {
    key:string;
    value:string;
}

export type SUISearchNFTsByOwnerPayload = {
  owner_address:string
}

export type SUISearchNFTsPayload = {
  nft_object_ids:string[]
}
