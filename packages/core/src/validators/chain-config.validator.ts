import joi from 'joi';
import {
  MirrorWorldSDKError,
  toErrorMessage,
} from '../errors/errors.interface';

export const chainConfigurationSchema = joi.object({
  chain: joi.allow('ethereum', 'solana').required(),
  network: joi
    .required()
    .when('chain', {
      is: 'ethereum',
      then: joi
        .valid('mainnet', 'goerli')
        .error(
          MirrorWorldSDKError.new(
            'INVALID_CHAIN_CONFIGURAITON_OPTIONS',
            toErrorMessage('INVALID_CHAIN_CONFIGURAITON_OPTIONS')
          )
        ),
    })
    .when('chain', {
      is: 'solana',
      then: joi
        .valid('mainnet-beta', 'devnet')
        .error(
          MirrorWorldSDKError.new(
            'INVALID_CHAIN_CONFIGURAITON_OPTIONS',
            toErrorMessage('INVALID_CHAIN_CONFIGURAITON_OPTIONS')
          )
        ),
    })
    .when('chain', {
      is: 'polygon',
      then: joi
        .valid('mumbai-testnet', 'mumbai-mainnet')
        .error(
          MirrorWorldSDKError.new(
            'INVALID_CHAIN_CONFIGURAITON_OPTIONS',
            toErrorMessage('INVALID_CHAIN_CONFIGURAITON_OPTIONS')
          )
        ),
    })
    .when('chain', {
      is: 'bnb',
      then: joi
        .valid('bnb-mainnet', 'bnb-testnet')
        .error(
          MirrorWorldSDKError.new(
            'INVALID_CHAIN_CONFIGURAITON_OPTIONS',
            toErrorMessage('INVALID_CHAIN_CONFIGURAITON_OPTIONS')
          )
        ),
    })
    .when('chain', {
      is: 'sui',
      then: joi
        .valid('mainnet', 'testnet')
        .error(
          MirrorWorldSDKError.new(
            'INVALID_CHAIN_CONFIGURAITON_OPTIONS',
            toErrorMessage('INVALID_CHAIN_CONFIGURAITON_OPTIONS')
          )
        ),
    }),
});
