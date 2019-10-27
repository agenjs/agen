@agen/arrays
============

This package deals with stream of arrays.


There are following methods in this package:
* `arraysFromDsv` - transforms strings to arrays by splitting them with a
  delimiter - like "," for comma separated files (CSV)


`arraysFromDsv` method
--------------

This method accepts the following parameters:
* generator - asynchronous generator providing inidvidual strings
* options - object with method configurations
* options.delimiter - delimiter used to split strings to arrays; by default
  this is a ";"

It returns an asynchronous generator providing arrays of strings; one array
per input string.


Example:
```javascript
const { arraysFromDsv } = require('./');

Promise.resolve().then(main).catch(console.log);

async function main() {
  const list = [
    'Hello, world',
    'Second, line, with, strings',
    '',
    'Third, line'
  ]
  for await (let array of arraysFromDsv(list, { delimiter : ',' })) {
    console.log('-', array);
  }
}

// Will print:
// - [ 'Hello', ' world' ]
// - [ 'Second', ' line', ' with', ' strings' ]
// - []
// - [ 'Third', ' line' ]
```
