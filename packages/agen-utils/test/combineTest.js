const expect = require('expect.js');
const { combine } = require('..');

describe('combine', function() {

  it(`sync: should combine sequences of different sizes`, async () => await test([
    ['A1', 'A2', 'A3', 'A4', 'A5'],
    ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9'],
    ['C1', 'C2', 'C3'],
  ], [
    [ 'A1', undefined, undefined ],
    [ 'A1', 'B1', undefined ],
    [ 'A1', 'B1', 'C1' ],
    [ 'A2', 'B1', 'C1' ],
    [ 'A2', 'B2', 'C1' ],
    [ 'A2', 'B2', 'C2' ],
    [ 'A3', 'B2', 'C2' ],
    [ 'A3', 'B3', 'C2' ],
    [ 'A3', 'B3', 'C3' ],
    [ 'A4', 'B3', 'C3' ],
    [ 'A4', 'B4', 'C3' ],
    [ 'A5', 'B4', 'C3' ],
    [ 'A5', 'B5', 'C3' ],
    [ 'A5', 'B6', 'C3' ],
    [ 'A5', 'B7', 'C3' ],
    [ 'A5', 'B8', 'C3' ],
    [ 'A5', 'B9', 'C3' ]
  ], 20))

  it(`sync: should combine sequences of different sizes`, async () => await test([
    ['A1', 'A2', 'A3', 'A4', 'A5'],
    ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9'],
    ['C1', 'C2', 'C3'],
  ], [
    [ 'A1', undefined, undefined ],
    [ 'A1', 'B1', undefined ],
    [ 'A1', 'B1', 'C1' ],
    [ 'A2', 'B1', 'C1' ],
    [ 'A2', 'B2', 'C1' ],
    [ 'A2', 'B2', 'C2' ],
    [ 'A3', 'B2', 'C2' ],
    [ 'A3', 'B3', 'C2' ],
    [ 'A3', 'B3', 'C3' ],
    [ 'A4', 'B3', 'C3' ],
    [ 'A4', 'B4', 'C3' ],
    [ 'A5', 'B4', undefined ],
    [ 'A5', 'B5', undefined ],
    [ undefined, 'B6', undefined ],
    [ undefined, 'B7', undefined ],
    [ undefined, 'B8', undefined ],
    [ undefined, 'B9', undefined ]
  ], 10, true));

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
    toAsyncGenerator([1, 3, 5, 7, 9], 10),
    toAsyncGenerator([0, 2, 4, 6, 8], 10),
    toAsyncGenerator([10, 20, 30, 40], 10)
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
    toAsyncGenerator([1, 3, 5, 7, 9], 10),
    toAsyncGenerator([0, 2, 4, 6, 8], 10),
    toAsyncGenerator([10, 20, 30, 40], 10)
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
  ], 30));

  async function test(list, control, timeout, reset) {
    const gen = combine(list, reset);
    const result = [];
    for await (let values of gen) {
      if (timeout) await new Promise(y => setTimeout(y, timeout));
      result.push(values);
    }
    expect(result).to.eql(control);
  }

  async function* toAsyncGenerator(list,timeout) {
    for await (let item of list) {
      (timeout > 0) && (await new Promise(r => setTimeout(r, timeout)));
      yield item;
    }
  }

});
