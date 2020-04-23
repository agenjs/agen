import { getIterator } from './getIterator';

/**
 * This method returns a new function providing async iterators
 * over the specified byte range of the data
 * @param provider - async generator providing data
 * @param slice - function returning a new block of the given length
 * containing range of bytes starting from the specified offset
 * @param length function providing the length of the given block;
 * default implementation checks the "byteLength" or "length" properties.
 */
export function slicer(provider, slice, length) {
  slice = slice || ((block, offset, len) => {
    if (offset === 0 && len === block.length) return block;
    return block.slice
      ? block.slice(offset, offset + len)
      : block.substring(offset, offset + len);
  })
  length = length || ((block) => block.byteLength || block.length || 0);
  let prevBlock, prevBlockLen = -1, shift = 0, it;
  return async function*(len) {
    if (!it) it = await getIterator(provider);
    let index = 0;
    while (index < len) {
      if ((index < len) && (shift < prevBlockLen)) {
        let blockLen = Math.min(len - index, prevBlockLen - shift);
        const block = slice(prevBlock, shift, blockLen);
        shift += blockLen;
        index += blockLen;
        yield block;
      }
      if (index >= len) break;
      const slot = await it.next();
      prevBlock = slot.value;
      prevBlockLen = prevBlock ? length(prevBlock) : 0;
      shift = 0;
      if (slot.done) break;
    }
  }
}
