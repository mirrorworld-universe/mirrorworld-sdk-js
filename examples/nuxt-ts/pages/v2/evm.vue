<template>
  <c-stack as="main" px="10" pb="8">
    <c-heading as="h1" font-size="1.8rem">EVM Features</c-heading>
    <c-simple-grid template-columns="1fr 1fr" template-rows="1fr 1fr" gap="8">
      <c-stack
        p="5"
        border-color="gray.300"
        border-width="1px"
        border-style="dashed"
        rounded="sm"
        spacing="5"
      >
        <c-heading font-size="2xl"> Assets Service </c-heading>
        <c-wrap spacing="3">
          <c-wrap-item>
            <asset-create-evm-collection />
          </c-wrap-item>
          <c-wrap-item>
            <asset-mint-evm-nft-to-collection />
          </c-wrap-item>
          <c-wrap-item>
            <asset-verify-evm-mint-config />
          </c-wrap-item>
          <c-wrap-item>
            <asset-get-evm-collections />
          </c-wrap-item>
          <c-wrap-item>
            <asset-query-evm-collection-nfts />
          </c-wrap-item>
          <c-wrap-item>
            <asset-list-evm-nft />
          </c-wrap-item>
          <c-wrap-item>
            <asset-buy-evm-nft />
          </c-wrap-item>
          <c-wrap-item>
            <asset-cancel-evm-nft-listing />
          </c-wrap-item>
          <c-wrap-item>
            <asset-transfer-evm-nft />
          </c-wrap-item>
          <c-wrap-item>
            <asset-create-evm-marketplace />
          </c-wrap-item>
          <c-wrap-item>
            <asset-update-evm-marketplace />
          </c-wrap-item>
          <c-wrap-item>
            <asset-query-evm-marketplaces />
          </c-wrap-item>
        </c-wrap>
      </c-stack>
      <c-stack
        p="3"
        border-color="gray.300"
        border-width="1px"
        border-style="dashed"
        rounded="sm"
      >
        <c-heading font-size="md"> Wallet </c-heading>
        <c-wrap>
          <c-wrap-item>
            <c-button size="sm" variant="outline" color-scheme="gray">
              Login
            </c-button>
          </c-wrap-item>
        </c-wrap>
      </c-stack>
      <c-stack
        p="3"
        border-color="gray.300"
        border-width="1px"
        border-style="dashed"
        rounded="sm"
      >
        <c-heading font-size="md"> Metadata </c-heading>
        <c-wrap>
          <c-wrap-item>
            <c-button size="sm" variant="outline" color-scheme="gray">
              Login
            </c-button>
          </c-wrap-item>
        </c-wrap>
      </c-stack>
    </c-simple-grid>
  </c-stack>
</template>

<script setup lang="ts">
import { CWrap, CWrapItem } from '@chakra-ui/vue-next';
import {
  AssetCreateEvmCollection,
  AssetMintEvmNftToCollection,
  AssetVerifyEvmMintConfig,
  AssetGetEvmCollections,
  AssetQueryEvmCollectionNfts,
  AssetBuyEvmNft,
  AssetListEvmNft,
  AssetCancelEvmNftListing,
  AssetTransferEvmNft,
  AssetCreateEvmMarketplace,
  AssetUpdateEvmMarketplace,
  AssetQueryEvmMarketplaces,
} from '#components';

definePageMeta({
  layout: 'default',
});
</script>
