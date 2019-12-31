const expect = require('expect.js');
const { encoder, decoder } = require('..');

describe('encoding/decoding', async () => {

    test('');
    // Just some diacritics:
    test('BôNjoûr lê Môndè');
    // in Polish:
    test('Zażółć gęślą jaźń');
    // in Spanish - all 27 letters and diacritics
    test("El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja.")
    // in Russian - all 33 Russian Cyrillic alphabet letters.
    test("Съешь же ещё этих мягких французских булок, да выпей чаю");

    function test(string) {
      const maxLen = 50;
      const str = string.length > maxLen ? string.substring(0, maxLen) + '...' : string;
      describe(`Phrase: "${str}":`, async () => {
        it(`chunkLen: 1`, async () => await run(1));
        it(`chunkLen: 3`, async () => await run(3));
        it(`chunkLen: 5`, async () => await run(5));
        it(`chunkLen: 25`, async () => await run(25));
        it(`chunkLen: 125`, async () => await run(125));
        it(`chunkLen: 1024`, async () => await run(1024));
        async function run(chunkLen) {
          let p;
          const chunks = chunkString(string, chunkLen);
          p = chunks;
          p = encoder(p);
          p = decoder(p);
          const array = [];
          for await (let chunk of p) {
            array.push(chunk);
          }
          expect(array).to.eql(chunks);
          expect(array.join('')).to.eql(string);
        }
      })
    }

    function chunkString(str, size) {
      const numChunks = Math.ceil(str.length / size)
      const chunks = new Array(numChunks)
      for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
      }
      return chunks;
    }

});
