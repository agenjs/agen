import { getGlobal, setGlobal } from '@agen/ns';

export class Observer {
  constructor(...args) {
    this.obj = (typeof args[0] === 'function')
      ? { next : args[0], error : args[1], complete : args[2] }
      : args[0];
    ['next', 'error', 'complete'].forEach(m => this[m] = this[m].bind(this));
  }
  next(value) { return this._handle('next', value, false); }
  error(err) { return this._handle('error', err, true); }
  complete() { return this._handle('complete', undefined, true); }
  _handle(method, arg, done) {
    if (this.done) return ;
    this.done = done;
    let handled = false;
    try {
      const m = this.obj[method];
      let result =  m && m.apply(this.obj, arg !== undefined ? [arg] : []);
      handled = true;
      return result;
    } finally {
      if (!handled || done) {
        if (typeof this._unsubscribe === 'function') this._unsubscribe();
      }
    }
  }
}

export class Observable {
  constructor(subscribe) { this._subscribe = subscribe; }
  subscribe(...args) {
    const o = new Observer(...args);
    o._unsubscribe = this._subscribe(o);
    return { unsubscribe : (e) => (e ? o.error(e) : o.complete()) };
  }
}


if (getGlobal('Observable') === undefined) setGlobal('Observable', Observable);
