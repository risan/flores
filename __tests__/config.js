/* global expect:false, test:false */
const Config = require("../src/config");
const UrlGenerator = require("../src/url-generator");

test("it can get default options", () => {
  expect(Config.defaultOptions).toMatchObject({
    watch: false,
    url: "http://localhost:4000/",
    cwd: process.cwd(),
    verbose: true,
    source: "src",
    output: "public",
    templatesDir: "templates",
    defaultDateFormat: "YYYY-MM-DD HH:mm:ss",
    defaultTemplate: "post.njk"
  });

  expect(Config.defaultOptions).toHaveProperty("env");
  expect(Config.defaultOptions).toHaveProperty("copyFiles");
  expect(Config.defaultOptions).toHaveProperty("markdown");
  expect(Config.defaultOptions).toHaveProperty("markdownAnchor");
  expect(Config.defaultOptions).toHaveProperty("markdownToc");
  expect(Config.defaultOptions).toHaveProperty("postcssPresetEnv.stage");
});

test("it can merge user options with default options", () => {
  const config = new Config({
    env: "foo",
    url: "http://localhost:3000/",
    source: "bar"
  });

  expect(config.options).toMatchObject({
    env: "foo",
    url: "http://localhost:3000/",
    source: "bar",
    output: "public",
    templatesDir: "templates"
  });
});

test("it resolves relative source, output, and templates to absolute paths", () => {
  let config = new Config({
    cwd: "/foo"
  });

  expect(config.source).toBe("/foo/src");
  expect(config.output).toBe("/foo/public");
  expect(config.templatesPath).toBe("/foo/src/templates");

  config = new Config({
    cwd: "/foo",
    source: "my-source",
    output: "my-output",
    templatesDir: "my-templates"
  });

  expect(config.source).toBe("/foo/my-source");
  expect(config.output).toBe("/foo/my-output");
  expect(config.templatesPath).toBe("/foo/my-source/my-templates");
});

test("it keeps absolute source and output paths", () => {
  const config = new Config({
    cwd: "/foo",
    source: "/bar/source",
    output: "/baz/output"
  });

  expect(config.source).toBe("/bar/source");
  expect(config.output).toBe("/baz/output");
  expect(config.templatesPath).toBe("/bar/source/templates");
});

test("url for non-production is always localhost", () => {
  const config = new Config({
    env: "development",
    url: "https://example.com/foo/bar/"
  });

  expect(config.url.toString()).toBe("http://localhost:4000/");
});

test("it can override default port number", () => {
  const config = new Config({
    env: "development",
    url: "http://localhost:3000"
  });

  expect(config.url.toString()).toBe("http://localhost:3000/");
});

test("it uses http protocol if non is set", () => {
  const config = new Config({
    env: "production",
    url: "example.com"
  });

  expect(config.url.toString()).toBe("http://example.com/");
});

test("it has urlGenerator property", () => {
  const config = new Config({
    env: "production",
    url: "http://example.com/"
  });

  expect(config.urlGenerator).toBeInstanceOf(UrlGenerator);
  expect(config.urlGenerator.toString()).toBe("http://example.com/");
});

test("it can check if it's on a production environment", () => {
  let config = new Config({ env: "production" });
  expect(config.isProduction()).toBe(true);

  config = new Config({ env: "development" });
  expect(config.isProduction()).toBe(false);
});
