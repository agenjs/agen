const expect = require('expect.js');
const { jsonFromArrays } = require('..');

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


  it(`should transform an array to json objects with pre-defined headers`, async () => {
    const headers = ['firstName', 'lastName', 'age'];
    const data = [
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
    for await (let obj of jsonFromArrays(data, { headers, mapping })) {
      expect(obj).to.eql(control[i++]);
    }
    expect(i).to.eql(control.length);
  })

  it(`should transform an array to json objects with a mapping function`, async () => {
    const headers = ['firstName', 'lastName', 'age'];
    const data = [
      ['firstName', 'lastName', 'age', 'description'],
      ['John', 'Smith', '35', 'Hello, there!'],
      ['James', 'Bond', '50', 'Bond, James Bond!']
    ]
    const control = [
      { a : 'John', b : 'Smith', c : 35 },
      { a : 'James', b : 'Bond', c : 50 },
    ];
    let i = 0;
    const mapping = (f) => {
      if (f === 'firstName') return 'a';
      if (f === 'lastName') return 'b';
      if (f === 'age') return (o, v) => (o.c = +v);
      return null;
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
