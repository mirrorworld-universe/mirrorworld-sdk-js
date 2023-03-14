<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm">
        Update Solana NFT Marketplace
      </c-heading>
      <c-input-group size="sm" gap="3" flex-direction="column">
        <c-form-control>
          <c-form-label font-size="sm" font-weight="bold">
            treasury_mint
          </c-form-label>
          <c-input
            size="xs"
            placeholder="treasury_mint"
            display="block"
            v-model="payload.treasury_mint"
          />
        </c-form-control>
        <c-form-control>
          <c-form-label font-size="sm" font-weight="bold">
            seller_fee_basis_points
          </c-form-label>
          <c-input
            size="xs"
            placeholder="seller_fee_basis_points"
            display="block"
            v-model.number="payload.seller_fee_basis_points"
            type="number"
          />
        </c-form-control>
      </c-input-group>
      <c-form-control>
        <c-form-label font-size="sm" font-weight="bold">
          skip_preflight
        </c-form-label>
        <c-checkbox size="sm" v-model="payload.skip_preflight"
          >skip_preflight</c-checkbox
        >
      </c-form-control>
      <c-wrap-item>
        <c-button
          @click="updateSolanaMarketplace"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
          Update Marketplace
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

type TransferSolanaNFTPayload = Parameters<
  typeof mirrorworld.value.updateSolanaMarketplace
>[0];

const payload = reactive<TransferSolanaNFTPayload>({
  treasury_mint: '',
  seller_fee_basis_points: 100,
  skip_preflight: false,
});

async function updateSolanaMarketplace() {
  try {
    const result = await mirrorworld.value.updateSolanaMarketplace(payload);
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
