<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm">
        Search NFTs by Mint Address
      </c-heading>
      <br />
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
              aria-label="remove"
              icon="minus"
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
          Add mint address
        </c-button>
      </c-button-group>
      <c-button
        @click="searchSolanaNFTsByMintAddresses"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
        Search
      </c-button>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { ChainConfig } from '~~/../../packages/core/src';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';

const { mirrorworld } = useMirrorWorld();

type QuerySolanaAssetMintsStatusPayload = Parameters<
  typeof mirrorworld.value.searchSolanaNFTsByMintAddresses
>[0];

const mint_addresses = ref(['']);

const payload = computed<QuerySolanaAssetMintsStatusPayload>(() => ({
  mint_addresses: mint_addresses.value,
  limit: 10,
  offset: 0,
}));

async function searchSolanaNFTsByMintAddresses() {
  try {
    // TS Tip
    // ==============
    // You can constrain the types on mainnet and devnet by passing in the generic
    // for example:
    // const result = await mirrorworld.value.searchSolanaNFTsByMintAddresses<
    //   'devnet' | 'mainnet-beta'
    // >({
    //   mint_addresses: mint_addresses.value,
    //   limit: 10,
    //   offset: 0,
    // });
    const result =
      await mirrorworld.value.searchSolanaNFTsByMintAddresses<'devnet'>(
        payload.value
      );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
