const expect = require('expect.js');
const { observe } = require('../src/');
const toAsyncGenerator = require('./toAsyncGenerator');
const timeout = require('./timeout');

describe('observer', async () => {

  const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

  it (`should be able notify about all sync events without waiting the return; no timeouts`, async () => {
    let finished = false;
    const gen = observe(async (observer) => {
      (async() => {
        try {
          for await (let item of list) {
            await observer.next(item);
          }
          finished = true;
          await observer.complete();
        } catch (err) {
          await observer.error(err);
        }
      })();
    });

    let counter = 0;
    for await (let n of gen) {
      expect(n).to.eql(list[counter++]);
    }
    expect(finished).to.be(true);
  })

  it (`should be able notify about all sync events without waiting the return; there is a timeout in the consumer`, async () => {
    let finished = false, end = false;
    const gen = observe(async (observer) => {
      (async() => {
        try {
          for await (let item of list) {
            await observer.next(item);
          }
          finished = true;
          await observer.complete();
        } catch (err) {
          await observer.error(err);
        }
      })();
    });

    let counter = 0;
    const maxTimeout = 10;
    for await (let n of gen) {
      expect(n).to.eql(list[counter++]);
      await timeout(Math.round(maxTimeout * Math.random()));
    }
    expect(finished).to.be(true);
  })

  it (`should be able to transform individual events to an async generator`, async () => {
    let started = false, finished = false;
    const gen = observe(async (observer) => {
      (async() => {
        try {
          const asyncList = toAsyncGenerator(list);
          started = true;
          for await (let item of asyncList) {
            await observer.next(item);
          }
          await observer.complete();
        } catch (err) {
          await observer.error(err);
        }
        finished = true;
      })();
    });

    let counter = 0;
    const maxTimeout = 50;
    for await (let n of gen) {
      expect(started).to.be(true);
      expect(n).to.eql(list[counter++]);
      await timeout(Math.round(maxTimeout * Math.random()));
    }
  })

  it (`should be able to wait until the observer return the control`, async () => {
    const gen = observe(async (observer) => {
      (async() => {
        try {
          const asyncList = toAsyncGenerator(list);
          for await (let item of asyncList) {
            await observer.next(item);
          }
          await observer.complete();
        } catch (err) {
          await observer.error(err);
        }
      })();
    });

    let counter = 0;
    const maxTimeout = 50;
    for await (let n of gen) {
      expect(n).to.eql(list[counter++]);
      await timeout(Math.round(maxTimeout * Math.random()));
    }
  })

  it (`should be able to call a sync cleanup method`, async () => {
    let finished = false;
    const gen = observe((observer) => {
      (async() => {
        try {
          for await (let item of list) {
            observer.next(item);
          }
          await observer.complete();
        } catch (err) {
          await observer.error(err);
        }
      })();
      // Returns the cleanup method
      return () => finished = true;
    });

    let counter = 0;
    for await (let n of gen) {
      expect(n).to.eql(list[counter++]);
    }
    expect(finished).to.be(true);
  })

  it (`should be able to call an async cleanup method`, async () => {
    let finished = false;
    const gen = observe((observer) => {
      (async() => {
        try {
          for await (let item of list) {
            observer.next(item);
          }
          await observer.complete();
        } catch (err) {
          await observer.error(err);
        }
      })();
      // Returns an async cleanup method
      return async () => {
        finished = true;
        await timeout(100);
      }
    });

    let counter = 0;
    for await (let n of gen) {
      expect(n).to.eql(list[counter++]);
    }
    expect(finished).to.be(true);
  })


  it (`should be able to rise errors`, async () => {
    let error;
    const gen = observe(async (observer) => {
      observer.error('Hello, there!');
    });
    try {
      for await (let n of gen) {}
    } catch (err) {
      error = err;
    }
    expect(error).to.eql('Hello, there!');
  })

  it (`should be able to rise async errors`, async () => {
    let error;
    const gen = observe(async (observer) => {
      await timeout(50);
      observer.error('Hello, there!');
    });
    try {
      for await (let n of gen) {}
    } catch (err) {
      error = err;
    }
    expect(error).to.eql('Hello, there!');
  })

  it (`should be able to rise errors after some iterations`, async () => {
    let error;
    const gen = observe(async (observer) => {
      observer.next(list[0]);
      observer.next(list[1]);
      observer.next(list[2]);
      observer.error('Hello, there!');
    });
    let counter = 0;
    try {
      for await (let n of gen) {
        expect(n).to.eql(list[counter++]);
      }
    } catch (err) {
      error = err;
    }
    expect(error).to.eql('Hello, there!');
    expect(counter).to.be(3);
  })


  it (`should be able to rise errors after some async iterations`, async () => {
    let error;
    const gen = observe(async (observer) => {
      observer.next(list[0]);
      await timeout(10);
      observer.next(list[1]);
      await timeout(10);
      observer.next(list[2]);
      await timeout(10);
      observer.error('Hello, there!');
    });
    let counter = 0;
    try {
      for await (let n of gen) {
        expect(n).to.eql(list[counter++]);
      }
    } catch (err) {
      error = err;
    }
    expect(error).to.eql('Hello, there!');
    expect(counter).to.be(3);
  })


  it (`should be able to call an async cleanup method after errors`, async () => {
    let finished = false;
    const gen = observe(async (observer) => {
      (async() => {
        observer.next(list[0]);
        await timeout(10);
        observer.next(list[1]);
        await timeout(10);
        observer.next(list[2]);
        await timeout(10);
        observer.error('Hello, there!');
      })();
      // Returns an async cleanup method
      return async () => {
        await timeout(20);
        finished = true;
      }
    });
    let error, counter = 0;
    try {
      for await (let n of gen) {
        expect(finished).to.be(false);
        expect(n).to.eql(list[counter++]);
      }
    } catch (err) {
      error = err;
    }
    expect(error).to.eql('Hello, there!');
    expect(counter).to.be(3);
    // expect(finished).to.be(true);
  })

});
