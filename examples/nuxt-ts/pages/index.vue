<template>
  <main style="padding: 60px">
    <h1>Mirror World SDK Demo</h1>
    <div>
      <h2>Login</h2>
      <button @click="login">Login</button>
      <pre v-if="user" v-html="user" style="white-space: pre-wrap" />
    </div>
    <br />
    <div>
      <h2>Get tokens</h2>
      <button @click="getTokens">Get tokens</button>
      <pre
        v-if="mirrorworld.tokens"
        v-html="tokens"
        style="white-space: pre-wrap; max-height: 300px; overflow: scroll"
      />
    </div>
    <br />
    <div>
      <h2>Get NFTs</h2>
      <button @click="getNFTs">Get NFTs</button>
      <pre
        v-if="mirrorworld.nfts"
        v-html="nfts"
        style="white-space: pre-wrap; max-height: 300px; overflow: scroll"
      />
    </div>
    <br />
    <div>
      <h2>Get transactions</h2>
      <button @click="getTransactions">Get transactions</button>
      <pre
        v-if="mirrorworld.transactions"
        v-html="transactions"
        style="white-space: pre-wrap; max-height: 300px; overflow: scroll"
      />
    </div>
    <br />
    <div>
      <h2>TransferSPLToken</h2>
      <button @click="transferSPLToken">TransferSPLToken</button>
      <label style="display: block"
        >recipientAddress:
        <input
          v-model="transferPayload.recipientAddress"
          placeholder="recipientAddress"
      /></label>
      <label style="display: block"
        >amount:
        <input
          v-model="transferPayload.amount"
          type="number"
          placeholder="amount"
      /></label>
      <label style="display: block"
        >tokenMint:
        <input v-model="transferPayload.tokenMint" placeholder="tokenMint"
      /></label>
      <label style="display: block"
        >tokenDecimals:
        <input
          v-model="transferPayload.tokenDecimals"
          type="number"
          placeholder="tokenDecimals"
      /></label>
      <pre
        v-if="transferResult"
        v-html="parsedTransferResult"
        style="white-space: pre-wrap"
      />
    </div>
    <br />
    <div>
      <h2>Transfer SOL</h2>
      <button @click="transferSOL">Transfer SOL</button>
      <label style="display: block"
        >recipientAddress:
        <input
          v-model="transferSOLPayload.recipientAddress"
          placeholder="recipientAddress"
      /></label>
      <label style="display: block"
        >amount:
        <input
          v-model="transferSOLPayload.amount"
          type="number"
          placeholder="amount"
      /></label>
      <pre
        v-if="transferSOLResult"
        v-html="parsedTransferSOLResult"
        style="white-space: pre-wrap"
      />
    </div>
    <br />
    <div>
      <h2>Create verified collection</h2>
      <button @click="createVerifiedCollection">
        Create verified collection
      </button>
      <label style="display: block"
        >name:
        <input
          v-model="createVerifiedCollectionPayload.name"
          placeholder="name"
      /></label>
      <label style="display: block"
        >symbol:
        <input
          v-model="createVerifiedCollectionPayload.symbol"
          placeholder="symbol"
      /></label>
      <label style="display: block"
        >metadataUri:
        <input
          v-model="createVerifiedCollectionPayload.metadataUri"
          placeholder="metadataUri"
      /></label>
      <pre
        v-if="createVerifiedCollectionResult"
        v-html="parsedCreateVerifiedCollection"
        style="white-space: pre-wrap"
      />
    </div>
    <br />
    <div>
      <h2>Mint NFT into collection</h2>
      <button @click="mintNFT">Mint NFT into collection</button>
      <label style="display: block"
        >name: <input v-model="mintNFTPayload.name" placeholder="name"
      /></label>
      <label style="display: block"
        >symbol: <input v-model="mintNFTPayload.symbol" placeholder="symbol"
      /></label>
      <label style="display: block"
        >metadataUri:
        <input v-model="mintNFTPayload.metadataUri" placeholder="metadataUri"
      /></label>
      <label style="display: block"
        >collection:
        <input v-model="mintNFTPayload.collection" placeholder="collection"
      /></label>
      <pre
        v-if="mintNFTResult"
        v-html="parsedNFT"
        style="white-space: pre-wrap"
      />
    </div>
    <br />
    <div>
      <h2>Update NFT Metadata</h2>
      <button @click="updateNFT">Update NFT Metadata</button>
      <label style="display: block"
        >mintAddress:
        <input
          v-model="updateNFTPayload.mintAddress"
          placeholder="mint_address"
      /></label>
      <label style="display: block"
        >name: <input v-model="updateNFTPayload.name" placeholder="name"
      /></label>
      <label style="display: block"
        >symbol: <input v-model="updateNFTPayload.symbol" placeholder="symbol"
      /></label>
      <label style="display: block"
        >metadataUri:
        <input v-model="updateNFTPayload.metadataUri" placeholder="metadataUri"
      /></label>
      <label style="display: block"
        >sellerFeeBasisPoints:
        <input
          v-model="updateNFTPayload.sellerFeeBasisPoints"
          type="number"
          min="0"
          max="10000"
          placeholder="sellerFeeBasisPoints"
      /></label>
      <label style="display: block"
        >updateAuthority:
        <input
          v-model="updateNFTPayload.updateAuthority"
          placeholder="updateAuthority"
      /></label>
      <pre
        v-if="updateNFTResult"
        v-html="parsedUpdateNFT"
        style="white-space: pre-wrap"
      />
    </div>
    <br />
    <div>
      <h2>Transfer NFT</h2>
      <button @click="transferNFT">Transfer NFT</button>
      <label style="display: block"
        >mintAddress:
        <input
          v-model="transferNFTPayload.mintAddress"
          placeholder="mintAddress"
      /></label>
      <label style="display: block"
        >recipientAddress:
        <input
          v-model="transferNFTPayload.recipientAddress"
          placeholder="recipientAddress"
      /></label>
      <pre
        v-if="transferNFTResult"
        v-html="parsedTransferNFTResult"
        style="white-space: pre-wrap"
      />
    </div>
    <br />
    <div>
      <h2>List NFT</h2>
      <button @click="listNFT">List NFT</button>
      <label style="display: block"
        >mintAddress:
        <input v-model="listNFTPayload.mintAddress" placeholder="mintAddress"
      /></label>
      <label style="display: block"
        >price:
        <input v-model="listNFTPayload.price" type="number" placeholder="price"
      /></label>
      <label style="display: block"
        >auctionHouse(optional):
        <input v-model="listNFTPayload.auctionHouse" placeholder="auctionHouse"
      /></label>
      <pre
        v-if="listNFTResult"
        v-html="parsedListNFTResult"
        style="white-space: pre-wrap"
      />
    </div>
    <br />
    <div>
      <h2>Buy NFT</h2>
      <button @click="buyNFT">Buy NFT</button>
      <label style="display: block"
        >mintAddress:
        <input v-model="buyNFTPayload.mintAddress" placeholder="mintAddress"
      /></label>
      <label style="display: block"
        >price:
        <input v-model="buyNFTPayload.price" type="number" placeholder="price"
      /></label>
      <label style="display: block"
        >auctionHouse(optional):
        <input v-model="buyNFTPayload.auctionHouse" placeholder="auctionHouse"
      /></label>
      <pre
        v-if="buyNFTResult"
        v-html="parsedBuyNFTResult"
        style="white-space: pre-wrap"
      />
    </div>
    <br />
    <div>
      <h2>Update Listing</h2>
      <button @click="updateListing">Update Listing</button>
      <label style="display: block"
        >mintAddress:
        <input
          v-model="updateListingPayload.mintAddress"
          placeholder="mintAddress"
      /></label>
      <label style="display: block"
        >price:
        <input
          v-model="updateListingPayload.price"
          type="number"
          placeholder="price"
      /></label>
      <label style="display: block"
        >auctionHouse(optional):
        <input
          v-model="updateListingPayload.auctionHouse"
          placeholder="auctionHouse"
      /></label>
      <pre
        v-if="updateListingResult"
        v-html="parsedUpdateListingResult"
        style="white-space: pre-wrap"
      />
    </div>
    <br />
    <div>
      <h2>Cancel Listing</h2>
      <button @click="cancelListing">Cancel Listing</button>
      <label style="display: block"
        >mintAddress:
        <input
          v-model="cancelListingPayload.mintAddress"
          placeholder="mintAddress"
      /></label>
      <label style="display: block"
        >price:
        <input
          v-model="cancelListingPayload.price"
          type="number"
          placeholder="price"
      /></label>
      <label style="display: block"
        >auctionHouse(optional):
        <input
          v-model="cancelListingPayload.auctionHouse"
          placeholder="auctionHouse"
      /></label>
      <pre
        v-if="cancelListingResult"
        v-html="parsedCancelListingResult"
        style="white-space: pre-wrap"
      />
    </div>
    <div>
      <h2>Create Marketplace</h2>
      <button @click="createMarketplace">Create Marketplace</button>
      <label style="display: block"
        >sellerFeeBasisPoints:
        <input
          v-model="createMarketplacePayload.sellerFeeBasisPoints"
          type="number"
          placeholder="sellerFeeBasisPoints"
      /></label>
      <label style="display: block"
        >treasuryMint (optional):
        <input
          v-model="createMarketplacePayload.treasuryMint"
          placeholder="treasuryMint"
      /></label>
      <pre
        v-if="createMarketplaceResult"
        v-html="parsedCreateMarketplaceResult"
        style="white-space: pre-wrap"
      />
    </div>
    <div v-if="mirrorworld.user">
      <h2>Logout</h2>
      <button @click="logout">logout</button>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import {
  MirrorWorld,
  ClusterEnvironment,
  Solana,
} from '@usemirrorworld/web3.js';
//@ts-ignore
import formatHighlight from 'json-format-highlight';
import { useMirrorWorld } from '~~/hooks/use-mirrorworld';

