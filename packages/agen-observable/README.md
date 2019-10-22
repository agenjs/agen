@agen/observable
================

Utility methods to transform observables to async generators. Contains
basic Observable implementation.

observe
--------

This method transforms calls to an observer in an async generator.

Example 1: Create An Basic Async Generator
```javascript

const { observe } = require('@agen/observable');

// Create a new async generator:
const gen = observe(async (o) => {
  for (let i = 0; i < 5; i++) {
    await new Promise(r => setTimeout(r, 100));
    o.next(`item-${i}`);
  }
  o.complete();
})

// Use this async generator to iterate over the list of returned items.
// This code will print a new item each 100 ms.
for async (let item of gen) {
  console.log('-', item);
}

```

Example 2: Stop Item Generation
```javascript

const { observe } = require('@agen/observable');

// Create a new async generator:
const gen = observe((o) => {
  // This flag is used to stop generation of new values
  let stop = false;
  (async () => {
    // At each iteration we are checking that we can continue
    for (let i = 0; !stop && i < 5000; i++) {
      await new Promise(r => setTimeout(r, 100));
      // Check that the iteration was not stopped during the sleep time.
      if (stop) break;
      o.next(`item-${i}`);
    }
    o.complete();
    // This message is shown *after* all iterations.
    console.log('Provider is closed').
  })();
  return () => stop = true;
})

// Use this async generator. This code will print a new item each 100 ms.
let counter = 0;
for async (let item of gen) {
  console.log('-', item);
  if (counter++ > 5) break;
}

```


Observable
----------

Basic implementation of the Observable pattern. By default this Observable
implementaion is used for async generators provided by this module.

Example 1: Basic Iteration
```javascript

const { Observable } = require('@agen/observable');

const o  = new Observable(observer => {
  observer.next('A');
  observer.next('B');
  observer.complete();
})

o.subscribe({
  next : (value) => console.log('- ', value),
  complete : () => console.log('Done.'),
  error : (err) => console.log('Error:', err)
})
// Prints
// - A
// - B
// Done.
```

Example 2: Error Generation
```javascript

const { Observable } = require('@agen/observable');

const o  = new Observable(observer => {
  observer.next('A');
  observer.next('B');
  observer.error('I AM AN ERROR');
})

o.subscribe({
  next : (value) => console.log('- ', value),
  complete : () => console.log('Done.'),
  error : (err) => console.log('Error:', err)
})
// Prints:
// - A
// - B
// Error: I AM AN ERROR
```

Example 3: Cleaning Up Resources After Iterations
```javascript

const { Observable } = require('@agen/observable');

const o  = new Observable(observer => {
  (async () => {
    for (let i = 0; i < 5; i++) {
      observer.next('item-' + i)
    }
    observer.complete();
  })();
  return () => console.log('Cleanup resources');
})

o.subscribe({
  next : (value) => console.log('- ', value),
  complete : () => console.log('Done.'),
  error : (err) => console.log('Error:', err)
})
// Prints:
// - item-0
// - item-1
// - item-2
// - item-3
// - item-4
// Done.
// Cleanup resources.
```
