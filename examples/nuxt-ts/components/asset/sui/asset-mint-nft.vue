<template>
    <FunctionalWell>
      <c-stack>
        <c-heading as="h3" font-size="sm"> Mint NFT </c-heading>
        <c-input-group size="sm" gap="3" flex-direction="column">
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              collection_address
            </c-form-label>
            <c-input
              size="xs"
              placeholder="mint_address"
              display="block"
              v-model="payload.collection_address"
            />
          </c-form-control>
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
              description
            </c-form-label>
            <c-input
              size="xs"
              placeholder="description"
              display="block"
              v-model="payload.description"
            />
          </c-form-control>
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              image_url
            </c-form-label>
            <c-input
              size="xs"
              placeholder="image_url"
              display="block"
              v-model="payload.image_url"
            />
          </c-form-control>
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              to wallet address
            </c-form-label>
            <c-input
              size="xs"
              placeholder="image_url"
              display="block"
              v-model="payload.to_wallet_address"
            />
          </c-form-control>
        </c-input-group>
        <c-button
          @click="mintCollection"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
          Mint
        </c-button>
      </c-stack>
    </FunctionalWell>
  </template>
  
  <script lang="ts" setup>
  import FunctionalWell from '@/components/ui/functional-well.vue';
import { SUIMintNFTPayload } from '~~/../../packages/core/src/types/wallet.sui.v2';
  import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
  const { mirrorworld } = useMirrorWorld();

  const payload = reactive<SUIMintNFTPayload>({
    collection_address:'',
    name:'',
    description:'',
    image_url:'',
    attributes:[],
    to_wallet_address:''
  });
  
  async function mintCollection() {
    if(!warnParameters()) return
    try {
      const result =
        await mirrorworld.value.SUI.Asset.mintNFT(
            payload
        );
      console.log('result', result);
      alert(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error);
    }
  }

  function warnParameters(){
    if(payload.name == '' || payload.description == '' || payload.to_wallet_address == ''){
        console.warn("Please input parameters!")
        return false
    }
    return true
  }
  </script>
  