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
        v-if="getTokensRes"
        v-html="tokens"
        style="white-space: pre-wrap; max-height: 300px; overflow: scroll"
      />
    </div>
    <br />
    <div>
      <h2>Get NFTs</h2>
      <button @click="getNFTs">Get NFTs</button>
      <pre
        v-if="getNFTsRes"
        v-html="nfts"
        style="white-space: pre-wrap; max-height: 300px; overflow: scroll"
      />
    </div>
    <br />
    <div>
      <h2>Get transactions</h2>
      <button @click="getTransactions">Get transactions</button>
      <pre
        v-if="getTransactionRes"
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
import { computed, onBeforeMount, ref } from "vue";
// import { MirrorWorld, ClusterEnvironment, Solana } from "@mirrorworld/web3.js";
import { useMirrorWorld } from '@/hooks/use-mirrorworld';
//@ts-ignore
import formatHighlight from "json-format-highlight";
import { ClusterEnvironment, Solana, MirrorWorld } from "@usemirrorworld/web3.js";

var env = ClusterEnvironment.testnet
var chainConfig = Solana('devnet')
var apiKey = "mw_YGPw4YIh4ZWtBYVRjpsTIloaB2oa5sJQsGM"
//use this before 0712
// const mirrorworld = ref<MirrorWorld>(
//   new MirrorWorld({
//     apiKey: apiKey,
//     env: env,
//     chainConfig: chainConfig,
//   })
// );
//Use this for testing
const { mirrorworld } = useMirrorWorld();

const user = computed(() =>
  formatHighlight(JSON.stringify(mirrorworld.value.user, null, 2))
);
const tokens = computed(() =>
  formatHighlight(JSON.stringify(getTokensRes.value))
);
const transactions = computed(() =>
  formatHighlight(JSON.stringify(getTransactionRes.value, null, 2))
);
const nfts = computed(() =>
  formatHighlight(JSON.stringify(getNFTsRes.value, null, 2))
);

async function login() {
  try {
    const { refreshToken } = await mirrorworld.value.login();
    localStorage.setItem(`app-refresh-token`, refreshToken);
  } catch (e) {
    console.error(e);
  }
}

const getTokensRes = ref();
async function getTokens() {
  getTokensRes.value = await mirrorworld.value.Solana.Wallet.fetchTokens();
}

const getTransactionRes = ref();
async function getTransactions() {
  getTransactionRes.value = await mirrorworld.value.Solana.Wallet.fetchTransactions();
}

const getNFTsRes = ref();
async function getNFTs() {
  getNFTsRes.value = await mirrorworld.value.Solana.Asset.searchNFTsByOwnerAddresses({
    owners: [mirrorworld.value.user.wallet.sol_address],
    limit: 10,
    offset: 0,
  });
}

const transferResult = ref();
const transferPayload = reactive({
  recipientAddress: "",
  amount: 0,
  tokenMint: "",
  tokenDecimals: 6
});
const parsedTransferResult = computed(() =>
  formatHighlight(JSON.stringify(transferResult.value, null, 2))
);
async function transferSPLToken() {
  transferResult.value = await mirrorworld.value.Solana.Wallet.transferSPLToken(
    {
      to_publickey: transferPayload.recipientAddress,
      amount: transferPayload.amount,
      token_mint: transferPayload.tokenMint,
      decimals: transferPayload.tokenDecimals
    }
  );
}

const transferSOLResult = ref();
const transferSOLPayload = reactive({
  recipientAddress: "",
  amount: 0,
});
const parsedTransferSOLResult = computed(() =>
  formatHighlight(JSON.stringify(transferSOLResult.value, null, 2))
);
async function transferSOL() {
  transferSOLResult.value = await mirrorworld.value.Solana.Wallet.transferSol(
    {
      to_publickey: transferSOLPayload.recipientAddress,
      amount: transferSOLPayload.amount
    }
  );
}

