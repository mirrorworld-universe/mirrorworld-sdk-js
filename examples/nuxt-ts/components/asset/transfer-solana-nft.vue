<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Transfer Solana NFT </c-heading>
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
          <c-form-label font-size="sm" font-weight="bold">
            to_wallet_address
          </c-form-label>
          <c-input
            size="xs"
            placeholder="to_wallet_address"
            display="block"
            v-model="payload.to_wallet_address"
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
          @click="transferSolanaNFT"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
          Transfer NFT
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
  typeof mirrorworld.value.transferSolanaNFT
>[0];

const payload = reactive<TransferSolanaNFTPayload>({
  mint_address: '',
  to_wallet_address: '',
  confirmation: SolanaCommitment.confirmed,
  skip_preflight: false,
});

async function transferSolanaNFT() {
  try {
    const result = await mirrorworld.value.transferSolanaNFT(payload);
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
