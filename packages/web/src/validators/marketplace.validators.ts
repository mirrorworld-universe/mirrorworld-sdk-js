import joi from 'joi';
import {
  IBuyNFTPayload,
  ICancelNFTPayload,
  IListNFTPayload,
  IUpdateListingPayload,
} from '../types/nft';
import {
  MirrorWorldSDKError,
  MirrorWorldSDKErrorKey,
  toErrorMessage,
} from '../errors/errors.interface';
import {
  ICreateMarketplacePayload,
  IStorefrontConfig,
  IUpdateMarketplacePayload,
} from '../types/marketplace';

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

export const strorefrontConfigValidator = (error: MirrorWorldSDKErrorKey) =>
  joi.object<IStorefrontConfig>({
    name: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          error,
          toErrorMessage(
            error,
            ' The `storefront.name` should be a valid string.'
          )
        )
      ),
    subdomain: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          error,
          toErrorMessage(
            error,
            ' The `storefront.subdomain` should be a valid string.'
          )
        )
      ),
    description: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          error,
          toErrorMessage(
            error,
            ' The `storefront.description` should be a valid string.'
          )
        )
      ),
    logo: joi
      .string()
      .uri()
      .required()
      .error(
        MirrorWorldSDKError.new(
          error,
          toErrorMessage(error, ' The `storefront.logo` should be a valid URL.')
        )
      ),
    banner: joi
      .string()
      .uri()
      .required()
      .error(
        MirrorWorldSDKError.new(
          error,
          toErrorMessage(
            error,
            ' The `storefront.banner` should be a valid URL.'
          )
        )
      ),
  });

export const createMarketplaceSchema = joi.object<ICreateMarketplacePayload>({
  treasury_mint: joi
    .string()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_CREATE_MARKETPLACE_PAYLOAD',
        toErrorMessage(
          'INVALID_CREATE_MARKETPLACE_PAYLOAD',
          '`treasury_mint` should be a valid SPL mint address'
        )
      )
    ),
  seller_fee_basis_points: joi
    .number()
    .min(0)
    .max(10000)
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_CREATE_MARKETPLACE_PAYLOAD',
        toErrorMessage(
          'INVALID_CREATE_MARKETPLACE_PAYLOAD',
          '`seller_fee_basis_points` should be a valid number between 0 and 10000'
        )
      )
    ),
  collections: joi
    .array()
    .optional()
    .items(joi.string())
    .error(
      MirrorWorldSDKError.new(
        'INVALID_CREATE_MARKETPLACE_PAYLOAD',
        toErrorMessage(
          'INVALID_CREATE_MARKETPLACE_PAYLOAD',
          '`collections` should be a valid array of SPL mint addresses'
        )
      )
    ),
  storefront: strorefrontConfigValidator('INVALID_CREATE_MARKETPLACE_PAYLOAD')
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_CREATE_MARKETPLACE_PAYLOAD',
        toErrorMessage(
          'INVALID_CREATE_MARKETPLACE_PAYLOAD',
          '`storefront` should be a valid Storefront configuration object.'
        )
      )
    ),
});

export const updateMarketplaceSchema = joi.object<IUpdateMarketplacePayload>({
  treasury_mint: joi
    .string()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
          '`treasury_mint` should be a valid SPL mint address'
        )
      )
    ),
  seller_fee_basis_points: joi
    .number()
    .min(0)
    .max(10000)
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
          '`seller_fee_basis_points` should be a valid number between 0 and 10000'
        )
      )
    ),
  collections: joi
    .array()
    .optional()
    .items(joi.string())
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
          '`collections` should be a valid array of SPL mint addresses'
        )
      )
    ),
  storefront: strorefrontConfigValidator('INVALID_UPDATE_MARKETPLACE_PAYLOAD')
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
          '`storefront` should be a valid Storefront configuration object.'
        )
      )
    ),
  new_authority: joi
    .string()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
        toErrorMessage(
          'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
          '`new_authority` should be a valid Solana address'
        )
      )
    ),
});
