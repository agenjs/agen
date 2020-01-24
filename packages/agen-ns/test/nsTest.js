const expect = require('expect.js');
const { getGlobal, setGlobal, ns } = require('..');

describe('ns', function() {

  it(`should be able to get and update global variables`, async () => {
    const name = 'FooBar';
    const FooBar = {};
    expect(name in ns).to.be(false);
    expect(getGlobal(name)).to.be(undefined);
    expect(setGlobal(name, FooBar)).to.be(FooBar);
    expect(getGlobal(name)).to.be(FooBar);
    expect(name in ns).to.be(true);
  })

});
