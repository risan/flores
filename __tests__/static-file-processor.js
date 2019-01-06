/* global expect:false, jest:false, test:false */
const copy = require("../src/fs/copy");
const globCopy = require("../src/fs/glob-copy");
const StaticFileProcessor = require("../src/static-file-processor");

jest.mock("../src/fs/copy");
jest.mock("../src/fs/glob-copy");

test("it can access patterns, source, and output properties", () => {
  const staticFileProcessor = new StaticFileProcessor({
    patterns: "**/*.html",
    source: "/src",
    output: "/dest"
  });

  expect(staticFileProcessor.patterns).toBe("**/*.html");
  expect(staticFileProcessor.source).toBe("/src");
  expect(staticFileProcessor.output).toBe("/dest");
});

test("it has default patterns value", () => {
  const staticFileProcessor = new StaticFileProcessor({
    output: "/dest"
  });

  expect(Array.isArray(staticFileProcessor.patterns)).toBe(true);
  expect(staticFileProcessor.patterns.length > 0).toBe(true);
});

test("it has default source value", () => {
  const staticFileProcessor = new StaticFileProcessor({
    output: "/dest"
  });

  expect(staticFileProcessor.source).toBe(process.cwd());
});

test("it can copy all static files", async () => {
  const staticFileProcessor = new StaticFileProcessor({
    patterns: "**/*.html",
    source: "/src",
    output: "/dest"
  });

  globCopy.mockReturnValue(["foo"]);

  const files = await staticFileProcessor.copyAll();

  expect(globCopy).toHaveBeenCalledWith("**/*.html", "/dest", { cwd: "/src" });
  expect(files).toEqual(["foo"]);
});

test("it can copy relative source file to output directory", async () => {
  const staticFileProcessor = new StaticFileProcessor({
    source: "/src",
    output: "/dest"
  });

  copy.mockReturnValue("foo");

  await staticFileProcessor.copy("./foo");

  expect(copy).toHaveBeenCalledWith("/src/foo", "/dest/foo");
});

test("it can copy absolute source file to output directory", async () => {
  const staticFileProcessor = new StaticFileProcessor({
    source: "/src",
    output: "/dest"
  });

  copy.mockReturnValue("foo");

  await staticFileProcessor.copy("/src/foo");

  expect(copy).toHaveBeenCalledWith("/src/foo", "/dest/foo");
});
