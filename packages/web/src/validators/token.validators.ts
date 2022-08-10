import joi from 'joi';
import { TransferSPLTokenPayload } from '../types/token';
import {
  MirrorWorldSDKError,
  toErrorMessage,
} from '../errors/errors.interface';

export const transferSOLSchema = joi.object<TransferSPLTokenPayload>({
  to_publickey: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
        toErrorMessage(
          'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
          '`to_publickey` should be a valid public key'
        )
      )
    ),
  amount: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
        toErrorMessage(
          'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
          '`amount` should be a valid number'
        )
      )
    ),
});

export const transferSPLTokenSchema = joi.object<TransferSPLTokenPayload>({
  to_publickey: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
        toErrorMessage(
          'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
          '`to_publickey` should be a valid public key'
        )
      )
    ),
  decimals: joi
    .number()
    .required()
    .integer()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
        toErrorMessage(
          'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
          '`decimals` should be a valid integer'
        )
      )
    ),
  amount: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
        toErrorMessage(
          'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
          '`amount` should be a valid number'
        )
      )
    ),
  token_mint: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
        toErrorMessage(
          'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
          '`token_mint` should be a valid address'
        )
      )
    ),
});
