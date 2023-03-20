<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Get EVM Collections </c-heading>
      <c-button
        @click="getEVMCollections"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
        Get collections
      </c-button>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
import { keysIn } from 'lodash-es';

const { mirrorworld } = useMirrorWorld();

async function getEVMCollections() {
  try {
    const result = await mirrorworld.value.Polygon.Asset.getCollections();
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
