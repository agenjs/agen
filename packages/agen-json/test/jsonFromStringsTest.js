const expect = require('expect.js');
const { jsonFromStrings } = require('..');

describe('jsonFromStrings', async () => {
  it(`should transform sequence of serialized objects to a stream of JSON instances`, async () => {
    const control = [];
    let count = 100;
    for (let i = 0; i < count; i++) {
      control.push({ id : i, message : `Hello-${i}` });
    }

    let i = 0;
    for await (let obj of jsonFromStrings(control.map(_ => JSON.stringify(_)))) {
      expect(obj).to.eql(control[i++]);
    }
    expect(i).to.eql(control.length);
  })
});
