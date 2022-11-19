import {
  ComputeNFTQueryRequestPayload,
  ICreateVerifiedCollectionPayload,
  ICreateVerifiedSubCollectionPayload,
  IMintNFTPayload,
  ITransferNFTPayload,
  IUpdateNFTPayload,
} from '../types/nft';
import joi from 'joi';
import {
  MirrorWorldSDKError,
  toErrorMessage,
} from '../errors/errors.interface';

export const createVerifiedCollectionSchema =
  joi.object<ICreateVerifiedCollectionPayload>({
    name: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
            '`name` should be a valid string'
          )
        )
      ),
    symbol: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
            '`symbol` should be a valid string of less than 10 characters'
          )
        )
      ),
    confirmation: joi
      .string()
      .valid('confirmed', 'finalized')
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
            '`commitment` should be one of "confirmed" or "finalized"'
          )
        )
      ),
    url: joi
      .string()
      .uri()
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
            '`metadata uri` should be a valid url'
          )
        )
      ),
  });

export const createVerifiedSubCollectionSchema =
  joi.object<ICreateVerifiedSubCollectionPayload>({
    collection_mint: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD',
            '`parentCollection` should be a valid mint address'
          )
        )
      ),
    name: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD',
            '`name` should be a valid string'
          )
        )
      ),
    symbol: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD',
            '`symbol` should be a valid string of less than 10 characters'
          )
        )
      ),
    url: joi
      .string()
      .uri()
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD',
            '`metadataUri` should be a valid url'
          )
        )
      ),
    confirmation: joi
      .string()
      .valid('confirmed', 'finalized')
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
            '`commitment` should be one of "confirmed" or "finalized"'
          )
        )
      ),
  });

export const mintNFTSchema = joi.object<IMintNFTPayload>({
  collection_mint: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_MINT_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_MINT_NFT_PAYLOAD',
          '`collection` should be a valid collection address'
        )
      )
    ),
  name: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_MINT_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_MINT_NFT_PAYLOAD',
          '`name` should be a valid string'
        )
      )
    ),
  symbol: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_MINT_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_MINT_NFT_PAYLOAD',
          '`symbol` should be a valid string of less than 10 characters'
        )
      )
    ),
  url: joi
    .string()
    .uri()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_MINT_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_MINT_NFT_PAYLOAD',
          '`metadataUri` should be a valid url'
        )
      )
    ),
});

export const updateNFTSchema = joi.object<IUpdateNFTPayload>({
  mint_address: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_NFT_PAYLOAD',
          '`mint_address` should be a valid mint address'
        )
      )
    ),
  name: joi
    .string()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_NFT_PAYLOAD',
          '`name` should be a valid string'
        )
      )
    ),
  symbol: joi
    .string()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_NFT_PAYLOAD',
          '`symbol` should be a valid string of less than 10 characters'
        )
      )
    ),
  update_authority: joi
    .string()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_NFT_PAYLOAD',
          '`update_authority` should be a valid publick key string'
        )
      )
    ),
  seller_fee_basis_points: joi
    .number()
    .min(0)
    .max(10000)
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_NFT_PAYLOAD',
          '`seller_fee_basis_points` should be a valid number between 0 and 10000'
        )
      )
    ),
  url: joi
    .string()
    .uri()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_NFT_PAYLOAD',
          '`metadataUri` should be a valid url'
        )
      )
    ),
  confirmation: joi
    .string()
    .valid('confirmed', 'finalized')
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_NFT_PAYLOAD',
          '`commitment` should be one of "confirmed" or "finalized"'
        )
      )
    ),
});

export const transferNFTSchema = joi.object<ITransferNFTPayload>({
  mint_address: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_TRANSFER_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_TRANSFER_NFT_PAYLOAD',
          '`mintAddress` should be a valid mint address'
        )
      )
    ),
  to_wallet_address: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_TRANSFER_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_TRANSFER_NFT_PAYLOAD',
          '`recipientAddress` should be a valid wallet address'
        )
      )
    ),
});

export const fetchNFTsByMintAddressesSchema = joi.object<
  ComputeNFTQueryRequestPayload<'mint_addresses'>
>({
  mint_addresses: joi
    .array()
    .items(joi.string())
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD',
          '`mintAddresses` should be a valid array of mint addresses'
        )
      )
    ),
  limit: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD',
          '`limit` should be a integer'
        )
      )
    ),
  offset: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD',
          '`offset` should be a integer'
        )
      )
    ),
});

export const fetchNFTsByCreatorAddressesSchema = joi.object<
  ComputeNFTQueryRequestPayload<'creators'>
>({
  creators: joi
    .array()
    .items(joi.string())
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD',
          '`creators` should be a valid array of creator addresses'
        )
      )
    ),
  limit: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD',
          '`limit` should be a integer'
        )
      )
    ),
  offset: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD',
          '`offset` should be a integer'
        )
      )
    ),
});

export const fetchNFTsByUpdateAuthoritiesSchema = joi.object<
  ComputeNFTQueryRequestPayload<'update_authorities'>
>({
  update_authorities: joi
    .array()
    .items(joi.string())
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
          '`udpateAuthorities` should be a valid array of update authority addresses'
        )
      )
    ),
  limit: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
          '`limit` should be a integer'
        )
      )
    ),
  offset: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
          '`offset` should be a integer'
        )
      )
    ),
});

export const fetchNFTsByOwnerAddressesSchema = joi.object<
  ComputeNFTQueryRequestPayload<'owners'>
>({
  owners: joi
    .array()
    .items(joi.string())
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_OWNERS_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_OWNERS_PAYLOAD',
          '`owners` should be a valid array of owner addresses'
        )
      )
    ),
  limit: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
          '`limit` should be a integer'
        )
      )
    ),
  offset: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
        toErrorMessage(
          'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
          '`offset` should be a integer'
        )
      )
    ),
});
