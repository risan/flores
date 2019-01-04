# Flores

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
  await flores.build();
})();
```

## API

### `flores.build`

Generate the website.

```js
flores.build([options])
```

#### Parameters

* `options` (`Object`): The [configuration options](#configuration-options).

### `flores.serve`

Generate the website and start the development server.

```js
flores.serve([options])
```

#### Parameters

* `options` (`Object`): The [configuration options](#configuration-options).

### `flores.watch`

Start the development server and watch for the file changes. It will automatically refresh the browser on file changes.

```js
flores.watch([options])
```

#### Parameters

* `options` (`Object`): The [configuration options](#configuration-options).

### Configuration Options

Configuration options is an optional `Object` that you can pass to `build`, `serve`, or `watch` methods.

* **`env`** (`String`): The environment name, default to `process.env.NODE_ENV`. If the `NODE_ENV` environment variable is not set, `production` will be set. Note that for `serve` and `watch` methods, the `env` value will always be set to `development`.
* **`url`** (`String`): The website URL, default to `http://localhost:4000`.
* **`basePath`** (`String`): The base path of your website project directory, default to `process.cwd()`.
* **`sourceDir`** (`String`): The directory for the website source relative to the `basePath`, default to `src`.
* **`outputDir`** (`String`): The directory where the generated website will be stored relative to the `basePath`, default to `public`,
* **`templatesDir`** (`String`): The templates directory relative to the `sourceDir`, default to `templates`.
* **`assetsDir`** (`String`): The CSS assets directory relative to the `sourceDir`, default to `assets`.
* **`defaultTemplate`** (`String`): The default template name for the markdown post, default to `post.njk`. You can override the template for individual post by providing the `template` field on the post's front matter.
* **`defaultCollectionTemplate`** (`String`): The default template name for the markdown post collection page, default to `collection.njk`. You can override the template for individual post collection page by providing the `template` field on the page's front matter.
* **`copyFiles`** (`Array`): List of files or file patterns to copy, default to:

```js
["images/**", "robot.txt", "**/*.html"]`
```

* `postcssPresetEnv` (`Object`): [PostCSS Preset Env options](https://github.com/csstools/postcss-preset-env#options), default to:

```js
{
  stage: 3,
  preserve: false
}
```

## License

[MIT](https://github.com/risan/flores/blob/master/LICENSE) © [Risan Bagja Pradana](https://bagja.net)
