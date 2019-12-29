export async function* fixedSizeBuffers(provider, size) {
  size = size || 1024;
  let buf = Buffer.from([]);
  for await (let chunk of provider) {
    buf = Buffer.concat([buf, chunk]);
    let start = 0;
    while (buf.length - start >= size) {
      const end = start + size;
      yield buf.slice(start, end);
      start = end;
    }
    if (start > 0) buf = buf.slice(start);
  }
  if (buf.length) yield buf;
}
