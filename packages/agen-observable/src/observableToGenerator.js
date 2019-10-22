module.exports = function observableToGenerator(observable, slots = []) {
  let done, callback, promise = new Promise(c => callback = c);
  async function push(slot) {
    if (done) return ;
    try {
      await slots.push(slot);
    } finally {
      callback();
    }
  }
  const subscription = observable.subscribe({
    next : value => push({ value }),
    error : err => push({ error : err, done : true }),
    complete : () => push({ done : true })
  });
  async function cleanup() {
    done = true; slots = { push(){}, shift(){} };
    subscription.unsubscribe();
    return {};
  }
  return {
    [Symbol.asyncIterator] : function() { return this; },
    async next() {
      while (true) {
        await promise;
        if (done) return { done : true };
        const slot = await slots.shift();
        if (slot) {
          done |= slot.done;
          if (slot.error) throw slot.error;
          return slot;
        }
        promise = new Promise(c => callback = c);
      }
    },
    return(value) { return cleanup(); },
    error(err) { return cleanup(); }
  }
}
