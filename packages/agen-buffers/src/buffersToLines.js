import { StringDecoder } from 'string_decoder';

export async function* buffersToLines(provider, enc = 'UTF-8') {
  const decoder = new StringDecoder(enc);
  let buffer;
  for await (let chunk of provider) {
    buffer = buffer || '';
    buffer += decoder.write(chunk);
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop();
    for (let line of lines) {
      yield line;
    }
  }
  if (buffer !== undefined) yield buffer;
}
