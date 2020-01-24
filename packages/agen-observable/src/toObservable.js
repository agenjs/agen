import { getGlobal } from '@agen/ns';

export function toObservable(it) {
  const Observable = getGlobal('Observable');
  let gen, stop = false, promise = Promise.resolve();
  return new Observable(o => {
    runNext();
    return async () => {
      stop = true;
      await promise;
      if (gen) gen.return();
    }

    function runNext() {
      promise = promise.then(async () => {
        try {
          if (stop) return ;
          gen = gen || await getGenerator(it);
          let slot = await gen.next();
          if (stop) return ;
          if (slot.done) o.complete();
          else o.next(slot.value);
          return runNext();
        } catch (err) {
          o.error(err);
          gen.error(err);
        }
      })
    }

    async function getGenerator(it) {
      const provider = typeof it === 'function' ? it() : it;
      return provider[Symbol.asyncIterator]
        ? await provider[Symbol.asyncIterator]()
        : provider[Symbol.iterator]
          ? await provider[Symbol.iterator]()
          : provider;
    }
  })
}
