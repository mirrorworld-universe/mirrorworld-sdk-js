<template>
  <c-h-stack p="8">
    <c-button
      size="sm"
      :as="NuxtLink"
      to="/v2/solana"
      rounded="none"
      variant="outline"
    >
      V2 Routes
    </c-button>
  </c-h-stack>
</template>

<script lang="ts" setup>
import { chakra } from '@chakra-ui/vue-next';
import { NuxtLink } from '#components';
</script>
