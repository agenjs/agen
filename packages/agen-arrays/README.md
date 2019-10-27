@agen/arrays
============

This package deals with stream of arrays.


There are following methods in this package:
* `arraysFromDsv` - transforms strings to arrays by splitting them with a
  delimiter - like "," for comma separated files (CSV)
* `arraysToDsv` - transforms arrays to DSV strings


`arraysFromDsv` method
--------------

This method accepts the following parameters:
* generator - asynchronous generator providing inidvidual strings
* options - object with method configurations
* options.delimiter - delimiter used to split strings to arrays; by default
  this is a ";"

It returns an asynchronous generator providing arrays; one array
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


`arraysToDsv` method
--------------------

Transforms sequence of arrays to sequence of serialized DSV strings (like
comma-separated values).

This method accepts the following parameters:
* generator - asynchronous generator providing inidvidual arrays
* options - object with method configurations
* options.delimiter - delimiter used to format strings from arrays; by default
  this is the ";" symbol

It returns an asynchronous generator providing arrays of strings.


Example:
```javascript
const { arraysToDsv } = require('./');

Promise.resolve().then(main).catch(console.log);

async function main() {
  const list = [
    [ 'Hello', ' world' ],
    [ 'Second', ' line', ' with', ' strings' ],
    [],
    [ 'Third', ' line' ]
  ]
  for await (let str of arraysToDsv(list, { delimiter : ',' })) {
    console.log('-', str);
  }
}
// Will print:
// - [ 'Hello', ' world' ]
// - [ 'Second', ' line', ' with', ' strings' ]
// - []
// - [ 'Third', ' line' ]
```
