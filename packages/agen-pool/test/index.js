const expect = require('expect.js');
const { pool } = require('..');

describe('pool', async () => {

  test('running pool should not exceed the specified size', 10, 1, true);
  test('running pool should not exceed the specified size', 10, 10, true);
  test('running pool should not exceed the specified size', 100, 10, true);
  test('running pool should not exceed the specified size', 10, 100, true);
  test('running pool should not exceed the specified size', 10, 1, false);
  test('running pool should not exceed the specified size', 10, 10, false);
  test('running pool should not exceed the specified size', 100, 10, false);
  test('running pool should not exceed the specified size', 10, 100, false);

  function test(msg, count, poolSize, sync) {
    it(`[${sync ? 'sync' : 'async'}]: ${msg}. count=${count}; poolSize=${poolSize}`, async () => {
      const list = [];
      for (let i = 0; i < count; i++) {
        list.push(`message-${i}`);
      }

      const gen = sync ? list : toAsyncGenerator(list);
      const maxTimeout = 100;
      let currentPoolSize = 0;
      const action = async function*(m) {
        currentPoolSize++;
        // console.log('I AM HERE', m, currentPoolSize);
        expect(currentPoolSize <= poolSize).to.be(true);
        await timeout(Math.round(maxTimeout * Math.random()));
        currentPoolSize--;
        yield m;
      }
      const result = [];
      for await (let n of pool(gen, action, poolSize)) {
        // console.log('I AM THERE', n);
        result.push(n);
      }
      expect(result.sort()).to.eql(list.sort());
    })
  }

});

async function timeout(t = 100) { return new Promise(r => setTimeout(r, t)) };

async function* toAsyncGenerator(list, maxTimeout = 30) {
  for await (let item of list) {
    await timeout(Math.round(maxTimeout * Math.random()));
    yield item;
  }
}
