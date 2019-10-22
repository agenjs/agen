module.exports = async function getIterator(provider) {
  return provider[Symbol.asyncIterator]
    ? await provider[Symbol.asyncIterator]()
    : provider[Symbol.iterator]
      ? await provider[Symbol.iterator]()
      : provider;
}
