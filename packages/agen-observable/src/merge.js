const observe = require('./observe');
const subscribe = require('./subscribe');

module.exports = async function* merge(...generators) {
  const array = [];
  try {
    yield* await observe(async (observer) => {
      let completed = 0;
      const complete = async () => {
        completed++;
        if (completed === generators.length) {
          await observer.complete();
        }
      }
      for (let g of generators) {
        const f = await subscribe(g, { ...observer, complete });
        array.push(f);
      }
      await Promise.all(array.map(f => f.start()));
    })
  } finally {
    for (let f of array) await f.stop();
  }
}
