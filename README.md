# Mirror World Web TypeScript SDK

[Mirror World's](https://mirrorworld.fun/developer) Official TypeScript/JavaScript SDK

## Getting started
1. Create a developer account at https://app.mirrorworld.fun. Create project and create an API Key.
2. Install SDK in your project

```bash
yarn install @mirrorworld/web3.js
```

## Usage
```ts
import { MirrorWorld, ClusterEnvironment } from "@mirrorworld/web3.js"

const mirrorworld = ref<MirrorWorld>(
  new MirrorWorld({
    apiKey: "YOUR_SECRET_API_KEY",
    env: ClusterEnvironment.testnet, // Can be ClusterEnvionment.mainnet for mainnet
    clientId: "YOUR_CLIENT_ID"
  })
)

// Login user with Social Authentication
async function login() {
  const { refreshToken } = await mirrorworld.value.login()
}
```

## Full API Documentation
You can view the documentation for Mirror World SDK for Mobile on our [Official Documentation Site](https://docs.mirrorworld.fun/web/web-installation)

## Features:
1. Authentication
    1. Social Authentication
    2. Login with Email/Password
2. Marketplace
    1. Mint NFTs
    2. List NFTs
    3. Buy NFTs
    4. Cancel Listing
    5. Update Listing
    6. Transfer NFT
3. Wallet
    1. Get account activity
    2. Get account tokens
    3. Transfer SPL Tokens
    4. Transfer SOL

## Get Started Today
1. Go to [Mirror World Developer Dashboard](https://app.mirrorworld.fun) and create a project, create an application.
2. Install Mirror World SDK Demo for Javascript using `yarn install @mirrorworld/web3.js` and start building.

## Roadmap
See Roadmap here:
1. **Wallet**
   - [-] Transaction signing (In progress)
   - [-] Crypto On-ramping (In progress)
2. **Marketplace**
   - [-] Create Marketplace Instance (In progress)
   - [-] Collection indexing and querying (In progress)
3. **Cross-chain Support**
   - [ ] Ethereum Support
   - [ ] Polygon Support
   - [ ] Aptos Support
   - [ ] Sui Support

## Community
- **Discord**: [Join Discord](https://discord.com/invite/Vxrw4rqaDM)
- **Twitter**: [Follow us](https://twitter.com/joinmirrorworld)
- **Telegram Group**: [Join](https://t.me/mirrorworld_sdk)
- **Telegram Channel**: [Subscribe](https://t.me/mirrorworld_news)

## Licence
MIT License

Copyright (c) 2021 Mirror World Inc.