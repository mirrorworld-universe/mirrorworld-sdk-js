<template>
  <c-h-stack p="8">
    <c-button
      size="sm"
      :as="NuxtLink"
      to="/v2/solana"
      rounded="none"
      variant="outline"
    >
      V2 Solana Routes
    </c-button>
    <c-button
      size="sm"
      :as="NuxtLink"
      to="/v2/evm"
      rounded="none"
      variant="outline"
    >
      V2 EVM Routes
    </c-button>
  </c-h-stack>
</template>

<script lang="ts" setup>
import { chakra } from '@chakra-ui/vue-next';
import { NuxtLink } from '#components';
</script>
