/**
 * Transforms sequence of binary arrays of different sizes to arrays of the
 * same size
 * @param provider async provider of TypedArray buffers
 * @param Type type of the array to create or a method returning a new array
 * @param size size of the resulting arrays
 */
export async function* fixedSize(provider, Type, size) {
  size = size || 1024;
  let buf, shift = 0;
  const newArray = Type.prototype && Type.prototype.constructor === Type
    ? (len) => new Type(len)
    : Type;
  for await (let chunk of provider) {
    for (let c = 0; c < chunk.length;) {
      if (!buf) buf = newArray(size);
      let len = Math.min(chunk.length - c, size - shift);
      for (let i = 0; i < len; i++) { buf[shift++] = chunk[c++]; }
      if (shift === size) {
        yield buf;
        shift = 0;
        buf = null;
      }
    }
  }
  if (buf && shift) {
    yield buf.slice(0, shift);
  }
}
