const expect = require('expect.js');
const { series } = require('../src');

describe('series', function() {

  it(`series: should split sequence to series of iterators`, async () => {
    const list = 'abcdefghijklmnopqrstuvwxyz'.split('');
    await test(list, [
      'c', 'f', 'j', 'p', 'y'
    ], [
     'ab',
     'cde',
     'fghi',
     'jklmno',
     'pqrstuvwx',
     'yz'
    ])
    async function test(list, starts, control) {
      let startIdx = 0, idx;
      const check = (v, i) => {
        if (v !== starts[startIdx]) return false;
        idx = i;
        startIdx++;
        return true;
      };
      let controlIdx = 0;
      for await (let chunk of series(list, check)) {
        let block = '';
        for await (let item of chunk) {
          block += item;
        }
        expect(block).to.eql(control[controlIdx++]);
      }
      expect(controlIdx).to.eql(control.length);
    }
  })

});
