<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Verify EVM Mint Config </c-heading>
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
        @click="verifyEVMMintConfig"
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

type VerifyEVMMintConfigPayloadV2 = Parameters<
  typeof mirrorworld.value.Polygon.Asset.verifyMintConfig
>[0];

const requiredKeys = new Map<any, any>([['url', true]]);

const payload = reactive<VerifyEVMMintConfigPayloadV2>({
  url: '',
});

async function verifyEVMMintConfig() {
  try {
    const result = await mirrorworld.value.Polygon.Asset.verifyMintConfig(
      payload
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
