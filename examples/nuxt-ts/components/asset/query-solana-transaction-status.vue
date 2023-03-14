<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm">
        Query Solana Transaction Status
      </c-heading>
      <c-form-control>
        <c-form-label font-size="sm" font-weight="bold">
          Signatures
        </c-form-label>
        <template v-for="(signature, i) in signatures" :key="i">
          <c-h-stack>
            <c-input
              size="xs"
              :placeholder="signature"
              display="block"
              max-w="300px"
              v-model="signatures[i]"
            />
            <c-icon-button
              icon="minus"
              size="xs"
              aria-label="remove"
              variant="outline"
              rounded="full"
              color-scheme="gray"
              @click="
                () => {
                  signatures = signatures.filter((_, index) => index !== i);
                }
              "
            />
          </c-h-stack>
        </template>
      </c-form-control>
      <c-button-group>
        <c-button
          left-icon="add"
          variant="outline"
          aria-label="remove"
          color-scheme="gray"
          size="xs"
          @click="() => signatures.push('')"
        >
          Add signature
        </c-button>
      </c-button-group>
      <c-wrap-item>
        <c-button
          @click="querySolanaAssetTransactionStatus"
          size="sm"
          variant="outline"
          color-scheme="gray"
        >
          Query Transaction Status
        </c-button>
      </c-wrap-item>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';

const { mirrorworld } = useMirrorWorld();

type QuerySolanaAssetTransactionStatusPayload = Parameters<
  typeof mirrorworld.value.querySolanaAssetTransactionStatus
>[0];

const signatures = ref(['']);

const payload = computed(() => ({
  signatures: signatures.value,
}));

async function querySolanaAssetTransactionStatus() {
  try {
    const result = await mirrorworld.value.querySolanaAssetTransactionStatus(
      payload.value
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
