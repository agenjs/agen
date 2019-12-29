import { withIterators } from '@agen/utils';
/**
 * Split sequence of items to multiple async iterators using the provided
 * "split" method.
 */
export async function* series(provider, split) {
  yield* withIterators([provider], async function*([it]) {
    let slot, counter = -1;
    while (!slot || !slot.done) { yield chunk(); }
    async function* chunk() {
      while (!slot || !slot.done) {
        if (slot) yield slot.value;
        slot = await it.next();
        counter++;
        if (slot.done || !!(await split(slot.value, counter))) break;
      }
    }
  })
}
