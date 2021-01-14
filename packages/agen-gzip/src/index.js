import pako from 'pako';

export async function* inflate(generator, options={}) {
  yield* handle(generator, new pako.Inflate(options));
}

export async function* deflate(generator, options={}) {
  yield* handle(generator, new pako.Deflate(options));
}

async function *handle(generator, f) {
  let out = [];
  f.onData = (chunk) => out.push(chunk);
  f.onEnd = () => {};
  for await (let chunk of generator) {
    f.push(chunk, false);
    if (out.length) {
      yield* out;
      out = [];
    }
  }
  f.push([], true);
  if (out.length) { yield* out; }
}
