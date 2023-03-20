<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> List EVM NFT </c-heading>
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
        @click="listEVMNFT"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
        List NFT
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

type ListEVMNFTPayload = Parameters<
  typeof mirrorworld.value.Polygon.Asset.listNFT
>[0];

const requiredKeys = new Map<any, any>([
  ['collection_address', true],
  ['price', true],
  ['token_id', true],
  ['marketplace_address', true],
]);

const payload = reactive<ListEVMNFTPayload>({
  collection_address: '',
  price: 0,
  token_id: 1,
  marketplace_address: '',
  confirmation: TransactionCommitment.confirmed,
});

async function listEVMNFT() {
  try {
    const result = await mirrorworld.value.Polygon.Asset.listNFT(
      omitBy(payload, isEmpty) as unknown as ListEVMNFTPayload
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
