import joi from 'joi';
import { IBuyNFTPayloadV2, ITransferNFTPayloadV2 } from '../types/nft';
import {
  MirrorWorldSDKError,
  MirrorWorldSDKErrorKey,
  toErrorMessage,
} from '../errors/errors.interface';
import {
  ICreateMarketplacePayloadV2,
  IStorefrontConfigV2,
  IUpdateMarketplacePayloadV2,
} from '../types/marketplace';
import {
  ComputeSearchSolanaNFTRequestPayload,
  CreateVerifiedCollectionPayloadV2,
  MintSolanaNFTToCollectionPayloadV2,
  MintSolanaNFTWithPaymentOptionsV2,
  QueryAssetMintsStatusPayload,
  QueryAssetTransactionStatusPayload,
  VerifySolanaMintConfigPayloadV2,
} from '../types/asset.solana.v2';

// ==========================================================================================================
//   V2 SDK VALIDATORS
// ==========================================================================================================

export const BaseSolanaAuctionSchemaV2 = joi.object<IBuyNFTPayloadV2>({
  mint_address: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_NFT_AUCTION_PAYLOAD',
        toErrorMessage(
          'INVALID_NFT_AUCTION_PAYLOAD',
          '`mint_address` should be a valid mint address'
        )
      )
    ),
  price: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_NFT_AUCTION_PAYLOAD',
        toErrorMessage(
          'INVALID_NFT_AUCTION_PAYLOAD',
          '`price` should be a valid number'
        )
      )
    ),
  auction_house: joi
    .string()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_NFT_AUCTION_PAYLOAD',
        toErrorMessage(
          'INVALID_NFT_AUCTION_PAYLOAD',
          '`auction_house` should be a valid auction_house address'
        )
      )
    ),
  confirmation: joi
    .string()
    .allow('confirmed', 'finalized')
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_NFT_AUCTION_PAYLOAD',
        toErrorMessage(
          'INVALID_NFT_AUCTION_PAYLOAD',
          '`confirmation` should be a one of `confirmed` or `finalized`'
        )
      )
    ),

  skip_preflight: joi
    .boolean()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_NFT_AUCTION_PAYLOAD',
        toErrorMessage(
          'INVALID_NFT_AUCTION_PAYLOAD',
          '`skip_preflight` should be a boolean'
        )
      )
    ),
});

export const TransferSolanaNFTSchemaV2 = joi.object<ITransferNFTPayloadV2>({
  mint_address: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_TRANSFER_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_NFT_AUCTION_PAYLOAD',
          '`mint_address` should be a valid string'
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
          '`to_wallet_address` should be a valid string'
        )
      )
    ),
  confirmation: joi
    .string()
    .allow('confirmed', 'finalized')
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_TRANSFER_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_TRANSFER_NFT_PAYLOAD',
          '`confirmation` should be a one of `confirmed` or `finalized`'
        )
      )
    ),

  skip_preflight: joi
    .boolean()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_TRANSFER_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_TRANSFER_NFT_PAYLOAD',
          '`skip_preflight` should be a boolean'
        )
      )
    ),
});

export const StorefrontConfigValidatorV2 = (
  error: MirrorWorldSDKErrorKey
): joi.ObjectSchema<IStorefrontConfigV2> =>
  joi.object<IStorefrontConfigV2>({
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
  });

export const CreateMarketplaceSchemaV2 =
  joi.object<ICreateMarketplacePayloadV2>({
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
    storefront: StorefrontConfigValidatorV2(
      'INVALID_CREATE_MARKETPLACE_PAYLOAD'
    )
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
    skip_preflight: joi
      .boolean()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_MARKETPLACE_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_MARKETPLACE_PAYLOAD',
            '`skip_preflight` should be a boolean'
          )
        )
      ),
  });

export const UpdateMarketplaceSchemaV2 =
  joi.object<IUpdateMarketplacePayloadV2>({
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
    storefront: StorefrontConfigValidatorV2(
      'INVALID_UPDATE_MARKETPLACE_PAYLOAD'
    )
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
    skip_preflight: joi
      .boolean()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_MARKETPLACE_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_MARKETPLACE_PAYLOAD',
            '`skip_preflight` should be a boolean'
          )
        )
      ),
  });

export const QueryAssetTransactionStatusSchemaV2 =
  joi.object<QueryAssetTransactionStatusPayload>({
    signatures: joi
      .array()
      .items(joi.string())
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_QUERY_TRANSACTION_STATUS_PAYLOAD',
          toErrorMessage(
            'INVALID_QUERY_TRANSACTION_STATUS_PAYLOAD',
            '`signatures` should be a valid array of transaction signatures'
          )
        )
      ),
  });

export const QueryAssetMintsStatusSchemaV2 =
  joi.object<QueryAssetMintsStatusPayload>({
    mint_addresses: joi
      .array()
      .items(joi.string())
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_QUERY_MINTS_STATUS_PAYLOAD',
          toErrorMessage(
            'INVALID_QUERY_MINTS_STATUS_PAYLOAD',
            '`mint_addresses` should be a valid array of transaction signatures'
          )
        )
      ),
  });

export const CreateVerifiedCollectionSchemaV2: joi.ObjectSchema<CreateVerifiedCollectionPayloadV2> =
  joi.object<CreateVerifiedCollectionPayloadV2>({
    name: joi
      .string()
      .optional()
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
      .optional()
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
            '`url` should be a valid url'
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
    skip_preflight: joi
      .boolean()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
            '`skip_preflight` should be a boolean'
          )
        )
      ),
    mint_id: joi
      .string()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
            '`mint_id` should be a valid string'
          )
        )
      ),
    collection_mint: joi
      .string()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
            '`collection_mint` should be a valid string'
          )
        )
      ),
    seller_fee_basis_points: joi
      .string()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
            '`seller_fee_basis_points` should be a valid string'
          )
        )
      ),
    to_wallet_address: joi
      .string()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
          toErrorMessage(
            'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
            '`to_wallet_address` should be a valid string'
          )
        )
      ),
  });

