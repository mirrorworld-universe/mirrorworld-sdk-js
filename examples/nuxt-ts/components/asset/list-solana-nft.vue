<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> List Solana NFT </c-heading>
      <c-input-group size="sm" gap="3" flex-direction="column">
        <c-form-control>
          <c-form-label font-size="sm" font-weight="bold">
            mint_address
          </c-form-label>
          <c-input
            size="xs"
            placeholder="mint_address"
            display="block"
            v-model="payload.mint_address"
          />
        </c-form-control>
        <c-form-control>
          <c-form-label font-size="sm" font-weight="bold"> price </c-form-label>
          <c-input
            size="xs"
            placeholder="price"
            display="block"
            v-model.number="payload.price"
            type="number"
          />
        </c-form-control>
        <c-form-control>
          <c-form-label font-size="sm" font-weight="bold">
            auction_house
          </c-form-label>
          <c-input
            size="xs"
            placeholder="auction_house"
            display="block"
            v-model="payload.auction_house"
          />
        </c-form-control>
      </c-input-group>
      <c-form-control>
        <c-form-label font-size="sm" font-weight="bold">
          auction_house
        </c-form-label>
        <c-checkbox size="sm" v-model="payload.skip_preflight"
          >skip_preflight</c-checkbox
        >
      </c-form-control>
      <c-wrap-item>
        <c-button
          @click="listSolanaNFT"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
          List NFT
        </c-button>
      </c-wrap-item>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
import { SolanaCommitment } from '~~/../../packages/core/src/types/nft';

const { mirrorworld } = useMirrorWorld();

type BuySolanaNFTPayload = Parameters<typeof mirrorworld.value.buySolanaNFT>[0];

const payload = reactive<BuySolanaNFTPayload>({
  mint_address: '',
  price: 0,
  auction_house: '',
  confirmation: SolanaCommitment.confirmed,
  skip_preflight: false,
});

async function listSolanaNFT() {
  try {
    const result = await mirrorworld.value.listSolanaNFT(payload);
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
