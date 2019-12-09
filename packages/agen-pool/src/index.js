const { observe } = require('@agen/observable');

async function* pool(provider, action, poolSize = 1) {
  yield* observe((observer) => {
    let stop = false;
    (async () => {
      try {
        let pool = [];
        for await (let item of provider) {
          if (stop) break;
          let promise = (async (i) => {
            try {
              const result = await action(i);
              observer.next(result);
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

module.exports = { pool }
