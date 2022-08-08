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
  clientId: joi
    .string()
    .required()
    .error(
      MirrorWorldSDKError.new(
        'INVALID_OPTIONS',
        toErrorMessage('INVALID_OPTIONS', '`clientId` is required')
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
          '`autoLoginCredentials` should be a string'
        )
      )
    ),
});
