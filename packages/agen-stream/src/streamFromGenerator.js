import { Readable } from 'stream';

export function streamFromGenerator(provider, objectMode = true) {
  const it = provider[Symbol.iterator] ? provider[Symbol.iterator]() : provider;
  return new Readable({
    objectMode,
    async read() {
      try {
        const item = await it.next();
        if (item.done) this.push(null);
        else this.push(item.value);
      } catch (error) {
        Promise.resolve().then(() => this.emit('error', error));
      }
    }
  });
}
