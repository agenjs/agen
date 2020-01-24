const expect = require('expect.js');
const { getGlobal } = require('@agen/ns');
const { observableToGenerator } = require('..');

const Observable = getGlobal('Observable');
const toAsyncGenerator = require('./toAsyncGenerator');
const timeout = require('./timeout');

module.exports = async (Observable) => {

  const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

  it (`Observable: should be able to notify all sync values`, async () => {
    let finished = false;
    const observable = new Observable((observer) => {
      try {
        for (let item of list) {
          observer.next(item);
        }
        observer.complete();
      } catch (err) {
        observer.error(err);
      }
      finished = true;
    })
    const values = [];
    let resolve, promise = new Promise((r) => resolve = r);
    let counter = 0, error, done;
    observable.subscribe({
      next(v) { values.push(v); },
      error(e) { error = e; done = true; resolve(); },
      complete() { done = true; resolve(); }
    })
    await promise;
    expect(values).to.eql(list);
    expect(finished).to.be(true);
    expect(done).to.be(true);
    expect(error).to.be(undefined);
  })


  it (`Observable: should be able to notify all async values`, async () => {
    let finished = false;
    const observable = new Observable((observer) => {
      (async() => {
        try {
          for await (let item of list) {
            observer.next(item);
          }
          observer.complete();
        } catch (err) {
          observer.error(err);
        }
        finished = true;
      })();
    })
    const values = [];
    let counter = 0, error, done, promise = new Promise(y => done = y);
    observable.subscribe({
      next(v) { values.push(v); },
      error(e) { error = e; done(); },
      complete() { done(); }
    })

    await promise;
    expect(values).to.eql(list);
    expect(finished).to.be(true);
    expect(error).to.be(undefined);
  })

  it (`Observable: should be able to subscribe with functions`, async () => {
    let finished = false;
    const observable = new Observable((observer) => {
      try {
        for (let item of list) {
          observer.next(item);
        }
        observer.complete();
      } catch (err) {
        observer.error(err);
      }
      finished = true;
    })
    const values = [];
    let resolve, promise = new Promise((r) => resolve = r);
    let counter = 0, error, done;
    observable.subscribe(
      (v) => values.push(v),
      (e) => { error = e; done = true; resolve(); },
      () => { done = true; resolve(); }
    );
    await promise;

    expect(values).to.eql(list);
    expect(finished).to.be(true);
    expect(done).to.be(true);
    expect(error).to.be(undefined);
  })


  it (`Observable: should be able iterate over all values provided synchroniously`, async () => {
    let finished = false;
    const observable = new Observable((observer) => {
      try {
        for (let item of list) {
          observer.next(item);
        }
        observer.complete();
      } catch (err) {
        observer.error(err);
      }
      finished = true;
    })
    const values = [];
    let done;
    const gen = observableToGenerator(observable);
    for await (let value of gen) {
      values.push(value);
    }
    expect(values).to.eql(list);
    expect(finished).to.be(true);
  })

  it (`Observable: should be able iterate over all values provided asynchroniously`, async () => {
    let finished = false;
    const observable = new Observable((observer) => {
      (async() => {
        try {
          for await (let item of toAsyncGenerator(list)) {
            observer.next(item);
          }
          observer.complete();
        } catch (err) {
          observer.error(err);
        }
        finished = true;
      })();
    })
    const values = [];
    const gen = observableToGenerator(observable);
    for await (let value of gen) {
      timeout(10);
      values.push(value);
    }
    expect(values).to.eql(list);
    expect(finished).to.be(true);
  })

}
