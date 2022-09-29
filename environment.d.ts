declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      MIRRORWORLD_API_SERVER: string;
      MIRRORWORLD_API_SERVER_ENV: string;
      NODE_ENV: 'development' | 'staging' | 'production' | 'test';
      PORT?: string;
      PWD: string;
    }
  }
}
