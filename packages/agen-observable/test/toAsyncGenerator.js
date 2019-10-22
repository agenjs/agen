const timeout = require('./timeout');

module.exports = async function* toAsyncGenerator(list, maxTimeout = 10) {
  for await (let item of list) {
    await timeout(Math.round(maxTimeout * Math.random()));
    yield item;
  }
}
