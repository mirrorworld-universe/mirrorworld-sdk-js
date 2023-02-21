import mitt from 'mitt';
import { MirrorWorldEvents, WalletUIEvents } from '../types/instance';

export const emitter = mitt<MirrorWorldEvents>();
export const windowEmitter = mitt<WalletUIEvents>();
