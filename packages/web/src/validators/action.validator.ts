import joi from 'joi';
import {
  MirrorWorldSDKError,
  toErrorMessage,
} from '../errors/errors.interface';
import { ICreateActionPayload, validActions } from '../types/actions';

export const createActionSchema = joi.object<ICreateActionPayload>({
  type: joi
    .string()
    .required()
    .valid(...validActions)
    .error(
      MirrorWorldSDKError.new(
        'INVALID_CREATE_ACTION_PAYLOAD',
        toErrorMessage(
          'INVALID_CREATE_ACTION_PAYLOAD',
          '`type` should be a one of: ' +
            [
              'mint_nft',
              'transfer_sol',
              'transfer_spl_token',
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
            ].join(', ')
        )
      )
    ),
  value: joi
    .number()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_CREATE_ACTION_PAYLOAD',
        toErrorMessage(
          'INVALID_CREATE_ACTION_PAYLOAD',
          '`value` should be a valid number'
        )
      )
    ),
  params: joi
    .object()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_CREATE_ACTION_PAYLOAD',
        toErrorMessage(
          'INVALID_CREATE_ACTION_PAYLOAD',
          '`params` should be a valid object'
        )
      )
    ),
});
