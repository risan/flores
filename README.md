# Flores [WIP]

[![Build Status](https://badgen.net/travis/risan/flores)](https://travis-ci.org/risan/flores)
[![Test Covarage](https://badgen.net/codecov/c/github/risan/flores)](https://codecov.io/gh/risan/flores)
[![Greenkeeper](https://badges.greenkeeper.io/risan/flores.svg)](https://greenkeeper.io)
[![Latest Version](https://badgen.net/npm/v/flores)](https://www.npmjs.com/package/flores)

Minimalist static site generator.

## Installation

```bash
$ npm install flores
```

## Usage

```js
const flores = require("flores");

(async () => {
  await flores.build("/path/to/source");
})();
```

## API

### `flores.build`

Build the site for production.

```js
flores.build([basePath])
```

#### Parameters

* `basePath` (`String`): The site source path, default to the current working directory.

### `flores.serve`

Build the site and start the development server.

```js
flores.serve([basePath])
```

#### Parameters

* `basePath` (`String`): The site source path, default to the current working directory.

### `flores.watch`

Start the development server and the file watcher.

```js
flores.watch([basePath])
```

#### Parameters

* `basePath` (`String`): The site source path, default to the current working directory.

## License

[MIT](https://github.com/risan/flores/blob/master/LICENSE) © [Risan Bagja Pradana](https://bagja.net)
