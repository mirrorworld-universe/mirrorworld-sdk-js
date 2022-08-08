export enum TestServer {
  local = process.env.DEVELOPMENT_API_SERVER,
}

export enum TestEnvironment {
  development = 'localhost',
  staging = 'staging',
  production = 'production',
}

export function createServer(environment: TestEnvironment) {}
