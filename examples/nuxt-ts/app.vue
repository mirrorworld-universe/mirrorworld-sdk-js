<template>
  <MirrorWorldProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </MirrorWorldProvider>
</template>
<script setup lang="ts">
import { MirrorWorldProvider } from './hooks/use-mirrorworld';
import '@fontsource/dm-sans';
import '@fontsource/dm-sans/700.css';
</script>

<style>
html,
body {
  font-family: 'DM Sans', sans-serif;
}
h1,
h2,
h3,
h4,
button {
  font-weight: 700;
}
</style>
