const path = require('path');
const fs = require('fs');
const { DataReader, DataWriter, ieee754 } = require('../dist/agen-zip');
const ZipParser = require('./ZipParser');
const { inflate } = require('@agen/gzip');

return Promise.resolve().then(main).catch(console.log);

async function main() {
  // const block = fs.readFileSync(path.resolve(__dirname, './hello.zip'));
  const block = fs.readFileSync(path.resolve(__dirname, './agen-utils.zip'));
  const parser = new ZipParser();
  for await (let entry of parser.parseZip([block])) {
    let content = entry.data;
    // if (entry.properties.compressedSize !== entry.properties.size) {
      // content = inflate(content);
    // }
    console.log('XXXX', entry, content);
    for await (let block of content) {
      console.log('>>>>>>>>>', block.toString());
    }

    // // await new Promise(y => setTimeout(y, 500));
    // if (entry.properties.compressedSize !== entry.properties.size) {
    //   content = inflate(content);
    // }
    // for await (let block of content) {
    //   console.log('????', Buffer.from(block).toString('UTF-8'));
    // }
  }
}
