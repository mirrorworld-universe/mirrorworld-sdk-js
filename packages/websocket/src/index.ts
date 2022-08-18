import { Channel, Socket, SocketConnectOption } from 'phoenix';

type ClusterEnvironment = 'mainnet' | 'testnet' | 'devnet';
type EventCallback = (response?: any) => void;

export interface WebsocketOptions {
  clientId: string;
  apiKey: string;
  env: ClusterEnvironment;
  customSocketUrl?: string;
  socketConnectOptions?: SocketConnectOption;
}

class Websocket {
  _clientId: string;
  _apiKey: string;
  _env: ClusterEnvironment;
  _network: ClusterEnvironment;
  _url: string;
  _socket: Socket;
  _marketChannel: Channel;

  constructor(options: WebsocketOptions) {
    this._env = options.env;
    this._clientId = options.clientId;
    this._apiKey = options.apiKey;
    this._network = this.network;
    this._url = this.url(options.customSocketUrl);

    const socketOptions = options.socketConnectOptions || {};
    this._socket = new Socket(this._url, {
      ...socketOptions,
      params: { apiKey: this._apiKey, clientId: this._clientId },
    });
    this._marketChannel = this._socket.channel('market');
  }

  private get network(): ClusterEnvironment {
    return this._env === 'mainnet' ? 'mainnet' : 'devnet';
  }

  private url(customUrl?: string): string {
    if (customUrl) return customUrl;
    return this._network === 'devnet'
      ? 'wss://devnet-ws.mirrorworld.fun/'
      : 'wss://mainnet-ws.mirrorworld.fun/';
  }

  public get socket(): Socket {
    return this._socket;
  }

  public get channel(): Channel {
    return this._marketChannel;
  }

  public connect(): void {
    this._socket.connect();
    this._marketChannel.join();
  }

  public onEvent(event: string, callback: EventCallback): number {
    return this._marketChannel.on(event, callback);
  }

  public offEvent(event: string, ref: number): void {
    return this._marketChannel.off(event, ref);
  }
}

export default Websocket;
