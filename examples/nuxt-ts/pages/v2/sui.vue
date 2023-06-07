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
            <div v-if="loggedIn">
              Welcome, <chakra-text>{{ user }}</chakra-text>!
            </div>
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
            <asset-get-minted-collections/>
          </c-wrap-item>
          <c-wrap-item>
            <asset-get-minted-nft-on-collection/>
          </c-wrap-item>
          <c-wrap-item>
            <asset-mint-collection/>
          </c-wrap-item>
          <c-wrap-item>
            <asset-mint-nft/>
          </c-wrap-item>
        </c-wrap>
      </c-stack>
      <c-stack
        p="3"
        border-color="gray.300"
        border-width="1px"
        border-style="dashed"
        rounded="sm"
        spacing="5"
      >
        <c-heading font-size="md"> Wallet </c-heading>
        <c-wrap spacing="3">
          <c-wrap-item>
            <asset-sui-wallet-get-transaction-by-digest/>
          </c-wrap-item>
          <c-wrap-item>
            <asset-sui-wallet-transfer-sui/>
          </c-wrap-item>
          <c-wrap-item>
            <asset-sui-wallet-transfer-token/>
          </c-wrap-item>
          <c-wrap-item>
            <asset-sui-wallet-get-tokens/>
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
              PlaceHolder
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
  AssetSearchSolanaNftByMintAddress,
} from '#components';

const { mirrorworld, user: _user  } = useMirrorWorld();
// 判断用户是否已登录
const loggedIn = computed(() => !!_user.value);

// 格式化用户信息并返回 name 属性
const user = computed(() => _user.value || '');

definePageMeta({
  layout: 'default',
});

</script>