export const MintSolanaNFTWithPaymentConfigurationV2 = (
  error: MirrorWorldSDKErrorKey
): joi.ObjectSchema<MintSolanaNFTWithPaymentOptionsV2> =>
  joi.object<MintSolanaNFTWithPaymentOptionsV2>({
    receiver_wallet: joi
      .string()
      .required()
      .error(
        MirrorWorldSDKError.new(
          error,
          toErrorMessage(
            error,
            ' The `payment.receiver_wallet` should be a valid string.'
          )
        )
      ),
    amount_sol: joi
      .number()
      .greater(0)
      .required()
      .error(
        MirrorWorldSDKError.new(
          error,
          toErrorMessage(
            error,
            ' The `payment.amount_sol` should be a valid number greater than zero.'
          )
        )
      ),
  });

export const MintSolanaNFTToCollectionSchemaV2: joi.ObjectSchema<MintSolanaNFTToCollectionPayloadV2> =
  joi.object<MintSolanaNFTToCollectionPayloadV2>({
    name: joi
      .string()
      .optional()
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
      .optional()
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
            '`url` should be a valid url'
          )
        )
      ),
    mint_id: joi
      .string()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_MINT_NFT_PAYLOAD',
          toErrorMessage(
            'INVALID_MINT_NFT_PAYLOAD',
            '`mint_id` should be a valid string'
          )
        )
      ),
    collection_mint: joi
      .string()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_MINT_NFT_PAYLOAD',
          toErrorMessage(
            'INVALID_MINT_NFT_PAYLOAD',
            '`collection_mint` should be a valid string'
          )
        )
      ),
    seller_fee_basis_points: joi
      .string()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_MINT_NFT_PAYLOAD',
          toErrorMessage(
            'INVALID_MINT_NFT_PAYLOAD',
            '`seller_fee_basis_points` should be a valid string'
          )
        )
      ),
    to_wallet_address: joi
      .string()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_MINT_NFT_PAYLOAD',
          toErrorMessage(
            'INVALID_MINT_NFT_PAYLOAD',
            '`to_wallet_address` should be a valid string'
          )
        )
      ),
    payment: MintSolanaNFTWithPaymentConfigurationV2,
    confirmation: joi
      .string()
      .valid('confirmed', 'finalized')
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_MINT_NFT_PAYLOAD',
          toErrorMessage(
            'INVALID_MINT_NFT_PAYLOAD',
            '`commitment` should be one of "confirmed" or "finalized"'
          )
        )
      ),
    skip_preflight: joi
      .boolean()
      .optional()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_MINT_NFT_PAYLOAD',
          toErrorMessage(
            'INVALID_MINT_NFT_PAYLOAD',
            '`skip_preflight` should be a boolean'
          )
        )
      ),
  });

export const VerifySolanaMintConfigSchemaV2: joi.ObjectSchema<VerifySolanaMintConfigPayloadV2> =
  joi.object<VerifySolanaMintConfigPayloadV2>({
    url: joi
      .string()
      .uri()
      .required()
      .error(
        MirrorWorldSDKError.new(
          'INVALID_MINT_NFT_PAYLOAD',
          toErrorMessage(
            'INVALID_MINT_NFT_PAYLOAD',
            '`url` should be a valid url'
          )
        )
      ),
  });

export const SearchSolanaNFTsByMintAddressesSchemaV2 = joi.object<
  ComputeSearchSolanaNFTRequestPayload<'mint_addresses'>
>({
  mint_addresses: joi
    .array()
    .items(joi.string())
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`mint_addresses` should be a valid array of strings'
        )
      )
    ),
  limit: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`limit` should be a integer'
        )
      )
    ),
  offset: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`offset` should be a integer'
        )
      )
    ),
});

export const SearchSolanaNFTsByOwnerAddressesSchemaV2 = joi.object<
  ComputeSearchSolanaNFTRequestPayload<'owners'>
>({
  owners: joi
    .array()
    .items(joi.string())
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`owners` should be a valid array of strings'
        )
      )
    ),
  limit: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`limit` should be a integer'
        )
      )
    ),
  offset: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`offset` should be a integer'
        )
      )
    ),
});

export const SearchSolanaNFTsByCreatorAddressesSchemaV2 = joi.object<
  ComputeSearchSolanaNFTRequestPayload<'creators'>
>({
  creators: joi
    .array()
    .items(joi.string())
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`creators` should be a valid array of strings'
        )
      )
    ),
  limit: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`limit` should be a integer'
        )
      )
    ),
  offset: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`offset` should be a integer'
        )
      )
    ),
});

export const SearchSolanaNFTsByUpdateAuthorityAddressesSchemaV2 = joi.object<
  ComputeSearchSolanaNFTRequestPayload<'update_authorities'>
>({
  update_authorities: joi
    .array()
    .items(joi.string())
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`creators` should be a valid array of strings'
        )
      )
    ),
  limit: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`limit` should be a integer'
        )
      )
    ),
  offset: joi
    .number()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
        toErrorMessage(
          'INVALID_SEARCH_SOLANA_NFT_PAYLOAD',
          '`offset` should be a integer'
        )
      )
    ),
});
