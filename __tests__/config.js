/* global expect:false, test:false */
const Config = require("../src/config");

test("it can get default options", () => {
  expect(Config.defaultOptions).toMatchObject({
    watch: false,
    url: "http://localhost:4000",
    sourceDir: "src",
    outputDir: "public",
    templatesDir: "templates",
    assetsDir: "assets",
    defaultTemplate: "post.njk",
    defaultCollectionTemplate: "collection.njk"
  });

  expect(Config.defaultOptions).toHaveProperty("env");
  expect(Config.defaultOptions).toHaveProperty("basePath");
  expect(Config.defaultOptions).toHaveProperty("copyFiles");
  expect(Config.defaultOptions).toHaveProperty("markdownAnchor");
  expect(Config.defaultOptions).toHaveProperty("markdownToc");
  expect(Config.defaultOptions).toHaveProperty("postcssPresetEnv.stage");
});

test("it can merge user options with default options", () => {
  const config = new Config({
    env: "foo",
    url: "http://localhost:3000",
    sourceDir: "source"
  });

  expect(config.options).toMatchObject({
    env: "foo",
    url: "http://localhost:3000",
    sourceDir: "source",
    outputDir: "public",
    templatesDir: "templates"
  });
});

test("it has absolute paths data", () => {
  const config = new Config();

  expect(config).toHaveProperty("basePath");
  expect(config).toHaveProperty("sourcePath");
  expect(config).toHaveProperty("outputPath");
  expect(config).toHaveProperty("templatesPath");
  expect(config).toHaveProperty("assetsPath");
});

test("it has url data", () => {
  const config = new Config({
    env: "production",
    url: "https://example.com/foo"
  });

  expect(config.origin).toBe("https://example.com");
  expect(config.pathname).toBe("/foo");
});

test("url for non-production is always localhost", () => {
  const config = new Config({
    env: "development",
    url: "https://example.com/foo"
  });

  expect(config.origin).toBe("http://localhost:4000");
  expect(config.pathname).toBe("");
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

  expect(config.getUrl("foo")).toBe("https://example.com/foo");
  expect(config.getUrl("/foo")).toBe("https://example.com/foo");
  expect(config.getUrl("foo/")).toBe("https://example.com/foo/");
  expect(config.getUrl("/foo/")).toBe("https://example.com/foo/");

  config = new Config({
    env: "production",
    url: "https://example.com/foo"
  });

  expect(config.getUrl("/bar")).toBe("https://example.com/foo/bar");
  expect(config.getUrl("/bar/")).toBe("https://example.com/foo/bar/");
});

test("it can generate relative url", () => {
  let config = new Config({
    env: "production",
    url: "https://example.com"
  });

  expect(config.getRelativeUrl("foo")).toBe("/foo");
  expect(config.getRelativeUrl("/foo")).toBe("/foo");
  expect(config.getRelativeUrl("foo/")).toBe("/foo/");
  expect(config.getRelativeUrl("/foo/")).toBe("/foo/");

  config = new Config({
    env: "production",
    url: "https://example.com/foo"
  });

  expect(config.getRelativeUrl("/bar")).toBe("/foo/bar");
  expect(config.getRelativeUrl("/bar/")).toBe("/foo/bar/");
});

test("it can check if it's a production", () => {
  let config = new Config({ env: "production" });
  expect(config.isProduction()).toBe(true);

  config = new Config({ env: "development" });
  expect(config.isProduction()).toBe(false);
});
