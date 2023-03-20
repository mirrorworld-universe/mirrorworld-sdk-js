import { ref, readonly, Ref } from 'vue';
import {
  MirrorWorld,
  ClusterEnvironment,
  Solana,
  Polygon,
  ChainConfig,
  ChainTypes,
  IUser,
} from '@mirrorworld/web3.js';
import { AnyFn } from '@vueuse/core';
import { canUseDom } from '@/utils';




// excellence@jbakebwa.dev
const SECRET_ACCESS_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nzc3OCwiZXRoX2FkZHJlc3MiOiIweEI5MzVDNDlFMjc4MTE3MUU2Njg5MkNkOEE0QTMxNjE3NTZEMEFlMzIiLCJzb2xfYWRkcmVzcyI6IkdMTnlmckhvNjhieWJTa2RndkRRMnk4TUNWUjhrNlJNSHdmRDJIWW5tMUF5IiwiZW1haWwiOiJleGNlbGxlbmNlQGpiYWtlYndhLmRldiIsIndhbGxldCI6eyJldGhfYWRkcmVzcyI6IjB4QjkzNUM0OUUyNzgxMTcxRTY2ODkyQ2Q4QTRBMzE2MTc1NkQwQWUzMiIsInNvbF9hZGRyZXNzIjoiRkJYbTgzSHZ0SDM0blIzY3F5QWV0b1haTXRnbnR2TnFqZGZGeXZRRkppMVYifSwiY2xpZW50X2lkIjoiNHNpdzN3czBtTVlIbm1kLTlJZDNpbW9rMGxKeDZZdVd2dzA0Lm9mZDFsZmMyLm1pcnJvcndvcmxkLmZ1biIsInR5cGUiOiJzZWNyZXRfYWNjZXNzX2tleSIsImlhdCI6MTY3OTAzNjMyMywiZXhwIjoxNjgxNjI4MzIzLCJpc3MiOiI0c2l3M3dzMG1NWUhubWQtOUlkM2ltb2swbEp4Nll1V3Z3MDQub2ZkMWxmYzIubWlycm9yd29ybGQuZnVuIiwianRpIjoic2FrOjc3Nzg6YXV0aDozMDkifQ.OGi8ykGWl_LRN2z8D3kF7IKQBjOxVwGy5X6Jzq1xtsU';

// // jbakebwa@gmail.com
//   const SECRET_ACCESS_KEY =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA3MjEsImV0aF9hZGRyZXNzIjoiMHg3ODY5YUI3RUZmMTU2NjY5ZGY2NDk5MkViMTllNTE4NjEwZjM5MjQwIiwic29sX2FkZHJlc3MiOiI3S2ZUZHpqZld3OEc1TXlZejd0ZnYzWTlEY252WTFGSldSaGNSMnplSmpBMSIsImVtYWlsIjoiamJha2Vid2FAZ21haWwuY29tIiwid2FsbGV0Ijp7ImV0aF9hZGRyZXNzIjoiMHg3ODY5YUI3RUZmMTU2NjY5ZGY2NDk5MkViMTllNTE4NjEwZjM5MjQwIiwic29sX2FkZHJlc3MiOiI3S2ZUZHpqZld3OEc1TXlZejd0ZnYzWTlEY252WTFGSldSaGNSMnplSmpBMSJ9LCJjbGllbnRfaWQiOiJlYmNmZjc5YS0yODJmLTExZWQtOWJjNS0wZTFiYTdhZjE5MmQuZWJjZmY3YWUubWlycm9yd29ybGQuZnVuIiwidHlwZSI6InNlY3JldF9hY2Nlc3Nfa2V5IiwiaWF0IjoxNjc4ODYwMTM3LCJleHAiOjE2ODE0NTIxMzcsImlzcyI6ImViY2ZmNzlhLTI4MmYtMTFlZC05YmM1LTBlMWJhN2FmMTkyZC5lYmNmZjdhZS5taXJyb3J3b3JsZC5mdW4iLCJqdGkiOiJzYWs6MTA3MjE6YXV0aDozMDQifQ.VhL5Sc_WY-U9xmr7MrJwwxq-2iDCyDpgl_kHgJbihLI';

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
const __chainConfig = Polygon('mumbai-testnet');

const autoLoginCredentials = canUseDom
  ? localStorage.getItem(`app-refresh-token`)
  : undefined;

let __mirrorworld: MirrorWorld;

function createMirrorWorld() {
  return new MirrorWorld({
    // apiKey: "mw_4UBrXhk4sCp40pMO98FWk8eMkbGpk5dyMKB",
    apiKey: 'mw_oEW0ZFiiPewhvktSKU1uJi3ZqyfTSHLtzd3',
    env: ClusterEnvironment.mainnet,
    // staging: true,
    chainConfig: __chainConfig,
    ...(!!autoLoginCredentials && { autoLoginCredentials }),
    //  walletUIConfig: {
    //   uxMode: "popup"
    //  }
    auth: {
      secretAccessKey: SECRET_ACCESS_KEY,
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
