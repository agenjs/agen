const expect = require('expect.js');
const { chunks } = require('../src');

describe('chunks', function() {

  it(`should return sequence of iterators`, async () => {
    const list = 'abcdefghijklmnopqrstuvwxyz'.split('');
    await test(list, [
      'a', 'e', 'j', 'p', 'y'
    ], 3, [
      ['a', 'b', 'c'],
      ['e', 'f', 'g'],
      ['j', 'k', 'l'],
      ['p', 'q', 'r'],
      ['y', 'z'],
    ])
    async function test(list, starts, count, control) {
      let startIdx = 0, idx;
      const begin = (v, i) => {
        if (v !== starts[startIdx]) return false;
        idx = i;
        startIdx++;
        return true;
      }
      const end = (v, i) => {
        return i >= idx + count;
      }

      let controlIdx = 0;
      for await (let chunk of chunks(list, begin, end)) {
        const block = [];
        for await (let item of chunk) {
          block.push(item);
        }
        expect(block).to.eql(control[controlIdx++]);
      }
      expect(controlIdx).to.eql(control.length);
    }
  })

});
