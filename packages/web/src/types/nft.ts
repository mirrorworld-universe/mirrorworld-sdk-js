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

export interface ICreateVerifiedCollectionPayload {
  name: string;
  symbol: string;
  url: string;
}
