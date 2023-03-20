<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Search NFT Info </c-heading>
      <br />
      <c-form-control>
        <c-form-label font-size="sm" font-weight="bold">
          mint_address
        </c-form-label>
        <c-h-stack>
          <c-input
            size="xs"
            placeholder="mint_address"
            display="block"
            max-w="300px"
            v-model="payload.mint_address"
          />
        </c-h-stack>
      </c-form-control>
      <c-button
        @click="searchSolanaNFTByMintAddress"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
        Search
      </c-button>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';

const { mirrorworld } = useMirrorWorld();

type SearchSolanaNFTByMintAddress = Parameters<
  typeof mirrorworld.value.Solana.Asset.searchNFTsByMintAddress
>[0];

const requiredKeys = new Map<any, any>([['mint_address', true]]);

const payload = reactive<SearchSolanaNFTByMintAddress>({
  mint_address: '',
});

async function searchSolanaNFTByMintAddress() {
  try {
    const result = await mirrorworld.value.Solana.Asset.searchNFTsByMintAddress(
      payload
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