const createVerifiedCollectionResult = ref();
const createVerifiedCollectionPayload = reactive({
  name: "",
  symbol: "",
  metadataUri: "https://metadata-assets.mirrorworld.fun/mirror_jump/metadata/1001.json",
});
const parsedCreateVerifiedCollection = computed(() =>
  formatHighlight(JSON.stringify(createVerifiedCollectionResult.value, null, 2))
);
async function createVerifiedCollection() {
  createVerifiedCollectionResult.value =
    await mirrorworld.value.Solana.Asset.createVerifiedCollection(
      {
        name: createVerifiedCollectionPayload.name,
        symbol: createVerifiedCollectionPayload.symbol,
        url: createVerifiedCollectionPayload.metadataUri
      }
    );
}

const mintNFTResult = ref();
const mintNFTPayload = reactive({
  name: "",
  symbol: "",
  metadataUri: "https://mirrormetaplextest.s3.amazonaws.com/assets/15976.json",
  collection: "",
});
const parsedNFT = computed(() =>
  formatHighlight(JSON.stringify(mintNFTResult.value, null, 2))
);
async function mintNFT() {
  mintNFTResult.value = await mirrorworld.value.Solana.Asset.mintNFT({
    name: mintNFTPayload.name,
    symbol: mintNFTPayload.symbol,
    url: mintNFTPayload.metadataUri,
    collection_mint: mintNFTPayload.collection
  });
}

const updateNFTResult = ref();
const updateNFTPayload = reactive({
  name: "",
  symbol: "",
  metadataUri: "https://mirrormetaplextest.s3.amazonaws.com/assets/15976.json",
  mintAddress: "",
  updateAuthority: "",
  sellerFeeBasisPoints: 100,
});

const _updateNFTPayload = computed(() => ({
  ...updateNFTPayload,
  updateAuthority:
    updateNFTPayload.updateAuthority === ""
      ? undefined
      : updateNFTPayload.updateAuthority,
}));

const parsedUpdateNFT = computed(() =>
  formatHighlight(JSON.stringify(updateNFTResult.value, null, 2))
);
async function updateNFT() {
  updateNFTResult.value = await mirrorworld.value.Solana.Asset.updateNFTMetadata(
    {
        /**  The mint address of the NFT */
      mint_address:  _updateNFTPayload.value.mintAddress,
      /**  The url of the NFT's json config */
      url:  _updateNFTPayload.value.metadataUri,
      /**  The seller fee basis points of the NFT */
      seller_fee_basis_points:  _updateNFTPayload.value.sellerFeeBasisPoints,
      /**  The name of the NFT */
      name:  _updateNFTPayload.value.name,
      /**  The symbol of the NFT */
      symbol:  _updateNFTPayload.value.symbol,
      /**  The update authority of the NFT */
      update_authority:  _updateNFTPayload.value.updateAuthority
    }
   
  );
}

const transferNFTResult = ref();
const transferNFTPayload = reactive({
  mintAddress: "",
  recipientAddress: "",
});
const parsedTransferNFTResult = computed(() =>
  formatHighlight(JSON.stringify(transferNFTResult.value, null, 2))
);
async function transferNFT() {
  transferNFTResult.value = await mirrorworld.value.Solana.Asset.transferNFT(
    {
      mint_address: transferNFTPayload.mintAddress,
      to_wallet_address: transferNFTPayload.recipientAddress
    }
  );
}

const listNFTResult = ref();
const listNFTPayload = reactive({
  mintAddress: "",
  price: 1,
  auctionHouse: "",
});

const _listNFTPayload = computed(() => ({
  ...listNFTPayload,
  auctionHouse:
    listNFTPayload.auctionHouse === ""
      ? undefined
      : listNFTPayload.auctionHouse,
}));

const parsedListNFTResult = computed(() =>
  formatHighlight(JSON.stringify(listNFTResult.value, null, 2))
);
async function listNFT() {
  listNFTResult.value = await mirrorworld.value.Solana.Asset.listNFT(
    {
      mint_address: _listNFTPayload.value.mintAddress,
      price: _listNFTPayload.value.price,
      auction_house: _listNFTPayload.value.auctionHouse,
    });
}

const buyNFTResult = ref();
const buyNFTPayload = reactive({
  mintAddress: "",
  price: 1,
  auctionHouse: "",
});

