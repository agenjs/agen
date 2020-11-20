const expect = require('expect.js');
const { lines } = require('..');

describe('lines', async () => {

  it(`should transform a sequence of strings to lines`, async () => {
    await test([], []);
    await test([''], ['']);
    await test(['a'], ['a']);
    await test(['a\n'], ['a', '']);
    await test(['a\nb'], ['a', 'b']);
    await test([ 'first line\nsecond line' ], [
      'first line',
      'second line'
    ]);
    await test([ 'first line\nsecond line\n' ], [
      'first line',
      'second line',
      ''
    ]);
    await test([
      'first line\nsecond ',
      'line\n\nthird line\nfou',
      'rth li',
      'ne\nfifth line\n',
      '\n'
    ], [
      'first line',
      'second line',
      '',
      'third line',
      'fourth line',
      'fifth line',
      '',
      ''
    ]);

    async function test(strings, control) {
      let i = 0;
      for await (let line of lines(strings)) {
        expect(line).to.eql(control[i++]);
      }
      expect(i).to.eql(control.length);
    }
  })

});
