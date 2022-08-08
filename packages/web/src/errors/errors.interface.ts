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

  // @ts-expect-error Here we invoke the initializer at
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
) {
  throw MirrorWorldSDKError.new(error, customMessage);
}

export function toErrorMessage(
  error: MirrorWorldSDKErrorKey,
  customMessage?: ErrorBody['message']
) {
  const e = MirrorWorldSDKError.new(error, customMessage);
  return `E:${e.code}: ${e.error}: ${e.message}`;
}

export { ErrorCodes };
