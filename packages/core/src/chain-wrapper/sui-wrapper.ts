import { AxiosRequestConfig } from 'axios';
import qs from 'query-string';
import type * as CSS from 'csstype';
import {
  MirrorWorldEventKey,
  MirrorWorldEvents,
  MirrorWorldOptions,
  WalletUIEvents,
} from '../types/instance';
import { createAPIClient, MirrorWorldAPIClient } from '../services/api';
import { ClusterEnvironment } from '../services/cluster';
import { emitter, windowEmitter } from '../events/emitter';
import { clientOptionsSchema } from '../validators';
import { LoginEmailCredentials } from '../types/auth';
import { IPaginatedResponse, IResponse } from '../types/response.type';
import { IUser, UserWithWallet, Wallet } from '../types/user.type';
import { canUseDom, isSafari } from '../utils';
import { animate } from 'motion';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { hideOthers } from 'aria-hidden';

import {
  IBuySolanaNFTPayloadV2,
  ISolanaCancelNFTListingPayloadV2,
  IBuySolanaListNFTPayloadV2,
  ITransferSolanaNFTPayloadV2,
  SolanaNFTExtended,
  IBuyEVMNFTPayloadV2,
  IListEVMNFTPayloadV2,
  ICancelListingEVMPayloadV2,
  ITransferEVMNFTPayloadV2,
} from '../types/nft';
import { ISolanaToken } from '../types/token';
import { ISolanaTransaction } from '../types/transaction';
import {
  BaseSolanaAuctionSchemaV2,
  BuyEVMNFTSchemaV2,
  CancelEVMNFTListingSchemaV2,
  CreateEVMCollectionSchemaV2,
  CreateEVMMarketplaceSchemaV2,
  CreateMarketplaceSchemaV2,
  CreateVerifiedCollectionSchemaV2,
  ListEVMNFTSchemaV2,
  MintEVMNFTToCollectionSchemaV2,
  MintSolanaNFTToCollectionSchemaV2,
  QueryAssetMintsStatusSchemaV2,
  QueryAssetTransactionStatusSchemaV2,
  SearchEVMNFTsByOwnerAddressesSchemaV2,
  SearchEVMNFTsSchemaV2,
  SearchSolanaNFTInfoSchemaV2,
  SearchSolanaNFTsByCreatorAddressesSchemaV2,
  SearchSolanaNFTsByMintAddressesSchemaV2,
  SearchSolanaNFTsByOwnerAddressesSchemaV2,
  SearchSolanaNFTsByUpdateAuthorityAddressesSchemaV2,
  TransferEVMNFTSchemaV2,
  TransferSolanaNFTSchemaV2,
  UpdateEVMMarketplaceSchemaV2,
  UpdateMarketplaceSchemaV2,
  VerifyEVMMintConfigSchemaV2,
  VerifySolanaMintConfigSchemaV2,
} from '../validators/asset.v2.validators';
import {
  ICreateEVMMarketplacePayloadV2,
  ISolanaMarketplaceQueryResultV2,
  IUpdateMarketplacePayloadV2,
  MarketplaceQueryOptionsV2,
  IEVMMarketplaceV2,
  IUpdateEVMMarketplacePayloadV2,
  IQueryEVMMarketplaceOptionsV2,
  IQueryEVMMarketplacePaginationOptionsV2,
  IQueryEVMMarketplaceResultV2,
  ICreateSolanaMarketplacePayloadV2,
  SolanaMarketplaceV2,
} from '../types/marketplace';
import { IAction, ICreateActionPayload } from '../types/actions';
import { createActionSchema } from '../validators/action.validator';
import { Emitter } from 'mitt';
import {
  BNBChain,
  ChainConfig,
  ChainTypes,
  Ethereum,
  EVMChains,
  isSolana,
  Polygon,
  Solana,
  SolanaChain,
  Sui,
} from '../configuration';
import {
  cp,
  createAPIClientV2,
  MirrorWorldAPIClientV2,
  MirrorWorldAPIService,
} from '../services/api.v2';
import {
  EVMNFTActivity,
  EVMNFTExtended,
  EVMNFTInfo,
  QueryEVMNFTActivityPayload,
  QueryEVMNFTActivityResult,
  QueryEVMNFTInfoPayload,
  QuerySolanaNFTActivityPayload,
  QuerySolanaNFTActivityResult,
  QuerySolanaNFTInfoPayload,
  SolanaNFTActivity,
  SolanaNFTInfo,
} from '../types/nft.v2';
import { digest } from '../utils/encrypt';
import {
  fetchEVMNFTInfoSchema,
  fetchEVMNFTsActivitySchema,
  fetchSolanaNFTsActivitySchema,
} from '../validators/metadata.validators';
import { assertAvailableFor } from '../utils/chain.invariance';
import {
  CreateVerifiedCollectionPayloadV2,
  MintSolanaNFTToCollectionPayloadV2,
  MintSolanaNFTToCollectionResultV2,
  QueryAssetMintsStatusPayload,
  QueryAssetTransactionStatusPayload,
  QueryAssetTransactionStatusResult,
  SearchSolanaNFTsByCreatorsPayloadV2,
  SearchSolanaNFTsByMintAddressesPayloadV2,
  SearchSolanaNFTsByOwnersPayloadV2,
  SearchSolanaNFTsByUpdateAuthoritiesPayloadV2,
  SolanaNFT,
  SolanaNFTDevnet,
  SolanaNFTListingV2,
  UpdateSolanaNFTMetadataPayloadV2,
  VerifiedSolanaCollection,
  VerifySolanaMintConfigPayloadV2,
  VerifySolanaMintConfigResultV2,
} from '../types/asset.solana.v2';
import {
  CreateEVMCollectionResultV2,
  CreateEVMCollectionV2Payload,
  EVMCollectionV2,
  EVMNFTListingV2,
  MintEVMNFTToCollectionResultV2,
  MintEVMNFTToCollectionV2Payload,
  SearchEVMNFTsByOwnerAddressesPayloadV2,
  SearchEVMNFTsPayloadV2,
  VerifyEVMMintConfigPayloadV2,
  VerifyEVMMintConfigResultV2,
} from '../types/asset.evm.v2';
import {
  EVMPersonalSignPayloadV2,
  EVMPersonalSignResultV2,
  EVMSignAndSendTransactionPayloadV2,
  EVMSignAndSendTransactionV2Result,
  EVMSignTypedDataPayloadV2,
  EVMSignTypedDataV2Result,
  EVMSignTypedDataWithVersionPayloadV2,
  EVMSignTypedDataWithVersionV2Result,
  EVMTransaction,
  EVMTransferERCTokenPayloadV2,
  EVMTransferTokensPayloadV2,
  EVMTransferTokensResponseV2,
  EVMUserTransactionsV2Data,
  GetEVMUserTokensV2Data,
} from '../types/wallet.evm.v2';
import {
  GetSolanaTokensV2Data,
  GetSolanaTransactionV2Data,
  SolanaBaseSignatureResultV2,
  SolanaTransactionV2,
  SolanaTransferSOLPayloadV2,
  SolanaTransferSPLTokenPayloadV2,
} from '../types/wallet.solana.v2';
import {
  EVMMarketplaceEventsResultV2,
  QueryEVMNFT,
  QueryEVMNFTsInfoResultV2,
  QueryEVMNFTsPayloadV2,
  SearchEVMMarketplaceEventsPayloadV2,
  SearchEVMNFTInCollectionPayloadV2,
  SearchEVMRecommendedNFTInCollectionPayloadV2,
} from '../types/metadata.evm.v2';
import {
  QuerySolanaNFT,
  QuerySolanaNFTsInfoResultV2,
  QuerySolanaNFTsPayloadV2,
  SearchSolanaMarketplaceEventsPayloadV2,
  SearchSolanaNFTInCollectionPayloadV2,
  SearchSolanaRecommendedNFTInCollectionPayloadV2,
  SolanaMarketplaceEventsResultV2,
} from '../types/metadata.solana.v2';
import {
  CollectionFilterMetadataV2,
  CollectionsResultV2,
  CollectionSummaryV2,
  SearchCollectionsInfoV2,
  QueryCollectionsSummaryV2,
  RegisterCollectionPayloadV2,
  RegisterCollectionResultV2,
} from '../types/metadata.common.v2';
import { SUIGetTokensData, SUITransactionData, SUITransferSUIData, SUITransferSUIPayloadV2, SUITransferTokenPayload } from '../types/wallet.sui.v2';
  
