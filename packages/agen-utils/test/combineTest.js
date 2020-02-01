const expect = require('expect.js');
const { combine } = require('..');

describe('combine', function() {

  it(`sync: should sequence of combined values provided by individual iterators`, async () => await test([
    [1, 3, 5, 7, 9],
    [0, 2, 4, 6, 8],
    [10, 20, 30, 40]
  ], [
    [ 1, undefined, undefined ],
    [ 1, 0, undefined ],
    [ 1, 0, 10 ],
    [ 3, 0, 10 ],
    [ 3, 2, 10 ],
    [ 3, 2, 20 ],
    [ 5, 2, 20 ],
    [ 5, 4, 20 ],
    [ 5, 4, 30 ],
    [ 7, 4, 30 ],
    [ 7, 6, 30 ],
    [ 7, 6, 40 ],
    [ 9, 6, 40 ],
    [ 9, 8, 40 ]
  ]));

  it(`async: should sequence of combined values provided by individual iterators`, async () => await test([
    toAsyncGenerator([1, 3, 5, 7, 9], 30),
    toAsyncGenerator([0, 2, 4, 6, 8], 20),
    toAsyncGenerator([10, 20, 30, 40], 40)
  ], [
    [ undefined, 0, undefined ],
    [ 1, 0, undefined ],
    [ 1, 0, 10 ],
    [ 1, 2, 10 ],
    [ 3, 2, 10 ],
    [ 3, 2, 20 ],
    [ 3, 4, 20 ],
    [ 5, 4, 20 ],
    [ 5, 4, 30 ],
    [ 5, 6, 30 ],
    [ 7, 6, 30 ],
    [ 7, 6, 40 ],
    [ 7, 8, 40 ],
    [ 9, 8, 40 ]
  ]));

  it(`async: should sequence of combined values provided by individual iterators`, async () => await test([
    toAsyncGenerator([1, 3, 5, 7, 9], 10),
    toAsyncGenerator([0, 2, 4, 6, 8], 20),
    toAsyncGenerator([10, 20, 30, 40], 40)
  ], [
    [ 1, undefined, undefined ],
     [ 1, 0, undefined ],
     [ 1, 0, 10 ],
     [ 3, 0, 10 ],
     [ 3, 2, 10 ],
     [ 3, 2, 20 ],
     [ 5, 2, 20 ],
     [ 5, 4, 20 ],
     [ 5, 4, 30 ],
     [ 7, 4, 30 ],
     [ 7, 6, 30 ],
     [ 7, 6, 40 ],
     [ 9, 6, 40 ],
     [ 9, 8, 40 ]
  ], 100));

  async function test(list, control, timeout) {
    const gen = combine(...list);
    const result = [];
    for await (let values of gen) {
      if (timeout) await new Promise(y => setTimeout(y, timeout));
      result.push(values);
    }
    expect(result).to.eql(control);
  }

  async function* toAsyncGenerator(list,timeout) {
    for await (let item of list) {
      await new Promise(r => setTimeout(r, timeout));
      yield item;
    }
  }

});
