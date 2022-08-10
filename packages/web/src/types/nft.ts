export interface ISolanaNFT {
  name: string;
  sellerFeeBasisPoints: number;
  updateAuthorityAddress: string;
  description: string;
  image: string;
  externalUrl: string;
  creators?: Creator[] | null;
  owner: Owner;
  attributes?: MetadataAttribute[] | null;
  listings?: null[] | null;
}
export interface Creator {
  address: string;
  verified: boolean;
  share: number;
}
export interface Owner {
  address: string;
}
export interface MetadataAttribute {
  trait_type: string;
  value: string;
}

export interface CreateVerifiedCollectionPayload {
  name: string;
  symbol: string;
  metadataUri: string;
}

export interface ICreateVerifiedCollectionPayload
  extends Omit<CreateVerifiedCollectionPayload, 'metadataUri'> {
  url: string;
}

export interface CreateVerifiedSubCollectionPayload
  extends CreateVerifiedCollectionPayload {
  parentCollection: string;
}
export interface ICreateVerifiedSubCollectionPayload
  extends ICreateVerifiedCollectionPayload {
  collection_mint: string;
}

export interface IMintNFTPayload {
  collection_mint: string;
  name: string;
  symbol: string;
  url: string;
}

export interface MintNFTPayload
  extends Omit<IMintNFTPayload, 'url' | 'collection_mint'> {
  metadataUri: string;
  collection: string;
}

export interface IListNFTPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
}

export interface ListNFTPayload extends Omit<IListNFTPayload, 'mint_address'> {
  mintAddress: string;
}

export interface IUpdateListingPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
}

export interface UpdateListingPayload
  extends Omit<IUpdateListingPayload, 'mint_address'> {
  /**
   * Mint Address of the NFT listing being updated
   */
  mintAddress: string;
}

export interface IBuyNFTPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
}

export interface BuyNFTPayload extends Omit<IBuyNFTPayload, 'mint_address'> {
  /**
   * Mint Address of the NFT being purchased
   */
  mintAddress: string;
}

export interface ICancelNFTPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  price: number;
}

export interface CancelListingPayload
  extends Omit<ICancelNFTPayload, 'mint_address'> {
  /**
   * Mint Address of the NFT listing being cancelled
   */
  mintAddress: string;
}

export interface ITransferNFTPayload {
  mint_address: string;
  /**
   * Listing Price of the NFT
   */
  to_wallet_address: number;
}

export interface TransferNFTPayload {
  /**
   * Mint Address of the NFT listing being cancelled
   */
  mintAddress: string;
  /**
   * Recipient wallet address
   */
  recipientAddress: string;
}

export interface IVerifiedCollection {
  mint_address: string;
  url: string;
  update_authority: string;
  creator_address: string;
  name: string;
  symbol: string;
  collection?: null;
  signature: string;
  status: string;
}
