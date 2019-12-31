/**
 * Transforms sequence of buffers or int arrays to a sequence of decoded strings.
 * @param provider async generator providing buffers
 * @param {String} enc encoding for the text
 * @return an async generator providing decoded strings
 */
export async function* decoder(provider, enc = 'UTF-8') {
  const decoder = new TextDecoder(enc);
  for await (let chunk of provider) {
    yield decoder.decode(chunk, { stream : true });
  }
  const lastChunk = decoder.decode();
  if (lastChunk) yield lastChunk; // finish the stream
}
