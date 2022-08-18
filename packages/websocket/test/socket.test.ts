import Websocket from '../src';

const apiKey = process.env.API_KEY!;
const clientId = process.env.CLIENT_ID!;

describe('Core SDK tests', () => {
  let _instance: Websocket;
  beforeAll(() => {
    _instance = new Websocket({
      apiKey,
      clientId,
      env: 'devnet',
    });
  });

  it('Create Websocket Connection', async () => {
    _instance.socket.onOpen(() => console.log('Socket connected'));
    _instance.socket.onError((error) => console.error('Socket error: ', error));

    const ref = _instance.onEvent(
      `user_market_update:${'userWalletAddress'}`,
      (data) => console.log(data)
    );
    expect(typeof ref).toEqual('number');

    _instance.offEvent(`user_market_update:${'userWalletAddress'}`, ref);
  });
});
