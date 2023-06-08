<template>
    <FunctionalWell>
      <c-stack>
        <c-heading as="h3" font-size="sm"> Mint Collection </c-heading>
        <c-input-group size="sm" gap="3" flex-direction="column">
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              name
            </c-form-label>
            <c-input
              size="xs"
              placeholder="name"
              display="block"
              v-model="payload.name"
            />
          </c-form-control>
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              symbol
            </c-form-label>
            <c-input
              size="xs"
              placeholder="symbol"
              display="block"
              v-model="payload.symbol"
            />
          </c-form-control>
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              description
            </c-form-label>
            <c-input
              size="xs"
              placeholder="description"
              display="block"
              v-model="payload.description"
            />
          </c-form-control>
        </c-input-group>
        <c-button
          @click="mintCollection"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
        mintCollection
        </c-button>
      </c-stack>
    </FunctionalWell>
  </template>
  
  <script lang="ts" setup>
  import FunctionalWell from '@/components/ui/functional-well.vue';
  import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
  import { TransactionCommitment } from '~~/../../packages/core/src/types/nft';
import { SUITransferSUIPayloadV2 } from '~~/../../packages/core/dist/declarations/src/types/wallet.sui.v2';
import { SUIMintCollectionPayload } from '~~/../../packages/core/src/types/wallet.sui.v2';
import { string } from 'joi';
  
  const { mirrorworld } = useMirrorWorld();

  const payload = reactive<SUIMintCollectionPayload>({
    name:'',
    symbol:'',
    description:'',
    creators:[]
  });
  
  async function mintCollection() {
    if(!warnParameters()) return
    try {
      const result =
        await mirrorworld.value.SUI.Asset.mintCollection(
            payload
        );
      console.log('result', result);
      alert(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error);
    }
  }

  function warnParameters(){
    if(payload.name == '' || payload.description == ''){
        console.warn("Please input parameters!")
        return false
    }
    return true
  }
  </script>
  