import { Observable } from './Observable';
import { observableToGenerator } from './observableToGenerator';

export function observe(initialize, fifo = []) {
  return observableToGenerator(new Observable(initialize), fifo);
}
