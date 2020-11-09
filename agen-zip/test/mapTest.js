const expect = require('expect.js');
const { map } = require('..');

describe('map', function() {

  it(`should transform initial elements to new ones`, async () => {
    const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
    const control = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    let idx = 0;
    for await (let item of map(list, (v,i) => v.toUpperCase())) {
      expect(item).to.eql(control[idx++]);
    }
    expect(idx).to.eql(control.length);
  })

  it(`should be able to use item index to transform values`, async () => {
    const list = ['a', 'b', 'c'];
    const control = ['A-0', 'B-1', 'C-2'];
    let idx = 0;
    for await (let item of map(list, (v,i) => v.toUpperCase() + '-' + i)) {
      expect(item).to.eql(control[idx++]);
    }
    expect(idx).to.eql(control.length);
  })

});
