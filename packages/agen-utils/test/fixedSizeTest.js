const expect = require('expect.js');
const { fixedSize } = require('..');

describe('fixedSize', async () => {

  const list = ['first', 'second', 'third', 'fourth', 'Hello, world!\nsecond line', 'k'];
  test(list, 1);
  test(list, 2);
  test(list, 3);
  test(list, 5);
  test(list, 10);
  test(list, 15);
  test(list, 150);
  // test(list, Infinity);

  function test(list, len) {
    it(`should produce Array[${len}]`, async () => {
      const str = list.join('');
      let i = 0;
      for await (let chunk of fixedSize(list, Array, len)) {
        const l = Math.min(len, str.length - i);
        expect(chunk.length).to.eql(l);
        expect(chunk.join('')).to.eql(str.substring(i, i + l));
        i += l;
      }
      expect(i).to.eql(str.length);
    })
    it(`should produce Uint8Array[${len}]`, async () => {
      const str = list.join('');
      const decoder = new TextDecoder("utf-8");
      let i = 0;
      for await (let chunk of fixedSize(toBuffers(list), Uint8Array, len)) {
        const l = Math.min(len, str.length - i);
        expect(chunk.length).to.eql(l);
        const s = decoder.decode(chunk);
        expect(s).to.eql(str.substring(i, i + l));
        i += l;
      }
      expect(i).to.eql(str.length);
    })
    it(`should produce Buffer[${len}]`, async () => {
      const str = list.join('');
      let i = 0;
      for await (let chunk of fixedSize(toBuffers(list), Buffer.alloc, len)) {
        expect(Buffer.isBuffer(chunk)).to.be(true);
        const l = Math.min(len, str.length - i);
        expect(chunk.length).to.eql(l);
        const s = chunk.toString('UTF-8');
        expect(s).to.eql(str.substring(i, i + l));
        i += l;
      }
      expect(i).to.eql(str.length);
    })

    async function* toBuffers(list) {
      for (let str of list) {
        yield Buffer.from(str, 'UTF-8');
      }
    }

  }

})
