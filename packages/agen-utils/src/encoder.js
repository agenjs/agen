/**
 * Transforms sequence of strings to UTF-8 encoded int arrays / buffers.
 * @param provider async generator providing strings
 * @return an async generator providing decoded strings
 */
export async function* encoder(provider) {
  const encoder = new TextEncoder('UTF-8');
  for await (let chunk of provider) {
    yield encoder.encode(chunk);
  }
}
