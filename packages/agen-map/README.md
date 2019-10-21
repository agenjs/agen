@agen/map
-----------

Transform items from the parent async generator to new values.

This method accepts the following parameters:
* generator - asynchronous generator providing inidvidual items
* map - method transforming the initial item

It returns an asynchronous generator providing transformed items.


Example:
```javascript

const batch = require('@agen/map');

...
const list = [ 'a', 'b', 'c' ]
for await (let item of map(list, (v, i) => v.toUpperCase()) {
  console.log('-', item);
}
// Will print
// - A
// - B
// - C

```
