<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Search EVM Collection NFTs </c-heading>
      <c-form-control is-required>
        <c-form-label font-size="sm" font-weight="bold">
          Collection Address
        </c-form-label>
        <c-input
          size="xs"
          :placeholder="collection_address"
          display="block"
          v-model="collection_address"
        />
      </c-form-control>
      <c-button
        @click="getEVMCollectionNFTs"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
        Get collection NFTs
      </c-button>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
import { keysIn } from 'lodash-es';

const { mirrorworld } = useMirrorWorld();

const collection_address = ref('');

async function getEVMCollectionNFTs() {
  try {
    const result = await mirrorworld.value.getEVMCollectionNFTs(
      collection_address.value
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
