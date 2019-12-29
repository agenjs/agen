export function subscribe(it, observer) {
  let stop = false, promise;
  return {
    get promise() { return promise; },
    async start() {
      if (promise) throw new Error('Iteration already started.');
      promise = (async () => {
        try {
          for await (let item of it) {
            await observer.next(item);
            if (stop) break;
          }
        } catch (error) {
          await observer.error(error);
        } finally {
          stop = true;
          await observer.complete();
        }
      })();
    },
    async stop() {
      stop = true;
      try { await promise; } catch (err) {
        // empty
      }
    }
  }
}
