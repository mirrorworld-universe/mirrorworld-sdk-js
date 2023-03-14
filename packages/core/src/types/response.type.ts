export type IResponse<T> = {
  data: T;
  message: string;
  status: 'success' | 'fail';
  code: 0 | number;
};

export type IPaginatedResponse<T> = {
  data: {
    data: T;
    count: number;
    page: number;
    total_pages: number;
  };
  message: string;
  status: 'success' | 'fail';
  code: 0 | number;
};
