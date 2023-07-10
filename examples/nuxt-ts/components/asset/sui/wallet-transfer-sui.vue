<template>
    <FunctionalWell>
      <c-stack>
        <c-heading as="h3" font-size="sm"> Transfer SUI </c-heading>
        <c-input-group size="sm" gap="3" flex-direction="column">
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              To Public
            </c-form-label>
            <c-input
              size="xs"
              placeholder="mint_address"
              display="block"
              v-model="payload.to_publickey"
            />
          </c-form-control>
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              Amount
            </c-form-label>
            <c-input
              size="xs"
              placeholder="mint_address"
              display="block"
              v-model="payload.amount"
            />
          </c-form-control>
        </c-input-group>
        <c-button
          @click="transferSUI"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
          TransferSUI
        </c-button>
      </c-stack>
    </FunctionalWell>
  </template>
  
  <script lang="ts" setup>
  import FunctionalWell from '@/components/ui/functional-well.vue';
  import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
  import { TransactionCommitment } from '~~/../../packages/core/src/types/nft';
import { SUITransferSUIPayloadV2 } from '~~/../../packages/core/dist/declarations/src/types/wallet.sui.v2';
  
  const { mirrorworld } = useMirrorWorld();

  const payload = reactive<SUITransferSUIPayloadV2>({
    to_publickey: '',
    amount: 0
  });
  
  async function transferSUI() {
    if(!warnParameters()) return
    try {
      const result =
        await mirrorworld.value.SUI.Wallet.transferSUI(
            payload
        );
      console.log('result', result);
      alert(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error);
    }
  }

  function warnParameters(){
    if(payload.to_publickey == '' || payload.amount == 0){
        console.warn("Please input parameters!")
        return false
    }
    return true
  }
  </script>
  