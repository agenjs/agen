import { withIterators } from './withIterators';
import { newMutexPair } from './mutex';

export async function* combine(generators, reset) {
  const it = withIterators(generators, async function*(iterators) {
    let done = 0, stopped = false, results = [];
    let values = new Array(iterators.length);
    const [notifyMainThread, notifyIterators, close] = newMutexPair();
    iterators.forEach(async (it, idx) => {
      try {
        for await (let item of it) {
          values[idx] = item;
          results.push([...values]);
          await notifyMainThread();
          if (stopped) break;
        }
      } finally {
        if (reset) values[idx] = undefined;
        done++;
      }
    })
    try {
      while (done < iterators.length) {
        await notifyIterators();
        while (results.length) yield results.shift();
      }
    } finally {
      stopped = true;
      await close();
    }
  })
  for await (let item of it) yield item;
}
