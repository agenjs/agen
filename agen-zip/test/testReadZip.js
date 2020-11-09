const path = require('path');
const fs = require('fs');
const expect = require('expect.js');
const { DataReader, DataWriter, ieee754 } = require('..');
const ZipParser = require('./ZipParser');

describe('ReadZip', async function() {

  const EPSILON = 0.00001

  it('should...', async () => {
    const block = fs.readFileSync(path.resolve(__dirname, './hello.zip'));
    const parser = new ZipParser();
    parser.read(block);
    // let gen = fs.createReadStream(path.resolve(__dirname, './hello.zip'));
    // for await (let block of gen) {
    //
    //   console.log('block', block);
    // }
    // expect(Math.abs(num - val) < EPSILON).to.be(true);
  })


});
