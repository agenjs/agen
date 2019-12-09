const expect = require('expect.js');
const { fixedSizeBuffers } = require('../');

describe('fixedSizeBuffers', async () => {

  const list = ['first', 'second', 'third', 'fourth', 'Hello, world!\nsecond line', 'k'];
  test(list, 1);
  test(list, 2);
  test(list, 3);
  test(list, 5);
  test(list, 10);
  test(list, 15);
  test(list, 150);
  test(list, Infinity);

  function test(list, len) {
    it(`should produce buffers of the same size (${len} bytes) from a sequence of buffers of differnt sizes`, async () => {
      const str = list.join('');
      let i = 0;
      for await (let buf of fixedSizeBuffers(toBuffers(list), len)) {
        const l = Math.min(len, str.length - i);
        expect(buf.toString('UTF-8')).to.eql(str.substring(i, i + l));
        i += l;
      }
      expect(i).to.eql(str.length);
    })
  }

  async function* toBuffers(list) {
    for (let str of list) {
      yield Buffer.from(str, 'UTF-8');
    }
  }

})
