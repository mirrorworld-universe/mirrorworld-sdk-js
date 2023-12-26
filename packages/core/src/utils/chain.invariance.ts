import { ChainConfig, ChainTypes } from '../configuration';
import { throwError } from '../errors/errors.interface';

export function assertAvailableFor<T extends ChainConfig<ChainTypes>>(
  method: string,
  config: T,
  includes: ChainConfig<ChainTypes>[]
): void {
  const matchIndex = includes.findIndex(
    (_c) => _c.chain === config.chain && _c.network === config.network
  );
  if (matchIndex < 0) {
    throwError(
      'METHOD_UNAVAILABLE_ON_CURRENT_CHAIN_CONFIG',
      `The method "${method}" is not available on ${config.chain}:${config.network}. Now your chain is ${config.chain}, make sure you initialize the correct chain.`
    );
  }
}
