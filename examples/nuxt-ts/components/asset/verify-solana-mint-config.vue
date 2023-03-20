<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Verify Solana Mint Config </c-heading>
      <template v-for="key in keysIn(payload)" :key="key">
        <c-form-control
          v-if="typeof payload[key] === 'string'"
          :is-required="requiredKeys.has(key)"
        >
          <c-form-label font-size="sm" font-weight="bold">
            {{ key }}
          </c-form-label>
          <c-input
            size="xs"
            :placeholder="key"
            display="block"
            v-model="payload[key]"
          />
        </c-form-control>
        <c-form-control v-if="typeof payload[key] === 'boolean'">
          <c-checkbox size="sm" v-model="payload[key]">
            {{ key }}
          </c-checkbox>
        </c-form-control>
      </template>
      <c-button
        @click="verifySolanaMintConfig"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
        Verify Solana Mint Config
      </c-button>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
import { keysIn } from 'lodash-es';

const { mirrorworld } = useMirrorWorld();

type VerifySolanaMintConfigPayloadV2 = Parameters<
  typeof mirrorworld.value.Solana.Asset.verifyMintConfig
>[0];

const requiredKeys = new Map<any, any>([['url', true]]);

const payload = reactive<VerifySolanaMintConfigPayloadV2>({
  url: '',
});

async function verifySolanaMintConfig() {
  try {
    const result = await mirrorworld.value.Solana.Asset.verifyMintConfig(
      payload
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
