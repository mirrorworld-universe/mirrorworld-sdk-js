export const useReact = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('react');
  }
  return a + b;
};
