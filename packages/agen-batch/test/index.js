const expect = require('expect.js');
const batch = require('../src');

describe('batch', async () => {

  it(`should transform sequence of elements to batches`, async () => {
    const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
    const results = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i'],
      ['j', 'k']
    ]
    let i = 0;
    for await (let b of batch(list, 3)) {
      expect(b).to.eql(results[i++]);
    }
  })

});
