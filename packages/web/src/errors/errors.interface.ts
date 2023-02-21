const __ErrorCodes__ = {
  INVALID_OPTIONS: {
    error: 'INVALID_OPTIONS',
    code: '000100',
    message: `Mirror World SDK initialized with invalid options`,
  },
  MIRROR_WORLD_NOT_INITIALIZED: {
    error: 'MIRROR_WORLD_NOT_INITIALIZED',
    code: '000101',
    message: `Mirror World SDK not initialized properly`,
  },
  INVALID_REFRESH_TOKEN: {
    error: 'INVALID_REFRESH_TOKEN',
    code: '000102',
    message: `No refresh token found. Please login to continue`,
  },
  INVALID_TRANSFER_SPL_TOKEN_PAYLOAD: {
    error: 'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
    code: '000103',
    message: `Validation failed for transfer token payload`,
  },
  INVALID_TRANSFER_SOL_PAYLOAD: {
    error: 'INVALID_TRANSFER_SOL_PAYLOAD',
    code: '000104',
    message: `Validation failed for transfer SOL payload`,
  },
  INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD: {
    error: 'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
    code: '000105',
    message: `Validation failed for create verified collection`,
  },
  INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD: {
    error: 'INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD',
    code: '000106',
    message: `Validation failed for create verified sub-collection`,
  },
  INVALID_MINT_NFT_PAYLOAD: {
    error: 'INVALID_MINT_NFT_PAYLOAD',
    code: '000107',
    message: `Validation failed for mint collection NFT`,
  },
  INVALID_LIST_NFT_PAYLOAD: {
    error: 'INVALID_LIST_NFT_PAYLOAD',
    code: '000108',
    message: `Validation failed for create nft listing`,
  },
  INVALID_PURCHASE_NFT_PAYLOAD: {
    error: 'INVALID_PURCHASE_NFT_PAYLOAD',
    code: '000109',
    message: `Validation failed for purchase nft`,
  },
  INVALID_CANCEL_LISTING_NFT_PAYLOAD: {
    error: 'INVALID_CANCEL_LISTING_NFT_PAYLOAD',
    code: '000110',
    message: `Validation failed for cancel nft listing`,
  },
  INVALID_UPDATE_LISTING_NFT_PAYLOAD: {
    error: 'INVALID_UPDATE_LISTING_NFT_PAYLOAD',
    code: '000111',
    message: `Validation failed for update nft listing`,
  },
  INVALID_TRANSFER_NFT_PAYLOAD: {
    error: 'INVALID_TRANSFER_NFT_PAYLOAD',
    code: '000112',
    message: `Validation failed for transfer NFT`,
  },
  INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD: {
    error: 'INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD',
    code: '000113',
    message: `Validation failed for fetch NFTs by mint addresses`,
  },
  INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD: {
    error: 'INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD',
    code: '000114',
    message: `Validation failed for fetch NFTs by creator addresses`,
  },
  INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD: {
    error: 'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
    code: '000115',
    message: `Validation failed for fetch NFTs by update authorities addresses`,
  },
  INVALID_FETCH_NFT_BY_OWNERS_PAYLOAD: {
    error: 'INVALID_FETCH_NFT_BY_OWNERS_PAYLOAD',
    code: '000116',
    message: `Validation failed for fetch NFTs by update authorities addresses`,
  },
  ERROR_USER_NOT_AUTHENTICATED: {
    error: 'ERROR_USER_NOT_AUTHENTICATED',
    code: '000117',
    message: `User is not authenticated. Please login`,
  },
  INVALID_API_KEY: {
    error: 'INVALID_API_KEY',
    code: '000118',
    message: `You are currently using an deprecated API Key. Please create a new API Key for your project on the Mirror World Dashboard (https://app.mirrorworld.fun)`,
  },
  INVALID_API_ENVIRONMENT: {
    error: 'INVALID_API_ENVIRONMENT',
    code: '000119',
    message: `The API Key you provided cannot be used in the staging environment. Only \`ClusterEnvironment.testnet\` is available on staging.`,
  },
  INVALID_CREATE_ACTION_PAYLOAD: {
    error: 'INVALID_CREATE_ACTION_PAYLOAD',
    code: '000120',
    message: `Validation failed for requesting approval for action`,
  },
  INVALID_UPDATE_NFT_PAYLOAD: {
    error: 'INVALID_UPDATE_NFT_PAYLOAD',
    code: '000121',
    message: `Validation failed for update NFT mint`,
  },
  INVALID_CREATE_MARKETPLACE_PAYLOAD: {
    error: 'INVALID_CREATE_MARKETPLACE_PAYLOAD',
    code: '000122',
    message: `Validation failed for create marketplace`,
  },
  INVALID_UPDATE_MARKETPLACE_PAYLOAD: {
    error: 'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
    code: '000123',
    message: `Validation failed for update marketplace`,
  },
  INVALID_CHAIN_CONFIGURAITON_OPTIONS: {
    error: 'INVALID_CHAIN_CONFIGURAITON_OPTIONS',
    code: '000124',
    message: `You passed an invalid chain configuration option. Please check the documentation for which chain configuration options are available. https://mirrorworld.fun/docs/overview/introduction/multi-chain-solutions`,
  },
};

export type MirrorWorldSDKErrorCodes = typeof __ErrorCodes__;
export type MirrorWorldSDKErrorKey = keyof MirrorWorldSDKErrorCodes;
export type ErrorBody<
  T extends MirrorWorldSDKErrorKey = MirrorWorldSDKErrorKey
> = {
  error: T;
  code: string;
  message: string | ((body?: unknown) => string);
};

export type MirrorWorldSDKErrors = Record<MirrorWorldSDKErrorKey, ErrorBody>;

const ErrorCodes = __ErrorCodes__ as MirrorWorldSDKErrors;

export class MirrorWorldSDKError extends Error {
  public message: string;
  public description: string;
  public code: string;
  public data = null;
  public error: string;

  static new(
    errorCode: MirrorWorldSDKErrorKey,
    message?: ErrorBody['message']
  ) {
    const error = ErrorCodes[errorCode];
    const payload = new MirrorWorldSDKError(error);
    if (message) return MirrorWorldSDKError.withMessage(payload, message);
    else return payload;
  }

  private static withMessage(
    error: MirrorWorldSDKError,
    _message: ErrorBody['message']
  ) {
    let message: string;
    if (typeof _message === 'function') {
      message = _message();
    } else {
      message = _message;
    }
    error.message = message;
    return error;
  }

  // Here we invoke the initializer at
  // `super` after determining the error message
  constructor(error: ErrorBody) {
    let message: string;
    if (typeof error.message === 'function') {
      message = error.message();
    } else {
      message = error.message;
    }
    super(message);
    this.message = message;
    this.description = message;
    this.code = error.code;
    this.error = error.error;
    this.data = null;
  }
}

/* Throws parsed error based on MirrorWorld API Error Standard */
export function throwError(
  error: MirrorWorldSDKErrorKey,
  customMessage?: ErrorBody['message']
): MirrorWorldSDKError {
  throw MirrorWorldSDKError.new(error, customMessage);
}

export function toErrorMessage(
  error: MirrorWorldSDKErrorKey,
  customMessage?: ErrorBody['message']
): string {
  const e = MirrorWorldSDKError.new(error, customMessage);
  return `E:${e.code}: ${e.error}: ${e.message}`;
}

export { ErrorCodes };
