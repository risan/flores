/* global expect:false, test:false */
const Config = require("../src/config");

test("it can get default options", () => {
  expect(Config.defaultOptions).toMatchObject({
    watch: false,
    url: "http://localhost:4000",
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
    url: "http://localhost:3000",
    source: "bar"
  });

  expect(config.options).toMatchObject({
    env: "foo",
    url: "http://localhost:3000",
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

test("it has url origin property", () => {
  let config = new Config({
    env: "production",
    url: "https://example.com"
  });

  expect(config.origin).toBe("https://example.com");

  config = new Config({
    env: "production",
    url: "https://example.com/foo/bar"
  });

  expect(config.origin).toBe("https://example.com");
});

test("it has url pathname property", () => {
  let config = new Config({
    env: "production",
    url: "https://example.com"
  });

  expect(config.pathname).toBe("/");

  config = new Config({
    env: "production",
    url: "https://example.com/"
  });

  expect(config.pathname).toBe("/");

  config = new Config({
    env: "production",
    url: "https://example.com/foo"
  });

  expect(config.pathname).toBe("/foo/");

  config = new Config({
    env: "production",
    url: "https://example.com/foo/bar/"
  });

  expect(config.pathname).toBe("/foo/bar/");
});

test("url for non-production is always localhost", () => {
  const config = new Config({
    env: "development",
    url: "https://example.com/foo/bar/"
  });

  expect(config.origin).toBe("http://localhost:4000");
  expect(config.pathname).toBe("/");
  expect(config.port).toBe(4000);
});

test("it can override default port number", () => {
  const config = new Config({
    env: "development",
    url: "http://localhost:3000"
  });

  expect(config.origin).toBe("http://localhost:3000");
  expect(config.port).toBe(3000);
});

test("it uses http protocol if non is set", () => {
  const config = new Config({
    env: "production",
    url: "example.com"
  });

  expect(config.origin).toBe("http://example.com");
});

test("it can generate absolute url", () => {
  let config = new Config({
    env: "production",
    url: "https://example.com"
  });

  expect(config.getUrl("/")).toBe("https://example.com/");
  expect(config.getUrl("foo")).toBe("https://example.com/foo");
  expect(config.getUrl("/foo")).toBe("https://example.com/foo");
  expect(config.getUrl("foo/")).toBe("https://example.com/foo/");
  expect(config.getUrl("/foo/")).toBe("https://example.com/foo/");

  config = new Config({
    env: "production",
    url: "https://example.com/foo"
  });

  expect(config.getUrl("/")).toBe("https://example.com/foo/");
  expect(config.getUrl("/bar")).toBe("https://example.com/foo/bar");
  expect(config.getUrl("/bar/")).toBe("https://example.com/foo/bar/");
});

test("it can generate relative url", () => {
  let config = new Config({
    env: "production",
    url: "https://example.com"
  });

  expect(config.getRelativeUrl("/")).toBe("/");
  expect(config.getRelativeUrl("foo")).toBe("/foo");
  expect(config.getRelativeUrl("/foo")).toBe("/foo");
  expect(config.getRelativeUrl("foo/")).toBe("/foo/");
  expect(config.getRelativeUrl("/foo/")).toBe("/foo/");

  config = new Config({
    env: "production",
    url: "https://example.com/foo"
  });

  expect(config.getRelativeUrl("/")).toBe("/foo/");
  expect(config.getRelativeUrl("/bar")).toBe("/foo/bar");
  expect(config.getRelativeUrl("/bar/")).toBe("/foo/bar/");
});

test("it can check if it's on a production environment", () => {
  let config = new Config({ env: "production" });
  expect(config.isProduction()).toBe(true);

  config = new Config({ env: "development" });
  expect(config.isProduction()).toBe(false);
});
