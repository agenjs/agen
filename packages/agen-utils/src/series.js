import { getIterator } from './getIterator.js';
/**
 * Splits sequence of items to multiple async iterators using the provided
 * "split" method.
 */
export async function* series(provider, split) {
  const it = await getIterator(provider);
  let slot, counter = -1;
  try {
    while (!slot || !slot.done) { yield chunk(); }
  } catch (err) {
    if (it.error) it.error(err);
    throw err;
  }
  async function* chunk() {
    while (!slot || !slot.done) {
      if (slot) yield slot.value;
      slot = await it.next();
      counter++;
      if (slot.done || !!(await split(slot.value, counter))) break;
    }
  }
}
