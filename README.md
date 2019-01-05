# Flores

[![Build Status](https://badgen.net/travis/risan/flores)](https://travis-ci.org/risan/flores)
[![Test Covarage](https://badgen.net/codecov/c/github/risan/flores)](https://codecov.io/gh/risan/flores)
[![Greenkeeper](https://badges.greenkeeper.io/risan/flores.svg)](https://greenkeeper.io)
[![Latest Version](https://badgen.net/npm/v/flores)](https://www.npmjs.com/package/flores)

Minimalist static site generator.

## Features

* Fast markdown parser with [GFM](https://github.github.com/gfm/) syntax using [`markdown-it`](https://github.com/markdown-it/markdown-it).
* Create a website theme with rich and powerful [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine.
* Write modern CSS with [PostCSS](https://postcss.org/) and [`postcss-preset-env`](https://preset-env.cssdb.org/).
* Syntax highlighting using [highlight.js](https://highlightjs.org/).
* Automatically generates table of contents using [`markdown-it-table-of-contents`](https://github.com/Oktavilla/markdown-it-table-of-contents).
* Automatic sitemap generation using [`sitemap.js`](https://github.com/ekalinin/sitemap.js).
* Built-in web server for previewing your generated website using [express](https://expressjs.com/).
* Development server with file watcher that are able to regenerate the website and reload the browser automatically.

## Getting Started

### 1. Download the Starter Template

Run the following command on your terminal to download [Flores starter template](https://github.com/risan/flores-starter).

```bash
$ wget https://github.com/risan/flores-starter/archive/master.zip \
    -O master.zip && \
    unzip master.zip && \
    mv flores-starter-master my-blog && \
    rm master.zip
```

It will automatically download the starter template and unzip it to `my-blog` directory.

Or you can also [download the starter template](https://github.com/risan/flores-starter/archive/master.zip) and unzip it manually.

### 2. Install All Dependencies

Within your project directory, run the following command to install all dependencies:

```bash
$ npm install
```

### 3. Generate the Website

Run the following command to generate your website for production:

```bash
$ npm run build
```

For development purpose, you can preview your generated website with the built-in server:

```bash
$ npm run serve
```

Flores also comes with file watcher that can rebuild your website and reload the browser automatically:

```bash
$ npm run build
```

## Guide

### Directory Structures Overview

By default Flores project has the following directory structures.

```txt
|- src/
|  |- assets/
|  |- templates/
|  |  |- collection.njk
|  |  |- post.njk
|  |
|  |- category-1/
|  |  |- foo.md
|  |
|  |- category-2
|  |  |- bar.md
|  |
|  |- baz.md
|
|- public/
|- site.config.js
```

* `/src`: This is where your website data resides (markdown files, css files, templates, images, etc).
* `/assets`: This is where you store your CSS files.
* `/templates`: This is where you store your template files.

* `/category-1` and `/category-2`: Store your markdown file within a directory to create a hierarchical category. The URL for your post will follow the markdown file location:

  ```txt
  /src/category-1/foo.md => /category-1/foo.html
  /src/category-2/bar.md => /category-2/bar.html
  /src/baz.md => /baz.html
  ```

* `/public`: This is where the generated website will be stored.
* `site.config.js`: The configuration file.

### Available Commands

There are three available commands: `build`, `serve`, and `watch`.

#### `build`

Run the `build` command to generate the website for production. By default the website will be stored in `/public` directory.

```bash
$ npm run build
```

#### `serve`

Run the `serve` command to preview your generate website. This command will generate the website and start the built-in [Express](https://expressjs.com/) server. By default your website will be served on [localhost:4000](http://localhost:4000).

```bash
$ npm run serve
```

#### `watch`

Run the `watch` command to start the development server and the file watcher feature. It can regenerate the website and reload the browser automatically on file changes.

```bash
$ npm run watch
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
* [flores-starter](https://github.com/risan/flores-starter): Flores starter template for blog.

## License

[MIT](https://github.com/risan/flores/blob/master/LICENSE) © [Risan Bagja Pradana](https://bagja.net)
