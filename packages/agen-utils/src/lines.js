/**
 * Transforms sequence of strings (containing '\r' and '\n' symbols) to a sequence
 * of individual lines.
 */
export async function* lines(provider) {
  let buffer;
  for await (let chunk of provider) {
    buffer = buffer || '';
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop();
    while (lines.length) yield lines.shift();
  }
  if (buffer !== undefined) yield buffer;
}