export const SUIWrapper = {
    getTransactionByDigest,
    transferSUI,
    transferToken,
    getTokens
}
function assertSUIOnly(
    methodName: string,
    chainConfig: ChainConfig<ChainTypes>
  ) {
    return assertAvailableFor(methodName, chainConfig, [
      Sui('mainnet'),
      Sui('devnet'),
    ]);
  }

  async function getTransactionByDigest(
    chainConfig: ChainConfig<ChainTypes>,
    v2Client:MirrorWorldAPIClientV2,
    url:string
  ): Promise<SUITransactionData> {
    assertSUIOnly('getTransactionByDigest', chainConfig);
    const response = await v2Client.api.get('wallet')!.get<IResponse<SUITransactionData>>(url);
    return response.data.data;
  }

  /** Transfers SUI from user's wallet address to another wallet address */
 async function transferSUI(
    payload: SUITransferSUIPayloadV2,
    url:string,
    chainConfig: ChainConfig<ChainTypes>,
    v2Client:MirrorWorldAPIClientV2,
  ): Promise<SUITransferSUIData> {
    assertSUIOnly('transferSUI', chainConfig);

    const response = await v2Client.api.get('wallet')!.post<
    IResponse<SUITransferSUIData>>(url,payload);
    return response.data.data;
  }

async function transferToken(
    payload:SUITransferTokenPayload,
    url:string,
    chainConfig:ChainConfig<ChainTypes>,
    v2Client:MirrorWorldAPIClientV2
){
    assertSUIOnly('transferToken', chainConfig);

    const response = await v2Client.api.get('wallet')!.post<
    IResponse<SUITransferSUIData>>(url,payload);
    return response.data.data;
}

async function getTokens(
    url:string,
    chainConfig:ChainConfig<ChainTypes>,
    v2Client:MirrorWorldAPIClientV2
){
    assertSUIOnly('getTokens', chainConfig);

    const response = await v2Client.api.get('wallet')!.get<
    IResponse<SUIGetTokensData>>(url);
    return response.data.data;
}