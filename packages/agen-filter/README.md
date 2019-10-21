@agen/filter
-----------

Filters (removes) individual items from parent async generator.

This method accepts the following parameters:
* generator - asynchronous generator providing inidvidual elements
* filter - method checking individual elements; if this method returns true then
  this element appears in the resulting sequence; Filters gets two parameters:
  - item to check
  - current item index

It returns an asynchronous generator providing accepted elements.


Example 1: filtering by the element value
```javascript

const batch = require('@agen/batch');

...
const list = [
  'First Message',
  'Hello world',
  'Second Message',
  'Hello John Smith'
]
for await (let item of filter(list, (v, i) => v.indexOf('Hello') >= 0)) {
  console.log('-', item);
}
// Will print
// - Hello world
// - Hello John Smith
```

Example 2: filtering by the element index
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
for await (let item of filter(list, (v, i) => i % 2 === 0)) {
  console.log('-', item);
}
// Will print
// - item-0
// - item-2
// - item-4
// - item-6

```
