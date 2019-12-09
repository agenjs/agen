module.exports = async function* buffersFromStrings(provider) {
  const enc = 'UTF-8';
  for await (let line of provider) {
    yield Buffer.from(line, enc);
  }
}