const { mirrorworld, logout, login, user: _user } = useMirrorWorld();

const user = computed(() =>
  formatHighlight(JSON.stringify(_user.value, null, 2))
);
const tokens = computed(() =>
  formatHighlight(JSON.stringify(mirrorworld.value.tokens, null, 2))
);
const transactions = computed(() =>
  formatHighlight(JSON.stringify(mirrorworld.value.transactions, null, 2))
);
const nfts = computed(() =>
  formatHighlight(JSON.stringify(mirrorworld.value.nfts, null, 2))
);

async function getTokens() {
  await mirrorworld.value.getTokens();
}

async function getTransactions() {
  await mirrorworld.value.getTransactions();
}

async function getNFTs() {
  await mirrorworld.value.getNFTs({
    limit: 20,
    offset: 0,
  });
}

const transferResult = ref();
const transferPayload = reactive({
  recipientAddress: '',
  amount: 0,
  tokenMint: '',
  tokenDecimals: 6,
});
const parsedTransferResult = computed(() =>
  formatHighlight(JSON.stringify(transferResult.value, null, 2))
);
async function transferSPLToken() {
  transferResult.value = await mirrorworld.value.transferSPLToken(
    transferPayload
  );
}

const transferSOLResult = ref();
const transferSOLPayload = reactive({
  recipientAddress: '',
  amount: 0,
});
const parsedTransferSOLResult = computed(() =>
  formatHighlight(JSON.stringify(transferSOLResult.value, null, 2))
);
async function transferSOL() {
  transferResult.value = await mirrorworld.value.transferSOL(
    transferSOLPayload
  );
}

