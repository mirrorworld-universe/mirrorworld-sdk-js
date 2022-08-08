export interface MyLibOptions {
  appId: string;
  apiToken: string;
}

export interface MyLibInitializationOptions {
  nodeId: string;
}

export interface MyLibNode {
  name: string;
  id: string;
}

export type MyLibNodeMessageType = 'text' | 'photo' | 'video' | 'audio';

export interface MyLibNodeResponse {
  message: string;
  type: MyLibNodeMessageType;
  payload: any;
}

interface MyLibEventPayloadMap {
  message: MyLibNodeResponse;
}

type MyLibListenerUnregister = () => void;
type MyLibListernersHandler = {
  id: number;
  event: keyof MyLibEventPayloadMap;
  handler: (payload: MyLibNodeResponse) => void;
};

class MyLib {
  appId: MyLibOptions['appId'];
  apiToken: MyLibOptions['apiToken'];
  connectedNodes: MyLibNode[];
  listeners: MyLibListernersHandler[];

  constructor(options: MyLibOptions) {
    this.appId = options.appId;
    this.apiToken = options.apiToken;
    this.connectedNodes = [];
    this.listeners = [];
    return this;
  }

  /** Get current MyLib instance */
  get application(): string {
    return this.appId;
  }

  /** Get current MyLib instance */
  get nodes(): MyLibNode[] {
    return this.connectedNodes || [];
  }

  /** Adds two numbers */
  sum(a: number, b: number): number {
    return a + b;
  }

  /** Get current MyLib instance */
  public init(options: MyLibInitializationOptions): Promise<MyLib> {
    return new Promise((resolve) => {
      console.log('Initialization options', options);

      setTimeout(() => {
        const node: MyLibNode = {
          id: 'foo2-235-34',
          name: 'Annoying Elon Musk',
        };

        this.connectedNodes.push(node);

        resolve(this);
      }, 1000);
    });
  }

  public sendMessage(message: string): Promise<string> {
    return new Promise((resolve) => {
      console.log('Message body', message);

      // This should get a response from MyLib API
      setTimeout(() => {
        resolve(message);

        setTimeout(() => {
          this.invoke('message', {
            message: 'Response from bot: Hello world!',
            type: 'text',
            payload: {},
          });
        }, 500);
      }, 1000);
    });
  }

  private invoke(
    listener: keyof MyLibEventPayloadMap,
    payload?: MyLibNodeResponse
  ) {
    const targetHandlers = this.listeners.filter(
      (handler) => handler.event === listener
    );
    for (let i = 0; i < length; i++) {
      targetHandlers[i]?.handler(payload!);
    }
  }

  public on(
    medusaNodeEvent: keyof MyLibEventPayloadMap,
    handler: MyLibListernersHandler['handler']
  ): () => void {
    const _handler: MyLibListernersHandler = {
      id: this.listeners.length,
      event: medusaNodeEvent,
      handler: handler,
    };

    this.listeners.push(_handler);

    const unregister = () => {
      const handlerIndex = this.listeners.findIndex(
        (handler) => handler.id === _handler.id
      );
      if (handlerIndex > -1) {
        this.listeners.splice(handlerIndex, 1);
      }
    };

    return unregister;
  }
}

export default MyLib;
