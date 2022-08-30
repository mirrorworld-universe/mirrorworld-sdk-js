import axios, { Axios } from 'axios';
import { MirrorWorld, MirrorWorldOptions } from '../src';
import { ClusterEnvironment } from '../src/services/cluster';
import { MirrorWorldAPIClient } from '../src/services/api';
import { collectionSchema } from './utils/schemas';
import { IVerifiedCollection, SolanaCommitment } from '../src/types/nft';
import { random, waitFor } from './utils/timers';

const apiServer = process.env.MIRRORWORLD_API_SERVER;
const apiServiceServer = `${apiServer}/v1/devnet`;
const apiKey = process.env.API_KEY!;
const clientId = process.env.CLIENT_ID!;
jest.setTimeout(60000);
const createLoginCredentials = () => {
  return {
    email: 'testaccount1@gmail.com',
    password: 'testaccount1',
  };
};

async function requestSolAirdrop(address: string) {
  if (process.env.NODE_ENV !== 'staging') {
    return console.warn(
      '[requestSolAirdrop]: Request airdrop is only available on Staging'
    );
  }
  try {
    const response = await axios.post('https://api.devnet.solana.com', {
      jsonrpc: '2.0',
      id: 1,
      method: 'requestAirdrop',
      params: [address, 2000000000],
    });
    return response.data;
  } catch (error: any) {
    console.error('Error requesting SOL airdrop');
  }
}

let _mw: MirrorWorld;
beforeAll(async () => {
  _mw = createInstance();
  await _mw.loginWithEmail(createLoginCredentials());
});

export const createInstance = (options?: Partial<MirrorWorldOptions>) =>
  new MirrorWorld({
    apiKey,
    env: ClusterEnvironment.testnet,
  });

