const expect = require('expect.js');
const { fetchData } = require('..');
const http = require('http');

const { setGlobal } = require('@agen/ns');
setGlobal('fetch', require('node-fetch'));
setGlobal('AbortController', require('node-abort-controller'));


describe('fetchData', async function() {
  const port = 5001;
  testData(['']);
  testData(['a']);
  testData(['Hello, world']);
  testData(['Hello', 'world']);
  testData(generateStrings(1, 10, 100));
  testData(generateStrings(10, 10, 100));
  testData(generateStrings(100, 10, 100));
  testData(generateStrings(500, 10, 100));
  testData(generateStrings(1000, 10, 100));
  testData(generateStrings(1000, 10, 1024));
  testData(generateStrings(1000, 10, 10 * 1024));

  function testData(data) {
    const len = data.reduce((sum, block) => sum += block.length, 0);
    it(`should be able to read ${len} bytes from HTTP streams`, async () => await run(data, async () => {
      const url = `http://127.0.0.1:${port}/`
      const gen = fetchData(url);
      const test = await read(gen);
      const control = await read(data);
      expect(test.length).to.eql(control.length);
      expect(test).to.eql(control);
    }));

    async function read(gen) {
      let result = '';
      for await (let block of gen) {
        result += block.toString();
      }
      return result;
    }
  }

  function generateStrings(count, minLen, maxLen) {
    const result = [];
    for (let i = 0; i < count; i++) {
      const len = Math.min(minLen + Math.round(Math.random() * (maxLen - minLen)), maxLen);
      result.push(generateString(len));
    }
    return result;

    function generateString(length) {
       let result = '';
       const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
       }
       return result + '\n';
    }
  }

  async function run(data, action) {
    const server = await startServer(port, data);
    try {
      return await action();
    } finally {
      await stopServer(server);
    }
  }

  async function startServer(port, gen) {
    const server = http.createServer(async (req, res) => {
      for await (let chunk of gen) {
        res.write(chunk);
      }
      res.end(); //end the response
    })
    await new Promise((y,n) => server.listen(port, (err) => err ? n(err) : y()));
    return server;
  }

  async function stopServer(server) {
    if (!server) return;
    return new Promise((y, n) => server.close((err) => err ? n(err) : y()));
  }

});
