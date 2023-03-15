<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Mint EVM NFT </c-heading>
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
        <c-form-control
          v-else-if="typeof payload[key] === 'number'"
          :is-required="requiredKeys.has(key)"
        >
          <c-form-label font-size="sm" font-weight="bold">
            {{ key }}
          </c-form-label>
          <c-input
            size="xs"
            :placeholder="key"
            display="block"
            v-model.number="payload[key]"
          />
        </c-form-control>
        <c-form-control v-else="typeof payload[key] === 'boolean'">
          <c-checkbox size="sm" v-model="payload[key]">
            {{ key }}
          </c-checkbox>
        </c-form-control>
      </template>
      <c-button
        @click="mintEVMNFT"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
        Mint NFT
      </c-button>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
import { isEmpty, omitBy, keysIn } from 'lodash-es';
import { TransactionCommitment } from '~~/../../packages/core/src/types/nft';

const { mirrorworld } = useMirrorWorld();

type MintEVMNFTToCollectionV2Payload = Parameters<
  typeof mirrorworld.value.mintEVMNFT
>[0];

const requiredKeys = new Map<any, any>([
  ['collection_address', true],
  ['token_id', true],
]);

const payload = reactive<MintEVMNFTToCollectionV2Payload>({
  collection_address: '',
  token_id: 1,
  to_wallet_address: '',
  mint_amount: 1,
  confirmation: TransactionCommitment.confirmed,
});

async function mintEVMNFT() {
  try {
    const result = await mirrorworld.value.mintEVMNFT(
      omitBy(payload, isEmpty) as any as MintEVMNFTToCollectionV2Payload
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
