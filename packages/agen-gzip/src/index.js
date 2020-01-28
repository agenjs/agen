import pako from 'pako';
import { observe } from '@agen/observable';

export async function* inflate(generator) {
  yield* handle(generator, new pako.Inflate());
}

export async function* deflate(generator) {
  yield* handle(generator, new pako.Deflate());
}

async function *handle(generator, f) {
  const gen = observe(o => {
    let done = false;
    f.onData = o.next;
    f.onEnd = () => {
      o.complete();
      done = true;
    }
    (async () => {
      try {
        for await (let chunk of generator) {
          if (done) break;
          f.push(chunk, false);
          if (done) break;
        }
      } finally {
        f.push([], true);
        done = true;
      }
    })();
    return () => done = true;
  })
  for await (let chunk of gen) {
    yield chunk;
  }
}
