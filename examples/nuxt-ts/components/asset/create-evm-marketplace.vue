<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Create EVM NFT Marketplace </c-heading>
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
        @click="createEVMMarketplace"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
        Create Marketplace
      </c-button>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { isEmpty, omitBy, keysIn } from 'lodash-es';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';

const { mirrorworld } = useMirrorWorld();

type CreateEVMNFTMarketplacePayload = Parameters<
  typeof mirrorworld.value.Polygon.Asset.createMarketplace
>[0];

const requiredKeys = new Map<any, any>([
  ['payment_token', true],
  ['seller_fee_basis_points', true],
]);

const payload = reactive<CreateEVMNFTMarketplacePayload>({
  payment_token: '',
  seller_fee_basis_points: 100,
});

async function createEVMMarketplace() {
  try {
    const result = await mirrorworld.value.Polygon.Asset.createMarketplace(
      payload
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
