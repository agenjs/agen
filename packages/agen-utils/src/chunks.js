import { getIterator } from './getIterator.js';

/**
 * Transforms the given sequence of items to a sequence of async providers.
 */
export async function* chunks(provider, begin, end) {
  let slot, counter = -1;
  const it = await getIterator(provider);
  try {
    while (!slot || !slot.done) {
      for await (let v of chunk(begin)) { !!v }
      if (!slot.done) yield chunk(end);
    }
  } catch (err) {
    if (it.error) it.error(err);
    throw err;
  }
  async function* chunk(checkStop) {
    while (!slot || !slot.done) {
      if (slot) yield slot.value;
      slot = await it.next();
      counter++;
      if (slot.done || !!(await checkStop(slot.value, counter))) break;
    }
  }
}
