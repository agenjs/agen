module.exports = async function* batch(provider, size = 10) {
  let batch = [];
  for await (let value of provider) {
    batch.push(value);
    if (batch.length === size) {
      yield batch;
      batch = [];
    }
  }
  if (batch.length) yield batch;
}
