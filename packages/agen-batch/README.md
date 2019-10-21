@agen/batch
-----------

Transform individual items from parent generator to a sequence of arrays
of the specified size.

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
