import { Axios } from 'axios';
import { MirrorWorld, MirrorWorldOptions } from '../src';
import { ClusterEnvironment } from '../src/services/cluster';
import { MirrorWorldAPIClient } from '../src/services/api';

const apiServer = process.env.MIRRORWORLD_API_SERVER;
const apiKey = process.env.API_KEY!;
const clientId = process.env.CLIENT_ID!;

const createLoginCredentials = () => {
  return {
    email: 'testaccount4@gmail.com',
    password: 'testaccount4',
  };
};

let _mw: MirrorWorld;
beforeAll(async () => {
  _mw = createInstance();
  await _mw.loginWithEmail(createLoginCredentials());
});

export const createInstance = (options?: Partial<MirrorWorldOptions>) =>
  new MirrorWorld({
    apiKey,
    clientId,
    env:
      process.env.NODE_ENV === 'staging'
        ? ClusterEnvironment.testnet
        : process.env.NODE_ENV === 'production'
        ? ClusterEnvironment.mainnet
        : ClusterEnvironment.local,
  });

describe('Core SDK tests', () => {
  describe('Sanity tests', () => {
    it('should properly create instance of sdk with correct params', () => {
      const mirrorworld = new MirrorWorld({
        apiKey,
        clientId,
        env: ClusterEnvironment.local,
      });
      expect(mirrorworld instanceof MirrorWorld).toBe(true);
    });
    it('should fail when instance is created with incorrect parameters', () => {
      expect.assertions(3);
      expect(() => {
        // @ts-expect-error Missing params
        return new MirrorWorld({
          clientId,
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
      expect(mw._api.client instanceof MirrorWorldAPIClient);
      expect(mw._api.client instanceof Axios);
      expect(mw._api.client.defaults.baseURL).toEqual(apiServer);
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
      const mw = createInstance();
      const credentials = createLoginCredentials();
      await mw.loginWithEmail(credentials);
      const user = await mw.fetchUser();
      expect(user).toBeDefined();
      expect(user).toMatchObject(mw.user!);
    });

    it.skip('should auto login when initialized with `autoLoginCredentials`', () =>
      new Promise<void>(async (resolve) => {
        const mw = createInstance();
        const credentials = createLoginCredentials();
        await mw.loginWithEmail(credentials);
        const authRefreshToken = mw.userRefreshToken;

        expect(authRefreshToken).toBeDefined();

        const mw2 = createInstance({
          autoLoginCredentials: authRefreshToken,
        });
        const refreshTokenCallback = jest.fn(() => {
          expect(refreshTokenCallback).toBeCalled();
          resolve();
        });
        mw2.on('auth:refreshToken', refreshTokenCallback);
      }));
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
    it.todo('should successfully create NFT collection');
    it.todo('should successfully create sub-collection');
    it.todo('should successfully create mint NFT');
    it.todo('should successfully list NFT');
    it.todo('should successfully transfer NFT');
    it.todo('should successfully cancel listing of NFT');
    it.todo('should successfully transfer NFT');
    it.todo('should successfully get user NFTs');
    it.todo('should successfully get query NFT transaction history');
    it.todo('should successfully get query NFT transaction history');
  });
});