describe('Core SDK tests', () => {
  describe.skip('Sanity tests', () => {
    it('should properly create instance of sdk with correct params', () => {
      const mirrorworld = new MirrorWorld({
        apiKey,
        env: ClusterEnvironment.local,
      });
      expect(mirrorworld instanceof MirrorWorld).toBe(true);
    });
    it('should fail when instance is created with incorrect parameters', () => {
      expect.assertions(3);
      expect(() => {
        // @ts-expect-error Missing params
        return new MirrorWorld({
          env: ClusterEnvironment.local,
        });
      }).toThrow();
      expect(
        () =>
          // @ts-expect-error Missing params
          new MirrorWorld({
            apiKey,
          })
      ).toThrow();
      expect(
        () =>
          // @ts-expect-error Missing params
          new MirrorWorld({
            env: ClusterEnvironment.local,
          })
      ).toThrow();
    });

    it('should initialize api client instance correctly', () => {
      const mw = createInstance();
      expect(mw._api.client).toBeDefined();
      expect(mw._api.sso).toBeDefined();
      expect(mw._api.client instanceof MirrorWorldAPIClient);
      expect(mw._api.client instanceof MirrorWorldAPIClient);
      expect(mw._api.sso instanceof Axios);
      expect(mw._api.sso instanceof Axios);
      expect(mw._api.client.defaults.baseURL).toEqual(apiServiceServer);
      expect(mw._api.sso.defaults.baseURL).toEqual(apiServer);
    });
  });
  describe('Authentication tests', () => {
    it('should successfully login with email and password', async () => {
      const mw = createInstance();
      const credentials = createLoginCredentials();
      const user = await mw.loginWithEmail(credentials);
      expect(user).toBeDefined();
    });

    it('should email login event on successful login', async () => {
      const mw = createInstance();
      const credentials = createLoginCredentials();
      const user = await mw.loginWithEmail(credentials);
      expect(user).toBeDefined();
    });

    it('should emit `login:email` and `login` events on login event on successful login', async () => {
      const mw = createInstance();
      const credentials = createLoginCredentials();
      const loginEmailCallBack = jest.fn();
      const loginCallBack = jest.fn();

      mw.on('login:email', loginEmailCallBack);
      mw.on('login', loginCallBack);
      await mw.loginWithEmail(credentials);

      expect(loginEmailCallBack).toHaveBeenCalledWith(mw.user);
      expect(loginCallBack).toHaveBeenCalledWith(mw.user);
    });

    it('should securely request bind credentials after user login', async () => {
      try {
        const mw = createInstance();
        const credentials = createLoginCredentials();
        await mw.loginWithEmail(credentials);
        const user = await mw.fetchUser();
        expect(user).toBeDefined();
        expect(user).toMatchObject(mw.user!);
      } catch (e) {
        console.error(e);
        expect(e).not.toBeDefined();
      }
    });

    const sleep = (delay = 3000) =>
      new Promise((resolve) => setTimeout(resolve, delay));

    it.skip('should auto login when initialized with `autoLoginCredentials`', async () => {
      const mw = createInstance();
      const credentials = createLoginCredentials();
      await mw.loginWithEmail(credentials);
      const authRefreshToken = mw.userRefreshToken;

      expect(authRefreshToken).toBeDefined();

      const mw2 = createInstance({
        autoLoginCredentials: authRefreshToken,
      });

      // At this time, the user's refresh token should be used
      // to get their user object.
      await sleep(1000);
      expect(mw2.user).toBeDefined();
    });
    it.todo(
      'should successfully sign up with email and password -> executed on UI'
    );
    it('should fail with bad email and password credentials', async () => {
      expect.assertions(1);
      const mw = createInstance();
      const credentials = createLoginCredentials();
      credentials.password = 'noinoi2131@@!3 dome bad password';
      // expect(async () => await mw.loginWithEmail(credentials)).toThrow();
      await mw
        .loginWithEmail(credentials)
        .catch((e) => expect(e).toBeDefined());
    });
    it('should successfully get user object', async () => {
      const mw = createInstance();
      const credentials = createLoginCredentials();
      await mw.loginWithEmail(credentials);
      const user = await mw.fetchUser();
      const wallet = user.wallet;
      expect(user).toBeDefined();
      expect(user).toMatchObject(mw.user!);
      expect(wallet).toMatchObject(mw.wallet!);
    });
  });
  describe('Marketplace tests', () => {
    let globalRootCollection: IVerifiedCollection;
    let globalSubCollection: IVerifiedCollection;

    it('should successfully create NFT collection', async () => {
      const collectionSymbol = `${Math.round(Math.random() * 1000)}`;
      const metadataUri =
        'https://mirrormetaplextest.s3.amazonaws.com/assets/15976.json';

      const collectionPayload = {
        name: `TEST_NFT_${collectionSymbol}`,
        symbol: `TST${collectionSymbol}`,
        metadataUri,
      };
      const collection = await _mw.createVerifiedCollection(
        collectionPayload,
        SolanaCommitment.finalized
      );
      expect(collection).toBeTruthy();
      expect(collectionSchema.validate(collection).error).toBeFalsy();
      expect(collection.name).toEqual(collectionPayload.name);
      expect(collection.url).toEqual(collectionPayload.metadataUri);
      expect(collection.symbol).toEqual(collectionPayload.symbol);
      globalRootCollection = collection;
    });
    it('should successfully create sub-collection', async () => {
      try {
        await waitFor(5000);
        const subCollectionSymbol = `${Math.round(Math.random() * 1000)}`;
        const metadataUri =
          'https://mirrormetaplextest.s3.amazonaws.com/assets/15976.json';

        const subCollectionPayload = {
          name: `TEST_SUB_NFT_${subCollectionSymbol}`,
          symbol: `SUBC${subCollectionSymbol}`,
          metadataUri,
          parentCollection: globalRootCollection.mint_address,
        };

        const subCollection = await _mw.createVerifiedSubCollection(
          subCollectionPayload,
          SolanaCommitment.finalized
        );
        console.log('subCollection', subCollection);
        expect(subCollection).toBeTruthy();
        expect(collectionSchema.validate(subCollection).error).toBeFalsy();
        expect(subCollection.name).toEqual(subCollectionPayload.name);
        expect(subCollection.url).toEqual(subCollectionPayload.metadataUri);
        expect(subCollection.symbol).toEqual(subCollectionPayload.symbol);
        expect(subCollection.collection).toEqual(
          globalRootCollection.mint_address
        );
        globalSubCollection = subCollection;
      } catch (e: any) {
        console.error(e);
        expect(e).toBeFalsy();
      }
    });
    it('should successfully mint into NFT root collection', async () => {
      try {
        await waitFor(5000);
        const mintNFTPayload = {
          name: `TEST_NFT_${random()}`,
          symbol: `SYM${random()}`,
          metadataUri:
            'https://mirrormetaplextest.s3.amazonaws.com/assets/15976.json',
          collection: globalRootCollection.mint_address!,
        };

        const mintNFT = await _mw.mintNFT(mintNFTPayload);
        expect(mintNFT).toBeTruthy();
      } catch (e: any) {
        console.error(e);
        expect(e).toBeFalsy();
      }
    });

    it('should successfully mint into NFT sub collection', async () => {
      try {
        await waitFor(5000);
        const mintNFTPayload = {
          name: `TEST_NFT_${random()}`,
          symbol: `SYM${random()}`,
          metadataUri:
            'https://mirrormetaplextest.s3.amazonaws.com/assets/15976.json',
          collection: globalSubCollection.mint_address!,
        };

        const mintNFT = await _mw.mintNFT(mintNFTPayload);
        expect(mintNFT).toBeTruthy();
      } catch (e: any) {
        console.error(e);
        expect(e).toBeFalsy();
      }
    });
    it.todo('should successfully list NFT');
    it.todo('should successfully transfer NFT');
    it.todo('should successfully buy NFT');
    it.todo('should successfully cancel listing of NFT');
    it.todo('should successfully transfer NFT');
    it.todo('should successfully get user NFTs');
    it.todo('should successfully get query NFT transaction history');
    it.todo('should successfully get query NFT transaction history');
  });
});
