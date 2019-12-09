module.exports = async function* jsonFromStrings(provider, options = {}) {
  for await (let line of provider) {
    try {
      yield JSON.parse(line);
    } catch (error) {
      yield { error };
    }
  }
}
