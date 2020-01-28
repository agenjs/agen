@agen/gzip
===========

This package contains methods providing async generators deflating / inflating
(gzipping / gunzipping) binary input blocks:

* `inflate` method transforms async generators providing compressed blocs to
  an async generators of decompressed blocs
* `deflate` method returns an async generator compressing input blocks and
  it yields binary blocks of reduced sizes


`inflate`
---------

This method decompress (inflates) binary data retunred by the input async
generators.

Example: get binary data from the specified URL:
```javascript

import { createReadStream } from 'fs';
import { inflate } from '@agen/gzip';

(async () => {
  // Streams in NodeJS are also async generators providing binary blocks
  let input = createReadStream('./myfile.gz');
  input = inflate(input);
  for await (let chunk of gen) {
    console.log('*', chunk);
  }
})();

```

`deflate`
---------

This method returns an async generator compressing (deflating) binary blocks
comming from the input async generator (input stream).

Example:
```javascript

import { createReadStream } from 'fs';
import { deflate } from '@agen/gzip';

(async () => {
  // Streams in NodeJS are also async generators providing binary blocks
  let input = createReadStream('./myfile.pdf');
  input = deflate(input);
  for await (let chunk of gen) {
    console.log('*', chunk);
  }
})();

```
