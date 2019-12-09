const { StringDecoder } = require('string_decoder');

module.exports = async function* buffersToLines(provider, encoding = 'UTF-8') {
  const decoder = new StringDecoder(encoding);
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
