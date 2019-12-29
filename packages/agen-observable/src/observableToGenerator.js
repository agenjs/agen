export function observableToGenerator(observable, slots = []) {
  let finished, callback, promise = new Promise(c => callback = c);
  async function push(error, value, done) {
    if (finished) return ;
    const slot =  { error, value, done };
    slot.promise = new Promise(n => slot.notify = n);
    await slots.push(slot);
    finished = done;
    callback();
    return slot.promise;
  }
  const subscription = observable.subscribe({
    next : value => push(undefined, value, false),
    error : err => push(err, undefined, true),
    complete : () => push(undefined, undefined, true)
  });
  async function cleanup() {
    while (await slots.shift()) { // Cleanup the slots list
      // empty
    }
    finished = true;
    slots = { push(){}, shift(){} };
    subscription.unsubscribe();
    return {};
  }
  return {
    [Symbol.asyncIterator] : function() { return this; },
    async next() {
      for (;;) {
        await promise;
        const slot = await slots.shift();
        if (slot) {
          slot.notify();
          if (slot.error) throw slot.error;
          return slot;
        }
        if (finished) return { done : true };
        promise = new Promise(c => callback = c);
      }
    },
    return() { return cleanup(); },
    error() { return cleanup(); }
  }
}
