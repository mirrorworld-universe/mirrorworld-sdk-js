<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Query NFT </c-heading>
      <c-input-group size="sm" gap="3" flex-direction="column">
        <c-form-control>
          <c-form-label font-size="sm" font-weight="bold">
            nft_object_id
          </c-form-label>
          <c-input
            size="xs"
            placeholder="nft_object_id"
            display="block"
            v-model="digest"
          />
        </c-form-control>
      </c-input-group>
      <c-button
        @click="doQueryNFT"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
      queryNFT
      </c-button>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
import { TransactionCommitment } from '~~/../../packages/core/src/types/nft';

const { mirrorworld } = useMirrorWorld();

var digest = '';

async function doQueryNFT() {
  if(!warnParameters()) return
  try {
    const result =
      await mirrorworld.value.SUI.Asset.queryNFT(
          digest
      );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}

function warnParameters(){
  if(digest == ''){
      console.warn("Please input parameters!")
      return false
  }
  return true
}
</script>
