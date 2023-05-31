<template>
    <FunctionalWell>
      <c-stack>
        <c-heading as="h3" font-size="sm"> Get Tokens </c-heading>
        <c-button
          @click="getTokens"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
          GetTokens
        </c-button>
      </c-stack>
    </FunctionalWell>
  </template>
  
  <script lang="ts" setup>
  import FunctionalWell from '@/components/ui/functional-well.vue';
  import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
  
  const { mirrorworld } = useMirrorWorld();

  async function getTokens() {
    if(!warnParameters()) return
    try {
      const result =
        await mirrorworld.value.SUI.Wallet.getTokens();
      console.log('result', result);
      alert(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error);
    }
  }

  function warnParameters(){
    return true
  }
  </script>
  