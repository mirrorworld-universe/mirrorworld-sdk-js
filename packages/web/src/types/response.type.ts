export type IResponse<T> = {
  data: T;
  message: string;
  status: 'success' | 'fail';
  code: 0 | number;
};
