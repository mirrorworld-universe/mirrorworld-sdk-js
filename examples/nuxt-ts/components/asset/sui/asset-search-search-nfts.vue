<template>
    <FunctionalWell>
      <c-stack>
        <c-heading as="h3" font-size="sm"> Query NFTs </c-heading>
        <c-input-group size="sm" gap="3" flex-direction="column">
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              nft_object_id_1
            </c-form-label>
            <c-input
              size="xs"
              placeholder="nft_object_id_1"
              display="block"
              v-model="value1"
            />
          </c-form-control>
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              nft_object_id_2
            </c-form-label>
            <c-input
              size="xs"
              placeholder="nft_object_id_2"
              display="block"
              v-model="value2"
            />
          </c-form-control>
        </c-input-group>
        <c-button
          @click="doSearchNFTs"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
        searchNFTs
        </c-button>
      </c-stack>
    </FunctionalWell>
  </template>
  
  <script lang="ts" setup>
  import FunctionalWell from '@/components/ui/functional-well.vue';
  import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
  import { TransactionCommitment } from '~~/../../packages/core/src/types/nft';
import { SUITransferSUIPayloadV2 } from '~~/../../packages/core/dist/declarations/src/types/wallet.sui.v2';
import { SUIMintCollectionPayload, SUISearchNFTsByOwnerPayload, SUISearchNFTsPayload } from '~~/../../packages/core/src/types/wallet.sui.v2';
import { string } from 'joi';
  
  const { mirrorworld } = useMirrorWorld();

  const payload = reactive<SUISearchNFTsPayload>({
nft_object_ids: []
});

var value1 = ''
var value2 = ''
  
  async function doSearchNFTs() {
    if(!warnParameters()) return
    try {
      if(value1 !== '') payload.nft_object_ids.push(value1)
      if(value2 !== '') payload.nft_object_ids.push(value2)
      const result =
        await mirrorworld.value.SUI.Asset.searchNFTs(
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
  