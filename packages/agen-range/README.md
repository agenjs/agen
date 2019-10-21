@agen/range
-----------

Returns specified range of itemsfrom the parent async generator.

This method accepts the following parameters:
* generator - asynchronous generator providing items
* min - minimal index of the returned elements; 0 by default
* max - maximal index of returned items; Inifinity by default

It returns an asynchronous generator providing items from the specified range.


Example:
```javascript

const batch = require('@agen/range');

...
const list = [ 'a', 'b', 'c', 'd', 'e', 'f' ]
for await (let item of range(list, 1, 3) {
  console.log('-', item);
}
// Will print
// - b
// - c
// - d

```
