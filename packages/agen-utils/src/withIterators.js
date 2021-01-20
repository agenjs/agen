import { getIterator } from './getIterator.js';

export async function* withIterators(providers, action) {
  const iterators = new Array(providers.length);
  for (let i = 0; i < providers.length; i++) {
    iterators[i] = await getIterator(providers[i]);
  }
  try {
    for await (let item of action(iterators)) yield item;
    for (let i = 0; i < iterators.length; i++) {
      const it = iterators[i];
      if (it.return) it.return();
    }
  } catch (err) {
    for (let i = 0; i < iterators.length; i++) {
      const it = iterators[i];
      if (it.error) it.error(err);
    }
    throw err;
  }
}
