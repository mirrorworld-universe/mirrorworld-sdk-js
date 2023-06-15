<template>
    <FunctionalWell>
      <c-stack>
        <c-heading as="h3" font-size="sm"> Query NFTs By Owner </c-heading>
        <c-input-group size="sm" gap="3" flex-direction="column">
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              owner_address
            </c-form-label>
            <c-input
              size="xs"
              placeholder="owner_address"
              display="block"
              v-model="payload.owner_address"
            />
          </c-form-control>
        </c-input-group>
        <c-button
          @click="doSearchNFTsByOwner"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
        searchNFTsByOwner
        </c-button>
      </c-stack>
    </FunctionalWell>
  </template>
  
  <script lang="ts" setup>
  import FunctionalWell from '@/components/ui/functional-well.vue';
  import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
  import { TransactionCommitment } from '~~/../../packages/core/src/types/nft';
import { SUITransferSUIPayloadV2 } from '~~/../../packages/core/dist/declarations/src/types/wallet.sui.v2';
import { SUIMintCollectionPayload, SUISearchNFTsByOwnerPayload } from '~~/../../packages/core/src/types/wallet.sui.v2';
import { string } from 'joi';
  
  const { mirrorworld } = useMirrorWorld();

  const payload = reactive<SUISearchNFTsByOwnerPayload>({
    owner_address: ''
});
  
  async function doSearchNFTsByOwner() {
    if(!warnParameters()) return
    try {
      const result =
        await mirrorworld.value.SUI.Asset.searchNFTsByOwner(
            payload
        );
      console.log('result', result);
      alert(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error);
    }
  }

  function warnParameters(){
    if(payload.owner_address == ''){
        console.warn("Please input parameters!")
        return false
    }
    return true
  }
  </script>
  