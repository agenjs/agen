@agen/fetch
===========

This package contains methods transforming standard `fetch` method
to an async generator for data blocks.
In browsers it uses the standard `fetch` method and `AbortController` class.
In NodeJS environment the `node-fetch` and the `node-abort-controller`
polyfills should be used (see example below).
to implement the `fetchData` - a cancellable fetch.

This package contains the following methods:
* `fetchData` - returns an async iterator over binary blocks fetched from
  the specified URL
* `fetchWithAbort` - launches a globally available `fetch` method and
  returns the result with added `abort` method; it is implemented using
  globally available `AbortController` class (see below)


`fetchData`
-----------

This method retrieves binary data from the specified HTTP resource and
yields them as an async generator over binary chunks.
This method accepts the same parameters as the standard `fetch` method.

Example: get binary data from the specified URL:
```javascript

import { fetchData } from '@agen/fetch';

(async () => {
  const url = 'http://localhost:8080/my/images/img.jpg';
  const gen = fetchData(url);
  for await (let chunk of gen) {
    console.log('*', chunk);
  }
})();

```

See below how to use this method in the NodeJS environment.

`fetchWithAbort`
---------------

This method launches the standard `fetch` method and adds a `abort` method on
the resulting object. To do so it uses the `AbortController` class.

Example:
```javascript

import { fetchWithAbort } from '@agen/fetch';

(async () => {
  const url = 'http://localhost:8080/my/images/img.jpg';
  const res = await fetchWithAbort(url);
  ...
  await res.abort(); // Stop data loading

})();

```

See below how to use this method in the NodeJS environment.


Overloading `fetch` and `AbortController`
-----------------------------------------

In NodeJS environment the packages `node-fetch` and `node-abort-controller`
should be used in the following way:

```javascript

const { getGlobal } = require('@agen/ns');

setGlobal('fetch', require('node-fetch'));
setGlobal('AbortController', require('node-abort-controller'));

(async () => {
  const url = 'http://localhost:8080/my/images/img.jpg';
  const gen = fetchData(url);
  for await (let chunk of gen) {
    console.log('*', chunk);
  }
})();

```
