import joi from 'joi';
import {
  MirrorWorldSDKError,
  toErrorMessage,
} from '../errors/errors.interface';
import {
  QueryEVMNFTActivityPayload,
  QueryEVMNFTInfoPayload,
  QuerySolanaNFTActivityPayload,
  QuerySolanaNFTInfoPayload,
} from '../types/nft.v2';

export const fetchEVMNFTsActivitySchema =
  joi.object<QueryEVMNFTActivityPayload>({
    contract: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_FETCH_EVM_NFT_ACTIVITY',
          toErrorMessage(
            'INVALID_FETCH_EVM_NFT_ACTIVITY',
            '`contract` should be a valid string public address'
          )
        )
      ),
    token_id: joi
      .number()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_FETCH_EVM_NFT_ACTIVITY',
          toErrorMessage(
            'INVALID_FETCH_EVM_NFT_ACTIVITY',
            '`token_id` should be a valid integer'
          )
        )
      ),
    page: joi
      .number()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_FETCH_EVM_NFT_ACTIVITY',
          toErrorMessage(
            'INVALID_FETCH_EVM_NFT_ACTIVITY',
            '`page_size` should be a valid integer'
          )
        )
      ),
    page_size: joi
      .number()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_FETCH_EVM_NFT_ACTIVITY',
          toErrorMessage(
            'INVALID_FETCH_EVM_NFT_ACTIVITY',
            '`page_size` should be a valid integer'
          )
        )
      ),
  });

export const fetchSolanaNFTsActivitySchema =
  joi.object<QuerySolanaNFTActivityPayload>({
    mint_address: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_FETCH_EVM_NFT_ACTIVITY',
          toErrorMessage(
            'INVALID_FETCH_EVM_NFT_ACTIVITY',
            '`contract` should be a valid string public address'
          )
        )
      ),
    page: joi
      .number()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_FETCH_EVM_NFT_ACTIVITY',
          toErrorMessage(
            'INVALID_FETCH_EVM_NFT_ACTIVITY',
            '`page_size` should be a valid integer'
          )
        )
      ),
    page_size: joi
      .number()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_FETCH_EVM_NFT_ACTIVITY',
          toErrorMessage(
            'INVALID_FETCH_EVM_NFT_ACTIVITY',
            '`page_size` should be a valid integer'
          )
        )
      ),
  });

export const fetchSolanaNFTInfoSchema = joi.object<QuerySolanaNFTInfoPayload>({
  mint_address: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_SOLANA_NFT_INFO',
        toErrorMessage(
          'INVALID_FETCH_SOLANA_NFT_INFO',
          '`mint_address` should be a valid string public address'
        )
      )
    ),
});

export const fetchEVMNFTInfoSchema = joi.object<QueryEVMNFTInfoPayload>({
  contract: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_EVM_NFT_INFO',
        toErrorMessage(
          'INVALID_FETCH_EVM_NFT_INFO',
          '`contract` should be a valid string public address'
        )
      )
    ),
  token_id: joi
    .number()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_EVM_NFT_INFO',
        toErrorMessage(
          'INVALID_FETCH_EVM_NFT_INFO',
          '`token_id` should be a valid integer'
        )
      )
    ),
});
