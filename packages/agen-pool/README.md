@agen/pool
==========

This package allows to handle multiple items in parallel. The number of
simpultaniously running operations is defined by the size of the pool.

This method accepts the following parameters:
* generator - asynchronous generator providing inidvidual items to handle
* action - asynchroneous method to call with a new item
* poolSize - maximal number of running actions

It returns an asynchronous generator providing results of the actions items.


Example:
```javascript

  const { pool } = require('@agen/pool');

  const  list = [
    'Abilene',
    'Acton',
    'Addison',
    'Adley',
    'Alberta',
    'Alcott',
    'Bell',
    'Bellamy',
    'Bellow',
    'Benson',
    'Farley',
    'Faron',
    'Farrah',
    'Faulkner',
    'Faxon',
    'Faye',
    'Fear',
    'February',
    'Ferebee',
    'Lennon',
    'Lenora',
    'Leonora',
    'Leontyne',
    'Lester',
    'Lettice',
    'Lettie',
    'Letty',
    'Lewis',
    'Libby',
    'Lilac',
    'Lilian',
    'Lillian',
    'Lilly'
  ]

  const action = async (name) => {
    const timeout = Math.random() * 4000;
    await new Promise(r => setTimeout(r, timeout));
    return `Hello ${name}!`
  }
  for await (let greeting of pool(list, action, 5)) {
    console.log('-', greeting);
  }
  // Will print greetings in random order
  // (depending on the random timeout in the "action" method):
  // - Hello Acton!
  // - Hello Abilene!
  // - Hello Addison!
  // - Hello Adley!
  // - Hello Bell!
  // - Hello Alberta!
  // - Hello Alcott!
  // - Hello Bellamy!
  // - Hello Benson!
  // ...

```
