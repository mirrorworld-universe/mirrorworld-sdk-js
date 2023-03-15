<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Query Solana Mints Status </c-heading>
      <c-form-control>
        <c-form-label font-size="sm" font-weight="bold">
          Mint Addresses
        </c-form-label>
        <template v-for="(signature, i) in mint_addresses" :key="i">
          <c-h-stack>
            <c-input
              size="xs"
              :placeholder="signature"
              display="block"
              max-w="300px"
              v-model="mint_addresses[i]"
            />
            <c-icon-button
              icon="minus"
              aria-label="remove"
              size="xs"
              variant="outline"
              rounded="full"
              color-scheme="gray"
              @click="
                () => {
                  mint_addresses = mint_addresses.filter(
                    (_, index) => index !== i
                  );
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
          color-scheme="gray"
          size="xs"
          @click="() => mint_addresses.push('')"
        >
          Add signature
        </c-button>
      </c-button-group>
      <c-button
        @click="querySolanaAssetMintsStatus"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
        Query Mints Status
      </c-button>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
import { isEmpty, omitBy } from 'lodash-es';
import { filterUndefined } from '@chakra-ui/utils';

const { mirrorworld } = useMirrorWorld();

type QuerySolanaAssetMintsStatusPayload = Parameters<
  typeof mirrorworld.value.querySolanaAssetMintsStatus
>[0];

const mint_addresses = ref(['']);

const payload = computed<QuerySolanaAssetMintsStatusPayload>(() => ({
  mint_addresses: mint_addresses.value,
}));

async function querySolanaAssetMintsStatus() {
  try {
    const result = await mirrorworld.value.querySolanaAssetMintsStatus(
      payload.value
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
