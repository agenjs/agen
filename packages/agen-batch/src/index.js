module.exports = async function* batch(provider, batchSize = 10) {
  let batch = [];
  for await (let value of provider) {
    batch.push(value);
    if (batch.length === batchSize) {
      yield batch;
      batch = [];
    }
  }
  if (batch.length) yield batch;
}
