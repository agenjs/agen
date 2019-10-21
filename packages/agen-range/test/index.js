const expect = require('expect.js');
const range = require('../src');

describe('range', async () => {

  const list = ['a', 'd', 'e', 'f', 'g', 'k', 'l', 'm', 'p'];
  describe('sync', () => {
    test(`should be able to return zero values (1)`, list, 5, 0, []);
    test(`should be able to return zero values (2)`, list, 0, 0, []);
    test(`should be able to return one value (1)`, list, list.length - 1, 1, ['p']);
    test(`should be able to return one value (2)`, list, 0, 1, ['a']);
    test(`should be able to return range from the end`, list, 0, 1000, list);
    test(`should be able to return a slice of the list`, list, 3, 4, list.slice(3, 3 + 4));
    test(`should be able to return 3 values`, list,  list.length - 3, 3, ['l', 'm', 'p'])
    test(`should be able to return all values`, list, 0, 1000, list)
  })
  describe('async', () => {
    test(`should be able to return zero values (1)`, toAsyncGenerator(list), 5, 0, []);
    test(`should be able to return zero values (2)`, toAsyncGenerator(list), 0, 0, []);
    test(`should be able to return one value (1)`, toAsyncGenerator(list), list.length - 1, 1, ['p']);
    test(`should be able to return one value (2)`, toAsyncGenerator(list), 0, 1, ['a']);
    test(`should be able to return one value (3)`, toAsyncGenerator(list), 3, 1, ['f']);
    test(`should be able to return range from the end`, toAsyncGenerator(list), 0, 1000, list);
    test(`should be able to return a slice of the list`, toAsyncGenerator(list), 3, 4, list.slice(3, 3 + 4));
    test(`should be able to return 3 values`, toAsyncGenerator(list),  list.length - 3, 3, ['l', 'm', 'p'])
    test(`should be able to return all values`, toAsyncGenerator(list), 0, 1000, list)
  })

  function test(msg, list, idx, count, control) {
    it(msg, async () => {
      const result = [];
      for await (let n of range(list, idx, count)) {
        result.push(n);
      }
      expect(result).to.eql(control);
    })
  }

});

async function* toAsyncGenerator(list, maxTimeout = 10) {
  for await (let item of list) {
    await new Promise(r => setTimeout(r, Math.round(maxTimeout * Math.random())));
    yield item;
  }
}
