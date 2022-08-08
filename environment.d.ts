declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      MIRRORWORLD_API_SERVER: string;
      NODE_ENV: 'development' | 'staging' | 'production' | 'test';
      PORT?: string;
      PWD: string;
    }
  }
}
