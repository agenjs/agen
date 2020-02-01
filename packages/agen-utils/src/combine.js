import { withIterators } from './withIterators';

export async function* combine(...generators) {
  yield* withIterators(generators, async function*(iterators) {
    const values = new Array(iterators.length).fill(undefined);
    let done = 0, promises = [], results = [];
    while (done < iterators.length) {
      if (!promises.length) {
        promises = iterators.map((gen, idx) => {
          let promise;
          return promise = (async () => {
            const slot = await gen.next();
            if (!slot.done) {
              values[idx] = slot.value;
              results.push([...values]);
            } else done++;
            promises = promises.filter(p => p !== promise);
          })();
        });
      }
      await Promise.race(promises);
      yield* results;
      results = [];
    }
  })
}
