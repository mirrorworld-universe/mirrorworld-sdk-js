import {
  ICreateVerifiedCollectionPayload,
  ICreateVerifiedSubCollectionPayload,
  IMintNFTPayload,
  ITransferNFTPayload,
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
          '`parentCollection` should be a valid mint address'
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
