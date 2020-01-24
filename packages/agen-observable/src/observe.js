import { getGlobal } from '@agen/ns';
import { observableToGenerator } from './observableToGenerator';

export function observe(initialize, fifo = []) {
  const Observable = getGlobal('Observable');
  return observableToGenerator(new Observable(initialize), fifo);
}
