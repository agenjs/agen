import { iterator } from './iterator.js';

/**
 * Send the same values to multiple iterators.
 * 
 * @param {Function} init initialization function accepting an object with
 * three methods:
 * - `async next(v)`: provides a new value to all iterators
 * - `async complete()`: complete iterations
 * - `async error(e)`: notifies about an error
 * @returns {Function} the returned method provides new iterators over generated values
 */
export function multiplexer(init, queue) {
  let list = [];
  const read = iterator(init, queue);
  const forAll = async (action) => (await Promise.all(list.map(action)));
  (async () => {
    try {
      for await (let value of read()) { await forAll((o) => o.next(value)) }
      await forAll((o) => o.complete());
    } catch (err) {
      await forAll((o) => o.error(err));
    }
  })();
  return async function* (queue) {
    if (!list) throw new Error('Iterations finished');
    yield* iterator(o => {
      list = [...list, o];
      return () => list = list.filter(_ => _ !== o);
    }, queue)();
  }
}