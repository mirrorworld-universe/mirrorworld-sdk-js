<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Create EVM Collection </c-heading>
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
        <c-form-control v-else-if="typeof payload[key] === 'boolean'">
          <c-checkbox size="sm" v-model="payload[key]">
            {{ key }}
          </c-checkbox>
        </c-form-control>
      </template>
      <c-button
        @click="createEVMCollection"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
        Create Collection
      </c-button>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
import { isEmpty, omitBy, keysIn } from 'lodash-es';
import { TransactionCommitment } from '~~/../../packages/core/src/types/nft';
import { EVMContractType } from '~~/../../packages/core/src/types/asset.evm.v2';

const { mirrorworld } = useMirrorWorld();

type CreateEVMCollectionPayloadV2 = Parameters<
  typeof mirrorworld.value.Polygon.Asset.createCollection
>[0];

const requiredKeys = new Map<any, any>([
  ['name', true],
  ['symbol', true],
  ['url', true],
]);

const payload = reactive<CreateEVMCollectionPayloadV2>({
  name: '',
  symbol: '',
  url: '',
  contract_type: EVMContractType.erc721,
  mint_start_id: undefined,
  mint_end_id: undefined,
  mint_amount: undefined,
  confirmation: TransactionCommitment.confirmed,
});

async function createEVMCollection() {
  try {
    const result = await mirrorworld.value.Polygon.Asset.createCollection(
      omitBy(payload, isEmpty) as any as CreateEVMCollectionPayloadV2
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
