import { withIterators } from './withIterators';

/**
 * Transforms the given sequence of items to a sequence of async providers.
 */
export async function* chunks(provider, begin, end) {
  yield* withIterators([provider], async function*([it]) {
    let slot, counter = -1;
    while (!slot || !slot.done) {
      for await (let v of chunk(begin)) { !!v }
      if (!slot.done) yield chunk(end);
    }
    async function* chunk(checkStop) {
      while (!slot || !slot.done) {
        if (slot) yield slot.value;
        slot = await it.next();
        counter++;
        if (slot.done || !!(await checkStop(slot.value, counter))) break;
      }
    }
  })
}
