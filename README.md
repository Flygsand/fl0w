# fl0w

[![Build Status](https://travis-ci.org/wowgroup/fl0w.svg?branch=master)](https://travis-ci.org/wowgroup/fl0w)

Flow control for Node streams.

## Usage

```
npm install fl0w
```

```js
// test.js
var _ = require('highland')
  , when = require('fl0w/when');

function length(s) {
  return s.trim().length;
}

_(process.stdin)
  .splitBy(' ')
  .through(when(length, {
    4: _().invoke('toUpperCase')
  }))
  .intersperse(' ')
  .pipe(process.stdout);
```

```
~ $ echo "My name is Luka" | node test.js
My NAME is LUKA
```
