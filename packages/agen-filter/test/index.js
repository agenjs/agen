const expect = require('expect.js');
const { filter } = require('..');

describe('filter', function() {

  it(`should be able filter elements values`, async () => {
    const list = [
      'First Message',
      'Hello world',
      'Second Message',
      'Hello John Smith'
    ]
    const control = ['Hello world', 'Hello John Smith'];
    let idx = 0;
    for await (let item of filter(list, (v) => v.indexOf('Hello') >= 0)) {
      expect(item).to.eql(control[idx++]);
    }
    expect(idx).to.eql(control.length);
  })

  it(`should be able filter elements by their index (position)`, async () => {
    const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
    const control = ['a', 'c', 'e', 'g', 'i', 'k'];
    let idx = 0;
    for await (let item of filter(list, (v, i) => i % 2 === 0)) {
      expect(item).to.eql(control[idx++]);
    }
    expect(idx).to.eql(control.length);
  })

});
