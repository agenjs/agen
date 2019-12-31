require('./jsonFromArraysTest');
require('./jsonFromStringsTest');
require('./jsonToStringsTest');
require('./jsonConvertTest');

const expect = require('expect.js');
const { jsonFromStrings, jsonToStrings } = require('..');

describe('jsonToStrings/jsonFromStrings', async () => {
  it(`should transform objects to strings and parse them back`, async () => {
    const control = [];
    let count = 100;
    for (let i = 0; i < count; i++) {
      control.push({ id : i, message : `Hello-${i}` });
    }
    let i = 0;
    let provider;
    provider = jsonToStrings(control);
    provider = jsonFromStrings(provider);
    for await (let obj of provider) {
      expect(obj).to.eql(control[i++]);
    }
    expect(i).to.eql(control.length);
  })
});
