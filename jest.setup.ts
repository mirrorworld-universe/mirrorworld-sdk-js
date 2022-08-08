import { config } from 'dotenv-defaults';
import { resolve } from 'path';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    export interface ProcessEnv {
      MIRRORWORLD_API_SERVER: string;
      CLIENT_ID: string;
      API_KEY: string;
      NODE_ENV: 'development' | 'staging' | 'production';
    }
  }
}

const environmentVariablesPath: Record<typeof process.env.NODE_ENV, string> = {
  development: './.env.development',
  staging: './.env.staging',
  production: './.env.production',
};

config({
  debug: true,
  path: resolve(__dirname, environmentVariablesPath[process.env.NODE_ENV]),
});
