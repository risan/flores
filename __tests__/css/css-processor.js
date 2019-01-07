/* global expect:false, jest:false, test:false */
const p = require("path");

const CssProcessor = require("../../src/css/css-processor");
const readFile = require("../../src/fs/read-file");
const setupPostcss = require("../../src/css/setup-postcss");
const writeToOutput = require("../../src/fs/write-to-output");

jest.mock("../../src/fs/read-file");
jest.mock("../../src/css/setup-postcss");
jest.mock("../../src/fs/write-to-output");

test("it has source, output, sourceMap, and hash properties", () => {
  const cssProcessor = new CssProcessor({
    source: "/src",
    output: "/dest",
    sourceMap: true,
    hash: true
  });

  expect(cssProcessor.source).toBe("/src");
  expect(cssProcessor.output).toBe("/dest");
  expect(cssProcessor.sourceMap).toBe(true);
  expect(cssProcessor.hash).toBe(true);
});

test("it removes baseUrl trailing slash", () => {
  const cssProcessor = new CssProcessor({
    output: "/dest",
    baseUrl: "/foo/"
  });

  expect(cssProcessor.baseUrl).toBe("/foo");
});

test("it can setup postcss processor", () => {
  setupPostcss.mockReturnValue("foo");

  const cssProcessor = new CssProcessor({
    output: "/dest",
    importPaths: ["/css"],
    presetEnvOptions: { stage: 0 },
    minify: true
  });

  expect(setupPostcss).toHaveBeenCalledWith({
    importPaths: ["/css"],
    presetEnvOptions: { stage: 0 },
    minify: true
  });

  expect(cssProcessor.postcss).toBe("foo");
});

test("it can process all css files", async () => {
  const cssProcessor = new CssProcessor({
    source: "/src",
    output: "/dest"
  });

  cssProcessor.getAllCssFiles = jest
    .fn()
    .mockReturnValue(["css/main.css", "style.css"]);

  cssProcessor.process = jest.fn().mockImplementation(path => ({
    source: path,
    output: path,
    url: `/foo/${path}`
  }));

  const results = await cssProcessor.processAll();

  expect(cssProcessor.getAllCssFiles).toHaveBeenCalled();
  expect(cssProcessor.process).toHaveBeenNthCalledWith(1, "css/main.css");
  expect(cssProcessor.process).toHaveBeenNthCalledWith(2, "style.css");

  expect(results).toEqual({
    "css/main.css": "/foo/css/main.css",
    "style.css": "/foo/style.css"
  });
});

test("it can process css file", async () => {
  const cssProcessor = new CssProcessor({
    source: "/src",
    output: "/dest"
  });

  readFile.mockReturnValue("source");
  cssProcessor.compile = jest.fn().mockReturnValue("compiled");
  writeToOutput.mockReturnValue("/dest/css/main.css");

  const result = await cssProcessor.process("css/main.css");

  expect(readFile).toHaveBeenCalledWith("/src/css/main.css");
  expect(cssProcessor.compile.mock.calls[0][0]).toBe("source");
  expect(writeToOutput.mock.calls[0][0]).toBe("compiled");

  expect(result).toEqual({
    source: "css/main.css",
    output: "css/main.css",
    url: "/css/main.css"
  });
});

test("it can get all css files", async () => {
  const cssProcessor = new CssProcessor({
    source: p.resolve(__dirname, "../fixtures/src"),
    output: "/dest"
  });

  const files = await cssProcessor.getAllCssFiles();

  expect(files).toEqual(["assets/main.css"]);
});

test("it can compile css", async () => {
  const mock = jest.fn().mockReturnValue({ css: "foo" });

  setupPostcss.mockReturnValue({ process: mock });

  const cssProcessor = new CssProcessor({
    output: "/dest"
  });

  const compile = await cssProcessor.compile("test", { from: "/foo.css" });

  expect(mock).toHaveBeenCalledWith("test", { from: "/foo.css" });
  expect(compile).toBe("foo");
});
