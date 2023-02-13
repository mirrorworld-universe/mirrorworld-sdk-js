import joi from 'joi';
import { MirrorWorldOptions } from '../types/instance';
import {
  MirrorWorldSDKError,
  toErrorMessage,
} from '../errors/errors.interface';
import { ClusterEnvironment } from '../services/cluster';

export const clientOptionsSchema = joi.object<MirrorWorldOptions>({
  env: joi
    .string()
    .optional()
    .valid(
      ClusterEnvironment.mainnet,
      ClusterEnvironment.testnet,
      ClusterEnvironment.local
    ),
  apiKey: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_OPTIONS',
        toErrorMessage('INVALID_OPTIONS', '`apiKey` is required')
      )
    ),
  autoLoginCredentials: joi
    .string()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_OPTIONS',
        toErrorMessage(
          'INVALID_OPTIONS',
          '`autoLoginCredentials` should be a string.'
        )
      )
    ),
  staging: joi
    .boolean()
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_OPTIONS',
        toErrorMessage('INVALID_OPTIONS', '`staging` should be a boolean.')
      )
    ),
  walletUIConfig: joi
    .object<MirrorWorldOptions['walletUIConfig']>({
      uxMode: joi.allow('popup', 'embedded').required(),
    })
    .optional()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_OPTIONS',
        toErrorMessage(
          'INVALID_OPTIONS',
          '`walletUIConfig` should declare uxMode.'
        )
      )
    ),
});
