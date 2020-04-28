import { observe } from '@agen/observable';

export async function* pool(provider, action, poolSize = 1) {
  yield* observe((observer) => {
    let stop = false;
    (async () => {
      try {
        let pool = [];
        for await (let item of provider) {
          if (stop) break;
          let promise = (async (i) => {
            try {
              for await (let item of action(i)) {
                observer.next(item);
              }
            } catch (err) {
              observer.error(err);
            }
          })(item);
          promise = promise.then(() => {
            pool = pool.filter((p) => p !== promise);
          });
          pool.push(promise);
          if (pool.length >= poolSize) {
            await Promise.race(pool);
            if (stop) break;
          }
        }
        await Promise.all(pool);
      } finally {
        stop = true; // It can be an exception... Stop all other attempts
        observer.complete();
      }
    })();
    return () => stop = true;
  });
}