const createVerifiedCollectionResult = ref();
const createVerifiedCollectionPayload = reactive({
  name: '',
  symbol: '',
  metadataUri: 'https://mirrormetaplextest.s3.amazonaws.com/assets/15976.json',
});
const parsedCreateVerifiedCollection = computed(() =>
  formatHighlight(JSON.stringify(createVerifiedCollectionResult.value, null, 2))
);
async function createVerifiedCollection() {
  createVerifiedCollectionResult.value =
    await mirrorworld.value.createVerifiedCollection(
      createVerifiedCollectionPayload
    );
}

const mintNFTResult = ref();
const mintNFTPayload = reactive({
  name: '',
  symbol: '',
  metadataUri: 'https://mirrormetaplextest.s3.amazonaws.com/assets/15976.json',
  collection: '',
});
const parsedNFT = computed(() =>
  formatHighlight(JSON.stringify(mintNFTResult.value, null, 2))
);
async function mintNFT() {
  mintNFTResult.value = await mirrorworld.value.mintNFT(mintNFTPayload);
}

const updateNFTResult = ref();
const updateNFTPayload = reactive({
  name: '',
  symbol: '',
  metadataUri: 'https://mirrormetaplextest.s3.amazonaws.com/assets/15976.json',
  mintAddress: '',
  updateAuthority: '',
  sellerFeeBasisPoints: 100,
});

