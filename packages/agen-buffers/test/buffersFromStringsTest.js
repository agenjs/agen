const expect = require('expect.js');
const {  buffersFromStrings } = require('../');

describe('buffersFromStrings', async () => {

  it(`should generate sequence of buffers`, async () => {
    const list = ['first', 'second', 'third', 'fourth', 'Hello, world!\nsecond line', 'k'];
    let i = 0;
    for await (let buf of buffersFromStrings(list)) {
      expect(Buffer.isBuffer(buf));
      expect(buf.toString('UTF-8')).to.eql(list[i++])
    }
    expect(i).to.eql(list.length);
  })

});
