export const useVue = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('vue');
  }
  return a + b;
};
