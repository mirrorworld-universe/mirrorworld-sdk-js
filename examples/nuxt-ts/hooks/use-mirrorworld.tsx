import { ref, readonly, Ref } from 'vue';
import {
  MirrorWorld,
  ClusterEnvironment,
  Polygon,
  ChainConfig,
  ChainTypes,
  IUser,
  Sui,
  Solana,
} from '@mirrorworld/web3.js';
import { AnyFn } from '@vueuse/core';
import { canUseDom } from '@/utils';

// const SECRET_ACCESS_KEY = 'YOUR_SECRET_ACCESS_KEY';

function forcePurgeClientStorage() {
  console.debug('call:forcePurgeClientStorage:useMirrorWorld');
  if (!canUseDom) return;
  const purgeClientStorageKey = `_____FORCE_CLIENT_PURGE_____`;
  const __purged__ = localStorage.getItem(purgeClientStorageKey);
  if (!__purged__) {
    console.debug('Purging client storage');
    localStorage.clear();
    localStorage.setItem(purgeClientStorageKey, 'true');
  }
}

forcePurgeClientStorage();

export const [MirrorWorldProviderFn, useMirrorWorld] =
  createContext<MirrorWorldContext>('MirrorWorldContext');

export interface MirrorWorldContext {
  mirrorworld: Ref<MirrorWorld>;
  login: AnyFn;
  user: Readonly<Ref<IUser | undefined>>;
  logout: VoidFunction;
}

// const __chainConfig = Solana('devnet');
// const __chainConfig = Polygon('mumbai-testnet');
const __chainConfig = Sui('testnet');

const autoLoginCredentials = canUseDom
  ? localStorage.getItem(`app-refresh-token`)
  : undefined;

let __mirrorworld: MirrorWorld;

function createMirrorWorld() {
  console.log("=======createMirrorWorld=======");
  return new MirrorWorld({
    // apiKey: "mw_4UBrXhk4sCp40pMO98FWk8eMkbGpk5dyMKB",
    // apiKey: 'mw_oEW0ZFiiPewhvktSKU1uJi3ZqyfTSHLtzd3',
    apiKey:"mw_TaIB0eljYJZXsXrxpdOXvAkA4XyCuUGxNWp",
    env: ClusterEnvironment.testnet,
    // staging: true,
    chainConfig: __chainConfig,
    ...(!!autoLoginCredentials && { autoLoginCredentials }),
    //  walletUIConfig: {
    //   uxMode: "popup"
    //  }
    auth: {
      // secretAccessKey: SECRET_ACCESS_KEY,
    },
  });
}

function tryCreateMirrorWorld() {
  try {
    return createMirrorWorld();
  } catch (error) {
    console.error(error);
    return createMirrorWorld();
  }
}

try {
  __mirrorworld = createMirrorWorld();
} catch (error) {
  console.error(error);
  __mirrorworld = tryCreateMirrorWorld();
}

__mirrorworld.on('auth:refreshToken', async (refreshToken) => {
  console.debug('app: refresh token', refreshToken);
  if (canUseDom && refreshToken) {
    try {
      await localStorage.setItem(`app-refresh-token`, refreshToken!);
      await __mirrorworld.fetchUser();
    } catch (error) {
      console.warn('Error handling fetch user on refresh token', error);
    }
  }
});

export const MirrorWorldProvider = defineComponent((_, { slots }) => {
  const chainConfig = ref<ChainConfig<ChainTypes>>(__chainConfig);

  const mirrorworld = ref<MirrorWorld>(__mirrorworld);

  const _user = ref<IUser>();
  const user = computed(() => _user.value);
  __mirrorworld.on('update:user', async (user) => {
    _user.value = user;
  });

  // Login
  async function login() {
    try {
      const { refreshToken, user } = await mirrorworld.value.login();
      console.log(refreshToken, user);
      localStorage.setItem(`app-refresh-token`, refreshToken);
    } catch (e) {
      console.error(e);
    }
  }

  function logout() {
    if (!canUseDom) return;
    mirrorworld.value.logout();
    localStorage.removeItem(`app-refresh-token`);
    localStorage.clear();
    _user.value = undefined;
  }

  MirrorWorldProviderFn({
    mirrorworld: mirrorworld as Ref<MirrorWorld>,
    login,
    user: readonly(_user),
    logout,
  });

  return () => <>{slots.default?.()}</>;
});
