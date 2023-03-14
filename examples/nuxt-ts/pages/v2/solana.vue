<template>
  <c-stack as="main" px="10" pb="8">
    <c-heading as="h1" font-size="1.8rem">Mirror World Smart SDK v2</c-heading>
    <c-simple-grid template-columns="1fr 1fr" template-rows="1fr 1fr" gap="8">
      <c-stack
        p="3"
        border-color="gray.300"
        border-width="1px"
        border-style="dashed"
        rounded="sm"
      >
        <c-heading font-size="md"> Authentication </c-heading>
        <c-wrap>
          <c-wrap-item>
            <c-button
              @click="mirrorworld.login()"
              size="sm"
              variant="outline"
              color-scheme="gray"
            >
              Login
            </c-button>
          </c-wrap-item>
        </c-wrap>
      </c-stack>
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
            <asset-list-solana-nft />
          </c-wrap-item>
          <c-wrap-item>
            <asset-buy-solana-nft />
          </c-wrap-item>
          <c-wrap-item>
            <asset-cancel-solana-nft-listing />
          </c-wrap-item>
          <c-wrap-item>
            <asset-transfer-solana-nft />
          </c-wrap-item>
          <c-wrap-item>
            <asset-create-solana-marketplace />
          </c-wrap-item>
          <c-wrap-item>
            <asset-update-solana-marketplace />
          </c-wrap-item>
          <c-wrap-item>
            <asset-query-solana-marketplaces />
          </c-wrap-item>
          <c-wrap-item>
            <asset-query-solana-transaction-status />
          </c-wrap-item>
          <c-wrap-item>
            <asset-query-solana-mints-status />
          </c-wrap-item>
          <c-wrap-item>
            <asset-create-solana-verified-collection />
          </c-wrap-item>
          <c-wrap-item>
            <asset-mint-solana-nft-to-collection />
          </c-wrap-item>
          <c-wrap-item>
            <asset-search-solana-nfts-by-mint-addresses />
          </c-wrap-item>
          <c-wrap-item>
            <asset-search-solana-nfts-by-owner-addresses />
          </c-wrap-item>
          <c-wrap-item>
            <asset-search-solana-nfts-by-creator-addresses />
          </c-wrap-item>
          <c-wrap-item>
            <asset-search-solana-nfts-by-update-authority-addresses />
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
import { chakra, CWrap, CWrapItem } from '@chakra-ui/vue-next';
import { useMirrorWorld } from '@/hooks/use-mirrorworld';
import {
  AssetBuySolanaNft,
  AssetCancelSolanaNftListing,
  AssetListSolanaNft,
  AssetTransferSolanaNft,
  AssetCreateSolanaMarketplace,
  AssetUpdateSolanaMarketplace,
  AssetQuerySolanaMarketplaces,
  AssetQuerySolanaTransactionStatus,
  AssetQuerySolanaMintsStatus,
  AssetCreateSolanaVerifiedCollection,
  AssetMintSolanaNftToCollection,
  AssetVerifySolanaMintConfig,
  AssetSearchSolanaNftsByCreatorAddresses,
  AssetSearchSolanaNftsByMintAddresses,
  AssetSearchSolanaNftsByOwnerAddresses,
  AssetSearchSolanaNftsByUpdateAuthorityAddresses,
} from '#components';

const { mirrorworld } = useMirrorWorld();

definePageMeta({
  layout: 'default',
});
</script>
