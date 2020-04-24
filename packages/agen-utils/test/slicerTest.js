const expect = require('expect.js');
const { slicer } = require('..');

describe('slicer', function() {

  describe('string', function() {

    it(`should return specified range of chars from a single string`, async () => {
      const list = ['abcdefghijk'];
      const f = slicer(list, sliceStr);
      expect(await readString(f, 2)).to.eql('ab');
      expect(await readString(f, 3)).to.eql('cde');
      expect(await readString(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readString(f, 8)).to.eql('ghijk');
    })

    it(`should return specified range of chars from a single string`, async () => {
      const list = ['abcdefghijk'];
      const f = slicer(list, sliceStr);
      expect(await readString(f, 2)).to.eql('ab');
      expect(await readString(f, 3)).to.eql('cde');
      expect(await readString(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readString(f, 8)).to.eql('ghijk');
    })

    it(`custom slicer: should return specified range of chars from a block`, async () => {
      const list = ['abc', 'defg', 'hijk'];
      const f = slicer(list, sliceStr);
      expect(await readString(f, 1)).to.eql('a');
      expect(await readString(f, 4)).to.eql('bcde');
      expect(await readString(f, 4)).to.eql('fghi');
      expect(await readString(f, 1)).to.eql('j');
      expect(await readString(f, 8)).to.eql('k');
    })

    it(`should return specified range of chars from individual characters`, async () => {
      const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
      const f = slicer(list, sliceStr);
      expect(await readString(f, 2)).to.eql('ab');
      expect(await readString(f, 3)).to.eql('cde');
      expect(await readString(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readString(f, 8)).to.eql('ghijk');
    })

    function sliceStr(str, offset, len) { return str.substring(offset, offset + len); }

    async function readString(it, len) {
      let result = '';
      for await (let str of it(len)) { result += str; }
      return result;
    }

  })

  describe('Buffer', function() {

    it(`custom slicer: should return specified range of chars from a block`, async () => {
      const list = ['abcdefghijk'];
      const f = slicer(toBuffers(list), sliceBuffer);
      expect(await readBuffers(f, 2)).to.eql('ab');
      expect(await readBuffers(f, 3)).to.eql('cde');
      expect(await readBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readBuffers(f, 8)).to.eql('ghijk');
    })

    it(`custom slicer: should return specified range of chars from a block`, async () => {
      const list = ['abc', 'defg', 'hijk'];
      const f = slicer(toBuffers(list), sliceBuffer);
      expect(await readBuffers(f, 1)).to.eql('a');
      expect(await readBuffers(f, 4)).to.eql('bcde');
      expect(await readBuffers(f, 4)).to.eql('fghi');
      expect(await readBuffers(f, 1)).to.eql('j');
      expect(await readBuffers(f, 8)).to.eql('k');
    })

    it(`custom slicer: should return specified range of bytes from individual byte blocks`, async () => {
      const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
      const f = slicer(toBuffers(list), sliceBuffer);
      expect(await readBuffers(f, 2)).to.eql('ab');
      expect(await readBuffers(f, 3)).to.eql('cde');
      expect(await readBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readBuffers(f, 8)).to.eql('ghijk');
    })

    it(`default slicer: should return specified range of chars from a block`, async () => {
      const list = ['abcdefghijk'];
      const f = slicer(toBuffers(list));
      expect(await readBuffers(f, 2)).to.eql('ab');
      expect(await readBuffers(f, 3)).to.eql('cde');
      expect(await readBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readBuffers(f, 8)).to.eql('ghijk');
    })

    it(`default slicer: should return specified range of bytes from individual byte blocks`, async () => {
      const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
      const f = slicer(toBuffers(list));
      expect(await readBuffers(f, 2)).to.eql('ab');
      expect(await readBuffers(f, 3)).to.eql('cde');
      expect(await readBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readBuffers(f, 8)).to.eql('ghijk');
    })

    function sliceBuffer(buf, offset, len) { return buf.slice(offset, offset + len); }

    function toBuffers(array) {
      return array.map(str => Buffer.from(str, 'UTF-8'));
    }
    async function readBuffers(it, len) {
      let result = '';
      for await (let buf of it(len)) { result += buf.toString('UTF-8'); }
      return result;
    }
  });

  describe('Buffer - async tests', function() {

    it(`custom slicer: should return specified range of chars from a block`, async () => {
      const list = ['abcdefghijk'];
      const f = slicer(toAsyncBuffers(list), sliceBuffer);
      expect(await readBuffers(f, 2)).to.eql('ab');
      expect(await readBuffers(f, 3)).to.eql('cde');
      expect(await readBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readBuffers(f, 8)).to.eql('ghijk');
    })

    it(`custom slicer: should return specified range of chars from a block`, async () => {
      const list = ['abc', 'defg', 'hijk'];
      const f = slicer(toAsyncBuffers(list), sliceBuffer);
      expect(await readBuffers(f, 1)).to.eql('a');
      expect(await readBuffers(f, 4)).to.eql('bcde');
      expect(await readBuffers(f, 4)).to.eql('fghi');
      expect(await readBuffers(f, 1)).to.eql('j');
      expect(await readBuffers(f, 8)).to.eql('k');
    })

    it(`custom slicer: should return specified range of bytes from individual byte blocks`, async () => {
      const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
      const f = slicer(toAsyncBuffers(list), sliceBuffer);
      expect(await readBuffers(f, 2)).to.eql('ab');
      expect(await readBuffers(f, 3)).to.eql('cde');
      expect(await readBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readBuffers(f, 8)).to.eql('ghijk');
    })

    it(`default slicer: should return specified range of chars from a block`, async () => {
      const list = ['abcdefghijk'];
      const f = slicer(toAsyncBuffers(list));
      expect(await readBuffers(f, 2)).to.eql('ab');
      expect(await readBuffers(f, 3)).to.eql('cde');
      expect(await readBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readBuffers(f, 8)).to.eql('ghijk');
    })

    it(`default slicer: should return specified range of bytes from individual byte blocks`, async () => {
      const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
      const f = slicer(toAsyncBuffers(list));
      expect(await readBuffers(f, 2)).to.eql('ab');
      expect(await readBuffers(f, 3)).to.eql('cde');
      expect(await readBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readBuffers(f, 8)).to.eql('ghijk');
    })

    function sliceBuffer(buf, offset, len) { return buf.slice(offset, offset + len); }

    async function* toAsyncBuffers(array) {
      const maxTimeout = 20;
      for await (let str of array) {
        await new Promise(y => setTimeout(y, Math.random() * maxTimeout));
        yield Buffer.from(str, 'UTF-8');
      }
    }
    async function readBuffers(it, len) {
      let result = '';
      for await (let buf of it(len)) { result += buf.toString('UTF-8'); }
      return result;
    }
  });

  describe('ArrayBuffer', function() {

    it(`custom slicer: should return specified range of chars from a block`, async () => {
      const list = ['abcdefghijk'];
      const f = slicer(toArrayBuffers(list), sliceArrayBuffer);
      expect(await readArrayBuffers(f, 2)).to.eql('ab');
      expect(await readArrayBuffers(f, 3)).to.eql('cde');
      expect(await readArrayBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readArrayBuffers(f, 8)).to.eql('ghijk');
    })

    it(`custom slicer: should return specified range of bytes from individual byte blocks`, async () => {
      const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
      const f = slicer(toArrayBuffers(list), sliceArrayBuffer);
      expect(await readArrayBuffers(f, 2)).to.eql('ab');
      expect(await readArrayBuffers(f, 3)).to.eql('cde');
      expect(await readArrayBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readArrayBuffers(f, 8)).to.eql('ghijk');
    })

    it(`default slicer: should return specified range of chars from a block`, async () => {
      const list = ['abcdefghijk'];
      const f = slicer(toArrayBuffers(list));
      expect(await readArrayBuffers(f, 2)).to.eql('ab');
      expect(await readArrayBuffers(f, 3)).to.eql('cde');
      expect(await readArrayBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readArrayBuffers(f, 8)).to.eql('ghijk');
    })

    it(`default slicer: should return specified range of bytes from individual byte blocks`, async () => {
      const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
      const f = slicer(toArrayBuffers(list));
      expect(await readArrayBuffers(f, 2)).to.eql('ab');
      expect(await readArrayBuffers(f, 3)).to.eql('cde');
      expect(await readArrayBuffers(f, 1)).to.eql('f');
      // Only 5 bytes still available
      expect(await readArrayBuffers(f, 8)).to.eql('ghijk');
    })

    function sliceArrayBuffer(buf, offset, len) { return buf.slice(offset, offset + len); }

    function toArrayBuffers(array) {
      return array.map((str) => {
        const buf = new ArrayBuffer(str.length)
        const array = new Uint8Array(buf);
        for (let i = 0; i < array.length; i++) array[i] = str.charCodeAt(i);
        return buf;
      });

    }
    async function readArrayBuffers(it, len) {
      let result = '';
      for await (let buf of it(len)) {
        const array = new Uint8Array(buf);
        for (let i = 0; i < array.length; i++) {
          result += String.fromCharCode(array[i]);
        }
      }
      return result;
    }
  });


});
