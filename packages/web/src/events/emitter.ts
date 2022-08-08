import mitt from 'mitt';
import { MirrorWorldEvents } from '../types/instance';

export const emitter = mitt<MirrorWorldEvents>();
