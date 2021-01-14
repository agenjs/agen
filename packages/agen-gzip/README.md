@agen/gzip
===========

This package contains methods providing async generators deflating / inflating
(gzipping / gunzipping) binary input blocks:

* `inflate` method transforms async generators providing compressed blocs to
  an async generators of decompressed blocs
* `deflate` method returns an async generator compressing input blocks and
  it yields binary blocks of reduced sizes


This module uses the `pako` package (the MIT license) to inflate/deflate streams:
https://github.com/nodeca/pako.

`inflate`
---------

This method decompress (inflates) binary data retunred by the input async
generators.
This method is based on the `pako.Inflate` class.

Parameters:
* generator - asynchronous generator providing inidvidual blocks to inflate
* options - optional parameters (see the `pako.Inflate` class)

Example: get binary data from the specified URL:
```javascript

import { createReadStream } from 'fs';
import { inflate } from '@agen/gzip';

(async () => {
  // Streams in NodeJS are also async generators providing binary blocks
  let input = createReadStream('./myfile.gz');
  const options = {}; // not required
  input = inflate(input, options);
  for await (let chunk of gen) {
    console.log('*', chunk);
  }
})();

```

`deflate`
---------

This method returns an async generator compressing (deflating) binary blocks
comming from the input async generator (input stream).

This method is based on the `pako.Deflate` class.

Parameters:
* generator - asynchronous generator providing inidvidual blocks to deflate
* options - optional parameters (see the `pako.Deflate` class)

Example:
```javascript

import { createReadStream } from 'fs';
import { deflate } from '@agen/gzip';

(async () => {
  // Streams in NodeJS are also async generators providing binary blocks
  let input = createReadStream('./myfile.pdf');
  const options = {};
  input = deflate(input, options);
  for await (let chunk of gen) {
    console.log('*', chunk);
  }
})();

```
