<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Mint NFT to Collection </c-heading>
      <template v-for="key in keysIn(payload)" :key="key">
        <c-form-control
          v-if="typeof payload[key] === 'string'"
          :is-required="requiredKeys.has(key)"
        >
          <c-form-label font-size="sm" font-weight="bold">
            {{ key }}
          </c-form-label>
          <c-input
            size="xs"
            :placeholder="key"
            display="block"
            v-model="payload[key]"
          />
        </c-form-control>
        <c-form-control v-if="typeof payload[key] === 'boolean'">
          <c-checkbox size="sm" v-model="payload[key]">
            {{ key }}
          </c-checkbox>
        </c-form-control>
      </template>
      <c-wrap-item>
        <c-button
          @click="mintSolanaNFT"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
          Mint NFT
        </c-button>
      </c-wrap-item>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
import { isEmpty, omitBy, keysIn } from 'lodash-es';
import { SolanaCommitment } from '~~/../../packages/core/src/types/nft';

const { mirrorworld } = useMirrorWorld();

type MintSolanaNFTToCollection = Parameters<
  typeof mirrorworld.value.mintSolanaNFT
>[0];

const requiredKeys = new Map<any, any>([['url', true]]);

const payload = reactive({
  url: '',
  name: '',
  symbol: '',
  mint_id: '',
  collection_mint: '',
  seller_fee_basis_points: 100,
  to_wallet_address: '',
  skip_preflight: true,
  confirmation: SolanaCommitment.confirmed,
});

async function mintSolanaNFT() {
  try {
    const result = await mirrorworld.value.mintSolanaNFT(
      // @ts-ignore
      {
        ...omitBy(payload, isEmpty),
        skip_preflight: true,
      }
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
