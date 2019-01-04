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

## Features

* Fast markdown parser with [GFM](https://github.github.com/gfm/) syntax using [`markdown-it`](https://github.com/markdown-it/markdown-it).
* Create a website theme with rich and powerful [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine.
* Write modern CSS with [PostCSS](https://postcss.org/) and [`postcss-preset-env`](https://preset-env.cssdb.org/).
* Syntax highlighting using [highlight.js](https://highlightjs.org/).
* Automatically generates table of contents using [`markdown-it-table-of-contents`](https://github.com/Oktavilla/markdown-it-table-of-contents).
* Automatic sitemap generation using [`sitemap.js`](https://github.com/ekalinin/sitemap.js).
* Built-in web server for previewing your generated website using [express](https://expressjs.com/).
* Development server with file watcher that are able to regenerate the website and reload the browser automatically.

## API

### `flores.build`

Generate the website.

```js
flores.build([options])
```

#### Parameters

* `options` (`Object`): The [configuration options](#configuration-options).

### `flores.serve`

Generate the website and serve it over the built-in [Express](https://expressjs.com/) server.

```js
flores.serve([options])
```

#### Parameters

* `options` (`Object`): The [configuration options](#configuration-options).

### `flores.watch`

Generate the website and start the built-in [Express](https://expressjs.com/) server. It will also start the file watcher. On file changes, it will automatically regenerate the website and reload the browser.

```js
flores.watch([options])
```

#### Parameters

* `options` (`Object`): The [configuration options](#configuration-options).

### Configuration Options

Configuration options is an optional `Object` that you can pass to `build`, `serve`, or `watch` function.

* **`env`** (`String`): The environment name, default to `process.env.NODE_ENV`. If the `NODE_ENV` environment variable is not set, `production` will be set. Note that for `serve` and `watch` methods, the `env` value will always be set to `development`. When it's set to `production`, the generated HTML and CSS files will be minified.
* **`url`** (`String`): The website URL, default to `http://localhost:4000`. Set the correct pathname if you don't serve the website on the root directory—like Github pages for repository (e.g. `http://example.com/blog`). For `serve` and `watch`, the hostname will always be set `localhost` and pathname will always be empty.
* **`basePath`** (`String`): The base path of your website project directory, default to the current working directory `process.cwd()`.
* **`sourceDir`** (`String`): The directory for the website source relative to the `basePath`, default to `src`.
* **`outputDir`** (`String`): The directory where the generated website will be stored relative to the `basePath`, default to `public`,
* **`templatesDir`** (`String`): The templates directory relative to the `sourceDir`, default to `templates`.
* **`assetsDir`** (`String`): The CSS assets directory relative to the `sourceDir`, default to `assets`.
* **`defaultDateFormat`** (`String`): The default date format to use, when using `dateFormat` filter, default to `YYYY-MM-DD HH:mm:ss`. Check [date-fns `format()` documentation](https://date-fns.org/docs/format) for all accepted format.
* **`defaultTemplate`** (`String`): The default template name for the markdown post, default to `post.njk`. You can override the template for individual post by providing the `template` field on the post's front matter.
* **`defaultCollectionTemplate`** (`String`): The default template name for the markdown post collection page, default to `collection.njk`. You can override the template for individual post collection page by providing the `template` field on the page's front matter.
* **`copyFiles`** (`Array`): List of files or file patterns to copy, default to:

  ```js
  ["images/**", "robot.txt", "**/*.html"]`
  ```

* **`markdownAnchor`** (`Object`): The [`markdown-it-anchor` plugin options](https://github.com/valeriangalliat/markdown-it-anchor#usage), default to:

  ```js
  {
    permalink: true
  }
  ```

* **`markdownToc`** (`Object`): The [`markdown-it-table-of-contents` plugin options](https://github.com/Oktavilla/markdown-it-table-of-contents#options), default to:

  ```js
  {
    containerHeaderHtml: "<h2>Table of Contents</h2>",
    includeLevel: [2, 3, 4]
  }
  ```

* `postcssPresetEnv` (`Object`): [PostCSS Preset Env options](https://github.com/csstools/postcss-preset-env#options), default to:

  ```js
  {
    stage: 3,
    preserve: false
  }
  ```

## Related

* [flores-cli](https://github.com/risan/flores-cli): The CLI tool for this module.

## License

[MIT](https://github.com/risan/flores/blob/master/LICENSE) © [Risan Bagja Pradana](https://bagja.net)
