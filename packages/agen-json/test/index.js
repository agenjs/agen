const expect = require('expect.js');
const { jsonFromArrays, jsonFromStrings, jsonToStrings } = require('..');

describe('jsonFromArrays', async () => {

  it(`should transform an array to a json object with default header`, async () => {
    const headers = ['firstName', 'lastName', 'age'];
    const data = [
      ['firstName', 'lastName', 'age'],
      ['John', 'Smith', '35'],
      ['James', 'Bond', '50']
    ]
    const control = [
      { firstName : 'John', lastName : 'Smith', age : '35' },
      { firstName : 'James', lastName : 'Bond', age : '50' },
    ];
    let i = 0;
    for await (let obj of jsonFromArrays(data)) {
      expect(obj).to.eql(control[i++]);
    }
    expect(i).to.eql(control.length);
  })

  it(`should transform an array to json objects with custom header mapping`, async () => {
    const headers = ['firstName', 'lastName', 'age'];
    const data = [
      ['firstName', 'lastName', 'age'],
      ['John', 'Smith', '35'],
      ['James', 'Bond', '50']
    ]
    const control = [
      { a : 'John', b : 'Smith', c : 35 },
      { a : 'James', b : 'Bond', c : 50 },
    ];
    let i = 0;
    const mapping = {
      firstName : 'a',
      lastName : 'b',
      age : (o, v) => (o.c = +v)
    }
    for await (let obj of jsonFromArrays(data, { mapping })) {
      expect(obj).to.eql(control[i++]);
    }
    expect(i).to.eql(control.length);
  })

  it(`should be able to split values`, async () => {
    const headers = ['firstName', 'lastName', 'age'];
    const data = [
      ['NAME', 'TAGS'],
      ['Apple', 'software,hardware'],
      ['Amazon', 'software,cloud,store'],
      ['Google', 'search,software,cloud'],
    ]
    const control = [
      { name : 'Apple', tags : ['software','hardware'] },
      { name : 'Amazon', tags : ['software','cloud','store'] },
      { name : 'Google', tags : ['search','software','cloud'] },
    ];
    let i = 0;
    const mapping = {
      NAME : 'name',
      TAGS : {
        field: 'tags',
        split: /[;,]/
      }
    }
    for await (let obj of jsonFromArrays(data, { mapping })) {
      expect(obj).to.eql(control[i++]);
    }
    expect(i).to.eql(control.length);
  })

})

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
