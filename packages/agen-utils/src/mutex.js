export function newMutex() {
  let promise, closed = false;
  return {
    get promise() { return promise; },
    unlock(close) { closed |= !(!close); },
    async lock() {
      await promise;
      !closed && (promise = new Promise(n => this.unlock = n));
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
      first.unlock(true);
      second.unlock(true);
      await Promise.all([first.promise, second.promise]);
    }
  ];
}
