/* global expect:false, jest:false, test:false */
/* eslint no-console: "off" */
const CssProcessor = require("../src/css/css-processor");
const Config = require("../src/config");
const Processor = require("../src/processor");
const remove = require("../src/fs/remove");
const StaticFileProcessor = require("../src/static-file-processor");

jest.mock("../src/fs/remove");

test("it has config property", () => {
  const processor = new Processor();

  expect(processor.config).toBeInstanceOf(Config);
});

test("it has staticFile and css property", () => {
  const processor = new Processor();

  expect(processor.staticFile).toBeInstanceOf(StaticFileProcessor);
  expect(processor.css).toBeInstanceOf(CssProcessor);
});

test("it can receive config options parameter", () => {
  const processor = new Processor({ url: "http://foo.bar" });

  expect(processor.config.url).toBe("http://foo.bar");
});

test("it can generate the website", async () => {
  const processor = new Processor({
    output: "/dest"
  });

  processor.cleanOutputDir = jest.fn();
  processor.processCss = jest.fn();
  processor.copyStaticFiles = jest.fn();

  await processor.process();

  expect(processor.cleanOutputDir).toHaveBeenCalled();
  expect(processor.processCss).toHaveBeenCalled();
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
