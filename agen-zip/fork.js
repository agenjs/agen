export async function* fork(it, action, fifo = []) {
  let done = false, resolve;
  const actionPromise = action((async function*() {
    try {
      while (!done) {
        await new Promise(r => resolve = r);
        while (fifo.length) { yield fifo.shift(); }
      }
    } finally {
      fifo = null;
      resolve = null;
    }
  })());
  try {
    for await (let item of it) {
      fifo && fifo.push(item);
      resolve && resolve();
      yield item;
    }
  } finally {
    resolve && resolve();
    done = true;
    await actionPromise;
  }
}
