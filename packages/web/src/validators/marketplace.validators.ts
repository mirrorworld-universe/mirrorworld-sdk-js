import joi from 'joi';
import {
  IBuyNFTPayload,
  ICancelNFTPayload,
  IListNFTPayload,
  IUpdateListingPayload,
} from '../types/nft';
import {
  MirrorWorldSDKError,
  toErrorMessage,
} from '../errors/errors.interface';

export const listNFTSchema = joi.object<IListNFTPayload>({
  mint_address: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_LIST_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_LIST_NFT_PAYLOAD',
          '`mintAddress` should be a valid mint address'
        )
      )
    ),
  price: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_LIST_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_LIST_NFT_PAYLOAD',
          '`price` should be a valid number'
        )
      )
    ),
});

export const buyNFTSchema = joi.object<IBuyNFTPayload>({
  mint_address: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_PURCHASE_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_PURCHASE_NFT_PAYLOAD',
          '`mintAddress` should be a valid mint address'
        )
      )
    ),
  price: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_PURCHASE_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_PURCHASE_NFT_PAYLOAD',
          '`price` should be a valid number'
        )
      )
    ),
});

export const updateNFTListingSchema = joi.object<IUpdateListingPayload>({
  mint_address: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_LISTING_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_LISTING_NFT_PAYLOAD',
          '`mintAddress` should be a valid mint address'
        )
      )
    ),
  price: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_LISTING_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_LISTING_NFT_PAYLOAD',
          '`price` should be a valid number'
        )
      )
    ),
});

export const cancelNFTListingSchema = joi.object<ICancelNFTPayload>({
  mint_address: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_CANCEL_LISTING_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_CANCEL_LISTING_NFT_PAYLOAD',
          '`mintAddress` should be a valid mint address'
        )
      )
    ),
  price: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_CANCEL_LISTING_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_CANCEL_LISTING_NFT_PAYLOAD',
          '`price` should be a valid number'
        )
      )
    ),
});
