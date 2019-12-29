const expect = require('expect.js');
const { buffersToLines } = require('..');

describe('buffersToLines', async () => {

  it(`should transform a sequence of buffers to lines`, async () => {
    await test([], []);
    await test([''], ['']);
    await test(['a'], ['a']);
    await test(['a\n'], ['a', '']);
    await test(['a\nb'], ['a', 'b']);
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

    async function test(buffers, control) {
      buffers = buffers.map(Buffer.from);
      let i = 0;
      for await (let line of buffersToLines(buffers)) {
        expect(line).to.eql(control[i++]);
      }
      expect(i).to.eql(control.length);
    }
  })

});
