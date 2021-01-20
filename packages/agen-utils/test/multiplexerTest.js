const expect = require('expect.js');
const { multiplexer } = require('../');

describe('multiplexer', async function() {

  it(`sync: should dispatch the same values between multiple readers`, async () => {
    await test([]);
    await test(['']);
    await test(['a']);
    await test(['a', 'b', 'c']);
    await test(['a', 'b', 'c', 'd', 'd']);
    async function test(strings) {
      let observer;
      let m = multiplexer(o => observer = o);
      const promises = [];
      const n = 10;
      let test = [];
      for (let i = 0; i < n; i++) {
        const it = m();
        const list = [];
        test.push(list);
        promises.push((async (it, list) => {
          for await (let item of it) {
            list.push(item);
          }
        })(it, list));
      }
      const control = [];
      for (let i = 0; i < n; i++) {
        const list = [];
        control.push(list);
        for (let str of strings) { list.push(str); }
      }

      for (let str of strings) {
        observer.next(str);
      }
      observer.complete();
      await Promise.all(promises);
      expect(test).to.eql(control);
    }
  })

  it(`async: should dispatch the same values between multiple readers`, async () => {
    await test([]);
    await test(['']);
    await test(['a']);
    await test(['a', 'b', 'c']);
    await test(['a', 'b', 'c', 'd', 'd']);
    async function test(strings) {
      let observer;
      let m = multiplexer(o => observer = o);
      const promises = [];
      const n = 10;
      let test = [];
      for (let i = 0; i < n; i++) {
        const it = m();
        const list = [];
        test.push(list);
        promises.push((async (it, list) => {
          for await (let item of it) {
            list.push(item);
            await new Promise(r => setTimeout(r, Math.random() * 5));
          }
        })(it, list));
      }
      const control = [];
      for (let i = 0; i < n; i++) {
        const list = [];
        control.push(list);
        for (let str of strings) { list.push(str); }
      }

      for (let str of strings) {
        observer.next(str);
      }
      observer.complete();
      await Promise.all(promises);
      expect(test).to.eql(control);
    }
  })

  it(`should wait for dispatching of each value between iterators`, async () => {
    await test([]);
    await test(['']);
    await test(['a']);
    await test(['a', 'b', 'c']);
    await test(['a', 'b', 'c', 'd', 'd']);
    async function test(strings) {
      let observer;
      let m = multiplexer(o => observer = o);
      const promises = [];
      const n = 10;
      let test = [];
      let finished = 0;
      for (let i = 0; i < n; i++) {
        const it = m();
        promises.push((async (it, i) => {
          for await (let item of it) {
            test.push(item);
            await new Promise(r => setTimeout(r, Math.random() * 5));
          }
          finished++;
        })(it, i));
      }

      for (let str of strings) {
        test = [];
        await observer.next(str);
        const control = [];
        for (let i = 0; i < n; i++) { control.push(str); }
        expect(test.length).to.eql(control.length)
        expect(test).to.eql(control);
      }
      await observer.complete();
      await Promise.all(promises);
      expect(finished).to.eql(n);
    }
  })
});
