/* global expect:false, jest:false, test:false */
/* eslint no-console: "off" */
const CssProcessor = require("../src/css/css-processor");
const Config = require("../src/config");
const MarkdownProcessor = require("../src/markdown/markdown-processor");
const Processor = require("../src/processor");
const remove = require("../src/fs/remove");
const Renderer = require("../src/renderer");
const StaticFileProcessor = require("../src/static-file-processor");

jest.mock("../src/fs/remove");

test("it has config, renderer, css, markdown, and staticFile properties", () => {
  const processor = new Processor();

  expect(processor.config).toBeInstanceOf(Config);
  expect(processor.renderer).toBeInstanceOf(Renderer);
  expect(processor.css).toBeInstanceOf(CssProcessor);
  expect(processor.markdown).toBeInstanceOf(MarkdownProcessor);
  expect(processor.staticFile).toBeInstanceOf(StaticFileProcessor);
});

test("it can receive config options parameter", () => {
  const processor = new Processor({
    env: "production",
    url: "http://foo.bar"
  });

  expect(processor.config.env).toBe("production");
  expect(processor.config.url.toString()).toBe("http://foo.bar/");
});

test("it set renderer's minify option to true on production", () => {
  const processor = new Processor({ env: "production" });

  expect(processor.renderer.minify).toBe(true);
});

test("it adds config data to renderer", () => {
  const processor = new Processor({ env: "production" });

  expect(processor.renderer.getGlobal("config")).toBeInstanceOf(Config);
});

test("it adds formatDate filter to renderer", () => {
  const processor = new Processor({ env: "production" });

  const formatDate = processor.renderer.env.getFilter("formatDate");

  expect(formatDate).toBeInstanceOf(Function);
  expect(formatDate(new Date("2018-08-01T12:00:00+00:00"), "DD MMM YYYY")).toBe(
    "01 Aug 2018"
  );
});

test("it can generate the website", async () => {
  const processor = new Processor({
    output: "/dest"
  });

  processor.cleanOutputDir = jest.fn();
  processor.processCss = jest.fn();
  processor.processMarkdown = jest.fn();
  processor.copyStaticFiles = jest.fn();

  await processor.process();

  expect(processor.cleanOutputDir).toHaveBeenCalled();
  expect(processor.processCss).toHaveBeenCalled();
  expect(processor.processMarkdown).toHaveBeenCalled();
  expect(processor.copyStaticFiles).toHaveBeenCalled();
});

test("it can remove output directory", async () => {
  const processor = new Processor({
    output: "/foo"
  });

  await processor.cleanOutputDir();

  expect(remove).toHaveBeenCalledWith("/foo");
});

test("it can process css files", async () => {
  const processor = new Processor();

  processor.css.processAll = jest
    .fn()
    .mockReturnValue({ "main.css": "main.123.css" });

  const assets = await processor.processCss();

  expect(processor.css.processAll).toHaveBeenCalled();
  expect(assets).toEqual({ "main.css": "main.123.css" });
});

test("it can process markdown files", async () => {
  const processor = new Processor();

  processor.markdown.processAll = jest.fn().mockReturnValue({
    posts: ["post1", "post2"],
    pages: ["page1"],
    collections: { foo: ["bar"] }
  });

  const data = await processor.processMarkdown();

  expect(processor.markdown.processAll).toHaveBeenCalled();
  expect(data).toEqual({
    posts: ["post1", "post2"],
    pages: ["page1"],
    collections: { foo: ["bar"] }
  });
});

test("it can copy static files", async () => {
  const processor = new Processor();

  processor.staticFile.copyAll = jest.fn().mockReturnValue(["foo"]);

  const files = await processor.copyStaticFiles();

  expect(processor.staticFile.copyAll).toHaveBeenCalled();
  expect(files).toEqual(["foo"]);
});

test("it can log message", () => {
  const processor = new Processor();

  console.log = jest.fn();

  processor.log("foo");

  expect(console.log).toHaveBeenCalledWith("foo");
});

test("it won't log message if verbose set to false", () => {
  const processor = new Processor({ verbose: false });

  console.log = jest.fn();

  processor.log("foo");

  expect(console.log).toHaveBeenCalledTimes(0);
});
