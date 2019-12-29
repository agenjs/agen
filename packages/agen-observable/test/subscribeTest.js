const expect = require('expect.js');
const { observe, subscribe } = require('..');
const toAsyncGenerator = require('./toAsyncGenerator');
const timeout = require('./timeout');

describe('subscribe', async () => {

  const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

  it (`should be able to transform async generator to observer`, async () => {
    let values = [], resolve, reject;
    const promise = new Promise((y, n) => (resolve = y, reject = n));
    const h = subscribe(toAsyncGenerator(list), {
      next(v) { values.push(v); },
      complete : () => resolve('HELLO'),
      error : reject
    });
    expect(typeof h.start).to.eql('function');
    expect(typeof h.stop).to.eql('function');
    await h.start();
    expect(await promise).to.eql('HELLO');
    expect(values).to.eql(list);
  })

  it (`should be able to transform sync generator to observer`, async () => {
    let started = false, finished = false, error, values = [];
    const h = subscribe(list, {
      next(v) { started = true; values.push(v); },
      complete() { finished = true; },
      error(e) { error = e; }
    });

    expect(typeof h.start).to.eql('function');
    expect(typeof h.stop).to.eql('function');
    await h.start();
    await timeout(10);
    expect(values).to.eql(list);
    expect(finished).to.be(true);
    expect(error).to.be(undefined);
  })

  it (`should be able to transform generator to observer`, async () => {
    let started = false, finished = false;
    const gen = observe((observer) => {
      const asyncGenerator = toAsyncGenerator(list);
      const h = subscribe(asyncGenerator, observer);
      expect(typeof h.start).to.eql('function');
      expect(typeof h.stop).to.eql('function');
      h.start();
      started = true;
      return async () => {
        finished = true;
        await h.stop();
      }
    });

    let counter = 0;
    for await (let n of gen) {
      expect(started).to.be(true);
      expect(finished).to.be(false);
      expect(n).to.eql(list[counter++]);
    }
    expect(finished).to.be(true);
  })

});
