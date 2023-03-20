<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm">
        Search NFTs by Creator Address
      </c-heading>
      <br />
      <c-form-control>
        <c-form-label font-size="sm" font-weight="bold">
          Creator Addresses
        </c-form-label>
        <template v-for="(signature, i) in creator_addresses" :key="i">
          <c-h-stack>
            <c-input
              size="xs"
              :placeholder="signature"
              display="block"
              max-w="300px"
              v-model="creator_addresses[i]"
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
                  creator_addresses = creator_addresses.filter(
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
          @click="() => creator_addresses.push('')"
        >
          Add mint address
        </c-button>
      </c-button-group>
      <c-button
        @click="searchSolanaNFTsByCreatorAddresses"
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
  typeof mirrorworld.value.Solana.Asset.searchNFTsByCreatorAddresses
>[0];

const creator_addresses = ref(['']);

const payload = computed<QuerySolanaAssetMintsStatusPayload>(() => ({
  creators: creator_addresses.value,
  limit: 10,
  offset: 0,
}));

async function searchSolanaNFTsByCreatorAddresses() {
  try {
    // TS Tip
    // ==============
    // You can constrain the types on mainnet and devnet by passing in the generic
    // for example:
    // const result = await mirrorworld.value.searchSolanaNFTsByCreatorAddresses<
    //   'devnet' | 'mainnet-beta'
    // >({
    //   mint_addresses: mint_addresses.value,
    //   limit: 10,
    //   offset: 0,
    // });
    const result =
      await mirrorworld.value.Solana.Asset.searchNFTsByCreatorAddresses<
        'devnet' | 'mainnet-beta'
      >(payload.value);
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