const _updateNFTPayload = computed(() => ({
  ...updateNFTPayload,
  updateAuthority:
    updateNFTPayload.updateAuthority === ''
      ? undefined
      : updateNFTPayload.updateAuthority,
}));

const parsedUpdateNFT = computed(() =>
  formatHighlight(JSON.stringify(updateNFTResult.value, null, 2))
);
async function updateNFT() {
  updateNFTResult.value = await mirrorworld.value.updateNFT(
    _updateNFTPayload.value
  );
}

const transferNFTResult = ref();
const transferNFTPayload = reactive({
  mintAddress: '',
  recipientAddress: '',
});
const parsedTransferNFTResult = computed(() =>
  formatHighlight(JSON.stringify(transferNFTResult.value, null, 2))
);
async function transferNFT() {
  transferNFTResult.value = await mirrorworld.value.transferNFT(
    transferNFTPayload
  );
}

const listNFTResult = ref();
const listNFTPayload = reactive({
  mintAddress: '',
  price: 1,
  auctionHouse: '',
});

const _listNFTPayload = computed(() => ({
  ...listNFTPayload,
  auctionHouse:
    listNFTPayload.auctionHouse === ''
      ? undefined
      : listNFTPayload.auctionHouse,
}));

const parsedListNFTResult = computed(() =>
  formatHighlight(JSON.stringify(listNFTResult.value, null, 2))
);
async function listNFT() {
  listNFTResult.value = await mirrorworld.value.listNFT(_listNFTPayload.value);
}

const buyNFTResult = ref();
const buyNFTPayload = reactive({
  mintAddress: '',
  price: 1,
  auctionHouse: '',
});

const _buyNFTPayload = computed(() => ({
  ...buyNFTPayload,
  auctionHouse:
    buyNFTPayload.auctionHouse === '' ? undefined : buyNFTPayload.auctionHouse,
}));

const parsedBuyNFTResult = computed(() =>
  formatHighlight(JSON.stringify(buyNFTResult.value, null, 2))
);
async function buyNFT() {
  buyNFTResult.value = await mirrorworld.value.buyNFT(_buyNFTPayload.value);
}

const updateListingResult = ref();
const updateListingPayload = reactive({
  mintAddress: '',
  price: 1,
  auctionHouse: '',
});

const _updateListingPayload = computed(() => ({
  ...updateListingPayload,
  auctionHouse:
    updateListingPayload.auctionHouse === ''
      ? undefined
      : updateListingPayload.auctionHouse,
}));

const parsedUpdateListingResult = computed(() =>
  formatHighlight(JSON.stringify(updateListingResult.value, null, 2))
);
async function updateListing() {
  updateListingResult.value = await mirrorworld.value.updateNFTListing(
    _updateListingPayload.value
  );
}

const cancelListingResult = ref();
const cancelListingPayload = reactive({
  mintAddress: '',
  price: 1,
  auctionHouse: '',
});

const _cancelListingPayload = computed(() => ({
  ...cancelListingPayload,
  auctionHouse:
    cancelListingPayload.auctionHouse === ''
      ? undefined
      : cancelListingPayload.auctionHouse,
}));

const parsedCancelListingResult = computed(() =>
  formatHighlight(JSON.stringify(cancelListingResult.value, null, 2))
);
async function cancelListing() {
  cancelListingResult.value = await mirrorworld.value.cancelNFTListing(
    _cancelListingPayload.value
  );
}

const createMarketplaceResult = ref();
const createMarketplacePayload = reactive({
  treasuryMint: '',
  sellerFeeBasisPoints: 200,
});

const _createMarketplacePayload = computed(() => ({
  ...createMarketplacePayload,
  treasuryMint:
    createMarketplacePayload.treasuryMint === ''
      ? undefined
      : createMarketplacePayload.treasuryMint,
}));

const parsedCreateMarketplaceResult = computed(() =>
  formatHighlight(JSON.stringify(createMarketplaceResult.value, null, 2))
);
async function createMarketplace() {
  createMarketplaceResult.value = await mirrorworld.value.createMarketplace(
    _createMarketplacePayload.value
  );
}
</script>