const _buyNFTPayload = computed(() => ({
  ...buyNFTPayload,
  auctionHouse:
    buyNFTPayload.auctionHouse === "" ? undefined : buyNFTPayload.auctionHouse,
}));

const parsedBuyNFTResult = computed(() =>
  formatHighlight(JSON.stringify(buyNFTResult.value, null, 2))
);
async function buyNFT() {
  buyNFTResult.value = await mirrorworld.value.Solana.Asset.buyNFT(
    {
      mint_address: _buyNFTPayload.value.mintAddress,
      price: _buyNFTPayload.value.price,
      auction_house: _buyNFTPayload.value.auctionHouse,
    }  
  );
}

const updateListingResult = ref();
const updateListingPayload = reactive({
  mintAddress: "",
  price: 1,
  auctionHouse: "",
});

const _updateListingPayload = computed(() => ({
  ...updateListingPayload,
  auctionHouse:
    updateListingPayload.auctionHouse === ""
      ? undefined
      : updateListingPayload.auctionHouse,
}));

const parsedUpdateListingResult = computed(() =>
  formatHighlight(JSON.stringify(updateListingResult.value, null, 2))
);
async function updateListing() {
  updateListingResult.value = await mirrorworld.value.Solana.Asset.listNFT(
    {
      mint_address: _updateListingPayload.value.mintAddress,
      price: _updateListingPayload.value.price,
      auction_house: _updateListingPayload.value.auctionHouse
    }
    
  );
}

const cancelListingResult = ref();
const cancelListingPayload = reactive({
  mintAddress: "",
  price: 1,
  auctionHouse: "",
});

const _cancelListingPayload = computed(() => ({
  ...cancelListingPayload,
  auctionHouse:
    cancelListingPayload.auctionHouse === ""
      ? undefined
      : cancelListingPayload.auctionHouse,
}));

const parsedCancelListingResult = computed(() =>
  formatHighlight(JSON.stringify(cancelListingResult.value, null, 2))
);
async function cancelListing() {
  cancelListingResult.value = await mirrorworld.value.Solana.Asset.cancelListing(
    {
      mint_address: _cancelListingPayload.value.mintAddress,
      price: _cancelListingPayload.value.price,
      auction_house: _cancelListingPayload.value.auctionHouse
    }
  );
}

const createMarketplaceResult = ref();
const createMarketplacePayload = reactive({
  treasuryMint: "",
  sellerFeeBasisPoints: 200,
});

const _createMarketplacePayload = computed(() => ({
  ...createMarketplacePayload,
  treasuryMint:
    createMarketplacePayload.treasuryMint === ""
      ? undefined
      : createMarketplacePayload.treasuryMint,
}));

const parsedCreateMarketplaceResult = computed(() =>
  formatHighlight(JSON.stringify(createMarketplaceResult.value, null, 2))
);
async function createMarketplace() {
  createMarketplaceResult.value = await mirrorworld.value.Solana.Asset.createMarketplace(
    {
      treasury_mint: _createMarketplacePayload.value.treasuryMint,
      seller_fee_basis_points: _createMarketplacePayload.value.sellerFeeBasisPoints
    }
    
  );
}

async function logout() {
  if (mirrorworld.value.user) {
    console.debug("logout user");
    await mirrorworld.value.logout();
  }
}

// onBeforeMount(() => {
//   const refreshToken = localStorage.getItem(`app-refresh-token`);
//   if (refreshToken) {
//     mirrorworld.value = new MirrorWorld({
//       apiKey: apiKey,
//     env: env,
//     chainConfig: chainConfig,
//       autoLoginCredentials: refreshToken,
//     });
//     mirrorworld.value.on("auth:refreshToken", async (refreshToken) => {
//       await localStorage.setItem(`app-refresh-token`, refreshToken);
//       await mirrorworld.value.fetchUser();
//     });
//   } else {
//     mirrorworld.value = new MirrorWorld({
//       apiKey: apiKey,
//     env: env,
//     chainConfig: chainConfig,
//     });
//   }
// });
</script>
