<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Buy Solana NFT </c-heading>
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
      <c-wrap-item>
        <c-button
          @click="buySolanaNFT"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
          Buy NFT
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
});

async function buySolanaNFT() {
  try {
    const result = await mirrorworld.value.buySolanaNFT(payload);
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
    alert(result);
  } catch (error) {
    console.error(error);
  }
}
</script>
