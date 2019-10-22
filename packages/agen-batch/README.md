@agen/batch
===========

Transform individual items from parent generator to a sequence of generators.

There are following methods in this package:
* `batch` - transforms sequence of items to arrays of the specified size
* `chunks` - transforms sequence of items to series of async generators using
  provided "begin" and "end" methods defining start and end of each chunk
* `series` - splits sequence of items to sequence of async generators using
  a specified method defining the end of the previous serie.


`batch` method
--------------

This method accepts the following parameters:
* generator - asynchronous generator providing inidvidual elements
* batchSize - size of returned batches; default value is 10

It returns an asynchronous generator providing element batches (arrays)  
of the specified  size.


Example:
```javascript

const batch = require('@agen/batch');

...
const list = [
  'item-0',
  'item-1',
  'item-2',
  'item-3',
  'item-4',
  'item-5',
  'item-6',
  'item-7'
]
for await (let b of batch(list, 3) {
  console.log('-', b);
}
// Will print
// - ['item-0', 'item-1', 'item-2']
// - ['item-3', 'item-4', 'item-5']
// - ['item-6', 'item-7']

```


`chunks` method
---------------

This method accepts the following parameters:
* generator - asynchronous generator providing inidvidual elements
* begin - a function returning `true` when a new chunk starts
* end - a function returning `true` when the current chunk should be finished

It returns an asynchronous generator providing new async generators giving
access to a subset of elements from the initial sequence.


Example:
```javascript

const { chunk } = require('@agen/batch');

...
const list = [
  'item-0',
  'item-1',
  'item-2',
  'item-3',
  'item-4',
  'item-5',
  'item-6',
  'item-7'
]
const begin = (v, i) => i % 2 === 0;
const end = (v, i) => i % 5 === 0;
for await (let chunk of chunks(list, begin, end)) {
  // Each chunk is an async generator giving access to sub-set of items
  console.log('---------------');
  for await (let item of chunk) {
    console.log('*', item);
  }
}
// Will print:
// ---------------
// * item-0
// * item-1
// * item-2
// * item-3
// * item-4
// * item-5
// ---------------
// * item-6
// * item-7

```
