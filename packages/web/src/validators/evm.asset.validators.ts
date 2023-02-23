import joi from 'joi';
import {
  MirrorWorldSDKError,
  toErrorMessage,
} from '../errors/errors.interface';
import { QueryEVMNFTRequestPayload } from '../types/nft.v2';

export const fetchEVMNFTsByOwnerAddressSchema =
  joi.object<QueryEVMNFTRequestPayload>({
    owner_address: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_FETCH_NFT_BY_OWNERS_PAYLOAD',
          toErrorMessage(
            'INVALID_FETCH_NFT_BY_OWNERS_PAYLOAD',
            '`owner` should be a valid string public address'
          )
        )
      ),
    limit: joi
      .number()
      .optional()
      .min(0)
      .max(25)
      .error(
        MirrorWorldSDKError.new(
          'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
          toErrorMessage(
            'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
            '`limit` should be a integer between 0 and 25'
          )
        )
      ),
    cursor: joi
      .string()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
          toErrorMessage(
            'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
            '`cursor` should be a valid string returned from the API'
          )
        )
      ),
  });
