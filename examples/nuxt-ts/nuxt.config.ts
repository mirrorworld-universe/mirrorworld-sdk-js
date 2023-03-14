import Components from 'unplugin-vue-components/vite';
import { componentResolver } from '@chakra-ui/vue-auto-import';
import { extendTheme } from '@chakra-ui/vue-next';

export default defineNuxtConfig({
  modules: ['@chakra-ui/nuxt-next'],
  vite: {
    plugins: [
      Components({
        resolvers: [componentResolver],
      }),
    ],
  },
  chakra: {
    extendTheme: extendTheme({
      fonts: {
        body: `"DM Sans", sans-serif;`,
        heading: `"DM Sans", sans-serif;`,
      },
      layerStyles: {
        ui: {
          well: {
            p: '3',
            borderColor: 'gray.300',
            borderWidth: '1px',
            borderStyle: 'dashed',
            rounded: 'sm',
          },
        },
      },
    }),
  },
});
