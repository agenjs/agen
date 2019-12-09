@agen/buffers
=============

Transform individual elements from parent generator to/from Buffer instances.

There are following methods in this package:

* `buffersFromStrings` - transforms sequence of encoded strings to corresponding sequence of Buffer instances
* `buffersToLines` - transforms sequence of Buffer instances to sequence of strings; each buffer is decoded and splitted to individual lines
* `fixedSizeBuffers` - sequence of Buffers with different length is transformed to a sequence of buffers with the same length

`buffersFromStrings` method
---------------------------

This method accepts the following parameters:
* generator - asynchronous generator providing inidvidual strings
* enc - encoding used to transform strings to corresponding buffers; UTF-8 by default

It returns an asynchronous generator providing Buffer instances.


Example:
```javascript

const bufs = require('@agen/buffers');
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
for await (let b of bufs.buffersFromStrings(list)) {
  console.log('-', b, Buffer.isBuffer(b));
}
// Will print
// - <Buffer 69 74 65 6d 2d 30> true
// - <Buffer 69 74 65 6d 2d 31> true
// - <Buffer 69 74 65 6d 2d 32> true
// - <Buffer 69 74 65 6d 2d 33> true
// - <Buffer 69 74 65 6d 2d 34> true
// - <Buffer 69 74 65 6d 2d 35> true
// - <Buffer 69 74 65 6d 2d 36> true
// - <Buffer 69 74 65 6d 2d 37> true

```


`buffersToLines` method
-----------------------
This method transforms Buffer instances to sequence of lines, encoded in these
buffers. To transform Buffers to strings user can define custom encoding
(UTF-8 is used by default).


Parameters:
* generator - asynchronous generator providing Buffer instances
* enc - encoding used to transform buffers to strings; UTF-8 by default

It returns an asynchronous generator providing individual lines.


Example:
```javascript
  const bufs = require('@agen/buffers');

  // Sequence of Buffer instances
  const list = [
    'Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit. \nPellentesque ',
    'vulputate tortor ac \ntortor placerat mattis. Cras auctor erat ut \nsem ',
    'varius, id eleifend felis dictum. \nAenean non lobortis leo.\n',
    'Morbi cursus vestibulum est sit amet sollicitudin. \nNunc laoreet metus ',
    'malesuada enim laoreet porttitor tincidunt a tellus. Quisque eget commodo ',
    'ipsum.\nSed aliquet iaculis erat, ut posuere dolor condimentum sit amet.'
  ].map(Buffer.from);

  for await (let str of bufs.buffersToLines(list)) {
    console.log('-', str);
  }

  // Will print:
  // - Lorem ipsum dolor sit amet,
  // - consectetur adipiscing elit.
  // - Pellentesque vulputate tortor ac
  // - tortor placerat mattis. Cras auctor erat ut
  // - sem varius, id eleifend felis dictum.
  // - Aenean non lobortis leo.
  // - Morbi cursus vestibulum est sit amet sollicitudin.
  // - Nunc laoreet metus malesuada enim laoreet porttitor tincidunt a tellus. Quisque eget commodo ipsum.
  // - Sed aliquet iaculis erat, ut posuere dolor condimentum sit amet.
```

`fixedSizeBuffers` method
-----------------------

This method transforms sequence of buffers of various sizes to buffers of the same
size.

Parameters:
* generator - asynchronous generator providing Buffer instances of various sizes
* size - size of the resulting buffers


Example:
```javascript
  const bufs = require('@agen/buffers');

  const list = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ',
    'vulputate tortor ac tortor placerat mattis. Cras auctor erat ut sem ',
    'varius, id eleifend felis dictum. Aenean non lobortis leo.',
    'Morbi cursus vestibulum est sit amet sollicitudin. Nunc laoreet metus ',
    'malesuada enim laoreet porttitor tincidunt a tellus. Quisque eget commodo ',
    'ipsum. Sed aliquet iaculis erat, ut posuere dolor condimentum sit amet.'
  ].map(Buffer.from);

  const bufLen = 30;
  for await (let b of bufs.fixedSizeBuffers(list, bufLen)) {
    console.log('-', b.toString());
  }

  // Will print:
  // - Lorem ipsum dolor sit amet, co
  // - nsectetur adipiscing elit. Pel
  // - lentesque vulputate tortor ac
  // - tortor placerat mattis. Cras a
  // - uctor erat ut sem varius, id e
  // - leifend felis dictum. Aenean n
  // - on lobortis leo.Morbi cursus v
  // - estibulum est sit amet sollici
  // - tudin. Nunc laoreet metus male
  // - suada enim laoreet porttitor t
  // - incidunt a tellus. Quisque ege
  // - t commodo ipsum. Sed aliquet i
  // - aculis erat, ut posuere dolor
  // - condimentum sit amet.
```
