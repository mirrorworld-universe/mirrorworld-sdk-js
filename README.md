# Mirror World Web TypeScript SDK

[Mirror World's](https://mirrorworld.fun/developer) Official TypeScript/JavaScript SDK

## Getting started

1. Create a developer account at https://app.mirrorworld.fun. Create project and create an API Key.
2. Install SDK in your project

```bash
yarn add @mirrorworld/web3.js

#or with npm
npm install @mirrorworld/web3.js
```

## Usage

```ts
import { MirrorWorld, Solana } from '@mirrorworld/web3.js';

const mirrorworld = ref<MirrorWorld>(
  new MirrorWorld({
    apiKey: 'YOUR_SECRET_API_KEY',
    chainConfig: Solana('mainnet-beta'),
  })
);

// Login user with Social Authentication
async function login() {
  const { refreshToken } = await mirrorworld.value.login();
}
```

## Full API Documentation

You can view the documentation for Mirror World SDK for Mobile on our [Official Documentation Site](https://docs.mirrorworld.fun/overview/introduction)

## Features:

1. Authentication
   1. Social Authentication
   2. Login with Email/Password
2. Asset Management
   1. Get current user's NFTs
   2. Mint NFTs
   3. List NFTs
   4. Buy NFTs
   5. Cancel Listing
   6. Update Listing
   7. Transfer NFT
   8. Query NFTs by owners
   9. Query NFTs by creator addresses
   10. Query NFTs by update authorities
   11. Get NFT details
3. Wallet
   1. Get account activity
   2. Get account tokens
   3. Transfer SPL Tokens
   4. Transfer SOL
   5. Transfer MATIC
   6. Transfer BNB

## Get Started Today

1. Go to [Mirror World Developer Dashboard](https://app.mirrorworld.fun) and create a project, create an application.
2. Install Mirror World SDK Demo for Javascript using `yarn install @mirrorworld/web3.js` and start building.

## Community

- **Discord**: [Join Discord](https://mirrorworld.fun/discord)
- **Twitter**: [Follow us](https://twitter.com/joinmirrorworld)
- **Telegram Group**: [Join](https://t.me/mirrorworld_sdk)
- **Telegram Channel**: [Subscribe](https://t.me/mirrorworld_news)

## Licence

Apache 2.0

Copyright (c) 2021 Mirror World Inc.
