<template>
  <FunctionalWell>
    <c-stack>
      <c-heading as="h3" font-size="sm"> Query Solana Marketplaces </c-heading>
      <template v-for="key in Object.keys(payload)" :key="key">
        <c-form-control v-if="typeof payload[key] === 'string'">
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
        @click="querySolanaMarketplaces"
        size="sm"
        variant="outline"
        color-scheme="gray"
      >
        Query Marketplaces
      </c-button>
    </c-stack>
  </FunctionalWell>
</template>

<script lang="ts" setup>
import FunctionalWell from '@/components/ui/functional-well.vue';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';
import { isEmpty, omitBy } from 'lodash-es';

const { mirrorworld } = useMirrorWorld();

type QuerySolanaMarketplacesPayload = Parameters<
  typeof mirrorworld.value.querySolanaMarketplaces
>[0];

const payload = reactive<QuerySolanaMarketplacesPayload>({
  name: '',
  client_id: '',
  authority: '',
  auction_house_fee_account: '',
  auction_house_treasury: '',
  treasury_withdrawal_destination: '',
  fee_withdrawal_destination: '',
  requires_sign_off: false,
  can_change_sale_price: false,
  treasury_mint: '',
  seller_fee_basis_points: 100,
});

async function querySolanaMarketplaces() {
  try {
    const result = await mirrorworld.value.querySolanaMarketplaces(
      omitBy(payload, isEmpty)
    );
    console.log('result', result);
    alert(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
</script>
