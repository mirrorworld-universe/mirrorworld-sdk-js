<template>
  <chakra.div>
    <NuxtLoadingIndicator color="#dcff1a" :throttle="0" />
    <TopNavigation />
    <slot></slot>
  </chakra.div>
</template>

<script setup lang="ts">
import { chakra } from '@chakra-ui/vue-next';
import TopNavigation from '@/components/top-navigation.vue';
</script>
