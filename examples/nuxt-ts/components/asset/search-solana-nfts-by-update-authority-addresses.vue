<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm">
        Search NFTs by Update Authorities
      </c-heading>
      <br />
      <c-form-control>
        <c-form-label font-size="sm" font-weight="bold">
          Update Authority Addresses
        </c-form-label>
        <template v-for="(signature, i) in update_authorities" :key="i">
          <c-h-stack>
            <c-input
              size="xs"
              :placeholder="signature"
              display="block"
              max-w="300px"
              v-model="update_authorities[i]"
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
                  update_authorities = update_authorities.filter(
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
          @click="() => update_authorities.push('')"
        >
          Add mint address
        </c-button>
      </c-button-group>
      <c-button
        @click="searchSolanaNFTsByUpdateAuthorityAddresses"
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

type SearchSolanaNFTsByUpdateAuthorityAddressesPayload = Parameters<
  typeof mirrorworld.value.Solana.Asset.searchNFTsByUpdateAuthorityAddresses
>[0];

const update_authorities = ref(['']);

const payload = computed<SearchSolanaNFTsByUpdateAuthorityAddressesPayload>(
  () => ({
    update_authorities: update_authorities.value,
    limit: 10,
    offset: 0,
  })
);

async function searchSolanaNFTsByUpdateAuthorityAddresses() {
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
      await mirrorworld.value.Solana.Asset.searchNFTsByUpdateAuthorityAddresses<
        'devnet' | 'mainnet-beta'
      >(payload.value);
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
