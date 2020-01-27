import { getGlobal, setGlobal } from '@agen/ns';
import { Observable } from './Observable';
export function registerObservable(o) {
  o = o || ((getGlobal('Observable') === undefined) && Observable);
  if (o) setGlobal('Observable', o);
  return o;
}
export default registerObservable();

export * from './observe';
export * from './subscribe';
export * from './merge';
export * from './Observable';
export * from './observableToGenerator';
export * from './toObservable'
