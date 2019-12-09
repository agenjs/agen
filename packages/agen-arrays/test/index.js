const expect = require('expect.js');
const { arraysFromDsv, arraysToDsv } = require('../src');

describe('arraysFromDsv', async () => {

  it(`should generate arrays from a list of separated values`, async () => {
    const list = ['a;A', 'b;B', 'c;C', 'd;D', 'abc:Hello, world!;two;three', 'k'];
    let i = 0;
    for await (let array of arraysFromDsv(list)) {
      expect(array).to.eql(list[i++].split(';'));
    }
    expect(i).to.eql(list.length);
  })
});

describe('arraysToDsv', async () => {

  it(`should generate string from a list of arrays`, async () => {
    const list = [
      ['a', 'A'],
      ['b', 'B'],
      ['c', 'C'],
      ['d', 'D'],
      [],
      ['abc:Hello, world!', 'two', 'three'],
      ['k']
    ];
    const control = ['a;A', 'b;B', 'c;C', 'd;D', '', 'abc:Hello, world!;two;three', 'k'];
    let i = 0;
    for await (let str of arraysToDsv(list)) {
      expect(str).to.eql(control[i++]);
    }
    expect(i).to.eql(list.length);
  })

});
