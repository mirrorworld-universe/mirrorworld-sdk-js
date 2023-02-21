export type EthereumNetworks = 'mainnet' | 'goerli';
export type SolanaNetworks = 'mainnet-beta' | 'devnet';
export type PolygonNetworks = 'mumbai-mainnet' | 'mumbai-testnet';
export type BNBChainNetworks = 'bnb-mainnet' | 'bnb-testnet';
export type SuiNetworks = 'mainnet' | 'devnet';

export type ChainNetworks =
  | EthereumNetworks
  | SolanaNetworks
  | PolygonNetworks
  | BNBChainNetworks
  | SuiNetworks;

export type ChainTypes = 'ethereum' | 'solana' | 'polygon' | 'bnb' | 'sui';

export type MirrorWorldChains = {
  sui: SuiNetworks;
  ethereum: EthereumNetworks;
  bnb: BNBChainNetworks;
  solana: SolanaNetworks;
  polygon: PolygonNetworks;
};

export type ChainConfig<T extends ChainTypes> = {
  chain: T;
  network: MirrorWorldChains[T];
};

export function Ethereum<T extends EthereumNetworks>(
  network: T
): ChainConfig<'ethereum'> {
  return {
    chain: 'ethereum',
    network,
  };
}
export function Solana<T extends SolanaNetworks>(
  network: T
): ChainConfig<'solana'> {
  return {
    chain: 'solana',
    network,
  };
}
export function Polygon<T extends PolygonNetworks>(
  network: T
): ChainConfig<'polygon'> {
  return {
    chain: 'polygon',
    network,
  };
}
export function BNBChain<T extends BNBChainNetworks>(
  network: T
): ChainConfig<'bnb'> {
  return {
    chain: 'bnb',
    network,
  };
}
export function Sui<T extends SuiNetworks>(network: T): ChainConfig<'sui'> {
  return {
    chain: 'sui',
    network,
  };
}

export const Chains = Object.freeze({
  Ethereum,
  Solana,
  Polygon,
  BNBChain,
  Sui,
});
