module.exports = async function* buffersFromStrings(provider, enc = 'UTF-8') {
  for await (let line of provider) {
    yield Buffer.from(line, enc);
  }
}
