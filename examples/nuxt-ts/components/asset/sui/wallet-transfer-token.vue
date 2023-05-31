<template>
    <FunctionalWell>
      <c-stack>
        <c-heading as="h3" font-size="sm"> Transfer Token </c-heading>
        <c-input-group size="sm" gap="3" flex-direction="column">
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              The receiver wallet address
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
              The token amount
            </c-form-label>
            <c-input
              size="xs"
              placeholder="mint_address"
              display="block"
              v-model="payload.amount"
            />
          </c-form-control>
          <c-form-control>
            <c-form-label font-size="sm" font-weight="bold">
              The token mint address
            </c-form-label>
            <c-input
              size="xs"
              placeholder="mint_address"
              display="block"
              v-model="payload.token"
            />
          </c-form-control>
        </c-input-group>
        <c-button
          @click="transferToken"
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
import { SUITransferTokenPayload } from '~~/../../packages/core/dist/declarations/src/types/wallet.sui.v2';
  
  const { mirrorworld } = useMirrorWorld();

  const payload = reactive<SUITransferTokenPayload>({
    to_publickey: '',
    amount: 0,
    token:''
  });
  
  async function transferToken() {
    if(!warnParameters()) return
    try {
      const result =
        await mirrorworld.value.SUI.Wallet.transferToken(
            payload
        );
      console.log('result', result);
      alert(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error);
    }
  }

  function warnParameters(){
    if(payload.to_publickey == '' || payload.amount == 0 || payload.token == ''){
        console.warn("Please input parameters!")
        return false
    }
    return true
  }
  </script>
  