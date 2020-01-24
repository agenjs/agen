@agen/ns
========

Global namespace for `@agen` packages.

This package contains the following utility methods and fields:
* `ns` the namespace itself
* `getGlobal` - returns a global variable
* `setGlobal` - allows to overload/redefine a global variable used by other methods

Example: defining global variables for NodeJS platform (before v13):
```javascript

const { getGlobal, setGlobal } = require('@agen/ns');
if (!getGlobal('TextDecoder')) setGlobal('TextDecoder', require('util').TextDecoder);
...

```

`getGlobal`
-----------

This method returns a global variable with the specified name.
Parameters:
* name - name of the global variable to return

Example:
```javascript

const { getGlobal } = require('@agen/ns');
const TextEncoder = getGlobal('TextEncoder');
...
```

`setGlobal`
-----------

This method redefines a globally used variables:
* name - name of the variable
* value - a new value to set

Example:
```javascript

const { setGlobal } = require('@agen/ns');

setGlobal('TextEncoder', require('util').TextEncoder);
```
