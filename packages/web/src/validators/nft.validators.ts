import { ICreateVerifiedCollectionPayload } from '../types/nft';
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
