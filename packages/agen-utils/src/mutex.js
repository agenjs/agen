export function newMutex() {
  let promise, notify, closed = false;
  return {
    get promise() { return promise; },
    close() { closed = true; notify && notify(); },
    unlock() { if (notify) notify(); },
    async lock() {
      await promise;
      !closed && (promise = new Promise(n => notify = n));
    }
  }
}

export function newMutexPair() {
  const first = newMutex();
  const second = newMutex();
  return [
    async () => {
      second.unlock();
      await first.lock();
    }, async () => {
      first.unlock();
      await second.lock();
    }, async () => {
      first.close();
      second.close();
      await Promise.all([first.promise, second.promise]);
    }
  ];
}
