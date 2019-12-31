const expect = require('expect.js');
const { jsonToStrings } = require('..');

describe('jsonToStrings', async () => {
  it(`should transform sequence objects to serialized JSONs`, async () => {
    const control = [];
    let count = 100;
    for (let i = 0; i < count; i++) {
      control.push({ id : i, message : `Hello-${i}` });
    }

    let i = 0;
    for await (let obj of jsonToStrings(control)) {
      expect(obj).to.eql(JSON.stringify(control[i++]));
    }
    expect(i).to.eql(control.length);
  })
});
