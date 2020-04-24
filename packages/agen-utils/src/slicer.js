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
  length = length || ((block) => block.byteLength || block.length || 0);
  slice = slice || ((block, offset, len, blockLen) => {
    if (offset === 0 && len === blockLen) return block;
    return block.slice
      ? block.slice(offset, offset + len)
      : block.substring(offset, offset + len);
  })
  let block, blockLen = -1, it;
  return async function*(getSplitIndex) {
    if (typeof getSplitIndex !== 'function') {
      let len = getSplitIndex;
      getSplitIndex = (block, blockLen) => {
        const index = Math.min(len, blockLen);
        len -= index;
        return index;
      }
    }
    if (!it) it = await getIterator(provider);
    while (true) {
      if (!block) {
        const slot = await it.next();
        if (slot.done || !slot.value) break;
        block = slot.value;
        blockLen = length(block);
      }
      const splitIndex = getSplitIndex(block, blockLen);
      if (splitIndex === 0) { break; }
      else if (splitIndex > 0 && splitIndex < blockLen) {
        const chunk = slice(block, 0, splitIndex, blockLen);
        const n = blockLen - splitIndex;
        block = slice(block, splitIndex, n, blockLen);
        blockLen = n;
        yield chunk;
        break;
      } else {
        yield block;
        block = null;
        blockLen = -1;
      }
    }
  }
}
