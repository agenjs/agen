const expect = require('expect.js');
const { arraysFromDsv } = require('../src');

describe('arraysFromDsvTest', async () => {

  it(`should generate arrays from a list of separated values`, async () => {
    const list = ['a;A', 'b;B', 'c;C', 'd;D', 'abc:Hello, world!;two;three', 'k'];
    let i = 0;
    for await (let array of arraysFromDsv(list)) {
      expect(array).to.eql(list[i++].split(';'));
    }
    expect(i).to.eql(list.length);
  })

});
